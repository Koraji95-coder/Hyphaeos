# backend/app/api/routes/auth_routes.py

from fastapi import APIRouter, HTTPException, Request, Depends, Response, Cookie
from fastapi.security import HTTPBearer
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import jwt
import time
import secrets
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

# Mock storage - replace with database
users_db = {}

class UserLogin(BaseModel):
    username: str
    password: str
    pin: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    role: str
    token: str

@router.post("/auth/login")
async def login(credentials: UserLogin):
    """Handle user authentication"""
    try:
        # Mock authentication - replace with actual DB lookup
        if credentials.username.startswith('owner_'):
            role = 'owner'
        elif credentials.username.startswith('admin_'):
            role = 'admin'
        else:
            role = 'user'
            
        if len(credentials.username) < 3 or len(credentials.password) < 6:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate token
        token = jwt.encode(
            {
                "sub": credentials.username,
                "role": role,
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            "secret_key",  # Use proper secret key in production
            algorithm="HS256"
        )

        return UserResponse(
            id=secrets.token_hex(8),
            username=credentials.username,
            role=role,
            token=token
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/logout")
async def logout(response: Response):
    """Handle user logout"""
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/auth/me")
async def get_current_user(token: str = Depends(security)):
    """Get current authenticated user"""
    try:
        payload = jwt.decode(token.credentials, "secret_key", algorithms=["HS256"])
        return {
            "username": payload["sub"],
            "role": payload["role"]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")