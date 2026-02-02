"""
Database initialization script.

Creates all tables defined in SQLModel models.
"""
from sqlmodel import SQLModel
from db.connection import engine
from models.task import Task  # Import to register model


def init_db():
    """
    Initialize database by creating all tables.

    This function creates all tables defined in SQLModel models.
    For production, use Alembic migrations instead.

    Note: SQLModel.metadata.create_all() is idempotent - it only creates
    tables that don't already exist.
    """
    SQLModel.metadata.create_all(engine)
