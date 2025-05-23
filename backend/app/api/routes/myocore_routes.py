# backend/api/routes/mycocore_routes.py

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel
from typing import List, Optional
import logging
import asyncio
from datetime import datetime

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

class SystemEvent(BaseModel):
    type: str
    message: str
    timestamp: datetime = datetime.utcnow()

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
    try:
        await websocket.accept()
        connections.append(websocket)
        logger.info(f"New WebSocket connection established. Total connections: {len(connections)}")
        
        # Send initial system status
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to MycoCore stream",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Keep connection alive with heartbeat
        while True:
            try:
                # Wait for messages but also implement a heartbeat
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
                if data == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    })
            except asyncio.TimeoutError:
                # Send heartbeat
                await websocket.send_json({
                    "type": "heartbeat",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
        await handle_disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await handle_disconnect(websocket)

async def handle_disconnect(websocket: WebSocket):
    """Handle WebSocket disconnection cleanup"""
    try:
        connections.remove(websocket)
        logger.info(f"Connection removed. Remaining connections: {len(connections)}")
    except ValueError:
        pass  # Already removed
    except Exception as e:
        logger.error(f"Error during disconnect cleanup: {e}")

# 📡 Broadcast helper for sending events to all connected clients
async def broadcast_event(event: SystemEvent):
    """
    Broadcasts an event to all connected WebSocket clients.
    
    Args:
        event (SystemEvent): The event data to broadcast
    """
    dead_connections = []
    
    for connection in connections:
        try:
            await connection.send_json(event.dict())
        except Exception as e:
            logger.error(f"Failed to broadcast to client: {e}")
            dead_connections.append(connection)
            
    # Cleanup dead connections
    for dead in dead_connections:
        await handle_disconnect(dead)