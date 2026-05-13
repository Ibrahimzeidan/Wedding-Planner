from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_service_provider
from models import User
from schemas.review import ReviewOut
from services.review_service import my_provider_reviews

router = APIRouter(prefix="/provider/reviews", tags=["Provider Reviews"])


@router.get("", response_model=list[ReviewOut])
def get_my_provider_reviews(
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
) -> list[ReviewOut]:
    return my_provider_reviews(db, user)
