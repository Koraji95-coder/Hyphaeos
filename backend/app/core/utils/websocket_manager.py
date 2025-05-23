```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import logging
import asyncio
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.connection_stats: Dict[str, Dict] = {}
        
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
            logger.info(f"New WebSocket connection: {client_id}")
            
            # Send initial connection success message
            await self.send_personal_message(
                {"type": "connection_established", "client_id": client_id},
                client_id
            )
            
            # Start heartbeat for this connection
            asyncio.create_task(self._heartbeat(client_id))
            
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            await self.disconnect(client_id)
    
    async def disconnect(self, client_id: str):
        """Handle WebSocket disconnection"""
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].close()
            except Exception as e:
                logger.error(f"Error closing WebSocket: {e}")
            finally:
                del self.active_connections[client_id]
                del self.connection_stats[client_id]
                logger.info(f"Client disconnected: {client_id}")
    
    async def send_personal_message(self, message: Dict[str, Any], client_id: str):
        """Send message to specific client"""
        if client_id not in self.active_connections:
            return
        
        try:
            websocket = self.active_connections[client_id]
            await websocket.send_json(message)
            self.connection_stats[client_id]["messages_sent"] += 1
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            await self.disconnect(client_id)
    
    async def broadcast(self, message: Dict[str, Any], exclude: str = None):
        """Broadcast message to all connected clients"""
        disconnected = []
        
        for client_id, websocket in self.active_connections.items():
            if client_id != exclude:
                try:
                    await websocket.send_json(message)
                    self.connection_stats[client_id]["messages_sent"] += 1
                except Exception as e:
                    logger.error(f"Broadcast error for {client_id}: {e}")
                    disconnected.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected:
            await self.disconnect(client_id)
    
    async def _heartbeat(self, client_id: str):
        """Send periodic heartbeat to maintain connection"""
        while client_id in self.active_connections:
            try:
                await self.send_personal_message(
                    {"type": "heartbeat", "timestamp": datetime.utcnow().isoformat()},
                    client_id
                )
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
```