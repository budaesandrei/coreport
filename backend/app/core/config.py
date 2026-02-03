from __future__ import annotations

from pydantic import AnyHttpUrl, Field
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
    SIGNED_URL_SECRET: str = Field(default="dev-secret-change-me")


settings = Settings()
