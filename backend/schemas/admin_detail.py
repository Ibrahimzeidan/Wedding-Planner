from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CustomerAdminResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: str | None = None
    address: str | None = None
    location: str | None = None
    guest_count: int | None = None
    budget: float | None = None
    is_active: bool
    wedding_plan_count: int = 0
    booking_count: int = 0
    favorite_count: int = 0


class PackageAdminResponse(BaseModel):
    id: int
    provider_id: int
    provider_name: str | None = None
    title: str
    description: str | None = None
    price: float | None = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BookingAdminResponse(BaseModel):
    id: int
    customer_id: int
    package_id: int | None = None
    status: str
    event_date: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewAdminResponse(BaseModel):
    id: int
    customer_id: int
    provider_id: int
    rating: int
    comment: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
