from tests.ai_test_helpers import make_package
from tests.helpers import headers, user


def test_ai_chat_endpoint_understands_guest_delta_followup(client, db):
    customer = user(db, "customer", "ai-chat-delta@test.com")
    make_package(db, "Photography", "Flexible Photo", 1000, 300, "Beirut")
    auth = headers(customer)

    first = client.post(
        "/ai/chat",
        json={"message": "recommend photography in Beirut under 5000 for 200 guests"},
        headers=auth,
    )
    second = client.post("/ai/chat", json={"message": "add 50 new guests"}, headers=auth)

    assert first.status_code == 200
    assert second.status_code == 200
    assert "wedding planning services and recommendations" not in second.json()["message"]
    assert second.json()["items"][0]["reason"].startswith("Fits 250 guests")


def test_ai_chat_endpoint_understands_current_and_added_guests_in_one_message(client, db):
    customer = user(db, "customer", "ai-chat-combined@test.com")
    make_package(db, "Photography", "Combined Photo", 1000, 300, "Beirut")

    response = client.post(
        "/ai/chat",
        json={"message": "current guests is 200 i want to add 50 new guests for photography in Beirut under 5000"},
        headers=headers(customer),
    )

    assert response.status_code == 200
    assert response.json()["message"] != "What is your current guest count before adding guests?"
    assert response.json()["items"][0]["reason"].startswith("Fits 250 guests")


def test_ai_chat_endpoint_accepts_bare_number_after_guest_questions(client, db):
    customer = user(db, "customer", "ai-chat-number@test.com")
    make_package(db, "Photography", "Context Photo", 1000, 300, "Beirut")
    auth = headers(customer)

    ask_base = client.post("/ai/chat", json={"message": "add 50 guests"}, headers=auth)
    answer_base = client.post("/ai/chat", json={"message": "200"}, headers=auth)

    assert ask_base.json()["message"] == "What is your current guest count before adding guests?"
    assert "wedding planning services and recommendations" not in answer_base.json()["message"]
    assert answer_base.json()["items"][0]["reason"].startswith("Fits 250 guests")


def test_ai_chat_says_named_provider_is_missing_and_uses_database_options(client, db):
    customer = user(db, "customer", "ai-chat-missing-provider@test.com")
    make_package(db, "Photography", "Real Photo", 1000, 200, "Beirut")

    response = client.post(
        "/ai/chat",
        json={"message": "I want Dream Palace Hall for photography in Beirut under 5000"},
        headers=headers(customer),
    )

    assert "could not find Dream Palace Hall in the database" in response.json()["message"]
    assert response.json()["items"][0]["provider"] == "Real Photo"
