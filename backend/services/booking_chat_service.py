from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import Booking, User
from services.message_formatter import conversation_out
from services.message_service import get_conversation, get_or_create_booking_conversation
from services.role_profiles import customer_for_user, provider_for_user


def create_booking_conversation(db: Session, user: User, booking_id: int):
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    guard_booking_chat(db, user, booking)
    conversation = get_or_create_booking_conversation(db, booking)
    db.commit()
    return conversation_out(get_conversation(db, user, conversation.id), user.id)


def guard_booking_chat(db: Session, user: User, booking: Booking) -> None:
    if user.role == "customer" and booking.customer_id == customer_for_user(db, user).id:
        return
    if user.role == "service_provider" and booking.provider_id == provider_for_user(db, user).id:
        return
    raise HTTPException(status_code=403, detail="You cannot open this booking chat.")
