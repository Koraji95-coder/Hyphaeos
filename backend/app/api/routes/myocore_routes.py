# backend/api/routes/mycocore_routes.py

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import logging

router = APIRouter()
logger = logging.getLogger("mycocore")

# WebSocket connections store
connections: List[WebSocket] = []

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

# 🔌 WebSocket endpoint for real-time agent logs
@router.websocket("/mycocore/stream")
async def agent_log_stream(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive with ping/pong
    except WebSocketDisconnect:
        connections.remove(websocket)

# 📡 Broadcast helper for sending events to all connected clients
async def broadcast_event(event: dict):
    """
    Broadcasts an event to all connected WebSocket clients.
    
    Args:
        event (dict): The event data to broadcast
    """
    for connection in connections:
        try:
            await connection.send_json(event)
        except Exception as e:
            logger.error(f"Failed to broadcast to client: {e}")
            try:
                connections.remove(connection)
            except ValueError:
                pass  # Connection already removed