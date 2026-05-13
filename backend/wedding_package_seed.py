from sqlalchemy import select
from sqlalchemy.orm import Session

from database import SessionLocal
from models import ServiceCategory, ServicePackage, ServiceProvider, WeddingPackage, WeddingPackageItem

TIERS = [
    ("Budget Wedding Package", 3500, 120, 0),
    ("Classic Wedding Package", 6000, 180, 1),
    ("Premium Wedding Package", 9500, 260, 2),
    ("Luxury Wedding Package", 14500, 350, 0),
]

INCLUDED = [
    "Wedding Hall", "Photographer", "Catering", "Decoration", "Makeup Artist",
    "DJ / Music", "Dress Shop", "Car Rental", "Choreographer",
]

IMAGE = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85"


def seed_default_wedding_packages() -> None:
    with SessionLocal() as db:
        for title, price, guests, offset in TIERS:
            if db.scalar(select(WeddingPackage).where(WeddingPackage.title == title)):
                continue
            providers = [pick_provider(db, category, offset) for category in INCLUDED]
            if any(provider is None for provider in providers):
                continue
            package = WeddingPackage(
                title=title, total_price=price, guest_capacity=guests,
                image_url=IMAGE, is_active=True,
                description=f"{title} combines trusted providers into one ready wedding bundle.",
            )
            db.add(package)
            db.flush()
            for provider in providers:
                add_item(db, package, provider)
        db.commit()


def pick_provider(db: Session, category_name: str, offset: int) -> ServiceProvider | None:
    query = (
        select(ServiceProvider)
        .join(ServiceCategory)
        .where(ServiceCategory.name == category_name)
        .where(ServiceProvider.is_approved.is_(True))
        .order_by(ServiceProvider.id)
    )
    providers = list(db.scalars(query).all())
    return providers[offset % len(providers)] if providers else None


def add_item(db: Session, wedding: WeddingPackage, provider: ServiceProvider) -> None:
    service_package = db.scalar(
        select(ServicePackage)
        .where(ServicePackage.provider_id == provider.id)
        .order_by(ServicePackage.id)
    )
    price = float(service_package.price) if service_package and service_package.price else 0
    db.add(WeddingPackageItem(
        wedding_package_id=wedding.id, service_provider_id=provider.id,
        service_package_id=service_package.id if service_package else None,
        category_name=provider.category.name if provider.category else "Uncategorized",
        item_price=price,
    ))
