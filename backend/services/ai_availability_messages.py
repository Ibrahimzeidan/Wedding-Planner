from models import ServicePackage
from schemas.ai import AIRecommendationItem

CATEGORY_PLURALS = {
    "Photography": "photographers",
    "Wedding Hall": "venues",
    "Catering": "caterers",
    "Decoration": "decorators",
    "Makeup": "makeup artists",
    "Music": "music providers",
}


def package_provider(package: ServicePackage) -> str:
    provider = package.provider
    return provider.business_name or f"Provider #{provider.id}"


def remember_booked_match(memory: dict, category: str, package: ServicePackage) -> None:
    matches = memory.setdefault("_booked_matches", {})
    matches.setdefault(category, package_provider(package))


def remember_alternative(memory: dict, category: str, package: ServicePackage) -> None:
    booked = (memory.get("_booked_matches") or {}).get(category)
    chosen = package_provider(package)
    if booked and chosen != booked:
        add_note(memory, category, booked, chosen)


def remember_item_alternative(memory: dict, item: AIRecommendationItem) -> None:
    booked = (memory.get("_booked_matches") or {}).get(item.category)
    if booked and item.provider != booked:
        add_note(memory, item.category, booked, item.provider)


def add_note(memory: dict, category: str, booked: str, chosen: str) -> None:
    notes = memory.setdefault("_availability_alternatives", {})
    notes[category] = (
        f"{booked} is unavailable on this date, so I selected "
        f"{chosen} instead with similar wedding-service fit."
    )


def availability_message(memory: dict) -> str | None:
    notes = list((memory.get("_availability_alternatives") or {}).values())
    missing = missing_categories(memory)
    if missing:
        names = ", ".join(plural_name(category) for category in missing)
        notes.append(
            f"No real available {names} are free in the database for this date. "
            "Try another date and I can suggest the closest matching provider."
        )
    return " ".join(dict.fromkeys(notes)) or None


def missing_categories(memory: dict) -> list[str]:
    alternatives = set((memory.get("_availability_alternatives") or {}).keys())
    categories = list(dict.fromkeys(memory.get("unavailable_categories") or []))
    return [category for category in categories if category not in alternatives]


def plural_name(category: str) -> str:
    return CATEGORY_PLURALS.get(category, f"{category.lower()} providers")
