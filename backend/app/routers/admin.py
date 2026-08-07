import os

from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.models.community import CommunityQuestion, CommunityAnswer
from app.models.exam import ExperimentData
from app.models.feedback import Feedback
from app.models.knowledge import CourseMaterial, DocChunk, KnowledgePoint
from app.models.position import Course, Position
from app.models.question import AnswerRecord, Question, UserKpMastery
from app.services.rag_service import ensure_builtin_course_index, get_course_rag_status, reindex_course_embeddings
from app.utils.security import get_current_admin_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["Admin"])

class PosCreate(BaseModel):
    name: str
    description: str = ""
    icon: str = "\U0001f4da"

class UserStatusUpdate(BaseModel):
    isActive: bool

class CourseCreate(BaseModel):
    name: str
    description: str = ""

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

def count_course_questions(db, course_id: str) -> int:
    kp_ids = [item[0] for item in db.query(KnowledgePoint.id).filter(KnowledgePoint.course_id == course_id).all()]
    if not kp_ids:
        return 0
    return db.query(Question).filter(Question.knowledge_point_id.in_(kp_ids), Question.is_deleted == "0").count()

def serialize_course(db, course: Course) -> dict:
    return {
        "id": course.id,
        "positionId": course.position_id,
        "name": course.name,
        "description": course.description or "",
        "chapterCount": course.chapter_count or 0,
        "knowledgePointCount": db.query(KnowledgePoint).filter(KnowledgePoint.course_id == course.id).count(),
        "materialCount": db.query(CourseMaterial).filter(CourseMaterial.course_id == course.id).count(),
        "questionCount": count_course_questions(db, course.id),
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
        records = (
            db.query(ExperimentData, User, Course)
            .join(User, ExperimentData.user_id == User.id)
            .outerjoin(Course, ExperimentData.course_id == Course.id)
            .filter(User.role == "student", ExperimentData.course_id.isnot(None))
            .order_by(User.created_at.asc(), ExperimentData.created_at.asc())
            .all()
        )
        for experiment, user, course in records:
            if (experiment.pre_test_total or 0) <= 0:
                continue
            answer_records = (
                db.query(AnswerRecord)
                .join(Question, AnswerRecord.question_id == Question.id)
                .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
                .filter(
                    AnswerRecord.user_id == user.id,
                    KnowledgePoint.course_id == experiment.course_id,
                )
                .order_by(AnswerRecord.answered_at.asc())
                .all()
            )
            history = build_practice_history(answer_records)
            result.append({
                "userId": f"{user.id}:{experiment.course_id}",
                "username": user.username,
                "email": user.email,
                "courseId": experiment.course_id,
                "courseName": course.name if course else "未知课程",
                "preTest": experiment.pre_test_score,
                "postTest": experiment.post_test_score,
                "preTestTotal": experiment.pre_test_total or 0,
                "preTestCorrect": experiment.pre_test_correct or 0,
                "postTestTotal": experiment.post_test_total or 0,
                "postTestCorrect": experiment.post_test_correct or 0,
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

@router.post("/positions/{pos_id}/courses")
def create_course(pos_id: str, req: CourseCreate, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        pos = db.query(Position).filter(Position.id == pos_id).first()
        if not pos:
            raise HTTPException(status_code=404, detail="岗位不存在")
        name = req.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="请输入课程名称")
        existing = db.query(Course).filter(Course.position_id == pos_id, Course.name == name).first()
        if existing:
            raise HTTPException(status_code=400, detail="该岗位下已存在同名课程")
        course = Course(position_id=pos_id, name=name, description=req.description.strip(), chapter_count=0)
        db.add(course)
        db.commit()
        db.refresh(course)
        return {"success": True, "data": serialize_course(db, course)}
    finally:
        db.close()

@router.delete("/courses/{course_id}")
def delete_course(course_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="课程不存在")

        materials = db.query(CourseMaterial).filter(CourseMaterial.course_id == course_id).all()
        material_ids = [material.id for material in materials]
        kp_ids = [item[0] for item in db.query(KnowledgePoint.id).filter(KnowledgePoint.course_id == course_id).all()]
        questions = db.query(Question).filter(Question.knowledge_point_id.in_(kp_ids)).all() if kp_ids else []
        question_ids = [question.id for question in questions]

        deleted_counts = {
            "materials": len(materials),
            "knowledgePoints": len(kp_ids),
            "questions": len(questions),
            "chunks": db.query(DocChunk).filter(DocChunk.material_id.in_(material_ids)).count() if material_ids else 0,
        }

        if question_ids:
            db.query(AnswerRecord).filter(AnswerRecord.question_id.in_(question_ids)).update(
                {AnswerRecord.question_id: None},
                synchronize_session=False,
            )
            db.query(Question).filter(Question.id.in_(question_ids)).delete(synchronize_session=False)
        if kp_ids:
            db.query(UserKpMastery).filter(UserKpMastery.kp_id.in_(kp_ids)).delete(synchronize_session=False)
            db.query(KnowledgePoint).filter(KnowledgePoint.id.in_(kp_ids)).delete(synchronize_session=False)
        if material_ids:
            db.query(DocChunk).filter(DocChunk.material_id.in_(material_ids)).delete(synchronize_session=False)
            db.query(CourseMaterial).filter(CourseMaterial.id.in_(material_ids)).delete(synchronize_session=False)
        db.delete(course)
        db.commit()

        for material in materials:
            if material.file_path and os.path.exists(material.file_path):
                try:
                    os.remove(material.file_path)
                except OSError:
                    pass
        return {"success": True, "data": deleted_counts}
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise
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


@router.get("/courses/{course_id}/rag-status")
def get_course_rag_status_admin(course_id: str, admin_id: str = Depends(get_current_admin_id)):
    return {"success": True, "data": get_course_rag_status(course_id)}


@router.get("/courses/{course_id}/chunks")
def get_course_chunks(course_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        rows = (
            db.query(DocChunk, CourseMaterial)
            .join(CourseMaterial, CourseMaterial.id == DocChunk.material_id)
            .filter(CourseMaterial.course_id == course_id)
            .order_by(DocChunk.chunk_index.asc())
            .limit(200)
            .all()
        )
        return {
            "success": True,
            "data": [
                {
                    "id": chunk.id,
                    "materialId": chunk.material_id,
                    "filename": material.filename,
                    "chunkIndex": chunk.chunk_index,
                    "chapter": chunk.chapter or "",
                    "page": chunk.page or 1,
                    "content": chunk.content,
                    "hasEmbedding": bool(chunk.embedding),
                }
                for chunk, material in rows
            ],
        }
    finally:
        db.close()


@router.post("/courses/{course_id}/reindex")
async def reindex_course(course_id: str, admin_id: str = Depends(get_current_admin_id)):
    await ensure_builtin_course_index(course_id)
    data = await reindex_course_embeddings(course_id)
    return {"success": True, "data": data}


