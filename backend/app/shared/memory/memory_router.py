from shared.memory.in_memory_engine import InMemoryEngine
from shared.memory.file_memory_engine import FileMemoryEngine
from shared.state.session_manager import session

class MemoryRouter:
    """
    Central abstraction for memory. Supports:
    - Plaintext SQL
    - Encrypted SQL
    """
    def __init__(self, mode="sql", encrypt=True):
        if mode == "sql":
            from shared.memory.sql_memory_engine import SQLMemoryEngine
            engine = SQLMemoryEngine()
        else:
            raise ValueError("Only 'sql' mode implemented in this setup.")
        if encrypt:
            from shared.memory.encrypted_memory_engine import EncryptedMemoryEngine
            self.engine = EncryptedMemoryEngine(engine)
        else:
            self.engine = engine
        self.user = session.get_user_name()
    def save(self, key, value):
        return self.engine.save(self.user, key, value)
    def fetch(self, key):
        return self.engine.fetch(self.user, key)
    def clear(self):
        self.engine.clear(self.user)