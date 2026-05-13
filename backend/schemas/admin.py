from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoryPayload(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = None

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Category name is required.")
        return cleaned

    @field_validator("description")
    @classmethod
    def clean_description(cls, value: str | None) -> str | None:
        return value.strip() if value else None


class AdminCategoryResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminProviderResponse(BaseModel):
    id: int
    user_id: int
    category_id: int | None = None
    provider_name: str
    email: str
    category_name: str
    business_name: str | None = None
    description: str | None = None
    location: str | None = None
    phone: str | None = None
    rating: float | None = None
    is_approved: bool
    is_active: bool
    created_at: datetime


class AdminStatsResponse(BaseModel):
    total_users: int
    total_customers: int
    total_service_providers: int
    total_categories: int
    total_packages: int = 0
    total_wedding_packages: int = 0
    total_wedding_plans: int = 0
    total_bookings: int = 0
    total_messages: int = 0
    total_reviews: int = 0


class AdminUserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: Literal["customer", "service_provider", "admin"]
    is_active: bool = True
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
