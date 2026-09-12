import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dubzeek AI Authentication API",
    description="Professional Level Auth Service with PostgreSQL, Brevo OTP & JWT",
    version="1.0.0"
)

# Universal CORS Middleware configuration to fix Vercel origin blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
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
    # Check if email already registered
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with this email already exists."
        )

    # Fetch latest unused non-expired OTP entry
    now = datetime.datetime.utcnow()
    otp_record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.email == request.email,
            OTPVerification.is_used == False,
            OTPVerification.expires_at > now
        )
        .order_by(OTPVerification.id.desc())
        .first()
    )

    if not otp_record or otp_record.otp_code != request.otp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP code. Please request a new code."
        )

    # Mark OTP as used
    otp_record.is_used = True
    db.commit()

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

@app.post("/api/auth/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
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

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
