from datetime import date, datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Booking

ACTIVE_BOOKING_STATUSES = ("pending", "accepted", "completed")
BOOKING_UNAVAILABLE_MESSAGE = (
    "Someone already booked this service provider on this date. "
    "Please choose another date or provider."
)


def event_day(value: date | datetime | str | None) -> date | None:
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str) and value:
        try:
            return date.fromisoformat(value[:10])
        except ValueError:
            return None
    return None


def is_provider_available(
    provider_id: int,
    event_date: date | datetime | str | None,
    db: Session,
) -> bool:
    day = event_day(event_date)
    if not day:
        return True
    query = (
        select(Booking.id)
        .where(Booking.provider_id == provider_id)
        .where(func.date(Booking.event_date) == day)
        .where(Booking.status.in_(ACTIVE_BOOKING_STATUSES))
        .limit(1)
    )
    return db.scalar(query) is None


def unavailable_provider_ids(
    db: Session,
    event_date: date | datetime | str | None,
) -> set[int]:
    day = event_day(event_date)
    if not day:
        return set()
    query = (
        select(Booking.provider_id)
        .where(Booking.provider_id.is_not(None))
        .where(func.date(Booking.event_date) == day)
        .where(Booking.status.in_(ACTIVE_BOOKING_STATUSES))
    )
    return {provider_id for provider_id in db.scalars(query).all() if provider_id}
