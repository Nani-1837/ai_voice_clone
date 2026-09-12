import datetime
import uuid
from typing import Optional, Tuple
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import User, RefreshToken

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt with automatic 72-byte truncation."""
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored bcrypt hash."""
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Create a short-lived (15-60 min) Access Token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        # Default 15 minutes for access tokens
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.datetime.utcnow()
    })
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def create_refresh_token(user: User, db: Session) -> Tuple[str, datetime.datetime]:
    """Create a long-lived (7 days) Refresh Token and record it in database."""
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    token_jti = str(uuid.uuid4())
    payload = {
        "sub": user.email,
        "user_id": user.id,
        "public_id": user.public_id,
        "jti": token_jti,
        "type": "refresh",
        "exp": expire,
        "iat": datetime.datetime.utcnow()
    }
    encoded_token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

    # Persist in DB for token revocation capability
    db_token = RefreshToken(
        token=encoded_token,
        user_email=user.email,
        user_id=user.id,
        expires_at=expire,
        is_revoked=False
    )
    db.add(db_token)
    db.commit()

    return encoded_token, expire

def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """FastAPI Dependency to get current authenticated user from Access Token."""
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

