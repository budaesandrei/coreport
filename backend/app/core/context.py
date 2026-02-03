from __future__ import annotations

import contextvars

_tenant_id_var: contextvars.ContextVar[str] = contextvars.ContextVar("tenant_id", default="default")
_user_name_var: contextvars.ContextVar[str] = contextvars.ContextVar("user_name", default="System")


def set_current_tenant_id(tenant_id: str | None) -> None:
    _tenant_id_var.set(tenant_id or "default")


def set_current_user_name(user_name: str | None) -> None:
    _user_name_var.set(user_name or "System")


def get_current_tenant_id() -> str:
    return _tenant_id_var.get() or "default"


def get_current_user_name() -> str:
    return _user_name_var.get() or "System"
