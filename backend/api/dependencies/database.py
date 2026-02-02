"""
API dependencies for database access.

Provides dependency injection functions for FastAPI routes.
"""
from typing import Generator
from sqlmodel import Session
from db.connection import get_session


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for injecting database sessions into route handlers.

    This is a wrapper around get_session for use with FastAPI's Depends().

    Yields:
        Session: SQLModel database session

    Example:
        @app.get("/tasks")
        def get_tasks(db: Session = Depends(get_db)):
            # Use db session here
            pass
    """
    yield from get_session()
