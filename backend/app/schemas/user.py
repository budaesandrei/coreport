from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class UserCreate(BaseModel):
    user_name: str
    role: str = "VIEWER"
    org_id: int | None = None


class UserOut(ItemBase):
    user_name: str
    role: str
    org_id: int | None
