from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import AIRecommendation, AIRecommendationItem as AIRecommendationItemModel
from models import ServiceProvider
from schemas.ai import AIRecommendationItem, AIRecommendationOption, AIRecommendationSummary
from services.ai_recommendation_delete import delete_saved_recommendations
from services.ai_recommendation_service import item_from_package


def save_recommendations(
    db: Session, customer_id: int, wedding_plan_id: int, summary: AIRecommendationSummary,
) -> AIRecommendationSummary:
    delete_saved_recommendations(db, customer_id, wedding_plan_id)
    for index, option in enumerate(stored_options(summary)):
        recommendation = AIRecommendation(
            customer_id=customer_id, wedding_plan_id=wedding_plan_id,
            total_estimated_cost=option.total_estimated_cost,
            remaining_budget=option.remaining_budget,
            recommendation_summary=summary.recommendation_summary if index == 0 else option.difference,
        )
        db.add(recommendation)
        db.flush()
        for item in option.items:
            add_item(db, recommendation.id, item)
    db.commit()
    return saved_recommendations(db, customer_id, wedding_plan_id)


def saved_recommendations(db: Session, customer_id: int, wedding_plan_id: int) -> AIRecommendationSummary:
    query = select(AIRecommendation).options(
        joinedload(AIRecommendation.items).joinedload(AIRecommendationItemModel.package),
        joinedload(AIRecommendation.items).joinedload(AIRecommendationItemModel.provider)
        .joinedload(ServiceProvider.category),
    )
    recommendations = db.scalars(query.where(
        AIRecommendation.customer_id == customer_id,
        AIRecommendation.wedding_plan_id == wedding_plan_id,
    ).order_by(AIRecommendation.id.asc())).unique().all()
    if not recommendations:
        return AIRecommendationSummary(total_estimated_cost=0, items=[])
    options = [saved_option(row, index) for index, row in enumerate(recommendations)]
    primary = options[0]
    return AIRecommendationSummary(
        total_estimated_cost=primary.total_estimated_cost,
        remaining_budget=primary.remaining_budget,
        recommendation_summary=primary.difference,
        items=primary.items,
        options=options,
    )


def stored_options(summary: AIRecommendationSummary) -> list[AIRecommendationOption]:
    if summary.options:
        return summary.options
    return [AIRecommendationOption(
        title="Recommended Package 1", total_estimated_cost=summary.total_estimated_cost,
        remaining_budget=summary.remaining_budget,
        difference=summary.recommendation_summary or "Best overall match.", items=summary.items,
    )]


def add_item(db: Session, recommendation_id: int, item: AIRecommendationItem) -> None:
    db.add(AIRecommendationItemModel(
        recommendation_id=recommendation_id, provider_id=item.provider_id,
        package_id=item.package_id, category_name=item.category,
        reason=item.reason, item_price=item.price,
    ))


def saved_option(row: AIRecommendation, index: int) -> AIRecommendationOption:
    return AIRecommendationOption(
        title=f"Recommended Package {index + 1}", total_estimated_cost=float(row.total_estimated_cost),
        remaining_budget=float(row.remaining_budget) if row.remaining_budget is not None else None,
        difference=row.recommendation_summary or "Best overall match.", items=[saved_item(item) for item in row.items],
    )


def saved_item(row: AIRecommendationItemModel) -> AIRecommendationItem:
    item = item_from_package(row.package, {})
    item.id = row.id
    item.reason = row.reason
    item.price = float(row.item_price)
    return item
