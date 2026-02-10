# Backend - Messaging Application API

## Installation

1. **Clone the repository and navigate to the backend directory**:

    ```bash
    cd backend
    ```

2. **Create and activate a virtual environment** (recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=mysql+pymysql://root:root@localhost:3306/messaging_app
```

**Environment Variables:**

- `DATABASE_URL`: Database connection string (default: `mysql+pymysql://user:password@localhost:3306/fastapi_db`)
- `SKIP_DB_INIT`: Set to `"1"` to skip automatic database initialization on startup

## Running the Application

### Development Mode

Start the server with hot reload:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Main Endpoints

#### Users (`/api/users`)

- `POST /api/users/` - Create a new user
- `GET /api/users/{user_id}` - Get user by ID
- `GET /api/users/` - List all users
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

#### Conversations (`/api/conversations`)

- `POST /api/conversations/` - Create a new conversation
- `GET /api/conversations/{conversation_id}` - Get conversation by ID
- `GET /api/conversations/user/{user_id}` - Get all conversations for a user

#### Messages (`/api/messages`)

- `POST /api/messages/` - Send a message
- `GET /api/messages/conversation/{conversation_id}` - Get all messages in a conversation
- `GET /api/messages/{message_id}` - Get message by ID

## Testing

Run the test suite:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=. --cov-report=html
```

Run specific test file:

```bash
pytest tests/test_users.py
```

**Test Structure:**

- `tests/test_users.py` - User endpoint tests
- `tests/test_conversations.py` - Conversation endpoint tests
- `tests/test_messages.py` - Message endpoint tests
- `tests/test_database.py` - Database connection tests
- `tests/conftest.py` - Pytest fixtures and configuration

## Database Models

### User

- `user_id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `created_at`

### Conversation

- `conversation_id` (Primary Key)
- `type` (private/group)
- `created_at`

### ConversationParticipant

- `participant_id` (Primary Key)
- `conversation_id` (Foreign Key)
- `user_id` (Foreign Key)
- `joined_at`

### Message

- `message_id` (Primary Key)
- `conversation_id` (Foreign Key)
- `sender_id` (Foreign Key)
- `content`
- `sent_at`

## CORS Configuration

CORS is currently configured for development with permissive settings:

- Allows all origins (`*`)
- Allows all methods
- Allows all headers

**Important**: Tighten CORS settings for production deployment by specifying allowed origins in `main.py`.

## Development Notes

- Database tables are automatically created on application startup (unless `SKIP_DB_INIT=1`)
- Passwords are hashed using bcrypt before storage
- All timestamps use UTC
- Database sessions are automatically managed and closed after each request

## Useful Commands

```bash
# Start development server
uvicorn main:app --reload

# Run tests
pytest

# Run tests with verbose output
pytest -v

# Check Python version
python --version

# List installed packages
pip list

# Format code (if using black)
black .

# Lint code (if using flake8)
flake8 .
```

## Troubleshooting

**Database Connection Issues:**

- Ensure MariaDB is running: `docker-compose ps`
- Check database credentials in `.env`
- Verify database name matches the one in docker-compose.yml

**Import Errors:**

- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Activate virtual environment if using one

**Port Already in Use:**

- Change the port: `uvicorn main:app --port 8001`
- Or kill the process using port 8000
