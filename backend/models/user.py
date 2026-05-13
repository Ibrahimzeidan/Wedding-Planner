from datetime import datetime, timezone

from sqlalchemy import Boolean, CheckConstraint, DateTime, Index, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "role IN ('customer', 'service_provider', 'admin')",
            name="check_user_role",
        ),
        Index(
            "ix_users_single_admin",
            "role",
            unique=True,
            postgresql_where=text("role = 'admin'"),
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column("password", String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="customer", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    profile_image: Mapped[str | None] = mapped_column(String(1200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer_profile = relationship(
        "Customer",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )
    service_provider_profile = relationship(
        "ServiceProvider",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )
