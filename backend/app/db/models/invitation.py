from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, JSON, Text
from sqlalchemy.types import Enum as SQLEnum
from app.db.base import Base
from app.schemas.enums import ProjectRole, InvitationType
from sqlalchemy.orm import relationship


class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(Text, unique=True, nullable=False)
    email = Column(String(100), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    role = Column(SQLEnum(ProjectRole, name="project_role"), nullable=False)
    invitation_type = Column(
        SQLEnum(InvitationType, name="invitation_type"),
        nullable=False,
        default=InvitationType.INVITE,
    )
    expires_at = Column(DateTime(timezone=True), nullable=False)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    meta_info = Column(JSON, nullable=True)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    created_by = Column(String(50), nullable=False, default="system")
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    updated_by = Column(String(50), nullable=False, default="system")

    project = relationship("Project", backref="invitations", lazy="selectin")
