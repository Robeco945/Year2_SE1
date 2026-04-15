from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user
from routes.conversations import _require_membership

router = APIRouter(prefix="/api/messages", tags=["messages"])

@router.post("/", response_model=schemas.MessageResponse, status_code=201)
def create_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new message"""
    if message.sender_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="sender_id must match the authenticated user")

    _require_membership(db, message.conversation_id, current_user.user_id)
    
    db_message = models.Message(
        content=message.content,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/{message_id}", response_model=schemas.MessageResponse)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get a message by ID"""
    message = db.query(models.Message).filter(models.Message.message_id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    _require_membership(db, message.conversation_id, current_user.user_id)
    return message

@router.get("/", response_model=list[schemas.MessageResponse])
def list_messages(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List messages from conversations the authenticated user participates in"""
    messages = (
        db.query(models.Message)
        .join(
            models.ConversationParticipant,
            models.ConversationParticipant.conversation_id == models.Message.conversation_id,
        )
        .filter(models.ConversationParticipant.user_id == current_user.user_id)
        .order_by(models.Message.sent_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return messages

@router.get("/conversation/{conversation_id}", response_model=list[schemas.MessageResponse])
def get_messages_by_conversation(
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

@router.put("/{message_id}", response_model=schemas.MessageResponse)
def update_message(
    message_id: int,
    message: schemas.MessageUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a message"""
    db_message = db.query(models.Message).filter(models.Message.message_id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")

    _require_membership(db, db_message.conversation_id, current_user.user_id)

    if db_message.sender_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Only the sender can update this message")
    
    if message.content:
        db_message.content = message.content
    
    db.commit()
    db.refresh(db_message)
    return db_message

@router.delete("/{message_id}", status_code=204)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a message"""
    db_message = db.query(models.Message).filter(models.Message.message_id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")

    _require_membership(db, db_message.conversation_id, current_user.user_id)

    if db_message.sender_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Only the sender can delete this message")
    
    db.delete(db_message)
    db.commit()
