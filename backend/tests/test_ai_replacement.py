from sqlalchemy import select

from models import ServiceCategory
from tests.helpers import booking, category, headers, package, provider, user


def make_package(db, cat_name, provider_name, price=1000, capacity=150, location="Beirut"):
    cat = db.scalar(select(ServiceCategory).where(ServiceCategory.name == cat_name))
    cat = cat or category(db, cat_name)
    studio = provider(db, cat, provider_name)
    studio.location = location
    db.commit()
    return package(db, studio, f"{provider_name} Package", price, capacity)


def test_ai_replacement_excludes_rejected_and_booked_provider(client, db):
    customer = user(db, "customer", "ai-replacement@test.com")
    other = user(db, "customer", "ai-replacement-other@test.com")
    rejected = make_package(db, "Photography", "Zahar Photography", 1000, 150, "Beirut")
    blocked = make_package(db, "Photography", "Busy Photo", 900, 150, "Beirut")
    make_package(db, "Photography", "Golden Lens Studio", 1100, 150, "Beirut")
    booking(db, other, blocked.provider, "accepted", "2026-08-20")
    request = booking(db, customer, rejected.provider, "rejected", "2026-08-20")

    response = client.post(f"/ai/recommendations/replacement/{request.id}", headers=headers(customer))

    data = response.json()["data"]
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert data["provider"] == "Golden Lens Studio"


def test_ai_replacement_returns_clear_message_when_missing(client, db):
    customer = user(db, "customer", "ai-no-replacement@test.com")
    rejected = make_package(db, "Photography", "Only Photo", 1000)
    request = booking(db, customer, rejected.provider, "rejected")

    response = client.post(f"/ai/recommendations/replacement/{request.id}", headers=headers(customer))

    assert response.status_code == 200
    assert response.json()["success"] is False
