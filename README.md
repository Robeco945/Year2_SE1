# Messaging Application

## Overview

The **Messaging Application** is a web-based chat system that allows users to communicate through private or group conversations. The application provides features such as user authentication, conversation management, and real-time message exchange.

The system is built using a modern backend architecture with **FastAPI**, **MariaDB**, and **Docker**, and follows a modular structure for scalability and maintainability.

---

## Features

- User registration and login
- UI language selector with localization support (English, Arabic, Japanese)
- Database-backed UI translations loaded through the backend i18n API
- Create private or group conversations
- Send and receive messages
- Message storage in a relational database
- Containerized deployment using Docker

---

## System Architecture

The application follows a layered architecture:

- **Frontend (Client UI)** – Handles user interaction
- **Backend (FastAPI)** – Processes API requests and business logic
- **Database (MariaDB)** – Stores users, conversations, and messages
- **Docker** – Containerized environment for deployment

---

## Technologies Used

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| FastAPI      | Backend API framework       |
| Python       | Core programming language   |
| MariaDB      | Relational database         |
| SQLAlchemy   | ORM for database operations |
| Docker       | Containerization            |
| Git & GitHub | Version control             |
| Jenkins      | CI/CD automation            |

---

## Project Structure

```
project/
├── backend/
│   ├── routes/          # API endpoints (auth, users, messages, conversations)
│   ├── tests/           # pytest test files
│   ├── main.py          # FastAPI app entry point
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── database.py      # Database connection setup
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # ConversationList, MessageView, ProfileSettings
│   │   ├── pages/       # LoginPage, SignupPage
│   │   └── services/    # API calls
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/                # Diagrams and sprint reports
├── Dockerfile           # Backend Dockerfile
├── Jenkinsfile
└── docker-compose.yml
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Year2_SE1
```

### 2. Install Dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the Application

```bash
uvicorn main:app --reload
```

The API will be available at:

```
http://localhost:8000
```

Swagger documentation:

```
http://localhost:8000/docs
```

---

## Running with Docker

Build and start the containers:

```bash
docker compose up --build
```

This will start:

- FastAPI backend
- MariaDB database

---

## API Endpoints

### User Authentication

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/auth/register | Create new user account |
| POST   | /api/auth/login    | User login              |

### Conversations

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | /api/conversations/ | Create conversation    |
| GET    | /api/conversations/ | Retrieve conversations |

### Messages

| Method | Endpoint                                      | Description                       |
| ------ | --------------------------------------------- | --------------------------------- |
| POST   | /api/messages/                                | Send message                      |
| GET    | /api/messages/                                | Retrieve messages                 |
| POST   | /api/conversations/{conversation_id}/messages | Send message in a conversation    |
| GET    | /api/conversations/{conversation_id}/messages | Retrieve messages in conversation |

### Localization (i18n)

| Method | Endpoint               | Description                                            |
| ------ | ---------------------- | ------------------------------------------------------ |
| GET    | /api/i18n/translations | Return localized UI dictionary for `en`, `ar`, or `ja` |

Query parameters:

- `locale` (optional): requested locale, defaults to `en`
- `keys` (optional, repeatable): filter response to specific translation keys

Fallback behavior:

- The endpoint applies fallback to English (`en`) for missing key.
- Unsupported locales automatically fall back to `en`.

Scope note:

- This localization model applies to app-owned UI text only.
- User-generated content (messages, usernames, bios) is not translated.

## Database Localization Method

The project uses a normalized key-value translation schema:

- `i18n_keys` stores stable key names like `app.brand` or `auth.signIn`
- `i18n_translations` stores localized values per key and locale

Why this approach:

- avoids schema changes when adding new languages
- supports per-key fallback to English
- keeps retrieval simple and index-friendly

Markdown ERD relationship explanation:

- one `i18n_keys` row can have many `i18n_translations`
- `i18n_translations.i18n_key_id` is a foreign key to `i18n_keys.i18n_key_id`
- uniqueness is enforced for `(i18n_key_id, locale)`

Encoding and locale configuration:

- MariaDB server runs with `utf8mb4` / `utf8mb4_unicode_ci`
- localization tables are created with explicit `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
- backend MySQL connections use `charset=utf8mb4`

Implementation report:

- `docs/sprint_report/sprint6/sprint_6_db_localization_implementation.md`

---

## UML Diagrams

The system design includes the following diagrams:

- ER Diagram
- Use Case Diagram
- Class Diagram
- Activity Diagram

These diagrams illustrate the structure and interactions between the system components.

---

## Future Improvements

- Add more supported languages/locales
- Typing indicators and read receipts
- Message notifications
- File sharing support
- User profile management
- Mobile-friendly frontend
