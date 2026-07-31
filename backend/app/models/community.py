"""Community Models"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from app.database import Base

class CommunityQuestion(Base):
    __tablename__ = "community_questions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    tags = Column(String(500))
    author_name = Column(String(50))
    is_pinned = Column(String(1), default="0")
    is_deleted = Column(String(1), default="0")
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class CommunityAnswer(Base):
    __tablename__ = "community_answers"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("community_questions.id", ondelete="CASCADE"))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"))
    content = Column(Text, nullable=False)
    author_name = Column(String(50))
    is_adopted = Column(String(1), default="0")
    is_good = Column(String(1), default="0")
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class CommunityQuestionVote(Base):
    __tablename__ = "community_question_votes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("community_questions.id", ondelete="CASCADE"))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class AnswerVote(Base):
    __tablename__ = "answer_votes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    answer_id = Column(String(36), ForeignKey("community_answers.id", ondelete="CASCADE"))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, nullable=False, default=datetime.now)
