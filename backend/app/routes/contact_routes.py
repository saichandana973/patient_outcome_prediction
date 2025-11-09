from fastapi import APIRouter

router = APIRouter()
contact_messages = []

@router.post("/contact")
def send_message(data: dict):
    contact_messages.append(data)
    return {"message": "Your message has been received 💌", "total": len(contact_messages)}
