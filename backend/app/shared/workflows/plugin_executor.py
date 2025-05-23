import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class PluginExecutor:
    def __init__(self):
        self.plugins: Dict[str, callable] = {}

    def register_plugin(self, name: str, handler: callable):
        """Register a new plugin handler"""
        self.plugins[name] = handler
        logger.info(f"Plugin registered: {name}")

    def execute(self, plugin_name: str, input_data: Any) -> Dict[str, Any]:
        """Execute a plugin with given input"""
        try:
            if plugin_name not in self.plugins:
                raise ValueError(f"Plugin not found: {plugin_name}")

            handler = self.plugins[plugin_name]
            result = handler(input_data)

            return {
                "status": "success",
                "plugin": plugin_name,
                "output": result
            }
        except Exception as e:
            logger.error(f"Plugin execution failed: {e}")
            return {
                "status": "error",
                "plugin": plugin_name,
                "error": str(e)
            }

executor = PluginExecutor()

def execute_plugin(name: str, input_data: Any) -> Dict[str, Any]:
    return executor.execute(name, input_data)