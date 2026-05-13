from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from schemas.admin_common import SimpleResponse
from schemas.favorite import FavoriteResponse
from services.favorite_service import delete_admin_favorite, list_admin_favorites

router = APIRouter(
    prefix="/admin/favorites",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)


@router.get("", response_model=list[FavoriteResponse])
def read_favorites(db: Session = Depends(get_db)):
    return list_admin_favorites(db)


@router.delete("/{favorite_id}", response_model=SimpleResponse)
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    delete_admin_favorite(db, favorite_id)
    return SimpleResponse(message="Favorite deleted successfully.")
