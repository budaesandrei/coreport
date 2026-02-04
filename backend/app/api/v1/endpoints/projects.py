from __future__ import annotations

from fastapi import APIRouter, Depends
from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.project import Project
from app.db.session import get_db
from app.schemas.project import ProjectInfoOut, ProjectResolveRequest

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/resolve", response_model=ProjectInfoOut)
async def resolve_project(
    payload: ProjectResolveRequest, db: AsyncSession = Depends(get_db)
) -> ProjectInfoOut:
    """Resolve (or create) a Workspace (aka project)."""

    name = payload.name.strip()
    slug = slugify(name)

    res = await db.execute(select(Project).where(Project.slug == slug))
    existing = res.scalars().first()
    if existing:
        if existing.name != name:
            existing.name = name
            await db.commit()
            await db.refresh(existing)
        return ProjectInfoOut(
            id=existing.id, name=existing.name, slug=existing.slug, status=str(existing.status)
        )

    item = Project(name=name, slug=slug, status="active", created_by="system", updated_by="system")
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return ProjectInfoOut(id=item.id, name=item.name, slug=item.slug, status=str(item.status))
