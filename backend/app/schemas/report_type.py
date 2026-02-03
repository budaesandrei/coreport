from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class ReportTypeCreate(BaseModel):
    code: str
    name: str
    entity_type: str = "property"
    report_package_id: int | None = None


class ReportTypeOut(ItemBase):
    code: str
    name: str
    entity_type: str
    report_package_id: int | None
