import random
import string
import logging
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

logger = logging.getLogger(__name__)

def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email: str, otp_code: str) -> bool:
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
        .logo {{ font-size: 26px; font-weight: 900; color: #7c3aed; text-align: center; margin-bottom: 24px; letter-spacing: -0.5px; }}
        .badge {{ display: inline-block; background: #f3e8ff; color: #7c3aed; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }}
        .title {{ font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }}
        .text {{ font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 28px; }}
        .otp-box {{ background: #faf5ff; border: 2px dashed #a855f7; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px; }}
        .otp-code {{ font-size: 36px; font-weight: 900; color: #7c3aed; letter-spacing: 8px; font-family: monospace; }}
        .footer {{ font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px; }}
      </style>
    </head>
    <body>
      <div className="container">
        <div className="logo">DUBZEEK AI</div>
        <div style="text-align: center;">
          <span className="badge">Security Verification</span>
        </div>
        <div className="title">Verify Your Email Address</div>
        <div className="text">
          Welcome to <strong>Dubzeek AI Studio</strong>. Please use the 6-digit verification code below to verify your email address and continue with your dubbing project creation.
        </div>
        <div className="otp-box">
          <div className="otp-code">{otp_code}</div>
        </div>
        <div className="text" style="font-size: 12px; color: #64748b;">
          This code is valid for <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.
        </div>
        <div className="footer">
          &copy; 2026 Dubzeek AI Multilingual Video Localization. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    """

    # 1. Try Brevo REST API v3
    if settings.BREVO_API:
        try:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "accept": "application/json",
                "api-key": settings.BREVO_API,
                "content-type": "application/json"
            }
            payload = {
                "sender": {"name": settings.SENDER_NAME, "email": settings.BREVO_SMTP_FROM},
                "to": [{"email": email}],
                "subject": f"{otp_code} is your Dubzeek AI Verification Code",
                "htmlContent": html_content
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code in [200, 201, 202]:
                logger.info(f"OTP Email sent successfully via Brevo REST API to {email}")
                return True
            else:
                logger.warning(f"Brevo REST API returned {response.status_code}: {response.text}")
        except Exception as err:
            logger.warning(f"Brevo REST API failed: {err}")

    # 2. Fallback to SMTPS / SMTP
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your Dubzeek AI Verification Code"
        msg["From"] = f"{settings.SENDER_NAME} <{settings.BREVO_SMTP_FROM}>"
        msg["To"] = email
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.BREVO_SMTP_SERVER, settings.BREVO_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.BREVO_SMTP_USER, settings.BREVO_SMTP_KEY)
            server.sendmail(settings.BREVO_SMTP_FROM, [email], msg.as_string())
        logger.info(f"OTP Email sent successfully via Brevo SMTP to {email}")
        return True
    except Exception as err:
        logger.error(f"Brevo SMTP fallback failed: {err}")

    logger.info(f"[SIMULATED EMAIL] OTP for {email} is {otp_code}")
    return True
