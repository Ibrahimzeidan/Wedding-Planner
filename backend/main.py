import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

import models
from app_routers import app_routers
from category_cleanup import remove_venue_planner_category
from database import Base, engine
from schema_day10 import ensure_day10_schema
from schema_day11 import ensure_day11_schema
from schema_day12 import ensure_day12_schema
from schema_day13 import ensure_day13_schema
from schema_day9 import ensure_day9_schema
from schema_updates import ensure_day7_schema, ensure_day8_schema
from seed import seed_default_admin, seed_default_service_categories
from wedding_package_seed import seed_default_wedding_packages
from settings import cors_origins

logger = logging.getLogger(__name__)

_ = models

app = FastAPI(title="Smart Wedding Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in app_routers:
    app.include_router(router)


@app.on_event("startup")
def create_database_tables() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        ensure_day7_schema()
        ensure_day8_schema()
        ensure_day9_schema()
        ensure_day10_schema()
        ensure_day11_schema()
        ensure_day12_schema()
        ensure_day13_schema()
        seed_default_admin()
        seed_default_service_categories()
        remove_venue_planner_category()
        seed_default_wedding_packages()
    except SQLAlchemyError as error:
        logger.warning("Database tables were not created: %s", error)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Smart Wedding Planner API"}
