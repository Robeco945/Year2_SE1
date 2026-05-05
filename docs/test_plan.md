# Test Plan – Sprint 7

## 1. Objective
The objective of this test plan is to verify that the Messaging Application is functional, stable, and meets the requirements defined by the Product Owner. The testing focuses on API functionality, user interaction, and system usability.

---

## 2. Scope

### In Scope
- User authentication (register, login)
- Conversation management (create, retrieve)
- Messaging functionality (send, receive)
- Localization system (i18n API)
- Frontend UI interaction

### Out of Scope
- Advanced security testing
- High-load performance testing
- External integrations

---

## 3. Test Types

### Functional Testing
- API endpoint validation:
  - /api/auth/register
  - /api/auth/login
  - /api/conversations/
  - /api/messages/
- Message sending and retrieval
- Conversation creation (private/group)
- Localization API response

### Non-Functional Testing
- Usability (UI clarity, navigation)
- Localization correctness (fallback behavior)
- Basic performance observation

---

## 4. Test Environment

| Component | Value |
|----------|------|
| Frontend | Browser (Chrome) |
| Backend | FastAPI (localhost:8000) |
| Database | MariaDB |
| ORM | SQLAlchemy |
| OS | Windows/Linux |
| Deployment | Docker |

---

## 5. Resources

- Testers: Team members
- Tools:
  - Browser (Chrome)
  - Swagger UI (/docs)
  - Jenkins
  - SonarQube
  - Docker

---

## 6. Test Tasks

### Functional Tasks
- Test authentication endpoints
- Test conversation creation
- Test message sending and retrieval
- Test localization API behavior
- Execute UAT scenarios

### Non-Functional Tasks
- Perform heuristic evaluation
- Verify UI language switching
- Check fallback to English in localization

---

## 7. Entry Criteria
- Backend is running (locally or via Docker)
- Database is initialized
- API endpoints accessible

---

## 8. Exit Criteria
- All critical features work correctly
- No critical bugs remain
- UAT scenarios pass
- System behaves according to requirements

---

## 9. Risks

| Risk | Mitigation |
|------|-----------|
| API errors | Test via Swagger before UI |
| Localization issues | Validate fallback behavior |
| Database inconsistencies | Use seed data |
| Time limits | Focus on core endpoints |