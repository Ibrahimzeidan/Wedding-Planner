from datetime import datetime

from pydantic import BaseModel


class AdminAIItem(BaseModel):
    id: int
    provider_id: int
    package_id: int
    category_name: str
    provider_name: str | None = None
    package_title: str | None = None
    item_price: float
    reason: str


class AdminAIRecommendation(BaseModel):
    id: int
    customer_id: int
    customer_name: str | None = None
    wedding_plan_id: int
    total_estimated_cost: float
    remaining_budget: float | None = None
    recommendation_summary: str | None = None
    created_at: datetime
    items: list[AdminAIItem] = []
