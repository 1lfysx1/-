"""Experiment Data Model"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from app.database import Base

class ExperimentData(Base):
    __tablename__ = "experiment_data"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="SET NULL"))
    pre_test_score = Column(Integer, nullable=False)
    pre_test_total = Column(Integer, default=0)
    pre_test_correct = Column(Integer, default=0)
    post_test_score = Column(Integer)
    post_test_total = Column(Integer, default=0)
    post_test_correct = Column(Integer, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now)
