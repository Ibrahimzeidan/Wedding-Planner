from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_service_provider
from models import User
from schemas.admin_common import SimpleResponse
from schemas.package import PackageCreate, PackageOut, PackageUpdate
from services.package_service import create_package, list_provider_packages
from services.package_service import owned_package, provider_for_user, update_package

router = APIRouter(prefix="/provider/packages", tags=["Provider Packages"])


@router.get("", response_model=list[PackageOut])
def get_packages(
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    provider = provider_for_user(db, user)
    return list_provider_packages(db, provider.id)


@router.post("", response_model=PackageOut)
def add_package(
    payload: PackageCreate,
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    provider = provider_for_user(db, user)
    return create_package(db, payload, provider.id)


@router.put("/{package_id}", response_model=PackageOut)
def edit_package(
    package_id: int,
    payload: PackageUpdate,
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    provider = provider_for_user(db, user)
    package = owned_package(db, package_id, provider.id)
    return update_package(db, package, payload)


@router.delete("/{package_id}", response_model=SimpleResponse)
def delete_package(
    package_id: int,
    user: User = Depends(require_service_provider),
    db: Session = Depends(get_db),
):
    provider = provider_for_user(db, user)
    package = owned_package(db, package_id, provider.id)
    db.delete(package)
    db.commit()
    return SimpleResponse(message="Package deleted successfully.")
