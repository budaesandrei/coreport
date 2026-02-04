from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.auth_user import AuthUser
from app.models.workspace_membership import WorkspaceMembership
from app.models.workspace_setting import WorkspaceSetting
from app.schemas.enums import WorkspaceRole
from app.schemas.workspace_settings import WorkspaceSettingsOut, WorkspaceSettingsUpdateIn
from app.services.auth import decode_access_token

router = APIRouter(prefix="/workspace_settings", tags=["workspace-settings"])

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


async def _require_workspace_admin(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> dict:
    """Require admin membership in the workspace.

    Backwards-compatible behavior: if the workspace has no memberships yet,
    the first auth user is promoted to admin and a membership row is created.
    """

    ctx = await _require_workspace_user(db=db, token=token)
    workspace_slug = ctx["workspace_slug"]

    res = await db.execute(
        select(WorkspaceMembership).where(
            WorkspaceMembership.workspace_id == workspace_slug,
            WorkspaceMembership.auth_user_id == ctx["auth_user_id"],
        )
    )
    membership = res.scalars().first()
    if membership and membership.role == WorkspaceRole.admin:
        return ctx

    # Auto-heal initial admin if no memberships exist yet.
    res = await db.execute(
        select(WorkspaceMembership).where(WorkspaceMembership.workspace_id == workspace_slug)
    )
    any_membership = res.scalars().first()
    if not any_membership:
        res = await db.execute(
            select(AuthUser)
            .where(AuthUser.workspace_id == workspace_slug)
            .order_by(AuthUser.id.asc())
            .limit(1)
        )
        first_user = res.scalars().first()
        if first_user and first_user.id == ctx["auth_user_id"]:
            membership = WorkspaceMembership(
                auth_user_id=ctx["auth_user_id"],
                role=WorkspaceRole.admin,
            )
            membership.workspace_id = workspace_slug
            db.add(membership)
            await db.commit()
            return ctx

    raise HTTPException(status_code=403, detail="Admin privileges required")


async def _get_or_create_settings(db: AsyncSession, workspace_slug: str) -> WorkspaceSetting:
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


@router.get("", response_model=WorkspaceSettingsOut)
async def get_workspace_settings(
    db: AsyncSession = Depends(get_db),
    ctx: dict = Depends(_require_workspace_user),
) -> WorkspaceSettingsOut:
    settings = await _get_or_create_settings(db, ctx["workspace_slug"])
    return WorkspaceSettingsOut(canonical_data_language=settings.canonical_data_language)


@router.patch("", response_model=WorkspaceSettingsOut)
async def update_workspace_settings(
    payload: WorkspaceSettingsUpdateIn,
    db: AsyncSession = Depends(get_db),
    ctx: dict = Depends(_require_workspace_admin),
) -> WorkspaceSettingsOut:
    settings = await _get_or_create_settings(db, ctx["workspace_slug"])
    settings.canonical_data_language = payload.canonical_data_language.strip()
    await db.commit()
    await db.refresh(settings)
    return WorkspaceSettingsOut(canonical_data_language=settings.canonical_data_language)


@router.put("", response_model=WorkspaceSettingsOut)
async def put_workspace_settings(
    payload: WorkspaceSettingsUpdateIn,
    db: AsyncSession = Depends(get_db),
    ctx: dict = Depends(_require_workspace_admin),
) -> WorkspaceSettingsOut:
    return await update_workspace_settings(payload=payload, db=db, ctx=ctx)
