from __future__ import annotations

from pydantic import BaseModel


class ApprovalDecision(BaseModel):
    comment: str | None = None
