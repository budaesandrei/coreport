from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime
from app.schemas.enums import ProjectRole, UserStatus


class ProjectUserCreate(BaseModel):
    email: str
    first_name: str
    last_name: str
    role: ProjectRole = ProjectRole.VIEWER


class ProjectUserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: ProjectRole
    provider_name: Optional[str] = None
    status: UserStatus


class ProjectUserOut(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    provider_name: Optional[str] = None
    status: UserStatus
    role: ProjectRole
    created_at: datetime
    created_by: str
    updated_at: datetime
    updated_by: str

    class Config:
        from_attributes = True
