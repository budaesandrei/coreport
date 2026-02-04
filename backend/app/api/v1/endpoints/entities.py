from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_workspace_id
from app.db.session import get_db
from app.models.entity import Entity
from app.schemas.entity import EntityCreate, EntityOut

router = APIRouter()


@router.get("/", response_model=list[EntityOut])
async def list_entities(db: AsyncSession = Depends(get_db)) -> list[Entity]:
    workspace_id = get_current_workspace_id()
    res = await db.execute(
        select(Entity).where(Entity.workspace_id == workspace_id).order_by(Entity.id)
    )
    return list(res.scalars().all())


@router.post("/", response_model=EntityOut)
async def create_entity(payload: EntityCreate, db: AsyncSession = Depends(get_db)) -> Entity:
    item = Entity(
        name=payload.name,
        entity_type=payload.entity_type,
        external_id=payload.external_id,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
