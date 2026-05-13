from tests.helpers import booking, headers, provider, user


def review_payload(booking_id):
    return {
        "booking_id": booking_id,
        "rating": 5,
        "comment": "Wonderful service and kind communication.",
    }


def test_customer_waits_until_wedding_date_for_review(client, db):
    customer = user(db, "customer", "future-review@test.com")
    studio = provider(db)
    reservation = booking(db, customer, studio, "completed", "2026-08-20")

    response = client.post("/reviews", json=review_payload(reservation.id), headers=headers(customer))

    assert response.status_code == 400
    assert response.json()["detail"] == "You can leave feedback after the wedding date."
