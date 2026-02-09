from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

# conversation types
class ConversationType(str, enum.Enum):
    DIRECT = "direct"
    GROUP = "group"

# user table
class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
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
    __tablename__ = "conversation"

    conversation_id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(ConversationType), default=ConversationType.DIRECT, nullable=False)
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
    __tablename__ = "conversationparticipant"

    conversation_id = Column(
        Integer, ForeignKey("conversation.conversation_id"), primary_key=True
    )
    user_id = Column(Integer, ForeignKey("user.user_id"), primary_key=True)
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # foreign key
    conversation = relationship("Conversation", back_populates="participants")
    user = relationship("User", back_populates="conversations")

    def __repr__(self):
        return f"<ConversationParticipant(conversation_id={self.conversation_id}, user_id={self.user_id})>"

# message table
class Message(Base):
    __tablename__ = "message"

    message_id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversation.conversation_id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)

    # foreign key
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="messages")

    def __repr__(self):
        return f"<Message(message_id={self.message_id}, sender_id={self.sender_id})>"
