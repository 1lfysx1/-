"""RAG Service - Local embedding-based vector search with SQLite cosine similarity"""
import os, json, numpy as np
from app.database import SessionLocal
from sqlalchemy import text

os.environ.setdefault("SENTENCE_TRANSFORMERS_HOME", "D:/毕设2/models_cache")
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

from sentence_transformers import SentenceTransformer

_model = None
def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2", cache_folder="D:/毕设2/models_cache")
    return _model

def cosine_similarity(a, b):
    a_np = np.array(a)
    b_np = np.array(b)
    denom = (np.linalg.norm(a_np) * np.linalg.norm(b_np))
    if denom == 0:
        return 0.0
    return float(np.dot(a_np, b_np) / denom)

async def search_similar(query, top_k=5, course_id=None):
    if not query or not query.strip():
        return []
    try:
        model = _get_model()
        query_emb = model.encode(query).tolist()
        db = SessionLocal()
        try:
            if course_id:
                rows = db.execute(text("""
                    SELECT dc.id, dc.content, dc.chapter, COALESCE(cm.course_id, dc.material_id), dc.embedding, dc.page
                    FROM doc_chunks dc
                    LEFT JOIN course_materials cm ON cm.id = dc.material_id
                    WHERE (cm.course_id = :course_id OR dc.material_id = :course_id)
                      AND dc.embedding IS NOT NULL
                      AND dc.embedding != ''
                """), {"course_id": course_id}).fetchall()
            else:
                rows = db.execute(text("SELECT id, content, chapter, material_id, embedding, page FROM doc_chunks WHERE embedding IS NOT NULL AND embedding != \"\"")).fetchall()
            if not rows:
                return []
            scored = []
            for r in rows:
                try:
                    stored_emb = json.loads(r[4])
                    if isinstance(stored_emb, list) and len(stored_emb) > 0:
                        dist = cosine_similarity(query_emb, stored_emb)
                        scored.append({"content": r[1], "metadata": {"course_id": r[3], "chapter": r[2], "page": r[5] or 1}, "distance": 1.0 - dist})
                except:
                    pass
            scored.sort(key=lambda x: x["distance"])
            return scored[:top_k]
        finally:
            db.close()
    except Exception as e:
        print(f"[RAG Error] vector search failed: {e}")
        import traceback; traceback.print_exc()
        return await _search_fallback(query, top_k, course_id=course_id)

async def _search_fallback(query, top_k=5, course_id=None):
    if not query or not query.strip():
        return []
    kws = [k.strip() for k in query.split() if len(k.strip()) > 1]
    if not kws:
        kws = [query[:10]]
    db = SessionLocal()
    try:
        conds, params = [], {}
        for i, kw in enumerate(kws[:5]):
            p = f"k{i}"
            conds.append(f"content LIKE :{p}")
            params[p] = f"%{kw}%"
        if not conds:
            return []
        if course_id:
            sql = """
                SELECT dc.id, dc.content, dc.chapter, COALESCE(cm.course_id, dc.material_id), dc.page
                FROM doc_chunks dc
                LEFT JOIN course_materials cm ON cm.id = dc.material_id
                WHERE (cm.course_id = :course_id OR dc.material_id = :course_id)
                  AND (
            """ + " OR ".join(f"dc.{condition}" for condition in conds) + ") ORDER BY LENGTH(dc.content) ASC LIMIT :lim"
            params["course_id"] = course_id
        else:
            sql = "SELECT id, content, chapter, material_id, page FROM doc_chunks WHERE " + " OR ".join(conds) + " ORDER BY LENGTH(content) ASC LIMIT :lim"
        params["lim"] = top_k
        rows = db.execute(text(sql), params).fetchall()
        return [{"content": r[1], "metadata": {"course_id": r[3], "chapter": r[2], "page": r[4] or 1}, "distance": 0.0} for r in rows]
    except Exception as e:
        print(f"[RAG Fallback Error] {e}")
        return []
    finally:
        db.close()

async def delete_document_chunks(material_id):
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM doc_chunks WHERE material_id = :mid"), {"mid": material_id})
        db.commit()
        return True
    except:
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
    except Exception as e:
        print(f"[Embedding Error] {e}")
        return None
