from sqlalchemy.orm import Session

from schemas.ai import AIRecommendationItem
from services.ai_candidate_service import candidate_items


def build_package_candidates(
    db: Session,
    customer_id: int,
    memory: dict,
    message: str,
    mode: str,
    favorites_only: bool,
) -> list[AIRecommendationItem]:
    return candidate_items(db, customer_id, memory, message, mode, favorites_only)
