from __future__ import annotations

import asyncio

from sqlalchemy import select

from app.core.context import set_current_workspace_id, set_current_user_name
from app.db.session import SessionLocal
from app.db.models.workspace import Workspace
from app.models.auth_user import AuthUser
from app.models.entity import Entity
from app.models.report_package import ReportPackage
from app.models.report_type import ReportType
from app.models.user import User
from app.services.auth import hash_password


async def _seed() -> None:
    # Seed runs outside request cycle, so set a context explicitly.
    set_current_workspace_id("default")
    set_current_user_name("System")

    dev_email = "alice@example.com"
    dev_password = "dev-password"

    async with SessionLocal() as db:
        # Workspace
        res = await db.execute(select(Workspace).where(Workspace.slug == "default"))
        if not res.scalars().first():
            db.add(Workspace(name="Default Workspace", slug="default"))
            await db.flush()

        # Local auth user (dev): alice@example.com / dev-password
        res = await db.execute(
            select(AuthUser).where(AuthUser.workspace_id == "default", AuthUser.email == dev_email)
        )
        if not res.scalars().first():
            db.add(AuthUser(email=dev_email, password_hash=hash_password(dev_password)))

        # App users
        res = await db.execute(select(User).where(User.workspace_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    User(user_name="alice", role="WORKSPACE_ADMIN"),
                    User(user_name="bob", role="SUBMITTER"),
                    User(user_name="carol", role="APPROVER"),
                ]
            )

        # Entity Types
        from app.models.entity_type import EntityType

        res = await db.execute(
            select(EntityType).where(EntityType.workspace_id == "default", EntityType.is_deleted == False)
        )
        if not res.scalars().first():
            db.add_all(
                [
                    EntityType(
                        workspace_id="default",
                        name="Property",
                        description="A real estate asset / property",
                        is_active=True,
                        created_by="system",
                        updated_by="system",
                    )
                ]
            )

        # Entities
        res = await db.execute(select(Entity).where(Entity.workspace_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    Entity(name="Sunset Towers", entity_type="Property", external_id="PROP-001"),
                    Entity(name="Riverside Lofts", entity_type="Property", external_id="PROP-002"),
                ]
            )

        # Report package + types
        res = await db.execute(select(ReportPackage).where(ReportPackage.workspace_id == "default"))
        pkg = res.scalars().first()
        if not pkg:
            pkg = ReportPackage(name="Financial Package", entity_type="property")
            db.add(pkg)
            await db.flush()

        res = await db.execute(select(ReportType).where(ReportType.workspace_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    ReportType(code="rent_roll", name="Rent Roll", entity_type="property", report_package_id=pkg.id),
                    ReportType(
                        code="general_ledger",
                        name="General Ledger",
                        entity_type="property",
                        report_package_id=pkg.id,
                    ),
                ]
            )

        await db.commit()

    print("Seed complete.")
    print(f"Dev auth user: {dev_email} / {dev_password}")
    print('Dev workspace: X-Workspace-Id = "default"')


def main() -> None:
    asyncio.run(_seed())


if __name__ == "__main__":
    main()
