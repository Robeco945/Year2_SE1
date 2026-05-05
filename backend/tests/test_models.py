"""Tests for models.py — repr and ConversationType._missing_ coverage."""
import pytest
import models


def test_conversation_type_missing_lowercase():
    """_missing_ should match 'private' (lowercase) to PRIVATE."""
    assert models.ConversationType("private") == models.ConversationType.PRIVATE


def test_conversation_type_missing_uppercase_name():
    """_missing_ should match 'GROUP' (uppercase name) to GROUP."""
    assert models.ConversationType("GROUP") == models.ConversationType.GROUP


def test_conversation_type_missing_mixed_case():
    """_missing_ should match 'Private' (mixed case) to PRIVATE."""
    assert models.ConversationType("Private") == models.ConversationType.PRIVATE


def test_conversation_type_missing_invalid():
    """_missing_ should raise ValueError for an unknown type."""
    with pytest.raises(ValueError):
        models.ConversationType("unknown")


def test_user_repr(db, test_user):
    """User.__repr__ should include user_id and username."""
    r = repr(test_user)
    assert "User" in r
    assert str(test_user.user_id) in r
    assert test_user.username in r


def test_conversation_repr(db, test_conversation):
    """Conversation.__repr__ should include conversation_id."""
    r = repr(test_conversation)
    assert "Conversation" in r
    assert str(test_conversation.conversation_id) in r


def test_conversation_participant_repr(db, test_conversation, test_user):
    """ConversationParticipant.__repr__ should include both IDs."""
    participant = (
        db.query(models.ConversationParticipant)
        .filter_by(
            conversation_id=test_conversation.conversation_id,
            user_id=test_user.user_id,
        )
        .first()
    )
    r = repr(participant)
    assert "ConversationParticipant" in r
    assert str(test_conversation.conversation_id) in r
    assert str(test_user.user_id) in r


def test_message_repr(db, test_conversation, test_user):
    """Message.__repr__ should include message_id and sender_id."""
    msg = models.Message(
        content="test",
        conversation_id=test_conversation.conversation_id,
        sender_id=test_user.user_id,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    r = repr(msg)
    assert "Message" in r
    assert str(msg.message_id) in r
    assert str(test_user.user_id) in r
