from models import ContactMessageModel
from settings import cors_origins


def test_contact_form_accepts_valid_message(client, db):
    payload = {
        "name": "Maya",
        "email": "MAYA@EXAMPLE.COM",
        "phone": "70111222",
        "message": "I need help planning a wedding.",
    }

    response = client.post("/contact", json=payload)
    saved = db.query(ContactMessageModel).first()

    assert response.status_code == 200
    assert response.json()["message"] == "Message sent successfully"
    assert saved.email == "maya@example.com"


def test_contact_form_rejects_invalid_payload(client):
    response = client.post("/contact", json={"name": "", "email": "bad", "message": ""})

    assert response.status_code == 422


def test_cors_uses_frontend_url(monkeypatch):
    monkeypatch.setenv("FRONTEND_URL", "https://planner.example.com/")

    assert "https://planner.example.com" in cors_origins()
