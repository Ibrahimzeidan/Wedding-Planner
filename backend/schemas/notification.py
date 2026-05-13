from datetime import datetime
from typing import Literal

from pydantic import BaseModel

BookingStatus = Literal["pending", "accepted", "rejected", "cancelled", "completed"]


class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    related_booking_id: int | None = None
    related_booking_status: BookingStatus | None = None
    related_provider_id: int | None = None
    created_at: datetime


class ProviderNotificationOut(BaseModel):
    id: int
    provider_id: int | None = None
    booking_id: int | None = None
    title: str
    message: str
    customer_name: str | None = None
    event_date: datetime | None = None
    wedding_location: str | None = None
    wedding_details: str | None = None
    is_read: bool
    created_at: datetime
