from fastapi import APIRouter, HTTPException, Query

from app.database import SessionLocal
from app.models.knowledge import CourseMaterial, KnowledgePoint
from app.models.position import Course, Position

router = APIRouter(prefix="/api", tags=["Positions"])


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


@router.get("/positions")
def get_positions():
    db = SessionLocal()
    try:
        positions = db.query(Position).all()
        result = [{
            "id": position.id,
            "name": position.name,
            "description": position.description or "",
            "icon": position.icon or "",
            "studentCount": 0,
            "courseCount": db.query(Course).filter(Course.position_id == position.id).count(),
        } for position in positions]
        return {"success": True, "data": result}
    finally:
        db.close()


@router.get("/courses")
def get_courses(position_id: str = Query(...)):
    db = SessionLocal()
    try:
        courses = db.query(Course).filter(Course.position_id == position_id).all()
        return {"success": True, "data": [serialize_course(db, course) for course in courses]}
    finally:
        db.close()


@router.get("/courses/{course_id}")
def get_course(course_id: str):
    db = SessionLocal()
    try:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="课程不存在")
        return {"success": True, "data": serialize_course(db, course)}
    finally:
        db.close()
