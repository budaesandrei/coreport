.PHONY: up down logs migrate revision seed fmt lint test

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

migrate:
	docker compose exec backend alembic upgrade head

revision:
	docker compose exec backend alembic revision --autogenerate -m "$(m)"

seed:
	docker compose exec backend python -m app.db.seed

fmt:
	docker compose exec backend ruff format

lint:
	docker compose exec backend ruff check

test:
	docker compose exec backend pytest -q
