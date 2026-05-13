from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from category_rules import REMOVED_CATEGORY, visible_category_query
from models import ServiceCategory, ServiceProvider, User
from schemas.service import ServiceProviderDetailOut
from services.service_formatter import active_packages, package_out, provider_out


def category_list(db: Session) -> list[ServiceCategory]:
    return list(db.scalars(visible_category_query().order_by(ServiceCategory.name)).all())


def provider_base() -> Select[tuple[ServiceProvider]]:
    return (
        select(ServiceProvider)
        .join(ServiceProvider.user)
        .outerjoin(ServiceProvider.category)
        .options(joinedload(ServiceProvider.user), joinedload(ServiceProvider.category))
        .options(selectinload(ServiceProvider.packages), selectinload(ServiceProvider.reviews))
        .where(ServiceProvider.is_approved.is_(True))
        .where(User.role == "service_provider")
        .where(or_(ServiceCategory.name.is_(None), ServiceCategory.name != REMOVED_CATEGORY))
    )


def apply_provider_filters(query, category=None, category_id=None, location=None, rating=None, search=None):
    if category:
        query = query.where(ServiceCategory.name.ilike(category.strip()))
    if category_id:
        query = query.where(ServiceProvider.category_id == category_id)
    if location:
        query = query.where(ServiceProvider.location.ilike(f"%{location}%"))
    if rating:
        query = query.where(ServiceProvider.rating >= rating)
    if search:
        term = f"%{search.strip()}%"
        query = query.where(or_(
            User.full_name.ilike(term), ServiceProvider.business_name.ilike(term),
            ServiceCategory.name.ilike(term), ServiceProvider.location.ilike(term),
        ))
    return query


def list_providers(db: Session, category=None, category_id=None, location=None, rating=None, search=None, limit=80):
    query = apply_provider_filters(provider_base(), category, category_id, location, rating, search)
    providers = db.scalars(query.order_by(ServiceProvider.rating.desc()).limit(limit)).unique().all()
    return [provider_out(provider) for provider in providers]


def get_provider_detail(db: Session, provider_id: int):
    provider = db.scalars(provider_base().where(ServiceProvider.id == provider_id)).unique().first()
    if not provider:
        return None
    return ServiceProviderDetailOut(**provider_out(provider).model_dump())


def list_packages(db: Session, category=None, category_id=None, location=None, rating=None, search=None, provider_id=None):
    query = provider_base()
    if provider_id:
        query = query.where(ServiceProvider.id == provider_id)
    query = apply_provider_filters(query, category, category_id, location, rating, search)
    providers = db.scalars(query).unique().all()
    return [package_out(package, provider) for provider in providers for package in active_packages(provider)]


def list_venues(db: Session, guests=None, venue_type=None, location=None, rating=None):
    query = apply_provider_filters(provider_base(), None, None, location, rating)
    query = query.where(or_(ServiceCategory.name == "Wedding Hall", ServiceCategory.name == "Wedding Venue"))
    if guests:
        query = query.where(ServiceProvider.max_guests >= guests)
    if venue_type:
        query = query.where(ServiceProvider.venue_type.ilike(f"%{venue_type}%"))
    providers = db.scalars(query.order_by(ServiceProvider.rating.desc())).unique().all()
    return [provider_out(provider) for provider in providers]
