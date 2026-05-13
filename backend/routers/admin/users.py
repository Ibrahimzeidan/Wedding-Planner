from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy import select
from sqlalchemy.orm import Session

from category_rules import is_removed_category
from database import get_db
from dependencies import require_admin
from models import Customer, ServiceCategory, ServiceProvider, User
from routers.admin.guards import admin_exists, get_or_404, protect_only_admin
from schemas.admin import AdminUserResponse
from schemas.admin_common import SimpleResponse, UserCreate, UserUpdate
from schemas.admin_response import AdminResponse, ok
from security import hash_password

router = APIRouter(prefix="/admin/users", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[AdminUserResponse]])
def list_users(db: Session = Depends(get_db)):
    return ok(list(db.scalars(select(User).order_by(User.created_at.desc())).all()))


@router.post("", response_model=AdminResponse[AdminUserResponse], status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    exists = db.scalar(select(User).where(func.lower(User.email) == email))
    if exists:
        raise HTTPException(status_code=409, detail="Email already exists.")
    user = User(full_name=payload.full_name.strip(), email=email, role=payload.role,
                password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()
    if payload.role == "customer":
        db.add(Customer(user_id=user.id))
    else:
        category = db.get(ServiceCategory, payload.category_id) if payload.category_id else None
        if not category or is_removed_category(category.name):
            raise HTTPException(status_code=400, detail="Provider category is required.")
        db.add(ServiceProvider(user_id=user.id, category_id=payload.category_id,
                               business_name=payload.business_name or user.full_name))
    db.commit()
    db.refresh(user)
    return ok(user, "User created successfully")


@router.get("/{user_id}", response_model=AdminResponse[AdminUserResponse])
def get_user(user_id: int, db: Session = Depends(get_db)):
    return ok(get_or_404(db, User, user_id))


@router.put("/{user_id}", response_model=AdminResponse[AdminUserResponse])
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = get_or_404(db, User, user_id)
    protect_only_admin(user, payload.role)
    if payload.role == "admin" and admin_exists(db, user.id):
        raise HTTPException(status_code=400, detail="Only one admin account is allowed.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value.strip().lower() if field == "email" else value)
    db.commit()
    db.refresh(user)
    return ok(user, "User updated successfully")


@router.delete("/{user_id}", response_model=SimpleResponse)
def delete_user(user_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    user = get_or_404(db, User, user_id)
    protect_only_admin(user, is_delete=True)
    db.delete(user)
    db.commit()
    return SimpleResponse(message="User deleted successfully.")
