import datetime
import logging
import traceback
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from database import engine, Base, get_db
from models import User, OTPVerification, RefreshToken
from schemas import (
    SendOTPRequest, 
    VerifyOTPRequest, 
    LoginRequest, 
    TokenResponse, 
    UserResponse
)
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_refresh_token, 
    decode_token, 
    get_current_user
)
from brevo_service import generate_otp, send_otp_email
from sqlalchemy import text

logger = logging.getLogger(__name__)

# Initialize Database Tables & Migration for new columns
Base.metadata.create_all(bind=engine)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS public_id VARCHAR(36);"))
        conn.execute(text("ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0;"))
        conn.commit()
    except Exception as e:
        logger.warning(f"DB Migration Notice: {e}")

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Dubzeek AI Authentication API",
    description="Enterprise Auth Service with PostgreSQL, Rate Limiting, HTTP-Only Cookie Refresh Tokens & Bcrypt",
    version="2.0.0"
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
        "service": "Dubzeek AI Security Auth Engine",
        "database": "PostgreSQL (Neon 64-bit ID Storage)",
        "security": "Rate Limiting + Refresh Token Rotation + OWASP Headers",
        "version": "2.0.0"
    }

@app.post("/api/auth/send-otp", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
def send_otp(request: Request, body: SendOTPRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == body.email).first()
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
        email=body.email,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False,
        failed_attempts=0
    )
    db.add(otp_entry)
    db.commit()

    # Dispatch OTP via Brevo
    send_otp_email(body.email, otp_code)

    return {
        "message": f"Verification OTP code sent successfully to {body.email}",
        "email": body.email
    }

@app.post("/api/auth/verify-otp", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def verify_otp_and_register(
    request: Request, 
    response: Response, 
    body: VerifyOTPRequest, 
    db: Session = Depends(get_db)
):
    try:
        # Check if email already registered
        existing_user = db.query(User).filter(User.email == body.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account with this email already exists."
            )

        # Fetch latest unused OTP entry for this email
        otp_record = (
            db.query(OTPVerification)
            .filter(
                OTPVerification.email == body.email,
                OTPVerification.is_used == False
            )
            .order_by(OTPVerification.id.desc())
            .first()
        )

        if not otp_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending verification code found for this email."
            )

        # Anti-Brute Force Protection: Lock out if max failed attempts reached (Max 3)
        if otp_record.failed_attempts >= 3:
            otp_record.is_used = True
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum failed attempts exceeded. This verification code has been invalidated. Please request a new OTP."
            )

        # Verify OTP code match
        if otp_record.otp_code != body.otp_code:
            otp_record.failed_attempts += 1
            if otp_record.failed_attempts >= 3:
                otp_record.is_used = True
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Maximum failed attempts exceeded. Verification code invalidated."
                )
            db.commit()
            remaining = 3 - otp_record.failed_attempts
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid verification OTP code. {remaining} attempt(s) remaining."
            )

        # Check expiration
        if otp_record.expires_at < datetime.datetime.utcnow():
            otp_record.is_used = True
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification OTP code has expired. Please request a new code."
            )

        # Mark OTP as used
        otp_record.is_used = True

        # Create new User (with 64-bit ID & UUID public_id)
        hashed_pwd = get_password_hash(body.password)
        new_user = User(
            full_name=body.full_name,
            email=body.email,
            hashed_password=hashed_pwd,
            primary_language=body.primary_language or "Telugu",
            is_verified=True,
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate Dual Token System (Access + Refresh Token)
        access_token = create_access_token(data={"sub": new_user.email, "public_id": new_user.public_id})
        refresh_token, _ = create_refresh_token(new_user, db)

        # Set HttpOnly Cookie for Refresh Token (Protection against XSS)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=7 * 24 * 3600 # 7 Days
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token,
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
@limiter.limit("5/minute")
def login(
    request: Request, 
    response: Response, 
    body: LoginRequest, 
    db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(User.email == body.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not verify_password(body.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled"
            )

        # Generate Dual Token Pair
        access_token = create_access_token(data={"sub": user.email, "public_id": user.public_id})
        refresh_token, _ = create_refresh_token(user, db)

        # Set HttpOnly Cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=7 * 24 * 3600
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token,
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

@app.post("/api/auth/refresh")
def refresh_access_token(
    request: Request,
    response: Response,
    refresh_token_cookie: Optional[str] = Cookie(None, alias="refresh_token"),
    db: Session = Depends(get_db)
):
    """
    Refresh Endpoint: Accepts HttpOnly cookie refresh token and returns a new Access Token.
    """
    token_str = refresh_token_cookie
    if not token_str:
        # Fallback to Authorization header if cookie not sent
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token_str = auth_header.split(" ")[1]

    if not token_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing"
        )

    # Decode refresh token
    payload = decode_token(token_str)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token type"
        )

    email = payload.get("sub")
    # Verify token in DB and ensure not revoked
    db_token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == token_str,
            RefreshToken.is_revoked == False
        )
        .first()
    )

    if not db_token or db_token.expires_at < datetime.datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is revoked or expired"
        )

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    # Rotate Access Token
    new_access_token = create_access_token(data={"sub": user.email, "public_id": user.public_id})

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

@app.post("/api/auth/logout")
def logout(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Logout Endpoint: Revokes all active refresh tokens for the user and deletes cookie.
    """
    # Revoke user refresh tokens in DB
    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id,
        RefreshToken.is_revoked == False
    ).update({"is_revoked": True})
    db.commit()

    # Clear HttpOnly Cookie
    response.delete_cookie(key="refresh_token")

    return {"message": "Logged out successfully. All sessions revoked."}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

