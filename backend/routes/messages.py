from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/messages", tags=["messages"])

# message CRUD

# create message, validates sender and conversation exist before creating message
@router.post("/", response_model=schemas.MessageResponse, status_code=201)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    """Create a new message"""
    # check if sender exists
    sender = db.query(models.User).filter(models.User.user_id == message.sender_id).first()
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
    
    # check if conversation exists
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == message.conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db_message = models.Message(
        content=message.content,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# get message by ID, returns 404 if not found
@router.get("/{message_id}", response_model=schemas.MessageResponse)
def get_message(message_id: int, db: Session = Depends(get_db)):
    """Get a message by ID"""
    message = db.query(models.Message).filter(models.Message.message_id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

# list messages with pagination, returns a list of messages based on skip and limit parameters
@router.get("/", response_model=list[schemas.MessageResponse])
def list_messages(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all messages with pagination"""
    messages = db.query(models.Message).offset(skip).limit(limit).all()
    return messages

# get messages by conversation, returns all messages in a specific conversation
@router.get("/conversation/{conversation_id}", response_model=list[schemas.MessageResponse])
def get_messages_by_conversation(conversation_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Get all messages in a conversation"""
    messages = db.query(models.Message).filter(
        models.Message.conversation_id == conversation_id
    ).offset(skip).limit(limit).all()
    return messages

# update message, allows updating message content
@router.put("/{message_id}", response_model=schemas.MessageResponse)
def update_message(message_id: int, message: schemas.MessageUpdate, db: Session = Depends(get_db)):
    """Update a message"""
    db_message = db.query(models.Message).filter(models.Message.message_id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if message.content:
        db_message.content = message.content
    
    db.commit()
    db.refresh(db_message)
    return db_message

# delete message, deletes a message by ID, returns 404 if not found
@router.delete("/{message_id}", status_code=204)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    """Delete a message"""
    db_message = db.query(models.Message).filter(models.Message.message_id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(db_message)
    db.commit()
    return None
