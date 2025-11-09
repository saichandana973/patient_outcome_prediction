# backend/app/services/model_service.py
import random
from datetime import datetime

# --- placeholder model loader ---
def load_model():
    # If you later have a torch model, load it here.
    # e.g. return torch.jit.load("path/to/model.pt")
    return None

MODEL = load_model()

# --- dummy inference function (safe & deterministic-ish) ---
def infer(input_data: dict) -> dict:
    """
    input_data expected keys: age, heart_rate, systolic_bp, respiratory_rate
    Returns a dict with predicted_LOS_days, in_hospital_mortality_%, mortality_risk_level, timestamp
    """
    try:
        age = float(input_data.get("age", 0))
        heart_rate = float(input_data.get("heart_rate", 80))
        systolic_bp = float(input_data.get("systolic_bp", 120))
        respiratory_rate = float(input_data.get("respiratory_rate", 16))
    except (TypeError, ValueError):
        # fallback safe defaults
        age, heart_rate, systolic_bp, respiratory_rate = 0.0, 80.0, 120.0, 16.0

    # Simple, clear placeholder logic (your real model will replace this)
    predicted_los = round((age % 7) + (heart_rate / 100.0) + random.uniform(0.5, 2.0), 1)
    ihm_score = min(
        100.0,
        max(0.0, (respiratory_rate * 1.2) + (age / 5.0) - (systolic_bp / 10.0) + random.uniform(-5, 5))
    )
    risk = "High" if ihm_score > 60 else "Moderate" if ihm_score > 30 else "Low"

    return {
        "predicted_LOS_days": predicted_los,
        "in_hospital_mortality_%": round(ihm_score, 2),
        "mortality_risk_level": risk,
        "timestamp": datetime.utcnow().isoformat()
    }
