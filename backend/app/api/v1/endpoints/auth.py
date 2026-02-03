from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.auth_user import AuthUser
from app.db.models.project import Project
from app.schemas.auth import LoginIn, MeOut, RegisterIn, TokenOut
from app.services.auth import create_access_token, decode_access_token, hash_password, verify_password
from slugify import slugify

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/register", response_model=TokenOut)
async def register(payload: RegisterIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    # Create/resolve project
    project_name = payload.project_name.strip()
    slug = slugify(project_name)

    res = await db.execute(select(Project).where(Project.slug == slug))
    project = res.scalars().first()
    if not project:
        project = Project(name=project_name, slug=slug)
        db.add(project)
        await db.flush()

    # Create user scoped to tenant (tenant_id == project/workspace slug)
    tenant_key = str(project.slug)
    res = await db.execute(
        select(AuthUser).where(AuthUser.tenant_id == tenant_key, AuthUser.email == payload.email)
    )
    existing = res.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = AuthUser(email=payload.email, password_hash=hash_password(payload.password))
    user.tenant_id = tenant_key
    db.add(user)
    await db.commit()

    token = create_access_token(project_id=project.id, tenant_id=tenant_key, email=payload.email)
    return TokenOut(access_token=token)


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    res = await db.execute(select(Project).where(Project.id == payload.project_id))
    project = res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tenant_key = str(project.slug)
    res = await db.execute(
        select(AuthUser).where(AuthUser.tenant_id == tenant_key, AuthUser.email == payload.email)
    )
    user = res.scalars().first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(project_id=project.id, tenant_id=tenant_key, email=payload.email)
    return TokenOut(access_token=token)


@router.get("/me", response_model=MeOut)
async def me(token: str = Depends(oauth2_scheme)) -> MeOut:
    data = decode_access_token(token)
    return MeOut(project_id=int(data["project_id"]), tenant_id=str(data["tenant_id"]), email=str(data["sub"]))
