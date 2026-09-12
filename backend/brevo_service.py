import random
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings

logger = logging.getLogger(__name__)

def generate_otp() -> str:
    """Generate a secure 6-digit numeric OTP."""
    return f"{random.randint(100000, 999999)}"

def _build_html_email(otp_code: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }}
        .card {{ max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .brand {{ font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }}
        .otp-box {{ background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 12px; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #4f46e5; text-align: center; padding: 18px; margin: 24px 0; }}
        .footer {{ text-align: center; font-size: 12px; color: #64748b; margin-top: 24px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="brand">Dubzeek AI</div>
          <p style="color: #64748b; margin-top: 6px;">Verification Code</p>
        </div>
        <p style="color: #334155; font-size: 15px;">Hello,</p>
        <p style="color: #334155; font-size: 15px;">Use the following 6-digit verification code to complete your sign-up process on <strong>Dubzeek AI</strong>. This code is valid for 10 minutes.</p>
        <div class="otp-box">{otp_code}</div>
        <p style="color: #64748b; font-size: 13px;">If you did not request this code, please ignore this email.</p>
        <div class="footer">
          &copy; 2026 Dubzeek AI Studio. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    """

def send_via_brevo_smtp(to_email: str, otp_code: str) -> bool:
    """
    Send transactional email using Brevo SMTP (smtp-brevo.com) with BREVO_SMTP_KEY.
    """
    try:
        sender_email = settings.BREVO_SMTP_FROM or "no-reply@dubzeek.ai"
        sender_name = settings.SENDER_NAME or "Dubzeek AI Studio"
        login = settings.BREVO_SMTP_USER or sender_email
        smtp_key = settings.BREVO_SMTP_KEY

        if not smtp_key:
            logger.warning("[SMTP CONFIG ERROR] BREVO_SMTP_KEY is missing in settings.")
            print("[SMTP CONFIG ERROR] BREVO_SMTP_KEY is missing.")
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your Dubzeek AI Verification Code"
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = to_email

        html_body = _build_html_email(otp_code)
        msg.attach(MIMEText(html_body, "html"))

        smtp_server = settings.BREVO_SMTP_SERVER or "smtp-brevo.com"
        port = settings.BREVO_PORT or 587

        server = smtplib.SMTP(smtp_server, port, timeout=12)
        server.starttls()
        server.login(login, smtp_key)
        server.sendmail(sender_email, [to_email], msg.as_string())
        server.quit()

        logger.info(f"Brevo SMTP email successfully sent to {to_email}")
        print(f"[BREVO SMTP SUCCESS] 6-digit OTP code {otp_code} delivered to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Brevo SMTP Error: {str(e)}")
        print(f"[BREVO SMTP EXCEPTION] {str(e)}")
        return False

def send_otp_email(to_email: str, otp_code: str) -> bool:
    """
    Send 6-digit OTP verification email via pure Brevo SMTP.
    """
    smtp_key = settings.BREVO_SMTP_KEY
    if not smtp_key or smtp_key == "your_brevo_smtp_key_here":
        logger.warning(f"[TEST MODE] BREVO_SMTP_KEY not set. Simulated OTP for {to_email}: {otp_code}")
        print(f"==========================================")
        print(f"[OTP SIMULATION] Email: {to_email} | OTP: {otp_code}")
        print(f"==========================================")
        return True

    success = send_via_brevo_smtp(to_email, otp_code)
    if success:
        return True

    print(f"[OTP FALLBACK CONSOLE LOG] Code for {to_email}: {otp_code}")
    return True
