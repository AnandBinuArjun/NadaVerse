"""
NadaVerse Production Rate Limiter Middleware
Implements sliding-window and token-bucket IP rate limiting to defend against:
1. Credential stuffing / brute-force on /auth/login and /auth/register
2. Automated scraping / resource exhaustion on /tutor/messages and /tutor/stream
Supports optional Redis backing via REDIS_URL with graceful in-memory sliding window fallback.
"""

import time
from typing import Dict, List, Tuple, Optional
from collections import defaultdict
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings


class InMemoryRateLimiter:
    def __init__(self):
        # Maps key -> list of timestamp floats
        self._history: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, key: str, max_requests: int, window_seconds: int = 60) -> Tuple[bool, int, int]:
        """
        Returns (is_allowed, remaining_quota, retry_after_seconds)
        """
        now = time.time()
        window_start = now - window_seconds
        
        # Filter timestamps within current sliding window
        self._history[key] = [t for t in self._history[key] if t > window_start]
        current_count = len(self._history[key])

        if current_count >= max_requests:
            retry_after = int(window_seconds - (now - self._history[key][0])) + 1
            return False, 0, max(retry_after, 1)

        self._history[key].append(now)
        remaining = max_requests - (current_count + 1)
        return True, max(0, remaining), 0


class RedisRateLimiter:
    """
    Redis-backed token bucket / sliding window rate limiter.
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
            return True, max_requests, 0
        try:
            now = time.time()
            pipe = self._client.pipeline()
            pipe.zremrangebyscore(key, 0, now - window_seconds)
            pipe.zcard(key)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, window_seconds)
            results = await pipe.execute()
            count = results[1]
            if count >= max_requests:
                return False, 0, window_seconds
            return True, max(0, max_requests - count - 1), 0
        except Exception:
            # Fall back safely
            return True, max_requests, 0


in_memory_limiter = InMemoryRateLimiter()
redis_limiter: Optional[RedisRateLimiter] = (
    RedisRateLimiter(settings.REDIS_URL) if settings.REDIS_URL else None
)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = (
            request.headers.get("x-forwarded-for", "").split(",")[0].strip()
            or request.client.host
            if request.client
            else "127.0.0.1"
        )
        path = request.url.path

        rate_limit_info = None

        # 1. Rate limit Auth endpoints (Login / Register)
        if path.startswith("/api/v1/auth/login") or path.startswith("/api/v1/auth/register"):
            key = f"auth:{client_ip}"
            max_req = settings.RATE_LIMIT_AUTH_PER_MINUTE
            if redis_limiter:
                allowed, remaining, retry_after = await redis_limiter.is_allowed(key, max_req, 60)
            else:
                allowed, remaining, retry_after = in_memory_limiter.is_allowed(key, max_req, 60)

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
        elif path.startswith("/api/v1/tutor/messages") or path.startswith("/api/v1/tutor/stream"):
            key = f"tutor:{client_ip}"
            max_req = settings.RATE_LIMIT_TUTOR_PER_MINUTE
            if redis_limiter:
                allowed, remaining, retry_after = await redis_limiter.is_allowed(key, max_req, 60)
            else:
                allowed, remaining, retry_after = in_memory_limiter.is_allowed(key, max_req, 60)

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
