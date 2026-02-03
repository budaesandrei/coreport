from sqlalchemy import Column, Integer, String, DateTime, func, Enum as SQLEnum
from app.db.base import Base
from app.schemas.enums import ProjectStatus


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    status = Column(
        SQLEnum(ProjectStatus, name="project_status"),
        nullable=False,
        default=ProjectStatus.ACTIVE,
    )

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
