from services.ai_guardrails import DEFAULT_CATEGORIES, replacement_categories, requested_categories


def recommendation_categories(message: str, memory: dict) -> list[str]:
    removed = set(memory.get("remove_categories") or [])
    selected = [item["category"] for item in memory.get("selected_packages") or [] if item["category"] not in removed]
    added = memory.get("add_categories") or []
    replacing = memory.get("replace_categories") or replacement_categories(message)
    if added and selected:
        return list(dict.fromkeys(selected + added))
    if removed and selected:
        return selected
    if replacing and selected:
        return list(dict.fromkeys(selected + replacing))
    if memory.get("locked_providers") and not selected:
        return DEFAULT_CATEGORIES
    return requested_categories(message, memory.get("preferred_services") or None)[:6]


def selected_package(category: str, memory: dict) -> dict | None:
    for item in memory.get("selected_packages") or []:
        if item.get("category") == category:
            return item
    return None


def should_replace(category: str, memory: dict) -> bool:
    return category in set(memory.get("replace_categories") or [])


def locked_provider_ids(category: str, memory: dict) -> set[int]:
    return {
        item["provider_id"]
        for item in memory.get("locked_providers") or []
        if item.get("category") == category
    }


def filter_for_memory(category: str, candidates: list, memory: dict) -> list:
    selected = selected_package(category, memory)
    locked = locked_provider_ids(category, memory)
    if locked:
        candidates = [item for item in candidates if item.provider_id in locked]
    if selected and should_replace(category, memory):
        candidates = [item for item in candidates if item.provider_id != selected["provider_id"]]
    return candidates
