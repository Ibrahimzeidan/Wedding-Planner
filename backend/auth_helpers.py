from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Customer, ServiceCategory, ServiceProvider, User
from schemas.auth import RegisterRequest
from security import hash_password


def get_user_by_email(db: Session, email: str) -> User | None:
    normalized_email = email.strip().lower()
    return db.scalar(select(User).where(func.lower(User.email) == normalized_email))


def get_service_category(db: Session, payload: RegisterRequest) -> ServiceCategory | None:
    if payload.category_id:
        return db.get(ServiceCategory, payload.category_id)

    if not payload.category:
        return None

    normalized_category = payload.category.strip().lower()
    return db.scalar(
        select(ServiceCategory).where(func.lower(ServiceCategory.name) == normalized_category)
    )


def build_user(payload: RegisterRequest, email: str) -> User:
    return User(
        full_name=payload.full_name.strip(),
        email=email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )


def build_profile(
    db: Session,
    payload: RegisterRequest,
    user: User,
) -> Customer | ServiceProvider:
    if payload.role == "customer":
        return Customer(
            user_id=user.id,
            phone=payload.phone,
            address=payload.address,
            preferences=payload.preferences,
        )

    category = get_service_category(db, payload)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected service category does not exist.",
        )

    return ServiceProvider(
        user_id=user.id,
        category_id=category.id,
        business_name=(payload.business_name or payload.full_name).strip(),
        description=payload.description,
        location=(payload.location or "").strip(),
        phone=(payload.phone or "").strip(),
    )
