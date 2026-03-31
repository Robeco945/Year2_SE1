from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user
from websocket_manager import manager

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


def _normalize_conversation_type(conv_type: str) -> str:
    normalized = (conv_type or "").strip().upper()
    if normalized not in {"PRIVATE", "GROUP"}:
        raise HTTPException(status_code=400, detail="Conversation type must be PRIVATE or GROUP")
    return normalized


def _require_membership(
    db: Session,
    conversation_id: int,
    user_id: int,
) -> models.Conversation:
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    participant = db.query(models.ConversationParticipant).filter(
        models.ConversationParticipant.conversation_id == conversation_id,
        models.ConversationParticipant.user_id == user_id,
    ).first()
    if not participant:
        raise HTTPException(status_code=403, detail="You are not a participant in this conversation")

    return conversation

# conversation CRUD
@router.post("/", response_model=schemas.ConversationResponse, status_code=201)

# create conversation, checks for valid participant IDs, creates conversation and adds participants
def create_conversation(
    conv: schemas.ConversationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new conversation"""
    conversation_type = _normalize_conversation_type(conv.type)

    # De-duplicate participant IDs while preserving input order.
    participant_ids = list(dict.fromkeys(conv.participant_ids))
    if current_user.user_id not in participant_ids:
        participant_ids.append(current_user.user_id)

    if conversation_type == "PRIVATE" and len(participant_ids) != 2:
        raise HTTPException(
            status_code=400,
            detail="Private conversations must have exactly 2 participants"
        )

    if conversation_type == "GROUP" and len(participant_ids) < 2:
        raise HTTPException(
            status_code=400,
            detail="Group conversations must have at least 2 participants"
        )

    db_conversation = models.Conversation(type=conversation_type)
    db.add(db_conversation)
    db.flush()  # get the conversation_id without committing

    existing_ids = {
        user_id
        for (user_id,) in db.query(models.User.user_id)
        .filter(models.User.user_id.in_(participant_ids))
        .all()
    }
    missing_ids = [user_id for user_id in participant_ids if user_id not in existing_ids]
    if missing_ids:
        db.rollback()
        raise HTTPException(status_code=404, detail=f"User(s) not found: {missing_ids}")

    # add participants
    for user_id in participant_ids:
        participant = models.ConversationParticipant(
            conversation_id=db_conversation.conversation_id,
            user_id=user_id
        )
        db.add(participant)
    
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

# get conversation by ID, returns 404 if not found
@router.get("/{conversation_id}", response_model=schemas.ConversationResponse)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get a conversation by ID"""
    conversation = _require_membership(db, conversation_id, current_user.user_id)
    return conversation

# list conversations with pagination, returns a list of conversations based on skip and limit parameters
@router.get("/", response_model=list[schemas.ConversationResponse])
def list_conversations(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List the authenticated user's conversations with pagination"""
    conversations = (
        db.query(models.Conversation)
        .join(
            models.ConversationParticipant,
            models.ConversationParticipant.conversation_id == models.Conversation.conversation_id,
        )
        .filter(models.ConversationParticipant.user_id == current_user.user_id)
        .order_by(models.Conversation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return conversations

# delete conversation, deletes a conversation by ID, returns 404 if not found
@router.delete("/{conversation_id}", status_code=204)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a conversation"""
    conversation = _require_membership(db, conversation_id, current_user.user_id)

    db.delete(conversation)
    db.commit()
    return None

# get all participants in a conversation, returns 404 if conversation not found or no participants found
@router.get("/{conversation_id}/participants", response_model=list[schemas.ConversationParticipantResponse])
def get_conversation_participants(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get all participants in a conversation"""
    _require_membership(db, conversation_id, current_user.user_id)
    participants = db.query(models.ConversationParticipant).filter(
        models.ConversationParticipant.conversation_id == conversation_id
    ).all()
    if not participants:
        raise HTTPException(status_code=404, detail="No participants found")
    return participants

# add participant, adds a user to a conversation, checks for valid conversation and user IDs, checks if user is already a participant before adding
@router.post("/{conversation_id}/participants/{user_id}", status_code=201)
def add_participant(
    conversation_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Add a user to a conversation"""
    conversation = _require_membership(db, conversation_id, current_user.user_id)

    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing = db.query(models.ConversationParticipant).filter(
        (models.ConversationParticipant.conversation_id == conversation_id) &
        (models.ConversationParticipant.user_id == user_id)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="User already in conversation")

    if conversation.type.upper() == "PRIVATE":
        raise HTTPException(
            status_code=400,
            detail="Private conversations cannot change participants"
        )
    
    participant = models.ConversationParticipant(
        conversation_id=conversation_id,
        user_id=user_id
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant

# get messages in a conversation — path used by the frontend
@router.get("/{conversation_id}/messages", response_model=list[schemas.MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get all messages in a conversation"""
    _require_membership(db, conversation_id, current_user.user_id)

    messages = (
        db.query(models.Message)
        .filter(models.Message.conversation_id == conversation_id)
        .order_by(models.Message.sent_at)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return messages


# send a message to a conversation — sender is the authenticated user
@router.post("/{conversation_id}/messages", response_model=schemas.MessageResponse, status_code=201)
async def send_conversation_message(
    conversation_id: int,
    body: schemas.MessageBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Send a message in a conversation (sender is the authenticated user)"""
    _require_membership(db, conversation_id, current_user.user_id)

    db_message = models.Message(
        content=body.content,
        conversation_id=conversation_id,
        sender_id=current_user.user_id,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    # Push the new message to the other participant if they are connected via WS
    recipients = (
        db.query(models.ConversationParticipant)
        .filter(
            models.ConversationParticipant.conversation_id == conversation_id,
            models.ConversationParticipant.user_id != current_user.user_id,
        )
        .all()
    )
    for recipient in recipients:
        await manager.send_to_user(recipient.user_id, {
            "message_id": db_message.message_id,
            "conversation_id": db_message.conversation_id,
            "sender_id": db_message.sender_id,
            "content": db_message.content,
            "sent_at": db_message.sent_at.isoformat(),
        })

    return db_message


# remove participant, removes a user from a conversation, checks for valid conversation and user IDs, checks if user is a participant before removing
@router.delete("/{conversation_id}/participants/{user_id}", status_code=204)
def remove_participant(
    conversation_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Remove a user from a conversation"""
    conversation = _require_membership(db, conversation_id, current_user.user_id)

    if conversation.type.upper() == "PRIVATE":
        raise HTTPException(
            status_code=400,
            detail="Private conversations cannot change participants"
        )

    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You can only remove yourself from a conversation"
        )

    participant = db.query(models.ConversationParticipant).filter(
        (models.ConversationParticipant.conversation_id == conversation_id) &
        (models.ConversationParticipant.user_id == user_id)
    ).first()
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    db.delete(participant)
    db.commit()
    return None
