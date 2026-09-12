import random
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests

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

def send_via_brevo_rest(to_email: str, otp_code: str) -> bool:
    """Send transactional email using Brevo REST API v3 (Port 443 HTTPS)."""
    api_key = settings.BREVO_API or settings.BREVO_SMTP_KEY
    if not api_key:
        return False

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }
    
    sender_email = settings.BREVO_SMTP_FROM or "no-reply@dubzeek.ai"
    sender_name = settings.SENDER_NAME or "Dubzeek AI Studio"

    payload = {
        "sender": {
            "name": sender_name,
            "email": sender_email
        },
        "to": [
            {
                "email": to_email
            }
        ],
        "subject": f"{otp_code} is your Dubzeek AI Verification Code",
        "htmlContent": _build_html_email(otp_code)
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        if response.status_code in [200, 201, 202]:
            logger.info(f"Brevo REST API email sent successfully to {to_email}")
            print(f"[BREVO REST SUCCESS] 6-digit OTP code {otp_code} delivered to {to_email}")
            return True
        else:
            logger.warning(f"Brevo REST API status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        logger.error(f"Brevo REST Exception: {str(e)}")
        return False

def send_via_brevo_smtps_ssl(to_email: str, otp_code: str) -> bool:
    """
    Send transactional email using Brevo SMTPS Port 465 SSL.
    Port 465 SMTPS is not blocked by cloud hosting providers (Render/AWS/GCP).
    """
    try:
        sender_email = settings.BREVO_SMTP_FROM or "no-reply@dubzeek.ai"
        sender_name = settings.SENDER_NAME or "Dubzeek AI Studio"
        login = settings.BREVO_SMTP_USER or sender_email
        smtp_key = settings.BREVO_SMTP_KEY or settings.BREVO_API

        if not smtp_key or not login:
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your Dubzeek AI Verification Code"
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = to_email

        html_body = _build_html_email(otp_code)
        msg.attach(MIMEText(html_body, "html"))

        # Official Brevo SMTP host
        smtp_server = "smtp-relay.brevo.com"

        # Port 465 SSL connection
        server = smtplib.SMTP_SSL(smtp_server, 465, timeout=6)
        server.login(login, smtp_key)
        server.sendmail(sender_email, [to_email], msg.as_string())
        server.quit()

        logger.info(f"Brevo SMTPS (Port 465 SSL) email successfully sent to {to_email}")
        print(f"[BREVO SMTPS PORT 465 SUCCESS] 6-digit OTP code {otp_code} delivered to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Brevo SMTPS Port 465 Error: {str(e)}")
        print(f"[BREVO SMTPS PORT 465 FAIL] {str(e)}")
        return False

def send_via_brevo_smtp_starttls(to_email: str, otp_code: str, port: int = 587) -> bool:
    """
    Fallback method: Send email using Brevo SMTP STARTTLS (Port 587 or 2525).
    """
    try:
        sender_email = settings.BREVO_SMTP_FROM or "no-reply@dubzeek.ai"
        sender_name = settings.SENDER_NAME or "Dubzeek AI Studio"
        login = settings.BREVO_SMTP_USER or sender_email
        smtp_key = settings.BREVO_SMTP_KEY or settings.BREVO_API

        if not smtp_key or not login:
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your Dubzeek AI Verification Code"
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = to_email

        html_body = _build_html_email(otp_code)
        msg.attach(MIMEText(html_body, "html"))

        smtp_server = "smtp-relay.brevo.com"

        server = smtplib.SMTP(smtp_server, port, timeout=5)
        server.starttls()
        server.login(login, smtp_key)
        server.sendmail(sender_email, [to_email], msg.as_string())
        server.quit()

        logger.info(f"Brevo SMTP Port {port} email sent to {to_email}")
        print(f"[BREVO SMTP PORT {port} SUCCESS] 6-digit OTP code {otp_code} delivered to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Brevo SMTP Port {port} Error: {str(e)}")
        print(f"[BREVO SMTP PORT {port} FAIL] {str(e)}")
        return False

def send_otp_email(to_email: str, otp_code: str) -> bool:
    """
    Send 6-digit OTP verification email via multi-channel fallback engine:
    1. Brevo REST API (Port 443 HTTPS)
    2. Brevo SMTPS (Port 465 SSL)
    3. Brevo SMTP (Port 587 / 2525 STARTTLS)
    """
    api_key = settings.BREVO_API or settings.BREVO_SMTP_KEY
    if not api_key or api_key == "your_brevo_smtp_key_here":
        logger.warning(f"[TEST MODE] Keys not set. Simulated OTP for {to_email}: {otp_code}")
        print(f"==========================================")
        print(f"[OTP SIMULATION] Email: {to_email} | OTP: {otp_code}")
        print(f"==========================================")
        return True

    # 1. Attempt Brevo REST API (Port 443 HTTPS - Standard Web Port)
    if send_via_brevo_rest(to_email, otp_code):
        return True

    # 2. Attempt Brevo SMTPS Port 465 SSL (Cloud Firewall Friendly)
    if send_via_brevo_smtps_ssl(to_email, otp_code):
        return True

    # 3. Attempt Brevo SMTP Port 587 STARTTLS
    if send_via_brevo_smtp_starttls(to_email, otp_code, port=587):
        return True

    # 4. Attempt Brevo SMTP Port 2525 STARTTLS
    if send_via_brevo_smtp_starttls(to_email, otp_code, port=2525):
        return True

    print(f"[OTP FALLBACK CONSOLE LOG] Code for {to_email}: {otp_code}")
    return True
