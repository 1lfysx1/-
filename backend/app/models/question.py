"""Question & Answer Models"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from app.database import Base

class Question(Base):
    __tablename__ = "questions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String(20), nullable=False)
    stem = Column(Text, nullable=False)
    options = Column(Text)
    answer = Column(Text, nullable=False)
    explanation = Column(Text)
    knowledge_point_id = Column(String(36), ForeignKey("knowledge_points.id", ondelete="SET NULL"))
    is_deleted = Column(String(1), default="0")
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class AnswerRecord(Base):
    __tablename__ = "answer_records"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="SET NULL"))
    user_answer = Column(Text, nullable=False)
    is_correct = Column(String(1), nullable=False)
    answered_at = Column(DateTime, nullable=False, default=datetime.now)

class UserKpMastery(Base):
    __tablename__ = "user_kp_mastery"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    kp_id = Column(String(36), ForeignKey("knowledge_points.id", ondelete="CASCADE"))
    mastery_prob = Column(Float, default=0.5)
    question_count = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    updated_at = Column(DateTime, nullable=False, default=datetime.now)

from app.models.knowledge import KnowledgePoint
