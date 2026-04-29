# Test Plan – Sprint 7

## 1. Objective
The objective of this test plan is to verify that the system is functional, stable, and meets the requirements defined by the Product Owner. It includes both functional and non-functional testing.

---

## 2. Scope

### In Scope
- User authentication (sign up / login)
- Messaging functionality
- Conversation creation
- UI behavior

### Out of Scope
- Third-party integrations (if any)
- Advanced security testing (optional)

---

## 3. Test Types

### Functional Testing
- Verify core features:
  - Sign up
  - Login
  - Start conversation
  - Send message

### Non-Functional Testing
- Usability (Heuristic Evaluation)
- Basic performance observation (manual)

---

## 4. Test Environment

| Component | Value |
|----------|------|
| Frontend | Web browser (Chrome) |
| Backend | Local server |
| Database | [Your DB, e.g., MySQL] |
| OS | Windows / Linux |
| Deployment | Docker |

---

## 5. Resources

- Testers: Team members
- Tools:
  - Browser (Chrome)
  - Jenkins
  - SonarQube
  - Trello

---

## 6. Test Tasks

### Functional Tasks
- Execute unit tests
- Perform UAT scenarios
- Identify and log bugs

### Non-Functional Tasks
- Perform heuristic evaluation
- Review UI usability

---

## 7. Entry Criteria
- Application is deployed
- Core features implemented
- No blocking errors

---

## 8. Exit Criteria
- All critical bugs resolved
- UAT completed successfully
- System behaves as expected

---

## 9. Risks

| Risk | Mitigation |
|------|-----------|
| Missing test coverage | Focus on core features |
| Time limitations | Prioritize critical tests |
| Environment issues | Use local stable setup |
