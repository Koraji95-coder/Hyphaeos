"""
main.py 🌐
-----------
🚀 Entry point for the HyphaeOS FastAPI backend.

Responsibilities:
- Launch API app
- Registers API routes for Daphne, Bart, Cortexa, and Atlas
- Enable CORS for frontend integration
- Register modular routers
- Display current app version and environment mode
- Auto-generates OpenAPI docs at /docs
"""
# 🧩 Standard Library
import os
import logging
from pathlib import Path

# 🌐 Third-Party
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# 📦 Internal Modules (Backend)
from .version import __version__

from backend.core.utils.logger import log_version, log_environment
from backend.core.utils.exceptions import setup_exception_handlers
from backend.core.utils.websocket_manager import manager as ws_manager

from backend.api.routes import (
    auth_routes,
    chain_routes,
    plugin_routes,
    log_routes,
    system_routes,
    ws_routes,
    mycocore_routes,
    neuroweave_routes,
    rootbloom_routes,
    sporelink_routes,
)

# Profile Set (best practice: sets canonical user & device)
session.set_user_profile(load_user_profile_from_system())

# Detect runtime environment (default: development)
env = os.environ.get("ENVIRONMENT", "development").upper()
print(f"🧠 HyphaeOS v{__version__} booted in {env} mode")


def get_env() -> str:
    return os.environ.get("ENVIRONMENT", "development").lower()


# FastAPI app instance
app = FastAPI(
    title="HyphaeOS API",
    description="Backend API for multi-agent system",
    version=__version__
)

# CORS config — in dev, allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Registration
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(system.router, prefix="/api/system", tags=["system"])
app.include_router(mycocore.router, prefix="/api/agents", tags=["mycocore"])
app.include_router(neuroweave.router, prefix="/api/agents", tags=["neuroweave"])
app.include_router(rootbloom.router, prefix="/api/agents", tags=["rootbloom"])
app.include_router(sporelink.router, prefix="/api/agents", tags=["sporelink"])
# Mount the built frontend at "/"
app.mount("/", StaticFiles(directory="hyphaeos-ui/dist", html=True), name="frontend")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"[VALIDATION ERROR] {exc.errors()}")
    return JSONResponse(
        status_code=400,
        content={"ok": False, "errors": exc.errors()},
    )

if __name__== "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)