# backend/app/routes/admin_routes.py
from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth_utils import authorize_roles
from database.mongodb import users_collection, predictions_collection

from bson import ObjectId

router = APIRouter()

# ✅ Get all users (Admin only)
@router.get("/users", tags=["Admin"])
async def get_all_users(user=Depends(lambda: authorize_roles(["Admin"]))):
    users = await users_collection.find({}, {"password": 0}).to_list(length=500)
    return {"count": len(users), "users": users}


# ✅ Update user role (Admin only)
@router.put("/users/{user_id}/role", tags=["Admin"])
async def update_user_role(user_id: str, data: dict, user=Depends(lambda: authorize_roles(["Admin"]))):
    new_role = data.get("role")
    if new_role not in ["Admin", "Doctor", "Patient", "User"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": new_role}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"User role updated to {new_role}"}


# ✅ Delete user (Admin only)
@router.delete("/users/{user_id}", tags=["Admin"])
async def delete_user(user_id: str, user=Depends(lambda: authorize_roles(["Admin"]))):
    result = await users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


# ✅ Get all predictions (Admin only)
@router.get("/predictions", tags=["Admin"])
async def get_all_predictions(user=Depends(lambda: authorize_roles(["Admin"]))):
    preds = await predictions_collection.find().to_list(length=1000)
    return {"count": len(preds), "predictions": preds}
