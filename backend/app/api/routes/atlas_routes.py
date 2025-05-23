# backend/app/api/routes/atlas_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging

router = APIRouter()
logger = logging.getLogger("atlas")

class SystemMode(BaseModel):
    mode: str

class SystemState(BaseModel):
    mode: str
    flags: Dict[str, Any]
    user: Dict[str, Any]
    version: str

# Mock system state - replace with actual implementation
SYSTEM_STATE = {
    "mode": "development",
    "flags": {},
    "user": {
        "id": "default",
        "role": "admin"
    },
    "version": "0.2.9"  # Synced with version.py
}

@router.get("/atlas/state", response_model=SystemState, tags=["atlas"])
async def get_state():
    """
    Get current system state including mode, flags, and user context.
    """
    logger.info("Fetching system state")
    try:
        return SYSTEM_STATE
    except Exception as e:
        logger.error(f"Failed to fetch system state: {e}")
        raise HTTPException(status_code=500, detail="Unable to fetch system state")

@router.post("/atlas/mode", tags=["atlas"])
async def set_mode(mode: SystemMode):
    """
    Update system runtime mode.
    """
    logger.info(f"Setting system mode to: {mode.mode}")
    try:
        SYSTEM_STATE["mode"] = mode.mode
        return {"status": "ok", "mode": mode.mode}
    except Exception as e:
        logger.error(f"Failed to set system mode: {e}")
        raise HTTPException(status_code=500, detail="Unable to set system mode")