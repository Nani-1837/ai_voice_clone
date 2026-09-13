import os
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Video, User
from app.schemas import (
    InitUploadRequest, 
    InitUploadResponse, 
    CompleteUploadRequest, 
    VideoResponse
)
from app.auth import get_current_user
from app.services.storage import storage_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/video", tags=["Video Upload & Management"])

@router.post("/upload-init", response_model=InitUploadResponse)
def init_resumable_upload(
    body: InitUploadRequest, 
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Initializes a resumable chunked upload session for large video files (up to 3 GB).
    """
    try:
        upload_id, chunk_size, total_chunks = storage_service.init_upload_session(
            filename=body.filename,
            file_size=body.file_size
        )
        return {
            "upload_id": upload_id,
            "chunk_size": chunk_size,
            "total_chunks": total_chunks,
            "status": "initialized"
        }
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))

@router.post("/upload-chunk")
async def upload_video_chunk(
    upload_id: str = Form(...),
    chunk_index: int = Form(...),
    chunk_file: UploadFile = File(...)
):
    """
    Uploads a single chunk of a large video file.
    """
    content = await chunk_file.read()
    chunk_path = storage_service.save_chunk(upload_id, chunk_index, content)
    return {
        "status": "chunk_saved",
        "upload_id": upload_id,
        "chunk_index": chunk_index,
        "bytes_received": len(content),
        "chunk_path": chunk_path
    }

@router.post("/upload-complete", response_model=VideoResponse)
def complete_resumable_upload(
    body: CompleteUploadRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Finalizes chunk assembly, validates file, stores metadata in Neon PostgreSQL database,
    and initializes processing job.
    """
    try:
        # Assemble all chunks into backend/uploads/original/
        storage_path = storage_service.assemble_chunks(body.upload_id, body.filename)
        file_size = os.path.getsize(storage_path)

        user_id_str = str(current_user.public_id) if current_user else "guest_user"

        # Create record in Neon PostgreSQL 'videos' table
        new_video = Video(
            project_id=body.project_id or "dub-default",
            user_id=user_id_str,
            original_filename=body.filename,
            file_size=file_size,
            storage_path=storage_path,
            source_language=body.source_language or "English",
            target_language=body.target_language or "Telugu",
            status="uploaded",
            progress=0
        )
        db.add(new_video)
        db.commit()
        db.refresh(new_video)

        logger.info(f"Saved video metadata in Neon DB: ID={new_video.id}, Path={storage_path}")
        return new_video
    except FileNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err))
    except Exception as err:
        logger.error(f"Failed to complete upload: {err}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Upload completion failed: {str(err)}")

@router.post("/upload-direct", response_model=VideoResponse)
async def upload_video_direct(
    file: UploadFile = File(...),
    project_id: str = Form("dub-default"),
    source_language: str = Form("English"),
    target_language: str = Form("Telugu"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Direct single-file upload for standard videos (up to 500 MB).
    """
    content = await file.read()
    file_size = len(content)

    # Save to backend/uploads/original/
    storage_path = storage_service.save_direct_file(content, file.filename)
    user_id_str = str(current_user.public_id) if current_user else "guest_user"

    # Save Metadata in Neon DB
    new_video = Video(
        project_id=project_id,
        user_id=user_id_str,
        original_filename=file.filename,
        file_size=file_size,
        storage_path=storage_path,
        source_language=source_language,
        target_language=target_language,
        status="uploaded",
        progress=0
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return new_video

@router.get("/list", response_model=List[VideoResponse])
def list_videos(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Lists videos stored in Neon DB.
    """
    if current_user:
        user_id_str = str(current_user.public_id)
        return db.query(Video).filter(Video.user_id == user_id_str).order_by(Video.created_at.desc()).all()
    return db.query(Video).order_by(Video.created_at.desc()).limit(20).all()

@router.get("/{video_id}", response_model=VideoResponse)
def get_video_details(video_id: str, db: Session = Depends(get_db)):
    """
    Gets video metadata & processing status by ID from Neon DB.
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    return video
