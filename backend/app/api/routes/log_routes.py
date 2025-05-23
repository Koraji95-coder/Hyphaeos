# backend/app/api/routes/log_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import logging

router = APIRouter()
logger = logging.getLogger("logs")

class LogEntry(BaseModel):
    agent: str
    event: str
    data: Dict[str, Any]

@router.post("/logs/save")
async def save_log(entry: LogEntry):
    """Save system log entry"""
    try:
        logger.info(f"[{entry.agent}] {entry.event}: {entry.data}")
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Failed to save log: {e}")
        raise HTTPException(status_code=500, detail="Failed to save log entry")