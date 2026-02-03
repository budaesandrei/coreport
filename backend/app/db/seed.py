from __future__ import annotations

import asyncio
from datetime import date

from sqlalchemy import select

from app.core.context import set_current_tenant_id, set_current_user_name
from app.db.session import SessionLocal
from app.models.entity import Entity
from app.models.org import Org
from app.models.report_package import ReportPackage
from app.models.report_type import ReportType
from app.models.tenant import Tenant
from app.models.user import User


async def _seed() -> None:
    # Seed runs outside request cycle, so set a context explicitly.
    set_current_tenant_id("default")
    set_current_user_name("System")

    async with SessionLocal() as db:
        # Tenant
        existing = await db.execute(select(Tenant).where(Tenant.tenant_id == "default"))
        if not existing.scalars().first():
            db.add(Tenant(name="Default Tenant"))

        # Org
        res = await db.execute(select(Org).where(Org.tenant_id == "default"))
        org = res.scalars().first()
        if not org:
            org = Org(name="Acme Properties")
            db.add(org)
            await db.flush()

        # Users
        res = await db.execute(select(User).where(User.tenant_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    User(user_name="alice", role="TENANT_ADMIN", org_id=org.id),
                    User(user_name="bob", role="SUBMITTER", org_id=org.id),
                    User(user_name="carol", role="APPROVER", org_id=org.id),
                ]
            )

        # Entities
        res = await db.execute(select(Entity).where(Entity.tenant_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    Entity(name="Sunset Towers", entity_type="property", org_id=org.id, external_id="PROP-001"),
                    Entity(name="Riverside Lofts", entity_type="property", org_id=org.id, external_id="PROP-002"),
                ]
            )

        # Report package + types
        res = await db.execute(select(ReportPackage).where(ReportPackage.tenant_id == "default"))
        pkg = res.scalars().first()
        if not pkg:
            pkg = ReportPackage(name="Financial Package", entity_type="property")
            db.add(pkg)
            await db.flush()

        res = await db.execute(select(ReportType).where(ReportType.tenant_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    ReportType(code="rent_roll", name="Rent Roll", entity_type="property", report_package_id=pkg.id),
                    ReportType(code="general_ledger", name="General Ledger", entity_type="property", report_package_id=pkg.id),
                ]
            )

        await db.commit()


def main() -> None:
    asyncio.run(_seed())


if __name__ == "__main__":
    main()
