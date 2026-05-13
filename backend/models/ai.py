from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
    )
    wedding_plan_id: Mapped[int | None] = mapped_column(
        ForeignKey("wedding_plans.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    messages = relationship(
        "AIMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("ai_conversations.id", ondelete="CASCADE"),
        nullable=False,
    )
    sender: Mapped[str] = mapped_column(String(20), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    conversation = relationship("AIConversation", back_populates="messages")


class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
    )
    wedding_plan_id: Mapped[int] = mapped_column(
        ForeignKey("wedding_plans.id", ondelete="CASCADE"),
        nullable=False,
    )
    total_estimated_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    remaining_budget: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    recommendation_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    items = relationship(
        "AIRecommendationItem",
        back_populates="recommendation",
        cascade="all, delete-orphan",
    )
    customer = relationship("Customer")
    wedding_plan = relationship("WeddingPlan")
