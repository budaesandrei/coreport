from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_tenant_id
from app.db.session import get_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantOut

router = APIRouter()


@router.get("/", response_model=list[TenantOut])
async def list_tenants(db: AsyncSession = Depends(get_db)) -> list[Tenant]:
    tenant_id = get_current_tenant_id()
    res = await db.execute(select(Tenant).where(Tenant.tenant_id == tenant_id).order_by(Tenant.id))
    return list(res.scalars().all())


@router.post("/", response_model=TenantOut)
async def create_tenant(payload: TenantCreate, db: AsyncSession = Depends(get_db)) -> Tenant:
    item = Tenant(name=payload.name)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
