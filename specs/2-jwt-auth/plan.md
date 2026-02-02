# Implementation Plan: Authentication & Security (JWT)

**Branch**: `2-jwt-auth` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/2-jwt-auth/spec.md`

## Summary

Implement JWT-based authentication for the Todo application. Better Auth handles user registration and login on the Next.js frontend, issuing JWT tokens. The FastAPI backend verifies these tokens using a shared secret and extracts user identity for all API operations. This creates a stateless authentication layer that protects all task endpoints.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript (Frontend)
**Primary Dependencies**:
- Backend: PyJWT, python-jose, FastAPI
- Frontend: Better Auth, @better-auth/jwt
**Storage**: Better Auth manages user storage (SQLite/PostgreSQL)
**Testing**: pytest (backend), vitest (frontend)
**Target Platform**: Linux server (backend), Browser (frontend)
**Project Type**: Web application (monorepo with frontend + backend)
**Performance Goals**: Token verification < 5ms, Login < 2 seconds
**Constraints**: Stateless backend, shared secret between frontend/backend
**Scale/Scope**: Support 1000+ concurrent authenticated users

## Constitution Check

*GATE: Must pass before implementation. All items verified against constitution v2.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | Implementation follows approved spec.md |
| II. Clean Architecture | PASS | Auth as dependency injection, not mixed with business logic |
| III. Stateless Backend | PASS | JWT verification only, no session storage |
| IV. User Data Isolation | PASS | User ID from JWT for all queries |
| V. Readability | PASS | Clear separation of auth concerns |
| VI. No Hardcoded Secrets | PASS | BETTER_AUTH_SECRET from environment |

## Project Structure

### Documentation (this feature)

```text
specs/2-jwt-auth/
├── spec.md              # Feature specification
├── plan.md              # This file
├── contracts/           # Auth-related contracts
│   └── auth-flow.md     # Authentication flow details
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── core/
│   ├── config.py                # Add BETTER_AUTH_SECRET
│   └── security.py              # NEW: JWT verification utilities
├── api/
│   ├── dependencies/
│   │   ├── database.py          # Existing
│   │   └── auth.py              # NEW: Authentication dependency
│   └── routes/
│       └── tasks.py             # Update to use auth dependency
├── schemas/
│   └── auth.py                  # NEW: Token payload schema
└── main.py                      # No changes needed

frontend/
├── lib/
│   ├── auth.ts                  # NEW: Better Auth client config
│   └── auth-client.ts           # NEW: Auth client instance
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx         # NEW: Login page
│   │   └── signup/
│   │       └── page.tsx         # NEW: Signup page
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts     # NEW: Better Auth API routes
│   └── layout.tsx               # Add auth provider
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        # NEW: Login form component
│   │   ├── SignupForm.tsx       # NEW: Signup form component
│   │   └── LogoutButton.tsx     # NEW: Logout button
│   └── providers/
│       └── AuthProvider.tsx     # NEW: Auth context provider
├── services/
│   └── api.ts                   # Update to include auth headers
└── middleware.ts                # NEW: Route protection middleware
```

**Structure Decision**: Web application with authentication spanning both frontend and backend. Frontend handles user management via Better Auth; backend verifies JWT tokens.

## Authentication Architecture

### Component Responsibilities

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│  Better Auth Server (API Routes)                                    │
│  ├── User Registration (signup)                                     │
│  ├── User Login (signin)                                            │
│  ├── JWT Token Issuance                                             │
│  └── Session Management                                             │
│                                                                     │
│  Better Auth Client                                                 │
│  ├── Auth State Management                                          │
│  ├── Token Storage (cookies/localStorage)                           │
│  └── Auto-include token in API requests                             │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Authorization: Bearer <jwt>
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI)                           │
├─────────────────────────────────────────────────────────────────────┤
│  Auth Dependency (api/dependencies/auth.py)                         │
│  ├── Extract token from Authorization header                        │
│  ├── Verify signature with BETTER_AUTH_SECRET                       │
│  ├── Validate expiration                                            │
│  └── Return CurrentUser object                                      │
│                                                                     │
│  Route Handlers                                                     │
│  ├── Inject CurrentUser via Depends()                               │
│  └── Use current_user.id for ALL database queries                   │
└─────────────────────────────────────────────────────────────────────┘
```

### JWT Token Flow

```
1. User submits credentials
   └─→ Frontend login form

2. Better Auth verifies credentials
   └─→ Checks user database
   └─→ Validates password hash

3. Better Auth issues JWT
   └─→ Signs with BETTER_AUTH_SECRET
   └─→ Includes: sub (user_id), email, iat, exp

4. Frontend stores token
   └─→ Cookie or localStorage
   └─→ Auto-attached to API requests

5. Backend receives request
   └─→ Extracts Authorization header
   └─→ Parses Bearer token

6. Backend verifies JWT
   └─→ Checks signature with same secret
   └─→ Validates expiration
   └─→ Extracts user_id from payload

7. Backend processes request
   └─→ Uses verified user_id
   └─→ Queries filtered by user_id
   └─→ Returns user-scoped data
```

## Backend Implementation Details

### JWT Verification (core/security.py)

```python
from jose import jwt, JWTError
from datetime import datetime, timezone
from fastapi import HTTPException, status
from core.config import settings

ALGORITHM = "HS256"

class TokenPayload:
    """Decoded JWT token payload."""
    def __init__(self, sub: str, email: str, exp: int):
        self.user_id = sub
        self.email = email
        self.exp = exp

def verify_token(token: str) -> TokenPayload:
    """
    Verify JWT token and extract payload.

    Args:
        token: JWT token string

    Returns:
        TokenPayload with user information

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[ALGORITHM]
        )

        # Extract user_id from 'sub' or 'userId' claim
        user_id = payload.get("sub") or payload.get("userId")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        return TokenPayload(
            sub=user_id,
            email=payload.get("email", ""),
            exp=payload.get("exp", 0)
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

### Auth Dependency (api/dependencies/auth.py)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import verify_token, TokenPayload

# Bearer token extractor
security = HTTPBearer()

class CurrentUser:
    """Authenticated user from JWT token."""
    def __init__(self, id: str, email: str):
        self.id = id
        self.email = email

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> CurrentUser:
    """
    FastAPI dependency to extract and verify authenticated user.

    Usage:
        @router.get("/tasks")
        def get_tasks(current_user: CurrentUser = Depends(get_current_user)):
            # current_user.id is verified from JWT
            pass

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        CurrentUser with verified identity

    Raises:
        HTTPException: 401 if authentication fails
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    token_payload = verify_token(credentials.credentials)

    return CurrentUser(
        id=token_payload.user_id,
        email=token_payload.email
    )
```

### Updated Route Handlers (api/routes/tasks.py)

```python
from api.dependencies.auth import get_current_user, CurrentUser

@router.get("", response_model=List[TaskResponse])
def list_tasks(
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> List[TaskResponse]:
    """List all tasks for authenticated user."""
    # User ID comes from JWT, not URL
    return service.get_tasks(current_user.id)

@router.post("", response_model=TaskResponse, status_code=201)
def create_task(
    task_data: TaskCreate,
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """Create task for authenticated user."""
    return service.create_task(current_user.id, task_data)
```

### API Endpoint Changes

**Before (with URL user_id)**:
```
GET    /api/{user_id}/tasks
POST   /api/{user_id}/tasks
GET    /api/{user_id}/tasks/{id}
PUT    /api/{user_id}/tasks/{id}
DELETE /api/{user_id}/tasks/{id}
PATCH  /api/{user_id}/tasks/{id}/complete
```

**After (user from JWT)**:
```
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/{id}
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
PATCH  /api/tasks/{id}/complete
```

**Note**: The `{user_id}` path parameter is removed. User identity is always extracted from the JWT token in the Authorization header.

## Frontend Implementation Details

### Better Auth Configuration (lib/auth.ts)

```typescript
import { betterAuth } from "better-auth";
import { jwt } from "@better-auth/jwt";

export const auth = betterAuth({
    database: {
        // Use environment-appropriate database
        provider: "sqlite", // or "pg" for production
        url: process.env.DATABASE_URL
    },

    plugins: [
        jwt({
            // JWT configuration
            secret: process.env.BETTER_AUTH_SECRET!,
            expiresIn: "7d", // 7 day expiration
        })
    ],

    // Email/password authentication
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8
    }
});
```

### Auth Client (lib/auth-client.ts)

```typescript
import { createAuthClient } from "better-auth/client";
import { jwtClient } from "@better-auth/jwt/client";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [jwtClient()]
});

// Export typed hooks
export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession
} = authClient;
```

### API Service with Auth (services/api.ts)

```typescript
import { getSession } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const session = await getSession();

    if (!session?.token) {
        throw new Error("Not authenticated");
    }

    return fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${session.token}`,
            "Content-Type": "application/json"
        }
    });
}

export const taskApi = {
    list: () => fetchWithAuth("/api/tasks").then(r => r.json()),

    create: (data: TaskCreate) =>
        fetchWithAuth("/api/tasks", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(r => r.json()),

    update: (id: number, data: TaskUpdate) =>
        fetchWithAuth(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }).then(r => r.json()),

    delete: (id: number) =>
        fetchWithAuth(`/api/tasks/${id}`, {
            method: "DELETE"
        }),

    toggleComplete: (id: number) =>
        fetchWithAuth(`/api/tasks/${id}/complete`, {
            method: "PATCH"
        }).then(r => r.json())
};
```

## Environment Configuration

### Backend (.env)

```env
# Existing
DATABASE_URL=postgresql://...@...neon.tech/...

# New for authentication
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long

# Server
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)

```env
# Database for Better Auth
DATABASE_URL=file:./auth.db  # or PostgreSQL URL

# Shared secret (MUST match backend)
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Updated config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    BETTER_AUTH_SECRET: str  # NEW: Required for JWT verification
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

## Error Handling Strategy

### Authentication Errors (401)

| Scenario | Error Message | HTTP Status |
|----------|---------------|-------------|
| No Authorization header | "Authentication required" | 401 |
| Malformed Authorization header | "Invalid token" | 401 |
| Invalid token signature | "Invalid token" | 401 |
| Expired token | "Token expired" | 401 |
| Missing user_id in payload | "Invalid token" | 401 |

### Error Response Format

```json
{
    "detail": "Error message here"
}
```

### Error Handler Implementation

```python
from fastapi import Request
from fastapi.responses import JSONResponse
from jose import JWTError

@app.exception_handler(JWTError)
async def jwt_exception_handler(request: Request, exc: JWTError):
    return JSONResponse(
        status_code=401,
        content={"detail": "Invalid token"}
    )
```

## Implementation Strategy

### Phase 1: Backend JWT Verification
1. Add BETTER_AUTH_SECRET to config.py
2. Create core/security.py with verify_token function
3. Create api/dependencies/auth.py with get_current_user
4. Add python-jose to requirements.txt

### Phase 2: Update Backend Routes
1. Remove {user_id} from route paths
2. Add get_current_user dependency to all task routes
3. Update router prefix from /{user_id}/tasks to /tasks
4. Update service calls to use current_user.id

### Phase 3: Frontend Better Auth Setup
1. Install Better Auth packages
2. Create auth configuration (lib/auth.ts)
3. Create auth client (lib/auth-client.ts)
4. Set up API routes for auth endpoints

### Phase 4: Frontend Auth UI
1. Create login page and form
2. Create signup page and form
3. Create logout button
4. Add auth provider to layout

### Phase 5: Frontend API Integration
1. Update API service to include auth headers
2. Add route protection middleware
3. Handle 401 responses (redirect to login)

### Phase 6: Validation
1. Test registration flow
2. Test login flow
3. Test protected API access
4. Test user isolation
5. Test error scenarios

## Dependencies

### Backend (add to requirements.txt)

```text
python-jose[cryptography]>=3.3.0
```

### Frontend (package.json)

```json
{
    "dependencies": {
        "better-auth": "^1.0.0",
        "@better-auth/jwt": "^1.0.0"
    }
}
```

## Validation Checklist

Before marking implementation complete:

- [ ] BETTER_AUTH_SECRET configured in both frontend and backend
- [ ] JWT tokens issued on successful login
- [ ] All task endpoints require valid JWT
- [ ] Requests without token return 401
- [ ] Expired tokens return 401
- [ ] Invalid tokens return 401
- [ ] User ID extracted from JWT for all queries
- [ ] No cross-user data access possible
- [ ] Login/logout UI functional
- [ ] Registration creates new users
- [ ] Session persists across browser refresh

## Security Considerations

1. **Secret Management**: BETTER_AUTH_SECRET must be at least 32 characters and never committed to version control.

2. **Token Storage**: Frontend should use HttpOnly cookies when possible to prevent XSS attacks.

3. **HTTPS**: In production, all communication must use HTTPS to prevent token interception.

4. **Token Expiration**: 7-day expiration balances security with user convenience.

5. **Error Messages**: Authentication errors do not reveal internal details or user existence.

---

**Plan Status**: Ready for task generation
**Spec Compliance**: Full alignment with spec.md requirements
**Constitution Compliance**: All 6 principles satisfied
