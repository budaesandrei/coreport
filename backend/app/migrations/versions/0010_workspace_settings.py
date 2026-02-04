"""workspace settings (canonical data language)

Revision ID: 0010_workspace_settings
Revises: 0009_ws_memberships_enum
Create Date: 2026-02-04

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0010_workspace_settings"
down_revision = "0009_ws_memberships_enum"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)

    if not insp.has_table("workspace_settings"):
        op.create_table(
            "workspace_settings",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("workspace_id", sa.String(length=64), nullable=False),
            sa.Column(
                "canonical_data_language",
                sa.String(length=16),
                nullable=False,
                server_default=sa.text("'en'"),
            ),
            sa.Column(
                "insert_by",
                sa.String(length=255),
                nullable=False,
                server_default=sa.text("'System'"),
            ),
            sa.Column(
                "insert_dt",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.Column(
                "update_by",
                sa.String(length=255),
                nullable=False,
                server_default=sa.text("'System'"),
            ),
            sa.Column(
                "update_dt",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.UniqueConstraint("workspace_id", name="uq_workspace_settings_workspace"),
        )

    op.create_index(
        "ix_workspace_settings_workspace_id",
        "workspace_settings",
        ["workspace_id"],
        unique=False,
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index("ix_workspace_settings_workspace_id", table_name="workspace_settings")
    op.drop_table("workspace_settings")
