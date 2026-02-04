from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.workspace import Workspace
from app.db.session import get_db
from app.models.auth_user import AuthUser
from app.models.workspace_membership import WorkspaceMembership
from app.schemas.auth import LoginIn, MeOut, RegisterIn, TokenOut
from app.schemas.enums import WorkspaceRole
from app.services.auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/register", response_model=TokenOut)
async def register(payload: RegisterIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    workspace_name = payload.workspace_name.strip()
    workspace_slug = slugify(workspace_name)

    res = await db.execute(select(Workspace).where(Workspace.slug == workspace_slug))
    workspace = res.scalars().first()
    if not workspace:
        workspace = Workspace(name=workspace_name, slug=workspace_slug)
        db.add(workspace)
        await db.flush()

    res = await db.execute(
        select(AuthUser).where(
            AuthUser.workspace_id == workspace_slug, AuthUser.email == payload.email
        )
    )
    existing = res.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = AuthUser(email=payload.email, password_hash=hash_password(payload.password))
    user.workspace_id = workspace_slug
    db.add(user)
    await db.flush()

    # First user to register a workspace becomes an admin member.
    res = await db.execute(
        select(WorkspaceMembership).where(WorkspaceMembership.workspace_id == workspace_slug)
    )
    if not res.scalars().first():
        db.add(WorkspaceMembership(auth_user_id=user.id, role=WorkspaceRole.admin))

    await db.commit()

    token = create_access_token(
        workspace_id=workspace.id,
        workspace_slug=workspace.slug,
        email=payload.email,
    )
    return TokenOut(access_token=token)


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    workspace_slug = payload.workspace_slug.strip()

    res = await db.execute(select(Workspace).where(Workspace.slug == workspace_slug))
    workspace = res.scalars().first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    res = await db.execute(
        select(AuthUser).where(
            AuthUser.workspace_id == workspace_slug, AuthUser.email == payload.email
        )
    )
    user = res.scalars().first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(
        workspace_id=workspace.id,
        workspace_slug=workspace.slug,
        email=payload.email,
    )
    return TokenOut(access_token=token)


@router.get("/me", response_model=MeOut)
async def me(token: str = Depends(oauth2_scheme)) -> MeOut:
    try:
        data = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return MeOut(
        workspace_id=int(data["workspace_id"]),
        workspace_slug=str(data["workspace_slug"]),
        email=str(data["sub"]),
    )
