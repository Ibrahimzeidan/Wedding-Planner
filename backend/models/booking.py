from datetime import datetime, timezone

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending','accepted','rejected','cancelled','completed')",
            name="check_booking_status",
        ),
        CheckConstraint(
            "booking_status IN ('pending','accepted','rejected','cancelled','completed')",
            name="check_booking_status_v2",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    provider_id: Mapped[int | None] = mapped_column(ForeignKey("service_providers.id"), nullable=True)
    package_id: Mapped[int | None] = mapped_column(ForeignKey("service_packages.id"), nullable=True)
    wedding_package_id: Mapped[int | None] = mapped_column(ForeignKey("wedding_packages.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    booking_status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    event_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    guest_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(40), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_price: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    payment_method: Mapped[str | None] = mapped_column(String(30), nullable=True)
    payment_status: Mapped[str] = mapped_column(String(30), default="unpaid", nullable=False)
    provider_response_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    customer_confirmed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    provider_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = relationship("Customer")
    provider = relationship("ServiceProvider")
    package = relationship("ServicePackage")
    wedding_package = relationship("WeddingPackage")
    conversation = relationship("Conversation", back_populates="booking", uselist=False)
