from __future__ import annotations

from fastapi import Header

from app.core.context import set_current_tenant_id, set_current_user_name


async def set_request_context(
    x_tenant_id: str | None = Header(default=None, alias="X-Tenant-Id"),
    x_user_name: str | None = Header(default=None, alias="X-User-Name"),
) -> None:
    """Populate request-scoped contextvars from headers.

    Defaults:
      tenant_id -> "default"
      user_name -> "System"
    """

    set_current_tenant_id(x_tenant_id)
    set_current_user_name(x_user_name)
