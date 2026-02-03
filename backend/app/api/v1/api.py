from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import (
    approvals,
    auth,
    auth_stub,
    entities,
    mappings,
    report_packages,
    report_types,
    schedules,
    submission_periods,
    submissions,
    uploads,
    users,
    workspaces,
)

api_router = APIRouter()

api_router.include_router(auth_stub.router, tags=["auth"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(workspaces.router)

# orgs removed: workspace is the organisation

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(entities.router, prefix="/entities", tags=["entities"])
api_router.include_router(report_packages.router, prefix="/report-packages", tags=["report-packages"])
api_router.include_router(report_types.router, prefix="/report-types", tags=["report-types"])
api_router.include_router(schedules.router, prefix="/schedules", tags=["schedules"])
api_router.include_router(submission_periods.router, prefix="/submission-periods", tags=["submission-periods"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(mappings.router, prefix="/mappings", tags=["mappings"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["approvals"])
