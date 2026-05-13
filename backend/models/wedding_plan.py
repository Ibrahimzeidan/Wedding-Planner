from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, ForeignKey, Integer, JSON, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class WeddingPlan(Base):
    __tablename__ = "wedding_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    wedding_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    budget: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    guest_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    location: Mapped[str | None] = mapped_column(String(160), nullable=True)
    wedding_style: Mapped[str | None] = mapped_column(String(120), nullable=True)
    preferred_services: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = relationship("Customer", back_populates="wedding_plan")
