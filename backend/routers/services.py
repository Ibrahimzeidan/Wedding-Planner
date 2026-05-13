from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from schemas.service import ServiceCategoryOut, ServicePackageOut
from schemas.service import ServiceProviderDetailOut, ServiceProviderOut
from services.service_query import category_list, get_provider_detail
from services.service_query import list_packages, list_providers

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/categories", response_model=list[ServiceCategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return category_list(db)


@router.get("/providers", response_model=list[ServiceProviderOut])
def get_providers(
    category: str | None = None,
    category_id: int | None = None,
    location: str | None = None,
    rating: float | None = None,
    search: str | None = None,
    limit: int = Query(80, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return list_providers(
        db, category=category, category_id=category_id,
        location=location, rating=rating, search=search, limit=limit,
    )


@router.get("/providers/{provider_id}", response_model=ServiceProviderDetailOut)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = get_provider_detail(db, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found.")
    return provider


@router.get("/packages", response_model=list[ServicePackageOut])
def get_packages(
    category: str | None = None,
    category_id: int | None = None,
    location: str | None = None,
    rating: float | None = None,
    search: str | None = None,
    provider_id: int | None = None,
    db: Session = Depends(get_db),
):
    return list_packages(
        db,
        category=category,
        category_id=category_id,
        location=location,
        rating=rating,
        search=search,
        provider_id=provider_id,
    )
