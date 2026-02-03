from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EntityTypeCreate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True


class EntityTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True


class EntityTypeOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    created_by: str
    updated_at: datetime
    updated_by: str

    class Config:
        from_attributes = True
