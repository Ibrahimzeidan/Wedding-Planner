import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from models import Customer, ServiceCategory, ServiceProvider, User
from routers.admin_categories import router as admin_categories_router
from routers.admin_data import router as admin_data_router
from routers.auth import router as auth_router
from routers.contact import router as contact_router
from routers.health import router as health_router
from routers.service_categories import router as service_categories_router
from schema_updates import ensure_day7_schema
from seed import seed_default_admin, seed_default_service_categories

logger = logging.getLogger(__name__)

# Importing models registers the tables with SQLAlchemy before table creation.
_ = (Customer, ServiceCategory, ServiceProvider, User)

app = FastAPI(title="Smart Wedding Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(contact_router)
app.include_router(auth_router)
app.include_router(service_categories_router)
app.include_router(admin_categories_router)
app.include_router(admin_data_router)


@app.on_event("startup")
def create_database_tables() -> None:
    try:
        # Creates tables automatically when the database is reachable.
        Base.metadata.create_all(bind=engine)
        ensure_day7_schema()
        seed_default_admin()
        seed_default_service_categories()
    except SQLAlchemyError as error:
        logger.warning("Database tables were not created: %s", error)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Smart Wedding Planner API"}
