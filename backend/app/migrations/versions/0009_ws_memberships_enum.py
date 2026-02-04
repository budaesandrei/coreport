"""fix workspace_memberships.role to use workspace_role enum

Revision ID: 0009_ws_memberships_enum
Revises: 0008_workspace_memberships
Create Date: 2026-02-04

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0009_ws_memberships_enum"
down_revision = "0008_workspace_memberships"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure enum exists
    workspace_role = sa.Enum(
        "admin",
        "submitter",
        "approver",
        "viewer",
        name="workspace_role",
    )
    workspace_role.create(op.get_bind(), checkfirst=True)

    # Normalize any existing values.
    op.execute(
        "UPDATE workspace_memberships SET role='viewer' WHERE role NOT IN ('admin','submitter','approver','viewer')"
    )

    # Convert column type if needed.
    bind = op.get_bind()
    insp = sa.inspect(bind)
    role_type = next(
        (c["type"] for c in insp.get_columns("workspace_memberships") if c["name"] == "role"), None
    )

    if role_type is not None and not isinstance(role_type, sa.Enum):
        op.execute("ALTER TABLE workspace_memberships ALTER COLUMN role DROP DEFAULT")
        op.execute(
            "ALTER TABLE workspace_memberships ALTER COLUMN role TYPE workspace_role USING role::workspace_role"
        )
        op.execute("ALTER TABLE workspace_memberships ALTER COLUMN role SET DEFAULT 'viewer'")


def downgrade() -> None:
    op.execute("ALTER TABLE workspace_memberships ALTER COLUMN role DROP DEFAULT")
    op.execute(
        "ALTER TABLE workspace_memberships ALTER COLUMN role TYPE VARCHAR(64) USING role::text"
    )
    op.execute("ALTER TABLE workspace_memberships ALTER COLUMN role SET DEFAULT 'viewer'")
