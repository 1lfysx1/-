import os, sys, re, uuid, asyncio
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
os.chdir("D:/毕设2/backend")
sys.path.insert(0, "D:/毕设2/backend")
from pathlib import Path
from sqlalchemy import text
from app.database import SessionLocal, get_chroma_collection
from app.services.rag_service import compute_embedding
from app.models.position import Course

KB_DIR = Path("D:/毕设2/知识库")
FILE_MAP = [
    ("程序员类/python_knowledge_base.md", "Python从入门到精通"),
    ("程序员类/Java_Knowledge_Base.md", "Java编程基础"),
    ("程序员类/C语言知识库.md", "C语言程序设计"),
    ("程序员类/SQL从入门到精通知识库.md", "SQL从入门到精通"),
    ("程序员类/前端知识库.md", "前端开发技术"),
    ("程序员类/ML_Knowledge_Base.md", "机器学习基础"),
    ("养老/养老护理员知识库_从入门到精通.md", "养老护理员知识库"),
    ("税法会计类/税法知识库_从入门到精通.md", "税法知识库"),
    ("营养学/营养学知识库_从入门到精通.md", "营养学知识库"),
]

def chunk_file(text_content, max_size=500):
    chunks = []
    lines = text_content.split("\n")
    current_chapter = "前言"
    current_chunk = ""
    for line in lines:
        h2 = re.match(r"^##\s+(.+?)\s*$", line)
        if h2:
            if current_chunk.strip():
                chunks.append({"chapter": current_chapter, "content": current_chunk.strip()})
            current_chapter = h2.group(1).strip()
            current_chunk = line + "\n"
        else:
            current_chunk += line + "\n"
            if len(current_chunk) > max_size and line.strip() == "":
                chunks.append({"chapter": current_chapter, "content": current_chunk.strip()})
                current_chunk = ""
    if current_chunk.strip():
        chunks.append({"chapter": current_chapter, "content": current_chunk.strip()})
    return [c for c in chunks if len(c["content"]) > 20]

async def index_all():
    print("=" * 60)
    print("Indexing knowledge bases to ChromaDB")
    print("=" * 60)
    
    db = SessionLocal()
    coll = get_chroma_collection()
    if coll is None:
        print("[ERROR] ChromaDB not available")
        db.close()
        return
    
    try:
        existing = coll.get()
        if existing["ids"]:
            print(f"Clearing {len(existing['ids'])} old documents...")
            coll.delete(existing["ids"])
    except:
        pass
    db.execute(text("DELETE FROM doc_chunks"))
    db.commit()
    
    total_chunks = 0
    errors = 0
    
    for rel_path, course_name in FILE_MAP:
        fp = KB_DIR / rel_path
        if not fp.exists():
            print(f"[SKIP] {rel_path}")
            continue
        
        course = db.query(Course).filter(Course.name == course_name).first()
        if not course:
            print(f"[SKIP] Course not found: {course_name}")
            continue
        
        text_content = fp.read_text(encoding="utf-8")
        chunks = chunk_file(text_content)
        print(f"\n{rel_path}: {len(chunks)} chunks")
        
        for ci, chunk in enumerate(chunks):
            content = chunk["content"][:1500]
            embedding = await compute_embedding(content)
            if not embedding:
                errors += 1
                if errors <= 3:
                    print(f"  [WARN] Chunk {ci}: embed failed")
                continue
            
            chunk_id = str(uuid.uuid4())
            chroma_id = f"{course.id}:{ci}"
            
            try:
                coll.add(
                    embeddings=[embedding],
                    documents=[content],
                    metadatas=[{"course_id": course.id, "course": course_name, "chapter": chunk["chapter"][:80], "chunk_index": ci}],
                    ids=[chroma_id]
                )
                db.execute(
                    text("INSERT INTO doc_chunks (id, material_id, chunk_index, content, chapter, chroma_id) VALUES (:id, :mid, :ci, :content, :chapter, :chroma_id)"),
                    {"id": chunk_id, "mid": course.id, "ci": ci, "content": content, "chapter": chunk["chapter"][:100], "chroma_id": chroma_id}
                )
                db.commit()
                total_chunks += 1
            except Exception as e:
                db.rollback()
                errors += 1
                if errors <= 3:
                    print(f"  [ERROR] Chunk {ci}: {str(e)[:80]}")
            
            if (ci + 1) % 10 == 0:
                print(f"  Progress: {ci+1}/{len(chunks)}")
        
        print(f"  Done: {len(chunks)} chunks indexed")
    
    db.close()
    print(f'\n{"="*60}')
    print("Indexing complete!")
    print(f"  Chunks indexed: {total_chunks}")
    print(f"  Errors: {errors}")
    print(f'{"="*60}')

asyncio.run(index_all())
