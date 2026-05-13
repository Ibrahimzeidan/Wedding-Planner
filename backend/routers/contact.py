from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import ContactMessageModel
from schemas.contact import ContactMessage

router = APIRouter()


@router.post("/contact")
def send_contact_message(
    contact_message: ContactMessage,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    db.add(ContactMessageModel(**contact_message.model_dump()))
    db.commit()
    return {"message": "Message sent successfully"}
