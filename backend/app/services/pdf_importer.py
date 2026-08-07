"""PDF import helpers for course knowledge bases and question banks."""
import json
import re
import uuid
from datetime import datetime
from dataclasses import dataclass
from pathlib import Path

import fitz
from sqlalchemy import text

from app.database import SessionLocal
from app.models.knowledge import CourseMaterial, DocChunk, KnowledgePoint
from app.models.position import Course
from app.models.question import Question
from app.services.rag_service import compute_embedding


@dataclass
class PageText:
    page: int
    text: str


def extract_pdf_pages(path: Path) -> list[PageText]:
    pages: list[PageText] = []
    with fitz.open(path) as doc:
        for index, page in enumerate(doc, start=1):
            text_content = page.get_text("text")
            cleaned = normalize_text(text_content)
            if cleaned:
                pages.append(PageText(page=index, text=cleaned))
    return pages


def normalize_text(text_content: str) -> str:
    text_content = text_content.replace("\r\n", "\n").replace("\r", "\n")
    text_content = re.sub(r"[ \t]+", " ", text_content)
    text_content = re.sub(r"\n{3,}", "\n\n", text_content)
    return text_content.strip()


def detect_heading(line: str) -> str | None:
    cleaned = line.strip(" #\t")
    if not cleaned or len(cleaned) > 80:
        return None
    patterns = (
        r"^第[一二三四五六七八九十百\d]+[章节部分篇]\s*[:：、.\-]?\s*.+",
        r"^\d+(?:\.\d+){0,3}\s+.+",
        r"^[一二三四五六七八九十]+[、.]\s*.+",
    )
    if any(re.match(pattern, cleaned) for pattern in patterns):
        return cleaned
    return None


def chunk_knowledge_pages(pages: list[PageText], max_chars: int = 900) -> list[dict]:
    chunks: list[dict] = []
    current_chapter = "课程知识"
    buffer: list[str] = []
    start_page = pages[0].page if pages else 1

    def flush() -> None:
        nonlocal buffer, start_page
        content = "\n".join(buffer).strip()
        if len(content) >= 30:
            chunks.append({"chapter": current_chapter, "content": content[:1800], "page": start_page})
        buffer = []

    for page in pages:
        for raw_line in page.text.splitlines():
            line = raw_line.strip()
            if not line:
                continue
            heading = detect_heading(line)
            if heading:
                flush()
                current_chapter = heading
                start_page = page.page
                buffer = [line]
                continue
            if not buffer:
                start_page = page.page
            buffer.append(line)
            if sum(len(item) for item in buffer) >= max_chars:
                flush()
                start_page = page.page
    flush()

    if not chunks and pages:
        for page in pages:
            text_content = page.text.strip()
            if text_content:
                chunks.append({"chapter": f"第{page.page}页", "content": text_content[:1800], "page": page.page})
    return chunks


def upsert_knowledge_points(db, course_id: str, chunks: list[dict]) -> int:
    chapter_names: list[str] = []
    for chunk in chunks:
        chapter = (chunk.get("chapter") or "课程知识")[:100]
        if chapter not in chapter_names:
            chapter_names.append(chapter)

    created = 0
    for chapter in chapter_names:
        existing = db.query(KnowledgePoint).filter(
            KnowledgePoint.course_id == course_id,
            KnowledgePoint.chapter == chapter,
        ).first()
        if not existing:
            db.add(KnowledgePoint(course_id=course_id, name=chapter, chapter=chapter))
            created += 1
    return created


async def index_knowledge_pdf(course_id: str, material: CourseMaterial, pdf_path: Path) -> dict:
    pages = extract_pdf_pages(pdf_path)
    chunks = chunk_knowledge_pages(pages)
    if not chunks:
        raise ValueError("PDF 中没有解析出可用文本")
    db = SessionLocal()
    try:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise ValueError("课程不存在")

        db.execute(text("DELETE FROM doc_chunks WHERE material_id = :mid"), {"mid": material.id})
        created_kps = upsert_knowledge_points(db, course_id, chunks)
        db.flush()

        indexed = 0
        embedding_success = 0
        for index, chunk in enumerate(chunks):
            content = chunk["content"]
            embedding = await compute_embedding(content)
            if embedding:
                embedding_success += 1
            db.add(DocChunk(
                id=str(uuid.uuid4()),
                material_id=material.id,
                chunk_index=index,
                content=content,
                chapter=chunk["chapter"][:100],
                page=chunk.get("page") or 1,
                chroma_id=f"{material.id}:{index}",
                embedding=json.dumps(embedding, ensure_ascii=False) if embedding else "",
            ))
            indexed += 1

        if indexed:
            course.chapter_count = max(course.chapter_count or 0, len({chunk["chapter"] for chunk in chunks}))
        db.commit()
        return {
            "pages": len(pages),
            "chunks": indexed,
            "knowledgePoints": created_kps,
            "embeddingSuccess": embedding_success,
            "indexedAt": datetime.now().isoformat(),
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def _clean_question_text(text_content: str) -> str:
    text_content = normalize_text(text_content)
    text_content = re.sub(r"([A-D])[.、]\s*", r"\n\1. ", text_content)
    text_content = re.sub(r"(答案|正确答案)[:：]\s*", r"\n答案：", text_content)
    text_content = re.sub(r"(Answer|Correct Answer)[:：]\s*", r"\n答案：", text_content, flags=re.IGNORECASE)
    text_content = re.sub(r"(解析|解释)[:：]\s*", r"\n解析：", text_content)
    text_content = re.sub(r"(Explanation|Analysis)[:：]\s*", r"\n解析：", text_content, flags=re.IGNORECASE)
    return text_content


_QUESTION_BANK_CHAPTER_PREFIX = re.compile(
    r"^(?:第[一二三四五六七八九十百\d]+[章节部分篇](?:\s*[:\uff1a、.\-]?\s*)|[一二三四五六七八九十]+[、.](?:\s*[:\uff1a、.\-]?\s*)|(?:\d+\.)+\d+(?:\s+|[:\uff1a、.\-]\s*))"
)


def _is_question_bank_chapter(line: str) -> bool:
    cleaned = line.strip()
    if not cleaned or len(cleaned) > 80:
        return False
    if "?" in cleaned or "？" in cleaned or "。" in cleaned or "．" in cleaned:
        return False
    if not _QUESTION_BANK_CHAPTER_PREFIX.match(cleaned):
        return False
    tail = _QUESTION_BANK_CHAPTER_PREFIX.sub("", cleaned)
    if re.match(r"^(选择|判断|填空|多选|单选|简答|问答|名词解释)", tail):
        return False
    return True


def parse_question_bank_text(text_content: str) -> list[dict]:
    text_content = _clean_question_text(text_content)
    question_start = re.compile(r"(?m)^\s*(?:\d+|[一二三四五六七八九十]+)[.、]\s*(?:【([^】]+)】)?\s*(.+?)\s*$")
    standalone_number = re.compile(
        "^(?:[0-9]+|[一二三四五六七八九十]+)[.\u3001]\\s*$"
    )
    lines = text_content.splitlines()
    parsed: list[dict] = []
    current_chapter = "综合题库"

    index = 0
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if _is_question_bank_chapter(line):
            current_chapter = line[:100]
            index += 1
            continue
        match = question_start.match(line)
        if not match and standalone_number.match(line) and index + 1 < len(lines):
            combined = f"{line} {lines[index + 1].strip()}"
            match = question_start.match(combined)
            if match:
                index += 1
        if not match:
            index += 1
            continue

        stem = match.group(2).strip()
        type_hint = (match.group(1) or "").strip()

        stem_parts = [stem]
        cursor = index + 1
        while cursor < len(lines):
            piece = lines[cursor].strip()
            if not piece:
                cursor += 1
                continue
            if re.match("^\\s*[A-D][.\u3001]\\s*", piece):
                break
            if re.match("^\\s*(?:\u7b54\u6848|\u6b63\u786e\u7b54\u6848)[:\uff1a]\\s*", piece):
                break
            if question_start.match(piece) or standalone_number.match(piece) or _is_question_bank_chapter(piece):
                break
            stem_parts.append(piece)
            cursor += 1
        stem = "".join(stem_parts).strip()[:500]
        block_end = index + 1
        while block_end < len(lines):
            next_line = lines[block_end].strip()
            if not next_line:
                block_end += 1
                continue
            if question_start.match(next_line) or standalone_number.match(next_line) or _is_question_bank_chapter(next_line):
                break
            block_end += 1
        block = "\n".join(lines[index + 1:block_end])

        options = [
            {"key": key.upper(), "text": value.strip()}
            for key, value in re.findall(r"(?m)^\s*([A-D])[.、]\s*(.+?)\s*$", block)
        ]
        answer_match = re.search(r"答案：\s*([A-D]+|正确|错误|对|错|√|×|TRUE|FALSE)", block, re.IGNORECASE)
        if not answer_match:
            index = block_end
            continue

        answer_text = answer_match.group(1).strip().upper()
        explanation_match = re.search(r"解析：\s*(.+?)(?:\n\s*(?:\d+|[一二三四五六七八九十]+)[.、]|\Z)", block, re.DOTALL)
        explanation = re.sub(r"\s+", " ", explanation_match.group(1)).strip() if explanation_match else ""

        is_judge = "判断" in type_hint or "JUDGE" in type_hint.upper() or (not options and answer_text in {"正确", "错误", "对", "错", "√", "×", "TRUE", "FALSE"})
        is_multiple = "多选" in type_hint or len(answer_text) > 1
        if is_judge:
            q_type = "judge"
            options = [{"key": "A", "text": "正确"}, {"key": "B", "text": "错误"}]
            answer = "A" if answer_text in {"正确", "对", "√", "TRUE"} else "B"
        elif is_multiple:
            q_type = "multiple"
            answer = list(answer_text)
        else:
            q_type = "single"
            answer = answer_text[0]

        if len(stem) < 4 or (q_type != "judge" and len(options) < 2):
            index = block_end
            continue

        parsed.append({
            "chapter": current_chapter,
            "type": q_type,
            "stem": stem[:500],
            "options": options,
            "answer": answer,
            "explanation": explanation[:1000],
        })
        index = block_end
    return parsed


def parse_question_bank_pdf(pdf_path: Path) -> list[dict]:
    pages = extract_pdf_pages(pdf_path)
    return parse_question_bank_text("\n".join(page.text for page in pages))


def _fallback_knowledge_point(db, course_id: str, chapter: str) -> KnowledgePoint:
    kp = db.query(KnowledgePoint).filter(
        KnowledgePoint.course_id == course_id,
        KnowledgePoint.chapter == chapter[:100],
    ).first()
    if kp:
        return kp
    kp = KnowledgePoint(course_id=course_id, name=chapter[:100], chapter=chapter[:100])
    db.add(kp)
    db.flush()
    return kp


def import_question_bank_pdf(course_id: str, pdf_path: Path) -> dict:
    questions = parse_question_bank_pdf(pdf_path)
    if not questions:
        raise ValueError("PDF 中没有解析出题目，请检查题目、选项、答案格式")
    db = SessionLocal()
    try:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise ValueError("课程不存在")
        imported = 0
        updated = 0
        for item in questions:
            kp = _fallback_knowledge_point(db, course_id, item["chapter"])
            answer = json.dumps(item["answer"], ensure_ascii=False) if isinstance(item["answer"], list) else item["answer"]
            options = json.dumps(item["options"], ensure_ascii=False)
            existing = db.query(Question).filter(
                Question.stem == item["stem"],
                Question.knowledge_point_id == kp.id,
            ).first()
            if existing:
                existing.type = item["type"]
                existing.options = options
                existing.answer = answer
                existing.explanation = item["explanation"]
                existing.is_deleted = "0"
                updated += 1
            else:
                db.add(Question(
                    type=item["type"],
                    stem=item["stem"],
                    options=options,
                    answer=answer,
                    explanation=item["explanation"],
                    knowledge_point_id=kp.id,
                    is_deleted="0",
                ))
                imported += 1
        db.commit()
        return {
            "questions": len(questions),
            "imported": imported,
            "updated": updated,
            "indexedAt": datetime.now().isoformat(),
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
