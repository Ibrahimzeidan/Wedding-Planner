from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Customer, User, WeddingPlan
from schemas.wedding_plan import WeddingPlanCreate, WeddingPlanResponse, WeddingPlanUpdate
from services.wedding_plan_formatter import plan_query, serialize_plan, update_fields


def customer_profile(user: User) -> Customer:
    if not user.customer_profile:
        raise HTTPException(status_code=403, detail="Customer profile required.")
    return user.customer_profile


def get_my_plan(db: Session, user: User) -> WeddingPlanResponse | None:
    customer = customer_profile(user)
    plan = db.scalar(plan_query().where(WeddingPlan.customer_id == customer.id))
    return serialize_plan(plan) if plan else None


def create_my_plan(db: Session, user: User, payload: WeddingPlanCreate) -> WeddingPlanResponse:
    customer = customer_profile(user)
    if db.scalar(select(WeddingPlan.id).where(WeddingPlan.customer_id == customer.id)):
        raise HTTPException(status_code=400, detail="Wedding plan already exists.")
    plan = WeddingPlan(customer_id=customer.id, **payload.model_dump())
    db.add(plan)
    db.commit()
    return get_admin_plan(db, plan.id)


def get_owned_plan(db: Session, user: User, plan_id: int) -> WeddingPlan:
    customer = customer_profile(user)
    plan = db.scalar(
        plan_query().where(WeddingPlan.id == plan_id, WeddingPlan.customer_id == customer.id)
    )
    if not plan:
        raise HTTPException(status_code=404, detail="Wedding plan not found.")
    return plan


def update_my_plan(db: Session, user: User, plan_id: int, payload: WeddingPlanUpdate):
    plan = get_owned_plan(db, user, plan_id)
    update_fields(plan, payload)
    db.commit()
    return get_admin_plan(db, plan.id)


def delete_my_plan(db: Session, user: User, plan_id: int) -> None:
    db.delete(get_owned_plan(db, user, plan_id))
    db.commit()


def list_admin_plans(db: Session) -> list[WeddingPlanResponse]:
    plans = db.scalars(plan_query().order_by(WeddingPlan.created_at.desc())).all()
    return [serialize_plan(plan) for plan in plans]


def get_admin_plan(db: Session, plan_id: int) -> WeddingPlanResponse:
    plan = db.scalar(plan_query().where(WeddingPlan.id == plan_id))
    if not plan:
        raise HTTPException(status_code=404, detail="Wedding plan not found.")
    return serialize_plan(plan)


def update_admin_plan(db: Session, plan_id: int, payload: WeddingPlanUpdate):
    plan = db.get(WeddingPlan, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Wedding plan not found.")
    update_fields(plan, payload)
    db.commit()
    return get_admin_plan(db, plan.id)


def delete_admin_plan(db: Session, plan_id: int) -> None:
    plan = db.get(WeddingPlan, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Wedding plan not found.")
    db.delete(plan)
    db.commit()
