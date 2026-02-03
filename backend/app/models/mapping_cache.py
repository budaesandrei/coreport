from __future__ import annotations

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class MappingCache(Base, BaseMixin):
    user_id: Mapped[int] = mapped_column(index=True)
    org_id: Mapped[int] = mapped_column(index=True)
    report_type_id: Mapped[int] = mapped_column(index=True)
    file_fingerprint: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    mapping_spec: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    confidence: Mapped[float] = mapped_column(nullable=False, default=0.0)
