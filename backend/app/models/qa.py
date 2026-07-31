"""QA Session Models"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.database import Base

class QASession(Base):
    __tablename__ = "qa_sessions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="SET NULL"))
    title = Column(String(200))
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class QAMessage(Base):
    __tablename__ = "qa_messages"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("qa_sessions.id", ondelete="CASCADE"))
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    sources = Column(Text)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
