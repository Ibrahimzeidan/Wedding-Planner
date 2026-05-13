from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import Customer, Favorite, ServiceProvider, User
from schemas.favorite import FavoriteResponse
from services.favorite_formatter import favorite_query, serialize_favorite


def customer_profile(user: User) -> Customer:
    if not user.customer_profile:
        raise HTTPException(status_code=403, detail="Customer profile required.")
    return user.customer_profile


def list_my_favorites(db: Session, user: User) -> list[FavoriteResponse]:
    customer = customer_profile(user)
    query = favorite_query().where(Favorite.customer_id == customer.id)
    favorites = db.scalars(query.order_by(Favorite.created_at.desc())).unique().all()
    return [serialize_favorite(favorite) for favorite in favorites]


def get_provider(db: Session, provider_id: int) -> ServiceProvider:
    query = select(ServiceProvider).options(
        joinedload(ServiceProvider.user),
        joinedload(ServiceProvider.category),
    )
    provider = db.scalar(query.where(ServiceProvider.id == provider_id))
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found.")
    return provider


def add_favorite(db: Session, user: User, provider_id: int) -> FavoriteResponse:
    customer = customer_profile(user)
    get_provider(db, provider_id)
    favorite = find_favorite(db, customer.id, provider_id)
    if favorite:
        return serialize_favorite(favorite)
    favorite = Favorite(customer_id=customer.id, provider_id=provider_id)
    db.add(favorite)
    db.commit()
    return get_admin_favorite(db, favorite.id)


def remove_my_favorite(db: Session, user: User, provider_id: int) -> None:
    customer = customer_profile(user)
    favorite = find_favorite(db, customer.id, provider_id)
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found.")
    db.delete(favorite)
    db.commit()


def find_favorite(db: Session, customer_id: int, provider_id: int) -> Favorite | None:
    query = favorite_query().where(
        Favorite.customer_id == customer_id,
        Favorite.provider_id == provider_id,
    )
    return db.scalars(query).unique().first()


def list_admin_favorites(db: Session) -> list[FavoriteResponse]:
    query = favorite_query().order_by(Favorite.created_at.desc())
    return [serialize_favorite(item) for item in db.scalars(query).unique().all()]


def get_admin_favorite(db: Session, favorite_id: int) -> FavoriteResponse:
    favorite = db.scalars(favorite_query().where(Favorite.id == favorite_id)).unique().first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found.")
    return serialize_favorite(favorite)


def delete_admin_favorite(db: Session, favorite_id: int) -> None:
    favorite = db.get(Favorite, favorite_id)
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found.")
    db.delete(favorite)
    db.commit()
