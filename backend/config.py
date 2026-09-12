import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_ZRgHwD3Vbo8i@ep-fancy-morning-aey2ge50-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require")
    
    # Brevo Environment Variables (Supports both REST API & SMTPS Port 465 SSL)
    BREVO_API: str = os.getenv("BREVO_API", os.getenv("BREVO_API_KEY", "")).strip()
    BREVO_SMTP_KEY: str = os.getenv("BREVO_SMTP_KEY", os.getenv("BREVO_API", os.getenv("BREVO_API_KEY", ""))).strip()
    BREVO_SMTP_USER: str = os.getenv("BREVO_SMTP_USER", os.getenv("BREVO_LOGIN", "b46190001@smtp-brevo.com")).strip()
    BREVO_SMTP_FROM: str = os.getenv("BREVO_SMTP_FROM", os.getenv("SENDER_EMAIL", "jayaveer1639@gmail.com")).strip()
    BREVO_SMTP_SERVER: str = os.getenv("BREVO_SMTP_SERVER", "smtp-relay.brevo.com").strip()
    BREVO_PORT: int = int(os.getenv("BREVO_PORT", "2525"))
    SENDER_NAME: str = os.getenv("SENDER_NAME", "Dubzeek AI Studio").strip()
    
    # JWT Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-jwt-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

settings = Settings()
