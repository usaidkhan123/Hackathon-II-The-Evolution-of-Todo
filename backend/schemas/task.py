"""
Task Pydantic schemas for request/response validation.

Defines data transfer objects for task-related API operations.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    """
    Schema for creating a new task.

    Attributes:
        title: Task title (1-200 characters, required)
        description: Optional task description (max 1000 characters)
    """
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.

    All fields are optional - only provided fields will be updated.

    Attributes:
        title: Task title (1-200 characters)
        description: Task description (max 1000 characters)
        completed: Completion status
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """
    Schema for task responses.

    This is the format returned by all task-related endpoints.

    Attributes:
        id: Unique task identifier
        user_id: Owner identifier
        title: Task title
        description: Task description (may be null)
        completed: Completion status
        created_at: Creation timestamp
        updated_at: Last modification timestamp
    """
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
