from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProviderCreate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True


class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True


class ProviderOut(BaseModel):
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
