from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from schemas.user import UserResponse, UserRole


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=6, max_length=128)
    role: Literal["customer", "service_provider"]
    category: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)
    address: str | None = Field(default=None, max_length=255)
    preferences: dict[str, Any] = Field(default_factory=dict)
    category_id: int | None = None
    business_name: str | None = Field(default=None, max_length=160)
    description: str | None = None
    location: str | None = Field(default=None, max_length=160)

    @model_validator(mode="after")
    def validate_profile_fields(self) -> "RegisterRequest":
        if self.role != "service_provider":
            return self

        if not self.category and not self.category_id:
            raise ValueError("Service provider registration requires a service category.")

        return self


class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
    profile_id: int

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    user_id: int
    email: str
    role: UserRole
