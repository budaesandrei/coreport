from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class MappingSave(BaseModel):
    mapping_spec: dict


class MappingOut(ItemBase):
    upload_job_id: int
    report_type_id: int
    mapping_spec: dict
    confidence: float
