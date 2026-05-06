from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import Customer, ServiceCategory, ServiceProvider, User
from schemas.admin import AdminProviderResponse, AdminStatsResponse, AdminUserResponse

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("/providers", response_model=list[AdminProviderResponse])
def list_admin_providers(db: Session = Depends(get_db)) -> list[AdminProviderResponse]:
    statement = (
        select(ServiceProvider, User, ServiceCategory)
        .join(User, ServiceProvider.user_id == User.id)
        .join(ServiceCategory, ServiceProvider.category_id == ServiceCategory.id)
        .order_by(ServiceProvider.created_at.desc())
    )
    rows = db.execute(statement).all()

    return [
        AdminProviderResponse(
            id=provider.id,
            user_id=user.id,
            category_id=category.id,
            provider_name=user.full_name,
            email=user.email,
            category_name=category.name,
            business_name=provider.business_name,
            is_approved=provider.is_approved,
            created_at=provider.created_at,
        )
        for provider, user, category in rows
    ]


@router.get("/users", response_model=list[AdminUserResponse])
def list_admin_users(db: Session = Depends(get_db)) -> list[User]:
    statement = select(User).order_by(User.created_at.desc())
    return list(db.scalars(statement).all())


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)) -> AdminStatsResponse:
    return AdminStatsResponse(
        total_users=count_rows(db, User),
        total_customers=count_rows(db, Customer),
        total_service_providers=count_rows(db, ServiceProvider),
        total_categories=count_rows(db, ServiceCategory),
    )


def count_rows(db: Session, model: type) -> int:
    return db.scalar(select(func.count()).select_from(model)) or 0
