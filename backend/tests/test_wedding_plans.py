from tests.helpers import headers, user


def plan_payload():
    return {
        "wedding_date": "2026-08-20",
        "budget": 8000,
        "guest_count": 150,
        "location": "Beirut",
        "preferred_services": ["Photography", "Catering"],
    }


def test_customer_can_create_update_delete_wedding_plan(client, db):
    # Arrange
    customer = user(db, "customer", "plan@test.com")
    auth = headers(customer)
    # Act
    created = client.post("/wedding-plans", json=plan_payload(), headers=auth)
    updated = client.put(f"/wedding-plans/{created.json()['id']}", json={"budget": 7000}, headers=auth)
    deleted = client.delete(f"/wedding-plans/{created.json()['id']}", headers=auth)
    # Assert
    assert created.status_code == 200
    assert updated.json()["budget"] == 7000
    assert deleted.status_code == 200


def test_provider_cannot_create_customer_wedding_plan(client, db):
    # Arrange
    provider = user(db, "service_provider", "plan-provider@test.com")
    # Act
    response = client.post("/wedding-plans", json=plan_payload(), headers=headers(provider))
    # Assert
    assert response.status_code == 403


def test_customer_cannot_edit_another_customer_plan(client, db):
    # Arrange
    owner = user(db, "customer", "owner@test.com")
    other = user(db, "customer", "other@test.com")
    created = client.post("/wedding-plans", json=plan_payload(), headers=headers(owner))
    # Act
    response = client.put(f"/wedding-plans/{created.json()['id']}", json={"budget": 1}, headers=headers(other))
    # Assert
    assert response.status_code == 404


def test_reject_invalid_budget_and_guest_count(client, db):
    # Arrange
    customer = user(db, "customer", "invalid-plan@test.com")
    # Act
    budget = client.post("/wedding-plans", json={**plan_payload(), "budget": -1}, headers=headers(customer))
    guests = client.post("/wedding-plans", json={**plan_payload(), "guest_count": 0}, headers=headers(customer))
    # Assert
    assert budget.status_code == 422
    assert guests.status_code == 422


def test_return_empty_state_if_customer_has_no_plan(client, db):
    # Arrange
    customer = user(db, "customer", "empty-plan@test.com")
    # Act
    response = client.get("/wedding-plans/me", headers=headers(customer))
    # Assert
    assert response.status_code == 200
    assert response.json() is None
