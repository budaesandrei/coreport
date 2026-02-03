from __future__ import annotations

from fastapi import Header

from app.core.context import set_current_user_name, set_current_workspace_id


async def set_request_context(
    x_workspace_id: str | None = Header(default=None, alias="X-Workspace-Id"),
    x_user_name: str | None = Header(default=None, alias="X-User-Name"),
) -> None:
    """Populate request-scoped contextvars from headers."""

    set_current_workspace_id(x_workspace_id)
    set_current_user_name(x_user_name)
