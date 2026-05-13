from sqlalchemy.exc import SQLAlchemyError

from category_rules import cleanup_removed_category
from database import SessionLocal


def remove_venue_planner_category() -> None:
    try:
        with SessionLocal() as db:
            cleanup_removed_category(db)
            db.commit()
    except SQLAlchemyError:
        raise
