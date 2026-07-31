import traceback
import re
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database import SessionLocal
from app.models.qa import QAMessage, QASession
from app.services.deepseek_client import chat_completion
from app.services.rag_service import search_similar
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/qa", tags=["QA"])


class AskReq(BaseModel):
    question: str
    courseId: Optional[str] = None
    sessionId: Optional[str] = None

def build_local_fallback_answer(question: str, sources: list[dict]) -> str:
    if not sources:
        return (
            "当前大模型接口连接失败，且当前课程没有检索到可用知识库内容。\n\n"
            "你可以稍后重试，或先确认该课程已经上传知识库 PDF。"
        )

    lines = [
        "当前大模型接口连接失败，我先根据本地知识库检索结果给你整理如下：",
        "",
    ]
    for index, source in enumerate(sources[:3], start=1):
        content = re.sub(r"\s+", " ", source.get("content", "")).strip()
        if not content:
            continue
        chapter = source.get("metadata", {}).get("chapter") or "课程资料"
        lines.append(f"{index}. {chapter}")
        lines.append(content[:260] + ("..." if len(content) > 260 else ""))
        lines.append("")
    lines.append(f"你的问题：{question}")
    lines.append("以上内容来自本地知识库，等大模型接口恢复后可以继续追问，我会再进行更完整的解释。")
    return "\n".join(lines).strip()


@router.post("/ask")
async def ask(req: AskReq, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)

    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="请输入问题")

    db = SessionLocal()
    try:
        session = QASession(user_id=user_id, course_id=req.courseId or None, title=question[:50])
        db.add(session)
        db.commit()
        db.refresh(session)

        db.add(QAMessage(session_id=session.id, role="user", content=question))
        db.commit()

        try:
            sources = await search_similar(question, course_id=req.courseId)
        except Exception as exc:
            print(f"[QA] RAG search failed: {exc}")
            traceback.print_exc()
            sources = []

        context_text = "\n".join([source["content"] for source in sources[:3]])
        messages = [{"role": "system", "content": "你是职业培训系统的智能问答助手。请优先根据提供的课程资料回答，回答要清晰、友好、可执行。"}]
        if context_text:
            messages.append({"role": "user", "content": f"课程资料：\n{context_text}\n\n问题：{question}"})
        else:
            messages.append({"role": "user", "content": question})

        try:
            answer = await chat_completion(messages)
        except Exception as exc:
            print(f"[QA] LLM call failed: {exc}")
            traceback.print_exc()
            answer = None

        if not answer:
            answer = build_local_fallback_answer(question, sources)
        elif answer.startswith("[Config Missing]"):
            answer = "大模型接口尚未配置，请管理员检查 DEEPSEEK_API_KEY。"

        db.add(QAMessage(session_id=session.id, role="assistant", content=answer))
        db.commit()

        resp_sources = [
            {
                "chapter": source.get("metadata", {}).get("chapter") or "",
                "page": source.get("metadata", {}).get("page") or 1,
                "snippet": source["content"][:100],
                "chunkId": "",
            }
            for source in sources[:3]
        ]
        return {"answer": answer, "sources": resp_sources, "sessionId": session.id}
    except Exception as exc:
        print(f"[QA] ask failed: {exc}")
        traceback.print_exc()
        db.rollback()
        return {"answer": "处理请求时发生错误，请稍后重试。", "sources": [], "sessionId": ""}
    finally:
        db.close()
