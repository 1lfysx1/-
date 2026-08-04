import json
import random
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.database import Base, SessionLocal, engine
from app.init_db import ensure_experiment_columns
from app.models.exam import ExperimentData
from app.models.question import AnswerRecord, KnowledgePoint, Question
from app.models.user import User


TEST_USER_RE = re.compile(r"用户([1-9]|1[0-9]|20)$")


def ensure_course_questions(db, course_id: str) -> list[Question]:
    questions = (
        db.query(Question)
        .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
        .filter(KnowledgePoint.course_id == course_id, Question.is_deleted == "0")
        .limit(10)
        .all()
    )
    if len(questions) >= 10:
        return questions

    point = (
        db.query(KnowledgePoint)
        .filter(KnowledgePoint.course_id == course_id, KnowledgePoint.name == "测试练习知识点")
        .first()
    )
    if not point:
        point = KnowledgePoint(course_id=course_id, name="测试练习知识点", chapter="测试练习")
        db.add(point)
        db.flush()

    existing = db.query(Question).filter(Question.knowledge_point_id == point.id, Question.is_deleted == "0").all()
    needed = 10 - len(existing)
    for index in range(needed):
        number = len(existing) + index + 1
        db.add(Question(
            type="single",
            stem=f"测试练习题 {number}：关于当前课程的基础概念，哪一项理解更合理？",
            options=json.dumps([
                {"key": "A", "text": "先理解核心概念，再结合练习巩固"},
                {"key": "B", "text": "只记答案，不需要理解过程"},
                {"key": "C", "text": "完全跳过基础内容"},
                {"key": "D", "text": "遇到问题不做记录"},
            ], ensure_ascii=False),
            answer="A",
            explanation="测试题用于生成模拟练习记录，正确选项强调理解和练习结合。",
            knowledge_point_id=point.id,
            is_deleted="0",
        ))
    db.flush()
    return (
        db.query(Question)
        .join(KnowledgePoint, Question.knowledge_point_id == KnowledgePoint.id)
        .filter(KnowledgePoint.course_id == course_id, Question.is_deleted == "0")
        .limit(10)
        .all()
    )


def create_batch_records(db, user_id: str, questions: list[Question], target_score: int, answered_at: datetime) -> None:
    total = min(10, len(questions))
    correct_count = max(0, min(total, round(target_score / 100 * total)))
    selected = questions[:total]
    for index, question in enumerate(selected):
        is_correct = index < correct_count
        expected = question.answer
        wrong_answer = "B" if expected != "B" else "C"
        db.add(AnswerRecord(
            user_id=user_id,
            question_id=question.id,
            user_answer=expected if is_correct else wrong_answer,
            is_correct="1" if is_correct else "0",
            answered_at=answered_at,
        ))


def main():
    Base.metadata.create_all(bind=engine)
    ensure_experiment_columns()
    rng = random.Random()
    db = SessionLocal()
    try:
        users = [user for user in db.query(User).filter(User.username.like("用户%")).all() if TEST_USER_RE.fullmatch(user.username)]
        user_ids = [user.id for user in users]
        if not user_ids:
            raise RuntimeError("没有找到 用户1 到 用户20，请先运行 seed_test_users.py")

        db.query(AnswerRecord).filter(AnswerRecord.user_id.in_(user_ids)).delete(synchronize_session=False)
        experiments = (
            db.query(ExperimentData)
            .filter(ExperimentData.user_id.in_(user_ids), ExperimentData.course_id.isnot(None))
            .all()
        )
        created = 0
        now = datetime.now()
        for experiment in experiments:
            questions = ensure_course_questions(db, experiment.course_id)
            pre = experiment.pre_test_score or rng.randint(28, 45)
            post = experiment.post_test_score or min(100, pre + rng.randint(20, 30))
            middle = round((pre + post) / 2)
            scores = [pre, middle, post]
            for batch_index, score in enumerate(scores):
                create_batch_records(
                    db,
                    experiment.user_id,
                    questions,
                    score,
                    now - timedelta(days=2 - batch_index, minutes=rng.randint(0, 50)),
                )
                created += min(10, len(questions))
            experiment.post_test_score = post
            experiment.post_test_total = 100
            experiment.post_test_correct = post

        db.commit()
        print(f"practice_records_created={created}")
        print(f"test_users={len(user_ids)}")
        print("dashboard_practice_count_should_be_3_per_user")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
