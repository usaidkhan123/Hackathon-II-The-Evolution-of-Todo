# Authentication Flow Contract

**Feature**: `2-jwt-auth`
**Date**: 2026-01-30

## Overview

This document defines the authentication contracts between Frontend (Better Auth) and Backend (FastAPI JWT verification).

## Token Format

### JWT Structure

**Header**:
```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

**Payload** (Claims):
```json
{
    "sub": "user_unique_id",
    "email": "user@example.com",
    "iat": 1706659200,
    "exp": 1707264000
}
```

### Claim Definitions

| Claim | Type | Required | Description |
|-------|------|----------|-------------|
| `sub` | string | Yes | User unique identifier |
| `email` | string | No | User email address |
| `iat` | number | Yes | Issued at timestamp (Unix) |
| `exp` | number | Yes | Expiration timestamp (Unix) |

**Note**: Backend MUST accept user_id from either `sub` or `userId` claim for compatibility.

## API Request Format

### Authorization Header

```
Authorization: Bearer <jwt_token>
```

**Example**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA2NjU5MjAwLCJleHAiOjE3MDcyNjQwMDB9.signature
```

## Protected Endpoints

All task API endpoints require valid JWT token:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create task |
| GET | /api/tasks | List tasks |
| GET | /api/tasks/{id} | Get task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |
| PATCH | /api/tasks/{id}/complete | Toggle completion |

## Error Responses

### 401 Unauthorized - Missing Token

**Request**: No Authorization header

**Response**:
```json
{
    "detail": "Authentication required"
}
```

### 401 Unauthorized - Invalid Token

**Request**: Malformed or tampered token

**Response**:
```json
{
    "detail": "Invalid token"
}
```

### 401 Unauthorized - Expired Token

**Request**: Token past expiration time

**Response**:
```json
{
    "detail": "Token expired"
}
```

## Frontend Authentication Endpoints

Better Auth provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/sign-up | Register new user |
| POST | /api/auth/sign-in | Login user |
| POST | /api/auth/sign-out | Logout user |
| GET | /api/auth/session | Get current session |

### Sign Up Request

```json
{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "User Name"
}
```

### Sign Up Response (Success)

```json
{
    "user": {
        "id": "user_unique_id",
        "email": "user@example.com",
        "name": "User Name"
    },
    "token": "jwt_token_here"
}
```

### Sign In Request

```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

### Sign In Response (Success)

```json
{
    "user": {
        "id": "user_unique_id",
        "email": "user@example.com"
    },
    "token": "jwt_token_here"
}
```

### Sign In Response (Error)

```json
{
    "error": "Invalid email or password"
}
```

## Shared Secret Contract

### Environment Variable

Both frontend and backend MUST use the same secret:

```
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
```

### Requirements

- Minimum length: 32 characters
- Must be cryptographically random
- Must NOT be committed to version control
- Must be identical on frontend and backend

## Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                     TOKEN LIFECYCLE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ISSUANCE                                                 │
│     ├── User submits credentials                             │
│     ├── Better Auth validates                                │
│     ├── JWT signed with BETTER_AUTH_SECRET                   │
│     └── Token returned to client                             │
│                                                              │
│  2. STORAGE                                                  │
│     ├── Client stores token (cookie/localStorage)            │
│     └── Token included in API requests                       │
│                                                              │
│  3. VERIFICATION (per request)                               │
│     ├── Backend extracts token from header                   │
│     ├── Verify signature with same secret                    │
│     ├── Check expiration                                     │
│     └── Extract user_id for query scoping                    │
│                                                              │
│  4. EXPIRATION                                               │
│     ├── Token valid for 7 days from issuance                 │
│     ├── Expired token → 401 response                         │
│     └── User must re-authenticate                            │
│                                                              │
│  5. LOGOUT                                                   │
│     ├── Client clears stored token                           │
│     └── Token remains valid until expiration (stateless)     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Constraints

1. **No Token in URL**: Tokens MUST NOT be passed as URL parameters
2. **HTTPS Required**: Production must use HTTPS
3. **No Sensitive Data**: Token payload must not contain passwords or secrets
4. **Short-Lived Tokens**: 7-day expiration maximum
5. **Same-Origin**: CORS configured for known origins only
