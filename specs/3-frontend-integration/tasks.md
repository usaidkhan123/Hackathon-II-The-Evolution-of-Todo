# Tasks: Frontend & Integration (Next.js + UX)

**Input**: Design documents from `/specs/3-frontend-integration/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Tests are NOT explicitly requested in the spec. Tasks focus on implementation and manual validation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Context**: A substantial frontend already exists from the `2-jwt-auth` feature. This task list focuses on validating existing functionality, filling gaps, and enhancing UX to meet all spec requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` at repository root (Next.js, TypeScript)
- **Components**: `frontend/components/`
- **Pages**: `frontend/app/`
- **Services**: `frontend/services/`
- **Hooks**: `frontend/hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create reusable UI components and hooks that support all user stories

- [x] T001 [P] Create frontend/components/ui/LoadingSpinner.tsx for loading states
- [x] T002 [P] Create frontend/components/ui/ErrorMessage.tsx with retry button support
- [x] T003 [P] Create frontend/components/ui/ConfirmDialog.tsx for delete confirmations
- [x] T004 Create frontend/hooks/useTasks.ts with optimistic update support

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Component extraction and refactoring to support all user stories

**CRITICAL**: Extract components from existing page.tsx before user story enhancements

### Component Extraction

- [x] T005 Create frontend/components/tasks/TaskItem.tsx extracted from app/page.tsx
- [x] T006 Create frontend/components/tasks/TaskForm.tsx for create/edit (reusable component)
- [x] T007 Create frontend/components/tasks/TaskList.tsx container component
- [x] T008 Create frontend/components/tasks/EmptyState.tsx for empty list display
- [x] T009 Refactor frontend/app/page.tsx to use extracted TaskList, TaskItem, TaskForm components

### Touch Target & Accessibility

- [x] T010 Update frontend/components/tasks/TaskItem.tsx to ensure 44px minimum touch targets
- [x] T011 Update frontend/components/auth/LoginForm.tsx to ensure 44px button heights
- [x] T012 Update frontend/components/auth/SignupForm.tsx to ensure 44px button heights
- [x] T013 Update frontend/components/auth/LogoutButton.tsx to ensure 44px touch target

**Checkpoint**: Foundation ready - all components extracted and accessible

---

## Phase 3: User Story 1 - View Task List (Priority: P1) MVP

**Goal**: Users see all their tasks immediately upon logging in with clear visual indicators

**Independent Test**: Log in and verify task list displays with title, completion status, and creation date. Verify empty state shows guidance.

### Implementation for User Story 1

- [x] T014 [US1] Verify frontend/components/tasks/TaskItem.tsx displays title, status, description, and created_at
- [x] T015 [US1] Verify frontend/components/tasks/TaskItem.tsx shows strikethrough and muted colors for completed tasks
- [x] T016 [US1] Update frontend/components/tasks/EmptyState.tsx with guidance message to create first task
- [x] T017 [US1] Update frontend/components/tasks/TaskList.tsx to integrate LoadingSpinner during data fetch
- [x] T018 [US1] Verify responsive layout works on 320px viewport in frontend/app/page.tsx

**Checkpoint**: User Story 1 complete - task list displays correctly with visual distinction for completed tasks

---

## Phase 4: User Story 2 - Create New Task (Priority: P1)

**Goal**: Users can quickly add new tasks with title and optional description

**Independent Test**: Open create form, enter title and description, submit, verify task appears in list.

### Implementation for User Story 2

- [x] T019 [US2] Verify frontend/components/tasks/TaskForm.tsx has title (required) and description (optional) fields
- [x] T020 [US2] Implement title required validation with error message in TaskForm.tsx
- [x] T021 [US2] Verify new tasks appear immediately in list after creation in frontend/app/page.tsx
- [x] T022 [US2] Verify new tasks show as incomplete by default
- [x] T023 [US2] Add loading state to submit button during creation in TaskForm.tsx

**Checkpoint**: User Story 2 complete - users can create tasks with validation

---

## Phase 5: User Story 3 - Mark Task Complete/Incomplete (Priority: P1)

**Goal**: Users can toggle completion status with immediate visual feedback (within 500ms)

**Independent Test**: Click completion toggle, verify visual change immediately, refresh and verify persistence.

### Implementation for User Story 3

- [x] T024 [US3] Implement optimistic toggle in frontend/hooks/useTasks.ts for instant UI feedback
- [x] T025 [US3] Update frontend/components/tasks/TaskItem.tsx to use optimistic toggle from useTasks hook
- [x] T026 [US3] Add rollback on API failure in useTasks.ts with error notification
- [x] T027 [US3] Verify completion toggle reflects visually within 500ms (SC-003)

**Checkpoint**: User Story 3 complete - toggle completion with optimistic updates

---

## Phase 6: User Story 4 - Edit Existing Task (Priority: P2)

**Goal**: Users can modify title and description of existing tasks

**Independent Test**: Click edit on task, modify content, save, verify changes persist.

### Implementation for User Story 4

- [x] T028 [US4] Update frontend/components/tasks/TaskItem.tsx edit mode to use TaskForm component
- [x] T029 [US4] Ensure TaskForm.tsx pre-populates current task values when editing
- [x] T030 [US4] Implement cancel functionality that discards changes
- [x] T031 [US4] Add title required validation when editing (prevent empty title save)
- [x] T032 [US4] Add loading state during update operation

**Checkpoint**: User Story 4 complete - users can edit tasks with validation

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Users can permanently remove tasks with confirmation

**Independent Test**: Click delete, confirm in dialog, verify task removed from list and backend.

### Implementation for User Story 5

- [x] T033 [US5] Replace browser confirm() with ConfirmDialog component in frontend/app/page.tsx
- [x] T034 [US5] Update delete handler to show ConfirmDialog before deletion
- [x] T035 [US5] Implement cancel functionality in ConfirmDialog that preserves task
- [x] T036 [US5] Add loading state during delete operation

**Checkpoint**: User Story 5 complete - users can delete tasks with proper confirmation

---

## Phase 8: User Story 6 - User Authentication Flow (Priority: P1)

**Goal**: Users must log in with proper validation and error handling

**Independent Test**: Visit protected page while logged out, complete login, verify access to tasks.

### Implementation for User Story 6

- [x] T037 [US6] Verify frontend/middleware.ts redirects unauthenticated users to login
- [x] T038 [US6] Verify frontend/components/auth/LoginForm.tsx validates email and password fields
- [x] T039 [US6] Verify login error message is generic (no credential enumeration) - "Invalid email or password"
- [x] T040 [US6] Verify frontend/components/auth/SignupForm.tsx validates email format and password length
- [x] T041 [US6] Verify signup form confirms password match before submission
- [x] T042 [US6] Verify frontend/components/auth/LogoutButton.tsx clears session and redirects to login
- [x] T043 [US6] Verify post-login redirect goes to task list (/)

**Checkpoint**: User Story 6 complete - authentication flow works with proper validation

---

## Phase 9: User Story 7 - Session Persistence (Priority: P2)

**Goal**: Users remain logged in across browser sessions

**Independent Test**: Log in, close browser, reopen, verify still authenticated.

### Implementation for User Story 7

- [x] T044 [US7] Verify Better Auth session cookie persists across browser sessions
- [x] T045 [US7] Update frontend/services/api.ts to detect expired session and redirect gracefully
- [x] T046 [US7] Add session expiration message before redirect to login

**Checkpoint**: User Story 7 complete - session persistence works correctly

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, performance, and final validation

### Error Handling Improvements

- [x] T047 [P] Update frontend/services/api.ts with user-friendly error messages per error type
- [x] T048 [P] Add network error detection with "Unable to connect" message and retry button
- [x] T049 Add retry functionality to ErrorMessage component for failed operations

### Performance Optimization

- [x] T050 Add request debouncing for rapid toggle clicks in useTasks.ts
- [ ] T051 Test performance with 50+ tasks (SC-007)

### Responsive Design Validation

- [x] T052 Verify all pages work on 320px viewport (FR-020, SC-006)
- [x] T053 Verify no horizontal scrolling on mobile (FR-022)
- [x] T054 Verify all touch targets are 44px minimum (FR-021)

### Final Integration Validation

- [ ] T055 Manual E2E test: Complete signup → login → create task → toggle → edit → delete flow
- [ ] T056 Verify all 22 acceptance scenarios pass
- [ ] T057 Verify all 7 success criteria meet requirements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1, US2, US3, US6: P1 priority - implement first
  - US4, US5, US7: P2 priority - implement after P1 stories
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 2 (Foundational)
    │
    ├──→ US1 (View Task List) ──┐
    │                           │
    ├──→ US2 (Create Task) ─────┼──→ US4 (Edit Task)
    │                           │
    ├──→ US3 (Toggle Complete) ─┼──→ US5 (Delete Task)
    │                           │
    └──→ US6 (Auth Flow) ───────┴──→ US7 (Session Persistence)
```

**Note**: All user stories are independently testable but share foundational components.

### Within Each User Story

- Verify existing functionality first
- Enhance or fix as needed
- Validate against acceptance scenarios
- Mark checkpoint complete before next story

### Parallel Opportunities

**Setup Phase (T001-T004)**:
- T001, T002, T003 can run in parallel (different files)

**Foundational Phase (T005-T013)**:
- T005, T006, T007, T008 can run in parallel initially (new component files)
- T010, T011, T012, T013 can run in parallel (touch target updates)

**User Story Phases**:
- P1 stories (US1, US2, US3, US6) can be worked in parallel after Foundational
- P2 stories (US4, US5, US7) can be worked in parallel after P1 stories

**Polish Phase (T047-T057)**:
- T047, T048 can run in parallel
- T052, T053, T054 can run in parallel (responsive validation)

---

## Parallel Example: Foundational Phase

```bash
# Launch component extraction in parallel:
Task T005: "Create frontend/components/tasks/TaskItem.tsx"
Task T006: "Create frontend/components/tasks/TaskForm.tsx"
Task T007: "Create frontend/components/tasks/TaskList.tsx"
Task T008: "Create frontend/components/tasks/EmptyState.tsx"

# After extraction, launch touch target updates in parallel:
Task T010: "Update TaskItem.tsx for 44px touch targets"
Task T011: "Update LoginForm.tsx for 44px button heights"
Task T012: "Update SignupForm.tsx for 44px button heights"
Task T013: "Update LogoutButton.tsx for 44px touch target"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3, 6 Only)

1. Complete Phase 1: Setup (reusable UI components)
2. Complete Phase 2: Foundational (component extraction)
3. Complete Phase 3: User Story 1 (View Task List)
4. Complete Phase 4: User Story 2 (Create Task)
5. Complete Phase 5: User Story 3 (Toggle Complete)
6. Complete Phase 8: User Story 6 (Auth Flow)
7. **STOP and VALIDATE**: Test core task management flow
8. Deploy/demo if ready (MVP complete!)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (View) → Users can see their tasks
3. Add US2 (Create) → Users can add tasks
4. Add US3 (Toggle) → Users can mark tasks complete
5. Add US6 (Auth) → Full auth flow verified
6. **MVP Checkpoint** - Core functionality complete
7. Add US4 (Edit) → Users can modify tasks
8. Add US5 (Delete) → Users can remove tasks
9. Add US7 (Session) → Session persistence verified
10. Polish phase → Production ready

### Single Developer Strategy

Work through phases sequentially in priority order:
1. Setup → Foundational → US1 → US2 → US3 → US6 (MVP)
2. Then: US4 → US5 → US7 → Polish

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 57 |
| **Setup Tasks** | 4 (T001-T004) |
| **Foundational Tasks** | 9 (T005-T013) |
| **User Story 1 (View List)** | 5 tasks |
| **User Story 2 (Create)** | 5 tasks |
| **User Story 3 (Toggle)** | 4 tasks |
| **User Story 4 (Edit)** | 5 tasks |
| **User Story 5 (Delete)** | 4 tasks |
| **User Story 6 (Auth)** | 7 tasks |
| **User Story 7 (Session)** | 3 tasks |
| **Polish Tasks** | 11 (T047-T057) |
| **Parallel Opportunities** | 12 tasks marked [P] |
| **MVP Scope** | Setup + Foundational + US1-US3 + US6: 34 tasks |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Many tasks are "verify" tasks since baseline implementation exists
- "Update" tasks indicate enhancements to existing functionality
- Component extraction (Phase 2) is critical for maintainability
- Optimistic updates (US3) are key for meeting SC-003 (500ms feedback)
- Touch targets (44px) are verified across all interactive elements
- Commit after each task or logical group
