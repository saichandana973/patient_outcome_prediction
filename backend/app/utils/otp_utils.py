# backend/app/utils/otp_utils.py
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os, random, time

load_dotenv()

otp_store = {}  # temporary in-memory OTP store


def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))


def send_email_otp(receiver_email: str):
    """Send OTP to the user's email"""
    sender_email = os.getenv("EMAIL_ID")
    app_password = os.getenv("EMAIL_APP_PASSWORD")

    if not sender_email or not app_password:
        return {"error": "Email credentials not found in .env"}

    otp = generate_otp()
    expiry = time.time() + 120  # 2 minutes
    otp_store[receiver_email] = {"otp": otp, "expiry": expiry}

    subject = "Your Verification OTP"
    body = (
        f"Hello 👋,\n\n"
        f"Your OTP for verification is: {otp}\n"
        f"This OTP is valid for 2 minutes.\n\n"
        f"Regards,\nTeam EICU"

    )

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.send_message(msg)
        print(f"✅ OTP sent to {receiver_email}")
        return {"message": "OTP sent successfully to email!"}
    except Exception as e:
        print("❌ Email error:", e)
        return {"error": str(e)}


def verify_email_otp(email: str, otp: str):
    """Verify OTP"""
    stored = otp_store.get(email)
    if not stored:
        return {"error": "No OTP found. Please request again."}
    if time.time() > stored["expiry"]:
        del otp_store[email]
        return {"error": "OTP expired. Please request a new one."}
    if stored["otp"] != otp:
        return {"error": "Invalid OTP"}
    del otp_store[email]
    return {"message": "✅ OTP verified successfully!"}
