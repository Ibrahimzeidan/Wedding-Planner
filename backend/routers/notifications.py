from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import User
from schemas.admin_common import SimpleResponse
from schemas.notification import NotificationOut
from services.notification_service import list_notifications
from services.notification_service import mark_all_notifications_read, mark_notification_read

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=list[NotificationOut])
def get_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_notifications(db, user)


@router.put("/read-all", response_model=SimpleResponse)
def read_all_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = mark_all_notifications_read(db, user)
    return SimpleResponse(message=result["message"])


@router.put("/{notification_id}/read", response_model=NotificationOut)
def read_notification(
    notification_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return mark_notification_read(db, user, notification_id)
