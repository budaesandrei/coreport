from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.models.entity_type import EntityType

from app.db.session import get_db
from app.schemas.entity_type import EntityTypeCreate, EntityTypeUpdate, EntityTypeOut
from app.auth.dependencies import get_current_user, CognitoUser
from app.schemas.enums import ProjectRole

router = APIRouter(prefix="/entity_types", tags=["Entity Types"])


@router.get("", response_model=list[EntityTypeOut])
async def get_entity_types(
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(EntityType).where(
            EntityType.project_id == current_user.project_id,
            EntityType.is_deleted == False,
        )
    )
    entity_types = result.scalars().all()
    return entity_types


@router.get("/{entity_type_id}", response_model=EntityTypeOut)
async def get_entity_type(
    entity_type_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(EntityType).where(
            EntityType.id == entity_type_id,
            EntityType.project_id == current_user.project_id,
            EntityType.is_deleted == False,
        )
    )
    entity_type = result.scalar_one_or_none()

    if not entity_type:
        raise HTTPException(status_code=404, detail="Entity type not found")

    return entity_type


@router.post("", response_model=EntityTypeOut)
async def create_entity_type(
    payload: EntityTypeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.name or payload.name == "":
        raise HTTPException(status_code=400, detail="Entity type name is required")

    result = await db.execute(
        select(EntityType).where(
            func.lower(func.trim(EntityType.name)) == payload.name.strip().lower(),
            EntityType.project_id == current_user.project_id,
            EntityType.is_deleted == False,
        )
    )
    existing_entity_type = result.scalar_one_or_none()

    if existing_entity_type:
        raise HTTPException(status_code=400, detail="Entity type with same name already exists")

    new_entity_type = EntityType(
        name=payload.name,
        description=payload.description,
        project_id=current_user.project_id,
        created_by=current_user.email,
        updated_by=current_user.email,
    )

    db.add(new_entity_type)
    await db.commit()
    await db.refresh(new_entity_type)

    return new_entity_type


@router.patch("/{entity_type_id}", response_model=EntityTypeOut)
async def update_entity_type(
    entity_type_id: int,
    payload: EntityTypeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.name or payload.name == "":
        raise HTTPException(status_code=400, detail="Entity type name is required")

    result = await db.execute(
        select(EntityType).where(
            EntityType.id == entity_type_id,
            EntityType.project_id == current_user.project_id,
            EntityType.is_deleted == False,
        )
    )
    existing_entity_type = result.scalar_one_or_none()

    if not existing_entity_type:
        raise HTTPException(status_code=404, detail="Entity type not found")

    result = await db.execute(
        select(EntityType).where(
            func.lower(func.trim(EntityType.name)) == payload.name.strip().lower(),
            EntityType.project_id == current_user.project_id,
            EntityType.is_deleted == False,
            EntityType.id != entity_type_id,
        )
    )
    existing_entity_type_with_same_name = result.scalar_one_or_none()

    if existing_entity_type_with_same_name:
        raise HTTPException(status_code=400, detail="Entity type with same name already exists")

    existing_entity_type.name = payload.name
    if payload.description:
        existing_entity_type.description = payload.description
    if payload.is_active is not None:
        existing_entity_type.is_active = payload.is_active

    existing_entity_type.updated_by = current_user.email

    await db.commit()
    await db.refresh(existing_entity_type)

    return existing_entity_type


@router.delete("/{entity_type_id}", status_code=204)
async def delete_entity_type(
    entity_type_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(EntityType).where(
            EntityType.id == entity_type_id,
            EntityType.project_id == current_user.project_id,
            EntityType.is_deleted == False,
        )
    )
    entity_type = result.scalar_one_or_none()

    if not entity_type:
        raise HTTPException(status_code=404, detail="Entity type not found")

    entity_type.is_deleted = True
    entity_type.is_active = False
    entity_type.deleted_by = current_user.email

    await db.commit()

    return {"message": "Entity type deleted successfully"}
