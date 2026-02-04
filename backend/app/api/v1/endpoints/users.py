from __future__ import annotations

import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.context import get_current_workspace_id
from app.db.session import get_db
from app.models.auth_user import AuthUser
from app.models.user import User
from app.models.workspace_membership import WorkspaceMembership
from app.schemas.enums import WorkspaceRole
from app.schemas.user import AdminUserCreateIn, AdminUserCreateOut, UserCreate, UserOut
from app.services.auth import decode_access_token, hash_password
from app.services.mailer import send_email
from app.services.roles import coerce_workspace_role

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def _generate_temp_password(length: int = 16) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


async def _require_workspace_admin(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> dict:
    """Require admin membership in the workspace.

    Backwards-compatible behavior: if the workspace has no memberships yet,
    the first auth user is promoted to admin and a membership row is created.
    """

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

    res = await db.execute(
        select(WorkspaceMembership).where(
            WorkspaceMembership.workspace_id == workspace_slug,
            WorkspaceMembership.auth_user_id == auth_user.id,
        )
    )
    membership = res.scalars().first()
    if membership and membership.role == WorkspaceRole.admin:
        return {"workspace_slug": workspace_slug, "email": email, "auth_user_id": auth_user.id}

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
        if first_user and first_user.id == auth_user.id:
            db.add(WorkspaceMembership(auth_user_id=auth_user.id, role=WorkspaceRole.admin))
            await db.commit()
            return {"workspace_slug": workspace_slug, "email": email, "auth_user_id": auth_user.id}

    raise HTTPException(status_code=403, detail="Admin privileges required")


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


@router.post("/admin-create", response_model=AdminUserCreateOut)
async def admin_create_user(
    payload: AdminUserCreateIn,
    db: AsyncSession = Depends(get_db),
    admin_ctx: dict = Depends(_require_workspace_admin),
) -> AdminUserCreateOut:
    """Create a new AuthUser in the admin's workspace and email credentials (MailHog in dev)."""

    workspace_slug = admin_ctx["workspace_slug"]

    res = await db.execute(
        select(AuthUser).where(
            AuthUser.workspace_id == workspace_slug, AuthUser.email == payload.email
        )
    )
    existing = res.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    temp_password = payload.password or _generate_temp_password()

    auth_user = AuthUser(email=payload.email, password_hash=hash_password(temp_password))
    auth_user.workspace_id = workspace_slug
    db.add(auth_user)
    await db.flush()

    # Membership + role enforcement uses this table.
    membership_role = coerce_workspace_role(payload.role)
    db.add(WorkspaceMembership(auth_user_id=auth_user.id, role=membership_role))

    # Create corresponding workspace user record (legacy table used elsewhere in the app).
    user = User(user_name=payload.email, role=payload.role)
    user.workspace_id = workspace_slug
    db.add(user)

    await db.commit()

    subject = f"You're invited to Coreport ({workspace_slug})"
    login_url = f"{settings.APP_DOMAIN_URL}/login"
    text_body = (
        f"You've been invited to Coreport.\n\n"
        f"Workspace: {workspace_slug}\n"
        f"Email: {payload.email}\n"
        f"Temporary password: {temp_password}\n\n"
        f"Login: {login_url}\n"
        f"(Please change your password after logging in.)\n"
    )

    email_debug: dict | None = None
    try:
        email_debug = send_email(to_email=payload.email, subject=subject, text_body=text_body)
        email_sent = True
    except Exception as e:  # pragma: no cover
        # In dev we still return the payload to help debugging.
        email_debug = {
            "error": str(e),
            "to": payload.email,
            "subject": subject,
            "text_body": text_body,
        }
        email_sent = False

    return AdminUserCreateOut(
        email=payload.email,
        role=payload.role,
        email_sent=email_sent,
        email_debug=email_debug,
    )
