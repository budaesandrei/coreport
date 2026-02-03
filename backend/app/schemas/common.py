from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ItemBase(ORMBase):
    id: int
    tenant_id: str
    insert_by: str
    insert_dt: datetime
    update_by: str
    update_dt: datetime
