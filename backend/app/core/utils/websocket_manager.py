import asyncio
import logging
from typing import Dict, Set, Any
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.connection_stats: Dict[str, Dict[str, Any]] = {}
        self.heartbeat_tasks: Dict[str, asyncio.Task] = {}
        
    async def connect(self, websocket: WebSocket, client_id: str):
        """Handle new WebSocket connection"""
        try:
            await websocket.accept()
            self.active_connections[client_id] = websocket
            self.connection_stats[client_id] = {
                "connected_at": datetime.utcnow(),
                "messages_received": 0,
                "messages_sent": 0,
                "last_heartbeat": datetime.utcnow()
            }
            
            # Start heartbeat for this connection
            self.heartbeat_tasks[client_id] = asyncio.create_task(
                self._heartbeat_loop(client_id)
            )
            
            logger.info(f"New WebSocket connection: {client_id}")
            
        except Exception as e:
            logger.error(f"Connection error: {e}")
            await self.disconnect(client_id)
            
    async def disconnect(self, client_id: str):
        """Handle WebSocket disconnection"""
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].close()
            except Exception as e:
                logger.error(f"Error closing connection: {e}")
            finally:
                # Cleanup
                if client_id in self.heartbeat_tasks:
                    self.heartbeat_tasks[client_id].cancel()
                    del self.heartbeat_tasks[client_id]
                del self.active_connections[client_id]
                del self.connection_stats[client_id]
                logger.info(f"Client disconnected: {client_id}")
                
    async def broadcast(self, message: Dict[str, Any], exclude: Set[str] = None):
        """Broadcast message to all connected clients"""
        exclude = exclude or set()
        disconnected = []
        
        for client_id, websocket in self.active_connections.items():
            if client_id not in exclude:
                try:
                    await websocket.send_json(message)
                    self.connection_stats[client_id]["messages_sent"] += 1
                except Exception as e:
                    logger.error(f"Broadcast error for {client_id}: {e}")
                    disconnected.append(client_id)
                    
        # Cleanup disconnected clients
        for client_id in disconnected:
            await self.disconnect(client_id)
            
    async def _heartbeat_loop(self, client_id: str):
        """Send periodic heartbeats to maintain connection"""
        while True:
            try:
                if client_id not in self.active_connections:
                    break
                    
                websocket = self.active_connections[client_id]
                await websocket.send_json({
                    "type": "heartbeat",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
                self.connection_stats[client_id]["last_heartbeat"] = datetime.utcnow()
                await asyncio.sleep(30)  # Heartbeat every 30 seconds
                
            except Exception as e:
                logger.error(f"Heartbeat error for {client_id}: {e}")
                await self.disconnect(client_id)
                break
                
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get current WebSocket connection statistics"""
        return {
            "total_connections": len(self.active_connections),
            "connections": self.connection_stats
        }

# Global WebSocket manager instance
manager = ConnectionManager()