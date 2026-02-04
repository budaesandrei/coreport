import jwt
from datetime import datetime, timedelta, timezone
from app.schemas.enums import InvitationType, ProjectRole

from app.core.config import get_settings

settings = get_settings()

SECRET_KEY = settings.INVITATION_TOKEN_SECRET
ALGORITHM = "HS256"


def generate_invite_token(
    user_id: int,
    email: str,
    project_id: int,
    role: ProjectRole,
    invitation_type: InvitationType,
    expires_at: datetime,
) -> str:
    payload = {
        "user_id": user_id,
        "sub": email,
        "project_id": project_id,
        "role": role,
        "invitation_type": invitation_type,
        "exp": expires_at,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_invite_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
