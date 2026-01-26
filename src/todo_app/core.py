"""
Core business logic for the To-Do Console Application
Implements all task operations (add, view, update, delete, toggle)
"""

from typing import List, Optional
from .models import Task, InMemoryStorage


class TaskManager:
    """
    Manages all task operations according to the specification
    Provides methods for all required CRUD operations with validation
    """

    def __init__(self):
        """Initialize the task manager with in-memory storage"""
        self.storage = InMemoryStorage()

    def add_task(self, title: str, description: str = "") -> Optional[Task]:
        """
        Add a new task with required non-empty title

        Args:
            title (str): Required non-empty task title
            description (str): Optional task description

        Returns:
            Task: The created task if successful, None if validation fails
        """
        # Validate title is not empty (after stripping whitespace)
        if not title or not title.strip():
            return None

        # Validate title length (max 255 characters as per spec assumptions)
        if len(title) > 255:
            return None

        # Validate description length (max 1000 characters as per spec assumptions)
        if len(description) > 1000:
            return None

        # Create a new task with the next available ID
        task_id = self.storage.increment_next_id()
        task = Task(id=task_id, title=title.strip(), description=description.strip(), completed=False)

        # Add the task to storage
        self.storage.add_task(task)
        return task

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Retrieve a task by its ID

        Args:
            task_id (int): The ID of the task to retrieve

        Returns:
            Task: The task if found, None otherwise
        """
        return self.storage.get_task(task_id)

    def get_all_tasks(self) -> List[Task]:
        """
        Retrieve all tasks in the order they were added

        Returns:
            List[Task]: List of all tasks
        """
        return self.storage.get_all_tasks()

    def update_task(self, task_id: int, title: Optional[str] = None,
                   description: Optional[str] = None, completed: Optional[bool] = None) -> bool:
        """
        Update an existing task's properties

        Args:
            task_id (int): The ID of the task to update
            title (str, optional): New title if provided
            description (str, optional): New description if provided
            completed (bool, optional): New completion status if provided

        Returns:
            bool: True if update was successful, False if task not found
        """
        existing_task = self.storage.get_task(task_id)
        if not existing_task:
            return False

        # Prepare updated values, keeping existing values if not provided
        updated_title = title.strip() if title is not None else existing_task.title
        updated_description = description.strip() if description is not None else existing_task.description
        updated_completed = completed if completed is not None else existing_task.completed

        # Validate title if it's being updated
        if title is not None:
            if not updated_title:
                return False  # Title cannot be empty
            if len(updated_title) > 255:
                return False  # Title too long

        # Validate description if it's being updated
        if description is not None and len(updated_description) > 1000:
            return False  # Description too long

        # Create updated task
        updated_task = Task(
            id=existing_task.id,
            title=updated_title,
            description=updated_description,
            completed=updated_completed
        )

        # Update in storage
        return self.storage.update_task(task_id, updated_task)

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID

        Args:
            task_id (int): The ID of the task to delete

        Returns:
            bool: True if deletion was successful, False if task not found
        """
        return self.storage.delete_task(task_id)

    def toggle_task_completion(self, task_id: int) -> bool:
        """
        Toggle the completion status of a task

        Args:
            task_id (int): The ID of the task to toggle

        Returns:
            bool: True if toggle was successful, False if task not found
        """
        existing_task = self.storage.get_task(task_id)
        if not existing_task:
            return False

        # Create updated task with toggled completion status
        updated_task = Task(
            id=existing_task.id,
            title=existing_task.title,
            description=existing_task.description,
            completed=not existing_task.completed
        )

        # Update in storage
        return self.storage.update_task(task_id, updated_task)