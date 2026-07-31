import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.config import MAX_UPLOAD_SIZE_MB, UPLOAD_DIR
from app.database import SessionLocal
from app.models.knowledge import CourseMaterial
from app.services.pdf_importer import import_question_bank_pdf, index_knowledge_pdf
from app.utils.security import get_current_admin_id

router = APIRouter(prefix="/api/upload", tags=["Upload"])
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_SIZE = MAX_UPLOAD_SIZE_MB * 1024 * 1024


async def save_pdf_upload(file: UploadFile, folder: str) -> tuple[str, Path]:
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf") or file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="PDF files only")

    content = await file.read(MAX_UPLOAD_SIZE + 1)
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_UPLOAD_SIZE_MB} MB limit")
    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Invalid PDF file")

    target_dir = UPLOAD_DIR / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    saved_path = target_dir / f"{uuid.uuid4()}.pdf"
    saved_path.write_bytes(content)
    return os.path.basename(filename), saved_path


def create_material(course_id: str, filename: str, saved_path: Path) -> CourseMaterial:
    db = SessionLocal()
    try:
        material = CourseMaterial(course_id=course_id, filename=filename, file_path=str(saved_path))
        db.add(material)
        db.commit()
        db.refresh(material)
        return material
    except Exception:
        db.rollback()
        saved_path.unlink(missing_ok=True)
        raise
    finally:
        db.close()


def remove_material_record(material_id: str) -> None:
    db = SessionLocal()
    try:
        material = db.query(CourseMaterial).filter(CourseMaterial.id == material_id).first()
        if material:
            db.delete(material)
            db.commit()
    finally:
        db.close()


@router.post("/material")
async def upload(file: UploadFile = File(...), course_id: str = Form(...), admin_id: str = Depends(get_current_admin_id)):
    filename, saved_path = await save_pdf_upload(file, "materials")
    material = create_material(course_id, filename, saved_path)
    return {"success": True, "message": "Uploaded", "data": {"materialId": material.id}}


@router.post("/knowledge-base")
async def upload_knowledge_base(file: UploadFile = File(...), course_id: str = Form(...), admin_id: str = Depends(get_current_admin_id)):
    filename, saved_path = await save_pdf_upload(file, "knowledge_bases")
    material: CourseMaterial | None = None
    try:
        material = create_material(course_id, filename, saved_path)
        stats = await index_knowledge_pdf(course_id, material, saved_path)
        return {"success": True, "message": "Knowledge base imported", "data": {"materialId": material.id, **stats}}
    except HTTPException:
        raise
    except Exception as exc:
        if material:
            remove_material_record(material.id)
        saved_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"知识库导入失败：{exc}") from exc


@router.post("/question-bank")
async def upload_question_bank(file: UploadFile = File(...), course_id: str = Form(...), admin_id: str = Depends(get_current_admin_id)):
    filename, saved_path = await save_pdf_upload(file, "question_banks")
    material: CourseMaterial | None = None
    try:
        material = create_material(course_id, filename, saved_path)
        stats = import_question_bank_pdf(course_id, saved_path)
        return {"success": True, "message": "Question bank imported", "data": {"materialId": material.id, **stats}}
    except HTTPException:
        raise
    except Exception as exc:
        if material:
            remove_material_record(material.id)
        saved_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"题库导入失败：{exc}") from exc


@router.delete("/material/{material_id}")
def delete_material(material_id: str, admin_id: str = Depends(get_current_admin_id)):
    db = SessionLocal()
    try:
        material = db.query(CourseMaterial).filter(CourseMaterial.id == material_id).first()
        if not material:
            raise HTTPException(status_code=404, detail="资料不存在")
        if os.path.exists(material.file_path):
            os.remove(material.file_path)
        db.delete(material)
        db.commit()
        return {"success": True}
    finally:
        db.close()
