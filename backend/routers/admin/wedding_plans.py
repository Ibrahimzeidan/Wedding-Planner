from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.wedding_plan import WeddingPlanResponse, WeddingPlanUpdate
from services.wedding_plan_service import (
    delete_admin_plan,
    get_admin_plan,
    list_admin_plans,
    update_admin_plan,
)

router = APIRouter(
    prefix="/admin/wedding-plans",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)


@router.get("", response_model=AdminResponse[list[WeddingPlanResponse]])
def read_wedding_plans(db: Session = Depends(get_db)):
    return ok(list_admin_plans(db))


@router.get("/{plan_id}", response_model=AdminResponse[WeddingPlanResponse])
def read_wedding_plan(plan_id: int, db: Session = Depends(get_db)):
    return ok(get_admin_plan(db, plan_id))


@router.put("/{plan_id}", response_model=AdminResponse[WeddingPlanResponse])
def update_wedding_plan(
    plan_id: int,
    payload: WeddingPlanUpdate,
    db: Session = Depends(get_db),
):
    return ok(update_admin_plan(db, plan_id, payload), "Wedding plan updated successfully")


@router.delete("/{plan_id}", response_model=SimpleResponse)
def delete_wedding_plan(plan_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    delete_admin_plan(db, plan_id)
    return SimpleResponse(message="Wedding plan deleted successfully.")
