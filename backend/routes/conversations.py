from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/api/conversations", tags=["conversations"])

# conversation CRUD
@router.post("/", response_model=schemas.ConversationResponse, status_code=201)

# create conversation, checks for valid participant IDs, creates conversation and adds participants
def create_conversation(conv: schemas.ConversationCreate, db: Session = Depends(get_db)):
    """Create a new conversation"""
    db_conversation = models.Conversation(
    	type=models.ConversationType(conv.type)
    )
    db.add(db_conversation)
    db.flush()  # get the conversation_id without committing
    
    # add participants
    for user_id in conv.participant_ids:
        user = db.query(models.User).filter(models.User.user_id == user_id).first()
        if not user:
            db.rollback()
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        
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
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Get a conversation by ID"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

# list conversations with pagination, returns a list of conversations based on skip and limit parameters
@router.get("/", response_model=list[schemas.ConversationResponse])
def list_conversations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all conversations with pagination"""
    conversations = db.query(models.Conversation).offset(skip).limit(limit).all()
    return conversations

# delete conversation, deletes a conversation by ID, returns 404 if not found
@router.delete("/{conversation_id}", status_code=204)
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Delete a conversation"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(conversation)
    db.commit()
    return None

# get all participants in a conversation, returns 404 if conversation not found or no participants found
@router.get("/{conversation_id}/participants", response_model=list[schemas.ConversationParticipantResponse])
def get_conversation_participants(conversation_id: int, db: Session = Depends(get_db)):
    """Get all participants in a conversation"""
    participants = db.query(models.ConversationParticipant).filter(
        models.ConversationParticipant.conversation_id == conversation_id
    ).all()
    if not participants:
        raise HTTPException(status_code=404, detail="No participants found")
    return participants

# add participant, adds a user to a conversation, checks for valid conversation and user IDs, checks if user is already a participant before adding
@router.post("/{conversation_id}/participants/{user_id}", status_code=201)
def add_participant(conversation_id: int, user_id: int, db: Session = Depends(get_db)):
    """Add a user to a conversation"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing = db.query(models.ConversationParticipant).filter(
        (models.ConversationParticipant.conversation_id == conversation_id) &
        (models.ConversationParticipant.user_id == user_id)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="User already in conversation")
    
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
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

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
def send_conversation_message(
    conversation_id: int,
    body: schemas.MessageBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Send a message in a conversation (sender is the authenticated user)"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.conversation_id == conversation_id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db_message = models.Message(
        content=body.content,
        conversation_id=conversation_id,
        sender_id=current_user.user_id,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


# remove participant, removes a user from a conversation, checks for valid conversation and user IDs, checks if user is a participant before removing
@router.delete("/{conversation_id}/participants/{user_id}", status_code=204)
def remove_participant(conversation_id: int, user_id: int, db: Session = Depends(get_db)):
    """Remove a user from a conversation"""
    participant = db.query(models.ConversationParticipant).filter(
        (models.ConversationParticipant.conversation_id == conversation_id) &
        (models.ConversationParticipant.user_id == user_id)
    ).first()
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    db.delete(participant)
    db.commit()
    return None
