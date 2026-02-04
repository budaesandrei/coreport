from __future__ import annotations

from pydantic import BaseModel


# Deprecated: prefer app.schemas.workspace
from app.schemas.workspace import WorkspaceResolveRequest as ProjectResolveRequest
from app.schemas.workspace import WorkspaceInfoOut as ProjectInfoOut
from app.schemas.workspace import WorkspaceOut as ProjectOut
