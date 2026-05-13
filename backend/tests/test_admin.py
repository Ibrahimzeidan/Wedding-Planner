from tests.helpers import booking, category, headers, package, provider, user


def data(response):
    return response.json()["data"]


def test_admin_can_view_update_and_delete_users(client, db):
    # Arrange
    admin = user(db, "admin", "admin-users@test.com")
    customer = user(db, "customer", "managed@test.com")
    auth = headers(admin)
    # Act
    listed = client.get("/admin/users", headers=auth)
    updated = client.put(f"/admin/users/{customer.id}", json={"full_name": "Managed"}, headers=auth)
    deleted = client.delete(f"/admin/users/{customer.id}", headers=auth)
    # Assert
    assert listed.status_code == 200
    assert any(item["email"] == admin.email for item in data(listed))
    assert data(updated)["full_name"] == "Managed"
    assert deleted.status_code == 200


def test_admin_cannot_delete_only_admin_or_create_multiple_admins(client, db):
    # Arrange
    admin = user(db, "admin", "only-admin@test.com")
    customer = user(db, "customer", "promote@test.com")
    auth = headers(admin)
    # Act
    delete_admin = client.delete(f"/admin/users/{admin.id}", headers=auth)
    promote_user = client.put(f"/admin/users/{customer.id}", json={"role": "admin"}, headers=auth)
    # Assert
    assert delete_admin.status_code == 400
    assert promote_user.status_code == 400


def test_admin_can_manage_providers_packages_and_bookings(client, db):
    # Arrange
    admin = user(db, "admin", "manager@test.com")
    customer = user(db, "customer", "admin-book@test.com")
    studio = provider(db, category(db, "Photography"), "Zahar Photography")
    item = package(db, studio)
    reservation = booking(db, customer, studio)
    auth = headers(admin)
    # Act
    provider_update = client.put(f"/admin/providers/{studio.id}", json={"location": "Byblos"}, headers=auth)
    package_update = client.put(f"/admin/packages/{item.id}", json={"price": 600}, headers=auth)
    booking_update = client.put(f"/admin/bookings/{reservation.id}", json={"booking_status": "completed"}, headers=auth)
    # Assert
    assert data(provider_update)["location"] == "Byblos"
    assert data(package_update)["price"] == 600
    assert data(booking_update)["booking_status"] == "completed"


def test_non_admin_cannot_access_admin_apis(client, db):
    # Arrange
    customer = user(db, "customer", "not-admin@test.com")
    # Act
    response = client.get("/admin/users", headers=headers(customer))
    # Assert
    assert response.status_code == 403
