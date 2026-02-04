"""user settings (ui language)

Revision ID: 0011_user_settings
Revises: 0010_workspace_settings
Create Date: 2026-02-04

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0011_user_settings"
down_revision = "0010_workspace_settings"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)

    if not insp.has_table("user_settings"):
        op.create_table(
            "user_settings",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("workspace_id", sa.String(length=64), nullable=False),
            sa.Column("auth_user_id", sa.Integer(), nullable=False),
            sa.Column(
                "ui_language",
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
            sa.UniqueConstraint(
                "workspace_id",
                "auth_user_id",
                name="uq_user_settings_workspace_user",
            ),
        )

    op.create_index(
        "ix_user_settings_workspace_id",
        "user_settings",
        ["workspace_id"],
        unique=False,
        if_not_exists=True,
    )

    op.create_index(
        "ix_user_settings_auth_user_id",
        "user_settings",
        ["auth_user_id"],
        unique=False,
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index("ix_user_settings_auth_user_id", table_name="user_settings")
    op.drop_index("ix_user_settings_workspace_id", table_name="user_settings")
    op.drop_table("user_settings")
