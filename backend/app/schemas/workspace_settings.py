from __future__ import annotations

from pydantic import BaseModel, Field


class WorkspaceSettingsOut(BaseModel):
    canonical_data_language: str = Field(default="en", description="ISO language code (e.g. en, ro)")


class WorkspaceSettingsUpdateIn(BaseModel):
    canonical_data_language: str = Field(..., min_length=2, max_length=16)
