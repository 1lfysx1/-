import json
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.database import Base, SessionLocal, engine
from app.init_db import ensure_experiment_columns
from app.models.exam import ExperimentData
from app.models.knowledge import KnowledgePoint
from app.models.position import Course
from app.models.question import AnswerRecord, Question
from app.models.user import User


def question_pool(db, course_id: str, limit: int, rng: random.Random) -> list[Question]:
    ids = [
        row[0]
        for row in db.query(Question.id)
        .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
        .filter(KnowledgePoint.course_id == course_id, Question.is_deleted == "0")
        .all()
    ]
    if not ids:
        return []
    if len(ids) > limit:
        ids = rng.sample(ids, limit)
    return db.query(Question).filter(Question.id.in_(ids)).all()


def wrong_answer(question: Question) -> str:
    try:
        parsed = json.loads(question.answer or "")
        if isinstance(parsed, list):
            fallback = ["A"] if "A" not in parsed else ["B"]
            return json.dumps(fallback, ensure_ascii=False)
    except Exception:
        pass
    expected = str(question.answer or "")
    return "B" if expected != "B" else "C"


def create_batch(
    db,
    user_id: str,
    questions: list[Question],
    target_score: int,
    answered_at: datetime,
) -> None:
    total = len(questions)
    if total == 0:
        return
    correct_count = max(0, min(total, round(total * target_score / 100)))
    for index, question in enumerate(questions):
        is_correct = index < correct_count
        user_answer = question.answer if is_correct else wrong_answer(question)
        db.add(AnswerRecord(
            user_id=user_id,
            question_id=question.id,
            user_answer=user_answer,
            is_correct="1" if is_correct else "0",
            answered_at=answered_at,
        ))


def main() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_experiment_columns()
    rng = random.Random()
    db = SessionLocal()
    try:
        courses = db.query(Course).order_by(Course.created_at.asc()).all()
        valid_course_ids = []
        for course in courses:
            count = (
                db.query(Question)
                .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
                .filter(KnowledgePoint.course_id == course.id, Question.is_deleted == "0")
                .count()
            )
            if count > 0:
                valid_course_ids.append(course.id)
        if not valid_course_ids:
            raise RuntimeError("no courses with questions available")

        students = (
            db.query(User)
            .filter(User.role == "student", User.is_active == "1")
            .order_by(User.created_at.asc())
            .all()
        )
        student_ids = {student.id for student in students}

        experiments = (
            db.query(ExperimentData)
            .filter(ExperimentData.user_id.in_(student_ids))
            .order_by(ExperimentData.created_at.asc())
            .all()
        )
        seen_user_ids = set()
        for experiment in experiments:
            seen_user_ids.add(experiment.user_id)
            if experiment.course_id not in valid_course_ids:
                experiment.course_id = rng.choice(valid_course_ids)

        for student in students:
            if student.id in seen_user_ids:
                continue
            experiment = ExperimentData(
                user_id=student.id,
                course_id=rng.choice(valid_course_ids),
                pre_test_score=rng.randint(30, 50),
            )
            db.add(experiment)
            experiments.append(experiment)

        db.flush()

        created_records = 0
        processed = 0
        now = datetime.now()
        for experiment in experiments:
            if experiment.course_id not in valid_course_ids:
                continue
            pre = experiment.pre_test_score or rng.randint(30, 50)
            post = experiment.post_test_score or min(100, pre + rng.randint(18, 30))
            pre = max(10, min(100, pre))
            post = max(pre, min(100, post))
            experiment.pre_test_score = pre
            experiment.post_test_score = post
            experiment.pre_test_total = 100
            experiment.pre_test_correct = pre
            experiment.post_test_total = 100
            experiment.post_test_correct = post
            experiment.updated_at = now
            processed += 1

            existing_count = (
                db.query(AnswerRecord)
                .join(Question, AnswerRecord.question_id == Question.id)
                .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
                .filter(
                    AnswerRecord.user_id == experiment.user_id,
                    KnowledgePoint.course_id == experiment.course_id,
                )
                .count()
            )
            if existing_count >= 10:
                continue

            questions = question_pool(db, experiment.course_id, 8, rng)
            if len(questions) < 3:
                continue
            batches = [
                (pre, now - timedelta(days=6, hours=rng.randint(0, 4))),
                (round((pre + post) / 2), now - timedelta(days=3, hours=rng.randint(0, 4))),
                (post, now - timedelta(hours=rng.randint(1, 12))),
            ]
            for score, answered_at in batches:
                create_batch(db, experiment.user_id, questions, score, answered_at)
                created_records += len(questions)

        db.commit()
        print(f"students={len(students)}")
        print(f"experiments_processed={processed}")
        print(f"answer_records_created={created_records}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
