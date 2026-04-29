# Sprint 7 Review Report

## Sprint Goal

Ensure the system is fully functional, stable, and aligned with requirements through comprehensive functional and non-functional testing, including test plan creation, user acceptance testing, heuristic evaluation, and documentation updates.

## Review Summary

| Area                          | Status      | Notes                                                                                       |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| Test Plan Creation            | Completed   | Comprehensive test plan covering authentication, conversations, messaging, and localization |
| Final Unit Testing            | Completed   | All core features validated; no regressions after code cleanup                              |
| User Acceptance Testing (UAT) | Completed   | 5 test cases executed; all passed                                                           |
| Heuristic Evaluation          | Completed   | Nielsen evaluation                                                                          |
| Bug Tracking & Documentation  | Completed   | Issues identified and prioritized by severity                                               |
| SonarQube/Jenkins Integration | In Progress | CI/CD pipeline configured; awaiting final quality gate results                              |

---

## Test Plan Outcome

### Scope & Objectives

- Verify messaging application is functional, stable, and meets Product Owner requirements
- Focus on API functionality, user interaction, and system usability
- Validate authentication, conversation management, messaging, and localization

### Test Environment

- **Frontend:** Browser (Chrome)
- **Backend:** FastAPI (localhost:8000)
- **Database:** MariaDB with SQLAlchemy ORM
- **Deployment:** Docker

### Test Types Covered

1. **Functional Testing**
    - Authentication endpoints (/api/auth/register, /api/auth/login)
    - Conversation management (/api/conversations/)
    - Messaging API (/api/messages/)
    - Localization API with fallback behavior

2. **Non-Functional Testing**
    - Usability and UI clarity
    - Localization correctness
    - Basic performance observation

---

## User Acceptance Testing (UAT) Results

### Test Execution Summary

| Test Case                   | Steps | Result   | Notes                                                                     |
| --------------------------- | ----- | -------- | ------------------------------------------------------------------------- |
| User Registration and Login | 4     | **Pass** | Signup, data validation, account creation, and login redirect all working |
| Create Conversation         | 3     | **Pass** | Modal opens, user ID accepted, conversation appears in list               |
| Send and Receive Message    | 4     | **Pass** | Message input, storage, and retrieval functioning correctly               |
| Localization (i18n)         | 3     | **Pass** | Arabic and Japanese language switching; English fallback verified         |
| Invalid Input Handling      | 2     | **Pass** | Error messages displayed for invalid inputs; empty messages rejected      |

**Overall Result:** ✓ **5/5 test cases passed** — System meets functional requirements

---

### Evaluation Notes

- Single evaluator coverage: ~35% of total issues
- Full team (5 evaluators) would achieve ~75% coverage
- Next steps: Debriefing with design team, prioritize severity 3 fixes, implement recommendations, retest

---

## Code Quality & CI/CD Integration

### SonarQube/Jenkins Configuration

- **sonar-project.properties:** Configured for project analysis
- **Target Quality Gate:** Grade A (minimum B acceptable)
- **Focus Areas:** Code duplication, complexity, test coverage

### Quality Metrics (Baseline from Sprint 6)

- Pylint Score: 7.33/10
- Average Complexity: A (1.95)
- Duplicate Code: 8.25%

---

## Technical Documentation Updates

### Documentation Completed

- ✓ Test Plan (detailed in docs/test_plan.md)
- ✓ UAT Report (detailed in docs/uat.md)
- ✓ Heuristic Evaluation Report (Nielsen framework applied)
- ✓ Bug/Issue Tracking (prioritized by severity)

### Documentation Pending

- SonarQube dashboard screenshots (from Jenkins run)
- Updated GitHub README with testing results
- Architecture notes reflecting any changes identified during testing

---

## Contributions

| Name    | Assigned Task                                  | Time Spent (hrs) | In Class Task |
| ------- | ---------------------------------------------- | ---------------- | ------------- |
| Vadim   | Test plan, UAT execution, documentation        | 3h               | Submitted     |
| Iida    | Heuristic evaluation, issue prioritization     | 2h               | Submitted     |
| Roberto | Code quality validation, SonarQube integration | 2h               | Submitted     |

---

### Definition of Done - Met ✓

- ✓ Feature works as expected (confirmed via UAT)
- ✓ Tested (unit/UAT all passed)
- ✓ No critical bugs identified
- ✓ Code quality metrics tracked
- ✓ Documentation updated
