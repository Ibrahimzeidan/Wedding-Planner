from services.ai_memory_service import apply_text_memory, build_memory
from services.ai_recommendation_service import build_recommendations
from services.ai_recommendation_store import save_recommendations
from tests.ai_test_helpers import conversation_for, customer_plan, make_package
from tests.helpers import user


def test_ai_keeps_locked_provider_and_replaces_only_requested_category(db):
    customer, plan = customer_plan(db, "ai-lock@test.com")
    first_hall = make_package(db, "Wedding Hall", "Budget Hall", 1500, 200, "Beirut")
    make_package(db, "Wedding Hall", "Royal Palace Hall", 2200, 200, "Beirut")
    photo = make_package(db, "Photography", "Zahar Photography", 900, 200, "Beirut")
    initial = build_recommendations(db, customer.customer_profile.id, plan.id, {}, "wedding package")
    save_recommendations(db, customer.customer_profile.id, plan.id, initial)

    memory = build_memory(db, plan, conversation_for(db, customer, plan), "Keep Zahar Photography but change the venue")
    summary = build_recommendations(db, customer.customer_profile.id, plan.id, memory, "change venue")

    assert any(item.provider == "Zahar Photography" for item in summary.items)
    assert any(item.category == "Wedding Hall" and item.package_id != first_hall.id for item in summary.items)
    assert any(item.package_id == photo.id for item in summary.items)


def test_ai_replaces_cheaper_catering_and_keeps_rest_of_package(db):
    customer, plan = customer_plan(db, "ai-cheap-catering@test.com", ["Catering", "Photography"])
    premium = make_package(db, "Catering", "Premium Catering", 2000, 200, "Beirut")
    make_package(db, "Catering", "Budget Catering", 800, 200, "Beirut")
    photo = make_package(db, "Photography", "Steady Photo", 900, 200, "Beirut")
    initial = build_recommendations(
        db, customer.customer_profile.id, plan.id, {}, "premium catering and photography", mode="premium"
    )
    save_recommendations(db, customer.customer_profile.id, plan.id, initial)

    memory = build_memory(db, plan, conversation_for(db, customer, plan), "I want cheaper catering")
    summary = build_recommendations(db, customer.customer_profile.id, plan.id, memory, "cheaper catering", "cheaper")

    assert any(item.provider == "Budget Catering" for item in summary.items)
    assert not any(item.package_id == premium.id for item in summary.items)
    assert any(item.package_id == photo.id for item in summary.items)


def test_ai_prefers_style_matching_database_packages(db):
    customer = user(db, "customer", "ai-style@test.com")
    indoor = make_package(db, "Wedding Hall", "Indoor Classic Hall", 1000, 200, "Beirut")
    outdoor = make_package(db, "Wedding Hall", "Luxury Garden Hall", 1800, 200, "Beirut")
    indoor.provider.venue_type = "classic indoor"
    outdoor.provider.venue_type = "luxury outdoor garden"
    db.commit()

    memory = apply_text_memory({"budget": 5000, "location": "Beirut"}, "I want a luxury outdoor wedding")
    summary = build_recommendations(db, customer.customer_profile.id, None, memory, "luxury outdoor venue", "premium")

    assert summary.items[0].provider == "Luxury Garden Hall"
