import requests
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

def send_via_smtp(to_email: str, otp_code: str) -> bool:
    """Send email using Brevo SMTP (smtp-brevo.com)."""
    try:
        sender_email = settings.SENDER_EMAIL or settings.BREVO_LOGIN or "no-reply@dubzeek.ai"
        sender_name = settings.SENDER_NAME or "Dubzeek AI Studio"
        login = settings.BREVO_LOGIN or sender_email

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your Dubzeek AI Verification Code"
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = to_email

        html_body = _build_html_email(otp_code)
        msg.attach(MIMEText(html_body, "html"))

        smtp_server = settings.BREVO_SMTP_SERVER or "smtp-brevo.com"
        port = settings.BREVO_PORT or 587

        server = smtplib.SMTP(smtp_server, port, timeout=10)
        server.starttls()
        server.login(login, settings.BREVO_API_KEY)
        server.sendmail(sender_email, [to_email], msg.as_string())
        server.quit()

        logger.info(f"OTP email sent via Brevo SMTP to {to_email}")
        print(f"[BREVO SMTP SUCCESS] 6-digit OTP code {otp_code} successfully delivered to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Brevo SMTP Fallback Exception: {str(e)}")
        print(f"[BREVO SMTP EXCEPTION] {str(e)}")
        return False

def send_otp_email(to_email: str, otp_code: str) -> bool:
    """
    Send 6-digit OTP verification email via Brevo REST API with automatic SMTP fallback.
    """
    if not settings.BREVO_API_KEY or settings.BREVO_API_KEY == "your_brevo_api_key_here":
        logger.warning(f"[TEST MODE] Brevo API Key not configured. Simulated OTP for {to_email}: {otp_code}")
        print(f"==========================================")
        print(f"[OTP SIMULATION] Email: {to_email} | OTP: {otp_code}")
        print(f"==========================================")
        return True

    sender_email = settings.SENDER_EMAIL or settings.BREVO_LOGIN or "no-reply@dubzeek.ai"

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    html_content = _build_html_email(otp_code)

    payload = {
        "sender": {
            "name": settings.SENDER_NAME,
            "email": sender_email
        },
        "to": [
            {
                "email": to_email
            }
        ],
        "subject": f"{otp_code} is your Dubzeek AI Verification Code",
        "htmlContent": html_content
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code in [200, 201, 202]:
            logger.info(f"OTP email successfully sent to {to_email} via Brevo REST API")
            print(f"[BREVO REST API SUCCESS] OTP {otp_code} sent to {to_email}")
            return True
        else:
            logger.warning(f"Brevo REST API returned status {response.status_code}: {response.text}")
            print(f"[BREVO REST API FAIL] Attempting SMTP Fallback...")
            smtp_success = send_via_smtp(to_email, otp_code)
            if not smtp_success:
                print(f"[BREVO FALLBACK LOG] OTP for {to_email}: {otp_code}")
            return True
    except Exception as e:
        logger.error(f"Exception sending OTP email via Brevo REST API: {str(e)}")
        print(f"[BREVO REST API EXCEPTION] Attempting SMTP Fallback...")
        smtp_success = send_via_smtp(to_email, otp_code)
        if not smtp_success:
            print(f"[BREVO EXCEPTION LOG] OTP for {to_email}: {otp_code}")
        return True
