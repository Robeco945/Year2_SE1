from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class UserResponse(UserBase):
    user_id: int
    created_at: datetime
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None

    class Config:
        from_attributes = True


# Conversation Schemas
class ConversationBase(BaseModel):
    type: str


class ConversationCreate(ConversationBase):
    participant_ids: List[int]


class ConversationResponse(ConversationBase):
    conversation_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ConversationParticipant Schemas
class ConversationParticipantBase(BaseModel):
    conversation_id: int
    user_id: int


class ConversationParticipantResponse(ConversationParticipantBase):
    joined_at: datetime

    class Config:
        from_attributes = True


# Message Schemas
class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    conversation_id: int
    sender_id: int


class MessageUpdate(BaseModel):
    content: Optional[str] = None


class MessageResponse(MessageBase):
    message_id: int
    conversation_id: int
    sender_id: int
    sent_at: datetime

    class Config:
        from_attributes = True


# Detailed response schemas with relationships
class UserWithConversations(UserResponse):
    conversations: List[ConversationParticipantResponse] = []


class ConversationWithParticipants(ConversationResponse):
    participants: List['ConversationParticipantResponse'] = []
    messages: List[MessageResponse] = []


class ConversationParticipantWithDetails(ConversationParticipantResponse):
    user: UserResponse
    conversation: ConversationResponse
