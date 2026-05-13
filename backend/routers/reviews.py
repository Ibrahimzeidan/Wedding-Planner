from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_customer
from models import User
from schemas.review import ReviewCreate, ReviewOut
from services.review_service import create_review, my_reviews, provider_reviews

router = APIRouter(tags=["Reviews"])


@router.post("/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def add_review(
    payload: ReviewCreate,
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
) -> ReviewOut:
    return create_review(db, user, payload)


@router.get("/reviews/me", response_model=list[ReviewOut])
def get_my_reviews(
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
) -> list[ReviewOut]:
    return my_reviews(db, user)


@router.get("/providers/{provider_id}/reviews", response_model=list[ReviewOut])
def get_provider_reviews(provider_id: int, db: Session = Depends(get_db)) -> list[ReviewOut]:
    return provider_reviews(db, provider_id)

