from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (
        UniqueConstraint("customer_id", "provider_id", name="uq_customer_provider_favorite"),
        UniqueConstraint("customer_id", "package_id", name="uq_customer_package_favorite"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
    )
    provider_id: Mapped[int | None] = mapped_column(
        ForeignKey("service_providers.id", ondelete="CASCADE"),
        nullable=True,
    )
    package_id: Mapped[int | None] = mapped_column(
        ForeignKey("wedding_packages.id", ondelete="CASCADE"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = relationship("Customer", back_populates="favorites")
    provider = relationship("ServiceProvider", back_populates="favorites")
    package = relationship("WeddingPackage", back_populates="favorites")
