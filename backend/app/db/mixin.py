from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, declared_attr, mapped_column

from app.core.context import get_current_user_name, get_current_workspace_id
from app.utils.naming import pascal_case_to_snake_case_plural


class BaseMixin:
    @declared_attr.directive
    def __tablename__(cls) -> str:  # noqa: N805
        return pascal_case_to_snake_case_plural(cls.__name__)

    @declared_attr
    def id(cls) -> Mapped[int]:  # noqa: N805
        return mapped_column(primary_key=True, autoincrement=True, sort_order=-1)

    workspace_id: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        default=get_current_workspace_id,
        index=True,
        sort_order=500,
    )

    insert_by: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default=get_current_user_name,
        sort_order=501,
    )
    insert_dt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        sort_order=502,
    )

    update_by: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default=get_current_user_name,
        onupdate=get_current_user_name,
        sort_order=503,
    )
    update_dt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
        sort_order=504,
    )
