from models import WeddingPackage, WeddingPackageItem
from tests.helpers import booking, category, headers, package, provider, user


def booking_payload(provider_id):
    return {
        "provider_id": provider_id,
        "event_date": "2026-08-20T18:00:00",
        "location": "Beirut",
        "payment_method": "cash",
    }


def test_booking_creation_notifies_provider(client, db):
    customer = user(db, "customer", "notify-book@test.com")
    studio = provider(db)

    response = client.post("/bookings", json=booking_payload(studio.id), headers=headers(customer))
    notes = client.get("/notifications", headers=headers(studio.user)).json()

    assert response.status_code == 201
    assert notes[0]["type"] == "booking_created"
    assert notes[0]["related_booking_status"] == "pending"


def test_provider_response_actions_notify_customer(client, db):
    customer = user(db, "customer", "response-book@test.com")
    studio = provider(db)
    item = booking(db, customer, studio, "pending")

    accepted = client.put(
        f"/provider/bookings/{item.id}/accept",
        json={"provider_response_note": "We are available."},
        headers=headers(studio.user),
    )
    complete = client.put(f"/provider/bookings/{item.id}/complete", headers=headers(studio.user))
    notes = client.get("/notifications", headers=headers(customer)).json()

    assert accepted.json()["provider_response_note"] == "We are available."
    assert complete.json()["booking_status"] == "completed"
    assert {item["type"] for item in notes} >= {"booking_accepted", "review_available"}


def test_provider_rejects_with_note_and_customer_notification(client, db):
    customer = user(db, "customer", "reject-book@test.com")
    studio = provider(db)
    item = booking(db, customer, studio, "pending")

    response = client.put(
        f"/provider/bookings/{item.id}/reject",
        json={"provider_response_note": "Already booked nearby."},
        headers=headers(studio.user),
    )
    notes = client.get("/notifications", headers=headers(customer)).json()

    assert response.json()["booking_status"] == "rejected"
    assert response.json()["provider_response_note"] == "Already booked nearby."
    assert notes[0]["type"] == "booking_rejected"


def test_user_can_mark_notifications_read(client, db):
    customer = user(db, "customer", "read-note@test.com")
    studio = provider(db)
    item = booking(db, customer, studio, "pending")
    client.put(f"/provider/bookings/{item.id}/accept", headers=headers(studio.user))
    note = client.get("/notifications", headers=headers(customer)).json()[0]

    read = client.put(f"/notifications/{note['id']}/read", headers=headers(customer))
    read_all = client.put("/notifications/read-all", headers=headers(customer))

    assert read.json()["is_read"] is True
    assert read_all.status_code == 200


def test_wedding_package_request_notifies_each_provider_and_customer_gets_responses(client, db):
    customer = user(db, "customer", "package-request@test.com")
    photo_category = category(db, "Photo")
    music_category = category(db, "Music")
    photo = provider(db, photo_category, name="Photo Studio")
    music = provider(db, music_category, name="Music Studio")
    photo_package = package(db, photo, "Photo Package", 900)
    music_package = package(db, music, "Music Package", 700)
    wedding_package = WeddingPackage(title="Full Wedding Team", total_price=1600)
    db.add(wedding_package)
    db.flush()
    db.add_all([
        WeddingPackageItem(
            wedding_package_id=wedding_package.id,
            service_provider_id=photo.id,
            service_package_id=photo_package.id,
            category_name="Photography",
            item_price=900,
        ),
        WeddingPackageItem(
            wedding_package_id=wedding_package.id,
            service_provider_id=music.id,
            service_package_id=music_package.id,
            category_name="Music",
            item_price=700,
        ),
    ])
    db.commit()

    response = client.post(
        "/bookings",
        json={
            "provider_id": photo.id,
            "wedding_package_id": wedding_package.id,
            "event_date": "2026-08-20T18:00:00",
            "location": "Beirut",
            "payment_method": "cash",
        },
        headers=headers(customer),
    )
    photo_notes = client.get("/notifications", headers=headers(photo.user)).json()
    music_notes = client.get("/notifications", headers=headers(music.user)).json()

    assert response.status_code == 201
    assert len(client.get("/bookings/me", headers=headers(customer)).json()) == 2
    assert photo_notes[0]["type"] == "booking_created"
    assert music_notes[0]["type"] == "booking_created"
    assert photo_notes[0]["related_booking_id"] != music_notes[0]["related_booking_id"]

    accepted = client.put(
        f"/provider/bookings/{photo_notes[0]['related_booking_id']}/accept",
        headers=headers(photo.user),
    )
    rejected = client.put(
        f"/provider/bookings/{music_notes[0]['related_booking_id']}/reject",
        headers=headers(music.user),
    )
    customer_notes = client.get("/notifications", headers=headers(customer)).json()

    assert accepted.json()["booking_status"] == "accepted"
    assert rejected.json()["booking_status"] == "rejected"
    assert {item["type"] for item in customer_notes} >= {"booking_accepted", "booking_rejected"}
