from __future__ import annotations

from pydantic import BaseModel


class ProjectOut(BaseModel):
    id: int
    name: str
    slug: str
    status: str = "ACTIVE"


class ProjectResolveIn(BaseModel):
    name: str
