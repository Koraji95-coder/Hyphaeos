import os
import json
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker

# --- Database URL: SQLite by default, set MEMORY_DB_URL for Postgres/cloud ---
DATABASE_URL = os.environ.get("MEMORY_DB_URL", "sqlite:///data/hyphaeos_memory.db")
os.makedirs("data", exist_ok=True)  # Ensures storage folder exists for local

engine = create_engine(DATABASE_URL, future=True)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

class MemoryRecord(Base):
    """
    SQLAlchemy table for user+key-value pairs.
    """
    __tablename__ = "memory"
    user = Column(String, primary_key=True)
    key = Column(String, primary_key=True)
    value = Column(Text)  # Stores JSON or encrypted string

# --- Ensure table exists on first import/startup ---
Base.metadata.create_all(engine)

class SQLMemoryEngine:
    """
    SQL-backed persistent memory engine.
    Can be used directly or as a backend for EncryptedMemoryEngine.
    """

    def save(self, user, key, value):
        """
        Stores a value for user+key.
        Converts non-string (JSON) to string for storage.

        Args:
            user (str): Username/session ID
            key (str): Memory key
            value (Any): Data (str or json-serializable) to store
        """
        val = json.dumps(value) if not isinstance(value, str) else value
        with SessionLocal() as db:
            rec = db.query(MemoryRecord).filter_by(user=user, key=key).first()
            if rec:
                rec.value = val
            else:
                rec = MemoryRecord(user=user, key=key, value=val)
                db.add(rec)
            db.commit()

    def fetch(self, user, key):
        """
        Fetches a value for user+key.
        Attempts to decode JSON if possible.

        Args:
            user (str): Username/session
            key (str): Key to lookup

        Returns:
            The original value, or None
        """
        with SessionLocal() as db:
            rec = db.query(MemoryRecord).filter_by(user=user, key=key).first()
            if rec and rec.value:
                try:
                    return json.loads(rec.value)
                except Exception:
                    return rec.value
            return None

    def clear(self, user):
        """
        Deletes all memory for the given user.

        Args:
            user (str): Username/session
        """
        with SessionLocal() as db:
            db.query(MemoryRecord).filter_by(user=user).delete()
            db.commit()