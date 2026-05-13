from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_customer
from models import User
from schemas.admin_common import SimpleResponse
from schemas.wedding_plan import WeddingPlanCreate, WeddingPlanResponse, WeddingPlanUpdate
from services.wedding_plan_service import (
    create_my_plan,
    delete_my_plan,
    get_my_plan,
    update_my_plan,
)

router = APIRouter(prefix="/wedding-plans", tags=["Wedding Plans"])


@router.get("/me", response_model=WeddingPlanResponse | None)
def read_my_plan(
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return get_my_plan(db, user)


@router.post("", response_model=WeddingPlanResponse)
def create_plan(
    payload: WeddingPlanCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return create_my_plan(db, user, payload)


@router.put("/{plan_id}", response_model=WeddingPlanResponse)
def update_plan(
    plan_id: int,
    payload: WeddingPlanUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return update_my_plan(db, user, plan_id, payload)


@router.delete("/{plan_id}", response_model=SimpleResponse)
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
) -> SimpleResponse:
    delete_my_plan(db, user, plan_id)
    return SimpleResponse(message="Wedding plan deleted successfully.")
