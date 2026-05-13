from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import ServiceCategory, ServiceProvider

REMOVED_CATEGORY = "Venue Planner"
FALLBACK_CATEGORY = "Decoration"


def is_removed_category(name: str | None) -> bool:
    return bool(name and name.strip().lower() == REMOVED_CATEGORY.lower())


def visible_category_query():
    return select(ServiceCategory).where(func.lower(ServiceCategory.name) != REMOVED_CATEGORY.lower())


def cleanup_removed_category(db: Session) -> None:
    removed = db.scalar(
        select(ServiceCategory).where(func.lower(ServiceCategory.name) == REMOVED_CATEGORY.lower())
    )
    if not removed:
        return
    fallback = db.scalar(
        select(ServiceCategory).where(func.lower(ServiceCategory.name) == FALLBACK_CATEGORY.lower())
    )
    if not fallback:
        return
    providers = db.scalars(
        select(ServiceProvider).where(ServiceProvider.category_id == removed.id)
    ).all()
    for provider in providers:
        provider.category_id = fallback.id
    db.flush()
    db.delete(removed)
