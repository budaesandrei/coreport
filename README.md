# Coreport

Multi-tenant SaaS prototype (monorepo):

- **Frontend:** React (TypeScript, Vite)
- **Backend:** FastAPI (async SQLAlchemy 2.0 + asyncpg, Pydantic v2)
- **DB:** Postgres (Docker Compose)
- **Lambda:** Mangum wrapper (`backend/app/lambda_handler.py`)

## Quickstart (Docker)

```bash
cd /home/ubuntu/projects/coreport
make up
```

In another terminal:

```bash
make migrate
make seed
```

- Backend Swagger: <http://localhost:8000/docs>
- Frontend: <http://localhost:3000>

## Local dev auth (seeded)

After `make migrate && make seed`, you can log in with:

- **Email:** `alice@example.com`
- **Password:** `dev-password`
- **Workspace:** `Default Workspace` (slug: `default`)

## Multi-tenancy headers

Every request is scoped by headers:

- `X-Tenant-Id` (default: `default`)
- `X-User-Name` (default: `System`)

If you're calling the API directly (curl/Postman), include `X-Tenant-Id: default` to access the seeded data.

## OpenAI mapping

The mapping proposal entrypoint is:

- `backend/app/services/smart_mapper.py`

If `OPENAI_API_KEY` is missing, the service falls back to a simple heuristic mapping.

To configure:

```bash
export OPENAI_API_KEY=... 
export OPENAI_MODEL=gpt-4o-mini
```

## Makefile

- `make up` / `make down`
- `make migrate` (Alembic)
- `make seed` (seed example tenant/org/users/entities + report templates)
