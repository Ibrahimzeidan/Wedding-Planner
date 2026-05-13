from services.ai_nlu_constants import CATEGORY_ALIASES, DEFAULT_CATEGORIES


def canonical_category(name: str | None) -> str:
    text = (name or "").strip().lower()
    if not text:
        return "Service"
    for category in DEFAULT_CATEGORIES:
        terms = [category, *CATEGORY_ALIASES.get(category, [])]
        lowered = [term.lower() for term in terms]
        if text in lowered or any(term in text for term in lowered):
            return category
        if any(text in term for term in lowered):
            return category
    return name or "Service"
