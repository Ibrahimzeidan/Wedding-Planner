from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)
    wedding_plan_id: int | None = None


class AIRecommendationItem(BaseModel):
    id: int | None = None
    package_id: int
    provider_id: int
    category: str
    provider: str
    package: str
    price: float
    reason: str
    rating: float | None = None
    location: str | None = None
    capacity: int | None = None


class AIRecommendationOption(BaseModel):
    title: str
    total_estimated_cost: float
    remaining_budget: float | None = None
    difference: str
    items: list[AIRecommendationItem] = Field(default_factory=list)


class AIRecommendationSummary(BaseModel):
    total_estimated_cost: float
    remaining_budget: float | None = None
    recommendation_summary: str | None = None
    items: list[AIRecommendationItem] = Field(default_factory=list)
    options: list[AIRecommendationOption] = Field(default_factory=list)


class AIReplacementData(BaseModel):
    category: str
    provider_id: int
    package_id: int
    provider: str
    package: str
    price: float
    reason: str
    rating: float | None = None
    location: str | None = None
    capacity: int | None = None


class AIReplacementResponse(BaseModel):
    success: bool
    message: str
    data: AIReplacementData | None = None


class AIChatResponse(AIRecommendationSummary):
    conversation_id: int
    message: str


class AIStoredMessage(BaseModel):
    id: int
    sender: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIHistoryResponse(BaseModel):
    conversation_id: int
    messages: list[AIStoredMessage] = Field(default_factory=list)


class AISavedRecommendation(BaseModel):
    id: int
    customer_id: int
    wedding_plan_id: int
    total_estimated_cost: float
    remaining_budget: float | None = None
    recommendation_summary: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
