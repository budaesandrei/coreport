from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ItemBase


class ValidationRuleCreate(BaseModel):
    report_type_id: int
    field_key: str
    rule_type: str
    rule_params: dict = {}


class ValidationRuleOut(ItemBase):
    report_type_id: int
    field_key: str
    rule_type: str
    rule_params: dict
