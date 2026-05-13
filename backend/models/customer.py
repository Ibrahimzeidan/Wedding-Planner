from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, JSON, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    phone: Mapped[str | None] = mapped_column(String(40), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location: Mapped[str | None] = mapped_column(String(160), nullable=True)
    wedding_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    guest_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    budget: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    preferences: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    user = relationship("User", back_populates="customer_profile")
    wedding_plan = relationship(
        "WeddingPlan",
        back_populates="customer",
        cascade="all, delete-orphan",
        uselist=False,
    )
    favorites = relationship(
        "Favorite",
        back_populates="customer",
        cascade="all, delete-orphan",
    )
