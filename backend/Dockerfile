FROM python:3.12-slim

WORKDIR /app

# System deps for asyncpg
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml /app/pyproject.toml
COPY alembic.ini /app/alembic.ini
COPY app /app/app

RUN pip install --no-cache-dir -U pip \
 && pip install --no-cache-dir -e .

EXPOSE 8000
# Run migrations on container start (idempotent), then launch the API.
CMD ["bash", "-lc", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
