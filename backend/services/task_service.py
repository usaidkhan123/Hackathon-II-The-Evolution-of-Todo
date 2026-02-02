"""
Task service layer for business logic.

Orchestrates task operations and applies business rules.
"""
from typing import List
from datetime import datetime
from fastapi import HTTPException, status
from sqlmodel import Session

from models.task import Task
from schemas.task import TaskCreate, TaskUpdate, TaskResponse
from repositories.task_repository import TaskRepository


class TaskService:
    """
    Service layer for task business logic.

    Handles validation, authorization, and orchestration of task operations.

    Attributes:
        repository: Task repository for data access
    """

    def __init__(self, session: Session):
        """
        Initialize service with database session.

        Args:
            session: SQLModel database session
        """
        self.repository = TaskRepository(session)

    def create_task(self, user_id: str, task_data: TaskCreate) -> TaskResponse:
        """
        Create a new task for a user.

        Args:
            user_id: Owner identifier
            task_data: Task creation data

        Returns:
            Created task as TaskResponse

        Raises:
            HTTPException: 422 if validation fails
        """
        task = Task(
            user_id=user_id,
            title=task_data.title,
            description=task_data.description,
            completed=False
        )

        created_task = self.repository.create(task)
        return TaskResponse.model_validate(created_task)

    def get_tasks(self, user_id: str) -> List[TaskResponse]:
        """
        Retrieve all tasks for a user.

        Args:
            user_id: Owner identifier

        Returns:
            List of tasks as TaskResponse objects
        """
        tasks = self.repository.get_all(user_id)
        return [TaskResponse.model_validate(task) for task in tasks]

    def get_task(self, user_id: str, task_id: int) -> TaskResponse:
        """
        Retrieve a single task by ID.

        Args:
            user_id: Owner identifier
            task_id: Task identifier

        Returns:
            Task as TaskResponse

        Raises:
            HTTPException: 404 if task not found or not owned by user
        """
        task = self.repository.get_by_id(user_id, task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return TaskResponse.model_validate(task)

    def update_task(
        self,
        user_id: str,
        task_id: int,
        task_data: TaskUpdate
    ) -> TaskResponse:
        """
        Update an existing task.

        Args:
            user_id: Owner identifier
            task_id: Task identifier
            task_data: Task update data

        Returns:
            Updated task as TaskResponse

        Raises:
            HTTPException: 404 if task not found or not owned by user
            HTTPException: 422 if validation fails
        """
        task = self.repository.get_by_id(user_id, task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update only provided fields
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # Always update timestamp
        task.updated_at = datetime.utcnow()

        updated_task = self.repository.update(task)
        return TaskResponse.model_validate(updated_task)

    def delete_task(self, user_id: str, task_id: int) -> None:
        """
        Delete a task.

        Args:
            user_id: Owner identifier
            task_id: Task identifier

        Raises:
            HTTPException: 404 if task not found or not owned by user
        """
        deleted = self.repository.delete(user_id, task_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

    def toggle_complete(self, user_id: str, task_id: int) -> TaskResponse:
        """
        Toggle task completion status.

        Args:
            user_id: Owner identifier
            task_id: Task identifier

        Returns:
            Updated task as TaskResponse

        Raises:
            HTTPException: 404 if task not found or not owned by user
        """
        task = self.repository.get_by_id(user_id, task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Toggle completed status
        task.completed = not task.completed

        # Always update timestamp
        task.updated_at = datetime.utcnow()

        updated_task = self.repository.update(task)
        return TaskResponse.model_validate(updated_task)
