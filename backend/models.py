from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

# conversation types
class ConversationType(str, enum.Enum):
    PRIVATE = "PRIVATE"
    GROUP = "GROUP"

    @classmethod
    def _missing_(cls, value):
        """Handle lowercase 'private' or 'group' coming from the DB because there has been an error with lowercase private and group when it is expecting uppercase."""
        if isinstance(value, str):
            for member in cls:
                if member.value.upper() == value.upper():
                    return member
        return super()._missing_(value)

# user table
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # foreign key
    conversations = relationship(
        "ConversationParticipant", back_populates="user", cascade="all, delete-orphan"
    )
    messages = relationship("Message", back_populates="sender", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username})>"

# conversation table
class Conversation(Base):
    __tablename__ = "conversations"

    conversation_id = Column(Integer, primary_key=True, index=True)
# Change the Enum definition to include both cases in the allowed list
    type = Column(
        Enum(ConversationType, name="conversation_type_enum"), 
        default=ConversationType.PRIVATE, 
        nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # foreign key
    participants = relationship(
        "ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan"
    )
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Conversation(conversation_id={self.conversation_id}, type={self.type})>"

# conversation participant table
class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    conversation_id = Column(
        Integer, ForeignKey("conversations.conversation_id"), primary_key=True
    )
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # foreign key
    conversation = relationship("Conversation", back_populates="participants")
    user = relationship("User", back_populates="conversations")

    def __repr__(self):
        return f"<ConversationParticipant(conversation_id={self.conversation_id}, user_id={self.user_id})>"

# message table
class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True, index=True)
    content = Column(String(1000), nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.conversation_id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    # foreign key
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="messages")

    def __repr__(self):
        return f"<Message(message_id={self.message_id}, sender_id={self.sender_id})>"
