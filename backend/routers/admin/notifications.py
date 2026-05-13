from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import Notification
from routers.admin.guards import get_or_404
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.notification import NotificationOut
from services.notification_formatter import notification_out

router = APIRouter(prefix="/admin/notifications", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[NotificationOut]])
def list_admin_notifications(db: Session = Depends(get_db)):
    query = select(Notification).order_by(Notification.created_at.desc())
    return ok([notification_out(item) for item in db.scalars(query)])


@router.put("/{notification_id}/read", response_model=AdminResponse[NotificationOut])
def mark_admin_notification_read(notification_id: int, db: Session = Depends(get_db)):
    item = get_or_404(db, Notification, notification_id)
    item.is_read = True
    db.commit()
    db.refresh(item)
    return ok(notification_out(item), "Notification marked as read")


@router.delete("/{notification_id}", response_model=SimpleResponse)
def delete_admin_notification(notification_id: int, db: Session = Depends(get_db)):
    db.delete(get_or_404(db, Notification, notification_id))
    db.commit()
    return SimpleResponse(message="Notification deleted successfully.")
