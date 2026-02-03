# Coreport – requirement gathering notes

Source: Dre’s prompt (2026-02-03).

## Goal
A runnable multi-tenant SaaS prototype called **Coreport** with:
- FastAPI backend (async SQLAlchemy 2.0 + asyncpg, Pydantic v2, pydantic-settings)
- React (TS) frontend (Vite)
- Postgres via Docker Compose
- Mangum Lambda handler for backend

Success criteria:
- Backend Swagger available at http://localhost:8000/docs
- Frontend available at http://localhost:3000

## Key functional areas (phased)
- Multi-tenancy via headers (X-Tenant-Id, X-User-Name) + request context
- Tenant-scoped data access across all tables
- Domain model: tenants/orgs/users/entities/report packages/types/fields/validation rules/schedules/periods/uploads/mappings/submissions/approvals/comments/mapping cache
- Upload + URL ingestion with basic safety constraints
- Smart mapping: OpenAI-first structured output with heuristic fallback
- Normalization + validation preview
- Approval workflow + DB-stored notifications
- Frontend portal shell: sidebar/topbar, responsive, theme mode, tenant/user switcher

## Non-goals (for prototype scaffolding)
- Real auth provider integration (auth is stubbed)
- Production-grade RBAC/permissions granularity (start minimal)
- Full parser + mapper intelligence in v0 (start with stubs + interfaces)
