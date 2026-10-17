import json
import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "NadaVerse API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "false" if os.getenv("APP_ENV") == "production" else "true").lower() == "true"
    API_V1_PREFIX: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nadaverse_dev_secret_key_change_in_production_32bytes_min")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    @field_validator("SECRET_KEY", mode="after")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        env = os.getenv("APP_ENV", "development").lower()
        if env == "production":
            dev_default = "nadaverse_dev_secret_key_change_in_production_32bytes_min"
            if v == dev_default or len(v) < 32:
                raise ValueError(
                    "Production security violation: SECRET_KEY must be set to a cryptographically secure "
                    "secret of at least 32 bytes / 64 hex characters (e.g. generated via 'openssl rand -hex 32' "
                    "or 'python -c \"import secrets; print(secrets.token_hex(32))\"')."
                )
        return v
    
    # Database (auto-normalizes postgres:// and postgresql:// to postgresql+asyncpg://)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./nadaverse.db")

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def assemble_database_url(cls, v: str) -> str:
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        if v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    # CORS (Strict production domain whitelist)
    CORS_ORIGINS: Union[str, List[str]] = (
        ["https://nadaverse.abarjun.online"]
        if os.getenv("APP_ENV") == "production"
        else [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://nadaverse.abarjun.online",
        ]
    )

    @field_validator("CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    # Rate Limiting & Trusted Proxies
    RATE_LIMIT_AUTH_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_AUTH_PER_MINUTE", "10"))
    RATE_LIMIT_TUTOR_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_TUTOR_PER_MINUTE", "30"))
    REDIS_URL: Union[str, None] = os.getenv("REDIS_URL", None)
    TRUSTED_PROXIES: Union[str, List[str]] = os.getenv("TRUSTED_PROXIES", "127.0.0.1,::1")

    @field_validator("TRUSTED_PROXIES", mode="after")
    @classmethod
    def assemble_trusted_proxies(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [proxy.strip() for proxy in v.split(",") if proxy.strip()]
        return v

    # AI Gateway
    AI_GATEWAY_PROVIDER: str = os.getenv("AI_GATEWAY_PROVIDER", "gemini") # "gemini", "mock", "openai"
    AI_GATEWAY_API_KEY: str = os.getenv("GEMINI_API_KEY") or os.getenv("AI_GATEWAY_API_KEY", "")

    # Monitoring
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

