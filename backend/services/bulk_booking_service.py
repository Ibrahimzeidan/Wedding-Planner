from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from models import Booking, ServiceProvider, User
from schemas.booking import BookingCreate
from services.booking_formatter import booking_out
from services.booking_selection import PAYMENT_STATUS, price_for, selected_package
from services.booking_selection import selected_wedding_package
from services.booking_service import get_booking
from services.notification_service import create_booking_notifications
from services.provider_availability import BOOKING_UNAVAILABLE_MESSAGE, is_provider_available
from services.role_profiles import customer_for_user


def create_bulk_bookings(db: Session, user: User, payloads: list[BookingCreate]):
    if not payloads:
        raise HTTPException(status_code=400, detail="Choose at least one provider.")
    customer = customer_for_user(db, user)
    seen = set()
    prepared = []
    for payload in payloads:
        key = (payload.provider_id, payload.event_date.date())
        if key in seen or not is_provider_available(payload.provider_id, payload.event_date, db):
            return unavailable_response()
        seen.add(key)
        provider = db.get(ServiceProvider, payload.provider_id)
        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found.")
        prepared.append((payload, selected_package(db, payload), selected_wedding_package(db, payload)))
    bookings = [build_booking(customer.id, payload, package, wedding) for payload, package, wedding in prepared]
    db.add_all(bookings)
    db.flush()
    for booking in bookings:
        create_booking_notifications(db, booking)
    ids = [booking.id for booking in bookings]
    db.commit()
    return [booking_out(get_booking(db, booking_id)) for booking_id in ids]


def build_booking(customer_id: int, payload: BookingCreate, package, wedding) -> Booking:
    return Booking(
        customer_id=customer_id,
        provider_id=payload.provider_id,
        package_id=package.id if package else None,
        wedding_package_id=wedding.id if wedding else None,
        event_date=payload.event_date,
        guest_count=payload.guest_count,
        phone_number=payload.phone_number,
        location=payload.location,
        notes=payload.notes,
        total_price=price_for(package, wedding),
        payment_method=payload.payment_method,
        payment_status=PAYMENT_STATUS.get(payload.payment_method, "unpaid"),
    )


def unavailable_response() -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"success": False, "message": BOOKING_UNAVAILABLE_MESSAGE},
    )
