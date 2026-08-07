import json
import sqlite3
import sys
import uuid
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.services.pdf_importer import parse_question_bank_pdf

ZONGHE = "\u7efc\u5408\u9898\u5e93"
KECHENG = "\u8bfe\u7a0b\u77e5\u8bc6"
QB_MARK = "question_banks"
DI = chr(0x7b2c)
ZHANG = chr(0x7ae0)


def now_text() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def normalize_stem(value: str) -> str:
    chars = []
    for ch in str(value or ""):
        o = ord(ch)
        if ch.isalnum() or 0x4e00 <= o <= 0x9fff:
            chars.append(ch.lower())
    return "".join(chars)


def chapter_number(chapter: str | None) -> int | None:
    s = (chapter or "").strip()
    if s.startswith(DI):
        s = s[1:]
    idx = s.find(ZHANG)
    if idx <= 0:
        return None
    num = s[:idx].strip()
    return int(num) if num.isdigit() else None


def dice_similarity(a: str, b: str) -> float:
    ga = set()
    gb = set()
    for source, target in ((a, ga), (b, gb)):
        s = normalize_stem(source)
        for i in range(max(0, len(s) - 1)):
            target.add(s[i:i + 2])
    if not ga or not gb:
        return 0.0
    return 2.0 * len(ga & gb) / (len(ga) + len(gb))


def find_db_row(stem: str, db_by_norm: dict) -> sqlite3.Row | None:
    pn = normalize_stem(stem)
    if not pn:
        return None
    if pn in db_by_norm:
        return db_by_norm[pn][0]
    best = None
    best_len = 0
    for dn, rows in db_by_norm.items():
        if len(dn) < 8 or len(pn) < 8:
            continue
        if pn.startswith(dn) or dn.startswith(pn):
            if len(dn) > best_len:
                best = rows[0]
                best_len = len(dn)
    return best


def ensure_kp(conn: sqlite3.Connection, course_id: str, chapter: str) -> str:
    ch = (chapter or ZONGHE)[:100]
    row = conn.execute(
        "SELECT id FROM knowledge_points WHERE course_id=? AND chapter=? LIMIT 1",
        (course_id, ch),
    ).fetchone()
    if row:
        return row["id"]
    kp_id = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO knowledge_points (id, course_id, name, chapter, created_at) VALUES (?,?,?,?,?)",
        (kp_id, course_id, ch, ch, now_text()),
    )
    return kp_id

def primary_knowledge_material(conn: sqlite3.Connection, course_id: str) -> sqlite3.Row | None:
    course = conn.execute("SELECT name FROM courses WHERE id=?", (course_id,)).fetchone()
    if course is None:
        return None
    rows = conn.execute(
        "SELECT id, filename FROM course_materials WHERE course_id=? AND file_path NOT LIKE ?",
        (course_id, "%" + QB_MARK + "%"),
    ).fetchall()
    if not rows:
        return None
    return max(rows, key=lambda row: dice_similarity(course["name"], Path(row["filename"]).stem))




def process_course(conn: sqlite3.Connection, course: sqlite3.Row) -> tuple[int, int]:
    cid = course["id"]
    mats = conn.execute(
        "SELECT file_path FROM course_materials WHERE course_id=? AND file_path LIKE ?",
        (cid, "%" + QB_MARK + "%"),
    ).fetchall()
    if not mats:
        return 0, 0
    pdf_path = ROOT / mats[0]["file_path"]
    if not pdf_path.exists():
        print("missing pdf:", pdf_path)
        return 0, 0
    parsed = parse_question_bank_pdf(pdf_path)
    if not parsed:
        print("parsed 0 questions:", course["name"])
        return 0, 0

    kp_rows = conn.execute(
        "SELECT id, name, chapter FROM knowledge_points WHERE course_id=? AND COALESCE(chapter, '') NOT IN (?, ?)",
        (cid, ZONGHE, KECHENG),
    ).fetchall()
    numeric = [
        kp for kp in kp_rows
        if (kp["chapter"] or "").strip().split(".", 1)[0].isdigit()
    ]
    primary = primary_knowledge_material(conn, cid)
    if primary is not None:
        primary_chapters = {
            (row["chapter"] or "")
            for row in conn.execute(
                "SELECT DISTINCT chapter FROM doc_chunks WHERE material_id=?",
                (primary["id"],),
            ).fetchall()
        }
        matched_numeric = [
            kp for kp in numeric if (kp["chapter"] or "") in primary_chapters
        ]
        if matched_numeric:
            numeric = matched_numeric
    fallback_kps = numeric or kp_rows
    by_num: dict[int, list[sqlite3.Row]] = defaultdict(list)
    for kp in numeric:
        prefix = (kp["chapter"] or "").strip().split(".", 1)[0]
        by_num[int(prefix)].append(kp)

    q_rows = conn.execute(
        "SELECT q.id, q.stem, q.knowledge_point_id, q.type, q.options, q.answer, q.explanation "
        "FROM questions q JOIN knowledge_points kp ON kp.id = q.knowledge_point_id "
        "WHERE kp.course_id=? AND q.is_deleted='0'",
        (cid,),
    ).fetchall()
    db_by_norm: dict[str, list[sqlite3.Row]] = defaultdict(list)
    for q in q_rows:
        db_by_norm[normalize_stem(q["stem"])].append(q)

    assignments = []
    matched_ids = set()
    for item in parsed:
        n = chapter_number(item["chapter"])
        candidates = by_num.get(n) if n is not None else None
        if not candidates:
            candidates = fallback_kps
        if candidates:
            kp_id = max(
                candidates,
                key=lambda kp: dice_similarity(item["stem"], kp["chapter"] or kp["name"]),
            )["id"]
        else:
            kp_id = ensure_kp(conn, cid, item["chapter"])
        db_row = find_db_row(item["stem"], db_by_norm)
        if db_row is not None:
            matched_ids.add(db_row["id"])
        assignments.append({
            "item": item,
            "db": db_row,
            "kp_id": kp_id,
            "chapter_num": n,
        })

    groups: dict[int | None, list[dict]] = defaultdict(list)
    for assignment in assignments:
        groups[assignment["chapter_num"]].append(assignment)
    for n, items in groups.items():
        kps = by_num.get(n)
        if not kps or len(items) < len(kps):
            continue
        counts = Counter(item["kp_id"] for item in items)
        while True:
            empty = [kp for kp in kps if counts[kp["id"]] == 0]
            if not empty:
                break
            donors = [kp for kp in kps if counts[kp["id"]] > 1]
            if not donors:
                break
            donor = donors[0]
            target = empty[0]
            donor_items = [item for item in items if item["kp_id"] == donor["id"]]
            if not donor_items:
                break
            choice = max(
                donor_items,
                key=lambda item: dice_similarity(
                    item["item"]["stem"], target["chapter"] or target["name"]
                ),
            )
            choice["kp_id"] = target["id"]
            counts[donor["id"]] -= 1
            counts[target["id"]] += 1

    moved = 0
    created = 0
    for assignment in assignments:
        item = assignment["item"]
        kp_id = assignment["kp_id"]
        db_row = assignment["db"]
        if db_row is not None:
            conn.execute(
                "UPDATE questions SET knowledge_point_id=?, stem=? WHERE id=?",
                (kp_id, item["stem"], db_row["id"]),
            )
            moved += 1
        else:
            answer = json.dumps(item["answer"], ensure_ascii=False) if isinstance(item["answer"], list) else item["answer"]
            options = json.dumps(item["options"], ensure_ascii=False)
            conn.execute(
                "INSERT INTO questions (id, type, stem, options, answer, explanation, knowledge_point_id, is_deleted, created_at) "
                "VALUES (?,?,?,?,?,?,?,?,?)",
                (
                    str(uuid.uuid4()),
                    item["type"],
                    item["stem"],
                    options,
                    answer,
                    item["explanation"],
                    kp_id,
                    "0",
                    now_text(),
                ),
            )
            created += 1

    zonghe = conn.execute(
        "SELECT id FROM knowledge_points WHERE course_id=? AND name=? AND COALESCE(chapter, '')=? LIMIT 1",
        (cid, ZONGHE, ZONGHE),
    ).fetchone()
    zonghe_left = 0
    if zonghe is not None:
        zonghe_left = conn.execute(
            "SELECT COUNT(*) FROM questions WHERE knowledge_point_id=? AND is_deleted='0'",
            (zonghe["id"],),
        ).fetchone()[0]
        if zonghe_left == 0:
            conn.execute("DELETE FROM knowledge_points WHERE id=?", (zonghe["id"],))

    kp_counts = Counter(item["kp_id"] for item in assignments)
    empty_kps = [
        kp["chapter"]
        for kp in (numeric or kp_rows)
        if kp_counts.get(kp["id"], 0) == 0
    ]
    print("course:", course["name"])
    print("  parsed=%d moved=%d created=%d zonghe_left=%d" % (len(parsed), moved, created, zonghe_left))
    print("  empty_kps=%s" % (", ".join(str(v) for v in empty_kps[:10])))
    return moved, created


def main() -> int:
    conn = sqlite3.connect(str(ROOT / "training.db.runtime"), timeout=30)
    conn.row_factory = sqlite3.Row
    try:
        try:
            conn.execute("BEGIN IMMEDIATE")
        except sqlite3.OperationalError as exc:
            if "locked" in str(exc).lower():
                print("\u6570\u636e\u5e93\u88ab\u5176\u4ed6\u8fdb\u7a0b\u5360\u7528\uff0c\u8bf7\u5148\u505c\u6b62\u540e\u7aef\u670d\u52a1\u540e\u518d\u6267\u884c\u3002")
                return 2
            raise
        courses = conn.execute(
            "SELECT DISTINCT c.id, c.name FROM courses c "
            "JOIN course_materials m ON m.course_id = c.id "
            "WHERE m.file_path LIKE ? ORDER BY c.name",
            ("%" + QB_MARK + "%",),
        ).fetchall()
        if not courses:
            print("no course with question bank material")
            conn.commit()
            return 0
        total_moved = 0
        total_created = 0
        for course in courses:
            moved, created = process_course(conn, course)
            total_moved += moved
            total_created += created
        conn.commit()
        print("done moved=%d created=%d" % (total_moved, total_created))
        return 0
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    sys.exit(main())
