import re
from pathlib import Path

from fastapi import APIRouter

from app.config import KNOWLEDGE_BASE_DIR
from app.database import SessionLocal
from app.models.knowledge import CourseMaterial, DocChunk
from app.models.position import Course
from app.services.rag_service import ensure_builtin_course_index, get_course_rag_status

router = APIRouter(prefix="/api/learning", tags=["Learning"])

NAME_TO_FILE = [
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


def _clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _parse_sections(lines: list[str], chapter_title: str) -> list[dict]:
    section_matches = [
        (index, match.group(1).strip())
        for index, line in enumerate(lines)
        if (match := re.match(r"^###\s+(.+?)\s*$", line))
    ]
    if not section_matches:
        content = "\n".join(lines).strip()
        return [{"title": chapter_title, "content": content[:1200]}]

    sections = []
    for section_index, (start, title) in enumerate(section_matches):
        end = section_matches[section_index + 1][0] if section_index + 1 < len(section_matches) else len(lines)
        content = "\n".join(lines[start + 1:end]).strip()
        sections.append({"title": title, "content": content[:1200]})
    return sections


def parse_md_chapters(filepath: Path, course_id: str) -> list[dict]:
    if not filepath.exists():
        return []

    lines = filepath.read_text(encoding="utf-8").splitlines()
    chapter_matches = []
    seen_titles = set()
    for index, line in enumerate(lines):
        match = re.match(r"^##\s+(.+?)\s*$", line)
        if not match:
            continue
        title = match.group(1).strip()
        if (
            title == "目录"
            or title.startswith(("📖", "📝", "✅"))
            or title.startswith("附录")
            or "阶段" in title
            or title in seen_titles
        ):
            continue
        seen_titles.add(title)
        chapter_matches.append((index, title))

    # 部分知识库使用二级标题表示学习阶段、三级标题表示实际知识点。
    # 当没有可用二级章节时，回退到三级标题，保证知识库内容完整展示。
    if not chapter_matches:
        for index, line in enumerate(lines):
            match = re.match(r"^###\s+(.+?)\s*$", line)
            if not match:
                continue
            title = match.group(1).strip()
            if title.startswith(("📖", "💻", "📝", "✅")) or title in ("学习阶段建议", "推荐学习资源") or title in seen_titles:
                continue
            seen_titles.add(title)
            chapter_matches.append((index, title))

    chapters = []
    for chapter_index, (start, title) in enumerate(chapter_matches):
        end = chapter_matches[chapter_index + 1][0] if chapter_index + 1 < len(chapter_matches) else len(lines)
        body_lines = lines[start + 1:end]
        sections = _parse_sections(body_lines, title)
        description = next(
            (_clean_text(line) for line in body_lines if line.strip() and not line.lstrip().startswith(("#", "---"))),
            title,
        )
        chapters.append({
            "id": f"ch_{chapter_index + 1:03d}",
            "courseId": course_id,
            "name": title,
            "description": description[:160],
            "knowledgePointIds": [],
            "sections": sections,
            "duration": "约30分钟",
        })
    return chapters


def parse_uploaded_chapters(course_id: str) -> list[dict]:
    db = SessionLocal()
    try:
        rows = (
            db.query(DocChunk)
            .join(CourseMaterial, CourseMaterial.id == DocChunk.material_id)
            .filter(CourseMaterial.course_id == course_id)
            .order_by(DocChunk.chunk_index.asc())
            .all()
        )
        if not rows:
            return []
        grouped: dict[str, list[DocChunk]] = {}
        for chunk in rows:
            grouped.setdefault(chunk.chapter or "课程知识", []).append(chunk)
        chapters = []
        for index, (chapter, chunks) in enumerate(grouped.items(), start=1):
            sections = [
                {
                    "title": f"第{chunk.page or section_index}页",
                    "content": chunk.content[:1200],
                }
                for section_index, chunk in enumerate(chunks, start=1)
            ]
            chapters.append({
                "id": f"uploaded_ch_{index:03d}",
                "courseId": course_id,
                "name": chapter,
                "description": _clean_text(chunks[0].content)[:160] if chunks else chapter,
                "knowledgePointIds": [],
                "sections": sections,
                "duration": "约30分钟",
            })
        return chapters
    finally:
        db.close()


@router.get("/chapters")
def get_chapters(course_id: str | None = None, course_name: str | None = None):
    resolved_name = course_name or ""
    if course_id:
        uploaded = parse_uploaded_chapters(course_id)
        if uploaded:
            return {"success": True, "data": uploaded}
        db = SessionLocal()
        try:
            course = db.query(Course).filter(Course.id == course_id).first()
            if course:
                resolved_name = course.name
        finally:
            db.close()

    matched_file = next(
        (KNOWLEDGE_BASE_DIR.joinpath(*relative_path) for keyword, relative_path in NAME_TO_FILE if keyword in resolved_name),
        None,
    )
    if not matched_file:
        return {"success": True, "data": []}
    return {"success": True, "data": parse_md_chapters(matched_file, course_id or "")}


@router.get("/courses/{course_id}/rag-status")
async def get_course_rag_status_view(course_id: str):
    await ensure_builtin_course_index(course_id)
    return {"success": True, "data": get_course_rag_status(course_id)}
