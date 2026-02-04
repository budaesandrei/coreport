from __future__ import annotations

from app.schemas.enums import WorkspaceRole


def coerce_workspace_role(value: str | WorkspaceRole | None) -> WorkspaceRole:
    if value is None:
        return WorkspaceRole.viewer
    if isinstance(value, WorkspaceRole):
        return value

    raw = str(value).strip().lower()

    aliases: dict[str, WorkspaceRole] = {
        "admin": WorkspaceRole.admin,
        "workspace_admin": WorkspaceRole.admin,
        "submitter": WorkspaceRole.submitter,
        "report_submitter": WorkspaceRole.submitter,
        "approver": WorkspaceRole.approver,
        "report_approver": WorkspaceRole.approver,
        "viewer": WorkspaceRole.viewer,
    }

    return aliases.get(raw, WorkspaceRole.viewer)
