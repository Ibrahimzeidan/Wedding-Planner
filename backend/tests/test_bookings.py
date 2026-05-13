from tests.helpers import booking, headers, provider, user


def booking_payload(provider_id, day="2026-08-20"):
    return {
        "provider_id": provider_id,
        "event_date": f"{day}T18:00:00",
        "location": "Beirut",
        "payment_method": "cash",
    }


def test_customer_can_book_available_provider_on_date(client, db):
    # Arrange
    customer = user(db, "customer", "book@test.com")
    studio = provider(db)
    # Act
    response = client.post("/bookings", json=booking_payload(studio.id), headers=headers(customer))
    # Assert
    assert response.status_code == 201
    assert response.json()["booking_status"] == "pending"
    assert response.json()["conversation_id"] is not None


def test_booking_rejects_same_provider_same_date_when_pending(client, db):
    # Arrange
    first = user(db, "customer", "first-book@test.com")
    second = user(db, "customer", "second-book@test.com")
    studio = provider(db)
    booking(db, first, studio, "pending")
    # Act
    response = client.post("/bookings", json=booking_payload(studio.id), headers=headers(second))
    # Assert
    assert response.status_code == 409
    assert "Someone already booked this service provider on this date" in response.text


def test_booking_rejects_same_provider_same_date_when_accepted(client, db):
    # Arrange
    first = user(db, "customer", "accepted-book@test.com")
    second = user(db, "customer", "other-book@test.com")
    studio = provider(db)
    booking(db, first, studio, "accepted")
    # Act
    response = client.post("/bookings", json=booking_payload(studio.id), headers=headers(second))
    # Assert
    assert response.status_code == 409


def test_customer_can_book_same_provider_on_different_date(client, db):
    # Arrange
    first = user(db, "customer", "date-a@test.com")
    second = user(db, "customer", "date-b@test.com")
    studio = provider(db)
    booking(db, first, studio, "pending")
    # Act
    response = client.post("/bookings", json=booking_payload(studio.id, "2026-08-21"), headers=headers(second))
    # Assert
    assert response.status_code == 201


def test_customer_can_book_after_old_booking_is_cancelled(client, db):
    # Arrange
    first = user(db, "customer", "cancel-a@test.com")
    second = user(db, "customer", "cancel-b@test.com")
    studio = provider(db)
    old = booking(db, first, studio, "pending")
    client.delete(f"/bookings/{old.id}", headers=headers(first))
    # Act
    response = client.post("/bookings", json=booking_payload(studio.id), headers=headers(second))
    # Assert
    assert response.status_code == 201


def test_provider_and_admin_can_update_booking_status(client, db):
    # Arrange
    customer = user(db, "customer", "status-book@test.com")
    admin = user(db, "admin", "status-admin@test.com")
    studio = provider(db)
    item = booking(db, customer, studio, "pending")
    # Act
    accepted = client.put(f"/provider/bookings/{item.id}", json={"booking_status": "accepted"}, headers=headers(studio.user))
    rejected = client.put(f"/provider/bookings/{item.id}", json={"booking_status": "rejected"}, headers=headers(studio.user))
    admined = client.put(f"/admin/bookings/{item.id}", json={"booking_status": "completed"}, headers=headers(admin))
    # Assert
    assert accepted.json()["booking_status"] == "accepted"
    assert rejected.json()["booking_status"] == "rejected"
    assert admined.json()["data"]["booking_status"] == "completed"
