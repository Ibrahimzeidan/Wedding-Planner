from sqlalchemy.orm import Session

from models import ServiceProvider
from services.ai_guardrails import DEFAULT_CATEGORIES, replacement_categories, wants_full_package, wants_new_package
from services.ai_package_edits import add_categories, remove_categories
from services.ai_provider_mentions import mentioned_providers, missing_provider_name
from services.ai_selection_helpers import dedupe_locks, negative_context, provider_lock, provider_replace_categories
from services.ai_selection_helpers import selected_categories, services_after_add, without_categories
from services.ai_selected_packages import latest_selected_packages


def apply_selection_memory(db: Session, customer_id: int, plan, memory: dict, message: str) -> dict:
    memory = dict(memory)
    selected = latest_selected_packages(db, customer_id, plan)
    if selected:
        memory["selected_packages"] = selected
    if wants_full_package(message):
        memory["preferred_services"] = DEFAULT_CATEGORIES
    if wants_new_package(message):
        memory["preferred_services"] = DEFAULT_CATEGORIES
        memory["replace_categories"] = selected_categories(selected) or DEFAULT_CATEGORIES
        memory["locked_providers"] = []
        memory["force_new_package"] = True
    providers = mentioned_providers(db, message)
    if replacements := replacement_categories(message):
        memory["replace_categories"] = replacements
        memory["preferred_services"] = selected_categories(selected) or DEFAULT_CATEGORIES
    elif removed := remove_categories(message, providers):
        memory["remove_categories"] = removed
        memory["preferred_services"] = without_categories(selected_categories(selected), removed)
    elif added := add_categories(message, providers):
        memory["add_categories"] = added
        base = selected_categories(selected)
        memory["preferred_services"] = services_after_add(base, added, providers)
        if provider_replacements := provider_replace_categories(selected, providers):
            memory["replace_categories"] = provider_replacements
    elif needs_replacement_target(message, selected):
        memory["needs_replacement_target"] = True
    if missing := missing_provider_name(message, providers):
        memory["missing_provider_name"] = missing
    add_locked_providers(memory, message, providers)
    add_rejected_providers(memory, message, providers, selected)
    if providers and not memory.get("preferred_services"):
        memory["preferred_services"] = DEFAULT_CATEGORIES
    return memory


def add_locked_providers(memory: dict, message: str, providers: list[ServiceProvider]) -> None:
    text = message.lower()
    lock_words = ["keep", "want", "choose", "select", "fixed", "add", "include", "put"]
    locks = list(memory.get("locked_providers") or [])
    for provider in providers:
        if any(word in text for word in lock_words) and not negative_context(text, provider.business_name or ""):
            locks.append(provider_lock(provider))
    memory["locked_providers"] = dedupe_locks(locks)


def add_rejected_providers(memory: dict, message: str, providers: list[ServiceProvider], selected: list[dict]) -> None:
    text = message.lower()
    rejected = set(memory.get("rejected_provider_ids") or [])
    if any(phrase in text for phrase in ["don't like", "dont like", "remove", "change"]):
        rejected.update(provider.id for provider in providers)
        for category in replacement_categories(text):
            rejected.update(item["provider_id"] for item in selected if item["category"] == category)
    memory["rejected_provider_ids"] = sorted(rejected)


def needs_replacement_target(message: str, selected: list[dict]) -> bool:
    text = message.lower()
    verbs = ["remove", "replace", "change", "another one", "find me another"]
    generic = ["service provider", "provider", "one"]
    return bool(any(word in text for word in verbs) and any(word in text for word in generic))
