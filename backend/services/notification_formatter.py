from models import Notification
from schemas.notification import NotificationOut


def notification_out(item: Notification) -> NotificationOut:
    return NotificationOut(
        id=item.id,
        user_id=item.user_id,
        title=item.title,
        message=item.message,
        type=item.type,
        is_read=item.is_read,
        related_booking_id=item.related_booking_id,
        related_booking_status=item.related_booking.booking_status if item.related_booking else None,
        related_provider_id=item.related_provider_id,
        created_at=item.created_at,
    )
