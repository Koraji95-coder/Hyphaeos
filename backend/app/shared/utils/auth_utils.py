import jwt
from fastapi import Request, HTTPException
import os

JWT_SECRET = os.environ.get("JWT_SECRET")

def get_current_email(request: Request) -> str:
    """
    Extract and validate JWT token from Authorization header.
    Returns email encoded in token.
    """
    auth = request.headers.get("authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid token.")

    try:
        token = auth.replace("Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("email")
    except Exception:
        raise HTTPException(401, "Invalid or expired token.")