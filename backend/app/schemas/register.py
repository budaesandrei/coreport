from pydantic import BaseModel, EmailStr
from app.schemas.enums import ProjectStatus
from typing import Optional


class RegisterProjectRequest(BaseModel):
    project_name: str
    email: EmailStr
    first_name: str
    last_name: str
    status: Optional[ProjectStatus] = ProjectStatus.ACTIVE
