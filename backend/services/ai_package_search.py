from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from models import Favorite, ServiceCategory, ServicePackage, ServiceProvider
from services.ai_availability_messages import remember_booked_match
from services.ai_guardrails import CATEGORY_ALIASES
from services.ai_package_scoring import package_score
from services.provider_availability import unavailable_provider_ids


def favorite_provider_ids(db: Session, customer_id: int) -> set[int]:
    rows = db.scalars(
        select(Favorite.provider_id)
        .where(Favorite.customer_id == customer_id, Favorite.provider_id.is_not(None))
    ).all()
    return {item for item in rows if item}


def package_query(category: str):
    terms = category_terms(category)
    return (
        select(ServicePackage)
        .join(ServicePackage.provider)
        .outerjoin(ServiceProvider.category)
        .options(joinedload(ServicePackage.provider).joinedload(ServiceProvider.category))
        .where(ServiceProvider.is_approved.is_(True))
        .where(ServicePackage.is_available.is_(True), ServicePackage.is_active.is_(True))
        .where(ServicePackage.price.is_not(None))
        .where(or_(
            *[ServiceCategory.name.ilike(f"%{term}%") for term in terms],
            ServicePackage.title.ilike(f"%{category}%"),
        ))
    )


def category_terms(category: str) -> list[str]:
    terms = [category, *CATEGORY_ALIASES.get(category, [])]
    return list(dict.fromkeys(terms))

def capacity_ok(package: ServicePackage, guest_count: int | None) -> bool:
    if not guest_count:
        return True
    provider = package.provider
    package_ok = package.capacity is None or package.capacity >= guest_count
    provider_ok = provider.max_guests is None or provider.max_guests >= guest_count
    return package_ok and provider_ok


def location_matches(package: ServicePackage, location: str | None) -> bool:
    provider_location = (package.provider.location or "").lower()
    return bool(location and location.lower() in provider_location)


def package_candidates(db: Session, category: str, memory: dict, customer_id: int,
                       favorites_only: bool = False) -> tuple[list[ServicePackage], set[int]]:
    favorites = favorite_provider_ids(db, customer_id)
    candidates = db.scalars(package_query(category)).unique().all()
    candidates = [item for item in candidates if capacity_ok(item, memory.get("guest_count"))]
    rejected = set(memory.get("rejected_provider_ids") or [])
    candidates = [item for item in candidates if item.provider_id not in rejected]
    candidates = available_on_date(db, candidates, memory, category)
    if favorites_only:
        candidates = [item for item in candidates if item.provider_id in favorites]
    located = [item for item in candidates if location_matches(item, memory.get("location"))]
    return (located or candidates), favorites


def available_on_date(db: Session, candidates: list[ServicePackage],
                      memory: dict, category: str) -> list[ServicePackage]:
    blocked = blocked_provider_ids(db, memory)
    if not blocked:
        return candidates
    booked = [item for item in candidates if item.provider_id in blocked]
    if booked:
        remember_booked_match(memory, category, booked[0])
    available = [item for item in candidates if item.provider_id not in blocked]
    if candidates and not available:
        memory.setdefault("unavailable_categories", []).append(category)
    return available


def blocked_provider_ids(db: Session, memory: dict) -> set[int]:
    if "_blocked_provider_ids" not in memory:
        memory["_blocked_provider_ids"] = unavailable_provider_ids(db, memory.get("wedding_date"))
    return memory["_blocked_provider_ids"]


__all__ = ["package_candidates", "package_score"]
