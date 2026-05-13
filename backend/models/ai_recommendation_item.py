from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class AIRecommendationItem(Base):
    __tablename__ = "ai_recommendation_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    recommendation_id: Mapped[int] = mapped_column(
        ForeignKey("ai_recommendations.id", ondelete="CASCADE"),
        nullable=False,
    )
    provider_id: Mapped[int] = mapped_column(ForeignKey("service_providers.id"), nullable=False)
    package_id: Mapped[int] = mapped_column(ForeignKey("service_packages.id"), nullable=False)
    category_name: Mapped[str] = mapped_column(String(120), nullable=False)
    item_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)

    recommendation = relationship("AIRecommendation", back_populates="items")
    package = relationship("ServicePackage")
    provider = relationship("ServiceProvider")
