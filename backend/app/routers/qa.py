from __future__ import annotations

import json
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
    "如果资料不够，再给出保守、明确的补充说明。"
    "不要输出 Markdown 标题、列表、表格、代码围栏或引用符号。"
    "需要分层说明时，用自然中文短段落表达，例如“首先……其次……最后……”。"
    "如果必须提到命令或代码，只用普通文本简短写出，不要使用代码块。"
)


def clean_dialog_answer(answer: str) -> str:
    text = answer.strip()
    if not text:
        return text

    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1（\2）", text)
    text = re.sub(r"^```[a-zA-Z0-9_-]*\s*$", "", text, flags=re.MULTILINE)
    text = text.replace("```", "")
    text = text.replace("**", "").replace("__", "").replace("~~", "").replace("`", "")

    cleaned_lines: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        line = re.sub(r"^\s{0,3}#{1,6}\s*", "", line)
        line = re.sub(r"^\s{0,3}>\s*", "", line)
        line = re.sub(r"^\s{0,3}(?:[-*+]\s+|[•·]\s+)", "", line)
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
            "当前模型接口暂时不可用，而且这门课程还没有检索到可用的知识库内容。"
            "建议先上传课程 PDF 知识库，再重新提问。"
        )

    paragraphs = ["当前模型接口暂时不可用，我先根据本地知识库帮你整理一下。"]
    for source in sources[:3]:
        content = re.sub(r"\s+", " ", source.get("snippet") or source.get("content", "")).strip()
        if not content:
            continue
        chapter = source.get("chapter") or "课程资料"
        filename = source.get("filename") or "课程资料"
        page = source.get("page") or 1
        snippet = content[:260] + ("..." if len(content) > 260 else "")
        paragraphs.append(f"我在《{filename}》的“{chapter}”第 {page} 页找到一段相关内容：{snippet}")

    paragraphs.append(f"结合你的问题“{question}”，建议你先对照上面的课程资料理解核心概念，再继续追问更细的点。")
    return "\n\n".join(paragraphs).strip()


def _serialize_sources(sources: list[dict]) -> list[dict]:
    result: list[dict] = []
    for source in sources[:5]:
        result.append(
            {
                "chunkId": source.get("chunkId") or source.get("chunk_id") or "",
                "materialId": source.get("materialId") or source.get("material_id") or "",
                "courseId": source.get("courseId") or source.get("course_id") or "",
                "filename": source.get("filename") or "课程资料",
                "chapter": source.get("chapter") or "",
                "page": source.get("page") or 1,
                "content": source.get("content") or source.get("chunk") or "",
                "snippet": source.get("snippet") or (source.get("content") or "")[:240],
                "score": source.get("score") or 0,
                "retrievalMode": source.get("retrievalMode") or "vector",
            }
        )
    return result


def _build_rag_trace(question: str, course_id: str | None, sources: list[dict], answer: str) -> dict:
    used_context = bool(sources)
    retrieval_mode = sources[0].get("retrievalMode", "none") if sources else "none"
    if not used_context:
        retrieval_summary = "未检索到可用知识库片段"
        hit_summary = "当前回答未使用课程知识库"
    elif retrieval_mode == "keyword":
        retrieval_summary = f"关键词兜底检索命中 {len(sources)} 个片段"
        hit_summary = "已按关键词从知识库中找到相关段落"
    else:
        retrieval_summary = f"向量检索命中 {len(sources)} 个片段"
        hit_summary = "已按语义相似度从知识库中找到相关段落"

    top_hit_lines = []
    for source in sources[:3]:
        chapter = source.get("chapter") or "课程资料"
        filename = source.get("filename") or "课程资料"
        page = source.get("page") or 1
        snippet = re.sub(r"\s+", " ", source.get("snippet") or source.get("content") or "").strip()
        if snippet:
            top_hit_lines.append(f"《{filename}》{chapter} 第 {page} 页：{snippet[:140]}")

    return {
        "question": question,
        "courseId": course_id or "",
        "usedContext": used_context,
        "retrievalMode": retrieval_mode,
        "sourceCount": len(sources),
        "steps": [
            {"title": "提问", "detail": question},
            {"title": "检索", "detail": retrieval_summary},
            {"title": "命中片段", "detail": "\n".join(top_hit_lines) if top_hit_lines else hit_summary},
            {
                "title": "生成回答",
                "detail": "已结合知识库片段生成回答" if used_context else "未命中知识库，已切换为通用回答",
            },
        ],
        "topSources": _serialize_sources(sources[:3]),
        "answerPreview": answer[:160],
    }


@router.post("/ask")
async def ask(req: AskReq, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(401)

    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="请输入问题")

    db = SessionLocal()
    session = None
    try:
        session = QASession(user_id=user_id, course_id=req.courseId or None, title=question[:50])
        db.add(session)
        db.commit()
        db.refresh(session)

        db.add(QAMessage(session_id=session.id, role="user", content=question))
        db.commit()

        try:
            raw_sources = await search_similar(question, course_id=req.courseId)
        except Exception as exc:
            print(f"[QA] RAG search failed: {exc}")
            traceback.print_exc()
            raw_sources = []

        sources = _serialize_sources(raw_sources)
        context_text = "\n".join(source["content"] for source in sources[:3] if source.get("content"))
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

        rag_trace = _build_rag_trace(question, req.courseId, sources, answer)
        db.add(
            QAMessage(
                session_id=session.id,
                role="assistant",
                content=answer,
                sources=json.dumps({"sources": sources, "ragTrace": rag_trace}, ensure_ascii=False),
            )
        )
        db.commit()

        return {
            "answer": answer,
            "sources": sources,
            "ragTrace": rag_trace,
            "usedContext": rag_trace["usedContext"],
            "retrievalMode": rag_trace["retrievalMode"],
            "sessionId": session.id,
        }
    except Exception as exc:
        print(f"[QA] ask failed: {exc}")
        traceback.print_exc()
        db.rollback()
        return {
            "answer": "处理请求时发生错误，请稍后重试。",
            "sources": [],
            "ragTrace": _build_rag_trace(question, req.courseId, [], "处理请求时发生错误，请稍后重试。"),
            "usedContext": False,
            "retrievalMode": "none",
            "sessionId": session.id if session else "",
        }
    finally:
        db.close()
