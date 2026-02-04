from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class UserSetting(Base, BaseMixin):
    """Per-user settings scoped by workspace.

    Uses BaseMixin.workspace_id (workspace slug) as the scoping key.
    """

    auth_user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    ui_language: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default="en",
        server_default="en",
    )
