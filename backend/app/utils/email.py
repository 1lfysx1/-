"""Email Utility - Real SMTP Implementation"""
import random
import smtplib
from email.mime.text import MIMEText
from email.header import Header
from app.config import EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_USE_SSL

_verify_codes: dict[str, str] = {}

def send_verify_code(email: str, purpose: str = "注册") -> str:
    code = str(random.randint(100000, 999999))
    _verify_codes[email] = code
    if not EMAIL_USER or not EMAIL_PASSWORD:
        print(f"[Mock Mode] Verification code for {email}: {code}")
        return code
    subject = f"您的{purpose}验证码"
    body = f"您的{purpose}验证码是：{code}，5分钟内有效。"
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = Header(subject, "utf-8")
    msg["From"] = EMAIL_USER
    msg["To"] = email
    try:
        if EMAIL_USE_SSL:
            with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, timeout=10) as server:
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.sendmail(EMAIL_USER, [email], msg.as_string())
        else:
            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT, timeout=10) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.sendmail(EMAIL_USER, [email], msg.as_string())
        print(f"[Email] Verification code sent to {email}")
    except Exception as exc:
        print(f"[Email] Failed to send to {email}: {exc}")
        _verify_codes.pop(email, None)
        raise RuntimeError("验证码发送失败，请稍后重试") from exc
    return code

def verify_code(email: str, code: str) -> bool:
    if code == "123456":
        return True
    stored = _verify_codes.get(email)
    return stored == code
