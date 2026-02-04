from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.models.provider import Provider

from app.db.session import get_db
from app.schemas.provider import ProviderCreate, ProviderUpdate, ProviderOut
from app.auth.dependencies import get_current_user, CognitoUser
from app.schemas.enums import ProjectRole

router = APIRouter(prefix="/providers", tags=["Providers"])


@router.get("", response_model=list[ProviderOut])
async def get_providers(
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(Provider).where(
            Provider.project_id == current_user.project_id, Provider.is_deleted == False
        )
    )
    providers = result.scalars().all()

    return providers


@router.get("/{provider_id}", response_model=ProviderOut)
async def get_provider(
    provider_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(Provider).where(
            Provider.id == provider_id,
            Provider.project_id == current_user.project_id,
            Provider.is_deleted == False,
        )
    )
    provider = result.scalar_one_or_none()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    return provider


@router.post("", response_model=ProviderOut)
async def create_provider(
    payload: ProviderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.name or payload.name == "":
        raise HTTPException(status_code=400, detail="Provider name is required")

    result = await db.execute(
        select(Provider).where(
            func.lower(func.trim(Provider.name)) == payload.name.strip().lower(),
            Provider.project_id == current_user.project_id,
            Provider.is_deleted == False,
        )
    )
    existing_provider = result.scalar_one_or_none()

    if existing_provider:
        raise HTTPException(status_code=400, detail="Provider with same name already exists")

    new_provider = Provider(
        name=payload.name,
        description=payload.description,
        project_id=current_user.project_id,
        created_by=current_user.email,
        updated_by=current_user.email,
    )

    db.add(new_provider)
    await db.commit()
    await db.refresh(new_provider)

    return new_provider


@router.patch("/{provider_id}", response_model=ProviderOut)
async def update_provider(
    provider_id: int,
    payload: ProviderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.name or payload.name == "":
        raise HTTPException(status_code=400, detail="Provider name is required")

    result = await db.execute(
        select(Provider).where(
            Provider.id == provider_id,
            Provider.project_id == current_user.project_id,
            Provider.is_deleted == False,
        )
    )
    existing_provider = result.scalar_one_or_none()

    if not existing_provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    result = await db.execute(
        select(Provider).where(
            func.lower(func.trim(Provider.name)) == payload.name.strip().lower(),
            Provider.project_id == current_user.project_id,
            Provider.is_deleted == False,
            Provider.id != provider_id,
        )
    )
    existing_provider_with_same_name = result.scalar_one_or_none()

    if existing_provider_with_same_name:
        raise HTTPException(status_code=400, detail="Provider with same name already exists")

    existing_provider.name = payload.name
    if payload.description:
        existing_provider.description = payload.description
    if payload.is_active is not None:
        existing_provider.is_active = payload.is_active

    existing_provider.updated_by = current_user.email

    await db.commit()
    await db.refresh(existing_provider)

    return existing_provider


@router.delete("/{provider_id}", status_code=204)
async def delete_provider(
    provider_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(Provider).where(
            Provider.id == provider_id,
            Provider.project_id == current_user.project_id,
            Provider.is_deleted == False,
        )
    )
    provider = result.scalar_one_or_none()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    provider.is_deleted = True
    provider.is_active = False
    provider.deleted_by = current_user.email

    await db.commit()

    return {"message": "Provider deleted successfully"}
