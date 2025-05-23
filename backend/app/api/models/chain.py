from typing import List
from pydantic import BaseModel

class ChainStep(BaseModel):
    agent: str
    prompt: str

class ChainRequest(BaseModel):
    chain: List[ChainStep]