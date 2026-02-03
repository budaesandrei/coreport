from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class Entity(Base, BaseMixin):
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False, default="property")
    org_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    external_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
