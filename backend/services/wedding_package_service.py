from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import ServicePackage, ServiceProvider, WeddingPackage, WeddingPackageItem
from schemas.wedding_package import WeddingPackageItemCreate, WeddingPackageItemOut, WeddingPackageOut


def wedding_query(active_only: bool = False):
    query = select(WeddingPackage).options(
        joinedload(WeddingPackage.items).joinedload(WeddingPackageItem.service_provider)
        .joinedload(ServiceProvider.user),
        joinedload(WeddingPackage.items).joinedload(WeddingPackageItem.service_provider)
        .joinedload(ServiceProvider.category),
        joinedload(WeddingPackage.items).joinedload(WeddingPackageItem.service_package),
    )
    return query.where(WeddingPackage.is_active.is_(True)) if active_only else query


def get_wedding_package(db: Session, package_id: int, active_only: bool = False):
    query = wedding_query(active_only).where(WeddingPackage.id == package_id)
    package = db.scalars(query).unique().first()
    if not package:
        raise HTTPException(status_code=404, detail="Wedding package not found.")
    return package


def wedding_out(package: WeddingPackage) -> WeddingPackageOut:
    return WeddingPackageOut(
        id=package.id, title=package.title, description=package.description,
        total_price=float(package.total_price), image_url=package.image_url,
        guest_capacity=package.guest_capacity, is_active=package.is_active,
        created_at=package.created_at, items=[item_out(item) for item in package.items],
    )


def item_out(item: WeddingPackageItem) -> WeddingPackageItemOut:
    provider = item.service_provider
    package = item.service_package
    return WeddingPackageItemOut(
        id=item.id, service_provider_id=item.service_provider_id,
        service_package_id=item.service_package_id, category_name=item.category_name,
        item_price=float(item.item_price), provider_name=provider_name(provider),
        provider_image=provider.user.profile_image if provider and provider.user else None,
        provider_location=provider.location if provider else None,
        provider_category=provider.category.name if provider and provider.category else None,
        package_title=package.title if package else None,
    )


def provider_name(provider: ServiceProvider | None) -> str | None:
    if not provider:
        return None
    return provider.business_name or provider.user.full_name if provider.user else None


def create_item(db: Session, wedding_id: int, payload: WeddingPackageItemCreate):
    get_wedding_package(db, wedding_id)
    if not db.get(ServiceProvider, payload.service_provider_id):
        raise HTTPException(status_code=404, detail="Provider not found.")
    if payload.service_package_id and not db.get(ServicePackage, payload.service_package_id):
        raise HTTPException(status_code=404, detail="Service package not found.")
    item = WeddingPackageItem(wedding_package_id=wedding_id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
