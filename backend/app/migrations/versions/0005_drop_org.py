"""drop org model and org_id columns

Revision ID: 0005_drop_org
Revises: 0004_workspace_id_columns
Create Date: 2026-02-03

"""

from __future__ import annotations

from alembic import op

revision = "0005_drop_org"
down_revision = "0004_workspace_id_columns"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop orgs table (workspace is the org)
    op.drop_table("orgs")

    # Remove org_id columns
    with op.batch_alter_table("users") as batch:
        batch.drop_column("org_id")

    with op.batch_alter_table("entities") as batch:
        batch.drop_column("org_id")

    with op.batch_alter_table("upload_jobs") as batch:
        batch.drop_column("org_id")

    with op.batch_alter_table("mapping_caches") as batch:
        batch.drop_column("org_id")


def downgrade() -> None:
    # Best-effort; recreating org data is not possible.
    raise NotImplementedError("Downgrade not supported")
