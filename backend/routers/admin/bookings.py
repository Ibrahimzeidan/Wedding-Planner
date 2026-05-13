from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.booking import BookingAdminUpdate, BookingOut
from services.booking_actions import update_admin_booking
from services.booking_service import get_booking, list_admin_bookings

router = APIRouter(prefix="/admin/bookings", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[BookingOut]])
def list_bookings(
    status: str | None = None,
    provider_id: int | None = None,
    customer_id: int | None = None,
    date: str | None = None,
    db: Session = Depends(get_db),
):
    rows = list_admin_bookings(db)
    if status:
        rows = [item for item in rows if item.booking_status == status]
    if provider_id:
        rows = [item for item in rows if item.provider_id == provider_id]
    if customer_id:
        rows = [item for item in rows if item.customer_id == customer_id]
    if date:
        rows = [item for item in rows if item.event_date and item.event_date.date().isoformat() == date]
    return ok(rows)


@router.get("/{booking_id}", response_model=AdminResponse[BookingOut])
def get_admin_booking(booking_id: int, db: Session = Depends(get_db)):
    return ok(get_booking(db, booking_id))


@router.put("/{booking_id}", response_model=AdminResponse[BookingOut])
def update_booking(
    booking_id: int,
    payload: BookingAdminUpdate,
    db: Session = Depends(get_db),
):
    return ok(update_admin_booking(db, booking_id, payload), "Booking updated successfully")


@router.delete("/{booking_id}", response_model=SimpleResponse)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = get_booking(db, booking_id)
    db.delete(booking)
    db.commit()
    return SimpleResponse(message="Booking deleted successfully.")
