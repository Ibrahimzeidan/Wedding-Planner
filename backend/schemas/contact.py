from pydantic import BaseModel, Field, field_validator


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=255)
    phone: str | None = Field(default=None, max_length=40)
    message: str = Field(min_length=5, max_length=2000)

    @field_validator("email")
    @classmethod
    def valid_email(cls, value: str) -> str:
        email = value.strip().lower()
        if "@" not in email or "." not in email.split("@")[-1]:
            raise ValueError("Enter a valid email address.")
        return email

    @field_validator("name", "message", "phone")
    @classmethod
    def clean_text(cls, value: str | None) -> str | None:
        return value.strip() if value else None
