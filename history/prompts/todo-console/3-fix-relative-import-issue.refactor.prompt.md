---
id: 3
title: fix-relative-import-issue
stage: refactor
date_iso: 2026-01-26
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-console
branch: master
user: User
command: this error is occuring hwne i am running the main.py file C:\Users\User\Desktop\h> python src/todo_app/main.py
Traceback (most recent call last):
  File "C:\Users\User\Desktop\h\src\todo_app\main.py", line 6, in <module>
    from .cli import ConsoleInterface
ImportError: attempted relative import with no known parent package
labels: ["bugfix", "import", "python", "todo"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - src/todo_app/main.py
  - README.md
tests_yaml:
  - src/todo_app/main.py
---

# Fix Relative Import Issue

## PROMPT_TEXT
this error is occuring hwne i am running the main.py file C:\Users\User\Desktop\h> python src/todo_app/main.py
Traceback (most recent call last):
  File "C:\Users\User\Desktop\h\src\todo_app\main.py", line 6, in <module>
    from .cli import ConsoleInterface
ImportError: attempted relative import with no known parent package

## RESPONSE_TEXT
Fixed the relative import issue in main.py by implementing a dual import strategy that handles both direct execution (python src/todo_app/main.py) and module execution (python -m src.todo_app.main). The solution uses a try/except block to attempt relative import first, falling back to absolute import with sys.path manipulation when run directly. Updated the README to clarify both execution methods are now supported.

## OUTCOME
The application now works correctly with both execution methods:
- python -m src.todo_app.main (module execution)
- python src/todo_app/main.py (direct execution)

## EVALUATION
The import error has been resolved and both execution methods have been tested successfully.