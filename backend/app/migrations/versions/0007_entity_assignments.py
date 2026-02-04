"""entity assignments (per entity)

Revision ID: 0007_entity_assignments
Revises: 0006_entity_types
Create Date: 2026-02-04

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0007_entity_assignments"
down_revision = "0006_entity_types"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "entity_assignments",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("workspace_id", sa.String(length=64), nullable=False),
        sa.Column("entity_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column(
            "role",
            sa.Enum(
                "submitter",
                "approver",
                name="entity_assignment_role",
                native_enum=False,
            ),
            nullable=False,
        ),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("insert_by", sa.String(length=255), nullable=False),
        sa.Column(
            "insert_dt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column("update_by", sa.String(length=255), nullable=False),
        sa.Column(
            "update_dt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(["entity_id"], ["entities.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_index("ix_entity_assignments_workspace_id", "entity_assignments", ["workspace_id"])
    op.create_index("ix_entity_assignments_entity_id", "entity_assignments", ["entity_id"])
    op.create_index("ix_entity_assignments_user_id", "entity_assignments", ["user_id"])

    op.create_index(
        "ix_entity_assignments_workspace_entity_role_active",
        "entity_assignments",
        ["workspace_id", "entity_id", "role", "active"],
    )
    op.create_index(
        "ix_entity_assignments_workspace_user_role_active",
        "entity_assignments",
        ["workspace_id", "user_id", "role", "active"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_entity_assignments_workspace_user_role_active", table_name="entity_assignments"
    )
    op.drop_index(
        "ix_entity_assignments_workspace_entity_role_active", table_name="entity_assignments"
    )
    op.drop_index("ix_entity_assignments_user_id", table_name="entity_assignments")
    op.drop_index("ix_entity_assignments_entity_id", table_name="entity_assignments")
    op.drop_index("ix_entity_assignments_workspace_id", table_name="entity_assignments")
    op.drop_table("entity_assignments")
