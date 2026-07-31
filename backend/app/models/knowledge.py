"""Knowledge Models"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from app.database import Base

class KnowledgePoint(Base):
    __tablename__ = "knowledge_points"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"))
    name = Column(String(200), nullable=False)
    chapter = Column(String(100))
    parent_id = Column(String(36))
    created_at = Column(DateTime, nullable=False, default=datetime.now)

class CourseMaterial(Base):
    __tablename__ = "course_materials"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="SET NULL"))
    filename = Column(String(200), nullable=False)
    file_path = Column(String(500), nullable=False)
    upload_at = Column(DateTime, nullable=False, default=datetime.now)

class DocChunk(Base):
    __tablename__ = "doc_chunks"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    material_id = Column(String(36), ForeignKey("course_materials.id", ondelete="CASCADE"))
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    chapter = Column(String(100))
    page = Column(Integer)
    chroma_id = Column(String(100))
    embedding = Column(Text)
