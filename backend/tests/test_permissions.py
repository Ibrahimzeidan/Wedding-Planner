from tests.helpers import headers, user


def test_customer_can_access_customer_api(client, db):
    # Arrange
    customer = user(db, "customer", "customer@test.com")
    # Act
    response = client.get("/wedding-plans/me", headers=headers(customer))
    # Assert
    assert response.status_code == 200


def test_provider_can_access_provider_api(client, db):
    # Arrange
    provider = user(db, "service_provider", "provider@test.com")
    # Act
    response = client.get("/provider/packages", headers=headers(provider))
    # Assert
    assert response.status_code == 200


def test_admin_can_access_admin_api(client, db):
    # Arrange
    admin = user(db, "admin", "admin@test.com")
    # Act
    response = client.get("/admin/users", headers=headers(admin))
    # Assert
    assert response.status_code == 200


def test_customer_cannot_access_provider_or_admin_routes(client, db):
    # Arrange
    customer = user(db, "customer", "blocked@test.com")
    # Act
    provider_response = client.get("/provider/packages", headers=headers(customer))
    admin_response = client.get("/admin/users", headers=headers(customer))
    # Assert
    assert provider_response.status_code == 403
    assert admin_response.status_code == 403


def test_provider_cannot_access_customer_or_admin_routes(client, db):
    # Arrange
    provider = user(db, "service_provider", "blocked-provider@test.com")
    # Act
    customer_response = client.get("/wedding-plans/me", headers=headers(provider))
    admin_response = client.get("/admin/users", headers=headers(provider))
    # Assert
    assert customer_response.status_code == 403
    assert admin_response.status_code == 403


def test_unauthenticated_user_is_rejected(client):
    # Arrange / Act
    response = client.get("/wedding-plans/me")
    # Assert
    assert response.status_code == 401


def test_unauthenticated_admin_api_is_rejected(client):
    # Arrange / Act
    response = client.get("/admin/users")
    # Assert
    assert response.status_code == 401
