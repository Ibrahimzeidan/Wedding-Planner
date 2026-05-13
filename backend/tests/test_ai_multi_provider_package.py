from tests.ai_test_helpers import customer_plan, make_package
from tests.helpers import headers


def names(response):
    return {item["provider"] for item in response.json()["items"]}


def chat(client, customer, plan, message):
    return client.post(
        "/ai/chat",
        json={"message": message, "wedding_plan_id": plan.id},
        headers=headers(customer),
    )


def test_ai_combines_several_named_providers_in_one_package(client, db):
    customer, plan = customer_plan(db, "ai-several-providers@test.com")
    make_package(db, "Photographer", "Zahar Photography Studio", 900, 220)
    make_package(db, "Photography", "Other Photo", 700, 220)
    make_package(db, "Wedding Hall", "Royal Hall", 1700, 220)
    make_package(db, "Wedding Hall", "Budget Hall", 1200, 220)
    make_package(db, "Catering", "Cedars Catering", 1100, 220)

    response = chat(client, customer, plan, "I want Royal Hall and Zahar Photography Studio")

    assert {"Royal Hall", "Zahar Photography Studio", "Cedars Catering"} <= names(response)
    assert "Budget Hall" not in names(response)
    assert "Other Photo" not in names(response)


def test_ai_adds_named_provider_across_turns_and_replaces_same_category(client, db):
    customer, plan = customer_plan(db, "ai-add-provider-turns@test.com", ["Wedding Hall", "Photography"])
    make_package(db, "Wedding Hall", "Budget Hall", 1200, 220)
    make_package(db, "Wedding Hall", "Royal Hall", 1700, 220)
    make_package(db, "Photography", "Zahar Photography", 900, 220)

    first = chat(client, customer, plan, "recommend a package")
    second = chat(client, customer, plan, "add Royal Hall to my package")

    assert "Budget Hall" in names(first)
    assert {"Royal Hall", "Zahar Photography"} <= names(second)
    assert "Budget Hall" not in names(second)


def test_ai_removes_named_service_provider_from_current_package(client, db):
    customer, plan = customer_plan(db, "ai-remove-named-provider@test.com", ["Wedding Hall", "Photography"])
    make_package(db, "Photographer", "Zahar Photography Studio", 900, 220)
    make_package(db, "Wedding Hall", "Royal Hall", 1700, 220)

    first = chat(client, customer, plan, "give me a full package for my wedding")
    second = chat(client, customer, plan, "remove Zahar Photography Studio from my package")

    assert "Zahar Photography Studio" in names(first)
    assert "Zahar Photography Studio" not in names(second)
    assert names(second) == {"Royal Hall"}
