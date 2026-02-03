from __future__ import annotations

from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/")
async def removed() -> None:
    raise HTTPException(status_code=410, detail="Use /workspaces")


@router.post("/")
async def removed_post() -> None:
    raise HTTPException(status_code=410, detail="Use /workspaces")
