import re

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import ServiceProvider


def mentioned_providers(db: Session, message: str) -> list[ServiceProvider]:
    text = message.lower()
    rows = db.scalars(
        select(ServiceProvider).options(joinedload(ServiceProvider.category))
        .where(ServiceProvider.is_approved.is_(True))
    ).unique().all()
    return [row for row in rows if row.business_name and row.business_name.lower() in text]


def missing_provider_name(message: str, providers: list[ServiceProvider]) -> str | None:
    if providers:
        return None
    wanted = requested_provider_name(message)
    return wanted if wanted and not generic_request(wanted) else None


def requested_provider_name(message: str) -> str | None:
    match = re.search(
        r"\b(?:I want|keep|choose|select)\s+([A-Z][A-Za-z0-9&' -]{2,60})",
        message,
    )
    if not match:
        return None
    name = re.split(r"\b(?:but|and|for|with|in|under)\b|[.!?]", match.group(1))[0]
    return name.strip() or None


def generic_request(name: str) -> bool:
    text = name.lower()
    return any(word in text for word in ["wedding", "package", "budget", "luxury", "simple", "elegant"])
