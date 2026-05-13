from datetime import date
from typing import Any

from pydantic import BaseModel


class AccountUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    location: str | None = None
    wedding_date: date | None = None
    guest_count: int | None = None
    budget: float | None = None
    preferences: dict[str, Any] | None = None
    business_name: str | None = None
    description: str | None = None
    category_id: int | None = None
    availability: str | None = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


class PhotoUpdate(BaseModel):
    profile_image: str
