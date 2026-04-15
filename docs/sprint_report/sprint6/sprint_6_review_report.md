# Sprint 6 Review Report

## Sprint Goal
Extend localization into the database layer, perform statistical code review, clean/refactor code, and prepare acceptance readiness.

## Review Summary

| Area | Status | Notes |
| --- | --- | --- |
| Database Localization | Implemented in pulled DB-localization branch | Includes i18n tables, backend retrieval endpoint, locale fallback behavior, and tests |
| Statistical Code Review | Completed | Metrics and evidence captured in Sprint 6 static analysis artifacts |
| Code Clean-Up and Refactoring | Completed | Route-layer refactoring applied and tests pass |
| Acceptance Test Planning | Completed | Documented in /sprint6/acceptance_test_plan.md|


## Database Localization Review

Verified implementation in the pulled DB-localization branch includes:

1. Schema-level multilingual support with UTF-8 configuration:
- `utf8mb4` / `utf8mb4_unicode_ci`
- `i18n_keys` table
- `i18n_translations` table
- unique `(i18n_key_id, locale)` constraint and locale index

2. Backend model support for i18n key/translation entities.

3. Backend API endpoint for localized dictionary retrieval with fallback:
- `GET /api/i18n/translations`
- locale filter
- key filter
- fallback to English for unsupported locale or missing key

4. Automated backend i18n tests covering locale retrieval and fallback scenarios.

## Statistical Code Review Outcome

Reference report: [docs/sprint_report/sprint6/statistical_code_review_report.md](docs/sprint_report/sprint6/statistical_code_review_report.md)

Evidence folder: [docs/sprint_report/sprint6/static_analysis](docs/sprint_report/sprint6/static_analysis)

Key results:
- Pylint score: 7.33/10
- Average complexity: A (1.95)
- Duplicate lines: 8.25% overall

## Code Clean-Up and Refactoring Outcome

Refactoring focused on backend route maintainability and duplication reduction.

Updated files:
- [backend/routes/conversations.py](backend/routes/conversations.py)
- [backend/routes/messages.py](backend/routes/messages.py)
- [backend/routes/users.py](backend/routes/users.py)
- [backend/models.py](backend/models.py)
- [backend/main.py](backend/main.py)

Validation:
- Backend tests: 44 passed
- Frontend tests: 72 passed


## Contribution
|Name|Assigned task|Time spent|In class task|
|---|---|---|---|
|Iida| Database localization | 5 | Submitted
|Roberto | Statistical Code Review & Code clean up | 8 | Submitted
| Vadim | Trello update, diagrams, documentation | 4 | Not submitted |
|||||