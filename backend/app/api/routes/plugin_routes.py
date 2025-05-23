# backend/app/api/routes/plugin_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import logging

router = APIRouter()
logger = logging.getLogger("plugins")

class PluginRequest(BaseModel):
    name: str
    input: Dict[str, Any]

class PluginChain(BaseModel):
    plugins: List[PluginRequest]

@router.post("/plugins/execute")
async def execute_plugin(request: PluginRequest):
    """Execute a single plugin"""
    try:
        logger.info(f"Executing plugin: {request.name}")
        # Plugin execution logic here
        return {"status": "ok", "result": f"Executed {request.name}"}
    except Exception as e:
        logger.error(f"Plugin execution failed: {e}")
        raise HTTPException(status_code=500, detail="Plugin execution failed")

@router.post("/plugins/chain")
async def execute_chain(chain: PluginChain):
    """Execute a chain of plugins"""
    try:
        results = []
        for plugin in chain.plugins:
            logger.info(f"Executing chain plugin: {plugin.name}")
            # Plugin chain execution logic here
            results.append({"plugin": plugin.name, "status": "ok"})
        return {"status": "ok", "results": results}
    except Exception as e:
        logger.error(f"Plugin chain execution failed: {e}")
        raise HTTPException(status_code=500, detail="Plugin chain execution failed")