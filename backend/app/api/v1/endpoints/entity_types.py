from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_user_name, get_current_workspace_id
from app.db.session import get_db
from app.models.entity_type import EntityType
from app.schemas.entity_type import EntityTypeCreate, EntityTypeOut, EntityTypeUpdate

router = APIRouter(prefix="/entity_types", tags=["Entity Types"])


@router.get("", response_model=list[EntityTypeOut])
async def list_entity_types(db: AsyncSession = Depends(get_db)) -> list[EntityType]:
    workspace_id = get_current_workspace_id()
    res = await db.execute(
        select(EntityType)
        .where(EntityType.workspace_id == workspace_id, EntityType.is_deleted == False)
        .order_by(EntityType.id)
    )
    return list(res.scalars().all())


@router.post("", response_model=EntityTypeOut)
async def create_entity_type(payload: EntityTypeCreate, db: AsyncSession = Depends(get_db)) -> EntityType:
    workspace_id = get_current_workspace_id()
    user = get_current_user_name()

    name = (payload.name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Entity type name is required")

    res = await db.execute(
        select(EntityType).where(
            EntityType.workspace_id == workspace_id,
            EntityType.is_deleted == False,
            func.lower(func.trim(EntityType.name)) == name.lower(),
        )
    )
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Entity type with same name already exists")

    item = EntityType(
        workspace_id=workspace_id,
        name=name,
        description=(payload.description or None),
        is_active=True if payload.is_active is None else bool(payload.is_active),
        created_by=user,
        updated_by=user,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/{entity_type_id}", response_model=EntityTypeOut)
async def update_entity_type(
    entity_type_id: int, payload: EntityTypeUpdate, db: AsyncSession = Depends(get_db)
) -> EntityType:
    workspace_id = get_current_workspace_id()
    user = get_current_user_name()

    res = await db.execute(
        select(EntityType).where(
            EntityType.id == entity_type_id,
            EntityType.workspace_id == workspace_id,
            EntityType.is_deleted == False,
        )
    )
    item = res.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Entity type not found")

    if payload.name is not None:
        name = payload.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="Entity type name is required")

        res = await db.execute(
            select(EntityType).where(
                EntityType.workspace_id == workspace_id,
                EntityType.is_deleted == False,
                func.lower(func.trim(EntityType.name)) == name.lower(),
                EntityType.id != entity_type_id,
            )
        )
        if res.scalars().first():
            raise HTTPException(status_code=400, detail="Entity type with same name already exists")

        item.name = name

    if payload.description is not None:
        item.description = payload.description

    if payload.is_active is not None:
        item.is_active = bool(payload.is_active)

    item.updated_by = user
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{entity_type_id}", status_code=204)
async def delete_entity_type(entity_type_id: int, db: AsyncSession = Depends(get_db)) -> None:
    workspace_id = get_current_workspace_id()
    user = get_current_user_name()

    res = await db.execute(
        select(EntityType).where(
            EntityType.id == entity_type_id,
            EntityType.workspace_id == workspace_id,
            EntityType.is_deleted == False,
        )
    )
    item = res.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Entity type not found")

    item.is_deleted = True
    item.is_active = False
    item.deleted_by = user
    item.deleted_at = func.now()
    item.updated_by = user
    await db.commit()
    return None
