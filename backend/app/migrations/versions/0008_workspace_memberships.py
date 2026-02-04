"""workspace memberships + roles

Revision ID: 0008_workspace_memberships
Revises: 0007_entity_assignments
Create Date: 2026-02-04

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0008_workspace_memberships"
down_revision = "0007_entity_assignments"
branch_labels = None
depends_on = None


def upgrade() -> None:
    workspace_role = sa.Enum(
        "admin",
        "submitter",
        "approver",
        "viewer",
        name="workspace_role",
    )
    workspace_role.create(op.get_bind(), checkfirst=True)

    bind = op.get_bind()
    insp = sa.inspect(bind)

    if not insp.has_table("workspace_memberships"):
        op.create_table(
            "workspace_memberships",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("workspace_id", sa.String(length=64), nullable=False),
            sa.Column(
                "auth_user_id",
                sa.Integer(),
                sa.ForeignKey("auth_users.id", ondelete="CASCADE"),
                nullable=False,
            ),
            sa.Column(
                "role",
                sa.Enum(name="workspace_role"),
                nullable=False,
                server_default=sa.text("'viewer'"),
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
                "workspace_id", "auth_user_id", name="uq_workspace_memberships_workspace_user"
            ),
        )
    else:
        # Existing installs may already have a workspace_memberships table.
        # Normalize role values and convert the column to the enum.
        op.execute(
            "UPDATE workspace_memberships SET role='viewer' WHERE role NOT IN ('admin','submitter','approver','viewer')"
        )
        op.execute("ALTER TABLE workspace_memberships ALTER COLUMN role DROP DEFAULT")
        op.execute(
            "ALTER TABLE workspace_memberships ALTER COLUMN role TYPE workspace_role USING role::workspace_role"
        )
        op.execute("ALTER TABLE workspace_memberships ALTER COLUMN role SET DEFAULT 'viewer'")

    op.create_index(
        "ix_workspace_memberships_workspace_id",
        "workspace_memberships",
        ["workspace_id"],
        unique=False,
        if_not_exists=True,
    )
    op.create_index(
        "ix_workspace_memberships_role",
        "workspace_memberships",
        ["role"],
        unique=False,
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index("ix_workspace_memberships_role", table_name="workspace_memberships")
    op.drop_index("ix_workspace_memberships_workspace_id", table_name="workspace_memberships")
    op.drop_table("workspace_memberships")

    # Enum type
    sa.Enum(name="workspace_role").drop(op.get_bind(), checkfirst=True)
