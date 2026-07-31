"""FastAPI application entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routers import admin, auth, community, exercise, feedback, learning, positions, practical, progress, qa, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from app.init_db import init_database
        init_database()
    except Exception as exc:
        print(f"Database initialization skipped: {exc}")
    yield


app = FastAPI(title="Vocational Training System API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

for router_module in (auth, positions, qa, exercise, progress, community, feedback, upload, admin, learning, practical):
    app.include_router(router_module.router)


@app.get("/")
def root():
    return {"message": "Vocational Training System API", "docs": "/docs"}

