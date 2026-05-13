from tests.helpers import category, headers, user


def test_admin_can_create_update_delete_category(client, db):
    # Arrange
    admin = user(db, "admin", "admin-cat@test.com")
    auth = headers(admin)
    # Act
    created = client.post("/admin/categories", json={"name": "Florist"}, headers=auth)
    created_id = created.json()["data"]["id"]
    updated = client.put(
        f"/admin/categories/{created_id}",
        json={"name": "Flowers", "description": "Decor"},
        headers=auth,
    )
    deleted = client.delete(f"/admin/categories/{created_id}", headers=auth)
    # Assert
    assert created.status_code == 201
    assert updated.json()["data"]["name"] == "Flowers"
    assert deleted.status_code == 200


def test_reject_duplicate_category_name(client, db):
    # Arrange
    admin = user(db, "admin", "dup-admin@test.com")
    category(db, "Music")
    # Act
    response = client.post("/admin/categories", json={"name": "music"}, headers=headers(admin))
    # Assert
    assert response.status_code == 409


def test_non_admin_cannot_manage_categories(client, db):
    # Arrange
    customer = user(db, "customer", "cat-customer@test.com")
    # Act
    response = client.post("/admin/categories", json={"name": "Catering"}, headers=headers(customer))
    # Assert
    assert response.status_code == 403


def test_returns_empty_list_if_no_categories_exist(client):
    # Arrange / Act
    response = client.get("/service-categories")
    # Assert
    assert response.status_code == 200
    assert response.json() == []
