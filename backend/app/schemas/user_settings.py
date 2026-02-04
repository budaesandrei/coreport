from __future__ import annotations

from pydantic import BaseModel, Field


class UserSettingsOut(BaseModel):
    ui_language: str = Field(default="en", description="UI language (ISO code, e.g. en, ro)")


class UserSettingsUpdateIn(BaseModel):
    ui_language: str = Field(..., min_length=2, max_length=16)
