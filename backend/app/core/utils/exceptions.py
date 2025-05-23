from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from typing import Callable

def setup_exception_handlers(app: FastAPI):
    """Configure global exception handlers"""
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal server error",
                "type": exc.__class__.__name__
            }
        )