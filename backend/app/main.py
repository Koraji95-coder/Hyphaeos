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
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import time

from .version import __version__
from .core.utils.error_handlers import setup_error_handlers
from .core.utils.logger import setup_logging
from .core.utils.rate_limiter import rate_limit_middleware

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

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)

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

# Rate limiting middleware
app.middleware("http")(rate_limit_middleware)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path}",
        extra={
            "duration_ms": round(duration * 1000, 2),
            "status_code": response.status_code,
            "client_ip": request.client.host,
        }
    )
    return response

# Register error handlers
setup_error_handlers(app)

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

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting HyphaeOS API v{__version__}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down HyphaeOS API")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)