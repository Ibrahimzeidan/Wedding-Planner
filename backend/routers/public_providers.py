from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from schemas.service import ServicePackageOut, ServiceProviderDetailOut
from services.service_query import get_provider_detail, list_packages

router = APIRouter(prefix="/providers", tags=["Providers"])


@router.get("/{provider_id}", response_model=ServiceProviderDetailOut)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = get_provider_detail(db, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found.")
    return provider


@router.get("/{provider_id}/packages", response_model=list[ServicePackageOut])
def get_provider_packages(provider_id: int, db: Session = Depends(get_db)):
    return list_packages(db, provider_id=provider_id)
