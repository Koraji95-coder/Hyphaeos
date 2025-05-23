# backend/api/routes/mycocore_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging

router = APIRouter()
logger = logging.getLogger("mycocore")

# 🧬 Response Schema
class Snapshot(BaseModel):
    status: str
    uptime: str
    memory_usage: float
    cpu_usage: float
    agents: List[str]

# 🔍 GET MycoCore snapshot
@router.get("/mycocore/snapshot", response_model=Snapshot, tags=["mycocore"])
async def get_mycocore_snapshot():
    logger.info("Fetching MycoCore snapshot...")
    try:
        # 🔧 Stubbed response - replace with actual system pull
        return Snapshot(
            status="operational",
            uptime="4d 12h",
            memory_usage=68.5,
            cpu_usage=41.7,
            agents=["neuroweave", "rootbloom", "sporelink"]
        )
    except Exception as e:
        logger.error(f"MycoCore snapshot error: {e}")
        raise HTTPException(status_code=500, detail="Unable to fetch MycoCore data.")
