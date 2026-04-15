from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class ConversationType(str, enum.Enum):
    PRIVATE = "private"
    GROUP = "group"

    @classmethod
    def _missing_(cls, value):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower() or member.name.lower() == value.lower():
                    return member
        return super()._missing_(value)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(String(500), nullable=True)

    conversations = relationship(
        "ConversationParticipant", back_populates="user", cascade="all, delete-orphan"
    )
    messages = relationship("Message", back_populates="sender", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username})>"

class Conversation(Base):
    __tablename__ = "conversations"

    conversation_id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), default=ConversationType.PRIVATE.value, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    participants = relationship(
        "ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan"
    )
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Conversation(conversation_id={self.conversation_id}, type={self.type})>"

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    conversation_id = Column(
        Integer, ForeignKey("conversations.conversation_id"), primary_key=True
    )
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    conversation = relationship("Conversation", back_populates="participants")
    user = relationship("User", back_populates="conversations")

    def __repr__(self):
        return f"<ConversationParticipant(conversation_id={self.conversation_id}, user_id={self.user_id})>"

class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True, index=True)
    content = Column(String(1000), nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.conversation_id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="messages")

    def __repr__(self):
        return f"<Message(message_id={self.message_id}, sender_id={self.sender_id})>"


class I18nKey(Base):
    __tablename__ = "i18n_keys"

    i18n_key_id = Column(Integer, primary_key=True, index=True)
    key_name = Column(String(255), nullable=False, unique=True, index=True)

    translations = relationship(
        "I18nTranslation", back_populates="key", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<I18nKey(i18n_key_id={self.i18n_key_id}, key_name={self.key_name})>"


class I18nTranslation(Base):
    __tablename__ = "i18n_translations"

    i18n_translation_id = Column(Integer, primary_key=True, index=True)
    i18n_key_id = Column(Integer, ForeignKey("i18n_keys.i18n_key_id"), nullable=False)
    locale = Column(String(10), nullable=False, index=True)
    translation_text = Column(Text, nullable=False)

    key = relationship("I18nKey", back_populates="translations")

    def __repr__(self):
        return (
            f"<I18nTranslation(i18n_translation_id={self.i18n_translation_id}, "
            f"locale={self.locale})>"
        )
