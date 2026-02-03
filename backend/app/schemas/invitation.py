from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.schemas.enums import ProjectRole, ExpiryPreset
from typing import Optional
from app.schemas.project import ProjectInfoOut


class InvitationCreate(BaseModel):
    email: EmailStr
    role: ProjectRole
    expires_in: ExpiryPreset = ExpiryPreset.SEVEN_DAYS


class InvitationOut(BaseModel):
    email: EmailStr
    project: ProjectInfoOut
    role: ProjectRole
    expires_at: datetime
    accepted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
