from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    role: Literal["customer", "service_provider", "admin"] | None = None
    is_active: bool | None = None


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: Literal["customer", "service_provider"] = "customer"
    category_id: int | None = None
    business_name: str | None = None


class ProviderUpdate(BaseModel):
    category_id: int | None = None
    business_name: str | None = None
    description: str | None = None
    location: str | None = None
    phone: str | None = None
    rating: float | None = None
    is_approved: bool | None = None
    is_active: bool | None = None


class CustomerUpdate(UserUpdate):
    phone: str | None = None
    address: str | None = None
    location: str | None = None
    guest_count: int | None = None
    budget: float | None = None


class PackageUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None
    is_active: bool | None = None


class BookingUpdate(BaseModel):
    status: Literal["pending", "accepted", "rejected", "cancelled", "completed"]


class SimpleResponse(BaseModel):
    success: bool = True
    message: str


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None = None
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
