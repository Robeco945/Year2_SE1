import pytest
from fastapi.testclient import TestClient

# test message creation and retrieval

def test_create_message(client: TestClient, test_conversation, test_user):
    """should create a new message successfully"""
    response = client.post(
        "/api/messages/",
        json={
            "content": "hello world",
            "conversation_id": test_conversation.conversation_id,
            "sender_id": test_user.user_id
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "hello world"
    assert data["conversation_id"] == test_conversation.conversation_id
    assert data["sender_id"] == test_user.user_id
    assert "message_id" in data
    assert "sent_at" in data

def test_create_message_invalid_sender(client: TestClient, test_conversation):
    """should fail when sender doesn't exist"""
    response = client.post(
        "/api/messages/",
        json={
            "content": "test message",
            "conversation_id": test_conversation.conversation_id,
            "sender_id": 99999
        }
    )
    assert response.status_code == 404
    assert "sender" in response.json()["detail"].lower()

def test_create_message_invalid_conversation(client: TestClient, test_user):
    """should fail when conversation doesn't exist"""
    response = client.post(
        "/api/messages/",
        json={
            "content": "test message",
            "conversation_id": 99999,
            "sender_id": test_user.user_id
        }
    )
    assert response.status_code == 404
    assert "conversation" in response.json()["detail"].lower()

def test_get_message(client: TestClient, test_conversation, test_user, db):
    """should get message by id"""
    # create a message first
    from models import Message
    message = Message(
        content="test message",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    response = client.get(f"/api/messages/{message.message_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message_id"] == message.message_id
    assert data["content"] == "test message"

def test_get_message_not_found(client: TestClient):
    """should return 404 for non-existent message"""
    response = client.get("/api/messages/99999")
    assert response.status_code == 404

def test_list_messages(client: TestClient, test_conversation, test_user, db):
    """should list all messages"""
    # create some messages
    from models import Message
    for i in range(3):
        msg = Message(
            content=f"message {i}",
            conversation_id=test_conversation.conversation_id,
            sender_id=test_user.user_id
        )
        db.add(msg)
    db.commit()
    
    response = client.get("/api/messages/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3

def test_list_messages_pagination(client: TestClient, test_conversation, test_user, db):
    """should respect pagination parameters"""
    # create some messages
    from models import Message
    for i in range(5):
        msg = Message(
            content=f"message {i}",
            conversation_id=test_conversation.conversation_id,
            sender_id=test_user.user_id
        )
        db.add(msg)
    db.commit()
    
    response = client.get("/api/messages/?skip=2&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_get_messages_by_conversation(client: TestClient, test_conversation, test_user, test_user2, db):
    """should get all messages in a specific conversation"""
    # create messages in the conversation
    from models import Message, Conversation
    for i in range(3):
        msg = Message(
            content=f"message {i}",
            conversation_id=test_conversation.conversation_id,
            sender_id=test_user.user_id
        )
        db.add(msg)
    
    # create another conversation with messages to ensure filtering works
    other_conv = Conversation(type="direct")
    db.add(other_conv)
    db.flush()
    other_msg = Message(
        content="other message",
        conversation_id=other_conv.conversation_id,
        sender_id=test_user2.user_id
    )
    db.add(other_msg)
    db.commit()
    
    response = client.get(f"/api/messages/conversation/{test_conversation.conversation_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert all(m["conversation_id"] == test_conversation.conversation_id for m in data)

def test_update_message(client: TestClient, test_conversation, test_user, db):
    """should update message content"""
    # create a message
    from models import Message
    message = Message(
        content="original content",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    response = client.put(
        f"/api/messages/{message.message_id}",
        json={"content": "updated content"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "updated content"

def test_update_message_not_found(client: TestClient):
    """should return 404 when updating non-existent message"""
    response = client.put(
        "/api/messages/99999",
        json={"content": "whatever"}
    )
    assert response.status_code == 404

def test_delete_message(client: TestClient, test_conversation, test_user, db):
    """should delete message successfully"""
    # create a message
    from models import Message
    message = Message(
        content="to be deleted",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    response = client.delete(f"/api/messages/{message.message_id}")
    assert response.status_code == 204
    
    # verify message is deleted
    get_response = client.get(f"/api/messages/{message.message_id}")
    assert get_response.status_code == 404

def test_delete_message_not_found(client: TestClient):
    """should return 404 when deleting non-existent message"""
    response = client.delete("/api/messages/99999")
    assert response.status_code == 404
