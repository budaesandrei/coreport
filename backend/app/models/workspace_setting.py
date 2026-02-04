from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class WorkspaceSetting(Base, BaseMixin):
    """Workspace-scoped settings.

    Uses BaseMixin.workspace_id (workspace slug) as the scoping key.
    """

    canonical_data_language: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default="en",
        server_default="en",
    )
