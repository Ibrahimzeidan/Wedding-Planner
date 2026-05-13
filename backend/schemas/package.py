from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PackageBase(BaseModel):
    title: str
    description: str | None = None
    price: float | None = None
    capacity: int | None = None
    duration: str | None = None
    image_url: str | None = None
    is_available: bool = True


class PackageCreate(PackageBase):
    provider_id: int | None = None


class PackageUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None
    capacity: int | None = None
    duration: str | None = None
    image_url: str | None = None
    is_available: bool | None = None
    is_active: bool | None = None
    provider_id: int | None = None


class PackageOut(PackageBase):
    id: int
    provider_id: int
    provider_name: str | None = None
    category_name: str | None = None
    is_active: bool = True
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
