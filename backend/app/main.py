import os
import logging
import traceback
from fastapi import FastAPI, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import engine, Base, get_db
from app.routes.auth import router as auth_router
from app.routes.video import router as video_router

logger = logging.getLogger(__name__)

# Initialize Database Tables & Migration for new columns & videos table
Base.metadata.create_all(bind=engine)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS public_id VARCHAR(36);"))
        conn.execute(text("ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0;"))
        conn.execute(text("ALTER TABLE videos ADD COLUMN IF NOT EXISTS transcription_json TEXT;"))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS videos (
                id VARCHAR(64) PRIMARY KEY,
                project_id VARCHAR(64) NOT NULL,
                user_id VARCHAR(64),
                original_filename VARCHAR(255) NOT NULL,
                file_size BIGINT NOT NULL,
                storage_path VARCHAR(512) NOT NULL,
                source_language VARCHAR(100) DEFAULT 'English',
                target_language VARCHAR(100) DEFAULT 'Telugu',
                status VARCHAR(50) DEFAULT 'uploaded',
                progress INTEGER DEFAULT 0,
                transcription_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))
        conn.commit()
    except Exception as e:
        logger.warning(f"DB Migration Notice: {e}")

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Dubzeek AI Video Localization & Auth API",
    description="Enterprise Resumable Video Upload Engine (Up to 3 GB) with PostgreSQL Neon DB Metadata Storage & Rate Limiting",
    version="2.1.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Universal CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OWASP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Global Exception Handler to ensure CORS headers are ALWAYS returned
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception on {request.url}: {traceback.format_exc()}")
    print(f"[FASTAPI 500 ERROR] {request.method} {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
        headers={"Access-Control-Allow-Origin": "*"}
    )

# Include Modular Routers
app.include_router(auth_router)
app.include_router(video_router)

# Mount Static Uploads Folder for Local File Previews
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Dubzeek AI Resumable Video Upload & Auth Engine",
        "database": "PostgreSQL Neon DB (videos & users tables)",
        "uploads": {
            "max_file_size": "3 GB",
            "resumable_chunks": "10 MB",
            "directories": ["original", "audio", "chunks", "output"]
        },
        "version": "2.1.0"
    }
