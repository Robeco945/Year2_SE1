from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from contextlib import asynccontextmanager
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routes import users, conversations, messages, auth as auth_routes
from websocket_manager import manager
from auth import SECRET_KEY, ALGORITHM
from jose import JWTError, jwt
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("SKIP_DB_INIT") != "1" and "PYTEST_CURRENT_TEST" not in os.environ:
        Base.metadata.create_all(bind=engine)
    yield

# initialize fastapi
app = FastAPI(
    title="fastapi",
    description="fastapi chat with sql",
    version="1.0.0",
    lifespan=lifespan
)

# cors handling, not strict for development, should be tightened for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# route handling
app.include_router(auth_routes.router)
app.include_router(users.router)
app.include_router(conversations.router)
app.include_router(messages.router)

# root, the main entry point of the API
@app.get("/", tags=["root"])
def read_root():
    """Root endpoint"""
    return {
        "message": "waow",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

# health check endpoint, useful for monitoring and load balancers
@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# WebSocket endpoint — one persistent connection per authenticated user
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int,
    token: str = Query(...),
):
    """Accept and hold a WebSocket connection for a specific user.

    The JWT token is passed as a query parameter because browsers cannot set
    custom HTTP headers during the WebSocket handshake.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = int(payload.get("sub", -1))
    except (JWTError, ValueError):
        await websocket.close(code=4001)
        return

    if token_user_id != user_id:
        await websocket.close(code=4001)
        return

    await manager.connect(user_id, websocket)
    try:
        # Hold the connection open; the server only pushes TO the client.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
