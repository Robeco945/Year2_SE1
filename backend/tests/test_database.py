"""
Integration tests for MariaDB database connection.
These tests require the actual database to be running.
Run with: pytest tests/test_database.py -v
"""
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database import DATABASE_URL, engine, get_db, Base
import models


class TestDatabaseConnection:
    """Test actual MariaDB database connectivity"""
    
    def test_database_connection(self):
        """Test that we can connect to the MariaDB database"""
        connection = engine.connect()
        result = connection.execute(text("SELECT 1"))
        assert result.fetchone()[0] == 1
        connection.close()
    
    def test_database_version(self):
        """Test MariaDB version query"""
        connection = engine.connect()
        result = connection.execute(text("SELECT VERSION()"))
        version = result.fetchone()[0]
        assert version is not None
        assert "MariaDB" in version or "mysql" in version.lower()
        connection.close()
    
    def test_database_tables_exist(self):
        """Test that required tables exist in the database"""
        connection = engine.connect()
        # Check if users table exists
        result = connection.execute(text(
            "SHOW TABLES LIKE 'users'"
        ))
        tables = result.fetchall()
        assert len(tables) > 0, "users table does not exist"
        connection.close()


class TestDatabaseOperations:
    """Test CRUD operations with MariaDB"""
    
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        """Setup test data before each test and cleanup after"""
        # Setup: Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        yield
        
        # Teardown: Clean up test data
        # Note: Be careful with this in production!
        session = next(get_db())
        try:
            # Delete test users
            session.query(models.User).filter(
                models.User.username.like('test_%')
            ).delete(synchronize_session=False)
            session.commit()
        finally:
            session.close()
    
    def test_create_user(self):
        """Test creating a user in MariaDB"""
        session = next(get_db())
        try:
            user = models.User(
                username="test_db_user",
                email="test_db@example.com",
                password_hash="hashed_password"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            
            assert user.user_id is not None
            assert user.username == "test_db_user"
            assert user.email == "test_db@example.com"
        finally:
            session.close()
    
    def test_read_user(self):
        """Test reading a user from MariaDB"""
        session = next(get_db())
        try:
            # Create user
            user = models.User(
                username="test_read_user",
                email="test_read@example.com",
                password_hash="hashed_password"
            )
            session.add(user)
            session.commit()
            user_id = user.user_id
            
            # Read user
            retrieved_user = session.query(models.User).filter(
                models.User.user_id == user_id
            ).first()
            
            assert retrieved_user is not None
            assert retrieved_user.username == "test_read_user"
            assert retrieved_user.email == "test_read@example.com"
        finally:
            session.close()
    
    def test_update_user(self):
        """Test updating a user in MariaDB"""
        session = next(get_db())
        try:
            # Create user
            user = models.User(
                username="test_update_user",
                email="test_update@example.com",
                password_hash="hashed_password"
            )
            session.add(user)
            session.commit()
            user_id = user.user_id
            
            # Update user
            user.email = "updated@example.com"
            session.commit()
            
            # Verify update
            updated_user = session.query(models.User).filter(
                models.User.user_id == user_id
            ).first()
            assert updated_user.email == "updated@example.com"
        finally:
            session.close()
    
    def test_delete_user(self):
        """Test deleting a user from MariaDB"""
        session = next(get_db())
        try:
            # Create user
            user = models.User(
                username="test_delete_user",
                email="test_delete@example.com",
                password_hash="hashed_password"
            )
            session.add(user)
            session.commit()
            user_id = user.user_id
            
            # Delete user
            session.delete(user)
            session.commit()
            
            # Verify deletion
            deleted_user = session.query(models.User).filter(
                models.User.user_id == user_id
            ).first()
            assert deleted_user is None
        finally:
            session.close()


class TestDatabaseSchema:
    """Test database schema and relationships"""
    
    def test_user_conversation_relationship(self):
        """Test that user-conversation relationship works"""
        session = next(get_db())
        try:
            # Create user
            user = models.User(
                username="test_rel_user",
                email="test_rel@example.com",
                password_hash="hashed_password"
            )
            session.add(user)
            session.commit()
            
            # Create conversation
            conversation = models.Conversation(
                type=models.ConversationType.PRIVATE
            )
            session.add(conversation)
            session.flush()
            
            # Create participant relationship
            participant = models.ConversationParticipant(
                conversation_id=conversation.conversation_id,
                user_id=user.user_id
            )
            session.add(participant)
            session.commit()
            
            # Test relationship
            assert len(user.conversations) > 0
            assert user.conversations[0].conversation_id == conversation.conversation_id
            
            # Cleanup
            session.delete(participant)
            session.delete(conversation)
            session.delete(user)
            session.commit()
        finally:
            session.close()
