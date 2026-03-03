# Week 8 Task Manager Full Stack

Full stack task management starter built with a React 18 + TypeScript frontend and a Spring Boot 3 backend. It includes JWT authentication, refresh tokens, task CRUD endpoints, WebSocket task broadcasts, Tailwind-based UI scaffolding, Docker support, and CI build workflows.

## Structure

```text
week8-task-manager-fullstack/
|-- backend/
|-- frontend/
|-- docker-compose.yml
|-- README.md
```

## Backend Features

- Spring Boot 3.3 with Web, Security, JPA, Validation, WebSocket, Actuator, Flyway, and OpenAPI.
- JWT access tokens plus persisted refresh tokens.
- PostgreSQL schema managed through Flyway.
- Task CRUD endpoints with status and priority filters.
- STOMP WebSocket broadcast on task create, update, status change, and delete.

## Frontend Features

- Vite + React + TypeScript.
- Context-driven auth and task state.
- Axios API service with token refresh interceptor.
- Protected routes and login/register screen.
- Responsive task board with native drag-and-drop between status columns.
- WebSocket subscription to keep task state in sync.

## Quick Start

### Docker

```bash
docker-compose up --build
```

Frontend: `http://localhost:3000`  
Backend API: `http://localhost:8080/api`  
Swagger: `http://localhost:8080/swagger-ui.html`

### Manual

```bash
cd backend
mvn spring-boot:run
```

```bash
cd frontend
npm install
npm run dev
```

## Key API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `PUT /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

## Environment Variables

Backend variables are documented in [backend/.env.example](/C:/Users/irsha/visualCode/week8-task-manager-fullstack/backend/.env.example).  
Frontend variables are documented in [frontend/.env.example](/C:/Users/irsha/visualCode/week8-task-manager-fullstack/frontend/.env.example).

## Next Implementation Steps

1. Add role-based authorization checks around task ownership and admin actions.
2. Add task comments, notifications, and richer collaborative presence events.
3. Add real frontend tests, backend integration tests, and production-grade refresh-token rotation.
