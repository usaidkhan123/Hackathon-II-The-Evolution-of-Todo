# Data Model: Backend API & Database Layer

**Feature**: `1-backend-api-database`
**Date**: 2026-01-29
**Database**: Neon Serverless PostgreSQL

## Entity Relationship Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                          tasks                               │
├─────────────────────────────────────────────────────────────┤
│ id          │ SERIAL       │ PRIMARY KEY                    │
│ user_id     │ VARCHAR      │ NOT NULL, INDEXED              │
│ title       │ VARCHAR(200) │ NOT NULL                       │
│ description │ TEXT         │ NULLABLE                       │
│ completed   │ BOOLEAN      │ NOT NULL, DEFAULT FALSE        │
│ created_at  │ TIMESTAMPTZ  │ NOT NULL, DEFAULT NOW()        │
│ updated_at  │ TIMESTAMPTZ  │ NOT NULL, DEFAULT NOW()        │
└─────────────────────────────────────────────────────────────┘
```

## Table: tasks

### Column Definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `user_id` | VARCHAR | NOT NULL, INDEX | Owner identifier (from URL path) |
| `title` | VARCHAR(200) | NOT NULL | Task title, 1-200 characters |
| `description` | TEXT | NULLABLE | Optional task description, max 1000 chars |
| `completed` | BOOLEAN | NOT NULL DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Last modification timestamp |

### Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `tasks_pkey` | `id` | PRIMARY | Unique task identification |
| `idx_tasks_user_id` | `user_id` | B-TREE | Fast user task lookups |

### Constraints

| Constraint | Type | Definition |
|------------|------|------------|
| Primary Key | PK | `id` |
| Not Null | CHECK | `user_id`, `title`, `completed`, `created_at`, `updated_at` |
| Title Length | CHECK | `length(title) >= 1 AND length(title) <= 200` |
| Description Length | CHECK | `description IS NULL OR length(description) <= 1000` |

## SQLModel Definition

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """
    Task entity representing a todo item belonging to a specific user.

    Attributes:
        id: Auto-generated primary key
        user_id: Owner identifier (indexed for query performance)
        title: Task title (1-200 characters, required)
        description: Optional task description (max 1000 characters)
        completed: Completion status (default: False)
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last modified
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
```

## DDL Script

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_title_length CHECK (length(title) >= 1 AND length(title) <= 200),
    CONSTRAINT chk_description_length CHECK (description IS NULL OR length(description) <= 1000)
);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Comment on table
COMMENT ON TABLE tasks IS 'Todo tasks belonging to users';
COMMENT ON COLUMN tasks.user_id IS 'Owner identifier - all queries must filter by this';
```

## Query Patterns

### Required Query Patterns (User Isolation)

All queries MUST include `user_id` filter:

```sql
-- List tasks for user
SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC;

-- Get single task (must include user_id)
SELECT * FROM tasks WHERE id = :id AND user_id = :user_id;

-- Create task
INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at)
VALUES (:user_id, :title, :description, FALSE, NOW(), NOW())
RETURNING *;

-- Update task
UPDATE tasks
SET title = :title, description = :description, completed = :completed, updated_at = NOW()
WHERE id = :id AND user_id = :user_id
RETURNING *;

-- Delete task
DELETE FROM tasks WHERE id = :id AND user_id = :user_id;

-- Toggle completion
UPDATE tasks
SET completed = NOT completed, updated_at = NOW()
WHERE id = :id AND user_id = :user_id
RETURNING *;
```

### Forbidden Query Patterns

These patterns MUST NOT be used (violate user isolation):

```sql
-- FORBIDDEN: Query without user_id filter
SELECT * FROM tasks WHERE id = :id;

-- FORBIDDEN: Update without user_id filter
UPDATE tasks SET completed = TRUE WHERE id = :id;

-- FORBIDDEN: Delete without user_id filter
DELETE FROM tasks WHERE id = :id;
```

## Data Lifecycle

### Creation
1. `id` auto-generated by database (SERIAL)
2. `user_id` provided in URL path, stored with task
3. `title` required in request body
4. `description` optional in request body
5. `completed` defaults to FALSE
6. `created_at` set to current timestamp
7. `updated_at` set to current timestamp

### Modification
1. `title`, `description`, `completed` can be updated
2. `updated_at` MUST be refreshed on every modification
3. `created_at` MUST NOT change after creation
4. `user_id` MUST NOT change (task ownership is immutable)

### Deletion
1. Hard delete (no soft delete)
2. Task permanently removed from database
3. Returns 204 No Content on success

## Neon PostgreSQL Considerations

### Connection String Format
```
postgresql://user:password@host.neon.tech/database?sslmode=require
```

### Connection Pooling
- Use SQLModel/SQLAlchemy connection pooling
- `pool_pre_ping=True` for serverless environments
- Recommended pool size: 5 connections
- Max overflow: 10 connections

### SSL Requirements
- Neon requires SSL connections
- `sslmode=require` in connection string
- Certificate verification handled automatically
