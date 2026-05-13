from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class WeddingPackage(Base):
    __tablename__ = "wedding_packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_price: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(1200), nullable=True)
    guest_capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    items = relationship(
        "WeddingPackageItem",
        back_populates="wedding_package",
        cascade="all, delete-orphan",
    )
    favorites = relationship(
        "Favorite",
        back_populates="package",
        cascade="all, delete-orphan",
    )
