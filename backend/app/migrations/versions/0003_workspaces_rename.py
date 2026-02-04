"""rename projects->workspaces and tenant_id->workspace_id

Revision ID: 0003_workspaces_rename
Revises: 0002_projects_auth_users
Create Date: 2026-02-03

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0003_workspaces_rename"
down_revision = "0002_projects_auth_users"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # projects -> workspaces
    op.rename_table("projects", "workspaces")

    # auth_users.tenant_id -> auth_users.workspace_id
    # Drop old index first
    with op.batch_alter_table("auth_users") as batch:
        batch.drop_index("ix_auth_users_tenant_id")
        batch.alter_column(
            "tenant_id", new_column_name="workspace_id", existing_type=sa.String(length=64)
        )
        batch.create_index("ix_auth_users_workspace_id", ["workspace_id"])


def downgrade() -> None:
    with op.batch_alter_table("auth_users") as batch:
        batch.drop_index("ix_auth_users_workspace_id")
        batch.alter_column(
            "workspace_id", new_column_name="tenant_id", existing_type=sa.String(length=64)
        )
        batch.create_index("ix_auth_users_tenant_id", ["tenant_id"])

    op.rename_table("workspaces", "projects")
