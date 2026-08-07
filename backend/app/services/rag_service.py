"""RAG service with local embeddings and SQLite cosine similarity search."""
from __future__ import annotations

import json
import os
import re
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
from sqlalchemy import text

from app.config import KNOWLEDGE_BASE_DIR
from app.database import SessionLocal

os.environ.setdefault("SENTENCE_TRANSFORMERS_HOME", r"D:/毕设2/models_cache")
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

from sentence_transformers import SentenceTransformer

_model = None

BUILTIN_KNOWLEDGE_FILES: list[tuple[str, tuple[str, ...]]] = [
("Python", ("程序员类", "python", "python_knowledge_base.md")),
("python", ("程序员类", "python", "python_knowledge_base.md")),
("Java", ("程序员类", "java", "Java_Knowledge_Base.md")),
("C语言", ("程序员类", "c语言", "C语言知识库.md")),
("SQL", ("程序员类", "sql", "SQL从入门到精通知识库.md")),
("前端", ("程序员类", "前端", "前端知识库.md")),
("ML", ("程序员类", "ai", "ML_Knowledge_Base.md")),
("机器学习", ("程序员类", "ai", "ML_Knowledge_Base.md")),
    ("养老", ("养老", "养老护理员知识库_从入门到精通.md")),
    ("税法", ("税法会计类", "税法知识库_从入门到精通.md")),
    ("会计", ("税法会计类", "税法知识库_从入门到精通.md")),
    ("营养", ("营养学", "营养学知识库_从入门到精通.md")),
]


def _resolve_builtin_knowledge_file(course_name: str | None) -> Path | None:
    name = (course_name or "").strip()
    if not name:
        return None
    for keyword, relative_path in BUILTIN_KNOWLEDGE_FILES:
        if keyword in name:
            path = KNOWLEDGE_BASE_DIR.joinpath(*relative_path)
            if path.exists():
                return path
    return None


def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(
            "paraphrase-multilingual-MiniLM-L12-v2",
            cache_folder=r"D:/毕设2/models_cache",
        )
    return _model


def cosine_similarity(a, b) -> float:
    a_np = np.array(a)
    b_np = np.array(b)
    denom = float(np.linalg.norm(a_np) * np.linalg.norm(b_np))
    if denom == 0:
        return 0.0
    return float(np.dot(a_np, b_np) / denom)


def _source_item(row: Any, score: float, retrieval_mode: str) -> dict:
    content = row[1] or ""
    score_value = round(float(score), 4)
    return {
        "chunkId": row[0],
        "chunk_id": row[0],
        "materialId": row[3],
        "material_id": row[3],
        "courseId": row[4],
        "course_id": row[4],
        "filename": row[5] or "课程资料",
        "chapter": row[2] or "",
        "page": row[7] or 1,
        "content": content,
        "chunk": content,
        "snippet": content[:240],
        "score": score_value,
        "distance": round(1.0 - score_value, 4),
        "retrievalMode": retrieval_mode,
        "metadata": {
            "chunk_id": row[0],
            "material_id": row[3],
            "course_id": row[4],
            "filename": row[5] or "课程资料",
            "chapter": row[2] or "",
            "page": row[7] or 1,
            "score": score_value,
            "retrieval_mode": retrieval_mode,
        },
    }


def _fetch_chunk_rows(course_id: str | None = None):
    db = SessionLocal()
    try:
        if course_id:
            rows = db.execute(
                text(
                    """
                    SELECT dc.id, dc.content, dc.chapter, dc.material_id, cm.course_id, cm.filename, dc.embedding, dc.page
                    FROM doc_chunks dc
                    LEFT JOIN course_materials cm ON cm.id = dc.material_id
                    WHERE (cm.course_id = :course_id OR dc.material_id = :course_id)
                      AND dc.embedding IS NOT NULL
                      AND dc.embedding != ''
                    """
                ),
                {"course_id": course_id},
            ).fetchall()
        else:
            rows = db.execute(
                text(
                    """
                    SELECT dc.id, dc.content, dc.chapter, dc.material_id, cm.course_id, cm.filename, dc.embedding, dc.page
                    FROM doc_chunks dc
                    LEFT JOIN course_materials cm ON cm.id = dc.material_id
                    WHERE dc.embedding IS NOT NULL AND dc.embedding != ''
                    """
                )
            ).fetchall()
        return rows
    finally:
        db.close()


def _extract_keywords(query: str) -> list[str]:
    keywords: list[str] = []
    for token in re.findall(r"[\u4e00-\u9fffA-Za-z0-9]{2,}", query):
        token = token.strip()
        if token and token not in keywords:
            keywords.append(token)
    if not keywords:
        fallback = query[:12].strip()
        if fallback:
            keywords.append(fallback)
    return keywords[:8]


def _split_markdown_blocks(markdown_text: str) -> list[dict]:
    lines = (markdown_text or "").replace("\r\n", "\n").replace("\r", "\n").splitlines()
    blocks: list[dict] = []
    current_title = "课程知识"
    buffer: list[str] = []
    start_line = 1

    def flush() -> None:
        nonlocal buffer, start_line
        content = "\n".join(line.rstrip() for line in buffer).strip()
        if len(content) >= 40:
            blocks.append({"chapter": current_title, "content": content[:1800], "page": start_line})
        buffer = []

    for line_number, raw_line in enumerate(lines, start=1):
        line = raw_line.strip()
        if not line:
            continue
        heading = None
        cleaned = line.lstrip("#").strip()
        if line.startswith("## ") and cleaned:
            heading = cleaned
        elif re.match(r"^\d+(?:\.\d+){0,3}\s+.+", line):
            heading = line
        elif re.match(r"^第[一二三四五六七八九十百千0-9]+[章节部分篇节].+", line):
            heading = line

        if heading:
            flush()
            current_title = heading[:100]
            start_line = line_number
            buffer = [line]
            continue

        if not buffer:
            start_line = line_number
        buffer.append(line)
        if sum(len(item) for item in buffer) >= 900:
            flush()
            start_line = line_number
    flush()
    return blocks


async def ensure_builtin_course_index(course_id: str | None) -> None:
    if not course_id:
        return

    db = SessionLocal()
    try:
        material_count = db.execute(
            text("SELECT COUNT(*) FROM course_materials WHERE course_id = :course_id"),
            {"course_id": course_id},
        ).scalar() or 0
        chunk_count = db.execute(
            text("SELECT COUNT(*) FROM doc_chunks dc JOIN course_materials cm ON cm.id = dc.material_id WHERE cm.course_id = :course_id"),
            {"course_id": course_id},
        ).scalar() or 0
        if material_count > 0 or chunk_count > 0:
            return

        course_row = db.execute(
            text("SELECT id, name FROM courses WHERE id = :course_id"),
            {"course_id": course_id},
        ).fetchone()
        if not course_row:
            return

        builtin_file = _resolve_builtin_knowledge_file(course_row[1])
        if not builtin_file:
            return

        material_row = db.execute(
            text(
                """
                SELECT id
                FROM course_materials
                WHERE course_id = :course_id AND file_path = :file_path
                LIMIT 1
                """
            ),
            {"course_id": course_id, "file_path": str(builtin_file)},
        ).fetchone()
        if material_row:
            material_id = material_row[0]
            db.execute(text("DELETE FROM doc_chunks WHERE material_id = :material_id"), {"material_id": material_id})
        else:
            material_id = str(uuid.uuid4())
            db.execute(
                text(
                    """
                    INSERT INTO course_materials (id, course_id, filename, file_path, upload_at)
                    VALUES (:id, :course_id, :filename, :file_path, :upload_at)
                    """
                ),
                {
                    "id": material_id,
                    "course_id": course_id,
                    "filename": builtin_file.name,
                    "file_path": str(builtin_file),
                    "upload_at": datetime.now(),
                },
            )

        chunks = _split_markdown_blocks(builtin_file.read_text(encoding="utf-8"))
        if not chunks:
            db.rollback()
            return

        for index, chunk in enumerate(chunks):
            embedding = await compute_embedding(chunk["content"])
            db.execute(
                text(
                    """
                    INSERT INTO doc_chunks (id, material_id, chunk_index, content, chapter, page, chroma_id, embedding)
                    VALUES (:id, :material_id, :chunk_index, :content, :chapter, :page, :chroma_id, :embedding)
                    """
                ),
                {
                    "id": str(uuid.uuid4()),
                    "material_id": material_id,
                    "chunk_index": index,
                    "content": chunk["content"],
                    "chapter": chunk["chapter"][:100],
                    "page": chunk.get("page") or 1,
                    "chroma_id": f"{material_id}:{index}",
                    "embedding": json.dumps(embedding, ensure_ascii=False) if embedding else "",
                },
            )

        db.commit()
    except Exception as exc:
        db.rollback()
        print(f"[RAG] builtin index failed: {exc}")
    finally:
        db.close()


async def search_similar(query, top_k=5, course_id=None):
    text_query = (query or "").strip()
    if not text_query:
        return []
    try:
        if course_id:
            await ensure_builtin_course_index(course_id)
        model = _get_model()
        query_emb = model.encode(text_query).tolist()
        rows = _fetch_chunk_rows(course_id)
        scored = []
        for row in rows:
            try:
                stored_emb = json.loads(row[6])
                if isinstance(stored_emb, list) and stored_emb:
                    score = cosine_similarity(query_emb, stored_emb)
                    scored.append(_source_item(row, score, "vector"))
            except Exception:
                continue
        scored.sort(key=lambda item: item["distance"])
        if scored:
            return scored[:top_k]
    except Exception as exc:
        print(f"[RAG] vector search failed: {exc}")
        import traceback

        traceback.print_exc()

    return await _search_fallback(text_query, top_k, course_id=course_id)


async def _search_fallback(query, top_k=5, course_id=None):
    text_query = (query or "").strip()
    if not text_query:
        return []

    keywords = _extract_keywords(text_query)
    if not keywords:
        return []

    db = SessionLocal()
    try:
        conditions = []
        params = {"lim": top_k}
        for index, keyword in enumerate(keywords):
            key = f"k{index}"
            conditions.append(f"dc.content LIKE :{key}")
            params[key] = f"%{keyword}%"

        keyword_sql = " OR ".join(conditions)
        course_clause = ""
        if course_id:
            course_clause = " AND (cm.course_id = :course_id OR dc.material_id = :course_id)"
            params["course_id"] = course_id

        rows = db.execute(
            text(
                f"""
                SELECT dc.id, dc.content, dc.chapter, dc.material_id, cm.course_id, cm.filename, dc.embedding, dc.page
                FROM doc_chunks dc
                LEFT JOIN course_materials cm ON cm.id = dc.material_id
                WHERE ({keyword_sql}){course_clause}
                """
            ),
            params,
        ).fetchall()

        scored = []
        lower_keywords = [keyword.lower() for keyword in keywords]
        for row in rows:
            content = (row[1] or "")
            lower_content = content.lower()
            hit_count = sum(1 for keyword in lower_keywords if keyword in lower_content)
            if not hit_count:
                continue
            score = min(0.95, 0.45 + hit_count / max(len(lower_keywords), 1) * 0.45)
            item = _source_item(row, score, "keyword")
            item["keywordHits"] = hit_count
            scored.append(item)

        scored.sort(key=lambda item: (-item.get("keywordHits", 0), -item["score"], len(item["content"])))
        return scored[:top_k]
    except Exception as exc:
        print(f"[RAG] fallback search failed: {exc}")
        return []
    finally:
        db.close()


async def delete_document_chunks(material_id):
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM doc_chunks WHERE material_id = :mid"), {"mid": material_id})
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False
    finally:
        db.close()


async def compute_embedding(text_content):
    if not text_content or not text_content.strip():
        return None
    try:
        model = _get_model()
        return model.encode(text_content[:2000]).tolist()
    except Exception as exc:
        print(f"[Embedding] failed: {exc}")
        return None


def get_course_rag_status(course_id: str) -> dict:
    db = SessionLocal()
    try:
        row = db.execute(
            text(
                """
                SELECT
                  COUNT(DISTINCT cm.id) AS material_count,
                  COUNT(dc.id) AS chunk_count,
                  SUM(CASE WHEN dc.embedding IS NOT NULL AND dc.embedding != '' THEN 1 ELSE 0 END) AS embedding_success,
                  MAX(cm.upload_at) AS latest_upload
                FROM course_materials cm
                LEFT JOIN doc_chunks dc ON dc.material_id = cm.id
                WHERE cm.course_id = :course_id
                """
            ),
            {"course_id": course_id},
        ).fetchone()
        point_count = (
            db.execute(text("SELECT COUNT(*) FROM knowledge_points WHERE course_id = :course_id"), {"course_id": course_id}).scalar()
            or 0
        )
        question_count = (
            db.execute(
                text(
                    """
                    SELECT COUNT(q.id)
                    FROM questions q
                    JOIN knowledge_points kp ON kp.id = q.knowledge_point_id
                    WHERE kp.course_id = :course_id AND q.is_deleted = '0'
                    """
                ),
                {"course_id": course_id},
            ).scalar()
            or 0
        )

        material_count = row[0] or 0
        chunk_count = row[1] or 0
        embedding_success = row[2] or 0

        if material_count == 0:
            status = "empty"
            status_text = "未上传知识库"
        elif chunk_count == 0:
            status = "parsed"
            status_text = "已上传，尚未生成切片"
        elif embedding_success < chunk_count:
            status = "partial"
            status_text = "部分向量化"
        else:
            status = "indexed"
            status_text = "已向量化"

        latest_upload = row[3].isoformat() if hasattr(row[3], "isoformat") else (str(row[3]) if row[3] else "")
        return {
            "courseId": course_id,
            "status": status,
            "statusText": status_text,
            "materialCount": material_count,
            "chunkCount": chunk_count,
            "knowledgePointCount": point_count,
            "questionCount": question_count,
            "embeddingSuccess": embedding_success,
            "latestUpload": latest_upload,
        }
    finally:
        db.close()


async def reindex_course_embeddings(course_id: str) -> dict:
    db = SessionLocal()
    try:
        rows = db.execute(
            text(
                """
                SELECT dc.id, dc.content
                FROM doc_chunks dc
                JOIN course_materials cm ON cm.id = dc.material_id
                WHERE cm.course_id = :course_id
                """
            ),
            {"course_id": course_id},
        ).fetchall()
        success = 0
        for chunk_id, content in rows:
            embedding = await compute_embedding(content)
            if embedding:
                db.execute(
                    text("UPDATE doc_chunks SET embedding = :embedding WHERE id = :chunk_id"),
                    {"embedding": json.dumps(embedding, ensure_ascii=False), "chunk_id": chunk_id},
                )
                success += 1
            else:
                db.execute(text("UPDATE doc_chunks SET embedding = '' WHERE id = :chunk_id"), {"chunk_id": chunk_id})
        db.commit()
        return {
            "chunks": len(rows),
            "embeddingSuccess": success,
            "indexedAt": datetime.now().isoformat(),
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
