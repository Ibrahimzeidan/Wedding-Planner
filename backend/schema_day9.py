from sqlalchemy import text

from database import engine


def ensure_day9_schema() -> None:
    statements = [
        """
        CREATE TABLE IF NOT EXISTS wedding_plans (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
            wedding_date DATE,
            budget NUMERIC(12, 2),
            guest_count INTEGER,
            location VARCHAR(160),
            wedding_style VARCHAR(120),
            preferred_services JSON NOT NULL DEFAULT '[]'::json,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
            provider_id INTEGER REFERENCES service_providers(id) ON DELETE CASCADE,
            package_id INTEGER REFERENCES wedding_packages(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_customer_provider_favorite UNIQUE (customer_id, provider_id)
        )
        """,
        "ALTER TABLE favorites ADD COLUMN IF NOT EXISTS package_id INTEGER",
        "ALTER TABLE favorites ALTER COLUMN provider_id DROP NOT NULL",
        """
        DO $$ BEGIN
            ALTER TABLE favorites
            ADD CONSTRAINT favorites_package_id_fkey
            FOREIGN KEY (package_id) REFERENCES wedding_packages(id) ON DELETE CASCADE;
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
        """,
        "CREATE INDEX IF NOT EXISTS ix_favorites_customer_id ON favorites (customer_id)",
        "CREATE INDEX IF NOT EXISTS ix_favorites_provider_id ON favorites (provider_id)",
        "CREATE INDEX IF NOT EXISTS ix_favorites_package_id ON favorites (package_id)",
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ux_customer_package_favorite
        ON favorites (customer_id, package_id) WHERE package_id IS NOT NULL
        """,
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
