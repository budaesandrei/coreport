from app.db.base import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    DateTime,
    func,
    UniqueConstraint,
)
from app.schemas.enums import EntityAttributeType
from sqlalchemy.types import Enum as SQLEnum
from sqlalchemy.orm import relationship


class EntityAttribute(Base):
    __tablename__ = "entity_attributes"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    entity_type_id = Column(Integer, ForeignKey("entity_types.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    is_primary = Column(Boolean, nullable=False, default=False)
    type = Column(
        SQLEnum(EntityAttributeType, name="entity_attribute_type"),
        nullable=False,
        default=EntityAttributeType.TEXT,
    )
    required = Column(Boolean, nullable=False, default=False)
    attribute_order = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_by = Column(String(50), nullable=False, default="system")
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    updated_by = Column(String(50), nullable=False, default="system")

    __table_args__ = (
        UniqueConstraint(
            "project_id",
            "entity_type_id",
            "name",
            name="uq_project_entitytype_attribute_name",
        ),
    )
