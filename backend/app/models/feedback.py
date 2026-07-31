"""Feedback Model"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default="pending")
    admin_reply = Column(Text)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    resolved_at = Column(DateTime)
