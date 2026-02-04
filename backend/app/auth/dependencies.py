from jose import JWTError
from fastapi import Security, HTTPException, status, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel
from app.core.config import get_settings
from functools import lru_cache
from app.db.session import get_db
from app.db.models.user import User
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.project_user import ProjectUser
from app.schemas.enums import UserStatus
from fastapi.security import APIKeyHeader
import boto3

settings = get_settings()

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=settings.COGNITO_AUTHORIZATION_URL,
    tokenUrl=settings.COGNITO_TOKEN_URL,
    scheme_name="Cognito",
    scopes={
        "openid": "OpenID",
        "email": "Email",
        "profile": "Profile",
    },
)
project_header_scheme = APIKeyHeader(name="X-Project-Id", auto_error=True)


class CognitoUser(BaseModel):
    project_user_id: int
    project_id: int
    project_user_role: str
    email: str


@lru_cache()
def get_cognito_user(token: str) -> str:
    cognito = boto3.client("cognito-idp", region_name=settings.COGNITO_USER_POOL_REGION)
    response = cognito.get_user(AccessToken=token)
    return response


async def get_current_user(
    token: str = Security(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    x_project_id: str = Security(project_header_scheme),
) -> CognitoUser:
    try:
        project_id = int(x_project_id or 0)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="X-Project-Id header must be an integer"
        )

    if not project_id or int(project_id) <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-Project-Id header is required and must be a positive integer",
        )

    try:
        response = get_cognito_user(token)
        user_attributes = response.get("UserAttributes", [])

        email = next((attr["Value"] for attr in user_attributes if attr["Name"] == "email"), "")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not found in token"
            )

        # Fetch user from DB
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail=f"User with email {email} not found"
            )

        # Fetch project user entry
        result = await db.execute(
            select(ProjectUser).where(
                ProjectUser.user_id == user.id, ProjectUser.project_id == project_id
            )
        )
        project_user = result.scalar_one_or_none()

        if not project_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User is not a member of project {project_id}",
            )

        if project_user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User is not active in project {project_id}",
            )

        return CognitoUser(
            project_user_id=project_user.id,
            project_id=project_id,
            project_user_role=project_user.role,
            email=email,
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )
