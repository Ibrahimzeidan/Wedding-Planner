from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_service_provider
from models import User
from schemas.booking import BookingOut, BookingProviderResponse, BookingStatusUpdate
from services.booking_actions import accept_provider_booking, complete_provider_booking
from services.booking_actions import reject_provider_booking, update_provider_booking
from services.booking_service import list_provider_bookings

router = APIRouter(prefix="/provider/bookings", tags=["Provider Bookings"])


@router.get("", response_model=list[BookingOut])
def get_provider_bookings(
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return list_provider_bookings(db, user)


@router.put("/{booking_id}", response_model=BookingOut)
def edit_provider_booking(
    booking_id: int,
    payload: BookingStatusUpdate,
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return update_provider_booking(db, user, booking_id, payload)


@router.put("/{booking_id}/accept", response_model=BookingOut)
def accept_booking(
    booking_id: int,
    payload: BookingProviderResponse = BookingProviderResponse(),
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return accept_provider_booking(db, user, booking_id, payload)


@router.put("/{booking_id}/reject", response_model=BookingOut)
def reject_booking(
    booking_id: int,
    payload: BookingProviderResponse = BookingProviderResponse(),
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return reject_provider_booking(db, user, booking_id, payload)


@router.put("/{booking_id}/complete", response_model=BookingOut)
def complete_booking(
    booking_id: int,
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return complete_provider_booking(db, user, booking_id)
