from services.ai_guardrails import extract_budget
from tests.ai_test_helpers import customer_plan, make_package
from tests.helpers import headers


def item_names(response):
    return {item["provider"] for item in response.json()["items"]}


def post_chat(client, customer, message, plan):
    return client.post(
        "/ai/chat",
        json={"message": message, "wedding_plan_id": plan.id},
        headers=headers(customer),
    )


def test_full_package_expands_after_photographer_only(client, db):
    customer, plan = customer_plan(db, "ai-full-after-photo@test.com")
    make_package(db, "Photographer", "Zahar Photography", 900, 200)
    make_package(db, "Wedding Hall", "Royal Hall", 1600, 220)
    make_package(db, "Catering", "Cedars Catering", 1200, 220)

    first = post_chat(client, customer, "Show photographers only", plan)
    second = post_chat(client, customer, "give me a full package for my wedding", plan)

    assert item_names(first) == {"Zahar Photography"}
    assert {"Zahar Photography", "Royal Hall", "Cedars Catering"} <= item_names(second)


def test_named_provider_is_locked_and_full_package_is_built(client, db):
    customer, plan = customer_plan(db, "ai-locked-provider@test.com")
    make_package(db, "Photographer", "Zahar Photography Studio", 900, 200)
    make_package(db, "Wedding Hall", "Grand Palace", 1600, 220)
    make_package(db, "Catering", "Cedars Catering", 1200, 220)

    response = post_chat(client, customer, "I want Zahar Photography Studio", plan)

    assert {"Zahar Photography Studio", "Grand Palace", "Cedars Catering"} <= item_names(response)


def test_new_package_regenerates_previous_service_providers(client, db):
    customer, plan = customer_plan(db, "ai-new-package@test.com")
    make_package(db, "Photography", "Prime Photo", 800, 220)
    make_package(db, "Photography", "Fresh Photo", 900, 220)
    make_package(db, "Wedding Hall", "Prime Hall", 1300, 220)
    make_package(db, "Wedding Hall", "Fresh Hall", 1400, 220)

    first = post_chat(client, customer, "give me a full package for my wedding", plan)
    second = post_chat(client, customer, "give me new package", plan)

    assert {"Prime Photo", "Prime Hall"} <= item_names(first)
    assert {"Fresh Photo", "Fresh Hall"} <= item_names(second)


def test_budget_accepts_number_before_currency_symbol():
    assert extract_budget("no i want with 6000$ and 200 guests") == 6000


def test_remove_category_deletes_it_from_current_package(client, db):
    customer, plan = customer_plan(db, "ai-remove-category@test.com", ["Wedding Hall", "Photography", "Catering"])
    make_package(db, "Photography", "Zahar Photography", 900, 220)
    make_package(db, "Wedding Hall", "Royal Hall", 1600, 220)
    make_package(db, "Catering", "Cedars Catering", 1200, 220)

    first = post_chat(client, customer, "give me a full package for my wedding", plan)
    second = post_chat(client, customer, "remove the photographer from my package", plan)

    assert "Zahar Photography" in item_names(first)
    assert "Zahar Photography" not in item_names(second)
    assert {"Royal Hall", "Cedars Catering"} <= item_names(second)
    assert "I removed photography from your package" in second.json()["message"]


def test_add_named_provider_adds_it_to_current_package(client, db):
    customer, plan = customer_plan(db, "ai-add-provider@test.com", ["Wedding Hall"])
    make_package(db, "Wedding Hall", "Royal Hall", 1600, 220)
    make_package(db, "Photographer", "Zahar Photography Studio", 900, 220)

    first = post_chat(client, customer, "recommend a package", plan)
    second = post_chat(client, customer, "add Zahar Photography Studio to my package", plan)

    assert item_names(first) == {"Royal Hall"}
    assert {"Royal Hall", "Zahar Photography Studio"} <= item_names(second)
    assert "I added photography to your package" in second.json()["message"]
