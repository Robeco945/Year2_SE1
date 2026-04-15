from fastapi.testclient import TestClient

import models
from routes.users import hash_password


def create_login_user(db, *, username="testuser", email="test@example.com", password="password123"):
    user = models.User(
        username=username,
        email=email,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_login_accepts_email(client: TestClient, db):
    test_user = create_login_user(db)
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["token_type"] == "bearer"
    assert "access_token" in data


def test_login_accepts_email_with_whitespace_and_case(client: TestClient, db):
    create_login_user(db)
    response = client.post(
        "/api/auth/login",
        json={"email": "  TEST@example.com  ", "password": "password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["token_type"] == "bearer"
    assert "access_token" in data


def test_login_rejects_non_email_identifier(client: TestClient, db):
    test_user = create_login_user(db)
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.username, "password": "password123"},
    )

    assert response.status_code == 422


def test_login_rejects_invalid_credentials(client: TestClient, db):
    test_user = create_login_user(db)
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"