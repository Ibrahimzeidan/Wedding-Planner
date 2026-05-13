from sqlalchemy import select
from sqlalchemy.orm import Session

from models import AIRecommendation


def delete_saved_recommendations(db: Session, customer_id: int, wedding_plan_id: int) -> None:
    rows = db.scalars(select(AIRecommendation).where(
        AIRecommendation.customer_id == customer_id,
        AIRecommendation.wedding_plan_id == wedding_plan_id,
    )).unique().all()
    for row in rows:
        db.delete(row)
    db.flush()
