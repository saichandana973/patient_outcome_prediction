from fastapi import APIRouter

router = APIRouter()

@router.post("/predict")
def predict_outcome(data: dict):
    age = int(data.get("age", 0))
    predicted_los = age % 10 + 3
    in_hospital_mortality = 20 if age % 2 else 10
    return {
        "patient_id": "12345",
        "predicted_los": predicted_los,
        "in_hospital_mortality": in_hospital_mortality
    }
