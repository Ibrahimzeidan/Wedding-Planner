from services.ai_option_service import build_recommendation_options
from services.ai_package_builder import build_package_candidates
from services.ai_recommendation_service import build_recommendations
from tests.helpers import category, package, provider, user


def make_item(db, cat, provider_name, price):
    studio = provider(db, cat, provider_name)
    return package(db, studio, f"{provider_name} Package", price)


def test_ai_returns_multiple_package_options_with_different_providers(db):
    # Arrange
    customer = user(db, "customer", "options@test.com")
    photo = category(db, "Photography")
    food = category(db, "Catering")
    make_item(db, photo, "Zahar Photography", 1000)
    make_item(db, photo, "Crystal Photo", 900)
    make_item(db, food, "Cedars Catering", 2500)
    make_item(db, food, "Beirut Bites", 2200)
    memory = {"preferred_services": ["Photography", "Catering"], "budget": 8000}
    # Act
    summary = build_recommendations(db, customer.customer_profile.id, None, memory)
    candidates = build_package_candidates(db, customer.customer_profile.id, memory, "", "normal", False)
    options = build_recommendation_options(candidates, summary, memory)
    # Assert
    assert len(options) == 2
    assert options[0].items[0].provider != options[1].items[0].provider


def test_ai_option_difference_mentions_price_and_providers(db):
    # Arrange
    customer = user(db, "customer", "diff-options@test.com")
    photo = category(db, "Photography")
    make_item(db, photo, "Zahar Photography", 1000)
    make_item(db, photo, "Crystal Photo", 800)
    memory = {"preferred_services": ["Photography"], "budget": 3000}
    summary = build_recommendations(db, customer.customer_profile.id, None, memory)
    candidates = build_package_candidates(db, customer.customer_profile.id, memory, "", "normal", False)
    # Act
    options = build_recommendation_options(candidates, summary, memory)
    # Assert
    assert len(options) >= 1
    assert "Package" in options[0].title
