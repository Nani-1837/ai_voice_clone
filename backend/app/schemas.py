import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# Auth Schemas
class SendOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=6, max_length=6)
    full_name: Optional[str] = "User"
    password: Optional[str] = "defaultpass123"
    primary_language: Optional[str] = "Telugu"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    public_id: str
    full_name: str
    email: str
    primary_language: str
    is_active: bool

# Video Upload & Resumable Session Schemas
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

class VideoResponse(BaseModel):
    id: str
    project_id: str
    user_id: Optional[str]
    original_filename: str
    file_size: int
    storage_path: str
    source_language: str
    target_language: str
    status: str
    progress: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True
