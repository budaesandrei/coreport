from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    workspace_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)


class LoginIn(BaseModel):
    workspace_slug: str = Field(min_length=1)
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeOut(BaseModel):
    workspace_id: int
    workspace_slug: str
    email: EmailStr
