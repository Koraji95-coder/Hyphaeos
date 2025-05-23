import logging
from typing import Dict, Any
import threading

logger = logging.getLogger(__name__)

class Atlas:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_atlas()
            return cls._instance

    def _init_atlas(self):
        self._safe_mode = False
        self._system_flags: Dict[str, Any] = {}
        self._active_agents = set()
        logger.info("Atlas core initialized")

    def is_safe(self) -> bool:
        return not self._safe_mode

    def enable_safe_mode(self):
        self._safe_mode = True
        logger.warning("Atlas safe mode enabled")

    def disable_safe_mode(self):
        self._safe_mode = False
        logger.info("Atlas safe mode disabled")

    def set_flag(self, key: str, value: Any):
        self._system_flags[key] = value

    def get_flag(self, key: str) -> Any:
        return self._system_flags.get(key)

    def register_agent(self, agent_id: str):
        self._active_agents.add(agent_id)
        logger.info(f"Agent registered: {agent_id}")

    def unregister_agent(self, agent_id: str):
        self._active_agents.discard(agent_id)
        logger.info(f"Agent unregistered: {agent_id}")

    def get_active_agents(self) -> set:
        return self._active_agents.copy()