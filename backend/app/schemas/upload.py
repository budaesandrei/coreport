from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class UploadJobOut(ItemBase):
    file_name: str
    status: str
    org_id: int | None
    entity_id: int | None
    report_type_id: int | None


class ProposedMapping(BaseModel):
    mapping_spec: dict
    confidence: float = 0.0
    warnings: list[str] = []
