from tests.helpers import category, headers, provider, user


def test_customer_can_add_and_remove_provider_favorite(client, db):
    # Arrange
    customer = user(db, "customer", "fav@test.com")
    studio = provider(db, category(db, "Photography"), "Zahar Photography")
    auth = headers(customer)
    # Act
    added = client.post(f"/favorites/{studio.id}", headers=auth)
    removed = client.delete(f"/favorites/{studio.id}", headers=auth)
    # Assert
    assert added.status_code == 200
    assert removed.status_code == 200


def test_duplicate_favorite_is_prevented(client, db):
    # Arrange
    customer = user(db, "customer", "dup-fav@test.com")
    studio = provider(db)
    auth = headers(customer)
    # Act
    first = client.post(f"/favorites/{studio.id}", headers=auth).json()
    second = client.post(f"/favorites/{studio.id}", headers=auth).json()
    # Assert
    assert first["id"] == second["id"]


def test_provider_cannot_add_favorites(client, db):
    # Arrange
    studio = provider(db, name="Provider Favorite")
    # Act
    response = client.post(f"/favorites/{studio.id}", headers=headers(studio.user))
    # Assert
    assert response.status_code == 403


def test_customer_can_view_only_their_own_favorites(client, db):
    # Arrange
    first = user(db, "customer", "first-fav@test.com")
    second = user(db, "customer", "second-fav@test.com")
    studio = provider(db)
    client.post(f"/favorites/{studio.id}", headers=headers(first))
    # Act
    first_list = client.get("/favorites", headers=headers(first)).json()
    second_list = client.get("/favorites", headers=headers(second)).json()
    # Assert
    assert len(first_list) == 1
    assert second_list == []


def test_favorite_provider_appears_in_customer_favorites(client, db):
    # Arrange
    customer = user(db, "customer", "page-fav@test.com")
    studio = provider(db, name="Zahar Photography")
    client.post(f"/favorites/{studio.id}", headers=headers(customer))
    # Act
    response = client.get("/favorites", headers=headers(customer))
    # Assert
    assert response.json()[0]["provider_name"] == "Zahar Photography"
