from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import ServicePackage, WeddingPackage
from schemas.booking import BookingCreate

PAYMENT_STATUS = {
    "cash": "paid_cash",
    "credit_card": "paid_card",
    "paypal": "paid_paypal",
}


def selected_package(db: Session, payload: BookingCreate):
    if not payload.package_id:
        return None
    package = db.get(ServicePackage, payload.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found.")
    if package.provider_id != payload.provider_id:
        raise HTTPException(status_code=400, detail="Package does not belong to provider.")
    return package


def selected_wedding_package(db: Session, payload: BookingCreate):
    if not payload.wedding_package_id:
        return None
    package = db.get(WeddingPackage, payload.wedding_package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Wedding package not found.")
    return package


def price_for(package: ServicePackage | None, wedding_package: WeddingPackage | None) -> float:
    if package and package.price is not None:
        return float(package.price)
    if wedding_package:
        return float(wedding_package.total_price or 0)
    return 0
