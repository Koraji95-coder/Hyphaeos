from pydantic import BaseModel

class PluginRequest(BaseModel):
    plugin: str
    input: str