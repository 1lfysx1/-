import json
from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.models.community import AnswerVote, CommunityAnswer, CommunityQuestion, CommunityQuestionVote
from app.utils.security import get_current_user_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/community", tags=["Community"])

class PostCreate(BaseModel):
    title: str
    description: str
    tags: list[str] = []

class AnswerCreate(BaseModel):
    questionId: str
    content: str


def _safe_tags(raw: str | None) -> list[str]:
    if not raw:
        return []
    try:
        value = json.loads(raw)
        return value if isinstance(value, list) else []
    except json.JSONDecodeError:
        return []


def _serialize_question(db, question: CommunityQuestion, user_id: str | None = None) -> dict:
    answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == question.id).count()
    good_count = db.query(CommunityAnswer).filter(
        CommunityAnswer.question_id == question.id,
        CommunityAnswer.is_good == "1",
    ).count()
    like_count = db.query(CommunityQuestionVote).filter(CommunityQuestionVote.question_id == question.id).count()
    liked = False
    if user_id:
        liked = db.query(CommunityQuestionVote).filter(
            CommunityQuestionVote.question_id == question.id,
            CommunityQuestionVote.user_id == user_id,
        ).first() is not None
    return {
        "id": question.id,
        "title": question.title,
        "description": question.description or "",
        "tags": _safe_tags(question.tags),
        "authorName": question.author_name or "",
        "createdAt": question.created_at.isoformat() if question.created_at else "",
        "answerCount": answer_count,
        "likeCount": like_count,
        "hasLiked": liked,
        "hasGoodAnswer": good_count > 0,
    }


def _serialize_answer(db, answer: CommunityAnswer, user_id: str | None = None) -> dict:
    like_count = db.query(AnswerVote).filter(AnswerVote.answer_id == answer.id).count()
    liked = False
    if user_id:
        liked = db.query(AnswerVote).filter(
            AnswerVote.answer_id == answer.id,
            AnswerVote.user_id == user_id,
        ).first() is not None
    return {
        "id": answer.id,
        "questionId": answer.question_id,
        "content": answer.content,
        "authorName": answer.author_name or "",
        "createdAt": answer.created_at.isoformat() if answer.created_at else "",
        "likeCount": like_count,
        "hasLiked": liked,
        "canDelete": bool(user_id and answer.user_id == user_id),
        "isAdopted": answer.is_adopted == "1",
        "isGood": answer.is_good == "1",
    }


@router.get("/questions")
def list_questions(user_id: str = Depends(get_current_user_id)):
    db = SessionLocal()
    try:
        questions = (
            db.query(CommunityQuestion)
            .filter(CommunityQuestion.is_deleted == "0")
            .order_by(CommunityQuestion.is_pinned.desc(), CommunityQuestion.created_at.desc())
            .limit(50)
            .all()
        )
        return {"success": True, "data": [_serialize_question(db, question, user_id) for question in questions]}
    finally:
        db.close()


@router.post("/questions")
def create_question(req: PostCreate, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        question = CommunityQuestion(
            user_id=user_id,
            title=req.title,
            description=req.description,
            tags=json.dumps(req.tags, ensure_ascii=False),
            author_name=user.username if user else "",
        )
        db.add(question)
        db.commit()
        db.refresh(question)
        return {"success": True, "data": _serialize_question(db, question, user_id)}
    finally:
        db.close()


@router.get("/questions/{question_id}")
def get_detail(question_id: str, user_id: str = Depends(get_current_user_id)):
    db = SessionLocal()
    try:
        question = db.query(CommunityQuestion).filter(
            CommunityQuestion.id == question_id,
            CommunityQuestion.is_deleted == "0",
        ).first()
        if not question:
            raise HTTPException(404)
        answers = (
            db.query(CommunityAnswer)
            .filter(CommunityAnswer.question_id == question_id)
            .order_by(CommunityAnswer.is_adopted.desc(), CommunityAnswer.like_count.desc(), CommunityAnswer.created_at.asc())
            .all()
        )
        return {
            "success": True,
            "data": {
                "question": _serialize_question(db, question, user_id),
                "answers": [_serialize_answer(db, answer, user_id) for answer in answers],
            },
        }
    finally:
        db.close()


@router.post("/questions/{question_id}/like")
def toggle_question_like(question_id: str, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        question = db.query(CommunityQuestion).filter(
            CommunityQuestion.id == question_id,
            CommunityQuestion.is_deleted == "0",
        ).first()
        if not question:
            raise HTTPException(404, "问题不存在")
        vote = db.query(CommunityQuestionVote).filter(
            CommunityQuestionVote.question_id == question_id,
            CommunityQuestionVote.user_id == user_id,
        ).first()
        liked = vote is None
        if vote:
            db.delete(vote)
        else:
            db.add(CommunityQuestionVote(question_id=question_id, user_id=user_id))
        db.commit()
        like_count = db.query(CommunityQuestionVote).filter(CommunityQuestionVote.question_id == question_id).count()
        return {"success": True, "data": {"liked": liked, "likeCount": like_count}}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.post("/answers")
def create_answer(req: AnswerCreate, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        question = db.query(CommunityQuestion).filter(
            CommunityQuestion.id == req.questionId,
            CommunityQuestion.is_deleted == "0",
        ).first()
        if not question:
            raise HTTPException(404, "问题不存在")
        user = db.query(User).filter(User.id == user_id).first()
        answer = CommunityAnswer(
            question_id=req.questionId,
            user_id=user_id,
            content=req.content,
            author_name=user.username if user else "",
        )
        db.add(answer)
        db.commit()
        db.refresh(answer)
        answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == req.questionId).count()
        return {"success": True, "data": {"id": answer.id, "answerCount": answer_count}}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.post("/answers/{answer_id}/like")
def toggle_answer_like(answer_id: str, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        answer = db.query(CommunityAnswer).filter(CommunityAnswer.id == answer_id).first()
        if not answer:
            raise HTTPException(404, "回答不存在")
        vote = db.query(AnswerVote).filter(
            AnswerVote.answer_id == answer_id,
            AnswerVote.user_id == user_id,
        ).first()
        liked = vote is None
        if vote:
            db.delete(vote)
        else:
            db.add(AnswerVote(answer_id=answer_id, user_id=user_id))
        db.commit()
        like_count = db.query(AnswerVote).filter(AnswerVote.answer_id == answer_id).count()
        answer.like_count = like_count
        db.commit()
        return {"success": True, "data": {"liked": liked, "likeCount": like_count}}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.delete("/answers/{answer_id}")
def delete_answer(answer_id: str, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        answer = db.query(CommunityAnswer).filter(CommunityAnswer.id == answer_id).first()
        if not answer:
            raise HTTPException(404, "回答不存在")
        if answer.user_id != user_id:
            raise HTTPException(403, "Only your own answers can be deleted")
        question_id = answer.question_id
        db.query(AnswerVote).filter(AnswerVote.answer_id == answer_id).delete()
        db.delete(answer)
        db.commit()
        answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == question_id).count()
        return {"success": True, "data": {"questionId": question_id, "answerCount": answer_count}}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
