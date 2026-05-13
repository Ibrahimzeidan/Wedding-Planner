from tests.helpers import category, user


def register_payload(role="customer", category_id=None, email="new@test.com"):
    data = {
        "full_name": "New User",
        "email": email,
        "password": "secret123",
        "role": role,
    }
    if category_id:
        data.update({"category_id": category_id, "business_name": "New Studio"})
    return data


def test_register_customer_successfully(client):
    # Arrange / Act
    response = client.post("/auth/register", json=register_payload())
    # Assert
    assert response.status_code == 201
    assert response.json()["user"]["role"] == "customer"


def test_register_service_provider_successfully(client, db):
    # Arrange
    photo = category(db, "Photographer")
    # Act
    response = client.post("/auth/register", json=register_payload("service_provider", photo.id))
    # Assert
    assert response.status_code == 201
    assert response.json()["user"]["role"] == "service_provider"


def test_reject_duplicate_email(client, db):
    # Arrange
    user(db, email="same@test.com")
    # Act
    response = client.post("/auth/register", json=register_payload(email="same@test.com"))
    # Assert
    assert response.status_code == 409


def test_reject_invalid_role(client):
    # Arrange
    payload = register_payload(role="planner")
    # Act
    response = client.post("/auth/register", json=payload)
    # Assert
    assert response.status_code == 422


def test_login_returns_jwt_with_correct_credentials(client, db):
    # Arrange
    user(db, email="login@test.com")
    # Act
    response = client.post("/auth/login", json={"email": "login@test.com", "password": "secret123"})
    # Assert
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_reject_login_with_wrong_password(client, db):
    # Arrange
    user(db, email="wrong@test.com")
    # Act
    response = client.post("/auth/login", json={"email": "wrong@test.com", "password": "badpass"})
    # Assert
    assert response.status_code == 401
