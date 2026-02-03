from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_tenant_id
from app.db.session import get_db
from app.models.report_type import ReportType
from app.schemas.report_type import ReportTypeCreate, ReportTypeOut

router = APIRouter()


@router.get("/", response_model=list[ReportTypeOut])
async def list_report_types(db: AsyncSession = Depends(get_db)) -> list[ReportType]:
    tenant_id = get_current_tenant_id()
    res = await db.execute(select(ReportType).where(ReportType.tenant_id == tenant_id).order_by(ReportType.id))
    return list(res.scalars().all())


@router.post("/", response_model=ReportTypeOut)
async def create_report_type(payload: ReportTypeCreate, db: AsyncSession = Depends(get_db)) -> ReportType:
    item = ReportType(
        code=payload.code,
        name=payload.name,
        entity_type=payload.entity_type,
        report_package_id=payload.report_package_id,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
