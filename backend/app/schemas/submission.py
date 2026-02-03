from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class SubmissionCreate(BaseModel):
    entity_id: int
    report_type_id: int
    submission_period_id: int
    upload_job_id: int | None = None


class SubmissionOut(ItemBase):
    entity_id: int
    report_type_id: int
    submission_period_id: int
    status: str
    payload: dict
