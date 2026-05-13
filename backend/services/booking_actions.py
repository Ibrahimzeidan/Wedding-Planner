from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import Booking, User
from schemas.booking import BookingAdminUpdate, BookingProviderResponse, BookingStatusUpdate
from services.booking_formatter import booking_out
from services.booking_service import get_booking
from services.notification_service import create_notification
from services.role_profiles import customer_for_user, provider_for_user

def sync_status(booking: Booking, status: str) -> None:
    booking.booking_status = status
    booking.status = status

def get_customer_booking(db: Session, user: User, booking_id: int):
    customer = customer_for_user(db, user)
    booking = get_booking(db, booking_id)
    if booking.customer_id != customer.id:
        raise HTTPException(status_code=403, detail="You cannot access this booking.")
    return booking_out(booking)

def cancel_customer_booking(db: Session, user: User, booking_id: int):
    customer = customer_for_user(db, user)
    booking = get_booking(db, booking_id)
    if booking.customer_id != customer.id:
        raise HTTPException(status_code=403, detail="You cannot cancel this booking.")
    sync_status(booking, "cancelled")
    db.commit()
    return {"message": "Booking cancelled successfully."}

def accept_provider_booking(db: Session, user: User, booking_id: int, payload: BookingProviderResponse):
    booking = provider_booking(db, user, booking_id)
    booking.provider_response_note = payload.provider_response_note
    booking.provider_confirmed = True
    sync_status(booking, "accepted")
    notify_customer(db, booking, "Booking Accepted", "Your booking was accepted by the service provider.", "booking_accepted")
    db.commit()
    return booking_out(get_booking(db, booking.id))

def reject_provider_booking(db: Session, user: User, booking_id: int, payload: BookingProviderResponse):
    booking = provider_booking(db, user, booking_id)
    booking.provider_response_note = payload.provider_response_note
    booking.provider_confirmed = False
    sync_status(booking, "rejected")
    notify_customer(db, booking, "Booking Rejected", "Your booking was rejected. AI can suggest another option.", "booking_rejected")
    db.commit()
    return booking_out(get_booking(db, booking.id))

def complete_provider_booking(db: Session, user: User, booking_id: int):
    booking = provider_booking(db, user, booking_id)
    sync_status(booking, "completed")
    notify_customer(db, booking, "Feedback Available", "Your wedding service is completed. You can now leave feedback.", "review_available")
    db.commit()
    return booking_out(get_booking(db, booking.id))

def update_provider_booking(db: Session, user: User, booking_id: int, payload: BookingStatusUpdate):
    note = BookingProviderResponse(provider_response_note=payload.provider_response_note)
    if payload.booking_status == "accepted":
        return accept_provider_booking(db, user, booking_id, note)
    if payload.booking_status == "rejected":
        return reject_provider_booking(db, user, booking_id, note)
    if payload.booking_status == "completed":
        return complete_provider_booking(db, user, booking_id)
    raise HTTPException(status_code=400, detail="Provider can only accept, reject, or complete.")

def update_admin_booking(db: Session, booking_id: int, payload: BookingAdminUpdate):
    booking = get_booking(db, booking_id)
    if payload.booking_status:
        sync_status(booking, payload.booking_status)
    if payload.payment_status:
        booking.payment_status = payload.payment_status
    db.commit()
    return booking_out(get_booking(db, booking.id))

def provider_booking(db: Session, user: User, booking_id: int) -> Booking:
    provider = provider_for_user(db, user)
    booking = get_booking(db, booking_id)
    if booking.provider_id != provider.id:
        raise HTTPException(status_code=403, detail="You cannot update this booking.")
    return booking

def notify_customer(db: Session, booking: Booking, title: str, message: str, type: str) -> None:
    create_notification(db, booking.customer.user_id, title, message, type, booking.id, booking.provider_id)
