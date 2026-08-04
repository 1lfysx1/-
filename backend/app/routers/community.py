import json
import re
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database import SessionLocal
from app.models.community import AnswerVote, CommunityAnswer, CommunityQuestion, CommunityQuestionVote
from app.models.user import User
from app.services.deepseek_client import chat_completion
from app.utils.security import get_current_user_id

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


def _clean_plain_answer(answer: str) -> str:
    text = answer.strip()
    text = re.sub(r"^```[a-zA-Z0-9_-]*\s*$", "", text, flags=re.MULTILINE)
    text = text.replace("```", "").replace("**", "").replace("__", "").replace("`", "")
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        line = re.sub(r"^#{1,6}\s*", "", line)
        line = re.sub(r"^[-*+]\s+", "", line)
        line = re.sub(r"^\d+[.)、]\s+", "", line)
        if line:
            lines.append(line)
    return "\n\n".join(lines).strip()


def _question_keywords(question: CommunityQuestion) -> set[str]:
    text = f"{question.title} {question.description or ''} {' '.join(_safe_tags(question.tags))}"
    words = re.findall(r"[A-Za-z][A-Za-z0-9_+#.-]{2,}|[\u4e00-\u9fff]{2,}", text)
    stop_words = {"这个", "怎么", "如何", "问题", "请问", "一下", "时候", "需要", "可以"}
    return {word.lower() for word in words if word.lower() not in stop_words}


def _score_answer(answer: CommunityAnswer, keywords: set[str]) -> int:
    content = answer.content or ""
    normalized = content.lower()
    keyword_hits = sum(1 for keyword in keywords if keyword and keyword.lower() in normalized)
    length_score = min(len(content) // 40, 8)
    like_score = (answer.like_count or 0) * 3
    structure_score = 2 if any(mark in content for mark in ("建议", "注意", "因为", "所以", "步骤", "可以")) else 0
    return keyword_hits * 4 + length_score + like_score + structure_score


def _mark_good_answers(db, question: CommunityQuestion, answers: list[CommunityAnswer]) -> None:
    keywords = _question_keywords(question)
    ranked = sorted(answers, key=lambda item: (_score_answer(item, keywords), item.like_count or 0, len(item.content or "")), reverse=True)
    good_ids = {answer.id for answer in ranked[:2] if _score_answer(answer, keywords) > 0}
    for answer in answers:
        answer.is_good = "1" if answer.id in good_ids else "0"
    db.flush()


def _fallback_aggregate(question: CommunityQuestion, answers: list[CommunityAnswer]) -> str:
    keywords = _question_keywords(question)
    ranked = sorted(answers, key=lambda item: (_score_answer(item, keywords), item.like_count or 0, len(item.content or "")), reverse=True)
    selected = ranked[:3]
    snippets = []
    for answer in selected:
        content = re.sub(r"\s+", " ", answer.content or "").strip()
        if not content:
            continue
        snippets.append(content[:120] + ("..." if len(content) > 120 else ""))
    if not snippets:
        return ""
    joined = "；".join(snippets)
    return f"我把大家的回答综合了一下：{joined}。整体来看，可以先抓住问题里的关键条件，再按回答中提到的步骤逐项验证。这样处理会更稳，也方便后面继续补充。"


async def _build_llm_aggregate(question: CommunityQuestion, answers: list[CommunityAnswer]) -> tuple[str, str]:
    answer_text = "\n".join(
        f"{index + 1}. {answer.author_name or '学员'}：{answer.content}"
        for index, answer in enumerate(answers)
    )
    messages = [
        {
            "role": "system",
            "content": (
                "你是职业技能培训社区里的学习助教。请根据问题和学员回答，综合整理一段自然中文回答。"
                "不要使用 Markdown，不要写标题，不要编号列表，不要使用加粗或代码围栏。"
                "语气要像耐心同学帮忙总结，保留专业重点，也要提醒注意事项。"
                "回答控制在 180 到 280 字。"
            ),
        },
        {
            "role": "user",
            "content": (
                f"问题：{question.title}\n"
                f"补充描述：{question.description or '无'}\n"
                f"学员回答：\n{answer_text}"
            ),
        },
    ]
    answer = await chat_completion(messages)
    if not answer or answer.startswith("[Config Missing]"):
        return _fallback_aggregate(question, answers), "fallback"
    cleaned = _clean_plain_answer(answer)
    return cleaned or _fallback_aggregate(question, answers), "llm"


async def _aggregate_question_answers(db, question: CommunityQuestion) -> None:
    answers = (
        db.query(CommunityAnswer)
        .filter(CommunityAnswer.question_id == question.id)
        .order_by(CommunityAnswer.like_count.desc(), CommunityAnswer.created_at.asc())
        .all()
    )
    if len(answers) < 3:
        question.aggregate_status = "pending"
        db.flush()
        return

    question.aggregate_status = "generating"
    db.flush()
    try:
        _mark_good_answers(db, question, answers)
        content, source = await _build_llm_aggregate(question, answers)
        question.aggregate_answer = content
        question.aggregate_source = source
        question.aggregate_status = "ready" if content else "failed"
        question.aggregate_updated_at = datetime.now()
        db.flush()
    except Exception:
        question.aggregate_answer = _fallback_aggregate(question, answers)
        question.aggregate_source = "fallback"
        question.aggregate_status = "ready" if question.aggregate_answer else "failed"
        question.aggregate_updated_at = datetime.now()
        db.flush()


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
        "hasAggregateAnswer": question.aggregate_status == "ready" and bool(question.aggregate_answer),
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
            title=req.title.strip(),
            description=req.description.strip(),
            tags=json.dumps(req.tags, ensure_ascii=False),
            author_name=user.username if user else "",
            aggregate_status="pending",
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
            .order_by(CommunityAnswer.is_adopted.desc(), CommunityAnswer.is_good.desc(), CommunityAnswer.like_count.desc(), CommunityAnswer.created_at.asc())
            .all()
        )
        aggregate = None
        if question.aggregate_status == "ready" and question.aggregate_answer:
            aggregate = {
                "content": question.aggregate_answer,
                "source": question.aggregate_source or "fallback",
                "updatedAt": question.aggregate_updated_at.isoformat() if question.aggregate_updated_at else "",
            }
        return {
            "success": True,
            "data": {
                "question": _serialize_question(db, question, user_id),
                "answers": [_serialize_answer(db, answer, user_id) for answer in answers],
                "aggregateAnswer": aggregate,
                "aggregateStatus": question.aggregate_status or "pending",
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
async def create_answer(req: AnswerCreate, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    content = req.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="请输入回答内容")
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
            content=content,
            author_name=user.username if user else "",
        )
        db.add(answer)
        db.commit()
        db.refresh(answer)
        answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == req.questionId).count()
        if answer_count >= 3:
            await _aggregate_question_answers(db, question)
            db.commit()
        return {"success": True, "data": {"id": answer.id, "answerCount": answer_count}}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.post("/answers/{answer_id}/like")
async def toggle_answer_like(answer_id: str, user_id: str = Depends(get_current_user_id)):
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
        db.flush()
        question = db.query(CommunityQuestion).filter(CommunityQuestion.id == answer.question_id).first()
        if question:
            answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == question.id).count()
            if answer_count >= 3:
                await _aggregate_question_answers(db, question)
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
            raise HTTPException(403, "只能删除自己的回复")
        question_id = answer.question_id
        db.query(AnswerVote).filter(AnswerVote.answer_id == answer_id).delete()
        db.delete(answer)
        question = db.query(CommunityQuestion).filter(CommunityQuestion.id == question_id).first()
        if question:
            answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == question_id).count() - 1
            if answer_count < 3:
                question.aggregate_answer = None
                question.aggregate_source = None
                question.aggregate_status = "pending"
                question.aggregate_updated_at = None
        db.commit()
        answer_count = db.query(CommunityAnswer).filter(CommunityAnswer.question_id == question_id).count()
        return {"success": True, "data": {"questionId": question_id, "answerCount": answer_count}}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
