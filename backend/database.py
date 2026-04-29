import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# Load variables from backend/.env into the Python app.
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is missing. Add it to backend/.env before starting the API.")

# Supabase PostgreSQL uses SSL. connect_timeout keeps failed checks from hanging.
engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require", "connect_timeout": 10},
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All SQLAlchemy models will inherit from this Base.
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
