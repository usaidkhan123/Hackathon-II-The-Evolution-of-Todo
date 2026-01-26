"""
Models for the To-Do Console Application
Defines the Task data structure and in-memory storage
"""

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class Task:
    """
    Represents a single to-do task with required attributes

    Attributes:
        id (int): Unique identifier assigned by system
        title (str): Required non-empty task title
        description (str): Optional task description
        completed (bool): Completion status (default: False)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False


class InMemoryStorage:
    """
    Manages in-memory storage for tasks using a dictionary with ID as key
    Provides O(1) lookup performance for operations by ID
    """

    def __init__(self):
        """Initialize the in-memory storage with an empty task dictionary and ID counter"""
        self._tasks: Dict[int, Task] = {}
        self._next_id: int = 1

    def add_task(self, task: Task) -> None:
        """Add a task to the storage"""
        self._tasks[task.id] = task
        # Update next_id if the added task has a higher ID
        if task.id >= self._next_id:
            self._next_id = task.id + 1

    def get_task(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by ID, returns None if not found"""
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """Retrieve all tasks in the order they were added (by ID)"""
        # Sort tasks by ID to maintain order they were added
        return sorted(self._tasks.values(), key=lambda x: x.id)

    def update_task(self, task_id: int, updated_task: Task) -> bool:
        """Update an existing task by ID, returns True if successful"""
        if task_id in self._tasks:
            self._tasks[task_id] = updated_task
            return True
        return False

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID, returns True if successful"""
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def get_next_id(self) -> int:
        """Get the next available ID for a new task"""
        return self._next_id

    def increment_next_id(self) -> int:
        """Increment the next ID counter and return the new value"""
        current_id = self._next_id
        self._next_id += 1
        return current_id