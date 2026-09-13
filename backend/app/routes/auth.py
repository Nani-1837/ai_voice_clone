import datetime
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Cookie
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.models import User, OTPVerification, RefreshToken
from app.schemas import SendOTPRequest, VerifyOTPRequest, LoginRequest, TokenResponse, UserResponse
from app.auth import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token, get_current_user
from app.brevo_service import generate_otp, send_otp_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/send-otp", status_code=status.HTTP_200_OK)
def send_otp(request: Request, body: SendOTPRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == body.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists. Please log in instead."
        )

    otp_code = generate_otp(6)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

    db.query(OTPVerification).filter(OTPVerification.email == body.email).delete()

    otp_record = OTPVerification(
        email=body.email,
        otp_code=otp_code,
        expires_at=expires_at,
        failed_attempts=0
    )
    db.add(otp_record)
    db.commit()

    email_sent = send_otp_email(body.email, otp_code)
    if not email_sent:
        logger.warning(f"Email sending notice: verification code generated for {body.email}")

    return {"message": "Verification OTP code sent to your email address.", "email": body.email}

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(request: Request, body: VerifyOTPRequest, response: Response, db: Session = Depends(get_db)):
    otp_record = db.query(OTPVerification).filter(OTPVerification.email == body.email).first()
    if not otp_record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No verification code found. Please request OTP first.")

    if otp_record.expires_at < datetime.datetime.utcnow():
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired. Please request a new OTP.")

    if (otp_record.failed_attempts or 0) >= 5:
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many failed attempts. Code invalidated. Request a new OTP.")

    if otp_record.otp_code != body.otp_code.strip():
        otp_record.failed_attempts = (otp_record.failed_attempts or 0) + 1
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP code. {5 - otp_record.failed_attempts} attempts remaining."
        )

    db.delete(otp_record)
    db.commit()

    hashed_pw = get_password_hash(body.password or "defaultpass123")
    new_user = User(
        full_name=body.full_name or "User",
        email=body.email,
        hashed_password=hashed_pw,
        primary_language=body.primary_language or "Telugu",
        is_active=True,
        is_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email, "id": new_user.id})
    refresh_token = create_refresh_token(data={"sub": new_user.email, "id": new_user.id})

    db_refresh = RefreshToken(
        token=refresh_token,
        user_email=new_user.email,
        user_id=new_user.id,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30)
    )
    db.add(db_refresh)
    db.commit()

    response.set_cookie(
        key="dubzeek_refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 60 * 60
    )

    user_dict = {
        "id": new_user.id,
        "public_id": new_user.public_id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "primary_language": new_user.primary_language
    }

    return {"access_token": access_token, "token_type": "bearer", "user": user_dict}

@router.post("/login", response_model=TokenResponse)
def login(request: Request, body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    if not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled.")

    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    refresh_token = create_refresh_token(data={"sub": user.email, "id": user.id})

    db_refresh = RefreshToken(
        token=refresh_token,
        user_email=user.email,
        user_id=user.id,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30)
    )
    db.add(db_refresh)
    db.commit()

    response.set_cookie(
        key="dubzeek_refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 60 * 60
    )

    user_dict = {
        "id": user.id,
        "public_id": user.public_id,
        "full_name": user.full_name,
        "email": user.email,
        "primary_language": user.primary_language
    }

    return {"access_token": access_token, "token_type": "bearer", "user": user_dict}

@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return current_user
