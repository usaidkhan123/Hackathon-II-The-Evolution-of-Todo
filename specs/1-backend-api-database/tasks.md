# Tasks: Backend API & Database Layer

**Input**: Design documents from `/specs/1-backend-api-database/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/tasks-api.md

**Tests**: Not explicitly requested in specification. Tests are omitted per Spec-Kit Plus conventions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` at repository root
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and backend directory structure

- [ ] T001 Create backend directory structure per plan.md in backend/
- [ ] T002 Create requirements.txt with FastAPI, SQLModel, uvicorn, psycopg2-binary, pydantic-settings dependencies in backend/requirements.txt
- [ ] T003 [P] Create .env.example with DATABASE_URL, HOST, PORT, DEBUG placeholders in backend/.env.example
- [ ] T004 [P] Create backend CLAUDE.md with backend-specific development rules in backend/CLAUDE.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create Settings class with DATABASE_URL, HOST, PORT, DEBUG in backend/core/config.py
- [ ] T006 Create database engine with connection pooling (pool_pre_ping=True) in backend/db/connection.py
- [ ] T007 Create init_db function with SQLModel.metadata.create_all() in backend/db/init_db.py
- [ ] T008 Create Task SQLModel with id, user_id, title, description, completed, created_at, updated_at in backend/models/task.py
- [ ] T009 Create database session dependency (get_session generator) in backend/api/dependencies/database.py
- [ ] T010 Create Pydantic schemas TaskCreate, TaskUpdate, TaskResponse in backend/schemas/task.py
- [ ] T011 Create TaskRepository class with session injection in backend/repositories/task_repository.py
- [ ] T012 Create TaskService class with repository injection in backend/services/task_service.py
- [ ] T013 Create FastAPI app with lifespan handler calling init_db in backend/main.py
- [ ] T014 [P] Create __init__.py files for all packages (api, api/routes, api/dependencies, schemas, services, repositories, models, db, core)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create a Task (Priority: P1)

**Goal**: Enable API consumers to create new tasks for specific users with persistence

**Independent Test**: POST /api/{user_id}/tasks with valid data returns 201 and task with generated ID

### Implementation for User Story 1

- [ ] T015 [US1] Add create_task method to TaskRepository (insert with user_id, return created task) in backend/repositories/task_repository.py
- [ ] T016 [US1] Add create_task method to TaskService (validate, call repository, return TaskResponse) in backend/services/task_service.py
- [ ] T017 [US1] Create POST /api/{user_id}/tasks endpoint returning 201 with TaskResponse in backend/api/routes/tasks.py
- [ ] T018 [US1] Register tasks router in FastAPI app with /api prefix in backend/main.py

**Checkpoint**: User Story 1 complete - can create tasks via POST endpoint

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Enable API consumers to retrieve all tasks for a specific user

**Independent Test**: GET /api/{user_id}/tasks returns list of tasks filtered by user_id

### Implementation for User Story 2

- [ ] T019 [US2] Add get_tasks method to TaskRepository (SELECT WHERE user_id, return list) in backend/repositories/task_repository.py
- [ ] T020 [US2] Add get_tasks method to TaskService (call repository, return List[TaskResponse]) in backend/services/task_service.py
- [ ] T021 [US2] Create GET /api/{user_id}/tasks endpoint returning 200 with list in backend/api/routes/tasks.py

**Checkpoint**: User Stories 1 & 2 complete - can create and list tasks (MVP Core)

---

## Phase 5: User Story 3 - View Single Task (Priority: P2)

**Goal**: Enable API consumers to retrieve a specific task by ID for a user

**Independent Test**: GET /api/{user_id}/tasks/{id} returns task or 404

### Implementation for User Story 3

- [ ] T022 [US3] Add get_task method to TaskRepository (SELECT WHERE id AND user_id) in backend/repositories/task_repository.py
- [ ] T023 [US3] Add get_task method to TaskService (call repository, raise 404 if None) in backend/services/task_service.py
- [ ] T024 [US3] Create GET /api/{user_id}/tasks/{id} endpoint returning 200 or 404 in backend/api/routes/tasks.py

**Checkpoint**: User Story 3 complete - can retrieve individual tasks

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: Enable API consumers to update existing task details

**Independent Test**: PUT /api/{user_id}/tasks/{id} with valid data returns updated task

### Implementation for User Story 4

- [ ] T025 [US4] Add update_task method to TaskRepository (UPDATE with user_id filter, refresh updated_at) in backend/repositories/task_repository.py
- [ ] T026 [US4] Add update_task method to TaskService (get task, apply updates, save, return TaskResponse) in backend/services/task_service.py
- [ ] T027 [US4] Create PUT /api/{user_id}/tasks/{id} endpoint returning 200, 404, or 422 in backend/api/routes/tasks.py

**Checkpoint**: User Story 4 complete - can update tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Enable API consumers to delete tasks permanently

**Independent Test**: DELETE /api/{user_id}/tasks/{id} returns 204 or 404

### Implementation for User Story 5

- [ ] T028 [US5] Add delete_task method to TaskRepository (DELETE WHERE id AND user_id, return bool) in backend/repositories/task_repository.py
- [ ] T029 [US5] Add delete_task method to TaskService (call repository, raise 404 if not found) in backend/services/task_service.py
- [ ] T030 [US5] Create DELETE /api/{user_id}/tasks/{id} endpoint returning 204 or 404 in backend/api/routes/tasks.py

**Checkpoint**: User Story 5 complete - can delete tasks

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P3)

**Goal**: Enable API consumers to toggle task completion status

**Independent Test**: PATCH /api/{user_id}/tasks/{id}/complete flips completed boolean

### Implementation for User Story 6

- [ ] T031 [US6] Add toggle_complete method to TaskRepository (UPDATE completed = NOT completed, refresh updated_at) in backend/repositories/task_repository.py
- [ ] T032 [US6] Add toggle_complete method to TaskService (call repository, raise 404 if not found) in backend/services/task_service.py
- [ ] T033 [US6] Create PATCH /api/{user_id}/tasks/{id}/complete endpoint returning 200 or 404 in backend/api/routes/tasks.py

**Checkpoint**: All user stories complete - full CRUD + toggle functionality

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [ ] T034 Add CORS middleware configuration for frontend access in backend/main.py
- [ ] T035 Add database connection error handling returning 503 in backend/api/dependencies/database.py
- [ ] T036 Verify all endpoints return correct status codes per API contract
- [ ] T037 Verify user isolation (queries always filter by user_id) across all repository methods

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS ALL USER STORIES
    ↓
Phase 3-8 (User Stories) ← Can run P1→P2→P3 sequentially
    ↓
Phase 9 (Polish)
```

### User Story Dependencies

| Story | Priority | Depends On | Endpoint |
|-------|----------|------------|----------|
| US1 - Create Task | P1 | Phase 2 | POST /api/{user_id}/tasks |
| US2 - View All Tasks | P1 | Phase 2 | GET /api/{user_id}/tasks |
| US3 - View Single Task | P2 | Phase 2 | GET /api/{user_id}/tasks/{id} |
| US4 - Update Task | P2 | Phase 2 | PUT /api/{user_id}/tasks/{id} |
| US5 - Delete Task | P2 | Phase 2 | DELETE /api/{user_id}/tasks/{id} |
| US6 - Toggle Complete | P3 | Phase 2 | PATCH /api/{user_id}/tasks/{id}/complete |

### Within Each User Story

1. Repository method first (data access)
2. Service method second (business logic)
3. Route endpoint last (HTTP handling)

### Parallel Opportunities

**Phase 1 Parallel** (T003, T004 after T001-T002):
```
T003 (.env.example) ─┬─ Can run together
T004 (CLAUDE.md)    ─┘
```

**Phase 2 Parallel** (after T005-T009):
```
T010 (schemas) ─────┬─ Can run together after T008
T014 (__init__.py) ─┘
```

**User Stories** (all can run in parallel after Phase 2 if multiple agents):
```
US1 (T015-T018) ─┬─ Independent
US2 (T019-T021) ─┤
US3 (T022-T024) ─┤
US4 (T025-T027) ─┤
US5 (T028-T030) ─┤
US6 (T031-T033) ─┘
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T014)
3. Complete Phase 3: User Story 1 - Create Task (T015-T018)
4. Complete Phase 4: User Story 2 - View All Tasks (T019-T021)
5. **STOP and VALIDATE**: Test create + list independently
6. Deploy/demo if ready

**MVP delivers**: Create tasks + View task list = minimum usable API

### Incremental Delivery

1. Setup + Foundational → Backend skeleton ready
2. Add US1 + US2 → MVP (Create + List)
3. Add US3 → Detail view capability
4. Add US4 + US5 → Full CRUD
5. Add US6 → Completion toggle
6. Polish → Production ready

### Single Agent Sequential

Execute tasks T001 → T037 in order, validating at each checkpoint.

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1. Setup | T001-T004 | Project structure, dependencies |
| 2. Foundational | T005-T014 | Config, DB, models, schemas, base services |
| 3. US1 Create | T015-T018 | POST endpoint |
| 4. US2 List | T019-T021 | GET list endpoint |
| 5. US3 Single | T022-T024 | GET single endpoint |
| 6. US4 Update | T025-T027 | PUT endpoint |
| 7. US5 Delete | T028-T030 | DELETE endpoint |
| 8. US6 Toggle | T031-T033 | PATCH complete endpoint |
| 9. Polish | T034-T037 | CORS, error handling, validation |

**Total Tasks**: 37
**MVP Tasks**: 21 (T001-T021)
**Full Implementation**: 37

---

## Notes

- All repository methods MUST include user_id in WHERE clause
- Service layer handles HTTPException (404, 422)
- Route handlers are thin (delegate to services)
- Timestamps: created_at set once, updated_at refreshed on every change
- No authentication in this spec (deferred to auth spec)
