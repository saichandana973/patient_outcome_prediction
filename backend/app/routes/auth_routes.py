from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import users_collection
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

@router.post("/login")
async def login_user(request: LoginRequest):
    # Search user by either username or email
    user = await users_collection.find_one({
        "$or": [
            {"email": request.username_or_email},
            {"username": request.username_or_email}
        ]
    })

    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or email")

    # Verify password
    if not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {"message": "Login successful ✅", "user": {"username": user["username"], "email": user["email"]}}


@router.post("/register")
def register(data: dict):
    email = data.get("email")
    password = data.get("password")
    if email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[email] = {"password": password}
    return {"message": "User registered successfully 🎉"}
