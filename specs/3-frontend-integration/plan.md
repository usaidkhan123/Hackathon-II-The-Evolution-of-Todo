# Implementation Plan: Frontend & Integration (Next.js + UX)

**Branch**: `3-frontend-integration` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/3-frontend-integration/spec.md`

## Summary

This plan documents the frontend implementation for the Todo application. A substantial foundation already exists from the `2-jwt-auth` feature implementation. This plan focuses on validating existing functionality against the spec, filling gaps, and enhancing UX to meet all acceptance criteria.

## Current State Analysis

### Existing Implementation (from 2-jwt-auth)

The following components already exist and provide baseline functionality:

| Component | Path | Status | Notes |
|-----------|------|--------|-------|
| Login Page | `app/(auth)/login/page.tsx` | EXISTS | Needs validation |
| Signup Page | `app/(auth)/signup/page.tsx` | EXISTS | Needs validation |
| Task Dashboard | `app/page.tsx` | EXISTS | Core CRUD implemented |
| Login Form | `components/auth/LoginForm.tsx` | EXISTS | With validation |
| Signup Form | `components/auth/SignupForm.tsx` | EXISTS | With validation |
| Logout Button | `components/auth/LogoutButton.tsx` | EXISTS | Basic implementation |
| Auth Provider | `components/providers/AuthProvider.tsx` | EXISTS | Session context |
| API Client | `services/api.ts` | EXISTS | JWT attachment |
| Auth Config | `lib/auth.ts` | EXISTS | Better Auth server |
| Auth Client | `lib/auth-client.ts` | EXISTS | Client instance |
| Route Middleware | `middleware.ts` | EXISTS | Protected routes |
| Auth API Routes | `app/api/auth/[...all]/route.ts` | EXISTS | Better Auth handler |

### Gap Analysis

| Requirement | Current State | Action Needed |
|-------------|---------------|---------------|
| FR-007: Display creation date | EXISTS | Already shows created_at |
| FR-008: Visual distinction for completed | EXISTS | Strikethrough + muted colors |
| FR-009: Empty state guidance | EXISTS | Message with guidance |
| FR-013: Loading states | PARTIAL | Add more prominent indicators |
| FR-014: Error messages | EXISTS | Already displays errors |
| FR-020: Mobile responsiveness | EXISTS | Uses Tailwind responsive classes |
| FR-021: Touch targets 44x44px | NEEDS CHECK | Verify button/checkbox sizes |
| SC-003: Toggle reflects in 500ms | NEEDS OPTIMIZE | Add optimistic updates |
| Edge case: API unreachable | PARTIAL | Add retry button |
| Edge case: Long task list | NOT IMPLEMENTED | Add virtualization |

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**:
- Next.js 16+ with App Router
- React 19+
- Better Auth with JWT plugin
- Tailwind CSS 4+

**Project Type**: Single-page web application with server-side rendering
**Testing**: Manual validation (no automated tests specified in scope)

## Constitution Check

*GATE: Must pass before implementation. All items verified against constitution v2.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | Enhancements follow spec.md |
| II. Clean Architecture | PASS | Components separated by concern |
| III. Stateless Backend | PASS | All state from API |
| IV. User Data Isolation | PASS | JWT-based auth |
| V. Readability | PASS | Clear component structure |
| VI. No Hardcoded Secrets | PASS | Environment variables used |

## Project Structure

### Current Structure (Verified)

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts      # Better Auth API routes
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Task dashboard (main page)
│   └── globals.css               # Global styles
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form with validation
│   │   ├── SignupForm.tsx        # Signup form with validation
│   │   └── LogoutButton.tsx      # Logout action button
│   └── providers/
│       └── AuthProvider.tsx      # Auth context provider
├── lib/
│   ├── auth.ts                   # Better Auth server config
│   └── auth-client.ts            # Better Auth client instance
├── services/
│   └── api.ts                    # API client with JWT attachment
├── middleware.ts                 # Route protection
├── .env.local                    # Environment variables
└── .env.example                  # Environment template
```

### Proposed Enhancements

```text
frontend/
├── components/
│   ├── tasks/
│   │   ├── TaskList.tsx          # NEW: Extracted task list component
│   │   ├── TaskItem.tsx          # NEW: Single task display
│   │   ├── TaskForm.tsx          # NEW: Reusable task form (create/edit)
│   │   └── EmptyState.tsx        # NEW: Empty list state
│   └── ui/
│       ├── LoadingSpinner.tsx    # NEW: Reusable loading indicator
│       ├── ErrorMessage.tsx      # NEW: Reusable error display
│       └── ConfirmDialog.tsx     # NEW: Confirmation modal
└── hooks/
    └── useTasks.ts               # NEW: Task data hook with optimistic updates
```

## Architecture Decisions

### 1. Component Extraction

**Decision**: Extract task-related UI into dedicated components

**Rationale**:
- Current `page.tsx` handles too many concerns (294 lines)
- Extraction improves testability and reusability
- Follows single responsibility principle

**Components to Extract**:
- `TaskList` - Renders list of tasks with virtualization support
- `TaskItem` - Single task with view/edit modes
- `TaskForm` - Reusable for create and edit
- `EmptyState` - Displayed when no tasks exist

### 2. Optimistic Updates

**Decision**: Implement optimistic updates for toggle completion

**Rationale**:
- SC-003 requires visual feedback within 500ms
- Network latency can exceed this threshold
- Optimistic updates show immediate feedback

**Implementation**:
```typescript
// Pseudocode for optimistic toggle
const toggleComplete = async (taskId: number) => {
    // 1. Immediately update local state (optimistic)
    setTasks(prev => prev.map(t =>
        t.id === taskId ? {...t, completed: !t.completed} : t
    ));

    try {
        // 2. Sync with backend
        await taskApi.toggleComplete(taskId);
    } catch (error) {
        // 3. Revert on failure
        setTasks(prev => prev.map(t =>
            t.id === taskId ? {...t, completed: !t.completed} : t
        ));
        showError("Failed to update task");
    }
};
```

### 3. Error Handling Strategy

**Decision**: Centralized error handling with user-friendly messages

**Error Types**:
| Error | User Message | Action |
|-------|--------------|--------|
| Network error | "Unable to connect. Check your connection." | Retry button |
| 401 Unauthorized | (Silent redirect to login) | Auto-redirect |
| 404 Not Found | "Task not found. It may have been deleted." | Refresh list |
| 500 Server Error | "Something went wrong. Please try again." | Retry button |
| Validation Error | (Specific field message) | Highlight field |

### 4. Responsive Design Approach

**Decision**: Mobile-first with Tailwind breakpoints

**Breakpoints**:
- `default`: 320px+ (mobile)
- `sm`: 640px+ (large mobile/small tablet)
- `md`: 768px+ (tablet)
- `lg`: 1024px+ (desktop)

**Touch Target Requirements** (FR-021):
- All buttons: `min-h-[44px] min-w-[44px]`
- Checkboxes: `h-6 w-6` (24px, enlarged for easier touch)
- Link areas: Adequate padding for finger tap

## API Integration

### Existing API Client (`services/api.ts`)

The API client is already well-implemented with:
- JWT token attachment via `fetchWithAuth()`
- 401 handling with redirect to login
- Error parsing and display
- Type definitions for Task interfaces

### API Endpoints Consumed

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/tasks` | List all tasks | IMPLEMENTED |
| POST | `/api/tasks` | Create task | IMPLEMENTED |
| PUT | `/api/tasks/{id}` | Update task | IMPLEMENTED |
| DELETE | `/api/tasks/{id}` | Delete task | IMPLEMENTED |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion | IMPLEMENTED |

### JWT Attachment Strategy

Current implementation in `services/api.ts`:

```typescript
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = await getToken();

    if (!token) {
        window.location.href = "/login";
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Session expired");
    }

    return response;
}
```

**Status**: Fully functional, meets FR-011 and FR-012.

## Implementation Strategy

### Phase 1: Validation & Bug Fixes

**Purpose**: Ensure existing implementation meets all spec requirements

1. Verify all acceptance scenarios pass manually
2. Fix any bugs or gaps identified
3. Ensure touch targets meet 44px minimum
4. Test on mobile viewport (320px)

### Phase 2: Component Refactoring

**Purpose**: Improve code organization and maintainability

1. Extract `TaskList` component from `page.tsx`
2. Extract `TaskItem` component with view/edit modes
3. Create reusable `TaskForm` component
4. Create `EmptyState` component
5. Add `LoadingSpinner` component
6. Add `ErrorMessage` component with retry

### Phase 3: UX Enhancements

**Purpose**: Meet success criteria and improve user experience

1. Implement optimistic updates for completion toggle
2. Add loading indicators during API operations
3. Improve error messages with retry options
4. Enhance confirmation dialog for delete
5. Add visual feedback for successful operations

### Phase 4: Performance Optimization

**Purpose**: Handle edge cases and ensure scalability

1. Add task list virtualization for 100+ tasks
2. Implement request debouncing for rapid clicks
3. Add request cancellation for stale requests
4. Test with large task counts

### Phase 5: Final Validation

**Purpose**: Ensure all spec requirements are met

1. Run through all 22 acceptance scenarios
2. Verify all 7 success criteria
3. Test all 5 edge cases
4. Document any remaining issues

## Validation Checklist

Before marking implementation complete:

### Functional Requirements
- [ ] FR-001: Login page with email/password
- [ ] FR-002: Signup page with confirmation
- [ ] FR-003: Task list page for authenticated users
- [ ] FR-004: Task creation capability
- [ ] FR-005: Task editing with pre-populated values
- [ ] FR-006: Task deletion with confirmation
- [ ] FR-007: Display title, status, description
- [ ] FR-008: Visual distinction for completed tasks
- [ ] FR-009: Empty state message
- [ ] FR-010: Synchronized with backend
- [ ] FR-011: JWT in Authorization header
- [ ] FR-012: 401 handling with redirect
- [ ] FR-013: Loading state feedback
- [ ] FR-014: Meaningful error messages
- [ ] FR-015: Login validation
- [ ] FR-016: Signup email/password validation
- [ ] FR-017: Password confirmation match
- [ ] FR-018: Generic auth error messages
- [ ] FR-019: Logout clears session
- [ ] FR-020: Usable on 320px screens
- [ ] FR-021: 44px touch targets
- [ ] FR-022: No horizontal scroll on mobile

### Success Criteria
- [ ] SC-001: Signup/login under 60 seconds
- [ ] SC-002: Create task under 10 seconds
- [ ] SC-003: Toggle reflects within 500ms
- [ ] SC-004: Pages load within 3 seconds
- [ ] SC-005: 95% success rate on first attempt
- [ ] SC-006: Functional on 320px+ devices
- [ ] SC-007: Handles 50+ tasks smoothly

### Edge Cases
- [ ] Backend unreachable: Error with retry
- [ ] Operation fails mid-request: Error + retry
- [ ] Session expires during use: Redirect to login
- [ ] Multi-tab logout: Other tabs detect and redirect
- [ ] 100+ tasks: Performance maintained

## Dependencies

- **Backend API**: Must be running at `NEXT_PUBLIC_API_URL`
- **Better Auth**: Session cookie `better-auth.session_token`
- **JWT Token**: Retrieved from `/api/auth/get-session`

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth token format changes | Low | High | Document expected format, add fallback checks |
| Backend API unavailable during dev | Medium | Medium | Mock API responses for testing |
| Touch target sizing inconsistent | Medium | Low | CSS utility class for consistent sizing |
| Optimistic update race conditions | Low | Medium | Request cancellation, latest-wins strategy |

---

**Plan Status**: Ready for task generation
**Spec Compliance**: Full alignment with spec.md requirements
**Constitution Compliance**: All 6 principles satisfied
