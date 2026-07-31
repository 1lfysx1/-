"""BKT Knowledge Tracing"""
from app.database import SessionLocal
from app.models.question import UserKpMastery

def bkt_update(prior: float, is_correct: bool, p_learn=0.15, p_guess=0.15, p_slip=0.10) -> float:
    if is_correct:
        num = prior * (1 - p_slip)
        den = num + (1 - prior) * p_guess
    else:
        num = prior * p_slip
        den = num + (1 - prior) * (1 - p_guess)
    p_after = num / den if den > 0 else prior
    return p_after + (1 - p_after) * p_learn

def process_answer(user_id: str, kp_id: str, is_correct: bool) -> float:
    db = SessionLocal()
    try:
        rec = db.query(UserKpMastery).filter(UserKpMastery.user_id == user_id, UserKpMastery.kp_id == kp_id).first()
        if rec:
            prior = rec.mastery_prob
            rec.question_count += 1
            if is_correct: rec.correct_count += 1
        else:
            prior = 0.5
            rec = UserKpMastery(user_id=user_id, kp_id=kp_id, mastery_prob=prior, question_count=1, correct_count=1 if is_correct else 0)
            db.add(rec)
        rec.mastery_prob = round(bkt_update(prior, is_correct), 4)
        db.commit()
        return rec.mastery_prob
    except Exception as e:
        db.rollback()
        print(f"[BKT Error] {e}")
        return prior
    finally:
        db.close()
