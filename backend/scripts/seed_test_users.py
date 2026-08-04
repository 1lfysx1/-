import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.database import Base, SessionLocal, engine
from app.init_db import ensure_experiment_columns
from app.models.exam import ExperimentData
from app.models.position import Course
from app.models.user import User
from app.utils.security import hash_password


PASSWORD = "123456wW@"


def main():
    Base.metadata.create_all(bind=engine)
    ensure_experiment_columns()

    db = SessionLocal()
    try:
        courses = db.query(Course).order_by(Course.created_at.asc()).all()
        if not courses:
            raise RuntimeError("没有可绑定的课程，请先在后台新增岗位和课程")

        rng = random.Random()
        created = 0
        updated = 0

        for index in range(1, 21):
            username = f"用户{index}"
            email = f"test_user_{index}_{rng.randint(10000, 99999)}@example.test"
            user = db.query(User).filter(User.username == username).first()
            if user:
                user.password_hash = hash_password(PASSWORD)
                user.role = "student"
                user.is_active = "1"
                if not user.email.endswith("@example.test"):
                    user.email = email
                updated += 1
            else:
                while db.query(User).filter(User.email == email).first():
                    email = f"test_user_{index}_{rng.randint(10000, 99999)}@example.test"
                user = User(
                    username=username,
                    email=email,
                    password_hash=hash_password(PASSWORD),
                    role="student",
                    is_active="1",
                )
                db.add(user)
                db.flush()
                created += 1

            course = courses[(index - 1) % len(courses)]
            pre_score = rng.randint(28, 45)
            improvement = rng.randint(20, 30)
            post_score = min(100, pre_score + improvement)

            record = db.query(ExperimentData).filter(
                ExperimentData.user_id == user.id,
                ExperimentData.course_id == course.id,
            ).first()
            if not record:
                record = ExperimentData(user_id=user.id, course_id=course.id, pre_test_score=pre_score)
                db.add(record)

            record.pre_test_score = pre_score
            record.pre_test_total = 100
            record.pre_test_correct = pre_score
            record.post_test_score = post_score
            record.post_test_total = 100
            record.post_test_correct = post_score

        db.commit()
        print(f"已生成测试用户：新增 {created} 个，更新 {updated} 个")
        print("用户名：用户1 到 用户20")
        print(f"统一密码：{PASSWORD}")
        print("成绩已写入 experiment_data，管理端成绩追踪会自动读取。")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
