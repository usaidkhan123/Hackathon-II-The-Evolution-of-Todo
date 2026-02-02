"""
Database connection management.

Provides database engine and session factory for SQLModel.
"""
from sqlmodel import create_engine, Session
from core.config import settings


# Create database engine with connection pooling
# pool_pre_ping ensures connections are valid before use (important for serverless)
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=settings.DEBUG
)


def get_session():
    """
    Database session generator for dependency injection.

    Yields a SQLModel session that is automatically closed after use.

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session
