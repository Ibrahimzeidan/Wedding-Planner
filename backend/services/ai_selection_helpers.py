from services.ai_category_names import canonical_category
from services.ai_guardrails import DEFAULT_CATEGORIES


def selected_categories(selected: list[dict]) -> list[str]:
    return list(dict.fromkeys(item["category"] for item in selected))


def without_categories(selected: list[str], removed: list[str]) -> list[str]:
    removed_set = set(removed)
    return [category for category in selected if category not in removed_set]


def services_after_add(base: list[str], added: list[str], providers: list) -> list[str]:
    if base:
        return list(dict.fromkeys(base + added))
    return DEFAULT_CATEGORIES if providers else added


def provider_lock(provider) -> dict:
    category = canonical_category(provider.category.name if provider.category else None)
    return {"category": category, "provider_id": provider.id}


def provider_replace_categories(selected: list[dict], providers: list) -> list[str]:
    current = {item["category"]: item["provider_id"] for item in selected}
    replacements = []
    for provider in providers:
        category = provider_lock(provider)["category"]
        if current.get(category) and current[category] != provider.id:
            replacements.append(category)
    return list(dict.fromkeys(replacements))


def dedupe_locks(locks: list[dict]) -> list[dict]:
    found = {}
    for item in locks:
        found[item["category"]] = item
    return list(found.values())


def negative_context(text: str, name: str) -> bool:
    before = text.split(name.lower())[0][-30:]
    return "don't like" in before or "dont like" in before or "remove" in before
