from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Conversation(Base):
    __tablename__ = "conversations"
    __table_args__ = (
        UniqueConstraint("customer_id", "provider_id", name="uq_customer_provider_chat"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    provider_id: Mapped[int] = mapped_column(ForeignKey("service_providers.id"), nullable=False)
    booking_id: Mapped[int | None] = mapped_column(ForeignKey("bookings.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = relationship("Customer")
    provider = relationship("ServiceProvider")
    booking = relationship("Booking", back_populates="conversation")
    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
