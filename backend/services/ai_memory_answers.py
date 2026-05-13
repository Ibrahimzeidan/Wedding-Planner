from services.ai_guardrails import extract_budget, extract_date, extract_guest_count, extract_guest_delta
from services.ai_guardrails import extract_location, extract_standalone_number, extract_style
from services.ai_guardrails import requested_categories, wants_guest_delta_without_amount


def apply_text_memory(memory: dict, message: str, expected_detail: str | None = None) -> dict:
    memory = dict(memory)
    if expected_detail:
        memory = apply_expected_answer(memory, message, expected_detail)
    if budget := extract_budget(message):
        memory["budget"] = budget
    base = extract_guest_count(message)
    delta = extract_guest_delta(message)
    if base is not None:
        memory["guest_count"] = base
        memory.pop("needs_guest_base", None)
    if delta is not None:
        apply_guest_delta(memory, delta)
    elif wants_guest_delta_without_amount(message):
        memory["needs_guest_delta"] = True
    if wedding_date := extract_date(message):
        memory["wedding_date"] = wedding_date
    if location := extract_location(message):
        memory["location"] = location
    if style := extract_style(message):
        memory["preferred_style"] = style
    if categories := requested_categories(message, []):
        memory["preferred_services"] = categories
    return memory


def apply_expected_answer(memory: dict, message: str, expected_detail: str) -> dict:
    number = extract_standalone_number(message)
    if expected_detail == "guest_delta" and number is not None:
        apply_guest_delta(memory, number)
        memory.pop("needs_guest_delta", None)
    if expected_detail == "guest_base" and number is not None:
        memory["guest_count"] = number + int(memory.pop("_pending_guest_delta", 0) or 0)
        memory.pop("needs_guest_base", None)
    if expected_detail == "budget" and number is not None and number >= 100:
        memory["budget"] = float(number)
    if expected_detail == "location" and extract_location(f"in {message}"):
        memory["location"] = extract_location(f"in {message}")
    if expected_detail == "date" and extract_date(message):
        memory["wedding_date"] = extract_date(message)
    return memory


def apply_guest_delta(memory: dict, delta: int) -> None:
    if memory.get("guest_count"):
        memory["guest_count"] += delta
        return
    memory["needs_guest_base"] = True
    memory["_pending_guest_delta"] = delta


def expected_detail_from_assistant(message: str) -> str | None:
    text = message.lower()
    if "how many guests should i add" in text:
        return "guest_delta"
    if "current guest count before adding" in text:
        return "guest_base"
    if "preferred location" in text:
        return "location"
    if "wedding date" in text or "preferred wedding date" in text:
        return "date"
    if "budget" in text and "what" in text:
        return "budget"
    return None


def current_expected_detail(messages) -> str | None:
    for item in sorted(messages, key=lambda row: (row.created_at, row.id or 0), reverse=True):
        if item.sender == "user":
            return None
        if item.sender == "assistant":
            return expected_detail_from_assistant(item.message)
    return None
