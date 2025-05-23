from typing import Dict, Any
import threading

class SessionManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_session()
            return cls._instance

    def _init_session(self):
        self._memory: Dict[str, Any] = {}
        self._user_name = None
        self._user_role = None
        self._device_id = None

    def get_memory(self) -> Dict[str, Any]:
        return self._memory

    def set_memory(self, key: str, value: Any):
        self._memory[key] = value

    def clear_memory(self):
        self._memory.clear()

    def get_user_name(self) -> str:
        return self._user_name

    def get_user_role(self) -> str:
        return self._user_role

    def set_user_profile(self, name: str, role: str):
        self._user_name = name
        self._user_role = role

    def set_device_id(self, device_id: str):
        self._device_id = device_id

    def get_device_id(self) -> str:
        return self._device_id

session = SessionManager()