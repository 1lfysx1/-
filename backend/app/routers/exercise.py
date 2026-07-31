import json
import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from app.database import SessionLocal
from app.config import KNOWLEDGE_BASE_DIR
from app.models.knowledge import CourseMaterial
from app.models.question import Question, AnswerRecord, KnowledgePoint, UserKpMastery
from app.models.position import Course
from app.utils.security import get_current_user_id
from app.services.knowledge_tracing import process_answer
from app.routers.learning import NAME_TO_FILE
from pydantic import BaseModel
from typing import Any

router = APIRouter(prefix="/api/exercise", tags=["Exercise"])

class AnswerItem(BaseModel):
    questionId: str
    answer: Any

class SubmitReq(BaseModel):
    answers: list[AnswerItem]

def _find_knowledge_base(course_name: str):
    return next(
        (KNOWLEDGE_BASE_DIR.joinpath(*relative_path) for keyword, relative_path in NAME_TO_FILE if keyword in course_name),
        None,
    )


def _has_uploaded_material(db, course_id: str) -> bool:
    return db.query(CourseMaterial).filter(CourseMaterial.course_id == course_id).count() > 0


def _part_number(title: str) -> int | None:
    numerals = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10}
    match = re.search(r"第([一二三四五六七八九十]+)部分", title)
    if not match:
        return None
    value = match.group(1)
    if value == "十":
        return 10
    if len(value) == 2 and value[0] == "十":
        return 10 + numerals[value[1]]
    if len(value) == 2 and value[1] == "十":
        return numerals[value[0]] * 10
    if len(value) == 2:
        return numerals[value[0]] * 10 + numerals[value[1]]
    return numerals.get(value)


def _parse_knowledge_base_points(filepath):
    if not filepath or not filepath.exists():
        return []
    points = []
    for line in filepath.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^##\s+(.+?)\s*$", line)
        if not match:
            continue
        title = match.group(1).strip()
        if title == "目录" or title.startswith(("📖", "📝", "✅")) or title.startswith("附录") or "阶段" in title:
            continue
        if title not in points:
            points.append(title)
    numbered_points = [point for point in points if re.match(r"^\d+\s+", point)]
    return numbered_points or points


def _parse_knowledge_base_questions(filepath):
    if not filepath or not filepath.exists():
        return []
    lines = filepath.read_text(encoding="utf-8").splitlines()
    questions = []
    current_part = None
    current_chapter = None
    index = 0
    while index < len(lines):
        part_match = re.match(r"^#\s+(.+?)\s*$", lines[index])
        if part_match:
            current_part = _part_number(part_match.group(1))
        chapter_match = re.match(r"^##\s+(.+?)\s*$", lines[index])
        if chapter_match and re.match(r"^\d+\s+", chapter_match.group(1).strip()):
            current_chapter = chapter_match.group(1).strip()
        question_match = re.match(r"^\*\*\d+[.、]\s*【([^】]+)】\s*(.+?)\*\*\s*$", lines[index])
        if not question_match:
            index += 1
            continue

        question_type = question_match.group(1)
        block_start = index + 1
        block_end = block_start
        while block_end < len(lines) and not re.match(r"^\*\*\d+[.、]\s*【", lines[block_end]):
            block_end += 1
        block = "\n".join(lines[block_start:block_end])
        options = [
            {"key": key, "text": text.strip()}
            for key, text in re.findall(r"^-\s+([A-D])\.\s*(.+?)\s*$", block, re.MULTILINE)
        ]
        answer_match = re.search(r"\*\*答案：\s*(.+?)\s*\*\*", block)
        if not answer_match:
            index = block_end
            continue
        answer_text = answer_match.group(1).strip()
        explanation_match = re.search(r"\*\*解析：\*\*\s*(.+?)(?:\n\s*</details>|\Z)", block, re.DOTALL)
        explanation = re.sub(r"\s+", " ", explanation_match.group(1)).strip() if explanation_match else ""
        if question_type == "判断题":
            options = [{"key": "A", "text": "正确"}, {"key": "B", "text": "错误"}]
            answer = "A" if answer_text == "正确" else "B" if answer_text == "错误" else answer_text
            normalized_type = "judge"
        else:
            answer_keys = re.findall(r"[A-D]", answer_text.upper())
            answer = answer_keys if question_type == "多选题" else (answer_keys[0] if answer_keys else answer_text)
            normalized_type = "multiple" if question_type == "多选题" else "single"
        questions.append({
            "part": current_part,
            "chapter": current_chapter,
            "type": normalized_type,
            "stem": question_match.group(2).strip(),
            "options": options,
            "answer": answer,
            "explanation": explanation,
        })
        for line in lines[block_start:block_end]:
            part_match = re.match(r"^#\s+(.+?)\s*$", line)
            if part_match:
                current_part = _part_number(part_match.group(1))
            chapter_match = re.match(r"^##\s+(.+?)\s*$", line)
            if chapter_match and re.match(r"^\d+\s+", chapter_match.group(1).strip()):
                current_chapter = chapter_match.group(1).strip()
        index = block_end
    return questions


def _sync_course_questions(db, course):
    filepath = _find_knowledge_base(course.name)
    parsed_questions = _parse_knowledge_base_questions(filepath)
    if not parsed_questions:
        return
    point_names = _parse_knowledge_base_points(filepath)
    knowledge_points = db.query(KnowledgePoint).filter(KnowledgePoint.course_id == course.id).all()
    knowledge_points.sort(key=lambda point: _part_number(point.chapter or point.name) or 999)
    for index, point_name in enumerate(point_names):
        if index < len(knowledge_points):
            point = knowledge_points[index]
            point.name = point_name
            point.chapter = point_name
        else:
            point = KnowledgePoint(course_id=course.id, name=point_name, chapter=point_name)
            db.add(point)
            knowledge_points.append(point)
    db.flush()
    course_point_ids = [point.id for point in knowledge_points]
    points_by_name = {point.name: point for point in knowledge_points}
    added = False
    for parsed in parsed_questions:
        knowledge_point = points_by_name.get(parsed["chapter"])
        if knowledge_point is None and parsed["part"] and parsed["part"] <= len(knowledge_points):
            knowledge_point = knowledge_points[parsed["part"] - 1]
        if knowledge_point is None:
            continue
        exists = db.query(Question).filter(
            Question.stem == parsed["stem"],
            Question.knowledge_point_id.in_(course_point_ids),
        ).first()
        answer = json.dumps(parsed["answer"], ensure_ascii=False) if isinstance(parsed["answer"], list) else parsed["answer"]
        if exists:
            exists.type = parsed["type"]
            exists.options = json.dumps(parsed["options"], ensure_ascii=False)
            exists.answer = answer
            exists.explanation = parsed["explanation"]
            exists.knowledge_point_id = knowledge_point.id
            exists.is_deleted = "0"
        else:
            db.add(Question(
                type=parsed["type"],
                stem=parsed["stem"],
                options=json.dumps(parsed["options"], ensure_ascii=False),
                answer=answer,
                explanation=parsed["explanation"],
                knowledge_point_id=knowledge_point.id,
                is_deleted="0",
            ))
        added = True
    if added:
        db.commit()


def _dynamic_question_id(course_id: str, index: int) -> str:
    return f"kbq:{course_id}:{index}"


def _dynamic_point_id(course_id: str, index: int) -> str:
    return f"kb:{course_id}:{index}"


def _dynamic_ids(kp_ids: list[str]) -> tuple[str, list[int]] | None:
    if not kp_ids or not all(item.startswith("kb:") for item in kp_ids):
        return None
    parts = [item.split(":") for item in kp_ids]
    if any(len(item) != 3 or not item[2].isdigit() for item in parts):
        return None
    course_ids = {item[1] for item in parts}
    if len(course_ids) != 1:
        return None
    return next(iter(course_ids)), [int(item[2]) for item in parts]


@router.get("/knowledge-points")
def get_knowledge_points(user_id: str = Depends(get_current_user_id), course_id: str = Query(None)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        course = db.query(Course).filter(Course.id == course_id).first() if course_id else None
        filepath = _find_knowledge_base(course.name) if course else None
        if course and filepath and not _has_uploaded_material(db, course.id):
            point_names = _parse_knowledge_base_points(filepath)
            parsed_questions = _parse_knowledge_base_questions(filepath)
            question_counts = {}
            for question in parsed_questions:
                question_counts[question["chapter"]] = question_counts.get(question["chapter"], 0) + 1
            
            # Fallback: check database for file-level KP questions
            db_question_count = 0
            if not parsed_questions:
                for fkp in db.query(KnowledgePoint).filter(KnowledgePoint.course_id == course.id).all():
                    cnt = db.query(Question).filter(
                        Question.knowledge_point_id == fkp.id,
                        Question.is_deleted == "0"
                    ).count()
                    if cnt > 0:
                        db_question_count = cnt
                        break
            
            return {
                "success": True,
                "data": [
                    {
                        "id": _dynamic_point_id(course.id, index),
                        "name": name,
                        "chapter": name,
                        "masteryProb": None,
                        "answeredQuestionCount": 0,
                        "availableQuestionCount": max(question_counts.get(name, 0), db_question_count),
                    }
                    for index, name in enumerate(point_names)
                ],
            }
        records = {
            record.kp_id: record
            for record in db.query(UserKpMastery).filter(UserKpMastery.user_id == user_id).all()
        }
        points_query = db.query(KnowledgePoint)
        if course_id:
            points_query = points_query.filter(KnowledgePoint.course_id == course_id)
        points = points_query.order_by(KnowledgePoint.created_at.asc()).all()
        question_counts = dict(
            db.query(Question.knowledge_point_id, func.count(Question.id))
            .filter(Question.is_deleted == "0", Question.knowledge_point_id.isnot(None))
            .group_by(Question.knowledge_point_id)
            .all()
        )
        result = []
        for point in points:
            record = records.get(point.id)
            result.append(
                {
                    "id": point.id,
                    "name": point.name,
                    "chapter": point.chapter or "",
                    "masteryProb": record.mastery_prob if record and record.question_count > 0 else None,
                    "answeredQuestionCount": record.question_count if record and record.question_count > 0 else 0,
                    "availableQuestionCount": question_counts.get(point.id, 0),
                }
            )
        return {"success": True, "data": result}
    finally:
        db.close()

@router.get("/questions")
def get_questions(user_id: str = Depends(get_current_user_id), kp_ids: str = Query(None)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        if kp_ids:
            ids = [x.strip() for x in kp_ids.split(",") if x.strip()]
            if ids:
                dynamic = _dynamic_ids(ids)
                if dynamic:
                    course_id, point_indexes = dynamic
                    course = db.query(Course).filter(Course.id == course_id).first()
                    filepath = _find_knowledge_base(course.name) if course else None
                    parsed_questions = _parse_knowledge_base_questions(filepath)
                    selected_names = {
                        name
                        for index, name in enumerate(_parse_knowledge_base_points(filepath))
                        if index in point_indexes
                    }
                    result = []
                    for index, parsed in enumerate(parsed_questions):
                        if parsed["chapter"] not in selected_names:
                            continue
                        result.append({
                            "id": _dynamic_question_id(course_id, index),
                            "type": parsed["type"],
                            "stem": parsed["stem"],
                            "options": parsed["options"],
                            "answer": parsed["answer"],
                            "explanation": parsed["explanation"],
                            "knowledgePointId": _dynamic_point_id(course_id, point_indexes[0]),
                        })
                    if result:
                        return {"success": True, "data": result[:20]}
                    # Fallback: dynamic parser didn't find questions
                    # Try database file-level KP for this course
                    course_obj = db.query(Course).filter(Course.id == course_id).first()
                    if course_obj:
                        # Find the file-level KP (not chapter-level)
                        file_kps = db.query(KnowledgePoint).filter(
                            KnowledgePoint.course_id == course_id
                        ).order_by(KnowledgePoint.created_at.asc()).all()
                        for fkp in file_kps:
                            fkp_qc = db.query(Question).filter(
                                Question.knowledge_point_id == fkp.id,
                                Question.is_deleted == "0"
                            ).count()
                            if fkp_qc > 0:
                                fallback_q = db.query(Question).filter(
                                    Question.knowledge_point_id == fkp.id,
                                    Question.is_deleted == "0"
                                ).limit(20).all()
                                fallback_result = []
                                for qn in fallback_q:
                                    opts = json.loads(qn.options) if qn.options else []
                                    ans = json.loads(qn.answer) if qn.type == "multiple" else qn.answer
                                    fallback_result.append({
                                        "id": qn.id,
                                        "type": qn.type,
                                        "stem": qn.stem,
                                        "options": opts,
                                        "answer": ans,
                                        "explanation": qn.explanation or "",
                                        "knowledgePointId": qn.knowledge_point_id or ""
                                    })
                                return {"success": True, "data": fallback_result}
                q = db.query(Question).filter(Question.is_deleted == "0")
                q = q.filter(Question.knowledge_point_id.in_(ids))
            else:
                q = db.query(Question).filter(Question.is_deleted == "0")
        else:
            q = db.query(Question).filter(Question.is_deleted == "0")
        questions = q.limit(20).all()
        result = []
        for qn in questions:
            opts = json.loads(qn.options) if qn.options else []
            ans = json.loads(qn.answer) if qn.type == "multiple" else qn.answer
            result.append({"id": qn.id, "type": qn.type, "stem": qn.stem, "options": opts, "answer": ans, "explanation": qn.explanation or "", "knowledgePointId": qn.knowledge_point_id or ""})
        return {"success": True, "data": result}
    finally:
        db.close()

@router.post("/submit")
def submit(req: SubmitReq, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        results = []
        for ans in req.answers:
            if ans.questionId.startswith("kbq:"):
                parts = ans.questionId.split(":")
                if len(parts) == 3 and parts[2].isdigit():
                    course = db.query(Course).filter(Course.id == parts[1]).first()
                    filepath = _find_knowledge_base(course.name) if course else None
                    parsed_questions = _parse_knowledge_base_questions(filepath)
                    index = int(parts[2])
                    if 0 <= index < len(parsed_questions):
                        parsed = parsed_questions[index]
                        expected = parsed["answer"]
                        submitted = ans.answer
                        correct = sorted(submitted) == sorted(expected) if isinstance(expected, list) and isinstance(submitted, list) else submitted == expected
                        stored = db.query(Question).filter(Question.stem == parsed["stem"], Question.is_deleted == "0").first()
                        if stored:
                            try:
                                exists = db.query(AnswerRecord).filter(
                                    AnswerRecord.user_id == user_id,
                                    AnswerRecord.question_id == stored.id,
                                ).first()
                                if not exists:
                                    db.add(AnswerRecord(
                                        user_id=user_id,
                                        question_id=stored.id,
                                        user_answer=str(submitted),
                                        is_correct="1" if correct else "0",
                                    ))
                                    db.commit()
                                    if stored.knowledge_point_id:
                                        process_answer(user_id, stored.knowledge_point_id, correct)
                            except Exception:
                                db.rollback()
                        results.append({
                            "questionId": ans.questionId,
                            "correct": correct,
                            "userAnswer": submitted,
                            "correctAnswer": expected,
                            "explanation": parsed["explanation"],
                        })
                        continue
            qn = db.query(Question).filter(Question.id == ans.questionId).first()
            if not qn:
                continue
            if qn.type == "multiple":
                expected = json.loads(qn.answer) if qn.answer else []
                submitted = ans.answer if isinstance(ans.answer, list) else [ans.answer]
                correct = sorted(submitted) == sorted(expected)
            else:
                correct = str(ans.answer) == qn.answer
            exists = db.query(AnswerRecord).filter(AnswerRecord.user_id == user_id, AnswerRecord.question_id == ans.questionId).first()
            if not exists:
                record = AnswerRecord(user_id=user_id, question_id=ans.questionId, user_answer=str(ans.answer), is_correct="1" if correct else "0")
                db.add(record)
                db.commit()
                if qn.knowledge_point_id:
                    process_answer(user_id, qn.knowledge_point_id, correct)
            # Check if AnswerRecord was already added
            correct = any(el.is_correct == "1" for el in db.query(AnswerRecord).filter(AnswerRecord.user_id == user_id, AnswerRecord.question_id == ans.questionId).all())
            results.append({
                "questionId": ans.questionId, "correct": correct,
                "userAnswer": ans.answer, "correctAnswer": json.loads(qn.answer) if qn.type == "multiple" else qn.answer,
                "explanation": qn.explanation or ""
            })
        score = sum(1 for r in results if r["correct"])
        return {"score": score, "total": len(results), "results": results}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, str(e))
    finally:
        db.close()

@router.get("/wrong-questions")
def get_wrong(course_id: str = Query(None), user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        query = db.query(AnswerRecord, Question, KnowledgePoint, Course).join(Question, AnswerRecord.question_id == Question.id).join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id).join(Course, KnowledgePoint.course_id == Course.id).filter(AnswerRecord.user_id == user_id, AnswerRecord.is_correct == "0")
        if course_id:
            query = query.filter(KnowledgePoint.course_id == course_id)
        records = query.order_by(AnswerRecord.answered_at.desc()).limit(50).all()
        result = []
        for rec, qn, kp, course in records:
            result.append({"id": rec.id, "stem": qn.stem, "userAnswer": rec.user_answer, "correctAnswer": json.loads(qn.answer) if qn.type == "multiple" else qn.answer, "explanation": qn.explanation or "", "knowledgePoint": kp.name if kp else "", "options": json.loads(qn.options) if qn.options else [], "courseName": course.name if course else "", "courseId": kp.course_id if kp else "", "wrongDate": rec.answered_at.isoformat() if rec.answered_at else ""})
        return {"success": True, "data": result}
    finally:
        db.close()

@router.delete("/wrong-questions/{record_id}")
def delete_wrong_question(record_id: str, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        record = db.query(AnswerRecord).filter(AnswerRecord.id == record_id, AnswerRecord.user_id == user_id).first()
        if not record:
            raise HTTPException(404, "记录不存在")
        db.delete(record)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, str(e))
    finally:
        db.close()
