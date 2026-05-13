import re

from services.ai_nlu_constants import BLOCKED_TOPICS, CATEGORY_ALIASES, DEFAULT_CATEGORIES, FOLLOW_UP_WORDS, WEDDING_WORDS
from services.ai_nlu_dates import extract_date
from services.ai_nlu_extractors import extract_budget, extract_guest_count, extract_guest_delta, extract_location, extract_standalone_number
from services.ai_package_edits import replacement_after_remove
from services.ai_package_intents import wants_full_package, wants_new_package

def is_wedding_message(message: str, has_context: bool = False, expected_detail: str | None = None) -> bool:
    text = message.lower()
    if any(topic in text for topic in BLOCKED_TOPICS):
        return False
    if expected_detail and is_expected_answer(message, expected_detail):
        return True
    if has_context and is_contextual_follow_up(message):
        return True
    alias_words = [word for words in CATEGORY_ALIASES.values() for word in words]
    if any(word in text for word in WEDDING_WORDS) or any(word in text for word in alias_words):
        return True
    if has_context and any(word in text for word in FOLLOW_UP_WORDS):
        return True
    planning = ["wedding", "plan", "venue", "provider", "package"]
    return any(word in text for word in ["date", "location"]) and any(word in text for word in planning)

def is_expected_answer(message: str, expected_detail: str) -> bool:
    text = message.strip()
    number = extract_standalone_number(text)
    if expected_detail in {"guest_base", "guest_delta"}:
        return number is not None or extract_guest_count(text) is not None or extract_guest_delta(text) is not None
    if expected_detail == "budget":
        return extract_budget(text) is not None or bool(number and number >= 100)
    if expected_detail == "date":
        return extract_date(text) is not None
    if expected_detail == "location":
        return bool(extract_location(f"in {text}") or text.istitle())
    return False

def is_contextual_follow_up(message: str) -> bool:
    text = message.strip()
    if not text:
        return False
    if any([extract_budget(text), extract_date(text), extract_location(text)]):
        return True
    if extract_guest_count(text) is not None or extract_guest_delta(text) is not None:
        return True
    return extract_standalone_number(text) is not None or len(text.split()) <= 4

def requested_categories(message: str, fallback: list[str] | None = None) -> list[str]:
    if wants_full_package(message) or wants_new_package(message):
        return DEFAULT_CATEGORIES
    text = message.lower()
    matches = [cat for cat, aliases in CATEGORY_ALIASES.items() if any(alias in text for alias in aliases)]
    return matches or (fallback if fallback is not None else DEFAULT_CATEGORIES)

def replacement_categories(message: str) -> list[str]:
    text = message.lower()
    verbs = ["change", "replace", "different", "don't like", "dont like", "cheaper"] + (["remove"] if replacement_after_remove(text) else [])
    matches = []
    for category, aliases in CATEGORY_ALIASES.items():
        if any(near_replacement_word(text, alias, verbs) for alias in aliases):
            matches.append(category)
    return matches

def near_replacement_word(text: str, alias: str, verbs: list[str]) -> bool:
    alias_text = re.escape(alias)
    for verb in verbs:
        verb_text = re.escape(verb)
        before = rf"{verb_text}\W+(?:the\s+|this\s+|my\s+)?(?:\w+\W+){{0,3}}{alias_text}"
        if re.search(before, text):
            return True
    return False

def wants_cheaper(message: str) -> bool:
    text = message.lower()
    return any(word in text for word in ["cheaper", "less expensive", "too expensive", "not too expensive", "affordable"])

def wants_value(message: str) -> bool:
    text = message.lower()
    return "best value" in text or "better value" in text or "gives better" in text

def wants_premium(message: str) -> bool:
    return any(word in message.lower() for word in ["premium", "luxury", "high end"])

def wants_favorites(message: str) -> bool:
    return "favorite" in message.lower() or "favourite" in message.lower()

def missing_plan_fields(memory: dict) -> list[str]:
    fields = [("budget", "budget"), ("guest_count", "guest count"), ("wedding_date", "wedding date"), ("location", "preferred location")]
    return [label for key, label in fields if not memory.get(key)]
