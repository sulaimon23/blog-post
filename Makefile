.PHONY: dev up down logs clean

ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.DEFAULT_GOAL := help

help:
	@echo "Available commands:"
	@echo "  make dev    - Start application with hot reload"
	@echo "  make up     - Start containers in background"
	@echo "  make down   - Stop containers"
	@echo "  make logs   - View container logs"
	@echo "  make clean  - Remove containers and images"

dev:
	@echo "Starting application with hot reload..."
	@docker-compose up --build

up:
	@echo "Starting containers..."
	@docker-compose up -d --build
	@echo ""
	@BACKEND_PORT=$${BACKEND_PORT:-3001}; \
	FRONTEND_PORT=$${FRONTEND_PORT:-3000}; \
	echo "Backend:  http://localhost:$$BACKEND_PORT"; \
	echo "Frontend: http://localhost:$$FRONTEND_PORT"

down:
	@docker-compose down

logs:
	@docker-compose logs -f

clean:
	@docker-compose down -v
	@docker system prune -f
