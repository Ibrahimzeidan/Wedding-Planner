from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from category_rules import is_removed_category
from database import get_db
from dependencies import require_admin
from models import ServiceCategory, ServiceProvider, User
from routers.admin.guards import get_or_404
from schemas.admin import AdminProviderResponse
from schemas.admin_common import ProviderUpdate, SimpleResponse
from schemas.admin_response import AdminResponse, ok

router = APIRouter(prefix="/admin/providers", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[AdminProviderResponse]])
def list_providers(
    category_id: int | None = None,
    location: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
):
    query = (
        select(ServiceProvider, User, ServiceCategory)
        .join(User)
        .outerjoin(ServiceCategory)
        .order_by(ServiceProvider.created_at.desc())
    )
    if category_id:
        query = query.where(ServiceProvider.category_id == category_id)
    if location:
        query = query.where(ServiceProvider.location.ilike(f"%{location}%"))
    if status == "approved":
        query = query.where(ServiceProvider.is_approved.is_(True))
    if status in {"pending", "rejected"}:
        query = query.where(ServiceProvider.is_approved.is_(False))
    if status == "active":
        query = query.where(User.is_active.is_(True))
    if status == "inactive":
        query = query.where(User.is_active.is_(False))
    return ok([provider_response(*row) for row in db.execute(query).all()])


@router.get("/{provider_id}", response_model=AdminResponse[AdminProviderResponse])
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    query = select(ServiceProvider, User, ServiceCategory).join(User).outerjoin(ServiceCategory)
    row = db.execute(query.where(ServiceProvider.id == provider_id)).first()
    if not row:
        get_or_404(db, ServiceProvider, provider_id)
    return ok(provider_response(*row))


@router.put("/{provider_id}", response_model=AdminResponse[AdminProviderResponse])
def update_provider(provider_id: int, payload: ProviderUpdate, db: Session = Depends(get_db)):
    provider = get_or_404(db, ServiceProvider, provider_id)
    values = payload.model_dump(exclude_unset=True)
    if "category_id" in values and payload.category_id is None:
        raise HTTPException(status_code=400, detail="Provider category is required.")
    if payload.category_id is not None:
        category = db.get(ServiceCategory, payload.category_id)
        if not category or is_removed_category(category.name):
            raise HTTPException(status_code=404, detail="Category not found.")
    if "is_active" in values:
        provider.user.is_active = values.pop("is_active")
    for field, value in values.items():
        setattr(provider, field, value)
    db.commit()
    return get_provider(provider_id, db)


@router.delete("/{provider_id}", response_model=SimpleResponse)
def delete_provider(provider_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    provider = get_or_404(db, ServiceProvider, provider_id)
    db.delete(provider.user)
    db.commit()
    return SimpleResponse(message="Provider deleted successfully.")


def provider_response(provider: ServiceProvider, user: User, category: ServiceCategory):
    return AdminProviderResponse(
        id=provider.id, user_id=user.id,
        category_id=category.id if category else None,
        provider_name=user.full_name, email=user.email,
        category_name=category.name if category else "Uncategorized",
        business_name=provider.business_name, description=provider.description,
        location=provider.location, phone=provider.phone,
        rating=float(provider.rating) if provider.rating is not None else None,
        is_approved=provider.is_approved, is_active=user.is_active,
        created_at=provider.created_at,
    )
