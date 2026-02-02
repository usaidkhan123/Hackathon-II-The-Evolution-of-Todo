"""
Task database model.

Defines the SQLModel ORM model for tasks table.
"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Task(SQLModel, table=True):
    """
    Task entity representing a todo item belonging to a specific user.

    Attributes:
        id: Auto-generated primary key
        user_id: Owner identifier (indexed for query performance)
        title: Task title (1-200 characters, required)
        description: Optional task description (max 1000 characters)
        completed: Completion status (default: False)
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last modified
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
