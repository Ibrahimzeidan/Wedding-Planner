from datetime import datetime

from pydantic import BaseModel, Field


class ConversationOut(BaseModel):
    id: int
    customer_id: int
    provider_id: int
    booking_id: int | None = None
    customer_name: str | None = None
    provider_name: str | None = None
    last_message: str | None = None
    unread_count: int = 0
    created_at: datetime


class MessageCreate(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    sender_name: str | None = None
    sender_role: str | None = None
    message: str
    is_read: bool
    created_at: datetime
