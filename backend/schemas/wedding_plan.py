from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class WeddingPlanBase(BaseModel):
    wedding_date: date | None = None
    budget: float | None = Field(default=None, ge=0)
    guest_count: int | None = Field(default=None, ge=1)
    location: str | None = None
    wedding_style: str | None = None
    preferred_services: list[str] = Field(default_factory=list)

    @field_validator("location", "wedding_style")
    @classmethod
    def clean_text(cls, value: str | None) -> str | None:
        return value.strip() if value else None

    @field_validator("preferred_services")
    @classmethod
    def clean_services(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if item.strip()]


class WeddingPlanCreate(WeddingPlanBase):
    pass


class WeddingPlanUpdate(WeddingPlanBase):
    preferred_services: list[str] | None = None


class WeddingPlanResponse(WeddingPlanBase):
    id: int
    customer_id: int
    created_at: datetime
    customer_name: str | None = None
    customer_email: str | None = None

    model_config = ConfigDict(from_attributes=True)
