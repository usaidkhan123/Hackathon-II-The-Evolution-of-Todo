"""
FastAPI application entry point.

Initializes the FastAPI app and configures startup/shutdown handlers.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
from jose import JWTError
from db.init_db import init_db
from core.config import settings
from api.routes import tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.

    Runs database initialization on startup.

    Args:
        app: FastAPI application instance
    """
    # Startup: Initialize database tables
    init_db()
    yield
    # Shutdown: cleanup if needed


# Create FastAPI application
app = FastAPI(
    title="Task Management API",
    description="REST API for task CRUD operations with user isolation",
    version="1.0.0",
    lifespan=lifespan
)


# CORS middleware configuration for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Register routers
app.include_router(tasks.router, prefix="/api")


# Exception handler for database connection errors
@app.exception_handler(OperationalError)
async def database_exception_handler(request: Request, exc: OperationalError):
    """
    Handle database connection errors.

    Returns 503 Service Unavailable when database cannot be reached.

    Args:
        request: Incoming request
        exc: Database operational error

    Returns:
        JSONResponse: 503 error response
    """
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Service temporarily unavailable"}
    )


# Exception handler for JWT authentication errors
@app.exception_handler(JWTError)
async def jwt_exception_handler(request: Request, exc: JWTError):
    """
    Handle JWT authentication errors.

    Returns 401 Unauthorized when JWT token is invalid.

    Args:
        request: Incoming request
        exc: JWT error (invalid signature, expired token, etc.)

    Returns:
        JSONResponse: 401 error response
    """
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Invalid authentication credentials"},
        headers={"WWW-Authenticate": "Bearer"}
    )


@app.get("/", tags=["health"])
def root():
    """
    Root endpoint for health check.

    Returns:
        dict: API status and version
    """
    return {
        "status": "ok",
        "message": "Task Management API",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
