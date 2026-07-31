"""Position & Course Models"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from app.database import Base

class Position(Base):
    __tablename__ = "positions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String(10))
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class Course(Base):
    __tablename__ = "courses"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    position_id = Column(String(36), ForeignKey("positions.id", ondelete="CASCADE"))
    name = Column(String(200), nullable=False)
    description = Column(Text)
    chapter_count = Column(Integer, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
