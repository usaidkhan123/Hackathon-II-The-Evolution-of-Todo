# ADR 001: Task Storage and Architecture Decisions for To-Do Console Application

## Status
Accepted

## Date
2026-01-26

## Context
We needed to implement an in-memory To-Do Console Application that satisfies all Phase 1 requirements. Several key architectural decisions had to be made regarding data storage, application structure, and user interaction patterns.

## Decision

### 1. Task ID Generation Strategy
We chose auto-incrementing integers starting from 1 for task identification.

**Options Considered:**
- Auto-incrementing integer (start at 1, increment by 1)
- UUID generation
- Timestamp-based ID

**Decision:** Auto-incrementing integer
**Rationale:** Simplest approach that meets spec requirements (FR-003), maintains order (FR-006), and is easy to manage in memory.

### 2. In-Memory Storage Structure
We chose a dictionary with ID as key for O(1) lookup performance.

**Options Considered:**
- List of Task objects with sequential search
- Dictionary with ID as key for O(1) lookup
- Separate ID counter and storage container

**Decision:** Dictionary with ID as key
**Rationale:** Provides O(1) lookup performance for operations by ID, which is required for update/delete/toggle operations.

### 3. Application Architecture
We separated the application into four distinct modules with clear responsibilities:
- models.py: Task data structure and in-memory storage
- core.py: Business logic for task operations
- cli.py: Console interface and user interaction
- main.py: Application entry point

**Decision:** Four-module separation with clear responsibilities
**Rationale:** Maintains clear separation of concerns as required by constitution, making the code more maintainable and testable.

### 4. User Interface Approach
We chose a menu-driven interface with numerical options rather than a command-based approach.

**Options Considered:**
- Menu-driven: Numerical options (1. Add Task, 2. View Tasks, etc.)
- Command-based: Text commands (add, view, update, delete)

**Decision:** Menu-driven interface
**Rationale:** Simpler for users, matches assumption AS-005 from spec, easier to implement validation.

## Consequences

### Positive
- Efficient O(1) lookups for task operations by ID
- Clear separation of concerns making code easier to understand and maintain
- Simple, intuitive menu interface for users
- Auto-incrementing IDs maintain insertion order naturally
- Consistent with the project's constitution principles

### Negative
- Memory usage grows linearly with the number of tasks (but this is expected for in-memory storage)
- Menu interface is slightly more verbose than command-based for power users (though simpler for new users)

## Alternatives Considered
All alternative approaches were evaluated and documented in the decision rationale above.

## Links
- Related to: Feature Specification 1-todo-console
- Implementation: src/todo_app/ modules