from sqlalchemy.orm import Session
from models import ServicePackage
from schemas.ai import AIRecommendationItem, AIRecommendationSummary
from services.ai_availability_messages import availability_message, remember_alternative
from services.ai_category_names import canonical_category
from services.ai_recommendation_memory import filter_for_memory, recommendation_categories, selected_package, should_replace
from services.ai_package_search import package_candidates, package_score
def build_recommendations(
    db: Session,
    customer_id: int,
    wedding_plan_id: int | None,
    memory: dict,
    message: str = "",
    mode: str = "normal",
    favorites_only: bool = False,
) -> AIRecommendationSummary:
    categories = recommendation_categories(message, memory)[:6]
    budget = memory.get("budget")
    remaining = float(budget) if budget else None
    items: list[AIRecommendationItem] = []
    for index, category in enumerate(categories):
        selected = selected_package(category, memory)
        if selected and not should_replace(category, memory):
            if item := selected_item(db, selected, memory):
                items.append(item)
                if remaining is not None:
                    remaining -= item.price
                continue
        slots_left = max(len(categories) - index, 1)
        target = (remaining / slots_left) if remaining else None
        candidates, favorite_ids = package_candidates(
            db, category, memory, customer_id, favorites_only=favorites_only
        )
        candidates = filter_for_memory(category, candidates, memory)
        if not candidates:
            continue
        previous = set(memory.get("previous_package_ids") or [])
        alternatives = [item for item in candidates if item.id not in previous]
        if (mode == "cheaper" or memory.get("force_new_package")) and alternatives:
            candidates = alternatives
        choice = sorted(candidates, key=lambda item: package_score(item, target, favorite_ids, mode, memory))[0]
        remember_alternative(memory, category, choice)
        item = item_from_package(choice, memory)
        items.append(item)
        if remaining is not None:
            remaining -= item.price
    total = sum(item.price for item in items)
    return AIRecommendationSummary(
        total_estimated_cost=round(total, 2),
        remaining_budget=round(remaining, 2) if remaining is not None else None,
        recommendation_summary=availability_message(memory),
        items=items,
    )

def selected_item(db: Session, selected: dict, memory: dict) -> AIRecommendationItem | None:
    package = db.get(ServicePackage, selected.get("package_id"))
    return item_from_package(package, memory) if package and package.provider else None

def item_from_package(package: ServicePackage, memory: dict) -> AIRecommendationItem:
    provider = package.provider
    category = canonical_category(provider.category.name if provider.category else None)
    return AIRecommendationItem(
        package_id=package.id,
        provider_id=provider.id,
        category=category,
        provider=provider.business_name or f"Provider #{provider.id}",
        package=package.title,
        price=float(package.price or 0),
        reason=reason_for(package, memory),
        rating=float(provider.rating) if provider.rating else None,
        location=provider.location,
        capacity=package.capacity or provider.max_guests,
    )

def reason_for(package: ServicePackage, memory: dict) -> str:
    provider = package.provider
    parts = []
    if memory.get("guest_count") and (package.capacity or provider.max_guests):
        parts.append(f"Fits {memory['guest_count']} guests")
    if memory.get("location") and provider.location:
        if memory["location"].lower() in provider.location.lower():
            parts.append(f"matches {memory['location']} location")
    if provider.rating:
        parts.append(f"rated {float(provider.rating):.1f}")
    return ", ".join(parts) + "." if parts else "Best available database match."
