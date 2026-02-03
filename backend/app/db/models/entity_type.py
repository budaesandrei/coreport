from app.db.base import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    func,
    UniqueConstraint,
    Boolean,
)
from sqlalchemy.orm import relationship


class EntityType(Base):
    __tablename__ = "entity_types"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)
    is_deleted = Column(Boolean, nullable=False, default=False)
    deleted_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True,
    )
    deleted_by = Column(String(50), nullable=True)

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

    __table_args__ = (
        UniqueConstraint("project_id", "name", name="uq_entitytype_project_name"),
    )
