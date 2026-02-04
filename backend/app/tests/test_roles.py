from app.schemas.enums import WorkspaceRole
from app.services.roles import coerce_workspace_role


def test_coerce_workspace_role_aliases() -> None:
    assert coerce_workspace_role("admin") == WorkspaceRole.admin
    assert coerce_workspace_role("workspace_admin") == WorkspaceRole.admin
    assert coerce_workspace_role("SUBMITTER") == WorkspaceRole.submitter
    assert coerce_workspace_role("report_approver") == WorkspaceRole.approver
    assert coerce_workspace_role("unknown") == WorkspaceRole.viewer
    assert coerce_workspace_role(None) == WorkspaceRole.viewer
