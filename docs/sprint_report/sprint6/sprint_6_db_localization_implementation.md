# Sprint 6: Database Localization Implementation Report

## Goal
Move app-owned UI localization from frontend-only static dictionaries to a database-backed i18n model with backend retrieval, UTF-8 safety, and fallback behavior.

## Implemented Scope
- Included: database-backed localization for app UI text.
- Excluded: translation of user-generated content (messages, usernames, bios).
- Supported locales: `en`, `ar`, `ja`.

## Localization Method
Chosen method: normalized key-value tables.

- `i18n_keys`: stores stable translation key names.
- `i18n_translations`: stores translated values per locale.

Why this method:
- adding new language does not require schema changes
- simple key-based retrieval
- easy per-key fallback to English

## Markdown ERD Explanation
- `i18n_keys (1) -> (many) i18n_translations`
- Foreign key: `i18n_translations.i18n_key_id -> i18n_keys.i18n_key_id`
- Unique constraint: `(i18n_key_id, locale)`
- Index: locale index for fast retrieval by language

## UTF-8 and Locale Configuration
- MariaDB server configured with `utf8mb4` and `utf8mb4_unicode_ci`.
- Tables explicitly created with `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.
- Backend MySQL connections configured with `charset=utf8mb4`.

## Backend Implementation
- Added i18n models for key and translation tables.
- Added endpoint: `GET /api/i18n/translations`.
- Query options:
  - `locale` (defaults to `en`)
  - `keys` (optional repeated query key filter)
- Fallback behavior:
  - unsupported locale falls back to `en`
  - missing key in target locale falls back to `en` key

## Frontend Integration
- Localization provider now fetches dictionary data from backend on load and language change.
- Static dictionaries remain as fallback when API is unavailable.
- Existing language direction handling (`ltr`/`rtl`) remains unchanged.

## Seed and Data Handling
- Seed script now populates i18n keys and translations for `en`, `ar`, `ja`.
- Translation data generated from current frontend key set to prevent key drift.

## Validation Results
Backend i18n tests:
- locale retrieval works for `en`, `ar`, `ja`
- per-key fallback to English works
- unsupported locale fallback works
- key filtering works

Frontend targeted tests:
- provider uses DB translation when available
- provider falls back to static translation when API call fails

## Notes
- Full backend suite in this environment includes pre-existing DB credential-dependent tests unrelated to this change.
- New i18n tests pass in isolation.
