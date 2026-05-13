from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from category_rules import is_removed_category, visible_category_query
from database import get_db
from dependencies import require_admin
from models import ServiceCategory, ServiceProvider
from schemas.admin import AdminCategoryResponse, CategoryPayload
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok

router = APIRouter(prefix="/admin/categories", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[AdminCategoryResponse]])
def list_categories(db: Session = Depends(get_db)):
    return ok(list(db.scalars(visible_category_query().order_by(ServiceCategory.name)).all()))


@router.post("", response_model=AdminResponse[AdminCategoryResponse], status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryPayload, db: Session = Depends(get_db)):
    if is_removed_category(payload.name):
        raise HTTPException(status_code=400, detail="This category is no longer available.")
    ensure_unique_name(db, payload.name)
    category = ServiceCategory(name=payload.name, description=payload.description)
    db.add(category)
    db.commit()
    db.refresh(category)
    return ok(category, "Category created successfully")


@router.put("/{category_id}", response_model=AdminResponse[AdminCategoryResponse])
def update_category(
    category_id: int,
    payload: CategoryPayload,
    db: Session = Depends(get_db),
):
    category = db.get(ServiceCategory, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    if is_removed_category(payload.name):
        raise HTTPException(status_code=400, detail="This category is no longer available.")
    ensure_unique_name(db, payload.name, category_id)
    category.name = payload.name
    category.description = payload.description
    db.commit()
    db.refresh(category)
    return ok(category, "Category updated successfully")


@router.delete("/{category_id}", response_model=SimpleResponse)
def delete_category(category_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    category = db.get(ServiceCategory, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    provider_count = db.scalar(
        select(func.count(ServiceProvider.id)).where(ServiceProvider.category_id == category_id)
    )
    if provider_count:
        raise HTTPException(status_code=400, detail="Category has providers.")
    db.delete(category)
    db.commit()
    return SimpleResponse(message="Category deleted successfully.")


def ensure_unique_name(db: Session, name: str, category_id: int | None = None) -> None:
    existing = db.scalar(select(ServiceCategory).where(func.lower(ServiceCategory.name) == name.lower()))
    if existing and existing.id != category_id:
        raise HTTPException(status_code=409, detail="Category name already exists.")
