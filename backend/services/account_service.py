from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from category_rules import is_removed_category
from models import Customer, ServiceCategory, ServiceProvider, User
from schemas.account import AccountUpdate


def get_profile(user: User) -> Customer | ServiceProvider | None:
    return user.customer_profile if user.role == "customer" else user.service_provider_profile


def apply_customer_update(profile: Customer | None, payload: AccountUpdate) -> None:
    if not profile:
        return
    for field in ["phone", "location", "wedding_date", "guest_count", "budget", "preferences"]:
        value = getattr(payload, field)
        if value is not None:
            setattr(profile, field, value)


def apply_provider_update(profile: ServiceProvider | None, payload: AccountUpdate, db: Session) -> None:
    if not profile:
        return
    if payload.category_id is not None:
        category = db.get(ServiceCategory, payload.category_id)
        if not category or is_removed_category(category.name):
            raise HTTPException(status_code=400, detail="Selected category does not exist.")
    for field in ["business_name", "description", "phone", "location", "category_id", "availability"]:
        value = getattr(payload, field)
        if value is not None:
            setattr(profile, field, value)


def serialize_account(user: User) -> dict:
    profile = get_profile(user)
    return {"user": user_data(user), "profile": profile_data(profile), "role": user.role}


def user_data(user: User) -> dict:
    return {"id": user.id, "full_name": user.full_name, "email": user.email,
            "role": user.role, "profile_image": user.profile_image}


def profile_data(profile: Customer | ServiceProvider | None) -> dict:
    if not profile:
        return {}
    data = {key: value for key, value in vars(profile).items() if not key.startswith("_")}
    data.pop("user", None)
    data.pop("category", None)
    return data


def success(message: str, data: dict) -> dict:
    return {"success": True, "message": message, "data": data}


def error(message: str, status_code: int) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"success": False, "message": message})
