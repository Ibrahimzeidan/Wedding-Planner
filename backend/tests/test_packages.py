from tests.helpers import category, headers, package, provider, user


def test_provider_can_create_update_delete_package(client, db):
    # Arrange
    studio = provider(db, category(db, "Photography"), "Zahar Photography")
    auth = headers(studio.user)
    # Act
    created = client.post("/provider/packages", json={"title": "Gold", "price": 900}, headers=auth)
    updated = client.put(
        f"/provider/packages/{created.json()['id']}",
        json={"title": "Premium", "price": 1200},
        headers=auth,
    )
    deleted = client.delete(f"/provider/packages/{created.json()['id']}", headers=auth)
    # Assert
    assert created.status_code == 200
    assert updated.json()["title"] == "Premium"
    assert deleted.status_code == 200


def test_provider_cannot_edit_another_provider_package(client, db):
    # Arrange
    photo = category(db, "Photography")
    first = provider(db, photo, "First Studio")
    second = provider(db, photo, "Second Studio")
    item = package(db, first)
    # Act
    response = client.put(f"/provider/packages/{item.id}", json={"title": "Hack"}, headers=headers(second.user))
    # Assert
    assert response.status_code == 403


def test_customer_cannot_create_package(client, db):
    # Arrange
    customer = user(db, "customer", "package-customer@test.com")
    # Act
    response = client.post("/provider/packages", json={"title": "Bad"}, headers=headers(customer))
    # Assert
    assert response.status_code == 403


def test_admin_can_view_edit_delete_any_package(client, db):
    # Arrange
    admin = user(db, "admin", "package-admin@test.com")
    item = package(db, provider(db))
    auth = headers(admin)
    # Act
    viewed = client.get("/admin/packages", headers=auth)
    edited = client.put(f"/admin/packages/{item.id}", json={"price": 700}, headers=auth)
    deleted = client.delete(f"/admin/packages/{item.id}", headers=auth)
    # Assert
    assert viewed.status_code == 200
    assert edited.json()["data"]["price"] == 700
    assert deleted.status_code == 200


def test_package_with_missing_required_fields_is_rejected(client, db):
    # Arrange
    studio = provider(db)
    # Act
    response = client.post("/provider/packages", json={"price": 1000}, headers=headers(studio.user))
    # Assert
    assert response.status_code == 422
