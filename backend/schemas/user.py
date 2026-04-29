from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

UserRole = Literal["customer", "service_provider", "admin"]


class UserBase(BaseModel):
    full_name: str
    email: str
    role: UserRole = "customer"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
