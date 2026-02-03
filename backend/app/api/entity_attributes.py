from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.models.entity_attribute import EntityAttribute

from app.db.session import get_db
from app.schemas.entity_attribute import EntityAttributeCreate, EntityAttributeUpdate, EntityAttributeOut
from app.auth.dependencies import get_current_user, CognitoUser
from app.schemas.enums import ProjectRole

router = APIRouter(prefix="/entity_attributes", tags=["Entity Attributes"])


@router.get("/{entity_type_id}", response_model=list[EntityAttributeOut])
async def get_entity_attributes(
    entity_type_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(EntityAttribute).where(
            EntityAttribute.entity_type_id == entity_type_id,
            EntityAttribute.project_id == current_user.project_id,
        )
    )
    entity_attributes = result.scalars().all()
    return entity_attributes


@router.get("/{entity_type_id}/{entity_attribute_id}", response_model=EntityAttributeOut)
async def get_entity_attribute(
    entity_type_id: int,
    entity_attribute_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(EntityAttribute).where(
            EntityAttribute.id == entity_attribute_id,
            EntityAttribute.entity_type_id == entity_type_id,
            EntityAttribute.project_id == current_user.project_id,
        )
    )
    entity_attribute = result.scalar_one_or_none()

    if not entity_attribute:
        raise HTTPException(status_code=404, detail="Entity attribute not found")

    return entity_attribute


@router.post("/{entity_type_id}", response_model=EntityAttributeOut)
async def create_entity_attribute(
    entity_type_id: int,
    payload: EntityAttributeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    
    if not payload.name or payload.name == "":
        raise HTTPException(status_code=400, detail="Entity attribute name is required")
    
    result = await db.execute(
        select(EntityAttribute).where(
            func.lower(func.trim(EntityAttribute.name)) == payload.name.strip().lower(),
            EntityAttribute.entity_type_id == entity_type_id,
            EntityAttribute.project_id == current_user.project_id,
        )
    )
    existing_entity_attribute = result.scalar_one_or_none()
    
    if existing_entity_attribute:
        raise HTTPException(
            status_code=400, detail="Entity attribute with same name already exists"
        )
    
    new_entity_attribute = EntityAttribute(
        entity_type_id=entity_type_id,
        name=payload.name,
        description=payload.description,
        project_id=current_user.project_id,
        created_by=current_user.email,
        updated_by=current_user.email,
    )
    
    db.add(new_entity_attribute)
    await db.commit()
    await db.refresh(new_entity_attribute)
    
    return new_entity_attribute


@router.patch("/{entity_type_id}/{entity_attribute_id}", response_model=EntityAttributeOut)
async def update_entity_attribute(
    entity_type_id: int,
    entity_attribute_id: int,
    payload: EntityAttributeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.name or payload.name == "":
        raise HTTPException(status_code=400, detail="Entity attribute name is required")
    
    result = await db.execute(
        select(EntityAttribute).where(
            EntityAttribute.id == entity_attribute_id,
            EntityAttribute.entity_type_id == entity_type_id,
            EntityAttribute.project_id == current_user.project_id,
        )
    )
    existing_entity_attribute = result.scalar_one_or_none()
    
    if not existing_entity_attribute:
        raise HTTPException(status_code=404, detail="Entity attribute not found")
    
    result = await db.execute(
        select(EntityAttribute).where(
            func.lower(func.trim(EntityAttribute.name)) == payload.name.strip().lower(),
            EntityAttribute.entity_type_id == entity_type_id,
            EntityAttribute.project_id == current_user.project_id,
            EntityAttribute.id != entity_attribute_id,
        )
    )
    existing_entity_attribute_with_same_name = result.scalar_one_or_none()
    
    if existing_entity_attribute_with_same_name:
        raise HTTPException(
            status_code=400, detail="Entity type with same name already exists"
        )
    
    existing_entity_attribute.name = payload.name
    if payload.description:
        existing_entity_attribute.description = payload.description
    if payload.is_primary:
        existing_entity_attribute.is_primary = payload.is_primary
    if payload.type:
        existing_entity_attribute.type = payload.type
    if payload.required:
        existing_entity_attribute.required = payload.required
    if payload.attribute_order:
        existing_entity_attribute.attribute_order = payload.attribute_order
    
    existing_entity_attribute.updated_by = current_user.email
    
    await db.commit()
    await db.refresh(existing_entity_attribute)
    
    return existing_entity_attribute


@router.delete("/{entity_type_id}/{entity_attribute_id}", status_code=204)
async def delete_entity_attribute(
    entity_type_id: int,
    entity_attribute_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    
    result = await db.execute(
        select(EntityAttribute).where(
            EntityAttribute.id == entity_attribute_id,
            EntityAttribute.entity_type_id == entity_type_id,
            EntityAttribute.project_id == current_user.project_id,
        )
    )
    entity_attribute = result.scalar_one_or_none()
    
    if not entity_attribute:
        raise HTTPException(status_code=404, detail="Entity attribute not found")

    await db.delete(entity_attribute)    
    await db.commit()
    
    return {"message": "Entity type deleted successfully"}
