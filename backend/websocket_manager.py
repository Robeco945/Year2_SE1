from fastapi import WebSocket
from typing import Dict


class ConnectionManager:
    """Tracks one active WebSocket connection per user_id."""

    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int) -> None:
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: int, data: dict) -> None:
        """Push a JSON payload to a connected user. Silently drops if offline."""
        ws = self.active_connections.get(user_id)
        if ws is not None:
            try:
                await ws.send_json(data)
            except Exception:
                self.disconnect(user_id)


# Singleton shared across the whole application
manager = ConnectionManager()
