from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Booking, Notification, ServiceProvider, User
from schemas.notification import NotificationOut
from services.notification_formatter import notification_out
from services.role_profiles import provider_for_user


def create_notification(db: Session, user_id: int, title: str, message: str, type: str,
                        related_booking_id: int | None = None,
                        related_provider_id: int | None = None) -> Notification:
    item = Notification(
        user_id=user_id, title=title, message=message, type=type,
        related_booking_id=related_booking_id, related_provider_id=related_provider_id,
    )
    db.add(item)
    return item


def provider_recipients(db: Session, booking: Booking) -> list[int]:
    return [booking.provider_id] if booking.provider_id else []


def create_booking_notifications(db: Session, booking: Booking) -> None:
    for provider_id in provider_recipients(db, booking):
        provider = booking.provider if provider_id == booking.provider_id else db.get(ServiceProvider, provider_id)
        if provider:
            create_notification(
                db, provider.user_id, "New Booking Request",
                "You received a new booking request.", "booking_created",
                booking.id, provider_id,
            )


def list_notifications(db: Session, user: User) -> list[NotificationOut]:
    query = select(Notification).where(Notification.user_id == user.id)
    return [notification_out(item) for item in db.scalars(query.order_by(Notification.created_at.desc()))]


def mark_notification_read(db: Session, user: User, notification_id: int) -> NotificationOut:
    item = db.get(Notification, notification_id)
    if not item or item.user_id != user.id:
        raise HTTPException(status_code=404, detail="Notification not found.")
    item.is_read = True
    db.commit()
    db.refresh(item)
    return notification_out(item)


def mark_all_notifications_read(db: Session, user: User) -> dict[str, str]:
    for item in db.scalars(select(Notification).where(Notification.user_id == user.id)):
        item.is_read = True
    db.commit()
    return {"message": "Notifications marked as read."}


def list_provider_notifications(db: Session, user: User) -> list[NotificationOut]:
    provider_for_user(db, user)
    return list_notifications(db, user)
