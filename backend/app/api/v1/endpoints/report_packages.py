from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_tenant_id
from app.db.session import get_db
from app.models.report_package import ReportPackage
from app.schemas.report_package import ReportPackageCreate, ReportPackageOut

router = APIRouter()


@router.get("/", response_model=list[ReportPackageOut])
async def list_report_packages(db: AsyncSession = Depends(get_db)) -> list[ReportPackage]:
    tenant_id = get_current_tenant_id()
    res = await db.execute(
        select(ReportPackage).where(ReportPackage.tenant_id == tenant_id).order_by(ReportPackage.id)
    )
    return list(res.scalars().all())


@router.post("/", response_model=ReportPackageOut)
async def create_report_package(
    payload: ReportPackageCreate, db: AsyncSession = Depends(get_db)
) -> ReportPackage:
    item = ReportPackage(name=payload.name, entity_type=payload.entity_type)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
