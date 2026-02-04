from __future__ import annotations

import asyncio

from sqlalchemy import select

from app.core.context import set_current_workspace_id, set_current_user_name
from app.db.session import SessionLocal
from app.db.models.workspace import Workspace
from app.models.auth_user import AuthUser
from app.models.entity import Entity
from app.models.entity_assignment import EntityAssignment, EntityAssignmentRole
from app.models.report_package import ReportPackage
from app.models.report_type import ReportType
from app.models.user import User
from app.models.workspace_membership import WorkspaceMembership
from app.schemas.enums import WorkspaceRole
from app.services.auth import hash_password


async def _seed() -> None:
    # Seed runs outside request cycle, so set a context explicitly.
    set_current_workspace_id("default")
    set_current_user_name("System")

    dev_email = "alice@example.com"
    dev_password = "dev-password"

    bob_email = "bob@example.com"
    bob_password = "dev-password"

    carol_email = "carol@example.com"
    carol_password = "dev-password"

    async with SessionLocal() as db:
        # Workspace
        res = await db.execute(select(Workspace).where(Workspace.slug == "default"))
        if not res.scalars().first():
            db.add(Workspace(name="Default Workspace", slug="default"))
            await db.flush()

        # Local auth users (dev)
        # alice@example.com / dev-password (admin)
        # bob@example.com / dev-password (non-admin)
        # carol@example.com / dev-password (non-admin)
        for email, password in [
            (dev_email, dev_password),
            (bob_email, bob_password),
            (carol_email, carol_password),
        ]:
            res = await db.execute(
                select(AuthUser).where(AuthUser.workspace_id == "default", AuthUser.email == email)
            )
            if not res.scalars().first():
                db.add(AuthUser(email=email, password_hash=hash_password(password)))

        # App users (legacy table used by some endpoints)
        res = await db.execute(select(User).where(User.workspace_id == "default"))
        if not res.scalars().first():
            db.add_all(
                [
                    User(user_name="alice", role="WORKSPACE_ADMIN"),
                    User(user_name="bob", role="SUBMITTER"),
                    User(user_name="carol", role="APPROVER"),
                ]
            )

        # Workspace memberships (new enforcement layer)
        auth_users = (
            (
                await db.execute(
                    select(AuthUser).where(AuthUser.workspace_id == "default").order_by(AuthUser.id)
                )
            )
            .scalars()
            .all()
        )
        by_email = {u.email: u for u in auth_users}

        desired = [
            (dev_email, WorkspaceRole.admin),
            (bob_email, WorkspaceRole.submitter),
            (carol_email, WorkspaceRole.approver),
        ]
        for email, role in desired:
            au = by_email.get(email)
            if not au:
                continue
            res = await db.execute(
                select(WorkspaceMembership).where(
                    WorkspaceMembership.workspace_id == "default",
                    WorkspaceMembership.auth_user_id == au.id,
                )
            )
            if not res.scalars().first():
                db.add(WorkspaceMembership(auth_user_id=au.id, role=role))

        # Entity Types
        from app.models.entity_type import EntityType

        res = await db.execute(
            select(EntityType).where(
                EntityType.workspace_id == "default", EntityType.is_deleted == False
            )
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

        # Entity assignments (per entity)
        res = await db.execute(
            select(EntityAssignment).where(EntityAssignment.workspace_id == "default")
        )
        if not res.scalars().first():
            users = (
                (await db.execute(select(User).where(User.workspace_id == "default")))
                .scalars()
                .all()
            )
            entities = (
                (await db.execute(select(Entity).where(Entity.workspace_id == "default")))
                .scalars()
                .all()
            )

            by_name = {u.user_name: u for u in users}
            submitter = by_name.get("bob")
            approver = by_name.get("carol")

            if submitter and approver:
                db.add_all(
                    [
                        EntityAssignment(
                            entity_id=e.id,
                            user_id=submitter.id,
                            role=EntityAssignmentRole.submitter,
                            active=True,
                        )
                        for e in entities
                    ]
                    + [
                        EntityAssignment(
                            entity_id=e.id,
                            user_id=approver.id,
                            role=EntityAssignmentRole.approver,
                            active=True,
                        )
                        for e in entities
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
                    ReportType(
                        code="rent_roll",
                        name="Rent Roll",
                        entity_type="property",
                        report_package_id=pkg.id,
                    ),
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
