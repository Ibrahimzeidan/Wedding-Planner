from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WeddingPackageBase(BaseModel):
    title: str
    description: str | None = None
    total_price: float = 0
    image_url: str | None = None
    guest_capacity: int | None = None
    is_active: bool = True


class WeddingPackageCreate(WeddingPackageBase):
    pass


class WeddingPackageUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    total_price: float | None = None
    image_url: str | None = None
    guest_capacity: int | None = None
    is_active: bool | None = None


class WeddingPackageItemCreate(BaseModel):
    service_provider_id: int
    service_package_id: int | None = None
    category_name: str
    item_price: float = 0


class WeddingPackageItemOut(WeddingPackageItemCreate):
    id: int
    provider_name: str | None = None
    provider_image: str | None = None
    provider_location: str | None = None
    provider_category: str | None = None
    package_title: str | None = None

    model_config = ConfigDict(from_attributes=True)


class WeddingPackageOut(WeddingPackageBase):
    id: int
    created_at: datetime
    items: list[WeddingPackageItemOut] = []

    model_config = ConfigDict(from_attributes=True)
