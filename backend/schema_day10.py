from sqlalchemy import text

from database import engine


def ensure_day10_schema() -> None:
    statements = [
        """
        CREATE TABLE IF NOT EXISTS ai_conversations (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
            wedding_plan_id INTEGER REFERENCES wedding_plans(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS ai_messages (
            id SERIAL PRIMARY KEY,
            conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
            sender VARCHAR(20) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS ai_recommendations (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
            wedding_plan_id INTEGER NOT NULL REFERENCES wedding_plans(id) ON DELETE CASCADE,
            total_estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
            remaining_budget NUMERIC(12, 2),
            recommendation_summary TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS total_estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS remaining_budget NUMERIC(12, 2)",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS recommendation_summary TEXT",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS package_id INTEGER",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS provider_id INTEGER",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS category_name VARCHAR(120)",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS reason TEXT",
        "ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS estimated_cost NUMERIC(10, 2)",
        "ALTER TABLE ai_recommendations ALTER COLUMN package_id DROP NOT NULL",
        "ALTER TABLE ai_recommendations ALTER COLUMN provider_id DROP NOT NULL",
        "ALTER TABLE ai_recommendations ALTER COLUMN category_name DROP NOT NULL",
        "ALTER TABLE ai_recommendations ALTER COLUMN reason DROP NOT NULL",
        "ALTER TABLE ai_recommendations ALTER COLUMN estimated_cost DROP NOT NULL",
        """
        CREATE TABLE IF NOT EXISTS ai_recommendation_items (
            id SERIAL PRIMARY KEY,
            recommendation_id INTEGER NOT NULL REFERENCES ai_recommendations(id) ON DELETE CASCADE,
            provider_id INTEGER NOT NULL REFERENCES service_providers(id),
            package_id INTEGER NOT NULL REFERENCES service_packages(id),
            category_name VARCHAR(120) NOT NULL,
            item_price NUMERIC(10, 2) NOT NULL,
            reason TEXT NOT NULL
        )
        """,
        "CREATE INDEX IF NOT EXISTS ix_ai_conversations_customer_id ON ai_conversations (customer_id)",
        "CREATE INDEX IF NOT EXISTS ix_ai_messages_conversation_id ON ai_messages (conversation_id)",
        "CREATE INDEX IF NOT EXISTS ix_ai_recommendations_plan_id ON ai_recommendations (wedding_plan_id)",
        "CREATE INDEX IF NOT EXISTS ix_ai_recommendation_items_rec_id ON ai_recommendation_items (recommendation_id)",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
