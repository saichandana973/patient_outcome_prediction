import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import random
import time
from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.utils.otp_utils import send_email_otp, verify_email_otp

from app.utils.report_utils import generate_user_report
from app.services.model_service import infer as model_infer

from database.mongodb import users_collection, predictions_collection, contacts_collection

# ------------------------------------------
# Load GAT + LSTM Model (once available)
# ------------------------------------------
from app.models.load_model import load_gatlstm_model
import torch

gat_lstm_model = None
try:
    gat_lstm_model = load_gatlstm_model("app/models/gatlstm_model.pth")
except Exception as e:
    print("⚠️ Model not loaded yet:", e)


# ------------------------------------------
# Load environment
# ------------------------------------------
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "team_eicu_secret_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour validity

# ------------------------------------------
# Password / JWT utilities
# ------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "sub": data.get("sub")})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

# ------------------------------------------
# App init + Swagger auth config
# ------------------------------------------
app = FastAPI(
    title="Patient Outcome Prediction",
    description="API with JWT Bearer Authentication 🔒",
    version="1.0.0",
)

# ------------------------------------------
# Security setup for JWT
# ------------------------------------------
security = HTTPBearer()

# ✅ Swagger configuration (Authorize button)
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Patient Outcome Prediction",
        version="1.0.0",
        description="API with JWT Bearer Authentication 🔒",
        routes=app.routes,
    )

    # Define BearerAuth scheme for Swagger
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Paste your token as: **Bearer <token>**"
        }
    }

    # Only protect /predict endpoint
    for path in openapi_schema["paths"]:
        if path == "/predict":
            for method in openapi_schema["paths"][path]:
                openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# ------------------------------------------
# CORS
# ------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------
# Root
# ------------------------------------------
@app.get("/")
def read_root():
    return {"message": "Backend running successfully 🚀"}

# ------------------------------------------
# Register
# ------------------------------------------
@app.post("/register")
async def register(data: dict):
    email = data.get("email")
    password = data.get("password")
    username = data.get("username") or (email.split("@")[0] if email else None)
    role = data.get("role", "Patient")
    hospital = data.get("hospital", "N/A")
    designation = data.get("designation", "")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(password)
    prefix = "D" if role.lower() == "doctor" else "P"
    patient_id = f"{prefix}{int(time.time() * 1000) % 100000}"

    new_user = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "role": role,
        "hospital": hospital,
        "designation": designation,
        "patient_id": patient_id,
        "is_verified": False
    }
    await users_collection.insert_one(new_user)

    return {
        "message": "User registered successfully 🎉",
        "user": {
            "email": email,
            "username": username,
            "role": role,
            "patient_id": patient_id,
        },
    }

# ------------------------------------------
# OTP Email
# ------------------------------------------
@app.post("/email-otp")
def send_otp_email(data: dict):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    result = send_email_otp(email)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

# ------------------------------------------
# Verify OTP
# ------------------------------------------
@app.post("/verify-otp")
async def verify_otp(data: dict):
    email = data.get("email")
    otp = data.get("otp")
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    result = verify_email_otp(email, otp)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    update_result = await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )

    if update_result.matched_count == 0:
        return {"message": "✅ OTP verified, but no matching user found in database."}

    return {"message": "✅ OTP verified successfully!"}

# ------------------------------------------
# Login
# ------------------------------------------
@app.post("/login")
async def login(data: dict):
    identifier = data.get("username_or_email")
    password = data.get("password")

    if not identifier or not password:
        raise HTTPException(status_code=400, detail="Email/Username and password are required")

    user = await users_collection.find_one(
        {"$or": [{"email": identifier}, {"username": identifier}]}
    )

    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email/username or password")

    if not user.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email first.")

    token = create_access_token({"sub": user["email"]})

    return {
        "message": "Login successful ✅",
        "token": token,
        "user": {
            "email": user["email"],
            "username": user["username"],
            "role": user.get("role", "Patient"),
            "patient_id": user.get("patient_id", None),
        },
    }

# ------------------------------------------
# Contact
# ------------------------------------------
@app.post("/contact")
async def contact_us(data: dict):
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        raise HTTPException(status_code=400, detail="Name, email, and message are required")

    try:
        await contacts_collection.insert_one({
            "name": name,
            "email": email,
            "message": message,
            "timestamp": int(time.time())
        })
    except Exception:
        pass

    return {"message": "Your message has been received 💌"}

# ------------------------------------------
# Prediction (JWT Protected) - now uses model_service
# ------------------------------------------
@app.post("/predict")
async def predict_outcome(data: dict):
    # 🧠 Temporarily skipping JWT for testing
    email = data.get("email", "testuser@gmail.com")

    try:
        age = int(data.get("age", 0))
        heart_rate = int(data.get("heart_rate", 80))
        systolic_bp = int(data.get("systolic_bp", 120))
        respiratory_rate = int(data.get("respiratory_rate", 16))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid input data")

    predicted_los = round((age % 7) + (heart_rate / 100) + random.uniform(0.5, 2.0), 1)
    ihm_score = min(
        100,
        max(0, (respiratory_rate * 1.2) + (age / 5) - (systolic_bp / 10) + random.uniform(-5, 5)),
    )
    risk_level = "High" if ihm_score > 60 else "Moderate" if ihm_score > 30 else "Low"

    # 🧠 Added print lines here
    print("🧠 Saving prediction to MongoDB for:", email)

    result = await predictions_collection.insert_one({
        "email": email,
        "predicted_LOS_days": predicted_los,
        "in_hospital_mortality_%": round(ihm_score, 2),
        "mortality_risk_level": risk_level,
        "timestamp": int(time.time())
    })

    print("✅ Prediction inserted with ID:", result.inserted_id)

    return {
        "patient_id": f"P{random.randint(1000, 9999)}",
        "predicted_LOS_days": predicted_los,
        "in_hospital_mortality_%": round(ihm_score, 2),
        "mortality_risk_level": risk_level,
        "message": "✅ Prediction successful (secured with JWT)"
    }


# ------------------------------------------
# User History - Fetch all predictions by email
# ------------------------------------------
@app.get("/user/history")
async def get_user_history(email: str):
    predictions = await predictions_collection.find({"email": email}).to_list(length=None)
    
    if not predictions:
        raise HTTPException(status_code=404, detail="No predictions found for this user")
    
    # Optional: clean up ObjectId for readability
    for p in predictions:
        p["_id"] = str(p["_id"])
    
    return {
        "email": email,
        "total_predictions": len(predictions),
        "predictions": predictions
    }
# ------------------------------------------
# Doctor: List all patient predictions
# ------------------------------------------
@app.get("/doctor/patients")
async def doctor_patients():
    # Return basic details for doctor dashboard
    preds = await predictions_collection.find().to_list(length=None)
    if not preds:
        return {"total": 0, "patients": []}

    # Clean ObjectId and return subset of useful fields
    patients = []
    for p in preds:
        patients.append({
            "id": str(p.get("_id")),
            "email": p.get("email"),
            "predicted_LOS_days": p.get("predicted_LOS_days"),
            "in_hospital_mortality_%": p.get("in_hospital_mortality_%"),
            "mortality_risk_level": p.get("mortality_risk_level"),
            "timestamp": p.get("timestamp")
        })

    return {"total": len(patients), "patients": patients}

# ------------------------------------------
# Admin: System Analytics Dashboard
# ------------------------------------------
@app.get("/admin/analytics")
async def admin_analytics():
    # Count totals
    total_users = await users_collection.count_documents({})
    total_predictions = await predictions_collection.count_documents({})
    total_doctors = await users_collection.count_documents({"role": "Doctor"})
    total_patients = await users_collection.count_documents({"role": "Patient"})

    # Get last 5 predictions
    recent_preds = await predictions_collection.find().sort("timestamp", -1).limit(5).to_list(length=None)

    recent_activity = []
    for p in recent_preds:
        recent_activity.append({
            "email": p.get("email"),
            "los_days": p.get("predicted_LOS_days"),
            "mortality_%": p.get("in_hospital_mortality_%"),
            "risk_level": p.get("mortality_risk_level"),
            "timestamp": p.get("timestamp")
        })

    return {
        "summary": {
            "total_users": total_users,
            "total_doctors": total_doctors,
            "total_patients": total_patients,
            "total_predictions": total_predictions
        },
        "recent_predictions": recent_activity
    }
# ------------------------------------------
# User: Download Prediction Report (CSV)
# ------------------------------------------
@app.get("/user/download-report")
async def download_user_report(email: str):
    # Fetch all predictions for the user
    predictions = await predictions_collection.find({"email": email}).to_list(length=None)

    if not predictions:
        return {"message": f"No predictions found for {email}"}

    print(f"📄 Generating report for {email} with {len(predictions)} entries...")
    return await generate_user_report(predictions, email)
# ------------------------------------------
# Include Admin Routes
# ------------------------------------------
from app.routes import admin_routes
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])
# ------------------------------------------
# Include Dashboard Routes
# ------------------------------------------
from app.routes import dashboard_routes
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])
