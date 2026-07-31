"""DeepSeek API Client"""
import httpx
from typing import Optional
from app.config import DEEPSEEK_API_KEY, DEEPSEEK_API_URL, DEEPSEEK_CHAT_MODEL, DEEPSEEK_EMBED_MODEL

async def chat_completion(messages: list[dict]) -> Optional[str]:
    if not DEEPSEEK_API_KEY:
        return "[Config Missing] Set DEEPSEEK_API_KEY in .env"
    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": DEEPSEEK_CHAT_MODEL, "messages": messages}
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(f"{DEEPSEEK_API_URL}/chat/completions", headers=headers, json=payload)
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"]
            else:
                print(f"[DeepSeek Error] {resp.status_code}: {resp.text}")
                return None
    except Exception as e:
        print(f"[DeepSeek Exception] {e}")
        return None

async def create_embedding(text: str) -> Optional[list[float]]:
    if not DEEPSEEK_API_KEY:
        return None
    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": DEEPSEEK_EMBED_MODEL, "input": text}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(f"{DEEPSEEK_API_URL}/embeddings", headers=headers, json=payload)
            if resp.status_code == 200:
                return resp.json()["data"][0]["embedding"]
    except Exception as e:
        print(f"[Embed Error] {e}")
        return None
