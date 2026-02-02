# Implementation Plan: Backend API & Database Layer

**Branch**: `1-backend-api-database` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-backend-api-database/spec.md`

## Summary

Implement a FastAPI REST API backend with SQLModel ORM connected to Neon Serverless PostgreSQL. The API provides 6 endpoints for task CRUD operations with user isolation enforced at the database query level. All tasks are scoped by user_id passed in the URL path. Authentication is deferred to a separate specification.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, uvicorn, psycopg2-binary (or asyncpg)
**Storage**: Neon Serverless PostgreSQL via `DATABASE_URL`
**Testing**: pytest, httpx (for async testing)
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web application (backend component of monorepo)
**Performance Goals**: <500ms response time for all endpoints under normal load
**Constraints**: Stateless backend, no session storage, user isolation at query level
**Scale/Scope**: 100 concurrent requests without degradation

## Constitution Check

*GATE: Must pass before implementation. All items verified against constitution v2.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | Implementation follows approved spec.md |
| II. Clean Architecture | PASS | Routes → Services → Repositories pattern |
| III. Stateless Backend | PASS | No session state; user_id from URL path |
| IV. User Data Isolation | PASS | All queries filter by user_id |
| V. Readability | PASS | PEP 8, docstrings, clear naming |
| VI. No Hardcoded Secrets | PASS | DATABASE_URL from environment |

**Note**: JWT authentication is OUT OF SCOPE for this spec. User isolation is enforced via URL path parameter `{user_id}`. Authentication will be added in a separate spec that wraps these endpoints with JWT verification.

## Project Structure

### Documentation (this feature)

```text
specs/1-backend-api-database/
├── spec.md              # Feature specification
├── plan.md              # This file
├── data-model.md        # Database schema details
├── contracts/           # API contract definitions
│   └── tasks-api.md     # Task endpoints contract
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── main.py                      # FastAPI app initialization, CORS, startup/shutdown
├── api/
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── tasks.py             # Task CRUD endpoints
│   └── dependencies/
│       ├── __init__.py
│       └── database.py          # Database session dependency
├── schemas/
│   ├── __init__.py
│   └── task.py                  # Pydantic request/response models
├── services/
│   ├── __init__.py
│   └── task_service.py          # Business logic layer
├── repositories/
│   ├── __init__.py
│   └── task_repository.py       # Data access layer
├── models/
│   ├── __init__.py
│   └── task.py                  # SQLModel database model
├── db/
│   ├── __init__.py
│   ├── connection.py            # Database connection setup
│   └── init_db.py               # Table creation script
├── core/
│   ├── __init__.py
│   └── config.py                # Settings and environment variables
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # pytest fixtures
│   ├── test_tasks_api.py        # API endpoint tests
│   └── test_task_service.py     # Service layer tests
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variable template
└── CLAUDE.md                    # Backend-specific rules
```

**Structure Decision**: Web application backend structure following Clean Architecture. Routes handle HTTP concerns, Services contain business logic, Repositories abstract database access. This aligns with Constitution Principle II.

## Data Model

### Task Entity (SQLModel)

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Database Schema (PostgreSQL)

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## API Contracts

### Request/Response Schemas

```python
# TaskCreate - POST request body
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

# TaskUpdate - PUT request body
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None

# TaskResponse - All responses
class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

### Endpoint Specifications

| Endpoint | Method | Request Body | Response | Status Codes |
|----------|--------|--------------|----------|--------------|
| `/api/{user_id}/tasks` | POST | TaskCreate | TaskResponse | 201, 422 |
| `/api/{user_id}/tasks` | GET | - | List[TaskResponse] | 200 |
| `/api/{user_id}/tasks/{id}` | GET | - | TaskResponse | 200, 404 |
| `/api/{user_id}/tasks/{id}` | PUT | TaskUpdate | TaskResponse | 200, 404, 422 |
| `/api/{user_id}/tasks/{id}` | DELETE | - | - | 204, 404 |
| `/api/{user_id}/tasks/{id}/complete` | PATCH | - | TaskResponse | 200, 404 |

### Error Response Format

```json
{
    "detail": "Task not found"
}
```

## Implementation Strategy

### Phase 1: Foundation Setup
1. Create backend directory structure
2. Initialize Python project with requirements.txt
3. Configure environment variables (core/config.py)
4. Set up database connection (db/connection.py)

### Phase 2: Data Layer
1. Define SQLModel Task model (models/task.py)
2. Create table initialization script (db/init_db.py)
3. Implement TaskRepository with CRUD methods (repositories/task_repository.py)

### Phase 3: Business Layer
1. Define Pydantic schemas (schemas/task.py)
2. Implement TaskService (services/task_service.py)

### Phase 4: API Layer
1. Create database session dependency (api/dependencies/database.py)
2. Implement task routes (api/routes/tasks.py)
3. Wire up FastAPI app (main.py)

### Phase 5: Validation & Documentation
1. Add request validation with proper error messages
2. Create .env.example
3. Create backend CLAUDE.md
4. Manual API testing with example requests

## Database Connection Strategy

### Connection Setup (db/connection.py)

```python
from sqlmodel import create_engine, Session
from core.config import settings

# Use connection pooling for serverless PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,
    max_overflow=10
)

def get_session():
    with Session(engine) as session:
        yield session
```

### Table Creation Strategy

**Approach**: SQLModel's `SQLModel.metadata.create_all(engine)` called at application startup.

**Rationale**: For hackathon scope, auto-creation is sufficient. Production would use Alembic migrations.

```python
# db/init_db.py
from sqlmodel import SQLModel
from db.connection import engine
from models.task import Task  # Import to register model

def init_db():
    SQLModel.metadata.create_all(engine)
```

## Key Implementation Details

### User Isolation Pattern

All repository methods MUST include `user_id` in queries:

```python
# CORRECT - Always filter by user_id
def get_tasks(self, user_id: str) -> List[Task]:
    return self.session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

def get_task(self, user_id: str, task_id: int) -> Optional[Task]:
    return self.session.exec(
        select(Task).where(Task.user_id == user_id, Task.id == task_id)
    ).first()

# WRONG - Never query without user_id filter
def get_task(self, task_id: int):  # FORBIDDEN
    return self.session.get(Task, task_id)
```

### Timestamp Handling

- `created_at`: Set once on creation via `default_factory`
- `updated_at`: Must be explicitly updated in service layer on every modification

```python
# In TaskService
def update_task(self, user_id: str, task_id: int, data: TaskUpdate) -> Task:
    task = self.repository.get_task(user_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update fields
    for key, value in data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    # Always update timestamp
    task.updated_at = datetime.utcnow()

    return self.repository.save(task)
```

### Error Handling

```python
from fastapi import HTTPException

# 404 - Task not found or not owned by user
raise HTTPException(status_code=404, detail="Task not found")

# 422 - Validation error (handled automatically by Pydantic)
# FastAPI returns this format:
# {"detail": [{"loc": ["body", "title"], "msg": "...", "type": "..."}]}

# 503 - Database connection failure
raise HTTPException(status_code=503, detail="Service temporarily unavailable")
```

## Dependencies (requirements.txt)

```text
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
pydantic>=2.5.0
pydantic-settings>=2.1.0
python-dotenv>=1.0.0

# Testing
pytest>=7.4.0
httpx>=0.26.0
pytest-asyncio>=0.23.0
```

## Environment Configuration

### .env.example

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=false
```

### core/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

## Validation Checklist

Before marking implementation complete:

- [ ] All 6 endpoints respond with correct status codes
- [ ] Task creation returns 201 with generated ID
- [ ] Task list returns only tasks for specified user_id
- [ ] Task not found returns 404 (including wrong user_id)
- [ ] Validation errors return 422 with field details
- [ ] Toggle complete flips boolean value
- [ ] Timestamps are set correctly (created_at once, updated_at on change)
- [ ] No cross-user data leakage possible
- [ ] Database connection reads from DATABASE_URL
- [ ] .env.example provided with all required variables

## Out of Scope Reminders

Per specification, these are NOT included in this plan:

- JWT authentication/verification
- User registration/management
- Frontend implementation
- Pagination, search, filtering
- Rate limiting
- Bulk operations

## Next Steps

After this plan is approved:
1. Run `/sp.tasks` to generate implementation tasks
2. Execute tasks via Claude Code agents
3. Verify against spec acceptance criteria
4. Create authentication spec to wrap these endpoints

---

**Plan Status**: Ready for task generation
**Spec Compliance**: Full alignment with spec.md requirements
**Constitution Compliance**: All 6 principles satisfied
