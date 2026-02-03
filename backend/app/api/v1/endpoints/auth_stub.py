from __future__ import annotations

from fastapi import APIRouter

from app.core.context import get_current_tenant_id, get_current_user_name

router = APIRouter()


@router.get("/whoami")
async def whoami() -> dict:
    return {"tenant_id": get_current_tenant_id(), "user_name": get_current_user_name()}
