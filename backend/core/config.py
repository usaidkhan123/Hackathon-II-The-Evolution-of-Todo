"""
Application configuration and settings.

Loads environment variables and provides application-wide configuration.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        DATABASE_URL: PostgreSQL connection string for Neon database
        BETTER_AUTH_SECRET: Secret key for JWT token verification
        BETTER_AUTH_URL: URL of the Better Auth server for JWKS verification
        HOST: Server host address (default: 0.0.0.0)
        PORT: Server port number (default: 8000)
        DEBUG: Debug mode flag (default: False)
    """
    DATABASE_URL: str
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str = "http://localhost:3000"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
