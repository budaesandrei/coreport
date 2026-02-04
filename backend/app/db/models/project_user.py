from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    DateTime,
    func,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from app.db.base import Base
from app.schemas.enums import ProjectRole, UserStatus


class ProjectUser(Base):
    __tablename__ = "project_users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=True)
    role = Column(SQLEnum(ProjectRole, name="project_role"), nullable=False)
    status = Column(
        SQLEnum(UserStatus, name="user_status"),
        nullable=False,
        default=UserStatus.INVITED,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_by = Column(String(50), nullable=False, default="system")
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    updated_by = Column(String(50), nullable=False, default="system")

    user = relationship("User", back_populates="project_user")
    provider = relationship("Provider", back_populates="project_user")

    @hybrid_property
    def email(self):
        return self.user.email

    @hybrid_property
    def first_name(self):
        return self.user.first_name

    @hybrid_property
    def last_name(self):
        return self.user.last_name

    @hybrid_property
    def provider_name(self):
        return self.provider.name
