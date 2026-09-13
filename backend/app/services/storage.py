import os
import shutil
import uuid
import logging
from typing import Tuple
from app.config import settings

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        # Ensure all required upload directories exist
        for directory in [
            settings.UPLOAD_DIR,
            settings.ORIGINAL_DIR,
            settings.AUDIO_DIR,
            settings.CHUNKS_DIR,
            settings.OUTPUT_DIR
        ]:
            os.makedirs(directory, exist_ok=True)

    def init_upload_session(self, filename: str, file_size: int) -> Tuple[str, int, int]:
        """
        Initializes a resumable upload session for large videos up to 3 GB.
        Returns: (upload_id, chunk_size, total_chunks)
        """
        if file_size > settings.MAX_FILE_SIZE_BYTES:
            raise ValueError(f"File size exceeds maximum allowed 3 GB limit. Provided: {file_size / (1024**3):.2f} GB")

        upload_id = f"upload_{uuid.uuid4().hex[:12]}"
        chunk_size = settings.CHUNK_SIZE_BYTES
        total_chunks = max(1, (file_size + chunk_size - 1) // chunk_size)

        # Create session chunk folder
        session_chunk_dir = os.path.join(settings.CHUNKS_DIR, upload_id)
        os.makedirs(session_chunk_dir, exist_ok=True)

        logger.info(f"Initialized upload session {upload_id} for {filename} ({file_size} bytes, {total_chunks} chunks)")
        return upload_id, chunk_size, total_chunks

    def save_chunk(self, upload_id: str, chunk_index: int, content: bytes) -> str:
        """
        Saves a binary chunk file inside uploads/chunks/{upload_id}/chunk_{chunk_index}.
        """
        session_chunk_dir = os.path.join(settings.CHUNKS_DIR, upload_id)
        if not os.path.exists(session_chunk_dir):
            os.makedirs(session_chunk_dir, exist_ok=True)

        chunk_path = os.path.join(session_chunk_dir, f"chunk_{chunk_index:05d}")
        with open(chunk_path, "wb") as f:
            f.write(content)

        return chunk_path

    def assemble_chunks(self, upload_id: str, filename: str) -> str:
        """
        Combines all uploaded chunk files into a single complete video file inside uploads/original/
        """
        session_chunk_dir = os.path.join(settings.CHUNKS_DIR, upload_id)
        if not os.path.exists(session_chunk_dir):
            raise FileNotFoundError(f"Upload session {upload_id} chunks directory not found")

        # Sanitize filename
        safe_filename = "".join(c for c in filename if c.isalnum() or c in "._- ")
        target_filename = f"{upload_id}_{safe_filename}"
        target_path = os.path.join(settings.ORIGINAL_DIR, target_filename)

        # Get sorted list of chunk files
        chunk_files = sorted(os.listdir(session_chunk_dir))
        
        with open(target_path, "wb") as outfile:
            for chunk_file in chunk_files:
                chunk_path = os.path.join(session_chunk_dir, chunk_file)
                with open(chunk_path, "rb") as infile:
                    shutil.copyfileobj(infile, outfile)

        # Clean up temporary chunk folder
        try:
            shutil.rmtree(session_chunk_dir)
        except Exception as e:
            logger.warning(f"Failed to cleanup chunk folder {session_chunk_dir}: {e}")

        logger.info(f"Successfully assembled video to {target_path} ({os.path.getsize(target_path)} bytes)")
        return target_path

    def save_direct_file(self, file_bytes: bytes, filename: str) -> str:
        """
        Direct single file save into uploads/original/
        """
        safe_filename = f"vid_{uuid.uuid4().hex[:8]}_{''.join(c for c in filename if c.isalnum() or c in '._- ')}"
        target_path = os.path.join(settings.ORIGINAL_DIR, safe_filename)
        with open(target_path, "wb") as f:
            f.write(file_bytes)
        return target_path

storage_service = StorageService()
