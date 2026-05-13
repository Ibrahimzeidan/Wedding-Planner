from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from category_rules import is_removed_category, visible_category_query
from database import get_db
from dependencies import require_admin
from models import ServiceCategory, ServiceProvider
from schemas.admin import AdminCategoryResponse, CategoryPayload

router = APIRouter(prefix="/admin/categories", tags=["Admin"], dependencies=[Depends(require_admin)])


def find_category_by_name(db: Session, name: str) -> ServiceCategory | None:
    statement = select(ServiceCategory).where(func.lower(ServiceCategory.name) == name.lower())
    return db.scalar(statement)


def ensure_unique_name(db: Session, name: str, category_id: int | None = None) -> None:
    existing = find_category_by_name(db, name)
    if existing and existing.id != category_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category name already exists.",
        )


@router.get("", response_model=list[AdminCategoryResponse])
def list_admin_categories(db: Session = Depends(get_db)) -> list[ServiceCategory]:
    statement = visible_category_query().order_by(ServiceCategory.name)
    return list(db.scalars(statement).all())


@router.post("", response_model=AdminCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryPayload,
    db: Session = Depends(get_db),
) -> ServiceCategory:
    if is_removed_category(payload.name):
        raise HTTPException(status_code=400, detail="This category is no longer available.")
    ensure_unique_name(db, payload.name)
    category = ServiceCategory(name=payload.name, description=payload.description)

    try:
        db.add(category)
        db.commit()
        db.refresh(category)
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=500, detail="Category could not be saved.") from error

    return category


@router.put("/{category_id}", response_model=AdminCategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryPayload,
    db: Session = Depends(get_db),
) -> ServiceCategory:
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
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    category = db.get(ServiceCategory, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")

    providers_count = db.scalar(
        select(func.count(ServiceProvider.id)).where(ServiceProvider.category_id == category_id)
    )
    if providers_count:
        raise HTTPException(status_code=400, detail="Category has providers and cannot be deleted.")

    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully."}
