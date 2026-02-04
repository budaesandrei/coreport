"""entity types (workspace-scoped)

Revision ID: 0006_entity_types
Revises: 0005_drop_org
Create Date: 2026-02-03

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0006_entity_types"
down_revision = "0005_drop_org"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "entity_types",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("workspace_id", sa.String(length=64), nullable=False, index=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_by", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "created_by", sa.String(length=255), nullable=False, server_default=sa.text("'system'")
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_by", sa.String(length=255), nullable=False, server_default=sa.text("'system'")
        ),
        sa.UniqueConstraint("workspace_id", "name", name="uq_entity_types_workspace_name"),
    )


def downgrade() -> None:
    op.drop_table("entity_types")
