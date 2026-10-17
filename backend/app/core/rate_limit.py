"""
NadaVerse Production Rate Limiter Middleware
Implements sliding-window rate limiting to defend against:
1. Credential stuffing / brute-force on /auth/login and /auth/register
2. Automated scraping / resource exhaustion on /tutor/messages and /tutor/stream

Security Features:
- Rejects spoofed X-Forwarded-For headers unless immediate peer is a configured trusted proxy.
- Redis-backed sliding window with unique item tokens to prevent timestamp-collision undercounting.
- Failover safety: If Redis throws an error or disconnects, automatically falls back to in-memory limiting (never removes protection).
- Memory bounds: In-memory limiter purges expired entries to prevent unbounded memory growth.
"""

import time
import uuid
import asyncio
from typing import Dict, List, Tuple, Optional
from collections import defaultdict
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.security import decode_access_token


class InMemoryRateLimiter:
    def __init__(self, max_tracked_keys: int = 10000):
        # Maps key -> list of timestamp floats
        self._history: Dict[str, List[float]] = defaultdict(list)
        self._max_tracked_keys = max_tracked_keys
        self._last_cleanup = time.time()
        self._lock = asyncio.Lock()

    async def is_allowed(self, key: str, max_requests: int, window_seconds: int = 60) -> Tuple[bool, int, int]:
        """
        Returns (is_allowed, remaining_quota, retry_after_seconds)
        """
        async with self._lock:
            now = time.time()
            window_start = now - window_seconds

            # Periodic cleanup of expired entries every 60 seconds
            if now - self._last_cleanup > 60:
                self._cleanup_expired(window_start)
                self._last_cleanup = now

            # Filter timestamps within current sliding window
            self._history[key] = [t for t in self._history[key] if t > window_start]
            current_count = len(self._history[key])

            if current_count >= max_requests:
                earliest_t = self._history[key][0] if self._history[key] else now
                retry_after = int(window_seconds - (now - earliest_t)) + 1
                return False, 0, max(retry_after, 1)

            self._history[key].append(now)
            remaining = max_requests - (current_count + 1)
            return True, max(0, remaining), 0

    def _cleanup_expired(self, window_start: float):
        keys_to_delete = []
        for k, timestamps in self._history.items():
            valid = [t for t in timestamps if t > window_start]
            if not valid:
                keys_to_delete.append(k)
            else:
                self._history[k] = valid

        for k in keys_to_delete:
            del self._history[k]

        # Enforce hard upper bound on tracked keys
        if len(self._history) > self._max_tracked_keys:
            # Remove oldest items
            sorted_keys = sorted(self._history.keys(), key=lambda k: self._history[k][-1] if self._history[k] else 0)
            for k in sorted_keys[: len(self._history) - self._max_tracked_keys]:
                del self._history[k]


class RedisRateLimiter:
    """
    Redis-backed sliding window rate limiter using sorted sets (ZSET).
    Uses unique UUID suffixes on timestamps to eliminate collision undercounting.
    """
    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self._client = None
        try:
            import redis.asyncio as aioredis
            self._client = aioredis.from_url(redis_url, encoding="utf-8", decode_responses=True)
        except Exception:
            self._client = None

    async def is_allowed(self, key: str, max_requests: int, window_seconds: int = 60) -> Tuple[bool, int, int]:
        if not self._client:
            # Fall back to in-memory
            return await in_memory_limiter.is_allowed(key, max_requests, window_seconds)

        try:
            now = time.time()
            window_start = now - window_seconds
            # Unique member token prevents timestamp collisions when multiple requests occur within same microsecond
            unique_member = f"{now}:{uuid.uuid4().hex[:8]}"

            pipe = self._client.pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zcard(key)
            pipe.zadd(key, {unique_member: now})
            pipe.expire(key, window_seconds + 5)
            results = await pipe.execute()
            
            count = results[1]
            if count >= max_requests:
                # Remove the newly added request since it exceeds limit
                await self._client.zrem(key, unique_member)
                return False, 0, window_seconds
            return True, max(0, max_requests - count - 1), 0
        except Exception:
            # Safe failover to in-memory rate limiter
            return await in_memory_limiter.is_allowed(key, max_requests, window_seconds)


in_memory_limiter = InMemoryRateLimiter()
redis_limiter: Optional[RedisRateLimiter] = (
    RedisRateLimiter(settings.REDIS_URL) if settings.REDIS_URL else None
)


def resolve_client_identifier(request: Request) -> str:
    """
    Resolves client IP securely.
    Arbitrary X-Forwarded-For is IGNORED unless the immediate peer
    is a recognized trusted proxy (e.g., Vercel, Render, or reverse proxy).
    """
    peer_ip = request.client.host if request.client else "127.0.0.1"

    is_trusted_proxy = (
        peer_ip in settings.TRUSTED_PROXIES
        or peer_ip in ("127.0.0.1", "::1", "localhost")
    )

    if is_trusted_proxy:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            # Take client IP from the forwarded chain
            parts = [p.strip() for p in forwarded_for.split(",") if p.strip()]
            if parts:
                return parts[0]

    return peer_ip


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Identify target route
        is_auth = path.startswith("/api/v1/auth/login") or path.startswith("/api/v1/auth/register")
        is_tutor = path.startswith("/api/v1/tutor/messages") or path.startswith("/api/v1/tutor/stream")

        if not (is_auth or is_tutor):
            return await call_next(request)

        client_ip = resolve_client_identifier(request)

        # Check if user is authenticated (prevents IP-rotation bypass by logged-in users)
        auth_header = request.headers.get("authorization", "")
        account_id = None
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            account_id = decode_access_token(token)

        key_suffix = f"user:{account_id}" if account_id else f"ip:{client_ip}"
        rate_limit_info = None

        # 1. Rate limit Auth endpoints (Login / Register)
        if is_auth:
            key = f"rl:auth:{key_suffix}"
            max_req = settings.RATE_LIMIT_AUTH_PER_MINUTE
            limiter = redis_limiter or in_memory_limiter
            allowed, remaining, retry_after = await limiter.is_allowed(key, max_req, 60)
            rate_limit_info = (max_req, remaining)

            if not allowed:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": f"Too many authentication attempts. Please wait {retry_after} seconds before trying again."
                    },
                    headers={
                        "Retry-After": str(retry_after),
                        "X-RateLimit-Limit": str(max_req),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": str(retry_after)
                    }
                )

        # 2. Rate limit AI Tutor messages & stream
        elif is_tutor:
            key = f"rl:tutor:{key_suffix}"
            max_req = settings.RATE_LIMIT_TUTOR_PER_MINUTE
            limiter = redis_limiter or in_memory_limiter
            allowed, remaining, retry_after = await limiter.is_allowed(key, max_req, 60)
            rate_limit_info = (max_req, remaining)

            if not allowed:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": f"AI Tutor query limit reached. Please wait {retry_after} seconds to resume your inquiry."
                    },
                    headers={
                        "Retry-After": str(retry_after),
                        "X-RateLimit-Limit": str(max_req),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": str(retry_after)
                    }
                )

        response = await call_next(request)
        if rate_limit_info:
            max_req, remaining = rate_limit_info
            response.headers["X-RateLimit-Limit"] = str(max_req)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response
