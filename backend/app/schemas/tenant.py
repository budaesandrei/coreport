from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class TenantCreate(BaseModel):
    name: str


class TenantOut(ItemBase):
    name: str
