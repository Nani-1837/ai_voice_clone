import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    primary_language: Optional[str] = "Telugu"

class SendOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=6, max_length=6)
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)
    primary_language: Optional[str] = "Telugu"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    public_id: Optional[str] = None
    full_name: str
    email: str
    primary_language: str
    is_verified: bool
    created_at: datetime.datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    user: UserResponse

class InitUploadRequest(BaseModel):
    filename: str
    file_size: int
    project_id: Optional[str] = "dub-default"
    source_language: Optional[str] = "English"
    target_language: Optional[str] = "Telugu"

class InitUploadResponse(BaseModel):
    upload_id: str
    chunk_size: int
    total_chunks: int
    status: str

class CompleteUploadRequest(BaseModel):
    upload_id: str
    filename: str
    project_id: Optional[str] = "dub-default"
    source_language: Optional[str] = "English"
    target_language: Optional[str] = "Telugu"

class TranscriptionSegment(BaseModel):
    id: int
    start: float
    end: float
    text: str
    speaker: Optional[str] = "Speaker 1"

class TranscribeResponse(BaseModel):
    video_id: str
    language: str
    duration: float
    full_text: str
    segments: List[TranscriptionSegment]

class VideoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    user_id: Optional[str] = None
    original_filename: str
    file_size: int
    storage_path: str
    source_language: str
    target_language: str
    status: str
    progress: int
    transcription_json: Optional[str] = None
    created_at: datetime.datetime



