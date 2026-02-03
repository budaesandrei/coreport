from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from app.db.models.project_user import ProjectUser
from app.db.models.project import Project
from app.db.models.user import User
from app.db.models.provider import Provider
from app.db.models.invitation import Invitation
from app.db.session import get_db
from app.schemas.project_user import (
    ProjectUserOut,
    ProjectUserCreate,
    ProjectUserUpdate,
)
from app.auth.dependencies import get_current_user, CognitoUser
from app.schemas.enums import ProjectRole, GlobalUserRole, UserStatus
from app.utils.time import parse_expires_in, ExpiryPreset
from app.utils.token import generate_invite_token
from app.schemas.enums import InvitationType
from app.utils.email import send_invite_email


router = APIRouter(prefix="/project_users", tags=["Project Users"])


@router.get("", response_model=list[ProjectUserOut])
async def get_project_users(
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(ProjectUser)
        .options(
            joinedload(ProjectUser.user),
            joinedload(ProjectUser.provider),
        )
        .where(ProjectUser.project_id == current_user.project_id)
    )
    project_users = result.scalars().all()
    return project_users


@router.get("/{project_user_id}", response_model=ProjectUserOut)
async def get_project_user(
    project_user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(ProjectUser)
        .options(
            joinedload(ProjectUser.user),
            joinedload(ProjectUser.provider),
        )
        .where(
            ProjectUser.project_id == current_user.project_id,
            ProjectUser.id == project_user_id,
        )
    )
    project_users = result.scalar_one_or_none()

    if not project_users:
        raise HTTPException(status_code=404, detail="User not found")

    return project_users


@router.post("", response_model=ProjectUserOut)
async def create_project_user(
    payload: ProjectUserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.first_name or payload.first_name == "":
        raise HTTPException(status_code=400, detail="First name is required")

    if not payload.last_name or payload.last_name == "":
        raise HTTPException(status_code=400, detail="Last name is required")

    if not payload.email or payload.email == "":
        raise HTTPException(status_code=400, detail="Email is required")

    result = await db.execute(
        select(User).where(func.lower(User.email) == payload.email.lower())
    )
    user = result.scalars().first()

    if not user:
        user = User(
            email=payload.email,
            first_name=payload.first_name,
            last_name=payload.last_name,
            global_role=GlobalUserRole.USER,
            created_by=current_user.email,
            updated_by=current_user.email,
        )
        db.add(user)
        await db.flush()

    result = await db.execute(
        select(ProjectUser).where(
            ProjectUser.user_id == user.id,
            ProjectUser.project_id == current_user.project_id,
        )
    )
    existing_project_user = result.scalars().first()

    if existing_project_user:
        raise HTTPException(
            status_code=400, detail="User already exists in current project"
        )

    project_user = ProjectUser(
        user_id=user.id,
        project_id=current_user.project_id,
        role=payload.role,
        status=UserStatus.INVITED,
        created_by=current_user.email,
        updated_by=current_user.email,
    )
    db.add(project_user)

    expires_in = ExpiryPreset.SEVEN_DAYS
    expires_at = parse_expires_in(expires_in)

    invite_token = generate_invite_token(
        user_id=user.id,
        email=payload.email,
        project_id=current_user.project_id,
        role=payload.role,
        invitation_type=InvitationType.INVITE,
        expires_at=expires_at,
    )

    invitation = Invitation(
        token=invite_token,
        email=payload.email,
        project_id=current_user.project_id,
        role=payload.role,
        invitation_type=InvitationType.INVITE,
        expires_at=expires_at,
        created_by=current_user.email,
        updated_by=current_user.email,
    )
    db.add(invitation)

    await db.commit()

    result = await db.execute(
        select(Project).where(Project.id == current_user.project_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    send_invite_email(payload.email, payload.first_name, project.name, invite_token)

    await db.refresh(project_user, attribute_names=["user", "provider"])
    return project_user


@router.patch("/{project_user_id}", response_model=ProjectUserOut)
async def update_project_user(
    project_user_id: int,
    payload: ProjectUserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    if not payload.first_name or payload.first_name == "":
        raise HTTPException(status_code=400, detail="First name is required")

    if not payload.last_name or payload.last_name == "":
        raise HTTPException(status_code=400, detail="Last name is required")

    result = await db.execute(
        select(ProjectUser)
        .options(
            joinedload(ProjectUser.user),
            joinedload(ProjectUser.provider),
        )
        .where(
            ProjectUser.project_id == current_user.project_id,
            ProjectUser.id == project_user_id,
        )
    )
    existing_project_user = result.scalar_one_or_none()

    if not existing_project_user:
        raise HTTPException(status_code=404, detail="User not found")

    old_status, new_status = existing_project_user.status, payload.status

    if UserStatus.INVITED in [old_status, new_status] and old_status != new_status:
        raise HTTPException(
            status_code=400,
            detail="Invalid status change",
        )

    existing_project_user.user.first_name = payload.first_name
    existing_project_user.user.last_name = payload.last_name
    existing_project_user.role = payload.role
    existing_project_user.status = payload.status
    existing_project_user.updated_by = current_user.email

    if payload.provider_name:
        result = await db.execute(
            select(Provider).where(
                Provider.project_id == current_user.project_id,
                Provider.name == payload.provider_name,
                Provider.is_active == True,
                Provider.is_deleted == False,
            )
        )
        provider = result.scalar_one_or_none()

        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found")
        existing_project_user.provider_id = provider.id

    await db.commit()

    await db.refresh(existing_project_user)
    await db.refresh(existing_project_user, attribute_names=["user", "provider"])

    return existing_project_user


@router.delete("/{project_user_id}", status_code=204)
async def delete_project_user(
    project_user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: CognitoUser = Depends(get_current_user),
):
    if current_user.project_user_role != ProjectRole.PROJECT_ADMIN:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    result = await db.execute(
        select(ProjectUser).where(
            ProjectUser.id == project_user_id,
            ProjectUser.project_id == current_user.project_id,
        )
    )
    project_user = result.scalar_one_or_none()

    if not project_user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(project_user)
    await db.commit()

    return {"message": "User deleted successfully"}
