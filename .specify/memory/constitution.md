# Multi-User Todo Web Application Constitution

<!-- Sync Impact Report
Version: 2.0.0 (validated 2026-01-29)
Reason: Complete architectural transformation from console app to full-stack web application

This constitution defines the non-negotiable laws for Hackathon Phase II:
- Transform Phase I console todo app into multi-user web application
- Agentic Dev Stack workflow: spec → plan → tasks → implementation
- No manual coding; all implementation via Claude Code using specs

Core Principles (6 total):
1. Spec-Driven Development (NON-NEGOTIABLE)
2. Clean Architecture & Separation of Concerns
3. Stateless Backend & JWT Authentication (NON-NEGOTIABLE)
4. User Data Isolation (NON-NEGOTIABLE)
5. Readability and Maintainability
6. No Hardcoded Secrets (NON-NEGOTIABLE)

Technology Stack (MUST NOT DEVIATE):
- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Better Auth
- Backend: FastAPI (Python), SQLModel, REST API
- Database: Neon Serverless PostgreSQL
- Development: Spec-Kit Plus, Claude Code

Templates requiring updates:
- ✅ plan-template.md: Constitution Check section compatible
- ✅ spec-template.md: Requirements format compatible
- ✅ tasks-template.md: Web app structure option matches

Follow-up TODOs: None
-->

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All implementation MUST strictly follow approved specifications. No feature or change may be implemented without a corresponding specification document.

**Rules:**
- Specs MUST be reviewed and approved before implementation begins
- Specs are the single source of truth for all behavior
- Code MUST NOT introduce behavior not defined in specs
- Changes in requirements MUST be reflected by updating specs first
- Claude Code MUST read relevant specs before implementing anything
- Implementation MUST respect clean architecture and separation of concerns

### II. Clean Architecture & Separation of Concerns

The system MUST maintain strict separation between frontend, backend, database, and authentication layers.

**Rules:**
- Frontend MUST NOT access database directly
- Backend MUST NOT contain presentation logic
- Authentication logic MUST be centralized and reusable
- Business logic MUST reside in service layers, not route handlers
- Data access MUST be abstracted through repository patterns
- Each layer MUST have clearly defined interfaces

### III. Stateless Backend & JWT Authentication (NON-NEGOTIABLE)

All backend API requests MUST be authenticated using stateless JWT tokens.

**Rules:**
- Every API request MUST require a valid JWT token
- JWT MUST be passed via `Authorization: Bearer <token>` header
- Backend MUST verify JWT signature using shared secret (`BETTER_AUTH_SECRET`)
- Backend MUST extract user identity from verified JWT
- Backend MUST NOT maintain session state with frontend
- Unauthorized requests MUST return HTTP 401

### IV. User Data Isolation (NON-NEGOTIABLE)

Each user's data MUST be completely isolated from other users.

**Rules:**
- User ID MUST be derived from JWT, never from request body
- ALL database queries MUST filter by authenticated user_id
- Task ownership MUST be enforced for ALL CRUD operations
- Users MUST NOT access, view, or modify other users' data
- Cross-user data leakage MUST be prevented at every layer

### V. Readability and Maintainability

Code MUST be easy to understand and maintain by human reviewers.

**Rules:**
- Use clear, descriptive names for all identifiers
- Functions MUST do one thing and be named clearly
- Follow language-specific best practices (PEP 8 for Python, TypeScript conventions for frontend)
- Include docstrings/JSDoc for all public functions and classes
- No unused code, dead code, or placeholder logic

### VI. No Hardcoded Secrets (NON-NEGOTIABLE)

Secrets, credentials, and configuration MUST NEVER be hardcoded.

**Rules:**
- ALL secrets MUST come from environment variables
- Use `.env` files for local development (never committed)
- Provide `.env.example` with placeholder values
- NEVER log secrets, credentials, or connection strings
- NEVER expose secrets in error messages or stack traces

---

## Technology Stack (MUST NOT DEVIATE)

### Frontend
| Requirement | Technology |
|-------------|------------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Authentication | Better Auth (with JWT plugin) |

### Backend
| Requirement | Technology |
|-------------|------------|
| Framework | FastAPI (Python) |
| ORM | SQLModel |
| API Style | REST under `/api/` |
| Authentication | JWT verification (shared secret) |

### Database
| Requirement | Technology |
|-------------|------------|
| Database | Neon Serverless PostgreSQL |
| Connection | Via `DATABASE_URL` environment variable |

### Development Tools
| Tool | Purpose |
|------|---------|
| Spec-Kit Plus | Specification management |
| Claude Code | Implementation via specs |

---

## Authentication & Security Laws

### JWT Token Flow
1. User logs in on Frontend → Better Auth creates session and issues JWT
2. Frontend makes API call → Includes JWT in `Authorization: Bearer <token>` header
3. Backend receives request → Extracts token, verifies signature using `BETTER_AUTH_SECRET`
4. Backend identifies user → Decodes token to get user_id
5. Backend filters data → Returns only tasks belonging to that user

### Security Requirements
- ALL REST endpoints MUST require valid JWT token
- Requests without token → HTTP 401
- Requests with invalid/expired token → HTTP 401
- User isolation MUST be enforced at EVERY operation
- Backend MUST remain stateless

---

## API Contract Rules

### Required Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Add a new task |
| GET | /api/tasks | View all user's tasks |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |
| PATCH | /api/tasks/{id}/complete | Toggle task completion |

### Response Format
- All responses MUST be JSON
- Success responses MUST include data payload
- Error responses MUST include `detail` and `code` fields
- HTTP status codes MUST be semantically correct

---

## Functional Requirements

The system MUST implement these 5 core features:

1. **Add Task** - Create new task with title, description, due date
2. **View Tasks** - List all tasks for authenticated user
3. **Update Task** - Modify existing task details
4. **Delete Task** - Remove task permanently
5. **Mark Complete/Incomplete** - Toggle task completion status

ALL operations MUST be scoped to the authenticated user.

---

## Agent Responsibilities

### Auth Agent (`auth-skill-agent`)
- Better Auth configuration
- JWT token handling
- Authentication middleware
- User isolation enforcement

### Frontend Agent (`frontend-skill-agent`)
- Next.js UI components
- Responsive design
- API service layer
- Authentication UI

### Database Agent (`neon-db-architect`)
- Schema design
- Repository implementation
- Migration management
- Query optimization

### Backend Agent (`fastapi-backend-engineer`)
- REST API endpoints
- Pydantic schemas
- Service layer logic
- JWT verification guards

---

## Monorepo Structure

```text
/
├── frontend/                    # Next.js 16+ App Router
│   ├── app/                     # Pages and layouts
│   ├── components/              # Reusable UI components
│   ├── services/                # API communication layer
│   ├── lib/                     # Utilities and auth config
│   └── CLAUDE.md                # Frontend-specific rules
│
├── backend/                     # Python FastAPI
│   ├── main.py                  # App initialization
│   ├── api/routes/              # Route handlers
│   ├── api/dependencies/        # Auth guards
│   ├── schemas/                 # Pydantic models
│   ├── services/                # Business logic
│   ├── repositories/            # Data access
│   └── CLAUDE.md                # Backend-specific rules
│
├── specs/                       # Feature specifications
│   └── <feature>/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── history/                     # Development history
│   ├── prompts/                 # PHR records
│   └── adr/                     # Architecture decisions
│
├── .specify/                    # SpecKit Plus configuration
└── CLAUDE.md                    # Root-level rules
```

---

## Development Standards

### Code Quality
- No unused code, dead code, or placeholder logic
- All functions MUST have clear, descriptive names
- Functions MUST do one thing and do it well
- Follow language-specific style guides
- Include docstrings/JSDoc for all public interfaces

### Testing Requirements
- All features MUST be testable
- Tests MUST cover both happy paths and edge cases
- Regression tests MUST be added for all bug fixes
- Authentication and authorization MUST be tested

### Documentation Requirements
- Root-level CLAUDE.md defining project rules
- Frontend and Backend CLAUDE.md files for layer-specific rules
- `/specs/` directory containing all specifications
- `.env.example` with all required environment variables

---

## Governance

### Constitution Compliance
This constitution supersedes all other practices and guidelines. All code, documentation, and development processes MUST comply with these principles. Violations MUST be rejected.

### Amendment Process
- Amendments require documentation of the change
- Amendments MUST be approved through standard review process
- Major changes require migration plans

### Versioning Policy
- **MAJOR**: Backward incompatible changes (architecture, principles)
- **MINOR**: New principles, sections, or material expansions
- **PATCH**: Clarifications, wording improvements, typo fixes

### Review Requirements
- All pull requests MUST verify compliance with this constitution
- Non-compliant code MUST be rejected or refactored
- Security violations are grounds for immediate rejection

---

**Version**: 2.0.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-01-29
