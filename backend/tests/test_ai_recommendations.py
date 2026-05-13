from services.ai_chat_service import should_ask_for_details
from services.ai_guardrails import is_wedding_message
from services.ai_memory_service import apply_text_memory
from services.ai_recommendation_service import build_recommendations
from tests.ai_test_helpers import make_package
from tests.helpers import booking, user


def test_ai_returns_real_database_recommendations(client, db):
    customer = user(db, "customer", "ai-real@test.com")
    make_package(db, "Photography", "Zahar Photography")

    summary = build_recommendations(db, customer.customer_profile.id, None, {}, "photography")

    assert summary.items[0].provider == "Zahar Photography"


def test_ai_builds_complete_package_from_multiple_categories(db):
    customer = user(db, "customer", "ai-complete@test.com")
    make_package(db, "Photography", "Zahar Photography")
    make_package(db, "Catering", "Cedars Catering")
    memory = {"preferred_services": ["Photography", "Catering"]}

    summary = build_recommendations(db, customer.customer_profile.id, None, memory)

    assert {item.category for item in summary.items} == {"Photography", "Catering"}


def test_ai_filters_by_budget_guest_count_and_location(db):
    customer = user(db, "customer", "ai-filter@test.com")
    make_package(db, "Photography", "Cheap Beirut", 1000, 200, "Beirut")
    make_package(db, "Music", "Small Music", 500, 50, "Beirut")
    memory = {"budget": 5000, "guest_count": 150, "location": "Beirut"}

    photo = build_recommendations(db, customer.customer_profile.id, None, memory, "photography")
    music = build_recommendations(db, customer.customer_profile.id, None, memory, "music")

    assert photo.items[0].provider == "Cheap Beirut"
    assert music.items == []


def test_ai_avoids_booked_provider_and_suggests_available_alternative(db):
    customer = user(db, "customer", "ai-booked@test.com")
    booked = make_package(db, "Photography", "Zahar Photography")
    make_package(db, "Photography", "Crystal Photo", 1200)
    booking(db, customer, booked.provider, "pending", "2026-08-20")

    summary = build_recommendations(
        db, customer.customer_profile.id, None, {"wedding_date": "2026-08-20"}, "photography"
    )

    assert summary.items[0].provider == "Crystal Photo"
    assert "Zahar Photography is unavailable" in summary.recommendation_summary


def test_ai_asks_follow_up_and_recalculates_guests():
    assert should_ask_for_details("recommend a wedding package", {}) is True

    memory = apply_text_memory({"guest_count": 100}, "What if we add 20 guests?")

    assert memory["guest_count"] == 120


def test_ai_returns_cheaper_options_and_rejects_out_of_scope(db):
    customer = user(db, "customer", "ai-cheaper@test.com")
    old = make_package(db, "Photography", "Premium Photo", 2000)
    make_package(db, "Photography", "Budget Photo", 800)
    memory = {"previous_package_ids": [old.id]}

    summary = build_recommendations(
        db, customer.customer_profile.id, None, memory, "photography", mode="cheaper"
    )

    assert summary.items[0].provider == "Budget Photo"
    assert is_wedding_message("I want to buy a laptop") is False
