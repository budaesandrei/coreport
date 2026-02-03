from __future__ import annotations

from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/")
async def removed() -> None:
    raise HTTPException(status_code=410, detail="Org removed: workspace is the organisation")
