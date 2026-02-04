from __future__ import annotations

import enum

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class EntityAssignmentRole(str, enum.Enum):
    submitter = "submitter"
    approver = "approver"


class EntityAssignment(Base, BaseMixin):
    entity_id: Mapped[int] = mapped_column(
        sa.ForeignKey("entities.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int] = mapped_column(
        sa.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[EntityAssignmentRole] = mapped_column(
        sa.Enum(EntityAssignmentRole, name="entity_assignment_role", native_enum=False),
        nullable=False,
    )

    active: Mapped[bool] = mapped_column(
        sa.Boolean(),
        nullable=False,
        server_default=sa.text("true"),
    )

    __table_args__ = (
        sa.Index(
            "ix_entity_assignments_workspace_entity_role_active",
            "workspace_id",
            "entity_id",
            "role",
            "active",
        ),
        sa.Index(
            "ix_entity_assignments_workspace_user_role_active",
            "workspace_id",
            "user_id",
            "role",
            "active",
        ),
    )
