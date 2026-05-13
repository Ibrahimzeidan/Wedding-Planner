from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    booking_id: int
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=2, max_length=1000)


class ReviewOut(BaseModel):
    id: int
    customer_id: int
    provider_id: int
    booking_id: int | None = None
    rating: int
    comment: str | None = None
    created_at: datetime
    customer_name: str | None = None
    provider_name: str | None = None
