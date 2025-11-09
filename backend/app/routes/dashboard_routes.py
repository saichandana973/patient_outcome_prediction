# backend/app/routes/dashboard_routes.py
from fastapi import APIRouter, Depends
from app.utils.auth_utils import authorize_roles, get_current_user

router = APIRouter()

# ✅ Admin-only route
@router.get("/admin", tags=["Dashboard"])
async def admin_dashboard(user=Depends(lambda: authorize_roles(["Admin"]))):
    return {
        "message": f"Welcome Admin 👑",
        "user_email": user["email"],
        "role": user["role"]
    }


# ✅ Doctor-only route (also accessible by Admin)
@router.get("/doctor", tags=["Dashboard"])
async def doctor_dashboard(user=Depends(lambda: authorize_roles(["Doctor", "Admin"]))):
    return {
        "message": f"Welcome Doctor 🩺",
        "user_email": user["email"],
        "role": user["role"]
    }


# ✅ Generic user route (any logged-in user)
@router.get("/user", tags=["Dashboard"])
async def user_dashboard(user=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['username']} 👋",
        "user_email": user["email"],
        "role": user["role"]
    }
