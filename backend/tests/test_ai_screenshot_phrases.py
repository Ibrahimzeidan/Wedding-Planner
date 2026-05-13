from services.ai_recommendation_service import build_recommendations
from services.ai_recommendation_store import save_recommendations
from tests.ai_test_helpers import customer_plan, make_package
from tests.helpers import headers, user


def test_ai_understands_add_photographers_with_seed_category_name(client, db):
    customer = user(db, "customer", "ai-add-photo@test.com")
    make_package(db, "Photographer", "Seed Photo", 1000, 200, "Beirut")

    response = client.post(
        "/ai/chat",
        json={"message": "i want to add a photographers"},
        headers=headers(customer),
    )

    assert response.status_code == 200
    assert response.json()["items"][0]["provider"] == "Seed Photo"


def test_ai_understands_typo_add_to_package_photographers(client, db):
    customer = user(db, "customer", "ai-typo-photo@test.com")
    make_package(db, "Photographer", "Typo Photo", 1000, 200, "Beirut")

    response = client.post(
        "/ai/chat",
        json={"message": "i awnt to add to the package a photographers"},
        headers=headers(customer),
    )

    assert response.json()["items"][0]["provider"] == "Typo Photo"


def test_ai_show_photographers_only_returns_photo_packages(client, db):
    customer = user(db, "customer", "ai-show-photo@test.com")
    make_package(db, "Photographer", "Only Photo", 1000, 200, "Beirut")
    make_package(db, "Catering", "Not Photo Catering", 800, 200, "Beirut")

    response = client.post(
        "/ai/chat",
        json={"message": "Show photographers only"},
        headers=headers(customer),
    )

    assert {item["provider"] for item in response.json()["items"]} == {"Only Photo"}


def test_ai_asks_which_provider_to_replace_for_generic_remove(client, db):
    customer, plan = customer_plan(db, "ai-generic-remove@test.com")
    make_package(db, "Wedding Hall", "Starter Hall", 1500, 200, "Beirut")
    make_package(db, "Photographer", "Starter Photo", 900, 200, "Beirut")
    summary = build_recommendations(db, customer.customer_profile.id, plan.id, {}, "wedding package")
    save_recommendations(db, customer.customer_profile.id, plan.id, summary)

    response = client.post(
        "/ai/chat",
        json={"message": "can i remove a service provider and find me another one", "wedding_plan_id": plan.id},
        headers=headers(customer),
    )

    assert response.json()["message"] == "Which service provider or category should I replace?"
