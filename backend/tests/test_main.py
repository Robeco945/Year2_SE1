import pytest
from fastapi.testclient import TestClient

# test main app endpoints

def test_root_endpoint(client: TestClient):
    """should return root message and api info"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["version"] == "1.0.0"

def test_health_check(client: TestClient):
    """should return healthy status"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_openapi_docs_available(client: TestClient):
    """should have openapi docs available"""
    response = client.get("/docs")
    assert response.status_code == 200

def test_openapi_json_available(client: TestClient):
    """should have openapi json spec available"""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "openapi" in data
    assert "info" in data
