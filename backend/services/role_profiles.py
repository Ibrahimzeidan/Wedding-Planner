from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Customer, ServiceProvider, User


def customer_for_user(db: Session, user: User) -> Customer:
    customer = db.scalar(select(Customer).where(Customer.user_id == user.id))
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found.")
    return customer


def provider_for_user(db: Session, user: User) -> ServiceProvider:
    provider = db.scalar(select(ServiceProvider).where(ServiceProvider.user_id == user.id))
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found.")
    return provider


def display_name(user: User | None, fallback: str | None = None) -> str | None:
    return fallback or (user.full_name if user else None)
