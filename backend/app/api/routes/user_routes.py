```python
# backend/app/api/routes/user_routes.py

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import logging

router = APIRouter()
logger = logging.getLogger("users")
security = HTTPBearer()

class UserProfile(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    verified: bool
    last_login: Optional[str] = None

class UserList(BaseModel):
    users: List[UserProfile]

# Mock storage - replace with database
users_db = {}

@router.get("/users", response_model=UserList, tags=["users"])
async def list_users():
    """
    Get list of system users
    """
    try:
        # Mock user list - replace with database query
        users = [
            UserProfile(
                id="1",
                username="admin",
                email="admin@hyphae.ai",
                role="admin",
                verified=True,
                last_login="2024-01-01T00:00:00Z"
            )
        ]
        return {"users": users}
    except Exception as e:
        logger.error(f"Failed to list users: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@router.get("/users/{user_id}", response_model=UserProfile, tags=["users"])
async def get_user(user_id: str):
    """
    Get user profile by ID
    """
    try:
        # Mock user fetch - replace with database query
        if user_id == "1":
            return UserProfile(
                id="1",
                username="admin",
                email="admin@hyphae.ai",
                role="admin",
                verified=True
            )
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Failed to get user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user")
```