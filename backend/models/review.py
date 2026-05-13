from datetime import datetime, timezone

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="check_review_rating_range"),
        UniqueConstraint("booking_id", name="uq_reviews_booking_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    provider_id: Mapped[int] = mapped_column(ForeignKey("service_providers.id"), nullable=False)
    booking_id: Mapped[int | None] = mapped_column(
        ForeignKey("bookings.id", ondelete="SET NULL"),
        nullable=True,
    )
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = relationship("Customer")
    provider = relationship("ServiceProvider", back_populates="reviews")
    booking = relationship("Booking")
