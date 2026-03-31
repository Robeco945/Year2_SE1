import pytest
from fastapi.testclient import TestClient
import models

def _create_user(db, username: str, email: str):
    user = models.User(username=username, email=email, password_hash="hashed")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_create_conversation_requires_auth(client: TestClient, test_user, test_user2):
    response = client.post(
        "/api/conversations/",
        json={"type": "private", "participant_ids": [test_user.user_id, test_user2.user_id]},
    )
    assert response.status_code == 401


def test_create_conversation(client: TestClient, test_user, test_user2, auth_headers):
    response = client.post(
        "/api/conversations/",
        json={"type": "private", "participant_ids": [test_user.user_id, test_user2.user_id]},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"].upper() == "PRIVATE"
    assert "conversation_id" in data


def test_create_conversation_invalid_user(client: TestClient, test_user, auth_headers):
    response = client.post(
        "/api/conversations/",
        json={"type": "private", "participant_ids": [test_user.user_id, 99999]},
        headers=auth_headers,
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_conversation_as_member(client: TestClient, test_conversation, auth_headers):
    response = client.get(
        f"/api/conversations/{test_conversation.conversation_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["conversation_id"] == test_conversation.conversation_id


def test_get_conversation_forbidden_for_non_member(client: TestClient, test_conversation, db):
    outsider = _create_user(db, "outsider", "outsider@example.com")
    from auth import create_access_token

    token = create_access_token({"sub": str(outsider.user_id)})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(
        f"/api/conversations/{test_conversation.conversation_id}",
        headers=headers,
    )
    assert response.status_code == 403


def test_list_conversations_only_for_current_user(
    client: TestClient,
    db,
    test_conversation,
    test_user,
    test_user2,
    auth_headers,
):
    user3 = _create_user(db, "user3", "user3@example.com")
    user4 = _create_user(db, "user4", "user4@example.com")

    other_conversation = models.Conversation(type="PRIVATE")
    db.add(other_conversation)
    db.flush()
    db.add_all([
        models.ConversationParticipant(
            conversation_id=other_conversation.conversation_id,
            user_id=user3.user_id,
        ),
        models.ConversationParticipant(
            conversation_id=other_conversation.conversation_id,
            user_id=user4.user_id,
        ),
    ])
    db.commit()

    response = client.get("/api/conversations/", headers=auth_headers)
    assert response.status_code == 200
    ids = [c["conversation_id"] for c in response.json()]
    assert test_conversation.conversation_id in ids
    assert other_conversation.conversation_id not in ids


def test_delete_conversation_as_member(client: TestClient, test_conversation, auth_headers):
    delete_response = client.delete(
        f"/api/conversations/{test_conversation.conversation_id}",
        headers=auth_headers,
    )
    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/conversations/{test_conversation.conversation_id}",
        headers=auth_headers,
    )
    assert get_response.status_code == 404


def test_get_conversation_participants_as_member(
    client: TestClient,
    test_conversation,
    test_user,
    test_user2,
    auth_headers,
):
    response = client.get(
        f"/api/conversations/{test_conversation.conversation_id}/participants",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    user_ids = [participant["user_id"] for participant in data]
    assert test_user.user_id in user_ids
    assert test_user2.user_id in user_ids


def test_add_participant_to_private_conversation_blocked(
    client: TestClient,
    test_conversation,
    db,
    auth_headers,
):
    user3 = _create_user(db, "newparticipant", "newpart@example.com")
    response = client.post(
        f"/api/conversations/{test_conversation.conversation_id}/participants/{user3.user_id}",
        headers=auth_headers,
    )
    assert response.status_code == 400
    assert "cannot change participants" in response.json()["detail"].lower()


def test_add_participant_to_group_conversation(
    client: TestClient,
    db,
    test_user,
    test_user2,
    auth_headers,
):
    user3 = _create_user(db, "groupmember", "groupmember@example.com")
    response = client.post(
        "/api/conversations/",
        json={"type": "group", "participant_ids": [test_user.user_id, test_user2.user_id]},
        headers=auth_headers,
    )
    assert response.status_code == 201
    conversation_id = response.json()["conversation_id"]

    add_response = client.post(
        f"/api/conversations/{conversation_id}/participants/{user3.user_id}",
        headers=auth_headers,
    )
    assert add_response.status_code == 201


def test_remove_participant_from_group_self_only(
    client: TestClient,
    db,
    test_user,
    test_user2,
    auth_headers,
):
    user3 = _create_user(db, "groupmember2", "groupmember2@example.com")
    from auth import create_access_token

    response = client.post(
        "/api/conversations/",
        json={
            "type": "group",
            "participant_ids": [test_user.user_id, test_user2.user_id, user3.user_id],
        },
        headers=auth_headers,
    )
    conversation_id = response.json()["conversation_id"]

    token_user3 = create_access_token({"sub": str(user3.user_id)})
    headers_user3 = {"Authorization": f"Bearer {token_user3}"}
    remove_self = client.delete(
        f"/api/conversations/{conversation_id}/participants/{user3.user_id}",
        headers=headers_user3,
    )
    assert remove_self.status_code == 204

    remove_other = client.delete(
        f"/api/conversations/{conversation_id}/participants/{test_user2.user_id}",
        headers=auth_headers,
    )
    assert remove_other.status_code == 403


def test_conversation_messages_block_non_participants(
    client: TestClient,
    test_conversation,
    db,
):
    outsider = _create_user(db, "outsider_chat", "outsider_chat@example.com")
    from auth import create_access_token

    token = create_access_token({"sub": str(outsider.user_id)})
    headers = {"Authorization": f"Bearer {token}"}

    read_response = client.get(
        f"/api/conversations/{test_conversation.conversation_id}/messages",
        headers=headers,
    )
    assert read_response.status_code == 403

    write_response = client.post(
        f"/api/conversations/{test_conversation.conversation_id}/messages",
        json={"content": "not allowed"},
        headers=headers,
    )
    assert write_response.status_code == 403
