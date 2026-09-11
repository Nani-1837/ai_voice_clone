import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_ZRgHwD3Vbo8i@ep-fancy-morning-aey2ge50-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require")
    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "")
    BREVO_SMTP_SERVER: str = os.getenv("BREVO_SMTP_SERVER", "smtp-brevo.com")
    BREVO_PORT: int = int(os.getenv("BREVO_PORT", "587"))
    BREVO_LOGIN: str = os.getenv("BREVO_LOGIN", "")
    SENDER_EMAIL: str = os.getenv("SENDER_EMAIL", "no-reply@dubzeek.ai")
    SENDER_NAME: str = os.getenv("SENDER_NAME", "Dubzeek AI Studio")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-jwt-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

settings = Settings()
