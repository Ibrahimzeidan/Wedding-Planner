from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import User
from schemas.account import AccountUpdate, PasswordUpdate, PhotoUpdate
from security import hash_password, verify_password
from services.account_service import (
    apply_customer_update,
    apply_provider_update,
    error,
    get_profile,
    serialize_account,
    success,
)

router = APIRouter(prefix="/account", tags=["Account"])


@router.get("/me")
def get_my_account(user: User = Depends(get_current_user)) -> dict:
    return success("Account loaded.", serialize_account(user))


@router.put("/me")
def update_my_account(
    payload: AccountUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    if payload.full_name is not None:
        user.full_name = payload.full_name.strip()
    profile = get_profile(user)
    apply_customer_update(profile, payload) if user.role == "customer" else None
    apply_provider_update(profile, payload, db) if user.role == "service_provider" else None
    db.commit()
    db.refresh(user)
    return success("Profile updated successfully", serialize_account(user))


@router.put("/password")
def update_password(
    payload: PasswordUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    if not verify_password(payload.current_password, user.password_hash):
        return error("Invalid password", 400)
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return success("Password updated successfully", {})


@router.put("/photo")
def update_photo(
    payload: PhotoUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    user.profile_image = payload.profile_image
    db.commit()
    db.refresh(user)
    return success("Profile photo updated successfully", serialize_account(user))
