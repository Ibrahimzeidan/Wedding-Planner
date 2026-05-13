import os

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal
from models import ServiceCategory, User
from security import hash_password

DEFAULT_SERVICE_CATEGORIES = [
    {
        "name": "Wedding Hall",
        "description": "Venues, halls, gardens, and reception spaces for wedding events.",
    },
    {
        "name": "Photographer",
        "description": "Wedding photography, engagement shoots, and event coverage.",
    },
    {
        "name": "Catering",
        "description": "Food menus, drinks, desserts, and reception catering.",
    },
    {
        "name": "Decoration",
        "description": "Floral design, table styling, ceremony setups, and event decor.",
    },
    {
        "name": "Makeup Artist",
        "description": "Bridal makeup, hair styling, and beauty services.",
    },
    {
        "name": "DJ / Music",
        "description": "DJs, live music, sound systems, and entertainment services.",
    },
    {
        "name": "Dress Shop",
        "description": "Wedding gowns, suits, accessories, and fitting services.",
    },
    {
        "name": "Car Rental",
        "description": "Wedding cars, luxury vehicles, and guest transportation.",
    },
    {
        "name": "Choreographer",
        "description": "First dance coaching, group performances, and reception choreography.",
    },
]


def seed_default_service_categories() -> None:
    try:
        with SessionLocal() as db:
            existing_names = set(db.scalars(select(ServiceCategory.name)).all())

            for category in DEFAULT_SERVICE_CATEGORIES:
                if category["name"] not in existing_names:
                    db.add(ServiceCategory(**category))

            db.commit()
    except SQLAlchemyError:
        raise


def seed_default_admin() -> None:
    email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@weddingplanner.com").strip().lower()
    password = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin123!")
    full_name = os.getenv("DEFAULT_ADMIN_NAME", "Platform Admin").strip()

    try:
        with SessionLocal() as db:
            admin_count = db.scalar(
                select(func.count()).select_from(User).where(User.role == "admin")
            )
            if admin_count:
                return

            admin = User(
                full_name=full_name,
                email=email,
                password_hash=hash_password(password),
                role="admin",
            )
            db.add(admin)
            db.commit()
    except SQLAlchemyError:
        raise
