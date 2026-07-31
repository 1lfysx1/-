import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path

from app.config import DATABASE_TYPE

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
default_sqlite_path = Path(BASE_DIR) / "training.db"
runtime_sqlite_path = Path(BASE_DIR) / "training.db.runtime"
SQLITE_PATH = (Path(os.getenv("SQLITE_DATABASE_PATH", str(runtime_sqlite_path if runtime_sqlite_path.exists() else default_sqlite_path))).resolve().as_posix())

if DATABASE_TYPE == "oracle":
    try:
        from app.config import ORACLE_DSN, ORACLE_PASSWORD, ORACLE_USER
        database_url = f"oracle+oracledb://{ORACLE_USER}:{ORACLE_PASSWORD}@{ORACLE_DSN}"
        engine = create_engine(database_url, pool_size=5, max_overflow=10, pool_pre_ping=True)
    except ImportError:
        print("[DB] oracledb not installed, falling back to SQLite")
        engine = create_engine(f"sqlite:///{SQLITE_PATH}", connect_args={"check_same_thread": False})
    except Exception as exc:
        print(f"[DB] Oracle configuration failed, falling back to SQLite: {exc}")
        engine = create_engine(f"sqlite:///{SQLITE_PATH}", connect_args={"check_same_thread": False})
else:
    engine = create_engine(f"sqlite:///{SQLITE_PATH}", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")
os.makedirs(CHROMA_DIR, exist_ok=True)
chroma_client = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_chroma_collection():
    global chroma_client
    if chroma_client is None:
        try:
            import chromadb
            chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
        except Exception as exc:
            print(f"[DB] Chroma unavailable, continuing without vector search: {exc}")
            return None
    return chroma_client.get_or_create_collection(name="course_knowledge", metadata={"hnsw:space": "cosine"})
