from sqlalchemy.orm import Session

from schemas.ai import AIRecommendationItem, AIRecommendationSummary
from services.ai_availability_messages import availability_message, remember_item_alternative
from services.ai_package_search import package_candidates, package_score
from services.ai_recommendation_memory import filter_for_memory, recommendation_categories
from services.ai_recommendation_service import item_from_package


def candidate_items(
    db: Session,
    customer_id: int,
    memory: dict,
    message: str,
    mode: str,
    favorites_only: bool,
) -> list[AIRecommendationItem]:
    categories = recommendation_categories(message, memory)[:6]
    items: list[AIRecommendationItem] = []
    budget = memory.get("budget")
    per_category = float(budget) / max(len(categories), 1) if budget else None
    for category in categories:
        candidates, favorites = package_candidates(
            db, category, memory, customer_id, favorites_only=favorites_only
        )
        candidates = filter_for_memory(category, candidates, memory)
        candidates = remove_previous(candidates, memory, mode)
        ranked = sorted(candidates, key=lambda item: package_score(item, per_category, favorites, mode, memory))
        items.extend(item_from_package(item, memory) for item in ranked[:5])
    return items


def remove_previous(candidates: list, memory: dict, mode: str) -> list:
    previous = set(memory.get("previous_package_ids") or [])
    fresh = [item for item in candidates if item.id not in previous]
    return fresh if (mode == "cheaper" or memory.get("force_new_package")) and fresh else candidates


def summary_from_ids(
    candidates: list[AIRecommendationItem],
    package_ids: list[int],
    memory: dict,
) -> AIRecommendationSummary:
    by_id = {item.package_id: item for item in candidates}
    selected: list[AIRecommendationItem] = []
    seen_categories: set[str] = set()
    memory["_availability_alternatives"] = {}
    for package_id in package_ids:
        item = by_id.get(package_id)
        if not item or item.category in seen_categories:
            continue
        remember_item_alternative(memory, item)
        selected.append(item)
        seen_categories.add(item.category)
    total = sum(item.price for item in selected)
    remaining = None
    if memory.get("budget") is not None:
        remaining = round(float(memory["budget"]) - total, 2)
    return AIRecommendationSummary(
        total_estimated_cost=round(total, 2),
        remaining_budget=remaining,
        recommendation_summary=availability_message(memory),
        items=selected,
    )
