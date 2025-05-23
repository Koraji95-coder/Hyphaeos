from pydantic import BaseModel
from typing import List

class AgentChainRequest(BaseModel):
    chain: List[str]  # e.g., ["cortexa", "bart", "daphne"]
    input: str        # The shared user prompt