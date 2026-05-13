from tests.helpers import booking, headers, provider, user


def review_payload(booking_id, rating=5):
    return {
        "booking_id": booking_id,
        "rating": rating,
        "comment": "Wonderful service and kind communication.",
    }


def test_customer_can_review_completed_booking(client, db):
    customer = user(db, "customer", "reviewer@test.com")
    studio = provider(db)
    reservation = booking(db, customer, studio, "completed", "2026-05-01")

    response = client.post("/reviews", json=review_payload(reservation.id), headers=headers(customer))

    assert response.status_code == 201
    assert response.json()["booking_id"] == reservation.id
    assert response.json()["provider_id"] == studio.id


def test_customer_cannot_review_pending_booking(client, db):
    customer = user(db, "customer", "early-review@test.com")
    studio = provider(db)
    reservation = booking(db, customer, studio, "pending")

    response = client.post("/reviews", json=review_payload(reservation.id), headers=headers(customer))

    assert response.status_code == 400
    assert response.json()["detail"] == "You can leave feedback only after the service is completed."


def test_customer_cannot_review_another_customers_booking(client, db):
    owner = user(db, "customer", "owner-review@test.com")
    intruder = user(db, "customer", "intruder-review@test.com")
    studio = provider(db)
    reservation = booking(db, owner, studio, "completed")

    response = client.post("/reviews", json=review_payload(reservation.id), headers=headers(intruder))

    assert response.status_code == 403


def test_review_rating_must_be_between_one_and_five(client, db):
    customer = user(db, "customer", "bad-rating@test.com")
    studio = provider(db)
    reservation = booking(db, customer, studio, "completed", "2026-05-01")

    response = client.post("/reviews", json=review_payload(reservation.id, 6), headers=headers(customer))

    assert response.status_code == 422


def test_customer_cannot_duplicate_booking_review(client, db):
    customer = user(db, "customer", "duplicate-review@test.com")
    studio = provider(db)
    reservation = booking(db, customer, studio, "completed", "2026-05-01")
    client.post("/reviews", json=review_payload(reservation.id), headers=headers(customer))

    response = client.post("/reviews", json=review_payload(reservation.id), headers=headers(customer))

    assert response.status_code == 400


def test_provider_rating_updates_after_reviews(client, db):
    first = user(db, "customer", "first-review@test.com")
    second = user(db, "customer", "second-review@test.com")
    studio = provider(db)
    client.post("/reviews", json=review_payload(booking(db, first, studio, "completed", "2026-05-01").id, 5), headers=headers(first))
    client.post("/reviews", json=review_payload(booking(db, second, studio, "completed", "2026-05-02").id, 3), headers=headers(second))

    db.refresh(studio)
    assert float(studio.rating) == 4


def test_public_customer_provider_admin_review_flows(client, db):
    customer = user(db, "customer", "review-list@test.com")
    admin = user(db, "admin", "review-admin@test.com")
    studio = provider(db)
    reservation = booking(db, customer, studio, "completed", "2026-05-01")
    created = client.post("/reviews", json=review_payload(reservation.id), headers=headers(customer)).json()

    assert client.get("/reviews/me", headers=headers(customer)).json()[0]["id"] == created["id"]
    assert client.get(f"/providers/{studio.id}/reviews").json()[0]["customer_name"] == customer.full_name
    assert client.get("/provider/reviews", headers=headers(studio.user)).json()[0]["booking_id"] == reservation.id
    assert client.get("/admin/reviews", headers=headers(admin)).json()["data"][0]["provider_id"] == studio.id
    assert client.delete(f"/admin/reviews/{created['id']}", headers=headers(admin)).status_code == 200
