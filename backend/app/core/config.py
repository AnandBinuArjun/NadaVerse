import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "NadaVerse API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    API_V1_PREFIX: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nadaverse_dev_secret_key_change_in_production_32bytes_min")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./nadaverse.db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # AI Gateway
    AI_GATEWAY_PROVIDER: str = os.getenv("AI_GATEWAY_PROVIDER", "mock")
    AI_GATEWAY_API_KEY: str = os.getenv("AI_GATEWAY_API_KEY", "")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
