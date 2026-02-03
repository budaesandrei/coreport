from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.schemas.project import ProjectInfoOut, ProjectResolveRequest, ProjectOut
from app.schemas.register import RegisterProjectRequest
from app.db.models.user import User
from app.db.models.project import Project
from app.db.models.invitation import Invitation
from app.db.models.project_user import ProjectUser
from app.schemas.enums import (
    ProjectStatus,
    ProjectRole,
    UserStatus,
    InvitationType,
    ExpiryPreset,
    GlobalUserRole,
)
from slugify import slugify

from app.utils.time import parse_expires_in
from app.utils.token import generate_invite_token
from app.utils.email import send_registration_email

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/register", response_model=ProjectOut)
async def register_project(
    payload: RegisterProjectRequest,
    db: AsyncSession = Depends(get_db),
):
    slug = slugify(payload.project_name)

    # Check if user already exists
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalars().first()

    if not user:
        user = User(
            email=payload.email,
            first_name=payload.first_name,
            last_name=payload.last_name,
            global_role=GlobalUserRole.USER,
            created_by="system",
            updated_by="system",
        )
        db.add(user)
        await db.flush()

    # Check if the user already has a project with the same slug
    result = await db.execute(
        select(Project).where(Project.slug == slug, Project.created_by == payload.email)
    )
    existing_project = result.scalars().first()
    if existing_project:
        # Check if there's a pending invitation
        result = await db.execute(
            select(Invitation).where(
                Invitation.email == payload.email,
                Invitation.project_id == existing_project.id,
                Invitation.accepted_at == None,
            )
        )
        existing_invite = result.scalars().first()
        if existing_invite:
            raise HTTPException(
                status_code=400,
                detail="You’ve already initiated a registration for this project. Check your inbox.",
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="You’ve already registered a project with this name.",
            )

    # Create project
    project = Project(
        name=payload.project_name,
        slug=slug,
        status=payload.status,
        created_by=payload.email,
        updated_by=payload.email,
    )
    db.add(project)
    await db.flush()

    # Link user to project as admin
    project_user = ProjectUser(
        user_id=user.id,
        project_id=project.id,
        role=ProjectRole.PROJECT_ADMIN,
        status=UserStatus.INVITED,
        created_by="system",
        updated_by="system",
    )
    db.add(project_user)

    expires_in = ExpiryPreset.SEVEN_DAYS
    expires_at = parse_expires_in(expires_in)

    # Create invitation
    invite_token = generate_invite_token(
        user_id=user.id,
        email=payload.email,
        project_id=project.id,
        role=ProjectRole.PROJECT_ADMIN,
        invitation_type=InvitationType.PROJECT_REGISTRATION,
        expires_at=expires_at,
    )

    invitation = Invitation(
        token=invite_token,
        email=payload.email,
        project_id=project.id,
        role=ProjectRole.PROJECT_ADMIN,
        invitation_type=InvitationType.PROJECT_REGISTRATION,
        expires_at=expires_at,
        created_by="system",
        updated_by="system",
    )
    db.add(invitation)

    await db.commit()

    # Send email
    send_registration_email(
        payload.email, payload.first_name, payload.project_name, invite_token
    )

    await db.refresh(project)
    return project


@router.post("/resolve", response_model=ProjectInfoOut)
async def resolve_project(
    payload: ProjectResolveRequest,
    db: AsyncSession = Depends(get_db),
):
    slug = slugify(payload.name)
    result = await db.execute(select(Project).where(Project.slug == slug))
    project = result.scalars().first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != ProjectStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Project is not active")

    return project
