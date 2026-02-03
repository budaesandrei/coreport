from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class ReportPackageCreate(BaseModel):
    name: str
    entity_type: str = "property"


class ReportPackageOut(ItemBase):
    name: str
    entity_type: str
