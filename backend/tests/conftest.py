import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
import models
from auth import create_access_token

# use in-memory sqlite for testing, way faster than real db
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# override get_db to use test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    """Get test client with clean database"""
    return TestClient(app)

@pytest.fixture
def test_user(db):
    """Create a test user for tests that need one"""
    user = models.User(
        username="testuser",
        email="test@example.com",
        password_hash="hashedpassword123"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def test_user2(db):
    """Create a second test user for multi-user tests"""
    user = models.User(
        username="testuser2",
        email="test2@example.com",
        password_hash="hashedpassword456"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def test_conversation(db, test_user, test_user2):
    """Create a test conversation with two participants"""
    conversation = models.Conversation(type="private")
    db.add(conversation)
    db.flush()
    
    # add both users as participants
    participant1 = models.ConversationParticipant(
        conversation_id=conversation.conversation_id,
        user_id=test_user.user_id
    )
    participant2 = models.ConversationParticipant(
        conversation_id=conversation.conversation_id,
        user_id=test_user2.user_id
    )
    db.add(participant1)
    db.add(participant2)
    db.commit()
    db.refresh(conversation)
    return conversation


@pytest.fixture
def auth_headers(test_user):
    """Auth headers for test_user"""
    token = create_access_token({"sub": str(test_user.user_id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_user2(test_user2):
    """Auth headers for test_user2"""
    token = create_access_token({"sub": str(test_user2.user_id)})
    return {"Authorization": f"Bearer {token}"}
