from models import AIRecommendation, AIRecommendationItem, Conversation, Message, Notification, WeddingPlan
from tests.helpers import headers, package, provider, user


def data(response):
    return response.json()["data"]


def seed_admin_records(db):
    customer = user(db, "customer", "admin-control-customer@test.com")
    studio = provider(db)
    item = package(db, studio)
    plan = WeddingPlan(customer_id=customer.customer_profile.id, budget=5000)
    note = Notification(user_id=customer.id, title="Hello", message="Read me", type="system")
    chat = Conversation(customer_id=customer.customer_profile.id, provider_id=studio.id)
    db.add_all([plan, note, chat])
    db.flush()
    db.add(Message(conversation_id=chat.id, sender_id=customer.id, message="Please remove this."))
    rec = AIRecommendation(customer_id=customer.customer_profile.id, wedding_plan_id=plan.id)
    db.add(rec)
    db.flush()
    db.add(AIRecommendationItem(
        recommendation_id=rec.id, provider_id=studio.id, package_id=item.id,
        category_name="Photography", item_price=1000, reason="Best match.",
    ))
    db.commit()
    return customer, note, chat, rec


def test_admin_can_manage_customers_notifications_messages_and_ai(client, db):
    admin = user(db, "admin", "admin-control@test.com")
    customer, note, chat, rec = seed_admin_records(db)
    auth = headers(admin)

    customers = client.get("/admin/customers", headers=auth)
    updated = client.put(
        f"/admin/customers/{customer.customer_profile.id}",
        json={"phone": "123", "is_active": False},
        headers=auth,
    )
    notifications = client.get("/admin/notifications", headers=auth)
    read_note = client.put(f"/admin/notifications/{note.id}/read", headers=auth)
    conversations = client.get("/admin/conversations", headers=auth)
    messages = client.get(f"/admin/conversations/{chat.id}/messages", headers=auth)
    ai_items = client.get("/admin/ai-recommendations", headers=auth)
    ai_detail = client.get(f"/admin/ai-recommendations/{rec.id}", headers=auth)

    assert any(item["email"] == customer.email for item in data(customers))
    assert data(updated)["phone"] == "123"
    assert data(notifications)[0]["title"] == "Hello"
    assert data(read_note)["is_read"] is True
    assert data(conversations)[0]["id"] == chat.id
    assert data(messages)[0]["message"] == "Please remove this."
    assert data(ai_items)[0]["id"] == rec.id
    assert data(ai_detail)["items"][0]["reason"] == "Best match."


def test_admin_can_delete_notifications_messages_and_ai(client, db):
    admin = user(db, "admin", "admin-delete-control@test.com")
    _, note, chat, rec = seed_admin_records(db)
    auth = headers(admin)
    message_id = data(client.get(f"/admin/conversations/{chat.id}/messages", headers=auth))[0]["id"]

    assert client.delete(f"/admin/notifications/{note.id}", headers=auth).status_code == 200
    assert client.delete(f"/admin/messages/{message_id}", headers=auth).status_code == 200
    assert client.delete(f"/admin/ai-recommendations/{rec.id}", headers=auth).status_code == 200
