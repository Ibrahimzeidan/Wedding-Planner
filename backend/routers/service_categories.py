from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import ServiceCategory
from schemas.service_category import ServiceCategoryResponse

router = APIRouter(prefix="/service-categories", tags=["Service Categories"])


@router.get("", response_model=list[ServiceCategoryResponse])
def list_service_categories(db: Session = Depends(get_db)) -> list[ServiceCategory]:
    return list(db.scalars(select(ServiceCategory).order_by(ServiceCategory.name)).all())
