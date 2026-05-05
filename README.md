# Metro Messenger

## 1. Project Title & Overview

**Metro Messenger** is a web-based real-time messaging application that enables users to communicate through private and group conversations. The system addresses the need for a full-stack, production-grade chat platform built from the ground up as a structured academic engineering project.

**Target users** are general end-users who require a straightforward messaging interface, as well as engineering course assessors evaluating a complete software-development lifecycle.

The application is built with **FastAPI** (Python) on the backend, **React + Vite** on the frontend, **MariaDB** as the relational database, **Docker** for containerisation, **Jenkins** for CI/CD automation, and **SonarQube** for static-code quality analysis. The project spanned **8 sprints × 2 weeks** (approximately 16 weeks total), following an Agile/Scrum methodology.

---

## 2. Product Vision

### Vision Statement

> *To provide a clean, localised, and maintainable web messaging platform that demonstrates the full engineering lifecycle — from planning through containerised deployment and quality assurance.*

### Main Goals

- Deliver a functional private and group chat system backed by a relational database.
- Apply Agile/Scrum practices across all 8 sprints with traceable planning and review artefacts.
- Automate testing, coverage reporting, and code-quality analysis through a CI/CD pipeline.
- Internationalise the application at both the UI and database layers.

### Key Features

- User registration, login, and JWT-based authentication
- Private and group conversation creation and management
- Real-time message delivery via WebSockets
- UI language selector supporting English, Arabic (RTL), and Japanese
- Database-level i18n via `i18n_keys` / `i18n_translations` tables with locale fallback
- Containerised deployment (Docker Compose)
- Automated CI/CD with Jenkins (build → test → coverage → SonarQube → Docker Hub push)
- SonarQube static-analysis dashboard

### Definition of Success

The project is considered complete when: all API endpoints are functional and covered by automated tests, the application runs end-to-end inside Docker containers, the Jenkins pipeline passes all stages, and the SonarQube quality gate is green.

---

## 3. Project Plan & Sprint Structure

### Development Methodology

The team followed **Agile/Scrum** with two-week sprints. Backlog management was handled in **Trello**; version control and artefact storage in **GitHub**.

### Sprint Length

**2 weeks per sprint.**

### Sprint Overview

| Sprint | Focus |
|--------|-------|
| 1 | Project planning, team formation, product vision, backlog creation |
| 2 | Database design (ERD), backend integration, Docker, initial unit tests |
| 3 | Full-stack prototype, authentication, Jenkins CI/CD, UI screens |
| 4 | Docker containerisation of all services, Docker Hub publishing |
| 5 | UI localisation (EN / AR / JA) and RTL layout support |
| 6 | Database localisation (i18n schema), code refactoring, SonarQube |
| 7 | Quality assurance — SonarQube metrics, acceptance testing, static analysis |
| 8 | Final documentation, API docs, architecture diagram, project finalisation |

---

## 4. Sprint 1 – Project Planning & Vision

📄 [Sprint 1 Planning Report](docs/sprint_report/sprint1/Sprint_1_Planning_Report.md) | [Sprint 1 Review Report](docs/sprint_report/sprint1/Sprint_1_Review_Report.md)

Sprint 1 established the project foundations: team formation, topic selection (web-based messaging application), and the creation of two core planning documents.

- **Project Plan** — objectives, scope, deliverables, sprint timeline, risk register, testing strategy.  
  → [Project Plan PDF](docs/sprint_report/Project%20Plan-Group%204%20(1).pdf)
- **Product Vision** — problem statement, target users, value proposition, and feature list.  
  → [Product Vision PDF](docs/sprint_report/Product%20Vision-Group%204%20(1).pdf)
- **Backlog creation** — initial user stories written and prioritised in Trello.
- **Use Case Diagram** produced and added to the repository.  
  → [Use Case Diagram](docs/diagrams/use%20case%20diagram.png)
- **Risk & scope definition** documented in the Project Plan.
- **Technology stack** selected: FastAPI · Python · MariaDB · React/Vite · Docker · Jenkins.

---

## 5. Sprint 2 – Requirements & Database

📄 [Sprint 2 Planning Report](docs/sprint_report/sprint2/sprint2_planning) | [Sprint 2 Review Report](docs/sprint_report/sprint2/sprint2_review)

### Functional Requirements Summary

The system must allow users to register and log in, create private or group conversations, and send/receive messages stored persistently in a relational database.

### Diagrams

| Diagram | Link |
|---------|------|
| ER Diagram | [Messaging App – ER Diagram](docs/diagrams/Messaging%20App%20–%20ER%20Diagram.drawio.png) |
| Use Case Diagram | [Use Case Diagram](docs/diagrams/use%20case%20diagram.png) |
| Class Diagram | [Class Diagram](docs/diagrams/class%20diagram.png) |
| Activity Diagram | [Activity Diagram](docs/diagrams/activity%20diagram.png) |

### Database Technology

**MariaDB 11**, managed via SQLAlchemy ORM, running in a Docker container.

### Database Implementation Overview

Tables: `users`, `conversations`, `conversation_participants`, `messages`, `i18n_keys`, `i18n_translations`. Schema initialised automatically by SQLAlchemy on startup; seed data provided in `database/seed.sql`.

### Unit Testing Strategy

Backend tests written with **pytest** + **pytest-cov**. Frontend tests written with **Jest**. Coverage reports generated in both XML (for SonarQube) and HTML (for human review).

---

## 6. Sprint 3 – UI Implementation & CI

📄 [Sprint 3 Planning / Review Report](docs/sprint_report/sprint3/Sprint_3_Review_Report.md)

### UI Framework

**React 18 + Vite** with plain CSS. Component-based architecture with reusable components (`ConversationList`, `MessageView`, `ProfileSettings`).

### Screens Implemented

- Login Page
- Sign-up Page
- Main chat view (conversation list + message panel)
- Profile settings

### Code Coverage Goals & Tools

| Tool | Target |
|------|--------|
| pytest-cov (backend) | ≥ 70 % |
| Jest (frontend) | ≥ 70 % |

### Jenkins Pipeline

The `Jenkinsfile` at the repository root defines the following stages:

| Stage | Description |
|-------|-------------|
| Checkout | Clone the repository |
| Start Environment | `docker-compose up -d --build` |
| Run Tests | `pytest --cov` (backend) + `npm run test:coverage` (frontend) |
| Collect Coverage | Copy HTML/XML coverage reports from containers |
| Archive Coverage | Archive artefacts in Jenkins |
| SonarQube Analysis | Run sonar-scanner container against local SonarQube |
| Quality Gate | Poll SonarQube API; fail build if gate is not OK |
| Build Docker Image | Build tagged image |
| Push to Docker Hub | Login and push `year2_se1:latest` |

---

## 7. Sprint 4 – Docker Containerisation

### Purpose of Docker

Docker provides a reproducible, environment-agnostic deployment that eliminates "works on my machine" issues and allows the full stack to be started with a single command.

### Services Containerised

| Service | Image | Port |
|---------|-------|------|
| FastAPI backend | Custom (`./Dockerfile`) | 8000 |
| React frontend (Nginx) | Custom (`./frontend/Dockerfile`) | 3000 |
| MariaDB database | `mariadb:11` | 3306 |
| SonarQube server | `sonarqube:lts-community` | 9000 |
| SonarQube DB | `postgres:16` | — |
| SonarQube scanner | `sonarsource/sonar-scanner-cli` | — (analysis profile) |

### Dockerfile & Compose Overview

- **`./Dockerfile`** — multi-stage build for the FastAPI backend; installs Python dependencies and runs `uvicorn`.
- **`./frontend/Dockerfile`** — builds the React app with `npm run build` and serves it via Nginx.
- **`docker-compose.yml`** — orchestrates all services with health checks, named volumes, and dependency ordering.

### Usage in Development / Testing

During development the full stack is started with `docker compose up --build`. The Jenkins pipeline uses the same compose file to spin up a clean environment for every build, run tests, collect coverage, and then tear everything down with `docker-compose down -v`.

---

## 8. Sprint 5 – UI Localisation

📄 [Sprint 5 Planning](docs/sprint_report/sprint5/sprint_5_planning.md) | [Sprint 5 Review](docs/sprint_report/sprint5/sprint_5_report.md)

### Supported Languages

| Language | Code | Script direction |
|----------|------|-----------------|
| English | `en` | LTR |
| Arabic | `ar` | RTL |
| Japanese | `ja` | LTR |

### Localisation Approach

All user-facing strings were externalised from components into a central locale file (`frontend/src/i18n/locales.js`). A React Context (`LocalizationContext.jsx`) exposes the current locale and a `t()` translation helper to all components. A language selector in the UI updates the context at runtime without a page reload. RTL layouts are handled via a `dir="rtl"` attribute on the root element and mirrored CSS.

> **Note:** Kubernetes was not applied during this sprint. The localisation architecture is designed to support additional languages without structural changes.

---

## 9. Sprint 6 – Database Localisation

📄 [Sprint 6 Planning](docs/sprint_report/sprint6/sprint_6_plan) | [Sprint 6 Review](docs/sprint_report/sprint6/sprint_6_review_report.md)

### Language-Specific Data Handling

Two new tables were introduced to the MariaDB schema:

- **`i18n_keys`** — stores a canonical key identifier for each translatable string.
- **`i18n_translations`** — stores translations keyed by `(i18n_key_id, locale)` with a unique constraint and a locale index.

The database uses `utf8mb4` / `utf8mb4_unicode_ci` collation to support all three target scripts.

### Backend API Endpoint

`GET /api/i18n/translations` — accepts `lang` and optional `key` query parameters; falls back to English for unsupported locales or missing keys.

### Validation Approach

Automated backend tests cover locale retrieval, fallback behaviour for unsupported locales (returns HTTP 200 with English payload), and missing-key scenarios. All 44 backend tests and 72 frontend tests passed after the schema migration.

---

## 10. Sprint 7 – Quality Assurance

📄 [Statistical Code Review Report](docs/sprint_report/sprint6/statistical_code_review_report.md) | [Acceptance Test Plan](docs/sprint_report/sprint6/Acceptance_Test_Planning.md)

### SonarQube Usage & Metrics

SonarQube Community Edition is part of the Docker Compose stack (`http://localhost:9000`, project key `year2-se1`). The Jenkins pipeline runs the scanner and enforces the quality gate on every build.

![SonarQube Dashboard](docs/sprint_report/sprint6/MetroMessengerSonarQubeAnalysis.png)

### Code Quality Goals

| Metric | Result |
|--------|--------|
| Pylint score | 7.33 / 10 |
| Average cyclomatic complexity (Radon) | A (1.95) |
| Duplicate lines (overall, JSCPD) | 8.25 % |
| Dead/unreachable code (Vulture ≥ 80 % confidence) | None found |

### Static Analysis Tools Used

Pylint · Radon · Lizard · JSCPD · Vulture

Raw outputs are in [`docs/sprint_report/sprint6/static_analysis/`](docs/sprint_report/sprint6/static_analysis/).

### Functional & Non-Functional Testing

**Functional** — 44 pytest (backend) + 72 Jest (frontend) automated tests covering authentication, CRUD operations, WebSocket connectivity, and i18n endpoints.

**Acceptance testing** — defined in the [Acceptance Test Plan](docs/sprint_report/sprint6/Acceptance_Test_Planning.md), covering four requirements (localisation integration, UI/UX continuity, refactoring regression, and performance baseline).

> **Note:** JMeter performance testing was not conducted during this project.

---

## 11. Sprint 8 – Documentation & Finalisation

Sprint 8 was dedicated to consolidating all documentation, completing the README, and verifying that the full pipeline runs end-to-end.

### Technical Documentation

- Source code is documented with inline comments and docstrings throughout the backend.
- Diagrams (ER, Use Case, Class, Activity) are maintained in [`docs/diagrams/`](docs/diagrams/).
- Sprint planning and review reports are archived in [`docs/sprint_report/`](docs/sprint_report/).

### User Documentation

This README serves as the primary user-facing guide. The FastAPI automatic documentation (Swagger UI) provides interactive API documentation at runtime.

### API Documentation

FastAPI generates OpenAPI documentation automatically:

| URL | Description |
|-----|-------------|
| `http://localhost:8000/docs` | Swagger UI — interactive API explorer |
| `http://localhost:8000/openapi.json` | Raw OpenAPI specification |

Core endpoint groups: `/api/auth` · `/api/users` · `/api/conversations` · `/api/messages` · `/api/i18n`

### Final System Architecture

```
Browser (React/Vite)
        │  HTTP/REST + WebSocket
        ▼
FastAPI Backend (Python 3.12)
        │  SQLAlchemy ORM
        ▼
MariaDB 11 ──── i18n tables (utf8mb4)
```

All three tiers run as Docker containers orchestrated by Docker Compose. Jenkins automates the build, test, and push lifecycle; SonarQube enforces the quality gate.

---

## 12. How to Run the Project

### Prerequisites

- Docker ≥ 24 and Docker Compose V2
- Git

> On Linux, SonarQube requires a higher virtual-memory limit. Run once before starting the stack:
> ```bash
> sudo sysctl -w vm.max_map_count=262144
> ```

### Environment Setup

```bash
git clone <repository-url>
cd Year2_SE1
```

Copy the backend environment template and adjust if needed:

```bash
cp backend/.env\ copy.example backend/.env
```

### Start the Full Stack

```bash
docker compose up --build
```

This starts the backend, frontend, MariaDB, SonarQube DB, and SonarQube server.

### Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| SonarQube | http://localhost:9000 |

### Run SonarQube Analysis

```bash
./scripts/run-sonar-analysis.sh
```

Optionally provide your own token:

```bash
export SONAR_TOKEN=your-token-here
./scripts/run-sonar-analysis.sh
```

### Stop and Clean Up

```bash
docker compose down -v
```

---

## 13. Testing Instructions

### Run Backend Unit Tests

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest
```

### Run Backend Tests with Coverage

```bash
pytest --cov=. --cov-report=html --cov-report=xml
```

HTML report: `backend/htmlcov/index.html`

### Run Frontend Unit Tests

```bash
cd frontend
npm install
npm test
```

### Run Frontend Tests with Coverage

```bash
npm run test:coverage
```

HTML report: `frontend/coverage/index.html`

### Run All Tests via Docker

```bash
docker compose up -d --build
docker compose exec backend pytest --cov=. --cov-report=html
docker compose exec frontend npm run test:coverage
```

> **Performance testing:** No JMeter test suite was implemented. The Acceptance Test Plan includes a manual performance test case (TC-P01) targeting the `/api/i18n/translations` endpoint at 50 concurrent users with a 200 ms P95 target.

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

## 14. Repository Structure

```
Year2_SE1/
├── backend/                  # FastAPI application
│   ├── routes/               # API route handlers (auth, users, conversations, messages)
│   ├── tests/                # pytest test suite
│   ├── main.py               # App entry point and WebSocket endpoint
│   ├── models.py             # SQLAlchemy ORM models
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── database.py           # Database engine and session setup
│   ├── auth.py               # JWT authentication helpers
│   ├── websocket_manager.py  # WebSocket connection manager
│   └── requirements.txt
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # LoginPage, SignupPage
│   │   ├── i18n/             # Localisation context and locale strings
│   │   └── services/         # API service calls
│   ├── nginx.conf            # Nginx config for production container
│   ├── Dockerfile
│   └── package.json
├── database/                 # SQL schema and seed data
│   ├── schema.sql
│   └── seed.sql
├── docs/                     # Project documentation
│   ├── diagrams/             # ER, Use Case, Class, Activity diagrams
│   └── sprint_report/        # Sprint planning and review reports (sprints 1–8)
├── jenkins/                  # Jenkins configuration
├── scripts/                  # Helper scripts (run-sonar-analysis.sh)
├── Dockerfile                # Backend production Dockerfile
├── Jenkinsfile               # Jenkins declarative pipeline
├── docker-compose.yml        # Full-stack Docker Compose configuration
└── sonar-project.properties  # SonarQube project settings
```

---

## 15. Authors

| Name | Role |
|------|------|
| Roberto Caretto | Frontend development, UI design, CI/CD, code review, code coverage |
| Iida Saarinen | Backend API, database localisation, testing, testing |
| Vadim Kotukhov | Database design, backend integration, backlog management, docker deployment |

**Course:** Software Engineering 2 (Year 2)  
**Semester:** Spring 2026
