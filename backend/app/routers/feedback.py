from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.feedback import Feedback
from app.models.user import User
from app.utils.security import get_current_user_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/feedbacks", tags=["Feedback"])


class FeedbackCreate(BaseModel):
    title: str
    description: str
    category: str = "other"


def serialize_feedback(db, feedback: Feedback) -> dict:
    author_name = db.query(User.username).filter(User.id == feedback.user_id).scalar() or ""
    return {
        "id": feedback.id,
        "userId": feedback.user_id or "",
        "authorName": author_name,
        "title": feedback.title,
        "description": feedback.description or "",
        "category": feedback.category,
        "status": feedback.status,
        "adminReply": feedback.admin_reply or "",
        "createdAt": feedback.created_at.isoformat() if feedback.created_at else "",
        "resolvedAt": feedback.resolved_at.isoformat() if feedback.resolved_at else None,
    }


@router.get("")
def list_my(user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(status_code=401, detail="请先登录")
    db = SessionLocal()
    try:
        feedbacks = db.query(Feedback).filter(Feedback.user_id == user_id).order_by(Feedback.created_at.desc()).all()
        return {"success": True, "data": [serialize_feedback(db, feedback) for feedback in feedbacks]}
    finally:
        db.close()


@router.post("")
def create(req: FeedbackCreate, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(status_code=401, detail="请先登录")
    db = SessionLocal()
    try:
        feedback = Feedback(user_id=user_id, title=req.title, description=req.description, category=req.category)
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return {"success": True, "data": serialize_feedback(db, feedback), "message": "Feedback submitted"}
    finally:
        db.close()
