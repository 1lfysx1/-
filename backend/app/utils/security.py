import hashlib
import hmac
import secrets
from datetime import datetime, timedelta

import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, JWT_ALGORITHM, JWT_SECRET_KEY
from app.database import SessionLocal
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    if hashed.startswith("$2a$") or hashed.startswith("$2b$") or hashed.startswith("$2y$"):
        try:
            return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
        except ValueError:
            return False
    parts = hashed.split("$", 1)
    if len(parts) != 2:
        return False
    salt, expected = parts
    actual = hashlib.sha256((salt + plain).encode("utf-8")).hexdigest()
    return hmac.compare_digest(actual, expected)


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


async def get_current_user_id(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=401, detail="请先登录")
    try:
        user_id = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM]).get("sub")
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="登录状态已失效，请重新登录") from exc
    if not user_id:
        raise HTTPException(status_code=401, detail="登录状态已失效，请重新登录")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="用户不存在")
        if user.is_active == "2":
            raise HTTPException(status_code=403, detail="账号已注销")
        if user.is_active == "0":
            raise HTTPException(status_code=403, detail="账号已被停用")
        return user_id
    finally:
        db.close()


async def get_current_admin_id(token: str = Depends(oauth2_scheme)):
    user_id = await get_current_user_id(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="请先登录")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user or user.role not in ("teacher", "admin"):
            raise HTTPException(status_code=403, detail="没有操作权限")
        return user_id
    finally:
        db.close()
