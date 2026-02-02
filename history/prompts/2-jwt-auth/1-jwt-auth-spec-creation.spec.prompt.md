---
id: 1
title: JWT Auth Spec Creation
stage: spec
date: 2026-01-30
surface: agent
model: claude-opus-4-5-20251101
feature: 2-jwt-auth
branch: 2-jwt-auth
user: User
command: /sp.specify
labels: ["spec", "authentication", "jwt", "security", "better-auth"]
links:
  spec: specs/2-jwt-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/2-jwt-auth/spec.md
  - specs/2-jwt-auth/checklists/requirements.md
tests:
  - null
---

## Prompt

SPEC 2: Authentication & Security (Better Auth + JWT)
Create a specification for Phase II - Authentication and Security for the Todo Full-Stack Web Application.

Context:
This project uses Better Auth (JavaScript/TypeScript) on the Next.js frontend and FastAPI on the backend. Since Better Auth does not run on Python, authentication must be enforced using JWT tokens.

Scope of This Spec:
- Better Auth configuration
- JWT token issuance
- JWT verification in FastAPI
- Securing REST APIs
- Enforcing user isolation
- Matching authenticated user to requested resources

Authentication Requirements:
Frontend:
- Use Better Auth for user signup and signin
- Enable JWT plugin in Better Auth
- Issue JWT tokens on successful login
- JWT must include user_id and email
- JWT expiration (e.g., 7 days)

Backend:
- All API endpoints require JWT authentication
- JWT must be passed via: Authorization: Bearer <token>
- Backend must: Extract token, Verify signature using shared secret, Decode payload, Identify authenticated user

Shared Secret:
- Use environment variable `BETTER_AUTH_SECRET`
- Same secret must be used by frontend and backend

Security Rules:
- Requests without token -> 401 Unauthorized
- Invalid or expired token -> 401 Unauthorized
- Backend must enforce: Authenticated user can only access their own tasks
- user_id in JWT must match or override URL user_id
- No task operation allowed without authentication

## Response snapshot

Created comprehensive specification for Authentication & Security (JWT) at `specs/2-jwt-auth/spec.md`.

**Specification includes:**
- 6 User Stories (P1-P2 priority) with 20 acceptance scenarios
- 18 Functional Requirements + 5 Security Requirements
- 6 Edge Cases identified
- 7 Measurable Success Criteria
- Authentication Flow Diagram
- JWT Token Structure
- API Endpoint Security Matrix
- Error Response Format

**Key decisions:**
- JWT tokens issued by Better Auth on frontend
- Backend only verifies tokens (does not issue them)
- User ID extracted from JWT, not URL parameter
- Stateless JWT (no server-side session revocation)
- 7-day token expiration by default

**Validation Results:**
- All 16 checklist items passed
- No [NEEDS CLARIFICATION] markers
- Specification is implementation-ready

## Outcome

- Impact: Authentication specification complete - ready for planning phase
- Tests: N/A (specification document)
- Files: 2 files created (spec.md, requirements.md checklist)
- Next prompts: /sp.plan to create implementation plan for authentication
- Reflection: Spec clearly separates frontend (Better Auth) and backend (JWT verification) responsibilities

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All 16 checklist items passed validation
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
