from tests.helpers import category, provider, user


def test_service_provider_is_linked_to_selected_category_on_register(client, db):
    # Arrange
    photo = category(db, "Photographer")
    payload = {
        "full_name": "Zahar Owner",
        "email": "zahar-owner@test.com",
        "password": "secret123",
        "role": "service_provider",
        "category_id": photo.id,
        "business_name": "Zahar Photography",
    }
    # Act
    response = client.post("/auth/register", json=payload)
    # Assert
    assert response.status_code == 201
    assert db.get(type(photo), photo.id).providers[0].business_name == "Zahar Photography"


def test_photographer_provider_appears_under_photographer_category(client, db):
    # Arrange
    photo = category(db, "Photographer")
    provider(db, photo, "Zahar Photography")
    # Act
    response = client.get("/services/providers?category=Photographer")
    # Assert
    assert response.status_code == 200
    assert response.json()[0]["business_name"] == "Zahar Photography"


def test_wedding_hall_provider_appears_under_wedding_hall_category(client, db):
    # Arrange
    hall = category(db, "Wedding Hall")
    provider(db, hall, "Royal Palace Hall")
    # Act
    response = client.get("/services/providers?category=Wedding Hall")
    # Assert
    assert response.status_code == 200
    assert response.json()[0]["business_name"] == "Royal Palace Hall"


def test_search_by_provider_name_returns_correct_provider(client, db):
    # Arrange
    provider(db, category(db, "Photographer"), "Zahar Photography")
    # Act
    response = client.get("/services/providers?search=Zahar")
    # Assert
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_search_by_category_returns_correct_providers(client, db):
    # Arrange
    photo = category(db, "Photographer")
    provider(db, photo, "Zahar Photography")
    provider(db, category(db, "Music"), "Beirut DJ")
    # Act
    response = client.get("/services/providers?category=Photographer")
    # Assert
    assert [item["business_name"] for item in response.json()] == ["Zahar Photography"]


def test_public_provider_filters_by_location_rating_and_limit(client, db):
    # Arrange
    photo = category(db, "Photographer")
    first = provider(db, photo, "Beirut Photo")
    second = provider(db, photo, "Byblos Photo")
    first.location = "Beirut"
    first.rating = 4.8
    second.location = "Byblos"
    second.rating = 3.2
    db.commit()
    # Act
    filtered = client.get("/services/providers?location=Beirut&rating=4")
    limited = client.get("/services/providers?limit=1")
    # Assert
    assert [item["business_name"] for item in filtered.json()] == ["Beirut Photo"]
    assert len(limited.json()) == 1
