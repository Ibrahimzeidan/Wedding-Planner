from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import WeddingPackage
from schemas.wedding_package import WeddingPackageOut
from services.wedding_package_service import get_wedding_package, wedding_out, wedding_query

router = APIRouter(prefix="/packages", tags=["Wedding Packages"])


@router.get("", response_model=list[WeddingPackageOut])
def list_packages(
    min_price: float | None = None,
    max_price: float | None = None,
    guests: int | None = None,
    db: Session = Depends(get_db),
):
    query = wedding_query(active_only=True).order_by(WeddingPackage.created_at.desc())
    if min_price is not None:
        query = query.where(WeddingPackage.total_price >= min_price)
    if max_price is not None:
        query = query.where(WeddingPackage.total_price <= max_price)
    if guests is not None:
        query = query.where(WeddingPackage.guest_capacity >= guests)
    return [wedding_out(item) for item in db.scalars(query).unique().all()]


@router.get("/{package_id}", response_model=WeddingPackageOut)
def get_package(package_id: int, db: Session = Depends(get_db)):
    return wedding_out(get_wedding_package(db, package_id, active_only=True))
