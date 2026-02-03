from pydantic import BaseModel
from typing import Optional
from app.schemas.enums import EntityAttributeType


class EntityAttributeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_primary: bool = False
    type: EntityAttributeType
    required: bool = False
    attribute_order: int = 0


class EntityAttributeUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    is_primary: bool = False
    type: EntityAttributeType
    required: bool = False
    attribute_order: int = 0


class EntityAttributeOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_primary: bool
    type: EntityAttributeType
    required: bool
    attribute_order: int

    class Config:
        from_attributes = True
