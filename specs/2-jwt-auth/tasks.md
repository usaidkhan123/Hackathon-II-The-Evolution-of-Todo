# Tasks: Authentication & Security (JWT)

**Input**: Design documents from `/specs/2-jwt-auth/`
**Prerequisites**: plan.md (required), spec.md (required), contracts/auth-flow.md

**Tests**: Tests are NOT explicitly requested in the spec. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` at repository root (FastAPI, Python)
- **Frontend**: `frontend/` at repository root (Next.js, TypeScript)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and configuration

- [x] T001 Add python-jose[cryptography] to backend/requirements.txt for JWT verification
- [x] T002 [P] Add BETTER_AUTH_SECRET to backend/core/config.py Settings class
- [x] T003 [P] Create frontend/ directory structure per plan.md (app/, lib/, components/, services/)
- [x] T004 Initialize Next.js 16+ project in frontend/ with App Router
- [x] T005 [P] Install Better Auth packages: better-auth, @better-auth/jwt in frontend/
- [x] T006 [P] Create backend/.env.example with BETTER_AUTH_SECRET placeholder
- [x] T007 [P] Create frontend/.env.example with BETTER_AUTH_SECRET and NEXT_PUBLIC_API_URL placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Backend JWT Verification Infrastructure

- [x] T008 Create backend/core/security.py with verify_token() function using python-jose
- [x] T009 Create backend/schemas/auth.py with TokenPayload Pydantic model
- [x] T010 Create backend/api/dependencies/auth.py with get_current_user dependency and CurrentUser class

### Frontend Better Auth Infrastructure

- [x] T011 Create frontend/lib/auth.ts with Better Auth server configuration and JWT plugin
- [x] T012 Create frontend/lib/auth-client.ts with Better Auth client instance and hooks
- [x] T013 Create frontend/app/api/auth/[...all]/route.ts for Better Auth API routes
- [x] T014 Create frontend/components/providers/AuthProvider.tsx with session context
- [x] T015 Update frontend/app/layout.tsx to wrap app with AuthProvider

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Registration (Priority: P1) MVP

**Goal**: Users can create accounts with email and password

**Independent Test**: Submit registration form with valid email/password, verify account creation and redirect

### Implementation for User Story 1

- [x] T016 [P] [US1] Create frontend/app/(auth)/signup/page.tsx signup page shell
- [x] T017 [P] [US1] Create frontend/components/auth/SignupForm.tsx with email, password, confirm password fields
- [x] T018 [US1] Implement form validation in SignupForm: email format, password min 8 chars, password confirmation match
- [x] T019 [US1] Connect SignupForm to Better Auth signUp() function with loading state
- [x] T020 [US1] Handle registration errors: display "Email already registered" for duplicate emails
- [x] T021 [US1] Implement post-registration redirect to login page or auto-login

**Checkpoint**: Users can register new accounts

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Registered users can log in and receive JWT token

**Independent Test**: Login with valid credentials, verify JWT token received and stored

### Implementation for User Story 2

- [x] T022 [P] [US2] Create frontend/app/(auth)/login/page.tsx login page shell
- [x] T023 [P] [US2] Create frontend/components/auth/LoginForm.tsx with email and password fields
- [x] T024 [US2] Implement form validation in LoginForm: required fields, email format
- [x] T025 [US2] Connect LoginForm to Better Auth signIn() function with loading state
- [x] T026 [US2] Handle login errors: display "Invalid email or password" (same message for security)
- [x] T027 [US2] Implement post-login redirect to task dashboard (/tasks or /)
- [x] T028 [US2] Verify JWT token is stored and accessible via getSession()

**Checkpoint**: Users can login and receive valid JWT tokens

---

## Phase 5: User Story 3 - Protected API Access (Priority: P1)

**Goal**: Backend validates JWT tokens on all task API endpoints

**Independent Test**: Make API requests with/without valid tokens, verify 401 for invalid/missing tokens

### Implementation for User Story 3

- [x] T029 [US3] Update backend/api/routes/tasks.py: change router prefix from "/{user_id}/tasks" to "/tasks"
- [x] T030 [US3] Update create_task route: replace user_id path param with CurrentUser dependency
- [x] T031 [US3] Update list_tasks route: replace user_id path param with CurrentUser dependency
- [x] T032 [US3] Update get_task route: replace user_id path param with CurrentUser dependency
- [x] T033 [US3] Update update_task route: replace user_id path param with CurrentUser dependency
- [x] T034 [US3] Update delete_task route: replace user_id path param with CurrentUser dependency
- [x] T035 [US3] Update toggle_complete route: replace user_id path param with CurrentUser dependency
- [x] T036 [US3] Add JWT exception handler to backend/main.py for JWTError

**Checkpoint**: All task endpoints require and validate JWT tokens

---

## Phase 6: User Story 4 - User Identity Enforcement (Priority: P1)

**Goal**: Users can only access their own tasks (enforced via JWT user_id)

**Independent Test**: Create tasks as user A, verify user B cannot see/modify them

### Implementation for User Story 4

- [x] T037 [US4] Create frontend/services/api.ts with fetchWithAuth() function that includes JWT in Authorization header
- [x] T038 [US4] Implement taskApi.list() in frontend/services/api.ts
- [x] T039 [US4] Implement taskApi.create() in frontend/services/api.ts
- [x] T040 [US4] Implement taskApi.update() in frontend/services/api.ts
- [x] T041 [US4] Implement taskApi.delete() in frontend/services/api.ts
- [x] T042 [US4] Implement taskApi.toggleComplete() in frontend/services/api.ts
- [x] T043 [US4] Handle 401 responses in fetchWithAuth: redirect to login page

**Checkpoint**: Frontend API calls include JWT, backend enforces user isolation

---

## Phase 7: User Story 5 - User Logout (Priority: P2)

**Goal**: Users can log out and clear their session

**Independent Test**: Click logout, verify redirect to login and token cleared

### Implementation for User Story 5

- [x] T044 [P] [US5] Create frontend/components/auth/LogoutButton.tsx component
- [x] T045 [US5] Connect LogoutButton to Better Auth signOut() function
- [x] T046 [US5] Implement post-logout redirect to login page
- [x] T047 [US5] Clear any locally stored token/session data on logout

**Checkpoint**: Users can logout and session is terminated

---

## Phase 8: User Story 6 - Session Persistence (Priority: P2)

**Goal**: Users remain logged in across browser sessions until token expires

**Independent Test**: Login, close browser, reopen - verify still authenticated

### Implementation for User Story 6

- [x] T048 [US6] Create frontend/middleware.ts for route protection
- [x] T049 [US6] Implement middleware logic: redirect unauthenticated users to /login for protected routes
- [x] T050 [US6] Configure middleware matcher to protect /tasks and root routes, exclude /login and /signup
- [x] T051 [US6] Verify Better Auth session persistence configuration (cookie settings)
- [x] T052 [US6] Handle expired token scenario: detect and redirect to login

**Checkpoint**: Session persists across browser sessions

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T053 [P] Add loading spinner components for auth forms
- [x] T054 [P] Style auth pages (login/signup) with consistent design
- [x] T055 [P] Add error boundary for auth-related errors
- [x] T056 Verify CORS configuration in backend/main.py allows frontend origin
- [x] T057 Update backend/.env.example and frontend/.env.example with all required variables
- [ ] T058 Manual end-to-end validation: complete flow from signup to task CRUD

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Registration) and US2 (Login): Can start in parallel after Phase 2
  - US3 (Protected API): Depends on US2 (needs valid JWT to test)
  - US4 (User Isolation): Depends on US3 (needs protected endpoints)
  - US5 (Logout): Depends on US2 (needs login to test logout)
  - US6 (Session Persistence): Depends on US2 (needs login to persist)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 2 (Foundational)
    │
    ├──→ US1 (Registration) ──┐
    │                         │
    └──→ US2 (Login) ─────────┼──→ US3 (Protected API) ──→ US4 (User Isolation)
                              │
                              ├──→ US5 (Logout)
                              │
                              └──→ US6 (Session Persistence)
```

### Within Each User Story

- Page shell before form component
- Form component before validation logic
- Validation before API integration
- API integration before error handling
- Error handling before redirect logic

### Parallel Opportunities

**Setup Phase (T001-T007)**:
- T002, T003 can run in parallel
- T006, T007 can run in parallel

**Foundational Phase (T008-T015)**:
- Backend (T008-T010) and Frontend (T011-T015) can be worked in parallel by different developers

**User Story Phases**:
- US1 and US2 can be worked in parallel after Foundational
- Page shell tasks (T016/T022) can run in parallel with form component tasks (T017/T023)

---

## Parallel Example: Foundational Phase

```bash
# Backend developer works on:
Task T008: "Create backend/core/security.py with verify_token() function"
Task T009: "Create backend/schemas/auth.py with TokenPayload model"
Task T010: "Create backend/api/dependencies/auth.py with get_current_user"

# Frontend developer works on (simultaneously):
Task T011: "Create frontend/lib/auth.ts with Better Auth config"
Task T012: "Create frontend/lib/auth-client.ts with client instance"
Task T013: "Create frontend/app/api/auth/[...all]/route.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Login)
5. Complete Phase 5: User Story 3 (Protected API)
6. Complete Phase 6: User Story 4 (User Isolation)
7. **STOP and VALIDATE**: Test registration → login → task CRUD flow
8. Deploy/demo if ready (MVP complete!)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Users can register and login (Auth MVP!)
3. Add US3 → Backend validates tokens
4. Add US4 → Frontend sends tokens, full isolation (Core MVP!)
5. Add US5 → Logout functionality
6. Add US6 → Session persistence
7. Polish phase → Production ready

### Parallel Team Strategy

With two developers (Backend + Frontend):

1. Both complete Setup together
2. Foundational phase:
   - Backend dev: T008-T010 (JWT verification)
   - Frontend dev: T011-T015 (Better Auth setup)
3. User Stories:
   - Frontend dev: US1 (Registration), US2 (Login), US5 (Logout), US6 (Persistence)
   - Backend dev: US3 (Protected API), then assist with US4 (API integration)

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 58 |
| **Completed Tasks** | 57 |
| **Remaining Tasks** | 1 (T058 - Manual E2E validation) |
| **Setup Tasks** | 7/7 (T001-T007) ✓ |
| **Foundational Tasks** | 8/8 (T008-T015) ✓ |
| **User Story 1 (Registration)** | 6/6 tasks ✓ |
| **User Story 2 (Login)** | 7/7 tasks ✓ |
| **User Story 3 (Protected API)** | 8/8 tasks ✓ |
| **User Story 4 (User Isolation)** | 7/7 tasks ✓ |
| **User Story 5 (Logout)** | 4/4 tasks ✓ |
| **User Story 6 (Session Persistence)** | 5/5 tasks ✓ |
| **Polish Tasks** | 5/6 (T053-T057) ✓ |
| **Parallel Opportunities** | 15 tasks marked [P] |
| **MVP Scope** | Phases 1-6 (US1-US4): 36 tasks ✓ |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Backend routes changed from `/{user_id}/tasks` to `/tasks` with JWT auth
- Better Auth handles user storage - backend only verifies JWT tokens
- All authentication errors return same message to prevent user enumeration
- Implementation complete - ready for manual E2E validation (T058)
