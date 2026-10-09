import json
import asyncio
from typing import Dict, List, Any, Optional
from fastapi import WebSocket
import logging

logger = logging.getLogger("bayora.events")

class ConnectionManager:
    def __init__(self):
        # evaluation_id -> list of (websocket, role, user_id)
        self.active_connections: Dict[str, List[Dict[str, Any]]] = {}

    async def connect(self, websocket: WebSocket, evaluation_id: str, role: str, user_id: str):
        await websocket.accept()
        conn = {"ws": websocket, "role": role, "user_id": user_id}
        self.active_connections.setdefault(evaluation_id, []).append(conn)
        logger.info(f"WebSocket client connected: user={user_id}, role={role}, eval={evaluation_id}")

    def disconnect(self, websocket: WebSocket, evaluation_id: str):
        if evaluation_id in self.active_connections:
            self.active_connections[evaluation_id] = [
                c for c in self.active_connections[evaluation_id] if c["ws"] != websocket
            ]
            if not self.active_connections[evaluation_id]:
                del self.active_connections[evaluation_id]

    async def broadcast_event(self, evaluation_id: str, event: Dict[str, Any]):
        """
        Broadcasts event with SERVER-SIDE role filtering.
        Never sends raw confidential payloads to Blue Team or Viewer sockets.
        """
        if evaluation_id not in self.active_connections:
            return

        dead_connections = []
        for client in self.active_connections[evaluation_id]:
            ws: WebSocket = client["ws"]
            role = client["role"]

            # Filter event payload based on role
            filtered_event = event.copy()
            if role in ["BLUE_TEAM", "VIEWER"]:
                # Sanitize event metadata
                if "raw_payload" in filtered_event:
                    del filtered_event["raw_payload"]
                if "prompt_text" in filtered_event:
                    del filtered_event["prompt_text"]

            try:
                await ws.send_text(json.dumps(filtered_event, default=str))
            except Exception:
                dead_connections.append(client)

        for dead in dead_connections:
            if evaluation_id in self.active_connections:
                try:
                    self.active_connections[evaluation_id].remove(dead)
                except ValueError:
                    pass

event_manager = ConnectionManager()
