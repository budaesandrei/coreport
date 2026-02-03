from __future__ import annotations

from fastapi import APIRouter, Depends
from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.workspace import Workspace
from app.db.session import get_db
from app.schemas.workspace import WorkspaceInfoOut, WorkspaceResolveRequest

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.post("/resolve", response_model=WorkspaceInfoOut)
async def resolve_workspace(
    payload: WorkspaceResolveRequest, db: AsyncSession = Depends(get_db)
) -> WorkspaceInfoOut:
    """Resolve (or create) a Workspace."""

    name = payload.name.strip()
    slug = slugify(name)

    res = await db.execute(select(Workspace).where(Workspace.slug == slug))
    existing = res.scalars().first()
    if existing:
        if existing.name != name:
            existing.name = name
            await db.commit()
            await db.refresh(existing)
        return WorkspaceInfoOut(
            id=existing.id,
            name=existing.name,
            slug=existing.slug,
            status=str(existing.status),
        )

    item = Workspace(name=name, slug=slug, status="active", created_by="system", updated_by="system")
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return WorkspaceInfoOut(id=item.id, name=item.name, slug=item.slug, status=str(item.status))
