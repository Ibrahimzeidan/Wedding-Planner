from fastapi import APIRouter

from schemas.contact import ContactMessage

router = APIRouter()


@router.post("/contact")
def send_contact_message(contact_message: ContactMessage) -> dict[str, str]:
    # The message is accepted here. Saving or emailing it can be added later.
    return {"message": "Message sent successfully"}
