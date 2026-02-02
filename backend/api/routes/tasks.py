"""
Task API route handlers.

Provides REST endpoints for task CRUD operations with JWT authentication
and user isolation. All endpoints require valid JWT token.
"""
from typing import List
from fastapi import APIRouter, Depends, status
from fastapi.responses import Response
from sqlmodel import Session

from schemas.task import TaskCreate, TaskUpdate, TaskResponse
from services.task_service import TaskService
from api.dependencies.database import get_db
from api.dependencies.auth import get_current_user, CurrentUser


router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_task_service(db: Session = Depends(get_db)) -> TaskService:
    """
    Dependency for injecting task service into route handlers.

    Args:
        db: Database session from dependency injection

    Returns:
        TaskService: Configured task service instance
    """
    return TaskService(db)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Create a new task for the authenticated user."
)
def create_task(
    task_data: TaskCreate,
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """
    Create a new task for the authenticated user.

    Args:
        task_data: Task creation data from request body
        current_user: Authenticated user from JWT token
        service: Task service instance

    Returns:
        TaskResponse: Created task with generated ID and timestamps

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 422 if validation fails
    """
    return service.create_task(current_user.id, task_data)


@router.get(
    "",
    response_model=List[TaskResponse],
    status_code=status.HTTP_200_OK,
    summary="List all tasks",
    description="Retrieve all tasks for the authenticated user."
)
def list_tasks(
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> List[TaskResponse]:
    """
    List all tasks for the authenticated user.

    Args:
        current_user: Authenticated user from JWT token
        service: Task service instance

    Returns:
        List[TaskResponse]: List of tasks (empty if no tasks exist)

    Raises:
        HTTPException: 401 if not authenticated
    """
    return service.get_tasks(current_user.id)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single task",
    description="Retrieve a specific task by ID for the authenticated user."
)
def get_task(
    task_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """
    Get a single task by ID.

    Args:
        task_id: Task identifier from path
        current_user: Authenticated user from JWT token
        service: Task service instance

    Returns:
        TaskResponse: Task details

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 404 if task not found or belongs to different user
    """
    return service.get_task(current_user.id, task_id)


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a task",
    description="Update an existing task. All fields in request body are optional."
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """
    Update an existing task.

    Only provided fields will be updated. Omitted fields remain unchanged.

    Args:
        task_id: Task identifier from path
        task_data: Task update data from request body
        current_user: Authenticated user from JWT token
        service: Task service instance

    Returns:
        TaskResponse: Updated task with refreshed updated_at timestamp

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 404 if task not found or belongs to different user
        HTTPException: 422 if validation fails
    """
    return service.update_task(current_user.id, task_id, task_data)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    description="Delete a task permanently."
)
def delete_task(
    task_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> Response:
    """
    Delete a task permanently.

    Args:
        task_id: Task identifier from path
        current_user: Authenticated user from JWT token
        service: Task service instance

    Returns:
        Response: Empty response with 204 status code

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 404 if task not found or belongs to different user
    """
    service.delete_task(current_user.id, task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Toggle task completion",
    description="Toggle the completion status of a task (complete <-> incomplete)."
)
def toggle_complete(
    task_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """
    Toggle task completion status.

    Flips the completed boolean: false -> true or true -> false.

    Args:
        task_id: Task identifier from path
        current_user: Authenticated user from JWT token
        service: Task service instance

    Returns:
        TaskResponse: Updated task with toggled completion status

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 404 if task not found or belongs to different user
    """
    return service.toggle_complete(current_user.id, task_id)
