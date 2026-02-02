# API Contract: Tasks API

**Feature**: `1-backend-api-database`
**Base Path**: `/api`
**Date**: 2026-01-29

## Overview

REST API for task CRUD operations. All endpoints require `user_id` in the URL path for user isolation. Authentication will be added in a separate specification.

## Endpoints

### POST /api/{user_id}/tasks

Create a new task for the specified user.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |

**Request Body**:
```json
{
    "title": "string (1-200 chars, required)",
    "description": "string (0-1000 chars, optional)"
}
```

**Response 201 Created**:
```json
{
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-29T10:00:00Z",
    "updated_at": "2026-01-29T10:00:00Z"
}
```

**Response 422 Unprocessable Entity**:
```json
{
    "detail": [
        {
            "loc": ["body", "title"],
            "msg": "String should have at least 1 character",
            "type": "string_too_short"
        }
    ]
}
```

---

### GET /api/{user_id}/tasks

List all tasks for the specified user.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |

**Response 200 OK**:
```json
[
    {
        "id": 1,
        "user_id": "user123",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "completed": false,
        "created_at": "2026-01-29T10:00:00Z",
        "updated_at": "2026-01-29T10:00:00Z"
    },
    {
        "id": 2,
        "user_id": "user123",
        "title": "Call dentist",
        "description": null,
        "completed": true,
        "created_at": "2026-01-29T09:00:00Z",
        "updated_at": "2026-01-29T11:00:00Z"
    }
]
```

**Response 200 OK (empty)**:
```json
[]
```

---

### GET /api/{user_id}/tasks/{id}

Get a single task by ID for the specified user.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |
| `id` | integer | Yes | Task ID |

**Response 200 OK**:
```json
{
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-29T10:00:00Z",
    "updated_at": "2026-01-29T10:00:00Z"
}
```

**Response 404 Not Found**:
```json
{
    "detail": "Task not found"
}
```

---

### PUT /api/{user_id}/tasks/{id}

Update an existing task. All fields in request body are optional.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |
| `id` | integer | Yes | Task ID |

**Request Body**:
```json
{
    "title": "string (1-200 chars, optional)",
    "description": "string (0-1000 chars, optional)",
    "completed": "boolean (optional)"
}
```

**Response 200 OK**:
```json
{
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries and snacks",
    "description": "Milk, eggs, bread, chips",
    "completed": false,
    "created_at": "2026-01-29T10:00:00Z",
    "updated_at": "2026-01-29T12:00:00Z"
}
```

**Response 404 Not Found**:
```json
{
    "detail": "Task not found"
}
```

**Response 422 Unprocessable Entity**:
```json
{
    "detail": [
        {
            "loc": ["body", "title"],
            "msg": "String should have at most 200 characters",
            "type": "string_too_long"
        }
    ]
}
```

---

### DELETE /api/{user_id}/tasks/{id}

Delete a task permanently.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |
| `id` | integer | Yes | Task ID |

**Response 204 No Content**:
(Empty body)

**Response 404 Not Found**:
```json
{
    "detail": "Task not found"
}
```

---

### PATCH /api/{user_id}/tasks/{id}/complete

Toggle the completion status of a task.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | User identifier |
| `id` | integer | Yes | Task ID |

**Request Body**: None

**Response 200 OK** (was incomplete, now complete):
```json
{
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": true,
    "created_at": "2026-01-29T10:00:00Z",
    "updated_at": "2026-01-29T13:00:00Z"
}
```

**Response 200 OK** (was complete, now incomplete):
```json
{
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-29T10:00:00Z",
    "updated_at": "2026-01-29T14:00:00Z"
}
```

**Response 404 Not Found**:
```json
{
    "detail": "Task not found"
}
```

---

## Data Types

### TaskCreate
```typescript
interface TaskCreate {
    title: string;        // 1-200 characters, required
    description?: string; // 0-1000 characters, optional
}
```

### TaskUpdate
```typescript
interface TaskUpdate {
    title?: string;       // 1-200 characters, optional
    description?: string; // 0-1000 characters, optional
    completed?: boolean;  // optional
}
```

### TaskResponse
```typescript
interface TaskResponse {
    id: number;
    user_id: string;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;   // ISO 8601 format
    updated_at: string;   // ISO 8601 format
}
```

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 404 | Not Found | Task doesn't exist or belongs to different user |
| 422 | Unprocessable Entity | Validation error |
| 503 | Service Unavailable | Database connection failure |

## Error Response Format

All error responses follow this format:

```json
{
    "detail": "Error message string"
}
```

Or for validation errors:

```json
{
    "detail": [
        {
            "loc": ["body", "field_name"],
            "msg": "Error message",
            "type": "error_type"
        }
    ]
}
```

## Security Notes

1. **User Isolation**: All queries filter by `user_id` from URL path
2. **404 for Wrong User**: If task exists but belongs to different user, return 404 (not 403) to prevent enumeration
3. **No Authentication**: This contract does not include JWT authentication (separate spec)
4. **Stateless**: No session state maintained between requests
