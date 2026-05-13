from pydantic import BaseModel, ConfigDict, Field


class ServiceCategoryOut(BaseModel):
    id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ServicePackageOut(BaseModel):
    id: int
    provider_id: int
    provider_name: str
    category_name: str
    title: str
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    duration: str | None = None
    capacity: int | None = None
    is_available: bool


class ServiceProviderOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    category_id: int | None = None
    business_name: str | None = None
    category_name: str
    description: str | None = None
    phone: str | None = None
    location: str | None = None
    profile_image: str | None = None
    rating: float
    review_count: int = 33
    package_title: str | None = None
    package_price: float | None = None
    package_image: str | None = None
    venue_type: str | None = None
    max_guests: int | None = None
    packages: list[ServicePackageOut] = Field(default_factory=list)


class ServiceProviderDetailOut(ServiceProviderOut):
    packages: list[ServicePackageOut]


class VenueOut(ServiceProviderOut):
    venue_type: str | None = None
    max_guests: int | None = None
