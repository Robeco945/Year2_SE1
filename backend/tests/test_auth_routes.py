"""Tests for routes/auth.py — register, login, /me, profile update, password change."""
import pytest
from fastapi.testclient import TestClient
from routes.users import hash_password


# ── Registration ──────────────────────────────────────────────────────

def test_register_success(client: TestClient):
    """Should register a new user and return a JWT token."""
    response = client.post(
        "/api/auth/register",
        json={"name": "alice", "email": "alice@example.com", "password": "secret123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_register_duplicate_email(client: TestClient, test_user):
    """Should reject registration when the email is already in use."""
    response = client.post(
        "/api/auth/register",
        json={"name": "other", "email": test_user.email, "password": "secret123"},
    )
    assert response.status_code == 400
    assert "already in use" in response.json()["detail"].lower()


def test_register_duplicate_username(client: TestClient, test_user):
    """Should reject registration when the username is already in use."""
    response = client.post(
        "/api/auth/register",
        json={
            "name": test_user.username,
            "email": "unique@example.com",
            "password": "secret123",
        },
    )
    assert response.status_code == 400
    assert "already in use" in response.json()["detail"].lower()


# ── Login ─────────────────────────────────────────────────────────────

def test_login_success(client: TestClient, db):
    """Should return a token for valid credentials."""
    import models

    db.add(
        models.User(
            username="loginuser",
            email="login@example.com",
            password_hash=hash_password("mypassword"),
        )
    )
    db.commit()

    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "mypassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, db):
    """Should reject login with wrong password."""
    import models

    db.add(
        models.User(
            username="wrongpw",
            email="wrongpw@example.com",
            password_hash=hash_password("correct"),
        )
    )
    db.commit()

    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpw@example.com", "password": "wrong"},
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


def test_login_nonexistent_user(client: TestClient):
    """Should reject login for an email that doesn't exist."""
    response = client.post(
        "/api/auth/login",
        json={"email": "noone@example.com", "password": "anything"},
    )
    assert response.status_code == 401


# ── /me ───────────────────────────────────────────────────────────────

def test_get_me(client: TestClient, test_user, auth_headers):
    """Should return the currently authenticated user."""
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == test_user.user_id
    assert data["username"] == test_user.username


def test_get_me_unauthenticated(client: TestClient):
    """Should return 401 when no token is provided."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401


# ── Profile Update ────────────────────────────────────────────────────

def test_update_profile_username(client: TestClient, test_user, auth_headers):
    """Should allow updating the username."""
    response = client.put(
        "/api/auth/profile",
        json={"username": "newname"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["username"] == "newname"


def test_update_profile_bio(client: TestClient, test_user, auth_headers):
    """Should allow updating the bio."""
    response = client.put(
        "/api/auth/profile",
        json={"bio": "Hello, world!"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["bio"] == "Hello, world!"


def test_update_profile_picture(client: TestClient, test_user, auth_headers):
    """Should allow updating the profile picture URL."""
    url = "https://example.com/pic.jpg"
    response = client.put(
        "/api/auth/profile",
        json={"profile_picture_url": url},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["profile_picture_url"] == url


def test_update_profile_duplicate_username(
    client: TestClient, test_user, test_user2, auth_headers
):
    """Should reject a username that another user already has."""
    response = client.put(
        "/api/auth/profile",
        json={"username": test_user2.username},
        headers=auth_headers,
    )
    assert response.status_code == 400
    assert "already in use" in response.json()["detail"].lower()


# ── Password Change ──────────────────────────────────────────────────

def test_change_password_success(client: TestClient, db, auth_headers):
    """Should change the password when the current password is correct."""
    import models

    # Update test_user with a real hashed password so verify works
    user = db.query(models.User).first()
    user.password_hash = hash_password("oldpassword")
    db.commit()

    response = client.put(
        "/api/auth/password",
        json={"current_password": "oldpassword", "new_password": "newpassword"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert "updated" in response.json()["message"].lower()


def test_change_password_wrong_current(client: TestClient, db, auth_headers):
    """Should reject password change when current password is wrong."""
    import models

    user = db.query(models.User).first()
    user.password_hash = hash_password("realpassword")
    db.commit()

    response = client.put(
        "/api/auth/password",
        json={"current_password": "wrongpassword", "new_password": "whatever"},
        headers=auth_headers,
    )
    assert response.status_code == 400
    assert "incorrect" in response.json()["detail"].lower()
