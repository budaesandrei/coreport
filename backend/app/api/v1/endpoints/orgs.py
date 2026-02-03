from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_tenant_id
from app.db.session import get_db
from app.models.org import Org
from app.schemas.org import OrgCreate, OrgOut

router = APIRouter()


@router.get("/", response_model=list[OrgOut])
async def list_orgs(db: AsyncSession = Depends(get_db)) -> list[Org]:
    tenant_id = get_current_tenant_id()
    res = await db.execute(select(Org).where(Org.tenant_id == tenant_id).order_by(Org.id))
    return list(res.scalars().all())


@router.post("/", response_model=OrgOut)
async def create_org(payload: OrgCreate, db: AsyncSession = Depends(get_db)) -> Org:
    item = Org(name=payload.name)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
