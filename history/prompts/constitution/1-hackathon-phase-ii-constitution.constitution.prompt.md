---
id: 1
title: Hackathon Phase II Constitution
stage: constitution
date: 2026-01-29
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: User
command: /sp.constitution
labels: ["constitution", "hackathon", "phase-ii", "spec-driven-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Create the sp.constitution file for Hackathon Phase II.

Context:
This project is a continuation of Phase I (Python in-memory console todo app) and now enters Phase II: a full-stack, multi-user web application using spec-driven development with Spec-Kit Plus and Claude Code.

The constitution must strictly enforce the following principles and constraints:

Project Goals:
- Transform the console-based todo app into a modern full-stack web application
- Support multiple users with strict user data isolation
- Persist data using Neon Serverless PostgreSQL
- Secure all backend APIs using JWT-based authentication
- Follow Agentic Dev Stack workflow: spec -> plan -> tasks -> implementation
- No manual coding; all implementation must be driven via Claude Code using specs

Core Architectural Rules:
- Use a monorepo structure with frontend and backend in a single repository
- Specs must live under `/specs` and follow Spec-Kit Plus conventions
- All development must reference specs explicitly using @specs/... notation
- CLAUDE.md files must guide behavior at root, frontend, and backend levels

Technology Constraints (Must Not Be Violated):
Frontend:
- Next.js 16+ using App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- JWT tokens must be issued on login

Backend:
- FastAPI (Python)
- SQLModel as ORM
- Neon Serverless PostgreSQL
- REST API under `/api/`
- JWT verification using shared secret (BETTER_AUTH_SECRET)

Authentication & Security Laws:
- Every API request must require a valid JWT token
- JWT must be passed via Authorization: Bearer <token>
- Backend must verify JWT signature and extract user identity
- User ID in JWT must match or be enforced against requested resources
- Tasks must always be filtered by authenticated user
- Unauthorized requests must return 401
- Task ownership must be enforced for all CRUD operations

Functional Requirements:
- Implement all 5 basic todo features:
  - Add task
  - View tasks
  - Update task
  - Delete task
  - Mark task complete/incomplete
- All operations must be scoped to the authenticated user
- REST API endpoints must follow the provided API contract
- Frontend must be responsive and consume backend APIs via a centralized API client

Spec-Driven Development Rules:
- Specs are the single source of truth
- Code must not introduce behavior not defined in specs
- Changes in requirements must be reflected by updating specs first
- Claude Code must read relevant specs before implementing anything
- Implementation must respect clean architecture and separation of concerns

Quality & Judging Expectations:
- Clean, readable, maintainable code
- Clear separation between frontend, backend, and specs
- Explicit evidence of spec -> implementation traceability
- Constitution must act as a non-negotiable law for all agents and code generation

Output Requirements:
- Produce a complete sp.constitution file
- Use clear, enforceable rules (MUST / MUST NOT / SHOULD)
- Keep it concise but strict
- Tailored specifically for Hackathon Phase II

## Response snapshot

Validated and updated the constitution at `.specify/memory/constitution.md` (version 2.0.0). The constitution already comprehensively covers all Hackathon Phase II requirements including:

- 6 Core Principles with NON-NEGOTIABLE markers for critical rules
- Complete Technology Stack specification (Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)
- JWT Authentication flow and security laws
- User data isolation requirements
- API contract with 5 required endpoints
- Monorepo structure requirements
- Agent responsibilities for Auth, Frontend, Database, and Backend agents
- Development standards for code quality, testing, and documentation
- Governance section with amendment process and versioning policy

Updated the Sync Impact Report to reflect current state and validated template compatibility.

## Outcome

- Impact: Constitution validated for Hackathon Phase II - ready for spec-driven development
- Tests: N/A (governance document)
- Files: 1 file updated (.specify/memory/constitution.md)
- Next prompts: /sp.specify to create feature specifications for the todo web app
- Reflection: Constitution was already well-structured for Phase II; validated completeness against user requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All requirements from user input covered in constitution
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
