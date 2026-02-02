# Feature Specification: Authentication & Security (JWT)

**Feature Branch**: `2-jwt-auth`
**Created**: 2026-01-30
**Status**: Draft
**Input**: Phase II Authentication and Security for Todo Full-Stack Web Application

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration (Priority: P1)

As a new user, I can create an account with my email and password so that I can securely access the todo application.

**Why this priority**: Users must be able to create accounts before they can authenticate. This is the entry point for all new users.

**Independent Test**: Can be fully tested by submitting registration form and verifying account creation.

**Acceptance Scenarios**:

1. **Given** a user visits the signup page, **When** they enter a valid email and password (min 8 characters), **Then** their account is created and they are redirected to the login page or automatically logged in.

2. **Given** a user tries to register with an email that already exists, **When** they submit the form, **Then** they see an error message "Email already registered".

3. **Given** a user enters a password shorter than 8 characters, **When** they submit the form, **Then** they see a validation error "Password must be at least 8 characters".

4. **Given** a user enters an invalid email format, **When** they submit the form, **Then** they see a validation error "Please enter a valid email address".

---

### User Story 2 - User Login (Priority: P1)

As a registered user, I can log in with my credentials so that I receive an authentication token to access protected resources.

**Why this priority**: Login is required for users to access any task functionality. Without login, the application is unusable.

**Independent Test**: Can be fully tested by logging in with valid credentials and verifying token receipt.

**Acceptance Scenarios**:

1. **Given** a registered user with valid credentials, **When** they submit the login form, **Then** they receive a valid authentication token and are redirected to the task dashboard.

2. **Given** a user enters incorrect password, **When** they submit the login form, **Then** they see an error message "Invalid email or password".

3. **Given** a user enters an unregistered email, **When** they submit the login form, **Then** they see an error message "Invalid email or password" (same message to prevent enumeration).

4. **Given** a user successfully logs in, **When** they make subsequent API requests, **Then** the token is automatically included in request headers.

---

### User Story 3 - Protected API Access (Priority: P1)

As an authenticated user, I can access task API endpoints so that I can manage my tasks securely.

**Why this priority**: This is the core security requirement - all API access must be authenticated.

**Independent Test**: Can be fully tested by making API requests with and without valid tokens.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a valid token, **When** they request their tasks, **Then** the API returns their tasks with status 200.

2. **Given** a request without an authentication token, **When** any task API endpoint is called, **Then** the API returns status 401 with message "Authentication required".

3. **Given** a request with an expired token, **When** any task API endpoint is called, **Then** the API returns status 401 with message "Token expired".

4. **Given** a request with an invalid/malformed token, **When** any task API endpoint is called, **Then** the API returns status 401 with message "Invalid token".

---

### User Story 4 - User Identity Enforcement (Priority: P1)

As an authenticated user, I can only access my own tasks so that my data is protected from other users.

**Why this priority**: User isolation is a critical security requirement. No user should ever see another user's data.

**Independent Test**: Can be fully tested by attempting to access tasks with different user IDs.

**Acceptance Scenarios**:

1. **Given** user A is authenticated, **When** they request tasks, **Then** only tasks belonging to user A are returned (regardless of URL parameters).

2. **Given** user A is authenticated, **When** they attempt to access /api/userB/tasks, **Then** the system uses user A's ID from the token (ignoring URL parameter) OR returns 403 Forbidden.

3. **Given** user A is authenticated, **When** they attempt to modify/delete a task belonging to user B, **Then** the operation fails with 404 (task not found for authenticated user).

4. **Given** two users with identical task titles, **When** each user lists their tasks, **Then** each sees only their own tasks with no data leakage.

---

### User Story 5 - User Logout (Priority: P2)

As an authenticated user, I can log out so that my session is terminated and my token is invalidated.

**Why this priority**: Logout provides security for shared devices but is not critical for core functionality.

**Independent Test**: Can be fully tested by logging out and verifying token no longer works.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they click logout, **Then** they are redirected to the login page and their stored token is cleared.

2. **Given** a user has logged out, **When** they try to access protected routes, **Then** they are redirected to the login page.

3. **Given** a user logs out on one device, **When** they attempt to use the API from another device with the same token, **Then** the token remains valid (stateless JWT - logout only clears client-side).

---

### User Story 6 - Session Persistence (Priority: P2)

As an authenticated user, I can remain logged in across browser sessions so that I don't have to log in repeatedly.

**Why this priority**: Improves user experience but is not essential for security or functionality.

**Independent Test**: Can be fully tested by closing browser and returning to verify session.

**Acceptance Scenarios**:

1. **Given** a user logs in successfully, **When** they close and reopen the browser, **Then** they remain logged in if the token hasn't expired.

2. **Given** a user's token is about to expire (within 24 hours), **When** they make an API request, **Then** a refreshed token is issued (optional: token refresh).

3. **Given** a user's token has expired, **When** they try to access the app, **Then** they are redirected to login.

---

### Edge Cases

- What happens when the shared secret is misconfigured? System MUST return 500 Internal Server Error (not expose details).
- What happens when token payload is missing user_id? System MUST return 401 Invalid token.
- What happens when token signature is tampered with? System MUST return 401 Invalid token.
- What happens when clock skew causes near-expiry issues? System SHOULD allow small grace period (30 seconds).
- What happens when user is deleted but token exists? System SHOULD return 401 (user not found).
- How does system handle concurrent requests with same token? All requests SHOULD succeed (stateless).

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication
- **FR-001**: System MUST support user registration with email and password.
- **FR-002**: System MUST support user login with email and password.
- **FR-003**: System MUST issue authentication tokens upon successful login.
- **FR-004**: Tokens MUST contain user identifier and email.
- **FR-005**: Tokens MUST have a defined expiration time (7 days default).
- **FR-006**: System MUST support user logout (client-side token clearing).

#### Authorization
- **FR-007**: ALL task API endpoints MUST require valid authentication token.
- **FR-008**: Tokens MUST be transmitted via Authorization header with Bearer scheme.
- **FR-009**: System MUST verify token signature using shared secret.
- **FR-010**: System MUST reject requests with missing, expired, or invalid tokens.
- **FR-011**: System MUST extract user identity from verified token.
- **FR-012**: System MUST use authenticated user ID for ALL database queries (not URL parameters).

#### Security
- **FR-013**: Passwords MUST be securely hashed (never stored in plain text).
- **FR-014**: Authentication errors MUST NOT reveal whether email exists (prevent enumeration).
- **FR-015**: Shared secret MUST be loaded from environment variable.
- **FR-016**: System MUST NOT expose internal error details in responses.
- **FR-017**: System MUST return 401 for all authentication failures.
- **FR-018**: System MUST return 403 if user attempts cross-user access (alternative: treat as 404).

### Security Requirements

- **SR-001**: Shared secret MUST be at least 32 characters.
- **SR-002**: Tokens MUST be signed using secure algorithm (HS256 minimum).
- **SR-003**: Password MUST be minimum 8 characters.
- **SR-004**: Failed login attempts SHOULD be rate-limited (5 per minute per IP).
- **SR-005**: Token payload MUST NOT contain sensitive data (password, secrets).

### Key Entities

- **User**: Represents an authenticated user. Contains id (unique identifier), email (unique, required), hashed password, created_at timestamp. Users own tasks and can only access their own data.

- **Authentication Token**: Self-contained credential issued upon login. Contains user_id, email, issued_at, expires_at. Signed with shared secret. Stateless - no server-side session storage required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration in under 30 seconds.
- **SC-002**: Users can complete login in under 10 seconds.
- **SC-003**: 100% of unauthenticated API requests return 401 status.
- **SC-004**: 100% of authenticated users can only access their own tasks.
- **SC-005**: Zero instances of cross-user data access (complete isolation).
- **SC-006**: Authentication tokens remain valid for configured duration (7 days).
- **SC-007**: System correctly rejects 100% of tampered or expired tokens.

## Assumptions

- Better Auth handles user storage and password hashing on the frontend/auth server.
- The backend only verifies JWT tokens - it does not issue them.
- JWT tokens use HS256 algorithm with shared secret.
- Token expiration is set to 7 days by default.
- The same BETTER_AUTH_SECRET environment variable is used by both frontend and backend.
- Email addresses are unique identifiers for users.
- User deletion is out of scope for this specification.
- Token refresh is optional enhancement, not required for MVP.

## Out of Scope

- OAuth2/social login providers
- Multi-factor authentication (MFA)
- Password reset functionality
- Email verification
- User profile management
- Role-based access control (RBAC)
- API key authentication
- Token refresh endpoints (enhancement)
- Session revocation (stateless JWT limitation)
- Audit logging of authentication events

## Authentication Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. REGISTRATION (Frontend)                                      │
│     User → Better Auth → Create Account → Redirect to Login      │
│                                                                  │
│  2. LOGIN (Frontend)                                             │
│     User Credentials → Better Auth → Verify → Issue JWT Token    │
│                                                                  │
│  3. API REQUEST (Frontend → Backend)                             │
│     Request + Authorization: Bearer <token>                      │
│           ↓                                                      │
│     Backend extracts token from header                           │
│           ↓                                                      │
│     Verify signature with BETTER_AUTH_SECRET                     │
│           ↓                                                      │
│     Decode payload → Extract user_id                             │
│           ↓                                                      │
│     Use user_id for ALL database queries                         │
│           ↓                                                      │
│     Return user-scoped data                                      │
│                                                                  │
│  4. LOGOUT (Frontend)                                            │
│     Clear stored token → Redirect to login                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## JWT Token Structure

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (expected claims):
```json
{
  "sub": "user_id_here",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1235172690
}
```

**Note**: The exact payload structure depends on Better Auth configuration. Backend must be flexible in extracting user_id from either `sub` or `userId` claim.

## API Endpoint Security Matrix

| Endpoint | Auth Required | User Scoping |
|----------|---------------|--------------|
| POST /api/tasks | Yes | Create for authenticated user |
| GET /api/tasks | Yes | Return only authenticated user's tasks |
| GET /api/tasks/{id} | Yes | Return only if owned by authenticated user |
| PUT /api/tasks/{id} | Yes | Update only if owned by authenticated user |
| DELETE /api/tasks/{id} | Yes | Delete only if owned by authenticated user |
| PATCH /api/tasks/{id}/complete | Yes | Toggle only if owned by authenticated user |

**Note**: The URL path no longer needs `{user_id}` parameter. User identity comes from JWT token.

## Error Response Format

**401 Unauthorized**:
```json
{
  "detail": "Authentication required"
}
```

**401 Token Expired**:
```json
{
  "detail": "Token expired"
}
```

**401 Invalid Token**:
```json
{
  "detail": "Invalid token"
}
```

**403 Forbidden** (optional, if URL user_id mismatch is detected):
```json
{
  "detail": "Access denied"
}
```
