from __future__ import annotations

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class ValidationRule(Base, BaseMixin):
    report_type_id: Mapped[int] = mapped_column(index=True)
    field_key: Mapped[str] = mapped_column(String(128), nullable=False)
    rule_type: Mapped[str] = mapped_column(String(64), nullable=False)
    rule_params: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
