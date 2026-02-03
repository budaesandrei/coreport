from __future__ import annotations

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class Submission(Base, BaseMixin):
    entity_id: Mapped[int] = mapped_column(index=True)
    report_type_id: Mapped[int] = mapped_column(index=True)
    submission_period_id: Mapped[int] = mapped_column(index=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="draft")
    payload: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
