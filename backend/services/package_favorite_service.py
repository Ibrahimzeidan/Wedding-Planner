from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Favorite, User, WeddingPackage
from schemas.favorite import FavoriteResponse
from services.favorite_formatter import favorite_query, serialize_favorite
from services.favorite_service import customer_profile, get_admin_favorite


def get_package(db: Session, package_id: int) -> WeddingPackage:
    package = db.get(WeddingPackage, package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Wedding package not found.")
    return package


def add_package_favorite(db: Session, user: User, package_id: int) -> FavoriteResponse:
    customer = customer_profile(user)
    get_package(db, package_id)
    favorite = find_package_favorite(db, customer.id, package_id)
    if favorite:
        return serialize_favorite(favorite)
    favorite = Favorite(customer_id=customer.id, package_id=package_id)
    db.add(favorite)
    db.commit()
    return get_admin_favorite(db, favorite.id)


def remove_my_package_favorite(db: Session, user: User, package_id: int) -> None:
    customer = customer_profile(user)
    favorite = find_package_favorite(db, customer.id, package_id)
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found.")
    db.delete(favorite)
    db.commit()


def find_package_favorite(db: Session, customer_id: int, package_id: int) -> Favorite | None:
    query = favorite_query().where(
        Favorite.customer_id == customer_id,
        Favorite.package_id == package_id,
    )
    return db.scalars(query).unique().first()
