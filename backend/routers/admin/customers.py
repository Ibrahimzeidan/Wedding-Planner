from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import Booking, Customer, Favorite, User, WeddingPlan
from routers.admin.guards import get_or_404
from schemas.admin_common import CustomerUpdate, SimpleResponse
from schemas.admin_detail import CustomerAdminResponse
from schemas.admin_response import AdminResponse, ok

router = APIRouter(prefix="/admin/customers", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[CustomerAdminResponse]])
def list_customers(db: Session = Depends(get_db)):
    rows = db.execute(select(Customer, User).join(User).order_by(User.created_at.desc())).all()
    return ok([customer_response(db, customer, user) for customer, user in rows])


@router.get("/{customer_id}", response_model=AdminResponse[CustomerAdminResponse])
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    row = db.execute(select(Customer, User).join(User).where(Customer.id == customer_id)).first()
    if not row:
        get_or_404(db, Customer, customer_id)
    return ok(customer_response(db, *row))


@router.put("/{customer_id}", response_model=AdminResponse[CustomerAdminResponse])
def update_customer(customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)):
    customer = get_or_404(db, Customer, customer_id)
    user = customer.user
    customer_fields = {"phone", "address", "location", "guest_count", "budget"}
    values = payload.model_dump(exclude_unset=True, exclude={"role"})
    for field, value in values.items():
        target = customer if field in customer_fields else user
        setattr(target, field, value.strip().lower() if field == "email" else value)
    db.commit()
    return ok(customer_response(db, customer, user), "Customer updated successfully")


@router.delete("/{customer_id}", response_model=SimpleResponse)
def delete_customer(customer_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    customer = get_or_404(db, Customer, customer_id)
    db.delete(customer.user)
    db.commit()
    return SimpleResponse(message="Customer deleted successfully.")


def customer_response(db: Session, customer: Customer, user: User):
    return CustomerAdminResponse(
        id=customer.id, user_id=user.id, full_name=user.full_name, email=user.email,
        phone=customer.phone, address=customer.address, location=customer.location,
        guest_count=customer.guest_count,
        budget=float(customer.budget) if customer.budget is not None else None,
        is_active=user.is_active,
        wedding_plan_count=count_for(db, WeddingPlan, customer.id),
        booking_count=count_for(db, Booking, customer.id),
        favorite_count=count_for(db, Favorite, customer.id),
    )


def count_for(db: Session, model: type, customer_id: int) -> int:
    return db.scalar(select(func.count()).select_from(model).where(model.customer_id == customer_id)) or 0
