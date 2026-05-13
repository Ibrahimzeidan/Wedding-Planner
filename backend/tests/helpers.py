from datetime import datetime

from models import Booking, Customer, ServiceCategory, ServicePackage, ServiceProvider, User
from security import create_access_token, hash_password


def headers(user: User) -> dict[str, str]:
    token = create_access_token(user.id, user.email, user.role)
    return {"Authorization": f"Bearer {token}"}


def category(db, name="Photography") -> ServiceCategory:
    item = ServiceCategory(name=name, description=f"{name} services")
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def user(db, role="customer", email=None, category_obj=None, name=None) -> User:
    email = email or f"{role}@test.com"
    item = User(
        full_name=name or role.title(),
        email=email,
        role=role,
        password_hash=hash_password("secret123"),
    )
    db.add(item)
    db.flush()
    if role == "customer":
        db.add(Customer(user_id=item.id))
    if role == "service_provider":
        category_obj = category_obj or category(db)
        db.add(ServiceProvider(
            user_id=item.id,
            category_id=category_obj.id,
            business_name=name or "Zahar Photography",
            location="Beirut",
            is_approved=True,
            max_guests=200,
        ))
    db.commit()
    db.refresh(item)
    return item


def provider(db, category_obj=None, name="Zahar Photography") -> ServiceProvider:
    return user(db, "service_provider", f"{name.lower().replace(' ', '')}@test.com",
                category_obj, name).service_provider_profile


def package(db, provider_obj, title="Gold Package", price=1000, capacity=150):
    item = ServicePackage(
        provider_id=provider_obj.id,
        title=title,
        price=price,
        capacity=capacity,
        is_available=True,
        is_active=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def booking(db, customer_user, provider_obj, status="pending", day="2026-08-20"):
    item = Booking(
        customer_id=customer_user.customer_profile.id,
        provider_id=provider_obj.id,
        event_date=datetime.fromisoformat(f"{day}T18:00:00"),
        location="Beirut",
        payment_method="cash",
        status=status,
        booking_status=status,
        total_price=1000,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
