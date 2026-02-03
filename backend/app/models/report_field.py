from __future__ import annotations

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class ReportField(Base, BaseMixin):
    report_type_id: Mapped[int] = mapped_column(index=True)
    field_key: Mapped[str] = mapped_column(String(128), nullable=False)
    field_type: Mapped[str] = mapped_column(String(64), nullable=False, default="string")
    required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
