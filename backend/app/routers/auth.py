from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.user import User
from sqlalchemy import or_
from app.utils.security import create_access_token, get_current_user_id, hash_password, verify_password
from app.utils.email import send_verify_code, verify_code
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginReq(BaseModel):
    username: str
    password: str

class RegisterReq(BaseModel):
    username: str
    email: str
    password: str
    code: str

class CodeReq(BaseModel):
    email: str

class ResetPasswordReq(BaseModel):
    email: str
    password: str
    code: str

@router.post("/send-code")
async def send_code(req: CodeReq):
    try:
        send_verify_code(req.email, "注册")
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return {"success": True, "message": "Code sent"}

@router.post("/send-reset-code")
async def send_reset_code(req: CodeReq):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="邮箱未注册")
        if user.is_active == "2":
            raise HTTPException(status_code=403, detail="账号已注销")
        if user.is_active == "0":
            raise HTTPException(status_code=403, detail="账号已被停用")
        try:
            send_verify_code(req.email, "密码重置")
        except RuntimeError as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc
        return {"success": True, "message": "Code sent"}
    finally:
        db.close()

@router.post("/register")
async def register(req: RegisterReq):
    if not verify_code(req.email, req.code):
        raise HTTPException(400, "验证码错误")
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == req.username).first():
            raise HTTPException(400, "用户名已存在")
        if db.query(User).filter(User.email == req.email).first():
            raise HTTPException(400, "邮箱已注册")
        user = User(username=req.username, email=req.email, password_hash=hash_password(req.password), role="student")
        db.add(user); db.commit(); db.refresh(user)
        token = create_access_token({"sub": user.id, "role": user.role})
        return {"token": token, "user": {"id": user.id, "username": user.username, "email": user.email, "role": user.role}}
    finally:
        db.close()

@router.post("/login")
async def login(req: LoginReq):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == req.username).first()
        if not user:
            user = db.query(User).filter(User.email == req.username).first()
        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(401, "用户名或密码错误")
        if user.is_active == "2":
            raise HTTPException(403, "账号已注销")
        if user.is_active == "0":
            raise HTTPException(403, "账号已被停用")
        token = create_access_token({"sub": user.id, "role": user.role})
        return {"token": token, "user": {"id": user.id, "username": user.username, "email": user.email, "role": user.role}}
    finally:
        db.close()

@router.post("/reset-password")
async def reset_password(req: ResetPasswordReq):
    if not verify_code(req.email, req.code):
        raise HTTPException(400, "验证码错误")
    if len(req.password.strip()) < 6:
        raise HTTPException(400, "密码至少需要 6 位")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            raise HTTPException(404, "用户不存在")
        if user.is_active == "2":
            raise HTTPException(403, "账号已注销")
        user.password_hash = hash_password(req.password)
        db.commit()
        return {"success": True, "message": "密码已重置"}
    finally:
        db.close()

@router.delete("/account")
async def cancel_account(user_id: str = Depends(get_current_user_id)):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        user.is_active = "2"
        db.commit()
        return {"success": True}
    finally:
        db.close()

