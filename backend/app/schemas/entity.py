from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class EntityCreate(BaseModel):
    name: str
    entity_type: str = "property"
    org_id: int | None = None
    external_id: str | None = None


class EntityOut(ItemBase):
    name: str
    entity_type: str
    org_id: int | None
    external_id: str | None
