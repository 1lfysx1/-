"""Database Initializer"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from datetime import datetime
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.database import engine, SessionLocal, Base
from app.models.user import User
from app.models.position import Position, Course
from app.models.knowledge import KnowledgePoint
from app.models.community import CommunityQuestion, CommunityAnswer
from app.models.feedback import Feedback
from app.models.exam import ExperimentData
from app.models.knowledge import KnowledgePoint
from app.models.community import CommunityQuestion, CommunityAnswer
from app.models.feedback import Feedback
from app.models.exam import ExperimentData
from app.utils.security import hash_password

def init_database():
    print("Initializing database...")
    # Tables kept - no drop on restart
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Data exists, skipping seed")
            return
        # Users
        users_data = [
            {"username": "\u5f20\u4e09", "email": "zhangsan@test.com", "password": hash_password("123456wW@"), "role": "student"},
            {"username": "\u674e\u56db", "email": "lisi@test.com", "password": hash_password("123456wW@"), "role": "student"},
            {"username": "\u718a\u5927", "email": "xiongda@test.com", "password": hash_password("123456wW@"), "role": "student"},
            {"username": "\u9ec4\u8001\u5e08", "email": "3126654939@qq.com", "password": hash_password("123456wW@"), "role": "admin"},
        ]
        users = {}
        for u in users_data:
            user = User(username=u["username"], email=u["email"], password_hash=u["password"], role=u["role"])
            db.add(user)
            db.flush()
            users[u["username"]] = user.id

        # Positions
        pos_names = [
            ("\u7a0b\u5e8f\u5458", "\u6db5\u76d6Python\u3001Java\u7b49\u8ba1\u7b97\u673a\u7f16\u7a0b\u5c97\u4f4d\u57f9\u8bad", "\U0001f4bb"),
            ("\u517b\u8001\u62a4\u7406\u5458", "\u517b\u8001\u62a4\u7406\u884c\u4e1a\u4e13\u4e1a\u77e5\u8bc6\u57f9\u8bad", "\U0001f3e5"),
            ("\u7a0e\u6cd5\u4f1a\u8ba1", "\u7a0e\u6cd5\u4e0e\u4f1a\u8ba1\u5b9e\u52a1\u77e5\u8bc6\u57f9\u8bad", "\U0001f4ca"),
            ("\u8425\u517b\u5b66", "\u8425\u517b\u5b66\u57fa\u7840\u77e5\u8bc6\u4e0e\u4e34\u5e8a\u5e94\u7528", "\U0001f957"),
        ]
        for pn, pd, pi in pos_names:
            pos = Position(name=pn, description=pd, icon=pi)
            db.add(pos); db.flush()
            course = Course(position_id=pos.id, name=pn + "\u57fa\u7840\u8bfe\u7a0b", chapter_count=10, description=pd)
            db.add(course)
            db.flush()

        # Knowledge points
        for i in range(5):
            default_course = db.query(Course).first()
            kp = KnowledgePoint(course_id=default_course.id, name=f"Chapter {i+1}", chapter=f"Ch{i+1}")
            db.add(kp)
        db.flush()

        # Experiment data
        for uid in users.values():
            db.add(ExperimentData(user_id=uid, pre_test_score=50, post_test_score=80))

        db.commit()
        print("Database initialized!")
        print("\nAccounts:")
        print("  \u5f20\u4e09 / 123456wW@ (student)")
        print("  \u9ec4\u8001\u5e08 / 123456wW@ (admin)")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
