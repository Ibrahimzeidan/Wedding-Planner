from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field, model_validator

BookingStatus = Literal["pending", "accepted", "rejected", "cancelled", "completed"]
PaymentStatus = Literal["unpaid", "paid_cash", "paid_card", "paid_paypal"]
PaymentMethod = Literal["cash", "credit_card", "paypal"]


class BookingCreate(BaseModel):
    provider_id: int
    package_id: int | None = None
    wedding_package_id: int | None = None
    event_date: datetime
    guest_count: int | None = None
    phone_number: str | None = None
    location: str = Field(min_length=2, max_length=255)
    notes: str | None = None
    payment_method: PaymentMethod

    @model_validator(mode="after")
    def validate_future_event(self) -> "BookingCreate":
        event_date = self.event_date
        now = datetime.now(timezone.utc) if event_date.tzinfo else datetime.now()
        compare_date = event_date.astimezone(timezone.utc) if event_date.tzinfo else event_date
        if compare_date <= now:
            raise ValueError("Event date and time must be in the future.")
        return self


class BookingStatusUpdate(BaseModel):
    booking_status: BookingStatus
    provider_response_note: str | None = Field(default=None, max_length=1000)


class BookingProviderResponse(BaseModel):
    provider_response_note: str | None = Field(default=None, max_length=1000)


class BookingAdminUpdate(BaseModel):
    booking_status: BookingStatus | None = None
    payment_status: PaymentStatus | None = None


class BookingOut(BaseModel):
    id: int
    customer_id: int
    provider_id: int | None = None
    package_id: int | None = None
    wedding_package_id: int | None = None
    customer_name: str | None = None
    provider_name: str | None = None
    package_title: str | None = None
    wedding_package_title: str | None = None
    event_date: datetime | None = None
    guest_count: int | None = None
    phone_number: str | None = None
    location: str | None = None
    notes: str | None = None
    total_price: float
    booking_status: BookingStatus
    provider_response_note: str | None = None
    customer_confirmed: bool
    provider_confirmed: bool
    conversation_id: int | None = None
    payment_method: str | None = None
    payment_status: str
    created_at: datetime
    updated_at: datetime
