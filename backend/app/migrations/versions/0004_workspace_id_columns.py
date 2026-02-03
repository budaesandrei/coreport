"""rename tenant_id -> workspace_id on core tables

Revision ID: 0004_workspace_id_columns
Revises: 0003_workspaces_rename
Create Date: 2026-02-03

"""

from __future__ import annotations

from alembic import op

revision = "0004_workspace_id_columns"
down_revision = "0003_workspaces_rename"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop legacy tenants table (no longer used)
    op.drop_table("tenants")

    tables = [
        "orgs",
        "users",
        "entities",
        "report_packages",
        "report_types",
        "report_fields",
        "validation_rules",
        "schedules",
        "submission_periods",
        "upload_jobs",
        "mappings",
        "submissions",
        "approval_comments",
        "mapping_caches",
    ]

    for t in tables:
        with op.batch_alter_table(t) as batch:
            batch.alter_column("tenant_id", new_column_name="workspace_id")


def downgrade() -> None:
    tables = [
        "orgs",
        "users",
        "entities",
        "report_packages",
        "report_types",
        "report_fields",
        "validation_rules",
        "schedules",
        "submission_periods",
        "upload_jobs",
        "mappings",
        "submissions",
        "approval_comments",
        "mapping_caches",
    ]

    for t in tables:
        with op.batch_alter_table(t) as batch:
            batch.alter_column("workspace_id", new_column_name="tenant_id")

    # Can't reliably recreate tenants table with data
