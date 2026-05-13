from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class WeddingPackageItem(Base):
    __tablename__ = "wedding_package_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    wedding_package_id: Mapped[int] = mapped_column(
        ForeignKey("wedding_packages.id", ondelete="CASCADE"),
        nullable=False,
    )
    service_provider_id: Mapped[int] = mapped_column(
        ForeignKey("service_providers.id"),
        nullable=False,
    )
    service_package_id: Mapped[int | None] = mapped_column(
        ForeignKey("service_packages.id"),
        nullable=True,
    )
    category_name: Mapped[str] = mapped_column(String(120), nullable=False)
    item_price: Mapped[float] = mapped_column(Numeric(10, 2), default=0, nullable=False)

    wedding_package = relationship("WeddingPackage", back_populates="items")
    service_provider = relationship("ServiceProvider")
    service_package = relationship("ServicePackage")
