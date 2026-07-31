import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BACKEND_DIR.parent
load_dotenv(BACKEND_DIR / ".env")

APP_ENV = os.getenv("APP_ENV", "development").lower()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1")
DEEPSEEK_CHAT_MODEL = os.getenv("DEEPSEEK_CHAT_MODEL", "deepseek-chat")
DEEPSEEK_EMBED_MODEL = os.getenv("DEEPSEEK_EMBED_MODEL", "text-embedding-v2")
ORACLE_USER = os.getenv("ORACLE_USER", "SYSTEM")
ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD", "123456")
ORACLE_DSN = os.getenv("ORACLE_DSN", "localhost:1521/orcl")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "vocational-training-system-dev-only")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
DATABASE_TYPE = os.getenv("DATABASE_TYPE", "sqlite").lower()
CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()]
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(BACKEND_DIR / "uploads")))
KNOWLEDGE_BASE_DIR = Path(os.getenv("KNOWLEDGE_BASE_DIR", str(PROJECT_DIR / "知识库")))
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "20"))

if APP_ENV == "production" and not os.getenv("JWT_SECRET_KEY"):
    raise RuntimeError("JWT_SECRET_KEY must be set in production")

# Email (SMTP)
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.qq.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
EMAIL_USER = os.getenv("EMAIL_USER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "true").lower() == "true"

