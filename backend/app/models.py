import datetime
import uuid
from sqlalchemy import Column, Integer, BigInteger, String, Boolean, DateTime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    primary_language = Column(String(100), default="Telugu")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(BigInteger, primary_key=True, index=True)
    email = Column(String(255), index=True, nullable=False)
    otp_code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    failed_attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(BigInteger, primary_key=True, index=True)
    token = Column(String(512), unique=True, index=True, nullable=False)
    user_email = Column(String(255), nullable=False, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Video Metadata Table for Neon Database
class Video(Base):
    __tablename__ = "videos"

    id = Column(String(64), primary_key=True, index=True, default=lambda: f"vid_{uuid.uuid4().hex[:12]}")
    project_id = Column(String(64), index=True, nullable=False)
    user_id = Column(String(64), index=True, nullable=True)
    original_filename = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    storage_path = Column(String(512), nullable=False)
    source_language = Column(String(100), default="English")
    target_language = Column(String(100), default="Telugu")
    status = Column(String(50), default="uploaded")  # uploaded, processing, completed, failed
    progress = Column(Integer, default=0)
    transcription_json = Column(String, nullable=True)  # Stores JSON array of timestamped text segments
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

