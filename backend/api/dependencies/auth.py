"""
Authentication dependencies for FastAPI routes.

Provides dependency injection for JWT token verification and user authentication.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import verify_token, TokenPayload


# HTTP Bearer token security scheme
# This extracts the token from the Authorization header: "Bearer <token>"
security = HTTPBearer()


class CurrentUser:
    """
    Represents the currently authenticated user.

    This class encapsulates user identity information extracted from
    a verified JWT token. Used throughout the application to identify
    the user making the request.

    Attributes:
        id: Unique user identifier
        email: User's email address
    """

    def __init__(self, id: str, email: str = ""):
        """
        Initialize CurrentUser.

        Args:
            id: User's unique identifier
            email: User's email address (optional)
        """
        self.id = id
        self.email = email

    def __repr__(self) -> str:
        """String representation for debugging."""
        return f"CurrentUser(id={self.id}, email={self.email})"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> CurrentUser:
    """
    FastAPI dependency to extract and verify the current user from JWT token.

    This dependency:
    1. Extracts the JWT token from the Authorization header
    2. Verifies the token signature and expiration
    3. Returns a CurrentUser object with verified user identity

    Usage in route handlers:
        @router.get("/tasks")
        async def get_tasks(current_user: CurrentUser = Depends(get_current_user)):
            user_id = current_user.id
            # ... use user_id to filter data

    Args:
        credentials: HTTP Bearer credentials extracted by FastAPI

    Returns:
        CurrentUser: Authenticated user object with id and email

    Raises:
        HTTPException: 401 Unauthorized if token is missing, invalid, or expired
    """
    # Extract token from Authorization header
    token = credentials.credentials

    # Verify token and extract payload
    # This raises HTTPException 401 if verification fails
    payload: TokenPayload = verify_token(token)

    # Create and return CurrentUser object
    return CurrentUser(id=payload.user_id, email=payload.email)
