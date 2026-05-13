from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import Booking, Customer, ServiceProvider, User, WeddingPackage, WeddingPackageItem
from schemas.booking import BookingCreate
from services.booking_formatter import booking_out
from services.booking_selection import PAYMENT_STATUS, price_for
from services.booking_selection import selected_package, selected_wedding_package
from services.message_service import get_or_create_booking_conversation
from services.notification_service import create_booking_notifications
from services.provider_availability import BOOKING_UNAVAILABLE_MESSAGE, is_provider_available
from services.role_profiles import customer_for_user, provider_for_user


def booking_query():
    return select(Booking).options(
        joinedload(Booking.customer).joinedload(Customer.user),
        joinedload(Booking.provider).joinedload(ServiceProvider.user),
        joinedload(Booking.package),
        joinedload(Booking.wedding_package),
        joinedload(Booking.conversation),
    )


def list_customer_bookings(db: Session, user: User):
    customer = customer_for_user(db, user)
    query = booking_query().where(Booking.customer_id == customer.id)
    return [booking_out(item) for item in db.scalars(query.order_by(Booking.created_at.desc()))]


def list_provider_bookings(db: Session, user: User):
    provider = provider_for_user(db, user)
    query = booking_query().where(Booking.provider_id == provider.id)
    return [booking_out(item) for item in db.scalars(query.order_by(Booking.created_at.desc()))]


def list_admin_bookings(db: Session):
    return [booking_out(item) for item in db.scalars(booking_query().order_by(Booking.created_at.desc()))]


def get_booking(db: Session, booking_id: int) -> Booking:
    booking = db.scalars(booking_query().where(Booking.id == booking_id)).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return booking


def create_booking(db: Session, user: User, payload: BookingCreate):
    customer = customer_for_user(db, user)
    if payload.wedding_package_id:
        return create_wedding_package_bookings(db, customer.id, payload)
    provider = db.get(ServiceProvider, payload.provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found.")
    if not is_provider_available(provider.id, payload.event_date, db):
        return JSONResponse(
            status_code=409,
            content={"success": False, "message": BOOKING_UNAVAILABLE_MESSAGE},
        )
    package = selected_package(db, payload)
    wedding_package = selected_wedding_package(db, payload)
    booking = Booking(
        customer_id=customer.id,
        provider_id=provider.id,
        package_id=package.id if package else None,
        wedding_package_id=wedding_package.id if wedding_package else None,
        event_date=payload.event_date,
        guest_count=payload.guest_count,
        phone_number=payload.phone_number,
        location=payload.location,
        notes=payload.notes,
        total_price=price_for(package, wedding_package),
        payment_method=payload.payment_method,
        payment_status=PAYMENT_STATUS.get(payload.payment_method, "unpaid"),
    )
    db.add(booking)
    db.flush()
    db.refresh(booking)
    get_or_create_booking_conversation(db, booking)
    create_booking_notifications(db, booking)
    db.commit()
    return booking_out(get_booking(db, booking.id))


def create_wedding_package_bookings(db: Session, customer_id: int, payload: BookingCreate):
    wedding_package = selected_wedding_package(db, payload)
    items = package_items(wedding_package)
    if not items:
        raise HTTPException(status_code=400, detail="Wedding package has no service providers.")
    for item in items:
        if not is_provider_available(item.service_provider_id, payload.event_date, db):
            return JSONResponse(
                status_code=409,
                content={"success": False, "message": BOOKING_UNAVAILABLE_MESSAGE},
            )
    bookings = [package_booking(customer_id, payload, wedding_package, item) for item in items]
    db.add_all(bookings)
    db.flush()
    for booking in bookings:
        db.refresh(booking)
        get_or_create_booking_conversation(db, booking)
        create_booking_notifications(db, booking)
    first_id = bookings[0].id
    db.commit()
    return booking_out(get_booking(db, first_id))


def package_items(wedding_package: WeddingPackage) -> list[WeddingPackageItem]:
    seen = set()
    items = []
    for item in wedding_package.items:
        if item.service_provider_id in seen:
            continue
        seen.add(item.service_provider_id)
        items.append(item)
    return items


def package_booking(
    customer_id: int,
    payload: BookingCreate,
    wedding_package: WeddingPackage,
    item: WeddingPackageItem,
) -> Booking:
    return Booking(
        customer_id=customer_id,
        provider_id=item.service_provider_id,
        package_id=item.service_package_id,
        wedding_package_id=wedding_package.id,
        event_date=payload.event_date,
        guest_count=payload.guest_count,
        phone_number=payload.phone_number,
        location=payload.location,
        notes=payload.notes,
        total_price=float(item.item_price or 0),
        payment_method=payload.payment_method,
        payment_status=PAYMENT_STATUS.get(payload.payment_method, "unpaid"),
    )
