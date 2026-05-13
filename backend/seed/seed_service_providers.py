import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))
sys.path.append(str(Path(__file__).resolve().parent))
from sqlalchemy import select

from database import SessionLocal
from models import ServiceCategory, ServicePackage, ServiceProvider, User
from image_refresh import refresh_existing_images
from provider_image_data import provider_image
from service_seed_data import CATEGORIES, LOCATIONS, PROVIDERS
from security import hash_password
from wedding_package_seed import seed_default_wedding_packages

DEMO_PASSWORD_HASH = hash_password("Provider123!")

def ensure_category(db, name):
    category = db.scalar(select(ServiceCategory).where(ServiceCategory.name == name))
    if category:
        return category
    category = ServiceCategory(name=name, description=f"{name} services for wedding events.")
    db.add(category)
    db.flush()
    return category
def ensure_user(db, category, index, business):
    slug = business.lower().replace(" / ", "-").replace(" ", "-")
    email = f"{slug}@demo.wedding"
    user = db.scalar(select(User).where(User.email == email))
    if user:
        user.profile_image = provider_image(category, index)
        return user
    user = User(
        full_name=business,
        email=email,
        password_hash=DEMO_PASSWORD_HASH,
        role="service_provider",
        profile_image=provider_image(category, index),
    )
    db.add(user)
    db.flush()
    return user
def ensure_provider(db, user, category, index, business):
    provider = db.scalar(select(ServiceProvider).where(ServiceProvider.user_id == user.id))
    if provider:
        provider.category_id = provider.category_id or category.id
        return provider
    location = LOCATIONS[index % len(LOCATIONS)]
    provider = ServiceProvider(
        user_id=user.id, category_id=category.id, business_name=business,
        description=f"{business} offers refined {category.name.lower()} services in {location}.",
        phone=f"+961-70-55{index:04d}", location=location, rating=round(4.1 + (index % 9) * .1, 1),
        venue_type="Indoor Hall" if category.name == "Wedding Hall" else None,
        max_guests=250 + index * 25 if category.name == "Wedding Hall" else None,
        is_approved=True,
    )
    db.add(provider)
    db.flush()
    return provider
def ensure_packages(db, provider, category, image):
    titles = [f"Classic {category} Package"]
    existing = db.scalars(
        select(ServicePackage).where(ServicePackage.provider_id == provider.id)
    ).all()
    existing_titles = {package.title for package in existing}
    for package in existing:
        package.image_url = image
    for idx, title in enumerate(titles):
        if title in existing_titles:
            continue
        db.add(ServicePackage(
            provider_id=provider.id, title=title,
            description=f"{title} with planning support, setup, and wedding-day coordination.",
            price=750 + idx * 650 + provider.id * 15, image_url=image, duration="Full wedding day",
            capacity=provider.max_guests, is_available=True, is_active=True,
        ))
def main():
    with SessionLocal() as db:
        for category_name in CATEGORIES:
            category = ensure_category(db, category_name)
            for index, business in enumerate(PROVIDERS[category_name]):
                user = ensure_user(db, category_name, index, business)
                provider = ensure_provider(db, user, category, index, business)
                ensure_packages(db, provider, category_name, provider_image(category_name, index))
        refresh_existing_images(db)
        db.commit()
    seed_default_wedding_packages()
    print("Seeded 9 categories, 27 providers, and 27 packages without duplicate accounts.")
if __name__ == "__main__":
    main()
