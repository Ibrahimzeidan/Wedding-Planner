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
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
