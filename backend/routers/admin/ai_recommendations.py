from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from database import get_db
from dependencies import require_admin
from models import AIRecommendation, AIRecommendationItem, Customer, ServiceProvider
from routers.admin.guards import get_or_404
from schemas.admin_ai import AdminAIItem, AdminAIRecommendation
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok

router = APIRouter(
    prefix="/admin/ai-recommendations",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)


def query():
    return select(AIRecommendation).options(
        joinedload(AIRecommendation.items).joinedload(AIRecommendationItem.package),
        joinedload(AIRecommendation.items).joinedload(AIRecommendationItem.provider)
        .joinedload(ServiceProvider.user),
        joinedload(AIRecommendation.customer).joinedload(Customer.user),
    )


@router.get("", response_model=AdminResponse[list[AdminAIRecommendation]])
def list_recommendations(db: Session = Depends(get_db)):
    rows = db.scalars(query().order_by(AIRecommendation.created_at.desc())).unique().all()
    return ok([recommendation_out(item) for item in rows])


@router.get("/{recommendation_id}", response_model=AdminResponse[AdminAIRecommendation])
def get_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    item = db.scalars(query().where(AIRecommendation.id == recommendation_id)).unique().first()
    return ok(recommendation_out(item or get_or_404(db, AIRecommendation, recommendation_id)))


@router.delete("/{recommendation_id}", response_model=SimpleResponse)
def delete_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    db.delete(get_or_404(db, AIRecommendation, recommendation_id))
    db.commit()
    return SimpleResponse(message="AI recommendation deleted successfully.")


def recommendation_out(row: AIRecommendation) -> AdminAIRecommendation:
    customer_user = row.customer.user if row.customer else None
    return AdminAIRecommendation(
        id=row.id, customer_id=row.customer_id,
        customer_name=customer_user.full_name if customer_user else None,
        wedding_plan_id=row.wedding_plan_id,
        total_estimated_cost=float(row.total_estimated_cost),
        remaining_budget=float(row.remaining_budget) if row.remaining_budget is not None else None,
        recommendation_summary=row.recommendation_summary, created_at=row.created_at,
        items=[item_out(item) for item in row.items],
    )


def item_out(row: AIRecommendationItem) -> AdminAIItem:
    provider = row.provider
    package = row.package
    return AdminAIItem(
        id=row.id, provider_id=row.provider_id, package_id=row.package_id,
        category_name=row.category_name, provider_name=provider.business_name if provider else None,
        package_title=package.title if package else None, item_price=float(row.item_price),
        reason=row.reason,
    )
