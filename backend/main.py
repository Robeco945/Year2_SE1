from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routes import users, conversations, messages
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

# run the app with uvicorn when executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
