from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import Booking, Customer, Message, Review, ServiceCategory, ServicePackage
from models import ServiceProvider, User, WeddingPackage, WeddingPlan
from schemas.admin import AdminStatsResponse
from schemas.admin_response import AdminResponse, ok

router = APIRouter(prefix="/admin/stats", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[AdminStatsResponse])
def get_admin_stats(db: Session = Depends(get_db)):
    data = AdminStatsResponse(
        total_users=count_rows(db, User),
        total_customers=count_rows(db, Customer),
        total_service_providers=count_rows(db, ServiceProvider),
        total_categories=count_rows(db, ServiceCategory),
        total_packages=count_rows(db, ServicePackage),
        total_wedding_packages=count_rows(db, WeddingPackage),
        total_wedding_plans=count_rows(db, WeddingPlan),
        total_bookings=count_rows(db, Booking),
        total_messages=count_rows(db, Message),
        total_reviews=count_rows(db, Review),
    )
    return ok(data)


def count_rows(db: Session, model: type) -> int:
    return db.scalar(select(func.count()).select_from(model)) or 0
