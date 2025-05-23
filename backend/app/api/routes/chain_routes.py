# backend/app/api/routes/chain_routes.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field, constr
from typing import List, Dict, Any
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger("chain")

class AgentStep(BaseModel):
    agent: constr(regex=r'^[a-zA-Z0-9_-]+$', min_length=1, max_length=50)
    prompt: constr(min_length=1, max_length=1000)
    parameters: Dict[str, Any] = Field(default_factory=dict)

class ChainRequest(BaseModel):
    chain: List[AgentStep] = Field(..., min_items=1, max_items=10)
    input: constr(min_length=1, max_length=2000) = ""
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ChainResponse(BaseModel):
    request_id: str
    timestamp: datetime
    chain: List[AgentStep]
    results: List[Dict[str, Any]]
    execution_time: float

@router.post("/chain/execute", response_model=ChainResponse, tags=["chain"])
async def execute_chain(request: ChainRequest):
    """
    🔄 Execute a sequence of agent operations
    
    - Minimum 1 and maximum 10 steps in chain
    - Each prompt limited to 1000 characters
    - Input text limited to 2000 characters
    - Agent names must be alphanumeric with underscores/hyphens
    """
    logger.info(f"Executing chain with {len(request.chain)} steps")
    start_time = datetime.utcnow()
    
    try:
        results = []
        for step in request.chain:
            # Validate agent exists
            if step.agent not in ["neuroweave", "rootbloom", "sporelink"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid agent: {step.agent}"
                )
            
            # Stubbed execution - replace with actual agent routing
            result = {
                "agent": step.agent,
                "input": step.prompt,
                "output": f"{step.agent} processed: {step.prompt}",
                "timestamp": datetime.utcnow().isoformat()
            }
            results.append(result)
        
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        
        return ChainResponse(
            request_id=secrets.token_hex(8),
            timestamp=start_time,
            chain=request.chain,
            results=results,
            execution_time=execution_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chain execution error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to execute agent chain"
        )