from sqlalchemy import text

from database import engine


def ensure_day12_schema() -> None:
    statements = [
        """
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES customers(id),
            provider_id INTEGER NOT NULL REFERENCES service_providers(id),
            booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT check_review_rating_range CHECK (rating BETWEEN 1 AND 5)
        )
        """,
        """
        ALTER TABLE reviews
        ADD COLUMN IF NOT EXISTS booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL
        """,
        "CREATE INDEX IF NOT EXISTS ix_reviews_customer_id ON reviews (customer_id)",
        "CREATE INDEX IF NOT EXISTS ix_reviews_provider_id ON reviews (provider_id)",
        "CREATE INDEX IF NOT EXISTS ix_reviews_booking_id ON reviews (booking_id)",
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ix_reviews_booking_unique
        ON reviews (booking_id) WHERE booking_id IS NOT NULL
        """,
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
