# backend/app/utils/auth_utils.py
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.main import decode_access_token
from database.mongodb import users_collection



security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract and validate user from JWT token"""
    token = credentials.credentials
    email = decode_access_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def authorize_roles(allowed_roles: list, user=Depends(get_current_user)):
    """Ensure user has one of the allowed roles"""
    if user.get("role", "").lower() not in [r.lower() for r in allowed_roles]:
        raise HTTPException(status_code=403, detail="Access denied 🚫")
    return user
