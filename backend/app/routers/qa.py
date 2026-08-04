import re
import traceback
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


SYSTEM_PROMPT = (
    "你是职业培训系统里的智能问答助手。请优先根据提供的课程资料回答，回答要清晰、友好、可执行。"
    "回答必须使用普通聊天对话形式，不要使用 Markdown 格式。"
    "不要输出 # 标题、- 列表、* 列表、数字编号列表、**加粗**、```代码块```、Markdown 表格或引用符号。"
    "需要分层说明时，用自然中文短段落表达，例如“首先……其次……最后……”。"
    "如果确实需要提到命令或代码，只用普通文本简短写出，不要使用代码围栏。"
)


def clean_dialog_answer(answer: str) -> str:
    """Remove common Markdown marks while keeping readable conversation text."""
    text = answer.strip()
    if not text:
        return text

    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1（\2）", text)
    text = re.sub(r"^```[a-zA-Z0-9_-]*\s*$", "", text, flags=re.MULTILINE)
    text = text.replace("```", "")
    text = text.replace("**", "").replace("__", "").replace("~~", "")
    text = text.replace("`", "")

    cleaned_lines: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        line = re.sub(r"^\s{0,3}#{1,6}\s*", "", line)
        line = re.sub(r"^\s{0,3}>\s*", "", line)
        line = re.sub(r"^\s{0,3}(?:[-*+]\s+|[•·]\s*)", "", line)
        line = re.sub(r"^\s{0,3}\d+[.)、]\s+", "", line)
        if re.fullmatch(r"\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*", line):
            continue
        cleaned_lines.append(line.strip())

    normalized = "\n".join(cleaned_lines)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)
    return normalized.strip()


def build_local_fallback_answer(question: str, sources: list[dict]) -> str:
    if not sources:
        return (
            "当前大模型接口暂时不可用，而且当前课程还没有检索到可用的知识库内容。\n\n"
            "你可以稍后再试，或者先确认这个课程已经上传了知识库 PDF。"
        )

    paragraphs = ["当前大模型接口暂时不可用，我先根据本地知识库里检索到的资料，用普通对话方式帮你整理一下。"]
    for source in sources[:3]:
        content = re.sub(r"\s+", " ", source.get("content", "")).strip()
        if not content:
            continue
        chapter = source.get("metadata", {}).get("chapter") or "课程资料"
        snippet = content[:260] + ("..." if len(content) > 260 else "")
        paragraphs.append(f"我在“{chapter}”里找到一段相关内容：{snippet}")

    paragraphs.append(f"结合你的问题“{question}”，建议你先根据上面的课程资料理解核心概念。等大模型接口恢复后，你可以继续追问，我会再帮你做更完整的解释。")
    return "\n\n".join(paragraphs).strip()


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
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
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
        else:
            answer = clean_dialog_answer(answer)

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
