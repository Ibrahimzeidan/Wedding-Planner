from sqlalchemy import select
from sqlalchemy.orm import Session

from models import AIConversation, AIRecommendation, AIRecommendationItem, WeddingPlan
from services.ai_memory_answers import apply_text_memory, current_expected_detail
from services.ai_memory_answers import expected_detail_from_assistant
from services.ai_selection_memory import apply_selection_memory


def memory_from_plan(plan: WeddingPlan | None) -> dict:
    if not plan:
        return {"preferred_services": []}
    return {
        "budget": float(plan.budget) if plan.budget else None,
        "guest_count": plan.guest_count,
        "wedding_date": plan.wedding_date.isoformat() if plan.wedding_date else None,
        "location": plan.location,
        "preferred_services": plan.preferred_services or [],
    }


def build_memory(
    db: Session,
    plan: WeddingPlan | None,
    conversation: AIConversation,
    message: str,
) -> dict:
    memory = memory_from_plan(plan)
    expected_detail = None
    for item in sorted(conversation.messages, key=lambda row: (row.created_at, row.id or 0)):
        if item.sender == "assistant":
            expected_detail = expected_detail_from_assistant(item.message)
            continue
        if item.sender == "user":
            memory = apply_text_memory(memory, item.message, expected_detail)
            expected_detail = None
    memory = apply_text_memory(memory, message, expected_detail)
    memory = apply_selection_memory(db, conversation.customer_id, plan, memory, message)
    memory["previous_package_ids"] = previous_package_ids(db, conversation.customer_id, plan)
    memory["customer_id"] = conversation.customer_id
    memory["current_budget"] = memory.get("budget")
    memory["current_guest_count"] = memory.get("guest_count")
    memory["current_location"] = memory.get("location")
    memory["current_event_date"] = memory.get("wedding_date")
    return memory


def previous_package_ids(db: Session, customer_id: int, plan: WeddingPlan | None) -> list[int]:
    if not plan:
        return []
    query = select(AIRecommendationItem.package_id).join(AIRecommendation).where(
        AIRecommendation.customer_id == customer_id,
        AIRecommendation.wedding_plan_id == plan.id,
    )
    return list(db.scalars(query.order_by(AIRecommendation.created_at.desc()).limit(12)).all())


__all__ = [
    "apply_text_memory",
    "build_memory",
    "current_expected_detail",
    "expected_detail_from_assistant",
    "memory_from_plan",
    "previous_package_ids",
]
