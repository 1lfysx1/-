import os, sys
sys.path.insert(0, "D:/毕设2/backend")
os.chdir("D:/毕设2/backend")
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

from app.database import SessionLocal
from app.models.position import Position, Course
from app.models.knowledge import KnowledgePoint
from app.models.question import Question

db = SessionLocal()
try:
    # Delete old KPs, courses
    db.query(KnowledgePoint).delete()
    db.query(Course).delete()
    
    positions = {p.name: p for p in db.query(Position).all()}
    
    # Courses per position matching the actual knowledge base md files
    all_courses = {
        "程序员": [
            "Python从入门到精通", "Java编程基础", "C语言程序设计",
            "SQL从入门到精通", "前端开发技术", "机器学习基础",
        ],
        "养老护理员": ["养老护理员知识库"],
        "税法会计": ["税法知识库"],
        "营养学": ["营养学知识库"],
    }
    
    for pos_name, course_names in all_courses.items():
        pos = positions.get(pos_name)
        if not pos: continue
        for name in course_names:
            c = Course(position_id=pos.id, name=name, description=name, chapter_count=10)
            db.add(c); db.flush()
            for i in range(3):
                db.add(KnowledgePoint(course_id=c.id, name=name + "第" + str(i+1) + "部分",
                    chapter="第" + str(i+1) + "部分"))
    
    db.commit()
    print("Migrated:", sum(len(v) for v in all_courses.values()), "courses")
finally:
    db.close()