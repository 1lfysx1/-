"""User Model"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(20), nullable=False, default="student")
    is_active = Column(String(1), nullable=False, default="1")
    created_at = Column(DateTime, nullable=False, default=datetime.now)
