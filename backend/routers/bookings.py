from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_customer
from models import User
from schemas.admin_common import SimpleResponse
from schemas.booking import BookingCreate, BookingOut
from services.bulk_booking_service import create_bulk_bookings
from services.booking_actions import cancel_customer_booking, get_customer_booking
from services.booking_service import create_booking, list_customer_bookings

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def add_booking(
    payload: BookingCreate,
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return create_booking(db, user, payload)


@router.post("/bulk", response_model=list[BookingOut], status_code=status.HTTP_201_CREATED)
def add_bulk_bookings(
    payload: list[BookingCreate],
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return create_bulk_bookings(db, user, payload)


@router.get("/me", response_model=list[BookingOut])
def my_bookings(
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return list_customer_bookings(db, user)


@router.get("/{booking_id}", response_model=BookingOut)
def booking_details(
    booking_id: int,
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return get_customer_booking(db, user, booking_id)


@router.delete("/{booking_id}", response_model=SimpleResponse)
def cancel_booking(
    booking_id: int,
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return cancel_customer_booking(db, user, booking_id)
