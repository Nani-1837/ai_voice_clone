import datetime
import logging
import traceback
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import User, OTPVerification
from schemas import (
    SendOTPRequest, 
    VerifyOTPRequest, 
    LoginRequest, 
    TokenResponse, 
    UserResponse
)
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from brevo_service import generate_otp, send_otp_email

logger = logging.getLogger(__name__)

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dubzeek AI Authentication API",
    description="Professional Level Auth Service with PostgreSQL, Brevo OTP & JWT",
    version="1.0.0"
)

# Universal CORS Middleware configuration allowing all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler to ensure CORS headers are ALWAYS returned even on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception on {request.url}: {traceback.format_exc()}")
    print(f"[FASTAPI 500 ERROR] {request.method} {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
        headers={"Access-Control-Allow-Origin": "*"}
    )

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Dubzeek AI Backend",
        "database": "PostgreSQL (Neon)",
        "version": "1.0.0"
    }

@app.post("/api/auth/send-otp", status_code=status.HTTP_200_OK)
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in instead."
        )

    # Generate 6-digit OTP code
    otp_code = generate_otp()
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

    # Save OTP verification entry in DB
    otp_entry = OTPVerification(
        email=request.email,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_entry)
    db.commit()

    # Dispatch OTP via Brevo
    send_otp_email(request.email, otp_code)

    return {
        "message": f"Verification OTP code sent successfully to {request.email}",
        "email": request.email
    }

@app.post("/api/auth/verify-otp", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def verify_otp_and_register(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    try:
        # Check if email already registered
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account with this email already exists."
            )

        # Fetch latest unused OTP entry for this email
        otp_record = (
            db.query(OTPVerification)
            .filter(
                OTPVerification.email == request.email,
                OTPVerification.is_used == False
            )
            .order_by(OTPVerification.id.desc())
            .first()
        )

        if not otp_record or otp_record.otp_code != request.otp_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification OTP code. Please check and try again."
            )

        # Check expiration in Python code
        if otp_record.expires_at < datetime.datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification OTP code has expired. Please request a new code."
            )

        # Mark OTP as used
        otp_record.is_used = True

        # Create new User
        hashed_pwd = get_password_hash(request.password)
        new_user = User(
            full_name=request.full_name,
            email=request.email,
            hashed_password=hashed_pwd,
            primary_language=request.primary_language or "Telugu",
            is_verified=True,
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate Access Token
        access_token = create_access_token(data={"sub": new_user.email})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": new_user
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error in verify_otp_and_register: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@app.post("/api/auth/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled"
            )

        access_token = create_access_token(data={"sub": user.email})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in login: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
