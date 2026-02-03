from __future__ import annotations

from pydantic import BaseModel


class WorkspaceResolveRequest(BaseModel):
    name: str


class WorkspaceInfoOut(BaseModel):
    id: int
    name: str
    slug: str
    status: str = "active"


class WorkspaceOut(WorkspaceInfoOut):
    pass
