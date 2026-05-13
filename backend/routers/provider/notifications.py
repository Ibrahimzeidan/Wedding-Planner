from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_service_provider
from models import User
from schemas.notification import NotificationOut
from services.notification_service import list_provider_notifications, mark_notification_read

router = APIRouter(prefix="/provider/notifications", tags=["Provider Notifications"])


@router.get("", response_model=list[NotificationOut])
def get_notifications(
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return list_provider_notifications(db, user)


@router.put("/{notification_id}/read", response_model=NotificationOut)
def read_notification(
    notification_id: int,
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    return mark_notification_read(db, user, notification_id)
