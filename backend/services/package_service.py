from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import ServicePackage, ServiceProvider, User
from schemas.package import PackageCreate, PackageOut, PackageUpdate


def provider_for_user(db: Session, user: User) -> ServiceProvider:
    provider = db.scalar(select(ServiceProvider).where(ServiceProvider.user_id == user.id))
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found.")
    return provider


def package_query():
    return select(ServicePackage).options(
        joinedload(ServicePackage.provider).joinedload(ServiceProvider.user),
        joinedload(ServicePackage.provider).joinedload(ServiceProvider.category),
    )


def list_provider_packages(db: Session, provider_id: int) -> list[PackageOut]:
    query = package_query().where(ServicePackage.provider_id == provider_id)
    return [package_out(item) for item in db.scalars(query).unique().all()]


def create_package(db: Session, payload: PackageCreate, provider_id: int) -> PackageOut:
    package = ServicePackage(provider_id=provider_id, **payload.model_dump(exclude={"provider_id"}))
    db.add(package)
    db.commit()
    db.refresh(package)
    return package_out(db.get(ServicePackage, package.id))


def update_package(db: Session, package: ServicePackage, payload: PackageUpdate) -> PackageOut:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(package, field, value)
    db.commit()
    db.refresh(package)
    return package_out(package)


def owned_package(db: Session, package_id: int, provider_id: int) -> ServicePackage:
    package = db.get(ServicePackage, package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found.")
    if package.provider_id != provider_id:
        raise HTTPException(status_code=403, detail="You can only manage your own packages.")
    return package


def package_out(package: ServicePackage) -> PackageOut:
    provider = package.provider
    return PackageOut(
        id=package.id, provider_id=package.provider_id,
        provider_name=provider.business_name if provider else None,
        category_name=provider.category.name if provider and provider.category else None,
        title=package.title, description=package.description,
        price=float(package.price) if package.price is not None else None,
        capacity=package.capacity, duration=package.duration, image_url=package.image_url,
        is_available=package.is_available, is_active=package.is_active,
        created_at=package.created_at,
    )
