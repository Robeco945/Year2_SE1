# Messaging Application

## Overview

The **Messaging Application** is a web-based chat system that allows users to communicate through private or group conversations. The application provides features such as user authentication, conversation management, and real-time message exchange.

The system is built using a modern backend architecture with **FastAPI**, **MariaDB**, and **Docker**, and follows a modular structure for scalability and maintainability.

---

## Features

* User registration and login
* Create private or group conversations
* Send and receive messages
* Message storage in a relational database
* Containerized deployment using Docker

---

## System Architecture

The application follows a layered architecture:

* **Frontend (Client UI)** – Handles user interaction
* **Backend (FastAPI)** – Processes API requests and business logic
* **Database (MariaDB)** – Stores users, conversations, and messages
* **Docker** – Containerized environment for deployment

---

## Technologies Used

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| FastAPI            | Backend API framework       |
| Python             | Core programming language   |
| MariaDB            | Relational database         |
| SQLAlchemy         | ORM for database operations |
| Docker             | Containerization            |
| Git & GitHub       | Version control             |
| Jenkins            | CI/CD automation            |

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
│   ├── Dockerfile
│   └── nginx.conf
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
git clone https://github.com/yourusername/messaging-app.git
cd messaging-app
```

### 2. Install Dependencies

```bash
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

* FastAPI backend
* MariaDB database

---

## API Endpoints

### User Authentication

| Method | Endpoint  | Description     |
| ------ | --------- | --------------- |
| POST   | /register | Create new user |
| POST   | /login    | User login      |

### Conversations

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | /conversations | Create conversation    |
| GET    | /conversations | Retrieve conversations |

### Messages

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| POST   | /messages | Send message      |
| GET    | /messages | Retrieve messages |

---

## UML Diagrams

The system design includes the following diagrams:

* ER Diagram
* Use Case Diagram
* Class Diagram
* Activity Diagram

These diagrams illustrate the structure and interactions between the system components.

---

## Future Improvements

* Real-time messaging using WebSockets
* Message notifications
* File sharing support
* User profile management
* Mobile-friendly frontend


 
