from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.service import VenueOut
from services.service_query import list_venues

router = APIRouter(prefix="/venues", tags=["Venues"])


@router.get("", response_model=list[VenueOut])
def get_venues(
    guests: int | None = None,
    venue_type: str | None = None,
    location: str | None = None,
    rating: float | None = None,
    db: Session = Depends(get_db),
):
    return list_venues(
        db,
        guests=guests,
        venue_type=venue_type,
        location=location,
        rating=rating,
    )
