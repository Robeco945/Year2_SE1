import pytest
from fastapi.testclient import TestClient

# test conversation creation and participant management

def test_create_conversation(client: TestClient, test_user, test_user2):
    """should create a conversation with participants"""
    response = client.post(
        "/api/conversations/",
        json={
            "type": "direct",
            "participant_ids": [test_user.user_id, test_user2.user_id]
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "direct"
    assert "conversation_id" in data

def test_create_conversation_invalid_user(client: TestClient, test_user):
    """should fail when trying to add non-existent user to conversation"""
    response = client.post(
        "/api/conversations/",
        json={
            "type": "direct",
            "participant_ids": [test_user.user_id, 99999]
        }
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_get_conversation(client: TestClient, test_conversation):
    """should get conversation by id"""
    response = client.get(f"/api/conversations/{test_conversation.conversation_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["conversation_id"] == test_conversation.conversation_id
    assert data["type"] == test_conversation.type

def test_get_conversation_not_found(client: TestClient):
    """should return 404 for non-existent conversation"""
    response = client.get("/api/conversations/99999")
    assert response.status_code == 404

def test_list_conversations(client: TestClient, test_conversation):
    """should list all conversations"""
    response = client.get("/api/conversations/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(c["conversation_id"] == test_conversation.conversation_id for c in data)

def test_delete_conversation(client: TestClient, test_conversation):
    """should delete conversation successfully"""
    response = client.delete(f"/api/conversations/{test_conversation.conversation_id}")
    assert response.status_code == 204
    
    # verify conversation is deleted
    get_response = client.get(f"/api/conversations/{test_conversation.conversation_id}")
    assert get_response.status_code == 404

def test_delete_conversation_not_found(client: TestClient):
    """should return 404 when deleting non-existent conversation"""
    response = client.delete("/api/conversations/99999")
    assert response.status_code == 404

def test_get_conversation_participants(client: TestClient, test_conversation, test_user, test_user2):
    """should get all participants in a conversation"""
    response = client.get(f"/api/conversations/{test_conversation.conversation_id}/participants")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    user_ids = [p["user_id"] for p in data]
    assert test_user.user_id in user_ids
    assert test_user2.user_id in user_ids

def test_get_participants_empty_conversation(client: TestClient, db):
    """should return 404 when conversation has no participants"""
    # create conversation without participants
    from models import Conversation
    conversation = Conversation(type="group")
    db.add(conversation)
    db.commit()
    
    response = client.get(f"/api/conversations/{conversation.conversation_id}/participants")
    assert response.status_code == 404

def test_add_participant(client: TestClient, test_conversation, db):
    """should add a new participant to conversation"""
    # create a third user
    from models import User
    new_user = User(
        username="newparticipant",
        email="newpart@example.com",
        password_hash="hashed"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    response = client.post(
        f"/api/conversations/{test_conversation.conversation_id}/participants/{new_user.user_id}"
    )
    assert response.status_code == 201

def test_add_participant_duplicate(client: TestClient, test_conversation, test_user):
    """should fail when adding user who is already a participant"""
    response = client.post(
        f"/api/conversations/{test_conversation.conversation_id}/participants/{test_user.user_id}"
    )
    assert response.status_code == 400
    assert "already" in response.json()["detail"].lower()

def test_add_participant_invalid_conversation(client: TestClient, test_user):
    """should return 404 when adding participant to non-existent conversation"""
    response = client.post(f"/api/conversations/99999/participants/{test_user.user_id}")
    assert response.status_code == 404

def test_add_participant_invalid_user(client: TestClient, test_conversation):
    """should return 404 when adding non-existent user as participant"""
    response = client.post(f"/api/conversations/{test_conversation.conversation_id}/participants/99999")
    assert response.status_code == 404

def test_remove_participant(client: TestClient, test_conversation, test_user):
    """should remove participant from conversation"""
    response = client.delete(
        f"/api/conversations/{test_conversation.conversation_id}/participants/{test_user.user_id}"
    )
    assert response.status_code == 204
    
    # verify participant was removed
    get_response = client.get(f"/api/conversations/{test_conversation.conversation_id}/participants")
    data = get_response.json()
    user_ids = [p["user_id"] for p in data]
    assert test_user.user_id not in user_ids

def test_remove_participant_not_found(client: TestClient, test_conversation):
    """should return 404 when removing non-existent participant"""
    response = client.delete(f"/api/conversations/{test_conversation.conversation_id}/participants/99999")
    assert response.status_code == 404
