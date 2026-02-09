import pytest
from fastapi.testclient import TestClient

# test user creation and basic crud operations

def test_create_user(client: TestClient):
    """should create a new user successfully"""
    response = client.post(
        "/api/users/",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "user_id" in data
    assert "password" not in data  # password should not be returned

def test_create_user_duplicate_email(client: TestClient, test_user):
    """should fail when trying to create user with existing email"""
    response = client.post(
        "/api/users/",
        json={
            "username": "differentuser",
            "email": test_user.email,
            "password": "password123"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()

def test_create_user_duplicate_username(client: TestClient, test_user):
    """should fail when trying to create user with existing username"""
    response = client.post(
        "/api/users/",
        json={
            "username": test_user.username,
            "email": "different@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()

def test_get_user(client: TestClient, test_user):
    """should get user by id"""
    response = client.get(f"/api/users/{test_user.user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == test_user.user_id
    assert data["username"] == test_user.username
    assert data["email"] == test_user.email

def test_get_user_not_found(client: TestClient):
    """should return 404 for non-existent user"""
    response = client.get("/api/users/99999")
    assert response.status_code == 404

def test_list_users(client: TestClient, test_user, test_user2):
    """should list all users with pagination"""
    response = client.get("/api/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert any(u["username"] == test_user.username for u in data)
    assert any(u["username"] == test_user2.username for u in data)

def test_list_users_pagination(client: TestClient, test_user, test_user2):
    """should respect skip and limit parameters"""
    response = client.get("/api/users/?skip=1&limit=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

def test_update_user(client: TestClient, test_user):
    """should update user details"""
    response = client.put(
        f"/api/users/{test_user.user_id}",
        json={
            "username": "updateduser",
            "email": "updated@example.com"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updateduser"
    assert data["email"] == "updated@example.com"

def test_update_user_not_found(client: TestClient):
    """should return 404 when updating non-existent user"""
    response = client.put(
        "/api/users/99999",
        json={"username": "whatever"}
    )
    assert response.status_code == 404

def test_delete_user(client: TestClient, test_user):
    """should delete user successfully"""
    response = client.delete(f"/api/users/{test_user.user_id}")
    assert response.status_code == 204
    
    # verify user is actually deleted
    get_response = client.get(f"/api/users/{test_user.user_id}")
    assert get_response.status_code == 404

def test_delete_user_not_found(client: TestClient):
    """should return 404 when deleting non-existent user"""
    response = client.delete("/api/users/99999")
    assert response.status_code == 404
