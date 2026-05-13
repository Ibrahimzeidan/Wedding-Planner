from sqlalchemy import text

from database import engine


def ensure_day11_schema() -> None:
    statements = [
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES service_providers(id)",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS wedding_package_id INTEGER REFERENCES wedding_packages(id)",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_status VARCHAR(30) NOT NULL DEFAULT 'pending'",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_count INTEGER",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone_number VARCHAR(40)",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location VARCHAR(255)",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC(12, 2) NOT NULL DEFAULT 0",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30)",
        "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid'",
        "UPDATE bookings SET booking_status = status WHERE status IS NOT NULL",
        """
        CREATE TABLE IF NOT EXISTS conversations (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES customers(id),
            provider_id INTEGER NOT NULL REFERENCES service_providers(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_customer_provider_chat UNIQUE (customer_id, provider_id)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            sender_id INTEGER NOT NULL REFERENCES users(id),
            message TEXT NOT NULL,
            is_read BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        "CREATE INDEX IF NOT EXISTS ix_bookings_customer_id ON bookings (customer_id)",
        "CREATE INDEX IF NOT EXISTS ix_bookings_provider_id ON bookings (provider_id)",
        "CREATE INDEX IF NOT EXISTS ix_conversations_customer_id ON conversations (customer_id)",
        "CREATE INDEX IF NOT EXISTS ix_conversations_provider_id ON conversations (provider_id)",
        "CREATE INDEX IF NOT EXISTS ix_messages_conversation_id ON messages (conversation_id)",
        """
        CREATE TABLE IF NOT EXISTS provider_notifications (
            id SERIAL PRIMARY KEY,
            provider_id INTEGER NOT NULL REFERENCES service_providers(id),
            booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
            title VARCHAR(160) NOT NULL,
            message TEXT NOT NULL,
            customer_name VARCHAR(120),
            event_date TIMESTAMPTZ,
            wedding_location VARCHAR(255),
            wedding_details TEXT,
            is_read BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        "CREATE INDEX IF NOT EXISTS ix_provider_notifications_provider_id ON provider_notifications (provider_id)",
        "CREATE INDEX IF NOT EXISTS ix_provider_notifications_booking_id ON provider_notifications (booking_id)",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
