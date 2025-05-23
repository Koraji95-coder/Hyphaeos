"""
main.py 🌐
-----------
Entry point for the HyphaeOS FastAPI backend.

Responsibilities:
- Launch API app
- Register API routes
- Enable CORS
- Configure logging
- Auto-generate OpenAPI docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .version import __version__

# Import all routes
from .api.routes import (
    auth_routes,
    chain_routes,
    log_routes,
    mycocore_routes,
    neuroweave_routes,
    plugin_routes,
    rootbloom_routes,
    sporelink_routes,
    state_routes,
    system_routes,
    user_routes,
    verify_routes
)

# Initialize FastAPI app
app = FastAPI(
    title="HyphaeOS API",
    description="Backend API for HyphaeOS multi-agent system",
    version=__version__
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_routes.router, prefix="/api", tags=["auth"])
app.include_router(chain_routes.router, prefix="/api", tags=["chain"])
app.include_router(log_routes.router, prefix="/api", tags=["logs"])
app.include_router(mycocore_routes.router, prefix="/api", tags=["mycocore"])
app.include_router(neuroweave_routes.router, prefix="/api", tags=["neuroweave"])
app.include_router(plugin_routes.router, prefix="/api", tags=["plugins"])
app.include_router(rootbloom_routes.router, prefix="/api", tags=["rootbloom"])
app.include_router(sporelink_routes.router, prefix="/api", tags=["sporelink"])
app.include_router(state_routes.router, prefix="/api", tags=["state"])
app.include_router(system_routes.router, prefix="/api", tags=["system"])
app.include_router(user_routes.router, prefix="/api", tags=["users"])
app.include_router(verify_routes.router, prefix="/api", tags=["verify"])

# Mount static files (if needed)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
