import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from models import User
from routers.health import router as health_router

logger = logging.getLogger(__name__)

# Importing User registers the users table with SQLAlchemy before table creation.
_ = User

app = FastAPI(title="Smart Wedding Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)


@app.on_event("startup")
def create_database_tables() -> None:
    try:
        # Creates tables automatically when the database is reachable.
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError as error:
        logger.warning("Database tables were not created: %s", error)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Smart Wedding Planner API"}
