from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import Booking, Customer, Review, ServiceProvider, User
from schemas.review import ReviewCreate, ReviewOut
from services.provider_rating_service import refresh_provider_rating
from services.role_profiles import customer_for_user, provider_for_user

FEEDBACK_ERROR = "You can leave feedback only after the service is completed."

def review_query():
    return select(Review).options(
        joinedload(Review.customer).joinedload(Customer.user),
        joinedload(Review.provider).joinedload(ServiceProvider.user),
    )

def review_out(review: Review) -> ReviewOut:
    provider = review.provider
    customer_user = review.customer.user if review.customer else None
    provider_user = provider.user if provider else None
    return ReviewOut(
        id=review.id,
        customer_id=review.customer_id,
        provider_id=review.provider_id,
        booking_id=review.booking_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
        customer_name=customer_user.full_name if customer_user else None,
        provider_name=provider.business_name or provider_user.full_name if provider else None,
    )

def provider_reviews(db: Session, provider_id: int) -> list[ReviewOut]:
    if not db.get(ServiceProvider, provider_id):
        raise HTTPException(status_code=404, detail="Provider not found.")
    query = review_query().where(Review.provider_id == provider_id)
    return [review_out(item) for item in db.scalars(query.order_by(Review.created_at.desc()))]

def my_reviews(db: Session, user: User) -> list[ReviewOut]:
    customer = customer_for_user(db, user)
    query = review_query().where(Review.customer_id == customer.id)
    return [review_out(item) for item in db.scalars(query.order_by(Review.created_at.desc()))]

def my_provider_reviews(db: Session, user: User) -> list[ReviewOut]:
    provider = provider_for_user(db, user)
    return provider_reviews(db, provider.id)

def admin_reviews(db: Session) -> list[ReviewOut]:
    query = review_query().order_by(Review.created_at.desc())
    return [review_out(item) for item in db.scalars(query)]

def create_review(db: Session, user: User, payload: ReviewCreate) -> ReviewOut:
    customer = customer_for_user(db, user)
    booking = get_reviewable_booking(db, customer.id, payload.booking_id)
    ensure_unique_review(db, booking.id)
    review = Review(
        customer_id=customer.id,
        provider_id=booking.provider_id,
        booking_id=booking.id,
        rating=payload.rating,
        comment=payload.comment.strip(),
    )
    db.add(review)
    db.flush()
    refresh_provider_rating(db, booking.provider_id)
    db.commit()
    return review_out(db.scalars(review_query().where(Review.id == review.id)).one())

def get_reviewable_booking(db: Session, customer_id: int, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=400, detail=FEEDBACK_ERROR)
    if booking.customer_id != customer_id:
        raise HTTPException(status_code=403, detail=FEEDBACK_ERROR)
    if booking.booking_status != "completed" or not booking.provider_id:
        raise HTTPException(status_code=400, detail=FEEDBACK_ERROR)
    if booking.event_date and booking.event_date.date() > datetime.now(timezone.utc).date():
        raise HTTPException(status_code=400, detail="You can leave feedback after the wedding date.")
    return booking

def ensure_unique_review(db: Session, booking_id: int) -> None:
    query = select(Review.id).where(Review.booking_id == booking_id)
    if db.scalar(query.limit(1)):
        raise HTTPException(status_code=400, detail="You already reviewed this booking.")
