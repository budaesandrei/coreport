from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENV: str = Field(default="dev")
    DATABASE_URL: str
    CORS_ORIGINS: str = Field(default="http://localhost:3000")

    OPENAI_API_KEY: str | None = Field(default=None)
    OPENAI_MODEL: str = Field(default="gpt-4o-mini")
    STORE_LLM_TRACES: bool = Field(default=False)

    FILE_STORAGE_PATH: str = Field(default="/tmp/coreport-storage")
    SIGNED_URL_SECRET: str | None = Field(default=None)

    # Auth (local dev)
    JWT_SECRET: str = Field(default="dev-jwt-secret-change-me")
    JWT_EXPIRES_MINUTES: int = Field(default=60 * 24)

    # Email (local dev via MailHog)
    SMTP_HOST: str = Field(default="mailhog")
    SMTP_PORT: int = Field(default=1025)
    SMTP_FROM: str = Field(default="no-reply@coreport.local")


settings = Settings()
