# Feature Specification: Backend API & Database Layer

**Feature Branch**: `1-backend-api-database`
**Created**: 2026-01-29
**Status**: Draft
**Input**: Phase II Backend + Database specification for Todo Full-Stack Web Application

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Task (Priority: P1)

As an API consumer, I can create a new task for a specific user so that the task is persisted in the database and associated with that user.

**Why this priority**: Task creation is the foundational operation. Without the ability to create tasks, no other CRUD operations are meaningful.

**Independent Test**: Can be fully tested by sending a POST request with valid task data and verifying the task appears in the database with correct user association.

**Acceptance Scenarios**:

1. **Given** a valid user_id and task data with title "Buy groceries", **When** POST /api/{user_id}/tasks is called, **Then** the task is created with status 201, assigned an auto-generated ID, and returned with all fields including timestamps.

2. **Given** a valid user_id and task data with title, description, and all optional fields, **When** POST /api/{user_id}/tasks is called, **Then** the task is created with all provided values and completed defaults to false.

3. **Given** task data with a title exceeding 200 characters, **When** POST /api/{user_id}/tasks is called, **Then** the request is rejected with status 422 and a validation error message.

4. **Given** task data missing the required title field, **When** POST /api/{user_id}/tasks is called, **Then** the request is rejected with status 422 and a validation error message.

---

### User Story 2 - View All Tasks (Priority: P1)

As an API consumer, I can retrieve all tasks for a specific user so that the user can see their complete task list.

**Why this priority**: Viewing tasks is essential for users to interact with their data. Equal priority with creation as both are needed for minimum viable functionality.

**Independent Test**: Can be fully tested by creating tasks for a user, then calling GET to verify all tasks are returned with correct data.

**Acceptance Scenarios**:

1. **Given** user_id "user123" has 3 tasks in the database, **When** GET /api/user123/tasks is called, **Then** all 3 tasks are returned with status 200.

2. **Given** user_id "user456" has 0 tasks, **When** GET /api/user456/tasks is called, **Then** an empty array is returned with status 200.

3. **Given** user_id "user123" has tasks and user_id "user456" has different tasks, **When** GET /api/user123/tasks is called, **Then** only tasks belonging to user123 are returned (no cross-user data).

---

### User Story 3 - View Single Task (Priority: P2)

As an API consumer, I can retrieve a specific task by ID for a user so that detailed task information can be displayed.

**Why this priority**: Single task retrieval is useful for detail views but the list view can serve basic needs.

**Independent Test**: Can be fully tested by creating a task, then retrieving it by ID and verifying all fields match.

**Acceptance Scenarios**:

1. **Given** user_id "user123" has task with id 1, **When** GET /api/user123/tasks/1 is called, **Then** the task is returned with status 200 and all fields.

2. **Given** user_id "user123" has no task with id 999, **When** GET /api/user123/tasks/999 is called, **Then** status 404 is returned with error message "Task not found".

3. **Given** task id 1 belongs to user_id "user456", **When** GET /api/user123/tasks/1 is called, **Then** status 404 is returned (task not accessible to different user).

---

### User Story 4 - Update Task (Priority: P2)

As an API consumer, I can update an existing task's details so that users can modify their task information.

**Why this priority**: Updating tasks is important for task management but users can work with create/delete initially.

**Independent Test**: Can be fully tested by creating a task, updating it, then retrieving it to verify changes persisted.

**Acceptance Scenarios**:

1. **Given** user_id "user123" has task id 1 with title "Old title", **When** PUT /api/user123/tasks/1 with title "New title" is called, **Then** task is updated, updated_at is refreshed, and updated task is returned with status 200.

2. **Given** user_id "user123" has no task with id 999, **When** PUT /api/user123/tasks/999 is called, **Then** status 404 is returned.

3. **Given** task id 1 belongs to user_id "user456", **When** PUT /api/user123/tasks/1 is called, **Then** status 404 is returned (cannot update another user's task).

4. **Given** update data with title exceeding 200 characters, **When** PUT /api/user123/tasks/1 is called, **Then** status 422 is returned with validation error.

---

### User Story 5 - Delete Task (Priority: P2)

As an API consumer, I can delete a task so that users can remove tasks they no longer need.

**Why this priority**: Deletion is important for task management but not critical for initial functionality.

**Independent Test**: Can be fully tested by creating a task, deleting it, then verifying it no longer exists.

**Acceptance Scenarios**:

1. **Given** user_id "user123" has task id 1, **When** DELETE /api/user123/tasks/1 is called, **Then** task is permanently removed and status 204 is returned.

2. **Given** user_id "user123" has no task id 999, **When** DELETE /api/user123/tasks/999 is called, **Then** status 404 is returned.

3. **Given** task id 1 belongs to user_id "user456", **When** DELETE /api/user123/tasks/1 is called, **Then** status 404 is returned (cannot delete another user's task).

---

### User Story 6 - Toggle Task Completion (Priority: P3)

As an API consumer, I can toggle a task's completion status so that users can mark tasks as done or reopen them.

**Why this priority**: Completion toggling enhances usability but users can use update endpoint as a workaround.

**Independent Test**: Can be fully tested by creating an incomplete task, toggling it complete, then toggling it incomplete again.

**Acceptance Scenarios**:

1. **Given** user_id "user123" has task id 1 with completed=false, **When** PATCH /api/user123/tasks/1/complete is called, **Then** completed becomes true, updated_at is refreshed, and task is returned with status 200.

2. **Given** user_id "user123" has task id 1 with completed=true, **When** PATCH /api/user123/tasks/1/complete is called, **Then** completed becomes false, updated_at is refreshed, and task is returned with status 200.

3. **Given** user_id "user123" has no task id 999, **When** PATCH /api/user123/tasks/999/complete is called, **Then** status 404 is returned.

---

### Edge Cases

- What happens when title is exactly 200 characters? System MUST accept it as valid.
- What happens when description is exactly 1000 characters? System MUST accept it as valid.
- What happens when title is 1 character? System MUST accept it as valid (minimum 1 char).
- What happens when description is empty string? System MUST accept it (optional field).
- What happens when user_id contains special characters? System MUST handle URL-encoded user_ids.
- How does system handle concurrent updates to the same task? Last write wins (standard behavior).
- What happens when database connection fails? System MUST return 503 Service Unavailable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide REST API endpoints under `/api/` prefix for all task operations.
- **FR-002**: System MUST persist all task data to Neon Serverless PostgreSQL database.
- **FR-003**: System MUST associate every task with exactly one user_id.
- **FR-004**: System MUST filter all database queries by user_id to enforce data isolation.
- **FR-005**: System MUST validate task title is between 1 and 200 characters.
- **FR-006**: System MUST validate task description does not exceed 1000 characters when provided.
- **FR-007**: System MUST auto-generate task ID as an integer primary key.
- **FR-008**: System MUST set completed to false by default when creating tasks.
- **FR-009**: System MUST automatically set created_at timestamp when task is created.
- **FR-010**: System MUST automatically update updated_at timestamp on any task modification.
- **FR-011**: System MUST return appropriate HTTP status codes (200, 201, 204, 404, 422, 503).
- **FR-012**: System MUST return JSON responses for all endpoints.
- **FR-013**: System MUST return 404 when task does not exist OR does not belong to the specified user.
- **FR-014**: System MUST remain stateless (no session storage, no request-to-request state).
- **FR-015**: System MUST read database connection from DATABASE_URL environment variable.

### Data Requirements

- **DR-001**: Task title MUST be stored as string, 1-200 characters, required.
- **DR-002**: Task description MUST be stored as text, max 1000 characters, optional.
- **DR-003**: Task completed MUST be stored as boolean, default false.
- **DR-004**: Task user_id MUST be stored as string, required, indexed for query performance.
- **DR-005**: Task created_at MUST be stored as timestamp with timezone.
- **DR-006**: Task updated_at MUST be stored as timestamp with timezone.
- **DR-007**: Task id MUST be auto-incrementing integer primary key.

### Key Entities

- **Task**: Represents a todo item belonging to a user. Contains title (required), description (optional), completion status, ownership via user_id, and audit timestamps. Each task is uniquely identified by its integer ID and strictly scoped to one user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 API endpoints respond successfully within 500ms under normal load.
- **SC-002**: Task creation, retrieval, update, and deletion operations complete with correct data 100% of the time.
- **SC-003**: No user can access, view, or modify another user's tasks (100% isolation).
- **SC-004**: System handles 100 concurrent requests without errors or data corruption.
- **SC-005**: All validation errors return clear, actionable error messages.
- **SC-006**: Database schema supports the defined task structure with proper constraints.
- **SC-007**: API responses follow consistent JSON structure across all endpoints.

## Assumptions

- User IDs are provided in the URL path and are assumed to be valid identifiers (authentication/authorization will be handled by a separate spec).
- The database will be pre-provisioned with the correct schema before the API starts.
- Environment variable DATABASE_URL will be available at runtime.
- Standard web application performance expectations apply (sub-second response times).
- Error responses will include a `detail` field explaining the error.

## Out of Scope

- User authentication and JWT verification (separate spec)
- User registration and management
- Frontend implementation
- Task categories, tags, or labels
- Task due dates and reminders
- Task sharing between users
- Bulk operations (batch create/update/delete)
- Task search and filtering beyond user_id
- Pagination for task lists
- Rate limiting

## API Contract Summary

| Method | Endpoint                           | Description               | Success | Error     |
| ------ | ---------------------------------- | ------------------------- | ------- | --------- |
| POST   | /api/{user_id}/tasks               | Create new task           | 201     | 422       |
| GET    | /api/{user_id}/tasks               | List all user's tasks     | 200     | -         |
| GET    | /api/{user_id}/tasks/{id}          | Get single task           | 200     | 404       |
| PUT    | /api/{user_id}/tasks/{id}          | Update task               | 200     | 404, 422  |
| DELETE | /api/{user_id}/tasks/{id}          | Delete task               | 204     | 404       |
| PATCH  | /api/{user_id}/tasks/{id}/complete | Toggle completion status  | 200     | 404       |

## Database Schema Summary

**Table: tasks**

| Column      | Type         | Constraints                    |
| ----------- | ------------ | ------------------------------ |
| id          | INTEGER      | PRIMARY KEY, AUTO INCREMENT    |
| user_id     | VARCHAR      | NOT NULL, INDEX                |
| title       | VARCHAR(200) | NOT NULL                       |
| description | TEXT         | NULLABLE, MAX 1000 chars       |
| completed   | BOOLEAN      | NOT NULL, DEFAULT false        |
| created_at  | TIMESTAMP    | NOT NULL, DEFAULT CURRENT      |
| updated_at  | TIMESTAMP    | NOT NULL, AUTO UPDATE          |
