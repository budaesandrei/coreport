from __future__ import annotations

import contextvars

_workspace_id_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    "workspace_id", default="default"
)
_user_name_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    "user_name", default="System"
)


def set_current_workspace_id(workspace_id: str | None) -> None:
    _workspace_id_var.set(workspace_id or "default")


def set_current_user_name(user_name: str | None) -> None:
    _user_name_var.set(user_name or "System")


def get_current_workspace_id() -> str:
    return _workspace_id_var.get() or "default"


def get_current_user_name() -> str:
    return _user_name_var.get() or "System"
