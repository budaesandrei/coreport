from sqlalchemy import Column, Integer, String, DateTime, func, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.schemas.enums import GlobalUserRole


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    global_role = Column(
        SQLEnum(GlobalUserRole, name="global_user_role"),
        nullable=False,
        default=GlobalUserRole.USER,
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

    project_user = relationship("ProjectUser", back_populates="user")
