from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixin import BaseMixin


class UploadJob(Base, BaseMixin):
    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="uploaded")
    org_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    entity_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    report_type_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
