import os
import sys
from pathlib import Path

os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ["GEMINI_API_KEY"] = ""
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import models
from database import Base, get_db
from routers import auth, bookings, contact, favorites, health, messages, notifications, provider_packages, reviews
from routers import service_categories
from routers import services, wedding_plans
from routers.admin import bookings as admin_bookings
from routers.admin import categories as admin_categories
from routers.admin import customers as admin_customers
from routers.admin import messages as admin_messages
from routers.admin import packages as admin_packages
from routers.admin import providers as admin_providers
from routers.admin import reviews as admin_reviews
from routers.admin import notifications as admin_notifications
from routers.admin import users as admin_users
from routers.admin import ai_recommendations as admin_ai_recommendations
from routers.ai import router as ai_router
from routers.provider import bookings as provider_bookings
from routers.provider import reviews as provider_reviews

_ = models


@pytest.fixture()
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with engine.begin() as conn:
        conn.execute(text("DROP INDEX IF EXISTS ix_users_single_admin"))
    SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)


@pytest.fixture()
def client(db):
    app = FastAPI()
    for router in routers():
        app.include_router(router)

    def override_db():
        yield db

    app.dependency_overrides[get_db] = override_db
    return TestClient(app)


def routers():
    return [
        auth.router, contact.router, service_categories.router, services.router, wedding_plans.router,
        health.router, favorites.router, bookings.router, messages.router, notifications.router, provider_packages.router,
        provider_bookings.router, provider_reviews.router, reviews.router, ai_router, admin_categories.router,
        admin_packages.router, admin_bookings.router, admin_users.router, admin_customers.router,
        admin_providers.router, admin_reviews.router, admin_notifications.router, admin_messages.router,
        admin_ai_recommendations.router,
    ]
