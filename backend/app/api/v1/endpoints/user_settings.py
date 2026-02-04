from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.auth_user import AuthUser
from app.models.user_setting import UserSetting
from app.models.workspace_setting import WorkspaceSetting
from app.schemas.user_settings import UserSettingsOut, UserSettingsUpdateIn
from app.services.auth import decode_access_token

router = APIRouter(prefix="/user_settings", tags=["user-settings"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def _require_workspace_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> dict:
    try:
        data = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")

    workspace_slug = str(data["workspace_slug"])
    email = str(data["sub"])

    res = await db.execute(
        select(AuthUser).where(AuthUser.workspace_id == workspace_slug, AuthUser.email == email)
    )
    auth_user = res.scalars().first()
    if not auth_user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"workspace_slug": workspace_slug, "email": email, "auth_user_id": auth_user.id}


async def _get_or_create_workspace_settings(
    db: AsyncSession, workspace_slug: str
) -> WorkspaceSetting:
    res = await db.execute(
        select(WorkspaceSetting).where(WorkspaceSetting.workspace_id == workspace_slug)
    )
    settings = res.scalars().first()
    if settings:
        return settings

    settings = WorkspaceSetting(canonical_data_language="en")
    settings.workspace_id = workspace_slug
    db.add(settings)
    await db.commit()
    await db.refresh(settings)
    return settings


async def _get_or_create_user_settings(
    db: AsyncSession, workspace_slug: str, auth_user_id: int
) -> UserSetting:
    res = await db.execute(
        select(UserSetting).where(
            UserSetting.workspace_id == workspace_slug,
            UserSetting.auth_user_id == auth_user_id,
        )
    )
    settings = res.scalars().first()
    if settings:
        return settings

    ws_settings = await _get_or_create_workspace_settings(db, workspace_slug)

    settings = UserSetting(auth_user_id=auth_user_id, ui_language=ws_settings.canonical_data_language)
    settings.workspace_id = workspace_slug
    db.add(settings)
    await db.commit()
    await db.refresh(settings)
    return settings


@router.get("", response_model=UserSettingsOut)
async def get_user_settings(
    db: AsyncSession = Depends(get_db),
    ctx: dict = Depends(_require_workspace_user),
) -> UserSettingsOut:
    settings = await _get_or_create_user_settings(db, ctx["workspace_slug"], ctx["auth_user_id"])
    return UserSettingsOut(ui_language=settings.ui_language)


@router.patch("", response_model=UserSettingsOut)
async def update_user_settings(
    payload: UserSettingsUpdateIn,
    db: AsyncSession = Depends(get_db),
    ctx: dict = Depends(_require_workspace_user),
) -> UserSettingsOut:
    settings = await _get_or_create_user_settings(db, ctx["workspace_slug"], ctx["auth_user_id"])
    settings.ui_language = payload.ui_language.strip()
    await db.commit()
    await db.refresh(settings)
    return UserSettingsOut(ui_language=settings.ui_language)


@router.put("", response_model=UserSettingsOut)
async def put_user_settings(
    payload: UserSettingsUpdateIn,
    db: AsyncSession = Depends(get_db),
    ctx: dict = Depends(_require_workspace_user),
) -> UserSettingsOut:
    return await update_user_settings(payload=payload, db=db, ctx=ctx)
