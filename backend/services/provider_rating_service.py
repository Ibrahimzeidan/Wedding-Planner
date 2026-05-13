from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Review, ServiceProvider


def refresh_provider_rating(db: Session, provider_id: int) -> None:
    average = db.scalar(
        select(func.avg(Review.rating)).where(Review.provider_id == provider_id)
    )
    provider = db.get(ServiceProvider, provider_id)
    if provider:
        provider.rating = round(float(average or 0), 2)
