# Multi-User Todo Web Application Constitution

<!-- Sync Impact Report
Version: 2.0.0 → 3.0.0
Reason: MAJOR - Addition of Phase III AI Agent architecture with new principles and constraints

Phase Evolution:
- Phase I: In-memory Python console Todo app (spec-driven, clean code)
- Phase II: Full-stack, multi-user web app (FastAPI + Next.js + Neon PostgreSQL + Better Auth)
- Phase III: AI-powered Todo Assistant using MCP (Model Context Protocol)

Core Principles (9 total - 6 retained, 3 added):
1. Spec-Driven Development (NON-NEGOTIABLE) - RETAINED
2. Clean Architecture & Separation of Concerns - RETAINED
3. Stateless Backend & JWT Authentication (NON-NEGOTIABLE) - RETAINED
4. User Data Isolation (NON-NEGOTIABLE) - RETAINED
5. Readability and Maintainability - RETAINED
6. No Hardcoded Secrets (NON-NEGOTIABLE) - RETAINED
7. AI Must Not Access Database Directly (NON-NEGOTIABLE) - NEW
8. Stateless AI Agent Execution (NON-NEGOTIABLE) - NEW
9. Simplicity Over Over-Engineering - NEW

Added Sections:
- AI & Agent Rules
- MCP Architecture Laws
- AI Agent Responsibilities
- Non-Goals

Modified Sections:
- Technology Stack (added AI/MCP layer)
- Monorepo Structure (added mcp-server directory)

Templates requiring updates:
- ✅ plan-template.md: Constitution Check section compatible (Phase III additive)
- ✅ spec-template.md: Requirements format compatible (no changes needed)
- ✅ tasks-template.md: Structure compatible (mcp-server option can be added if needed)

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

The system MUST maintain strict separation between frontend, backend, database, authentication, and AI agent layers.

**Rules:**
- Frontend MUST NOT access database directly
- Backend MUST NOT contain presentation logic
- Authentication logic MUST be centralized and reusable
- Business logic MUST reside in service layers, not route handlers
- Data access MUST be abstracted through repository patterns
- Each layer MUST have clearly defined interfaces
- AI agents MUST NOT bypass service layers for data operations

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
- AI agents MUST respect user isolation through MCP tool authorization

### V. Readability and Maintainability

Code MUST be easy to understand and maintain by human reviewers.

**Rules:**
- Use clear, descriptive names for all identifiers
- Functions MUST do one thing and be named clearly
- Follow language-specific best practices (PEP 8 for Python, TypeScript conventions for frontend)
- Include docstrings/JSDoc for all public functions and classes
- No unused code, dead code, or placeholder logic
- Readability over cleverness in all implementations

### VI. No Hardcoded Secrets (NON-NEGOTIABLE)

Secrets, credentials, and configuration MUST NEVER be hardcoded.

**Rules:**
- ALL secrets MUST come from environment variables
- Use `.env` files for local development (never committed)
- Provide `.env.example` with placeholder values
- NEVER log secrets, credentials, or connection strings
- NEVER expose secrets in error messages or stack traces

### VII. AI Must Not Access Database Directly (NON-NEGOTIABLE)

AI agents MUST NEVER have direct database access. All data operations MUST go through MCP tools.

**Rules:**
- AI agents MUST use MCP tools for ALL data mutations
- MCP tools MUST call existing backend services or repositories
- MCP tools MUST enforce user-level authorization before operations
- AI agents MUST NOT execute raw SQL or direct database connections
- MCP tool responses MUST NOT leak data from other users
- All AI-initiated operations MUST be auditable through existing logging

### VIII. Stateless AI Agent Execution (NON-NEGOTIABLE)

AI agents MUST be stateless and request-scoped.

**Rules:**
- AI agents MUST NOT persist state between requests
- Each AI request MUST be self-contained with all necessary context
- AI agents MUST NOT maintain conversation memory beyond the current session
- Long-term data MUST be stored only through user's tasks (via MCP tools)
- AI agents MUST NOT spawn background processes or autonomous jobs
- AI execution MUST be bounded by request timeout limits

### IX. Simplicity Over Over-Engineering

Development MUST prioritize simplicity, especially within hackathon scope constraints.

**Rules:**
- Implement the minimum viable solution that meets requirements
- Avoid abstractions that don't provide immediate value
- Prefer explicit code over clever patterns
- Do not add features or infrastructure "for the future"
- Decisions MUST be explainable to judges
- Focus on correctness, safety, and user experience

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

### AI & MCP Layer (Phase III)
| Requirement | Technology |
|-------------|------------|
| Protocol | Model Context Protocol (MCP) |
| MCP Server | FastAPI (Python) |
| AI Communication | Secure API routes from frontend |
| Authorization | JWT token passthrough |

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

### AI Agent Security Requirements
- AI requests MUST carry user's JWT token
- MCP tools MUST validate JWT before executing operations
- AI MUST NOT be able to impersonate users
- AI operations MUST be scoped to the authenticated user only

---

## AI & Agent Rules

### MCP Architecture Laws

The AI assistant interacts with user data exclusively through MCP (Model Context Protocol) tools.

**Rules:**
- MCP server MUST be implemented using FastAPI
- Frontend MUST communicate with AI via secure API routes
- MCP tools MUST wrap existing backend services/repositories
- Each MCP tool MUST validate user authorization before execution
- MCP tool responses MUST be sanitized and user-scoped
- Existing theme, UI, and layouts MUST remain unchanged
- No breaking changes to Phase II APIs

### AI Behavior Constraints

**Rules:**
- AI MUST provide helpful task management assistance
- AI MUST use safe defaults when user intent is ambiguous
- AI MUST implement graceful error handling with user-friendly messages
- AI MUST NOT make bulk modifications without explicit user confirmation
- AI MUST confirm destructive operations (delete, clear all) before executing
- AI responses MUST be concise and actionable

### Error Handling

**Rules:**
- MCP tools MUST return structured error responses
- AI MUST explain errors in user-friendly language
- Failed operations MUST NOT leave data in inconsistent state
- Network/timeout errors MUST be handled gracefully
- AI MUST suggest alternatives when operations fail

---

## API Contract Rules

### Required Endpoints (Phase II)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Add a new task |
| GET | /api/tasks | View all user's tasks |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |
| PATCH | /api/tasks/{id}/complete | Toggle task completion |

### MCP Tools (Phase III)
| Tool | Description |
|------|-------------|
| create_task | Create a new task for the authenticated user |
| list_tasks | List all tasks for the authenticated user |
| update_task | Update an existing task (with ownership verification) |
| delete_task | Delete a task (with ownership verification) |
| complete_task | Toggle task completion status |

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

### Phase III Enhancement

6. **AI Chat Interface** - Natural language task management via AI assistant

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
- AI chat interface integration

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
- MCP server implementation
- MCP tool definitions

---

## Non-Goals

The following are explicitly out of scope:

- **No autonomous background agents** - AI operates only in response to user requests
- **No long-term AI memory** - Beyond user's persisted task data
- **No experimental or unstable features** - Production-ready implementations only
- **No multi-tenant AI contexts** - Each user has isolated AI interactions
- **No AI-initiated notifications** - AI responds, never initiates
- **No AI access to external systems** - Only internal MCP tools

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
│   ├── mcp/                     # MCP server and tools (Phase III)
│   │   ├── server.py            # MCP server setup
│   │   └── tools/               # MCP tool definitions
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
- MCP tools MUST have authorization tests

### Documentation Requirements
- Root-level CLAUDE.md defining project rules
- Frontend and Backend CLAUDE.md files for layer-specific rules
- `/specs/` directory containing all specifications
- `.env.example` with all required environment variables

### Quality & Judging Alignment
- Readability over cleverness
- Explicit specs and clear evolution history
- Decisions MUST be explainable to judges
- Focus on correctness, safety, and user experience

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

**Version**: 3.0.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-02-03
