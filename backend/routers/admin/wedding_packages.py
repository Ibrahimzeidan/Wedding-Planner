from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import WeddingPackage, WeddingPackageItem
from routers.admin.guards import get_or_404
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.wedding_package import WeddingPackageCreate, WeddingPackageItemCreate
from schemas.wedding_package import WeddingPackageOut, WeddingPackageUpdate
from services.wedding_package_service import create_item, get_wedding_package, wedding_out, wedding_query

router = APIRouter(prefix="/admin/wedding-packages", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[WeddingPackageOut]])
def list_packages(db: Session = Depends(get_db)):
    query = wedding_query().order_by(WeddingPackage.created_at.desc())
    return ok([wedding_out(item) for item in db.scalars(query).unique().all()])


@router.post("", response_model=AdminResponse[WeddingPackageOut])
def create_package(payload: WeddingPackageCreate, db: Session = Depends(get_db)):
    package = WeddingPackage(**payload.model_dump())
    db.add(package)
    db.commit()
    db.refresh(package)
    return ok(wedding_out(package), "Wedding package created successfully")


@router.put("/{package_id}", response_model=AdminResponse[WeddingPackageOut])
def update_package(package_id: int, payload: WeddingPackageUpdate, db: Session = Depends(get_db)):
    package = get_wedding_package(db, package_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(package, field, value)
    db.commit()
    db.refresh(package)
    return ok(wedding_out(package), "Wedding package updated successfully")


@router.delete("/{package_id}", response_model=SimpleResponse)
def delete_package(package_id: int, db: Session = Depends(get_db)):
    db.delete(get_or_404(db, WeddingPackage, package_id))
    db.commit()
    return SimpleResponse(message="Wedding package deleted successfully.")


@router.post("/{package_id}/items", response_model=AdminResponse[WeddingPackageOut])
def add_item(package_id: int, payload: WeddingPackageItemCreate, db: Session = Depends(get_db)):
    create_item(db, package_id, payload)
    return ok(wedding_out(get_wedding_package(db, package_id)), "Package item added successfully")


@router.delete("/{package_id}/items/{item_id}", response_model=AdminResponse[WeddingPackageOut])
def remove_item(package_id: int, item_id: int, db: Session = Depends(get_db)):
    item = get_or_404(db, WeddingPackageItem, item_id)
    if item.wedding_package_id != package_id:
        get_wedding_package(db, package_id)
        raise HTTPException(status_code=404, detail="Package item not found.")
    db.delete(item)
    db.commit()
    return ok(wedding_out(get_wedding_package(db, package_id)), "Package item removed successfully")
