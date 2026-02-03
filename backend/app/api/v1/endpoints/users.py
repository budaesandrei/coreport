from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_tenant_id
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut

router = APIRouter()


@router.get("/", response_model=list[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)) -> list[User]:
    tenant_id = get_current_tenant_id()
    res = await db.execute(select(User).where(User.tenant_id == tenant_id).order_by(User.id))
    return list(res.scalars().all())


@router.post("/", response_model=UserOut)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> User:
    item = User(user_name=payload.user_name, role=payload.role, org_id=payload.org_id)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
