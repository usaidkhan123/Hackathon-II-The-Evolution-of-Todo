Name:
Auth Skill – Signup, Signin, Password Hashing, JWT, Better Auth Integration

Purpose:
Provide reusable, expert-level authentication capabilities for the Phase II Todo full-stack web application, enabling secure user identity management across a Next.js frontend and FastAPI backend using Better Auth and JWT tokens.

Core Responsibilities:
This skill is responsible for authentication logic ONLY, including:
- User signup and signin flows
- Secure password handling (delegated to Better Auth)
- JWT token issuance and verification
- Frontend–backend authentication integration
- Enforcing user isolation via authenticated identity

Explicit Capabilities:
1. Signup & Signin
   - Configure Better Auth for email/password authentication
   - Ensure secure password hashing handled by Better Auth
   - Prevent exposure of plaintext credentials

2. JWT Tokens
   - Enable Better Auth JWT plugin
   - Issue JWT tokens on successful authentication
   - Define token claims required for backend verification (user_id, email)
   - Enforce token expiration (e.g., 7 days)

3. Frontend Integration (Next.js)
   - Attach JWT token to every API request
   - Use Authorization: Bearer <token> header
   - Never trust client-provided user_id without JWT verification

4. Backend Integration (FastAPI)
   - Verify JWT signature using shared secret
   - Decode JWT to extract authenticated user identity
   - Reject unauthenticated or invalid requests with HTTP 401
   - Enforce ownership by scoping all queries to authenticated user_id

5. Shared Secret Management
   - Use environment variable BETTER_AUTH_SECRET
   - Never hardcode secrets
   - Ensure frontend and backend use identical secret

Mandatory Architecture Constraints:
- Authentication logic runs on frontend via Better Auth
- Backend remains stateless
- JWT is the ONLY auth mechanism between services
- No sessions, cookies, or DB lookups for auth on backend
- Users table is managed externally by Better Auth

Spec-Driven Enforcement:
Before using this skill:
- Read and reference:
  - @specs/features/authentication.md
  - @specs/api/rest-endpoints.md
  - @specs/database/schema.md

If specs are missing or ambiguous:
- STOP
- Propose a spec update
- Do NOT guess or implement assumptions

Out of Scope (Skill MUST NOT do):
- Task CRUD logic
- UI styling or layout work
- Database schema changes unrelated to auth
- OAuth, social login, or role-based access
- Manual coding outside Claude Code instructions

Security Guarantees:
- Each request is authenticated
- Each user only accesses their own data
- Tokens are verified on every request
- Invalid or expired tokens are rejected
- Backend never trusts frontend identity claims

Success Criteria:
- Secure signup and signin flow exists
- JWT tokens are correctly issued and verified
- Backend reliably identifies authenticated users
- User isolation is enforced at all API operations
- Behavior matches Phase II hackathon requirements exactly

Usage:
This skill is used by:
- auth-skill-agent
- Any implementation requiring authentication guarantees

End of Skill