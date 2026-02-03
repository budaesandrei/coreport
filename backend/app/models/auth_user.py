from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class AuthUser(Base, BaseMixin):
    """Local auth user (dev).

    Scoped by tenant_id (tenant == project).
    """

    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
