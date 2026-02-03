from __future__ import annotations

from enum import StrEnum

from app.core.context import get_current_user_name


class Role(StrEnum):
    WORKSPACE_ADMIN = "WORKSPACE_ADMIN"
    REPORT_ADMIN = "REPORT_ADMIN"
    SUBMITTER = "SUBMITTER"
    APPROVER = "APPROVER"
    VIEWER = "VIEWER"


def require_role(*_roles: Role) -> None:
    """Prototype stub.

    In a real system you'd look up user roles from DB or JWT.
    For now, the frontend can pass X-User-Name and we allow everything.
    """

    _ = get_current_user_name()
    return
