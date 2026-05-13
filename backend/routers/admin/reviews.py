from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import Review
from routers.admin.guards import get_or_404
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.review import ReviewOut
from services.provider_rating_service import refresh_provider_rating
from services.review_service import admin_reviews

router = APIRouter(prefix="/admin/reviews", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[ReviewOut]])
def list_reviews(
    provider_id: int | None = None,
    customer_id: int | None = None,
    rating: int | None = None,
    db: Session = Depends(get_db),
):
    rows = admin_reviews(db)
    if provider_id:
        rows = [item for item in rows if item.provider_id == provider_id]
    if customer_id:
        rows = [item for item in rows if item.customer_id == customer_id]
    if rating:
        rows = [item for item in rows if item.rating == rating]
    return ok(rows)


@router.delete("/{review_id}", response_model=SimpleResponse)
def delete_review(review_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    review = get_or_404(db, Review, review_id)
    provider_id = review.provider_id
    db.delete(review)
    db.flush()
    refresh_provider_rating(db, provider_id)
    db.commit()
    return SimpleResponse(message="Review deleted successfully.")
