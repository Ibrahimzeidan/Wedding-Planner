from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class FavoriteResponse(BaseModel):
    id: int
    customer_id: int
    favorite_type: Literal["provider", "package"]
    provider_id: int | None = None
    package_id: int | None = None
    provider_name: str | None = None
    package_title: str | None = None
    category_name: str
    location: str | None = None
    rating: float = 0
    image_url: str | None = None
    created_at: datetime
    customer_name: str | None = None
    customer_email: str | None = None
