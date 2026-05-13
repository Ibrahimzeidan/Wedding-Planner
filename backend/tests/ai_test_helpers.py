from sqlalchemy import select

from models import AIConversation, ServiceCategory, WeddingPlan
from tests.helpers import category, package, provider, user


def make_package(db, cat_name, provider_name, price=1000, capacity=150, location="Beirut"):
    cat = db.scalar(select(ServiceCategory).where(ServiceCategory.name == cat_name))
    cat = cat or category(db, cat_name)
    studio = provider(db, cat, provider_name)
    studio.location = location
    studio.max_guests = max(capacity, studio.max_guests or 0)
    db.commit()
    return package(db, studio, f"{provider_name} Package", price, capacity)


def customer_plan(db, email: str, services=None):
    customer = user(db, "customer", email)
    plan = WeddingPlan(
        customer_id=customer.customer_profile.id,
        budget=6000,
        guest_count=150,
        location="Beirut",
        preferred_services=services or ["Wedding Hall", "Photography"],
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return customer, plan


def conversation_for(db, customer, plan):
    item = AIConversation(customer_id=customer.customer_profile.id, wedding_plan_id=plan.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
