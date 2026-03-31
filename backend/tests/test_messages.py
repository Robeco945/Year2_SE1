import pytest
from fastapi.testclient import TestClient
import models


def _create_user(db, username: str, email: str):
    user = models.User(username=username, email=email, password_hash="hashed")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_create_message(client: TestClient, test_conversation, test_user, auth_headers):
    response = client.post(
        "/api/messages/",
        json={
            "content": "hello world",
            "conversation_id": test_conversation.conversation_id,
            "sender_id": test_user.user_id,
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "hello world"
    assert data["conversation_id"] == test_conversation.conversation_id
    assert data["sender_id"] == test_user.user_id


def test_create_message_sender_spoofing_blocked(
    client: TestClient,
    test_conversation,
    test_user2,
    auth_headers,
):
    response = client.post(
        "/api/messages/",
        json={
            "content": "spoof",
            "conversation_id": test_conversation.conversation_id,
            "sender_id": test_user2.user_id,
        },
        headers=auth_headers,
    )
    assert response.status_code == 403


def test_create_message_invalid_conversation(client: TestClient, test_user, auth_headers):
    response = client.post(
        "/api/messages/",
        json={
            "content": "test message",
            "conversation_id": 99999,
            "sender_id": test_user.user_id,
        },
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_get_message_as_participant(client: TestClient, test_conversation, test_user, db, auth_headers):
    message = models.Message(
        content="test message",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    response = client.get(f"/api/messages/{message.message_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message_id"] == message.message_id


def test_get_message_forbidden_for_non_participant(
    client: TestClient,
    test_conversation,
    test_user,
    db,
):
    message = models.Message(
        content="private message",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    outsider = _create_user(db, "outsider_msg", "outsider_msg@example.com")
    from auth import create_access_token

    token = create_access_token({"sub": str(outsider.user_id)})
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get(f"/api/messages/{message.message_id}", headers=headers)
    assert response.status_code == 403


def test_list_messages_only_for_user_conversations(
    client: TestClient,
    test_conversation,
    test_user,
    test_user2,
    db,
    auth_headers,
):
    for i in range(3):
        db.add(
            models.Message(
                content=f"message {i}",
                conversation_id=test_conversation.conversation_id,
                sender_id=test_user.user_id,
            )
        )

    user3 = _create_user(db, "thirduser", "thirduser@example.com")
    hidden_conversation = models.Conversation(type="PRIVATE")
    db.add(hidden_conversation)
    db.flush()
    db.add_all([
        models.ConversationParticipant(
            conversation_id=hidden_conversation.conversation_id,
            user_id=test_user2.user_id,
        ),
        models.ConversationParticipant(
            conversation_id=hidden_conversation.conversation_id,
            user_id=user3.user_id,
        ),
        models.Message(
            content="hidden",
            conversation_id=hidden_conversation.conversation_id,
            sender_id=test_user2.user_id,
        ),
    ])
    db.commit()

    response = client.get("/api/messages/", headers=auth_headers)
    assert response.status_code == 200
    messages = response.json()
    assert len(messages) >= 3
    assert all(msg["conversation_id"] == test_conversation.conversation_id for msg in messages)


def test_get_messages_by_conversation_requires_membership(
    client: TestClient,
    test_conversation,
    db,
):
    outsider = _create_user(db, "outsider_conv", "outsider_conv@example.com")
    from auth import create_access_token

    token = create_access_token({"sub": str(outsider.user_id)})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(
        f"/api/messages/conversation/{test_conversation.conversation_id}",
        headers=headers,
    )
    assert response.status_code == 403


def test_update_message_only_sender_can_edit(
    client: TestClient,
    test_conversation,
    test_user,
    db,
    auth_headers,
    auth_headers_user2,
):
    message = models.Message(
        content="original content",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    own_update = client.put(
        f"/api/messages/{message.message_id}",
        json={"content": "updated content"},
        headers=auth_headers,
    )
    assert own_update.status_code == 200
    assert own_update.json()["content"] == "updated content"

    other_update = client.put(
        f"/api/messages/{message.message_id}",
        json={"content": "hijack"},
        headers=auth_headers_user2,
    )
    assert other_update.status_code == 403


def test_delete_message_only_sender_can_delete(
    client: TestClient,
    test_conversation,
    test_user,
    db,
    auth_headers,
    auth_headers_user2,
):
    message = models.Message(
        content="to be deleted",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    other_delete = client.delete(f"/api/messages/{message.message_id}", headers=auth_headers_user2)
    assert other_delete.status_code == 403

    own_delete = client.delete(f"/api/messages/{message.message_id}", headers=auth_headers)
    assert own_delete.status_code == 204
