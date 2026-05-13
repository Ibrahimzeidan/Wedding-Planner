from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from category_rules import visible_category_query
from database import get_db
from models import ServiceCategory
from schemas.service_category import ServiceCategoryResponse

router = APIRouter(prefix="/service-categories", tags=["Service Categories"])


@router.get("", response_model=list[ServiceCategoryResponse])
def list_service_categories(db: Session = Depends(get_db)) -> list[ServiceCategory]:
    return list(db.scalars(visible_category_query().order_by(ServiceCategory.name)).all())
