from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class ProviderNotification(Base):
    __tablename__ = "provider_notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("service_providers.id"), nullable=False)
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    customer_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    event_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    wedding_location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    wedding_details: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    provider = relationship("ServiceProvider")
    booking = relationship("Booking")
