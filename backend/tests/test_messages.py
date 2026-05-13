from tests.helpers import headers, provider, user


def test_customer_can_start_conversation_with_provider(client, db):
    # Arrange
    customer = user(db, "customer", "chat@test.com")
    studio = provider(db)
    # Act
    response = client.post(f"/messages/conversations/{studio.id}", headers=headers(customer))
    # Assert
    assert response.status_code == 201
    assert response.json()["provider_id"] == studio.id


def test_provider_can_reply_to_customer(client, db):
    # Arrange
    customer = user(db, "customer", "reply@test.com")
    studio = provider(db)
    conversation = client.post(f"/messages/conversations/{studio.id}", headers=headers(customer)).json()
    # Act
    response = client.post(
        f"/messages/{conversation['id']}",
        json={"message": "Happy to help."},
        headers=headers(studio.user),
    )
    # Assert
    assert response.status_code == 200
    assert response.json()["message"] == "Happy to help."
    notes = client.get("/notifications", headers=headers(customer)).json()
    assert notes[0]["type"] == "new_message"


def test_customer_message_notifies_provider(client, db):
    customer = user(db, "customer", "notify-chat@test.com")
    studio = provider(db)
    conversation = client.post(f"/messages/conversations/{studio.id}", headers=headers(customer)).json()

    response = client.post(
        f"/messages/{conversation['id']}",
        json={"message": "Can we discuss details?"},
        headers=headers(customer),
    )

    notes = client.get("/notifications", headers=headers(studio.user)).json()
    assert response.status_code == 200
    assert notes[0]["title"] == "New Message"


def test_users_can_only_view_their_own_conversations(client, db):
    # Arrange
    customer = user(db, "customer", "owner-chat@test.com")
    stranger = user(db, "customer", "stranger-chat@test.com")
    studio = provider(db)
    conversation = client.post(f"/messages/conversations/{studio.id}", headers=headers(customer)).json()
    # Act
    owner = client.get("/messages/conversations", headers=headers(customer))
    provider_view = client.get("/messages/conversations", headers=headers(studio.user))
    stranger_view = client.get(f"/messages/{conversation['id']}", headers=headers(stranger))
    # Assert
    assert len(owner.json()) == 1
    assert len(provider_view.json()) == 1
    assert stranger_view.status_code == 403


def test_empty_conversation_returns_empty_messages(client, db):
    # Arrange
    customer = user(db, "customer", "empty-chat@test.com")
    studio = provider(db)
    conversation = client.post(f"/messages/conversations/{studio.id}", headers=headers(customer)).json()
    # Act
    response = client.get(f"/messages/{conversation['id']}", headers=headers(customer))
    # Assert
    assert response.status_code == 200
    assert response.json() == []


def test_message_with_empty_text_is_rejected(client, db):
    # Arrange
    customer = user(db, "customer", "empty-message@test.com")
    studio = provider(db)
    conversation = client.post(f"/messages/conversations/{studio.id}", headers=headers(customer)).json()
    # Act
    response = client.post(f"/messages/{conversation['id']}", json={"message": ""}, headers=headers(customer))
    # Assert
    assert response.status_code == 422
