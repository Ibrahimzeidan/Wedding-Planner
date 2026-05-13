from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import User


def get_or_404(db: Session, model: type, item_id: int):
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item


def protect_only_admin(user: User, role: str | None = None, is_delete: bool = False) -> None:
    if user.role != "admin":
        return
    if is_delete or role and role != "admin":
        raise HTTPException(status_code=400, detail="The only admin account is protected.")


def admin_exists(db: Session, exclude_id: int | None = None) -> bool:
    query = select(User).where(User.role == "admin")
    if exclude_id:
        query = query.where(User.id != exclude_id)
    return db.scalar(query) is not None
