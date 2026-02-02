<<<<<<< HEAD
# In-Memory To-Do Console Application

A simple, menu-driven to-do list application that runs in the console with in-memory storage.

## Features

- Add tasks with titles and optional descriptions
- View all tasks with their completion status
- Update existing tasks
- Delete tasks
- Toggle task completion status
- All data stored in memory (no persistence between sessions)

## Requirements

- Python 3.13+

## Installation

No installation required - this is a pure Python application using only standard library modules.

## Usage

Run the application using Python from the project root directory:

```bash
python -m src.todo_app.main
```

Alternatively, you can run it directly (the application now supports both methods):

```bash
python src/todo_app/main.py
```

## Functionality

Once the application starts, you'll see a menu with the following options:

1. **Add a new task** - Create a new to-do item with a required title and optional description
2. **View all tasks** - See all tasks with their ID, status, title, and description
3. **Update a task** - Modify an existing task's title or description
4. **Delete a task** - Remove a task from your list
5. **Toggle task completion status** - Mark a task as complete or incomplete
6. **Exit** - Quit the application

## Design

The application follows a modular architecture:

- `models.py`: Defines the Task data class and in-memory storage mechanism
- `core.py`: Implements all business logic for task operations
- `cli.py`: Handles user interface and console interactions
- `main.py`: Entry point for the application

## Specification Compliance

This application implements all requirements from the feature specification:
- FR-001 to FR-012: All functional requirements met
- Proper validation and error handling
- Unique incremental integer IDs
- In-memory storage with no persistence
- Clear console interface
=======
# Hackathon-II-The-Evolution-of-Todo
🚀 Evolution of Todo: From console app to cloud-native AI chatbot - A 5-phase journey mastering spec-driven development, Kubernetes, and AI agents with Claude Code
>>>>>>> 3465afb703c66b5f25c6b324792db50adc8f462d
