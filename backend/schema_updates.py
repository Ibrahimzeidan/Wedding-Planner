from sqlalchemy import text

from database import engine


def ensure_day7_schema() -> None:
    statements = [
        """
        ALTER TABLE service_categories
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        """,
        "ALTER TABLE service_providers ALTER COLUMN business_name DROP NOT NULL",
        "ALTER TABLE service_providers ALTER COLUMN phone DROP NOT NULL",
        "ALTER TABLE service_providers ALTER COLUMN location DROP NOT NULL",
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ix_users_single_admin
        ON users (role) WHERE role = 'admin'
        """,
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(1200)",
        "ALTER TABLE customers ADD COLUMN IF NOT EXISTS location VARCHAR(160)",
        "ALTER TABLE customers ADD COLUMN IF NOT EXISTS wedding_date DATE",
        "ALTER TABLE customers ADD COLUMN IF NOT EXISTS guest_count INTEGER",
        "ALTER TABLE customers ADD COLUMN IF NOT EXISTS budget NUMERIC(12, 2)",
        "ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS availability TEXT",
        "ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) NOT NULL DEFAULT 4.5",
        "ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS venue_type VARCHAR(120)",
        "ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS max_guests INTEGER",
        "ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS image_url VARCHAR(1200)",
        "ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS duration VARCHAR(80)",
        "ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS capacity INTEGER",
        "ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE",
        "ALTER TABLE service_packages ALTER COLUMN image_url TYPE TEXT",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def ensure_day8_schema() -> None:
    statements = [
        "ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE",
        """
        CREATE TABLE IF NOT EXISTS wedding_packages (
            id SERIAL PRIMARY KEY,
            title VARCHAR(160) NOT NULL,
            description TEXT,
            total_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
            image_url VARCHAR(1200),
            guest_capacity INTEGER,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS wedding_package_items (
            id SERIAL PRIMARY KEY,
            wedding_package_id INTEGER NOT NULL REFERENCES wedding_packages(id) ON DELETE CASCADE,
            service_provider_id INTEGER NOT NULL REFERENCES service_providers(id),
            service_package_id INTEGER REFERENCES service_packages(id),
            category_name VARCHAR(120) NOT NULL,
            item_price NUMERIC(10, 2) NOT NULL DEFAULT 0
        )
        """,
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
