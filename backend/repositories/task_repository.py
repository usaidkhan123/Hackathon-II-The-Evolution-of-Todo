"""
Task repository for data access operations.

Handles all database interactions for task entities.
CRITICAL: All methods MUST filter by user_id to enforce data isolation.
"""
from typing import List, Optional
from sqlmodel import Session, select
from models.task import Task


class TaskRepository:
    """
    Repository for task data access operations.

    All methods enforce user isolation by requiring user_id parameter.

    Attributes:
        session: SQLModel database session
    """

    def __init__(self, session: Session):
        """
        Initialize repository with database session.

        Args:
            session: SQLModel database session
        """
        self.session = session

    def create(self, task: Task) -> Task:
        """
        Create a new task in the database.

        Args:
            task: Task entity to create

        Returns:
            Created task with generated id
        """
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_by_id(self, user_id: str, task_id: int) -> Optional[Task]:
        """
        Retrieve a single task by ID for a specific user.

        CRITICAL: Always filters by user_id to prevent cross-user access.

        Args:
            user_id: Owner identifier
            task_id: Task identifier

        Returns:
            Task if found and owned by user, None otherwise
        """
        statement = select(Task).where(
            Task.user_id == user_id,
            Task.id == task_id
        )
        return self.session.exec(statement).first()

    def get_all(self, user_id: str) -> List[Task]:
        """
        Retrieve all tasks for a specific user.

        CRITICAL: Always filters by user_id to prevent cross-user access.

        Args:
            user_id: Owner identifier

        Returns:
            List of tasks owned by the user
        """
        statement = select(Task).where(Task.user_id == user_id)
        return list(self.session.exec(statement).all())

    def update(self, task: Task) -> Task:
        """
        Update an existing task in the database.

        Note: The task object should already be retrieved using get_by_id
        to ensure user ownership validation.

        Args:
            task: Task entity to update

        Returns:
            Updated task
        """
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete(self, user_id: str, task_id: int) -> bool:
        """
        Delete a task by ID for a specific user.

        CRITICAL: Always filters by user_id to prevent cross-user deletion.

        Args:
            user_id: Owner identifier
            task_id: Task identifier

        Returns:
            True if task was deleted, False if not found
        """
        task = self.get_by_id(user_id, task_id)
        if task is None:
            return False

        self.session.delete(task)
        self.session.commit()
        return True
