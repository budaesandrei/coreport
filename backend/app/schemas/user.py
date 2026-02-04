from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class UserCreate(BaseModel):
    user_name: str
    role: str = "VIEWER"


class AdminUserCreateIn(BaseModel):
    email: str
    password: str | None = None
    role: str = "VIEWER"


class AdminUserCreateOut(BaseModel):
    email: str
    role: str
    email_sent: bool
    email_debug: dict | None = None


class UserOut(ItemBase):
    user_name: str
    role: str
