from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class ServicePackage(Base):
    __tablename__ = "service_packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("service_providers.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration: Mapped[str | None] = mapped_column(String(80), nullable=True)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    provider = relationship("ServiceProvider", back_populates="packages")
