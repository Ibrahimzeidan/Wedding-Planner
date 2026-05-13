from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("service_categories.id"),
        nullable=False,
    )
    business_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(String(160), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(40), nullable=True)
    availability: Mapped[str | None] = mapped_column(Text, nullable=True)
    rating: Mapped[float] = mapped_column(Numeric(3, 2), default=4.5, nullable=False)
    venue_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    max_guests: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="service_provider_profile")
    category = relationship("ServiceCategory", back_populates="providers")
    packages = relationship(
        "ServicePackage",
        back_populates="provider",
        cascade="all, delete-orphan",
    )
    favorites = relationship(
        "Favorite",
        back_populates="provider",
        cascade="all, delete-orphan",
    )
    reviews = relationship(
        "Review",
        back_populates="provider",
        cascade="all, delete-orphan",
    )
