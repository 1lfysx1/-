import json
import random
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.database import Base, SessionLocal, engine
from app.init_db import ensure_community_columns
from app.models.community import AnswerVote, CommunityAnswer, CommunityQuestion, CommunityQuestionVote
from app.models.user import User
from app.utils.security import hash_password


PASSWORD = "123456wW@"


QUESTION_SPECS = [
    ("程序员", "Python虚拟环境已经创建了，但 VS Code 里还是识别不到解释器，这种情况一般先查哪里呀？"),
    ("程序员", "Nginx反向代理配置后访问502，我看日志有 upstream 错误，应该怎么排查比较稳？"),
    ("程序员", "Java项目启动时端口被占用，除了改端口，还有没有更规范的处理方法？"),
    ("程序员", "MySQL建索引后查询还是慢，是不是我索引建错了，怎么判断呀？"),
    ("程序员", "Git提交时不小心把配置文件加进去了，想保留本地但不上传，应该怎么处理？"),
    ("程序员", "Docker容器能启动但外部访问不到服务，我应该先看端口还是看网络配置？"),
    ("程序员", "FastAPI接口本地能通，前端请求却跨域失败，这个一般在哪里配置？"),
    ("程序员", "React页面状态更新后列表没刷新，是不是 useEffect 依赖写得不对？"),
    ("程序员", "TypeScript提示可能为 null，但我确定有值，这种情况要怎么写比较安全？"),
    ("程序员", "Linux里脚本手动执行正常，放到计划任务就失败，可能是什么原因呢？"),
    ("程序员", "Redis缓存更新后页面还是旧数据，是缓存穿透还是前端缓存的问题？"),
    ("程序员", "接口返回慢但数据库很快，这种情况后端还需要看哪些指标？"),
    ("程序员", "上传PDF后RAG检索不到内容，是切分、向量库还是文件解析的问题？"),
    ("养老护理", "给老人做晨间护理时，如果老人不太配合，怎么沟通会更合适呀？"),
    ("养老护理", "卧床老人翻身护理时，怎样判断皮肤受压风险比较高？"),
    ("养老护理", "给老人测血压前，需要注意哪些细节才不影响结果？"),
    ("养老护理", "老人吃饭容易呛咳，护理时要先调整姿势还是调整食物形态？"),
    ("养老护理", "认知障碍老人晚上总是反复起床，护理记录应该重点写什么？"),
    ("养老护理", "协助老人洗浴时，水温和防滑这两块怎么控制比较安全？"),
    ("养老护理", "老人服药后说头晕，护理员第一时间应该怎么处理？"),
    ("养老护理", "给老人做口腔护理时，假牙清洁有没有容易忽略的点？"),
    ("养老护理", "压疮早期只是发红，护理上是不是就要立刻干预？"),
    ("养老护理", "老人情绪低落不愿意参加活动，怎么引导不显得强迫？"),
    ("养老护理", "夜间巡视发现老人呼吸声音变重，应该先观察哪些表现？"),
    ("养老护理", "失能老人转移到轮椅时，腰部用力总觉得不安全，规范动作是什么？"),
    ("税法会计", "增值税进项税额不能抵扣的场景总记混，有没有好理解的方法？"),
    ("税法会计", "小规模纳税人和一般纳税人的申报差异，实际操作时先看什么？"),
    ("税法会计", "企业所得税汇算清缴时，业务招待费调整怎么避免算错？"),
    ("税法会计", "收到普通发票和专票，入账和抵扣处理上最关键的区别是什么？"),
    ("税法会计", "个税专项附加扣除资料不完整，会计处理时应该怎么提醒员工？"),
    ("税法会计", "固定资产折旧年限和税法最低年限不一致，纳税调整怎么理解？"),
    ("税法会计", "差旅费报销票据很多，审核时怎么判断哪些不能税前扣除？"),
    ("税法会计", "月末结账前发现一张费用发票跨期了，怎么处理比较规范？"),
    ("税法会计", "电子发票重复报销怎么防，系统和人工审核分别看什么？"),
    ("税法会计", "现金流量表的经营活动现金流，为什么和利润差很多呀？"),
    ("税法会计", "合同负债和预收账款在实务里怎么区分？"),
    ("税法会计", "印花税按次申报和按期申报，工作中怎么判断适用哪种？"),
    ("营养学", "高血压人群做饮食指导时，除了少盐还要提醒哪些点？"),
    ("营养学", "糖尿病患者说不吃主食血糖更稳，这种说法怎么纠正比较好？"),
    ("营养学", "老年人蛋白质摄入不足，怎样用日常食物补得更容易坚持？"),
    ("营养学", "减脂期间体重不降但围度变小，这算没有效果吗？"),
    ("营养学", "贫血人群补铁时，哪些食物搭配会影响吸收？"),
    ("营养学", "儿童挑食严重，营养评估时应该先看哪些指标？"),
    ("营养学", "痛风人群控制嘌呤时，豆制品是不是完全不能吃？"),
    ("营养学", "肠胃不舒服的人喝牛奶腹胀，是不是一定乳糖不耐受？"),
    ("营养学", "运动后到底要不要马上补充碳水和蛋白质？"),
    ("营养学", "孕期体重增长过快，饮食调整要怎么说才不吓人？"),
    ("营养学", "外卖党想吃得健康，点餐时最简单的判断标准是什么？"),
    ("营养学", "低脂食品是不是一定更适合减肥人群？"),
    ("营养学", "长期熬夜的人想改善饮食，应该先补维生素还是先调整三餐？"),
]


ANSWER_TEMPLATES = {
    "程序员": [
        "嗯，我之前也遇到过类似情况，我一般会先看日志和最小复现。先确认配置有没有真的生效，再看服务端口、权限和依赖版本，别一上来就大改代码。",
        "我补充一下哈，这类问题最好按链路排查：请求有没有进来，后端有没有处理，数据库或外部服务有没有报错。这样一步步拆开，就不容易被表象带偏。",
        "这个点我觉得可以先保守处理。先备份当前配置，再只改一个变量验证一次。如果改动太多，后面反而不好判断到底是哪一步起作用了。",
    ],
    "养老护理": [
        "我理解这个场景，实际护理里不要太急。可以先观察老人状态，再用简单温和的话解释要做什么，让老人有准备，配合度通常会好一些。",
        "嗯，这里安全是第一位的。动作前先确认环境、姿势和老人反应，过程中多询问感受，发现不舒服就停下来重新评估。",
        "我补充一点，护理记录也很重要。除了写做了什么，还要写老人当时的反应、异常表现和后续处理，这样交接班更清楚。",
    ],
    "税法会计": [
        "这个在实务里确实容易混。我一般会先看业务实质，再看票据和税法口径是否一致，不要只凭发票类型直接下结论。",
        "嗯，可以把它拆成三步：先判断业务发生了什么，再确认会计入账，最后看税务上是否需要调整。这样思路会清楚很多。",
        "我补充一下哈，遇到不确定的票据或申报口径，最好留好依据和沟通记录。后面复核或审计时，这些资料很有用。",
    ],
    "营养学": [
        "嗯，这个问题不能只看单一食物。建议先看人群状态、疾病限制和日常饮食结构，再决定怎么调整，效果会更稳。",
        "我之前学习时也容易绝对化理解，其实营养指导更强调长期可执行。可以先改最容易坚持的一两项，再慢慢优化。",
        "我补充一点，沟通时不要只说不能吃什么。最好给出替代方案，比如换成更合适的烹调方式、份量或搭配，用户更容易接受。",
    ],
}


def ensure_test_users(db):
    users = []
    for index in range(1, 21):
        username = f"用户{index}"
        user = db.query(User).filter(User.username == username).first()
        if not user:
            user = User(
                username=username,
                email=f"community_user_{index}_{random.randint(10000, 99999)}@example.test",
                password_hash=hash_password(PASSWORD),
                role="student",
                is_active="1",
            )
            db.add(user)
            db.flush()
        else:
            user.password_hash = hash_password(PASSWORD)
            user.role = "student"
            user.is_active = "1"
        users.append(user)
    return users


def score_answer(answer):
    content = answer.content or ""
    return (answer.like_count or 0) * 3 + min(len(content) // 35, 8) + (2 if "建议" in content or "注意" in content else 0)


def aggregate(question, answers):
    ranked = sorted(answers, key=score_answer, reverse=True)
    parts = [re.sub(r"\s+", " ", item.content).strip()[:110] for item in ranked[:3]]
    return f"我把大家的回答综合了一下：{parts[0]}；{parts[1]}；{parts[2]}。整体建议是先抓住核心条件，再按步骤验证，过程中注意安全、规范和记录，这样会更适合实际操作。"


def main():
    Base.metadata.create_all(bind=engine)
    ensure_community_columns()
    rng = random.Random()
    db = SessionLocal()
    try:
        users = ensure_test_users(db)
        created_questions = 0
        created_answers = 0
        now = datetime.now()

        for index, (category, title) in enumerate(QUESTION_SPECS, start=1):
            author = rng.choice(users)
            tags = [category, "专业问题", "测试数据"]
            question = db.query(CommunityQuestion).filter(CommunityQuestion.title == title).first()
            if not question:
                question = CommunityQuestion(
                    user_id=author.id,
                    title=title,
                    description=f"大家好呀，我在学习{category}相关内容时卡在这个问题上了，想听听大家在实操或复习时是怎么理解的。",
                    tags=json.dumps(tags, ensure_ascii=False),
                    author_name=author.username,
                    aggregate_status="pending",
                    created_at=now - timedelta(minutes=50 - index),
                )
                db.add(question)
                db.flush()
                created_questions += 1
            else:
                question.user_id = author.id
                question.author_name = author.username
                question.description = f"大家好呀，我在学习{category}相关内容时卡在这个问题上了，想听听大家在实操或复习时是怎么理解的。"
                question.tags = json.dumps(tags, ensure_ascii=False)
                db.query(AnswerVote).filter(
                    AnswerVote.answer_id.in_(
                        [item[0] for item in db.query(CommunityAnswer.id).filter(CommunityAnswer.question_id == question.id).all()]
                    )
                ).delete(synchronize_session=False)
                db.query(CommunityAnswer).filter(CommunityAnswer.question_id == question.id).delete(synchronize_session=False)
                db.query(CommunityQuestionVote).filter(CommunityQuestionVote.question_id == question.id).delete(synchronize_session=False)
                db.flush()

            answer_users = rng.sample([user for user in users if user.id != question.user_id], 3)
            answers = []
            for answer_index, answer_user in enumerate(answer_users):
                base = ANSWER_TEMPLATES[category][answer_index]
                content = f"{base} 结合你这个问题，我会先把关键条件列出来，再和教材或规范对一遍，最后再做实际验证。"
                answer = CommunityAnswer(
                    question_id=question.id,
                    user_id=answer_user.id,
                    content=content,
                    author_name=answer_user.username,
                    created_at=question.created_at + timedelta(minutes=answer_index + 1),
                )
                db.add(answer)
                db.flush()
                answers.append(answer)
                created_answers += 1

            for answer in answers:
                voters = rng.sample([user for user in users if user.id != answer.user_id], rng.randint(0, 4))
                for voter in voters:
                    db.add(AnswerVote(answer_id=answer.id, user_id=voter.id))
                answer.like_count = len(voters)

            question_voters = rng.sample([user for user in users if user.id != question.user_id], rng.randint(0, 5))
            for voter in question_voters:
                db.add(CommunityQuestionVote(question_id=question.id, user_id=voter.id))

            ranked = sorted(answers, key=score_answer, reverse=True)
            good_ids = {answer.id for answer in ranked[:2]}
            for answer in answers:
                answer.is_good = "1" if answer.id in good_ids else "0"
            question.aggregate_answer = aggregate(question, answers)
            question.aggregate_source = "fallback"
            question.aggregate_status = "ready"
            question.aggregate_updated_at = datetime.now()

        db.commit()
        print(f"community_demo questions={len(QUESTION_SPECS)} created_questions={created_questions} answers={created_answers}")
        print("test_users=用户1-用户20 password=123456wW@")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
