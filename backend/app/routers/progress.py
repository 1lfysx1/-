from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.knowledge import KnowledgePoint
from app.models.question import AnswerRecord, UserKpMastery
from app.models.user import User
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/progress", tags=["Progress"])

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

@router.get("/mastery")
def get_mastery(user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        records = (
            db.query(UserKpMastery, KnowledgePoint)
            .join(KnowledgePoint, KnowledgePoint.id == UserKpMastery.kp_id)
            .filter(
                UserKpMastery.user_id == user_id,
                UserKpMastery.question_count > 0,
            )
            .all()
        )
        result = [
            {
                "id": kp.id,
                "name": kp.name,
                "masteryProb": record.mastery_prob,
                "chapter": kp.chapter or "",
                "questionCount": record.question_count,
                "correctCount": record.correct_count,
            }
            for record, kp in records
        ]
        return {"success": True, "data": result}
    finally:
        db.close()

@router.get("/scores")
def get_my_scores(user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(404, detail="User not found")
        records = (
            db.query(AnswerRecord)
            .filter(AnswerRecord.user_id == user_id)
            .order_by(AnswerRecord.answered_at.asc())
            .all()
        )
        history = build_practice_history(records)
        if not history:
            return {"success": True, "data": None}
        return {
            "success": True,
            "data": {
                "userId": user.id,
                "username": user.username,
                "email": user.email,
                "preTest": history[0]["score"],
                "postTest": history[-1]["score"],
                "scoreHistory": history,
            },
        }
    finally:
        db.close()

@router.get("/recommendations")
def get_recommendations(user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        weak = (
            db.query(UserKpMastery)
            .filter(
                UserKpMastery.user_id == user_id,
                UserKpMastery.question_count > 0,
                UserKpMastery.mastery_prob < 0.7,
            )
            .order_by(UserKpMastery.mastery_prob.asc())
            .limit(5)
            .all()
        )
        result = []
        for w in weak:
            kp = db.query(KnowledgePoint).filter(KnowledgePoint.id == w.kp_id).first()
            if kp:
                result.append({"type": "material", "title": kp.name, "description": f"Review {kp.chapter or ''}", "reason": f"Mastery: {round(w.mastery_prob * 100)}%"})
        return {"success": True, "data": result}
    finally:
        db.close()
