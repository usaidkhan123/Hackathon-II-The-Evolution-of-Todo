"""
JWT token verification utilities.

Provides functions to verify JWT tokens issued by Better Auth.
Uses PyJWT with EdDSA (Ed25519) algorithm support.
"""
import httpx
import jwt
from jwt import PyJWKClient
from datetime import datetime, timezone
from fastapi import HTTPException, status
from core.config import settings
import time


# Cache for JWKS client
_jwks_client = None
_jwks_client_init_time = 0
_jwks_cache_duration = 3600  # 1 hour


class TokenPayload:
    """
    Represents the decoded JWT token payload.

    Attributes:
        user_id: User identifier extracted from 'sub' claim
        email: User email address
        exp: Token expiration timestamp
    """

    def __init__(self, sub: str, email: str = "", exp: int = 0):
        """
        Initialize TokenPayload.

        Args:
            sub: User ID from JWT 'sub' claim
            email: User email from JWT 'email' claim
            exp: Expiration timestamp from JWT 'exp' claim
        """
        self.user_id = sub
        self.email = email
        self.exp = exp


def get_jwks_client():
    """
    Get or create a PyJWKClient for fetching JWKS.
    """
    global _jwks_client, _jwks_client_init_time

    current_time = time.time()

    # Create new client if none exists or cache expired
    if (_jwks_client is None or
            current_time - _jwks_client_init_time > _jwks_cache_duration):
        jwks_url = f"{settings.BETTER_AUTH_URL}/api/auth/jwks"
        print(f"[DEBUG] Creating JWKS client for: {jwks_url}")
        _jwks_client = PyJWKClient(jwks_url)
        _jwks_client_init_time = current_time

    return _jwks_client


def verify_token(token: str) -> TokenPayload:
    """
    Verify and decode a JWT token issued by Better Auth.

    This function:
    1. Fetches JWKS from Better Auth
    2. Finds the matching key for the token
    3. Verifies the token signature using EdDSA
    4. Checks token expiration
    5. Returns a TokenPayload object with user information

    Args:
        token: JWT token string from Authorization header

    Returns:
        TokenPayload: Decoded token payload with user information

    Raises:
        HTTPException: 401 Unauthorized if token is invalid, expired, or missing claims
    """
    try:
        # Debug: Log token prefix
        print(f"[DEBUG] Verifying token: {token[:50]}..." if len(token) > 50 else f"[DEBUG] Token: {token}")

        # Get JWKS client
        jwks_client = get_jwks_client()

        # Get the signing key from JWKS
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        print(f"[DEBUG] Got signing key with kid: {signing_key.key_id}")

        # Decode and verify JWT token
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA"],
            options={"verify_aud": False}  # Better Auth doesn't set audience by default
        )
        print(f"[DEBUG] Decoded payload: {payload}")

        # Extract user ID from 'sub' claim
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user identifier",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Extract email and expiration
        email: str = payload.get("email", "")
        exp: int = payload.get("exp", 0)

        return TokenPayload(sub=user_id, email=email, exp=exp)

    except jwt.ExpiredSignatureError:
        print("[DEBUG] Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        print(f"[DEBUG] Invalid token error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"[DEBUG] Unexpected error verifying token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
