from sqlalchemy import select
from sqlalchemy.orm import joinedload

from models import Customer, WeddingPlan
from schemas.wedding_plan import WeddingPlanResponse, WeddingPlanUpdate


def plan_query():
    return select(WeddingPlan).options(
        joinedload(WeddingPlan.customer).joinedload(Customer.user)
    )


def serialize_plan(plan: WeddingPlan) -> WeddingPlanResponse:
    user = plan.customer.user if plan.customer else None
    return WeddingPlanResponse(
        id=plan.id,
        customer_id=plan.customer_id,
        wedding_date=plan.wedding_date,
        budget=float(plan.budget) if plan.budget is not None else None,
        guest_count=plan.guest_count,
        location=plan.location,
        wedding_style=plan.wedding_style,
        preferred_services=plan.preferred_services or [],
        created_at=plan.created_at,
        customer_name=user.full_name if user else None,
        customer_email=user.email if user else None,
    )


def update_fields(plan: WeddingPlan, payload: WeddingPlanUpdate) -> None:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(plan, field, value)
