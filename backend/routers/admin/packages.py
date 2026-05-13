from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import ServicePackage, ServiceProvider
from routers.admin.guards import get_or_404
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.package import PackageCreate, PackageOut, PackageUpdate
from services.package_service import create_package, package_out, update_package as save_package
from services.package_service import package_query

router = APIRouter(prefix="/admin/packages", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("", response_model=AdminResponse[list[PackageOut]])
def list_packages(
    provider_id: int | None = None,
    category_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = package_query().order_by(ServicePackage.created_at.desc())
    if provider_id:
        query = query.where(ServicePackage.provider_id == provider_id)
    if category_id:
        query = query.join(ServiceProvider).where(ServiceProvider.category_id == category_id)
    return ok([package_out(item) for item in db.scalars(query).unique().all()])


@router.post("", response_model=AdminResponse[PackageOut])
def add_package(payload: PackageCreate, db: Session = Depends(get_db)):
    if not payload.provider_id or not db.get(ServiceProvider, payload.provider_id):
        raise HTTPException(status_code=404, detail="Provider not found.")
    return ok(create_package(db, payload, payload.provider_id), "Package created successfully")


@router.get("/{package_id}", response_model=AdminResponse[PackageOut])
def get_package(package_id: int, db: Session = Depends(get_db)):
    return ok(package_out(get_or_404(db, ServicePackage, package_id)))


@router.put("/{package_id}", response_model=AdminResponse[PackageOut])
def update_package(package_id: int, payload: PackageUpdate, db: Session = Depends(get_db)):
    package = get_or_404(db, ServicePackage, package_id)
    if payload.provider_id and not db.get(ServiceProvider, payload.provider_id):
        raise HTTPException(status_code=404, detail="Provider not found.")
    return ok(save_package(db, package, payload), "Package updated successfully")


@router.delete("/{package_id}", response_model=SimpleResponse)
def delete_package(package_id: int, db: Session = Depends(get_db)) -> SimpleResponse:
    db.delete(get_or_404(db, ServicePackage, package_id))
    db.commit()
    return SimpleResponse(message="Package deleted successfully.")
