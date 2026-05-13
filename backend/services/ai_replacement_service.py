from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import Booking, ServicePackage, ServiceProvider, User
from schemas.ai import AIReplacementData, AIReplacementResponse
from services.notification_service import create_notification
from services.provider_availability import unavailable_provider_ids
from services.role_profiles import customer_for_user


def find_replacement_provider(db: Session, user: User, booking_id: int) -> AIReplacementResponse:
    customer = customer_for_user(db, user)
    booking = db.get(Booking, booking_id)
    if not booking or booking.customer_id != customer.id:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if booking.booking_status != "rejected" or not booking.provider:
        raise HTTPException(status_code=400, detail="Replacement is available after rejection.")
    choices = replacement_candidates(db, booking)
    if not choices:
        return AIReplacementResponse(
            success=False,
            message="No similar available provider found. Try changing the date or budget.",
        )
    data = replacement_data(choices[0], booking)
    create_notification(
        db, user.id, "AI Found an Alternative",
        "A similar provider is available for your rejected booking.",
        "ai_replacement_suggestion", booking.id, data.provider_id,
    )
    db.commit()
    return AIReplacementResponse(success=True, message="Alternative provider found.", data=data)


def replacement_candidates(db: Session, booking: Booking) -> list[ServicePackage]:
    category_id = booking.provider.category_id
    blocked = unavailable_provider_ids(db, booking.event_date) | {booking.provider_id}
    query = (
        select(ServicePackage)
        .join(ServicePackage.provider)
        .outerjoin(ServiceProvider.category)
        .options(joinedload(ServicePackage.provider).joinedload(ServiceProvider.category))
        .where(ServiceProvider.is_approved.is_(True))
        .where(ServiceProvider.category_id == category_id)
        .where(ServicePackage.is_active.is_(True), ServicePackage.is_available.is_(True))
        .where(ServicePackage.provider_id.not_in(blocked))
    )
    packages = db.scalars(query).unique().all()
    return sorted(packages, key=lambda item: replacement_score(item, booking))


def replacement_score(package: ServicePackage, booking: Booking) -> tuple:
    provider = package.provider
    target_price = float(booking.total_price or 0)
    price = float(package.price or 0)
    same_location = bool(booking.location and provider.location and booking.location.lower() in provider.location.lower())
    rating_gap = max(0, float(booking.provider.rating or 0) - float(provider.rating or 0))
    price_gap = abs(price - target_price)
    return (0 if same_location else 1, rating_gap, price_gap, -float(provider.rating or 0))


def replacement_data(package: ServicePackage, booking: Booking) -> AIReplacementData:
    provider = package.provider
    category = provider.category.name if provider.category else "Service"
    rejected = booking.provider.business_name or booking.provider.user.full_name
    reason = (
        f"{rejected} rejected your booking, so this similar {category.lower()} "
        "was selected based on price, location, rating, and availability."
    )
    return AIReplacementData(
        category=category, provider_id=provider.id, package_id=package.id,
        provider=provider.business_name or provider.user.full_name,
        package=package.title, price=float(package.price or 0), reason=reason,
        rating=float(provider.rating or 0), location=provider.location,
        capacity=package.capacity or provider.max_guests,
    )
