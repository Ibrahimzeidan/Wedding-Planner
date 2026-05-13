from datetime import date

from services.ai_guardrails import extract_budget, extract_guest_count, extract_guest_delta
from services.ai_guardrails import extract_location, extract_style, is_wedding_message
from services.ai_memory_service import apply_text_memory
from services.ai_nlu_dates import extract_date


def test_ai_combines_current_guest_count_and_added_guests_in_same_message():
    memory = apply_text_memory({}, "current guests is 200 i want to add 50 new guests")

    assert memory["guest_count"] == 250
    assert "needs_guest_base" not in memory


def test_ai_stores_pending_guest_delta_until_base_count_is_answered():
    memory = apply_text_memory({}, "add 50 guests")
    memory = apply_text_memory(memory, "200", "guest_base")

    assert memory["guest_count"] == 250
    assert "needs_guest_base" not in memory


def test_ai_uses_bare_number_as_guest_delta_after_it_asks_for_delta():
    memory = apply_text_memory({"guest_count": 200}, "Add more guests")
    memory = apply_text_memory(memory, "20", "guest_delta")

    assert memory["guest_count"] == 220
    assert "needs_guest_delta" not in memory


def test_ai_accepts_expected_numeric_and_location_followups():
    assert is_wedding_message("200", has_context=True, expected_detail="guest_base") is True
    assert is_wedding_message("20", has_context=True, expected_detail="guest_delta") is True
    assert is_wedding_message("Beirut", has_context=True, expected_detail="location") is True
    assert is_wedding_message("200", has_context=False) is False


def test_ai_extracts_guest_base_and_delta_without_confusing_them():
    assert extract_guest_count("we have 180 guests") == 180
    assert extract_guest_count("add 50 new guests") is None
    assert extract_guest_delta("add 50 new guests") == 50
    assert extract_guest_delta("50 more guests") == 50


def test_ai_understands_natural_dates_budget_location_and_style():
    today = date(2026, 5, 13)

    assert extract_date("20.5.2026", today) == "2026-05-20"
    assert extract_date("20/5/2026", today) == "2026-05-20"
    assert extract_date("May 20", today) == "2026-05-20"
    assert extract_date("next Friday", today) == "2026-05-15"
    assert extract_date("next summer", today) == "2026-07-01"
    assert extract_date("end of June", today) == "2026-06-30"
    assert extract_budget("my budget is about 8k") == 8000
    assert extract_budget("about 8000 dollars") == 8000
    assert extract_location("I want something elegant in Beirut") == "Beirut"
    assert extract_style("I want something elegant in Beirut") == "elegant"
