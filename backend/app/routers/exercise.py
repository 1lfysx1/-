import json
import random
import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from app.database import SessionLocal
from app.config import KNOWLEDGE_BASE_DIR
from app.models.exam import ExperimentData
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
    courseId: str | None = None

class PretestSubmitReq(BaseModel):
    courseId: str
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


_MD_CHAPTER_HEADING = re.compile(r"^##\s+(.+?)\s*$")
_MD_SUB_HEADING = re.compile(r"^####\s+(.+?)\s*$")
_MD_FULL_QUESTION = re.compile(r"^\*\*(\d+)[.、]\s*(?:【([^】]+)】\s*)?(.+?)\*\*\s*(?:[（(]\s*[）)]\s*)?$")
_MD_SPLIT_QUESTION = re.compile(r"^\*\*(\d+)[.、]\s*(?:【([^】]+)】\s*)?\*\*\s*(.+?)\s*$")
_MD_OPTION = re.compile(r"^\s*(?:-\s+)?([A-D])[.、]\s*(.+?)\s*$", re.MULTILINE)
_MD_ANSWER = re.compile(r"(?:\*\*答案[：:]\s*\*\*|\*\*答案[：:])\s*([A-D]+|正确|错误|对|错|√|×|v|x|TRUE|FALSE)", re.IGNORECASE)
_MD_EXPLANATION = re.compile(r"(?:\*\*解析[：:]\s*\*\*|\*\*解析\*\*[：:])\s*(.+?)(?:\n\s*</details>|\Z)", re.DOTALL)
_MD_ANSWER_ENTRY = re.compile(r"^(\d+)[.、]\s*\*\*([^*]+)\*\*\s*[-—–:：]?\s*(.*)$")


def _md_normalize_group(title: str) -> str:
    title = re.sub(r"[（(].*?[）)]", "", title.strip())
    return title.strip().rstrip("答案").strip()


def _md_question_kind(group: str, hint: str) -> str | None:
    text = f"{group} {hint}"
    if "判断" in text:
        return "judge"
    if "多选" in text:
        return "multiple"
    if "选择" in text or "单选" in text:
        return "single"
    return None


def _apply_md_answer(question: dict, value: str, explanation: str) -> None:
    value_upper = value.strip().upper()
    if question["type"] == "judge":
        if value_upper in {"正确", "对", "√", "V", "TRUE"}:
            answer = "A"
        elif value_upper in {"错误", "错", "×", "X", "FALSE"}:
            answer = "B"
        else:
            return
        question["options"] = [{"key": "A", "text": "正确"}, {"key": "B", "text": "错误"}]
        question["answer"] = answer
    else:
        keys = re.findall(r"[A-D]", value_upper)
        if not keys:
            return
        question["answer"] = keys if question["type"] == "multiple" else keys[0]
    if explanation:
        question["explanation"] = re.sub(r"\s+", " ", explanation).strip()
    question["_answered"] = True


def _parse_knowledge_base_questions(filepath):
    if not filepath or not filepath.exists():
        return []
    lines = filepath.read_text(encoding="utf-8").splitlines()
    chapter_titles = [
        match.group(1).strip()
        for line in lines
        if (match := _MD_CHAPTER_HEADING.match(line))
    ]
    prefer_numbered = any(re.match(r"^\d+\s+", title) for title in chapter_titles)

    def is_usable_chapter(title: str) -> bool:
        return not (
            title == "目录"
            or title.startswith(("📖", "📝", "✅"))
            or title.startswith("附录")
            or "阶段" in title
        )

    questions = []
    pending = {}
    current_part = None
    current_chapter = None
    current_group = None
    index = 0
    while index < len(lines):
        line = lines[index]
        part_match = re.match(r"^#\s+(.+?)\s*$", line)
        if part_match:
            current_part = _part_number(part_match.group(1))
            index += 1
            continue

        chapter_match = _MD_CHAPTER_HEADING.match(line)
        if chapter_match:
            title = chapter_match.group(1).strip()
            if is_usable_chapter(title) and (not prefer_numbered or re.match(r"^\d+\s+", title)):
                current_chapter = title
            index += 1
            continue

        sub_match = _MD_SUB_HEADING.match(line)
        if sub_match:
            sub_title = sub_match.group(1).strip()
            if "答案" in sub_title:
                answer_group = _md_normalize_group(sub_title)
                entry_index = index + 1
                while entry_index < len(lines):
                    next_line = lines[entry_index].strip()
                    if not next_line:
                        entry_index += 1
                        continue
                    if (
                        re.match(r"^#{1,4}\s+", lines[entry_index])
                        or _MD_FULL_QUESTION.match(next_line)
                        or _MD_SPLIT_QUESTION.match(next_line)
                    ):
                        break
                    entry = _MD_ANSWER_ENTRY.match(next_line)
                    if entry:
                        question = pending.get((current_chapter, answer_group, int(entry.group(1))))
                        if question is not None:
                            _apply_md_answer(question, entry.group(2), entry.group(3))
                    entry_index += 1
                current_group = None
                index = entry_index
                continue
            current_group = _md_normalize_group(sub_title)
            index += 1
            continue

        question_match = _MD_FULL_QUESTION.match(line)
        if question_match is None:
            question_match = _MD_SPLIT_QUESTION.match(line)
        if question_match is None:
            index += 1
            continue

        number = int(question_match.group(1))
        hint = (question_match.group(2) or "").strip()
        stem = question_match.group(3).strip()
        block_start = index + 1
        block_end = block_start
        while block_end < len(lines):
            next_line = lines[block_end]
            if (
                re.match(r"^#{1,4}\s+", next_line)
                or _MD_FULL_QUESTION.match(next_line)
                or _MD_SPLIT_QUESTION.match(next_line)
            ):
                break
            block_end += 1
        block = "\n".join(lines[block_start:block_end])
        options = [
            {"key": key, "text": text.strip()}
            for key, text in _MD_OPTION.findall(block)
        ]
        question = {
            "part": current_part,
            "chapter": current_chapter,
            "type": _md_question_kind(current_group or "", hint) or "single",
            "stem": stem,
            "options": options,
            "answer": None,
            "explanation": "",
            "_answered": False,
        }
        questions.append(question)
        inline_answer = _MD_ANSWER.search(block)
        if inline_answer:
            explanation_match = _MD_EXPLANATION.search(block)
            explanation = re.sub(r"\s+", " ", explanation_match.group(1)).strip() if explanation_match else ""
            _apply_md_answer(question, inline_answer.group(1), explanation)
        else:
            group = _md_normalize_group(current_group or "") or _md_normalize_group(hint or "")
            pending[(current_chapter, group, number)] = question
        index = block_end

    return [q for q in questions if q.get("_answered")]

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


def _serialize_question(qn: Question):
    opts = json.loads(qn.options) if qn.options else []
    ans = json.loads(qn.answer) if qn.type == "multiple" else qn.answer
    return {
        "id": qn.id,
        "type": qn.type,
        "stem": qn.stem,
        "options": opts,
        "answer": ans,
        "explanation": qn.explanation or "",
        "knowledgePointId": qn.knowledge_point_id or "",
    }


def _course_question_query(db, course_id: str):
    return (
        db.query(Question)
        .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
        .filter(
            KnowledgePoint.course_id == course_id,
            Question.is_deleted == "0",
        )
    )


def _get_course_questions(db, course_id: str, limit: int = 8):
    questions = _course_question_query(db, course_id).all()
    random.shuffle(questions)
    return questions[:limit]


def _score_answers(db, answers: list[AnswerItem], persist_records: bool, user_id: str):
    results = []
    for ans in answers:
        qn = db.query(Question).filter(Question.id == ans.questionId).first()
        if not qn:
            continue
        if qn.type == "multiple":
            expected = json.loads(qn.answer) if qn.answer else []
            submitted = ans.answer if isinstance(ans.answer, list) else [ans.answer]
            correct = sorted(submitted) == sorted(expected)
        else:
            expected = qn.answer
            submitted = ans.answer
            correct = str(submitted) == qn.answer
        if persist_records:
            exists = db.query(AnswerRecord).filter(AnswerRecord.user_id == user_id, AnswerRecord.question_id == ans.questionId).first()
            if not exists:
                db.add(AnswerRecord(user_id=user_id, question_id=ans.questionId, user_answer=str(ans.answer), is_correct="1" if correct else "0"))
                db.flush()
                if qn.knowledge_point_id:
                    process_answer(user_id, qn.knowledge_point_id, correct)
        results.append({
            "questionId": ans.questionId,
            "correct": correct,
            "userAnswer": ans.answer,
            "correctAnswer": json.loads(qn.answer) if qn.type == "multiple" else expected,
            "explanation": qn.explanation or "",
        })
    return results


def _upsert_experiment_pretest(db, user_id: str, course_id: str, score: int, total: int):
    percent = round(score / total * 100) if total else 0
    record = db.query(ExperimentData).filter(
        ExperimentData.user_id == user_id,
        ExperimentData.course_id == course_id,
    ).first()
    if not record:
        record = ExperimentData(user_id=user_id, course_id=course_id, pre_test_score=percent)
        db.add(record)
    record.pre_test_score = percent
    record.pre_test_total = total
    record.pre_test_correct = score
    return record


def _update_experiment_posttest(db, user_id: str, course_id: str | None, score: int, total: int):
    if not course_id or total <= 0:
        return
    percent = round(score / total * 100)
    record = db.query(ExperimentData).filter(
        ExperimentData.user_id == user_id,
        ExperimentData.course_id == course_id,
    ).first()
    if not record:
        record = ExperimentData(
            user_id=user_id,
            course_id=course_id,
            pre_test_score=0,
            pre_test_total=0,
            pre_test_correct=0,
        )
        db.add(record)
    record.post_test_score = percent
    record.post_test_total = total
    record.post_test_correct = score


@router.get("/pretest/status")
def get_pretest_status(course_id: str = Query(...), user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        record = db.query(ExperimentData).filter(
            ExperimentData.user_id == user_id,
            ExperimentData.course_id == course_id,
        ).first()
        question_count = _course_question_query(db, course_id).count()
        return {
            "success": True,
            "data": {
                "completed": bool(record and (record.pre_test_total or 0) > 0),
                "questionCount": question_count,
                "score": record.pre_test_score if record else None,
                "total": record.pre_test_total if record else 0,
                "correct": record.pre_test_correct if record else 0,
            },
        }
    finally:
        db.close()


@router.get("/pretest/questions")
def get_pretest_questions(course_id: str = Query(...), user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    db = SessionLocal()
    try:
        existing = db.query(ExperimentData).filter(
            ExperimentData.user_id == user_id,
            ExperimentData.course_id == course_id,
        ).first()
        if existing and (existing.pre_test_total or 0) > 0:
            return {"success": True, "data": []}
        questions = _get_course_questions(db, course_id, 8)
        return {"success": True, "data": [_serialize_question(qn) for qn in questions]}
    finally:
        db.close()


@router.post("/pretest/submit")
def submit_pretest(req: PretestSubmitReq, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)
    if not req.answers:
        raise HTTPException(status_code=400, detail="请先完成使用前问卷")
    db = SessionLocal()
    try:
        existing = db.query(ExperimentData).filter(
            ExperimentData.user_id == user_id,
            ExperimentData.course_id == req.courseId,
        ).first()
        if existing and (existing.pre_test_total or 0) > 0:
            return {
                "score": existing.pre_test_correct or 0,
                "total": existing.pre_test_total or 0,
                "percent": existing.pre_test_score or 0,
                "alreadyCompleted": True,
                "results": [],
            }
        results = _score_answers(db, req.answers, persist_records=False, user_id=user_id)
        score = sum(1 for item in results if item["correct"])
        total = len(results)
        record = _upsert_experiment_pretest(db, user_id, req.courseId, score, total)
        db.commit()
        return {
            "score": score,
            "total": total,
            "percent": record.pre_test_score,
            "alreadyCompleted": False,
            "results": results,
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(500, str(exc))
    finally:
        db.close()


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
        _update_experiment_posttest(db, user_id, req.courseId, score, len(results))
        db.commit()
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
