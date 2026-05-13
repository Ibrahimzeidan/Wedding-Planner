from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_customer
from models import User
from schemas.admin_common import SimpleResponse
from schemas.favorite import FavoriteResponse
from services.favorite_service import add_favorite, list_my_favorites, remove_my_favorite
from services.package_favorite_service import add_package_favorite, remove_my_package_favorite

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("", response_model=list[FavoriteResponse])
def read_favorites(
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return list_my_favorites(db, user)


@router.post("/{provider_id}", response_model=FavoriteResponse)
def create_favorite(
    provider_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return add_favorite(db, user, provider_id)


@router.post("/packages/{package_id}", response_model=FavoriteResponse)
def create_package_favorite(
    package_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return add_package_favorite(db, user, package_id)


@router.delete("/{provider_id}", response_model=SimpleResponse)
def delete_favorite(
    provider_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
) -> SimpleResponse:
    remove_my_favorite(db, user, provider_id)
    return SimpleResponse(message="Favorite removed successfully.")


@router.delete("/packages/{package_id}", response_model=SimpleResponse)
def delete_package_favorite(
    package_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
) -> SimpleResponse:
    remove_my_package_favorite(db, user, package_id)
    return SimpleResponse(message="Package favorite removed successfully.")
