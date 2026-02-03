from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Core
    ENV: str = Field(default="dev")
    DATABASE_URL: str
    CORS_ORIGINS: str = Field(default="http://localhost:3000")

    # OpenAI (mapping)
    OPENAI_API_KEY: str | None = Field(default=None)
    OPENAI_MODEL: str = Field(default="gpt-4o-mini")
    STORE_LLM_TRACES: bool = Field(default=False)

    # Storage
    FILE_STORAGE_PATH: str = Field(default="/tmp/coreport-storage")
    SIGNED_URL_SECRET: str | None = Field(default=None)

    # Auth (local dev)
    JWT_SECRET: str = Field(default="dev-jwt-secret-change-me")
    JWT_EXPIRES_MINUTES: int = Field(default=60 * 24)

    # Email (local dev via MailHog)
    SMTP_HOST: str = Field(default="mailhog")
    SMTP_PORT: int = Field(default=1025)
    SMTP_FROM: str = Field(default="no-reply@coreport.local")

    # Legacy invitation settings (back-compat)
    INVITATION_TOKEN_SECRET: str = Field(default="dev-invite-secret-change-me")
    APP_DOMAIN_URL: str = Field(default="http://localhost:3000")
    EMAIL: str = Field(default="no-reply@coreport.local")


settings = Settings()


# Back-compat for imported legacy code from coreport-project.
# We'll remove this once the legacy modules are fully migrated to the new config style.

def get_settings() -> Settings:  # pragma: no cover
    return settings
