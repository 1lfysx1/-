from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.models.community import CommunityQuestion, CommunityAnswer
from app.models.feedback import Feedback
from app.models.knowledge import CourseMaterial, KnowledgePoint
from app.models.position import Course, Position
from app.models.question import AnswerRecord
from app.utils.security import get_current_admin_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["Admin"])

class PosCreate(BaseModel):
    name: str
    description: str = ""
    icon: str = "\U0001f4da"

class UserStatusUpdate(BaseModel):
    isActive: bool

def serialize_position(db, position: Position) -> dict:
    return {
        "id": position.id,
        "name": position.name,
        "description": position.description or "",
        "icon": position.icon or "",
        "studentCount": db.query(User).filter(User.role == "student").count(),
        "courseCount": db.query(Course).filter(Course.position_id == position.id).count(),
    }

def ensure_default_course(db, position: Position) -> Course:
    course = db.query(Course).filter(Course.position_id == position.id).first()
    if course:
        return course
    course = Course(
        position_id=position.id,
        name=f"{position.name}基础课程",
        description=position.description or f"{position.name}岗位知识与题库课程",
        chapter_count=0,
    )
    db.add(course)
    db.flush()
    return course

def serialize_course(db, course: Course) -> dict:
    return {
        "id": course.id,
        "positionId": course.position_id,
        "name": course.name,
        "description": course.description or "",
        "chapterCount": course.chapter_count or 0,
        "knowledgePointCount": db.query(KnowledgePoint).filter(KnowledgePoint.course_id == course.id).count(),
        "materialCount": db.query(CourseMaterial).filter(CourseMaterial.course_id == course.id).count(),
    }

def user_status(user: User) -> str:
    if user.is_active == "2":
        return "cancelled"
    if user.is_active == "0":
        return "banned"
    return "active"

def build_practice_history(records: list[AnswerRecord]):
    batches = []
    for record in sorted(records, key=lambda item: item.answered_at):
        if not record.answered_at:
            continue
        bucket_time = record.answered_at.replace(second=0, microsecond=0)
        if not batches or batches[-1]["bucket"] != bucket_time:
            batches.append({"bucket": bucket_time, "total": 0, "correct": 0})
        batches[-1]["total"] += 1
        if record.is_correct == "1":
            batches[-1]["correct"] += 1
    return [
        {
            "date": batch["bucket"].isoformat(),
            "score": round(batch["correct"] / batch["total"] * 100) if batch["total"] else 0,
            "total": batch["total"],
            "correct": batch["correct"],
        }
        for batch in batches
    ]

@router.get("/users")
def get_users(admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        users = db.query(User).all()
        return {
            "success": True,
            "data": [
                {
                    "id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "role": u.role,
                    "isActive": u.is_active == "1",
                    "accountStatus": user_status(u),
                }
                for u in users
            ],
        }
    finally:
        db.close()

@router.delete("/users/{user_id}")
def delete_user(user_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        if user_id == admin_id:
            raise HTTPException(status_code=400, detail="不能封禁当前登录账号")
        u = db.query(User).filter(User.id == user_id).first()
        if not u:
            raise HTTPException(404)
        if u.is_active == "2":
            raise HTTPException(status_code=400, detail="该用户已注销，不能封禁或删除")
        u.is_active = "0"; db.commit()
        return {"success": True}
    finally:
        db.close()

@router.put("/users/{user_id}/status")
def update_user_status(user_id: str, req: UserStatusUpdate, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        if user_id == admin_id and not req.isActive:
            raise HTTPException(status_code=400, detail="管理员不能封禁自己")
        u = db.query(User).filter(User.id == user_id).first()
        if not u:
            raise HTTPException(404)
        if u.is_active == "2":
            raise HTTPException(status_code=400, detail="该用户已注销，不能解封")
        u.is_active = "1" if req.isActive else "0"
        db.commit()
        return {"success": True, "data": {"id": u.id, "isActive": u.is_active != "0", "accountStatus": user_status(u)}}
    finally:
        db.close()

@router.put("/users/{user_id}/restore")
def restore_cancelled_user(user_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        u = db.query(User).filter(User.id == user_id).first()
        if not u:
            raise HTTPException(404)
        if u.is_active != "2":
            raise HTTPException(status_code=400, detail="该用户不是注销状态")
        u.is_active = "1"
        db.commit()
        return {"success": True, "data": {"id": u.id, "isActive": True, "accountStatus": user_status(u)}}
    finally:
        db.close()

@router.get("/posts")
def get_posts(admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        posts = db.query(CommunityQuestion).filter(CommunityQuestion.is_deleted == "0").order_by(CommunityQuestion.created_at.desc()).all()
        result = [{"id": p.id, "title": p.title, "description": p.description or "", "tags": [], "authorName": p.author_name or "",
                   "createdAt": p.created_at.isoformat() if p.created_at else "",
                   "answerCount": db.query(CommunityAnswer).filter(CommunityAnswer.question_id == p.id).count()} for p in posts]
        return {"success": True, "data": result}
    finally:
        db.close()

@router.delete("/posts/{post_id}")
def delete_post(post_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        p = db.query(CommunityQuestion).filter(CommunityQuestion.id == post_id).first()
        if not p:
            raise HTTPException(404)
        p.is_deleted = "1"; db.commit()
        return {"success": True}
    finally:
        db.close()

@router.put("/posts/{post_id}/pin")
def pin_post(post_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        p = db.query(CommunityQuestion).filter(CommunityQuestion.id == post_id).first()
        if not p:
            raise HTTPException(404)
        p.is_pinned = "1" if p.is_pinned == "0" else "0"; db.commit()
        return {"success": True}
    finally:
        db.close()

@router.get("/feedbacks")
def get_feedbacks(admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        fbs = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
        result = [{"id": f.id, "userId": f.user_id or "", "title": f.title, "description": f.description or "",
                   "authorName": (db.query(User.username).filter(User.id == f.user_id).scalar()) or "",
                   "category": f.category, "status": f.status, "adminReply": f.admin_reply or "",
                   "createdAt": f.created_at.isoformat() if f.created_at else "", "resolvedAt": f.resolved_at.isoformat() if f.resolved_at else None} for f in fbs]
        return {"success": True, "data": result}
    finally:
        db.close()

@router.put("/feedbacks/{fb_id}")
def resolve_feedback(fb_id: str, reply: str = "", admin_id: str = Depends(get_current_admin_id)):
    from datetime import datetime
    db = SessionLocal()
    try:
        fb = db.query(Feedback).filter(Feedback.id == fb_id).first()
        if not fb:
            raise HTTPException(404)
        fb.status = "resolved"; fb.admin_reply = reply; fb.resolved_at = datetime.now()
        db.commit()
        return {"success": True}
    finally:
        db.close()

@router.get("/scores")
def get_scores(admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        result = []
        users = db.query(User).filter(User.role == "student").order_by(User.created_at.asc()).all()
        for user in users:
            records = (
                db.query(AnswerRecord)
                .filter(AnswerRecord.user_id == user.id)
                .order_by(AnswerRecord.answered_at.asc())
                .all()
            )
            history = build_practice_history(records)
            if not history:
                continue
            result.append({
                "userId": user.id,
                "username": user.username,
                "email": user.email,
                "preTest": history[0]["score"],
                "postTest": history[-1]["score"],
                "scoreHistory": history,
            })
        return {"success": True, "data": result}
    finally:
        db.close()

@router.post("/positions")
def create_position(req: PosCreate, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        pos = Position(name=req.name, description=req.description, icon=req.icon)
        db.add(pos)
        db.flush()
        ensure_default_course(db, pos)
        db.commit()
        db.refresh(pos)
        return {"success": True, "data": serialize_position(db, pos)}
    finally:
        db.close()

@router.post("/positions/{pos_id}/default-course")
def create_default_course(pos_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        pos = db.query(Position).filter(Position.id == pos_id).first()
        if not pos:
            raise HTTPException(status_code=404, detail="岗位不存在")
        course = ensure_default_course(db, pos)
        db.commit()
        db.refresh(course)
        return {"success": True, "data": serialize_course(db, course)}
    finally:
        db.close()

@router.delete("/positions/{pos_id}")
def delete_position(pos_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        pos = db.query(Position).filter(Position.id == pos_id).first()
        if not pos:
            raise HTTPException(404)
        db.delete(pos); db.commit()
        return {"success": True}
    finally:
        db.close()


