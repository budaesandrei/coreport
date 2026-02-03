from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.context import get_current_workspace_id
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut

router = APIRouter()


@router.get("/", response_model=list[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)) -> list[User]:
    workspace_id = get_current_workspace_id()
    res = await db.execute(select(User).where(User.workspace_id == workspace_id).order_by(User.id))
    return list(res.scalars().all())


@router.post("/", response_model=UserOut)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> User:
    item = User(user_name=payload.user_name, role=payload.role)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
