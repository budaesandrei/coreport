from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class OrgCreate(BaseModel):
    name: str


class OrgOut(ItemBase):
    name: str
