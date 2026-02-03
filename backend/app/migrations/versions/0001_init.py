"""init

Revision ID: 0001_init
Revises: 
Create Date: 2026-02-03

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def _meta_cols() -> list[sa.Column]:
    return [
        sa.Column("tenant_id", sa.String(length=64), nullable=False),
        sa.Column("insert_by", sa.String(length=255), nullable=False),
        sa.Column("insert_dt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("update_by", sa.String(length=255), nullable=False),
        sa.Column("update_dt", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "tenants",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        *_meta_cols(),
    )

    op.create_table(
        "orgs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        *_meta_cols(),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=64), nullable=False),
        sa.Column("org_id", sa.Integer(), nullable=True),
        *_meta_cols(),
    )
    op.create_index("ix_users_user_name", "users", ["user_name"])

    op.create_table(
        "entities",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("entity_type", sa.String(length=64), nullable=False),
        sa.Column("org_id", sa.Integer(), nullable=True),
        sa.Column("external_id", sa.String(length=255), nullable=True),
        *_meta_cols(),
    )

    op.create_table(
        "report_packages",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("entity_type", sa.String(length=64), nullable=False),
        *_meta_cols(),
    )

    op.create_table(
        "report_types",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("code", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("entity_type", sa.String(length=64), nullable=False),
        sa.Column("report_package_id", sa.Integer(), nullable=True),
        *_meta_cols(),
    )
    op.create_index("ix_report_types_code", "report_types", ["code"])

    op.create_table(
        "report_fields",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("report_type_id", sa.Integer(), nullable=False),
        sa.Column("field_key", sa.String(length=128), nullable=False),
        sa.Column("field_type", sa.String(length=64), nullable=False),
        sa.Column("required", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        *_meta_cols(),
    )

    op.create_table(
        "validation_rules",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("report_type_id", sa.Integer(), nullable=False),
        sa.Column("field_key", sa.String(length=128), nullable=False),
        sa.Column("rule_type", sa.String(length=64), nullable=False),
        sa.Column("rule_params", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        *_meta_cols(),
    )

    op.create_table(
        "schedules",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        *_meta_cols(),
    )

    op.create_table(
        "submission_periods",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("schedule_id", sa.Integer(), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        *_meta_cols(),
    )

    op.create_table(
        "upload_jobs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("file_name", sa.String(length=512), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("org_id", sa.Integer(), nullable=True),
        sa.Column("entity_id", sa.Integer(), nullable=True),
        sa.Column("report_type_id", sa.Integer(), nullable=True),
        *_meta_cols(),
    )

    op.create_table(
        "mappings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("upload_job_id", sa.Integer(), nullable=False),
        sa.Column("report_type_id", sa.Integer(), nullable=False),
        sa.Column("mapping_spec", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("confidence", sa.Float(), nullable=False, server_default=sa.text("0")),
        *_meta_cols(),
    )

    op.create_table(
        "submissions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("entity_id", sa.Integer(), nullable=False),
        sa.Column("report_type_id", sa.Integer(), nullable=False),
        sa.Column("submission_period_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        *_meta_cols(),
    )

    op.create_table(
        "approval_comments",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("submission_id", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=False),
        sa.Column("decision", sa.String(length=64), nullable=False),
        *_meta_cols(),
    )

    op.create_table(
        "mapping_caches",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("org_id", sa.Integer(), nullable=False),
        sa.Column("report_type_id", sa.Integer(), nullable=False),
        sa.Column("file_fingerprint", sa.String(length=128), nullable=False),
        sa.Column("mapping_spec", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("confidence", sa.Float(), nullable=False, server_default=sa.text("0")),
        *_meta_cols(),
    )


def downgrade() -> None:
    op.drop_table("mapping_caches")
    op.drop_table("approval_comments")
    op.drop_table("submissions")
    op.drop_table("mappings")
    op.drop_table("upload_jobs")
    op.drop_table("submission_periods")
    op.drop_table("schedules")
    op.drop_table("validation_rules")
    op.drop_table("report_fields")
    op.drop_table("report_types")
    op.drop_table("report_packages")
    op.drop_table("entities")
    op.drop_index("ix_users_user_name", table_name="users")
    op.drop_table("users")
    op.drop_table("orgs")
    op.drop_table("tenants")
