from __future__ import annotations

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin
from app.schemas.enums import WorkspaceRole


class WorkspaceMembership(Base, BaseMixin):
    """Membership of an auth user in a workspace.

    Note: workspace_id is stored as the workspace slug (string) in this codebase.
    """

    auth_user_id: Mapped[int] = mapped_column(
        ForeignKey("auth_users.id", ondelete="CASCADE"), nullable=False
    )
    role: Mapped[WorkspaceRole] = mapped_column(
        SQLEnum(WorkspaceRole, name="workspace_role"),
        nullable=False,
        default=WorkspaceRole.viewer,
        index=True,
    )

    __table_args__ = (
        UniqueConstraint(
            "workspace_id", "auth_user_id", name="uq_workspace_memberships_workspace_user"
        ),
        Index("ix_workspace_memberships_workspace_id", "workspace_id"),
    )
