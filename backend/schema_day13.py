from sqlalchemy import text

from database import engine


def ensure_day13_schema() -> None:
    statements = [
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_response_note TEXT",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_confirmed BOOLEAN NOT NULL DEFAULT TRUE",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_confirmed BOOLEAN NOT NULL DEFAULT FALSE",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
        "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS booking_id INTEGER REFERENCES bookings(id)",
        """
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(160) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(60) NOT NULL,
            is_read BOOLEAN NOT NULL DEFAULT FALSE,
            related_booking_id INTEGER REFERENCES bookings(id),
            related_provider_id INTEGER REFERENCES service_providers(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        "CREATE INDEX IF NOT EXISTS ix_notifications_user_id ON notifications (user_id)",
        "CREATE INDEX IF NOT EXISTS ix_notifications_booking_id ON notifications (related_booking_id)",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
