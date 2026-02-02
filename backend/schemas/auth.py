"""
Authentication-related Pydantic schemas.

Defines data models for JWT token payloads and user authentication.
"""
from pydantic import BaseModel, Field


class TokenPayload(BaseModel):
    """
    JWT token payload schema.

    This schema validates the structure of JWT tokens issued by Better Auth.
    Better Auth tokens contain user identity claims that we verify and extract.

    Attributes:
        sub: Subject claim - contains user ID
        email: User's email address (optional)
        exp: Expiration timestamp in seconds since epoch
    """

    sub: str = Field(..., description="User ID from JWT subject claim")
    email: str = Field(default="", description="User email address")
    exp: int = Field(..., description="Token expiration timestamp")

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "sub": "user_123456789",
                "email": "user@example.com",
                "exp": 1735689600
            }
        }
