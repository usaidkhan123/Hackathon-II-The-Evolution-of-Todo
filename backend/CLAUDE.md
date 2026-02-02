# Backend Development Rules

This file contains backend-specific development rules for the FastAPI Backend Engineer Sub-Agent.

## Architecture Rules (STRICT)

1. **Routes** - Thin controllers only. Extract request data, call services, return responses.
2. **Services** - All business logic lives here. Orchestrate repositories, apply rules.
3. **Repositories** - Data access only. CRUD operations, queries, no business logic.
4. **Schemas** - Pydantic models for validation. Separate Create, Update, Response schemas.

## User Isolation Mandate

ALL repository methods MUST filter by user_id. This is non-negotiable.

```python
# CORRECT - Always filter by user_id
def get_task(self, user_id: str, task_id: int) -> Optional[Task]:
    return self.session.exec(
        select(Task).where(Task.user_id == user_id, Task.id == task_id)
    ).first()

# WRONG - Never query without user_id filter
def get_task(self, task_id: int):  # FORBIDDEN
    return self.session.get(Task, task_id)
```

## Security Requirements

- NEVER hardcode secrets, tokens, or credentials
- Use environment variables via `core/config.py`
- Validate and sanitize ALL user inputs
- Use dependency injection for database sessions
- Return generic error messages to clients (no stack traces)
- Log errors server-side

## Error Handling Pattern

```python
from fastapi import HTTPException, status

# 404 - Resource not found
raise HTTPException(status_code=404, detail="Task not found")

# 422 - Validation error (handled automatically by Pydantic)

# 503 - Service unavailable
raise HTTPException(status_code=503, detail="Service temporarily unavailable")
```

## Timestamp Management

- `created_at`: Set once on creation via `default_factory`
- `updated_at`: Must be explicitly updated in service layer on every modification

```python
from datetime import datetime

# In service methods
task.updated_at = datetime.utcnow()
```

## Database Session Management

- Use dependency injection via `Depends(get_session)`
- Never create sessions manually in route handlers
- Sessions are automatically managed by FastAPI

## Code Quality Standards

- Follow PEP 8 style guidelines
- Add docstrings to all classes and methods
- Use type hints for all function parameters and return values
- Keep functions focused and single-purpose
- Maximum function length: 30 lines

## Testing Requirements

- Test all endpoints with valid and invalid inputs
- Test user isolation (verify no cross-user data leakage)
- Test error conditions (404, 422)
- Use pytest fixtures for database setup

## Out of Scope

Per specification, these are NOT included:

- JWT authentication/verification (handled separately)
- User registration/management
- Frontend implementation
- Pagination, search, filtering
- Rate limiting
- Bulk operations
