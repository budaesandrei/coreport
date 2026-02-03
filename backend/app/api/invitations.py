from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from jwt import ExpiredSignatureError, InvalidTokenError

from app.db.session import get_db
from app.db.models.invitation import Invitation
from app.db.models.project_user import ProjectUser
from app.schemas.invitation import InvitationOut
from app.utils.token import decode_invite_token
from app.schemas.enums import InvitationType, UserStatus

router = APIRouter(prefix="/invitations", tags=["Invitations"])


@router.get("/{token}", response_model=InvitationOut)
async def get_invitation_by_token(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        decode_invite_token(token)
    except ExpiredSignatureError:
        raise HTTPException(status_code=410, detail="Invitation link has expired.")
    except InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid or malformed token.")

    result = await db.execute(
        select(Invitation)
        .options(selectinload(Invitation.project))
        .where(Invitation.token == token)
    )
    invitation = result.scalars().first()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found.")

    if invitation.accepted_at:
        if invitation.invitation_type == InvitationType.INVITE:
            raise HTTPException(status_code=409, detail="Invitation already accepted.")
        elif invitation.invitation_type == InvitationType.PROJECT_REGISTRATION:
            raise HTTPException(
                status_code=409, detail="Project registration already completed."
            )

    return invitation


@router.patch("/{token}/accept", response_model=InvitationOut)
async def accept_invitation(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        decoded = decode_invite_token(token)
    except ExpiredSignatureError:
        raise HTTPException(status_code=410, detail="Link has expired.")
    except InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid or malformed token.")

    result = await db.execute(select(Invitation).where(Invitation.token == token))
    invitation = result.scalars().first()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found.")

    if invitation.accepted_at:
        if invitation.invitation_type == InvitationType.INVITE:
            raise HTTPException(status_code=409, detail="Invitation already accepted.")
        elif invitation.invitation_type == InvitationType.PROJECT_REGISTRATION:
            raise HTTPException(
                status_code=409, detail="Project registration already completed."
            )

    invitation.accepted_at = datetime.now(timezone.utc)
    invitation.updated_by = decoded["sub"]

    result = await db.execute(
        select(ProjectUser).where(
            ProjectUser.user_id == decoded["user_id"],
            ProjectUser.project_id == invitation.project_id,
        )
    )
    project_user = result.scalars().first()
    project_user.status = UserStatus.ACTIVE

    await db.commit()
    await db.refresh(invitation)

    return invitation
