from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class ApprovalComment(Base, BaseMixin):
    submission_id: Mapped[int] = mapped_column(index=True)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    decision: Mapped[str] = mapped_column(String(64), nullable=False, default="comment")
