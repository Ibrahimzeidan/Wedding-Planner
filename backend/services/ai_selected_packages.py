from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import AIRecommendation, AIRecommendationItem, ServiceProvider
from services.ai_category_names import canonical_category


def latest_selected_packages(db: Session, customer_id: int, plan) -> list[dict]:
    if not plan:
        return []
    query = select(AIRecommendation).options(
        joinedload(AIRecommendation.items).joinedload(AIRecommendationItem.package),
        joinedload(AIRecommendation.items).joinedload(AIRecommendationItem.provider)
        .joinedload(ServiceProvider.category),
    ).where(AIRecommendation.customer_id == customer_id, AIRecommendation.wedding_plan_id == plan.id)
    row = db.scalars(query.order_by(AIRecommendation.id.asc())).unique().first()
    if not row:
        return []
    return [
        {
            "category": canonical_category(item.provider.category.name if item.provider and item.provider.category else None),
            "provider_id": item.provider_id,
            "package_id": item.package_id,
        }
        for item in row.items
    ]
