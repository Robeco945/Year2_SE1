# Database Setup Guide (Docker + MariaDB)

This project uses **Docker** to run a **MariaDB** database locally.  
You do **not** need to install MariaDB manually.

---

## Step 1: Install Docker

Download **Docker Desktop** from the official Docker website for your operating system (Windows or macOS).

- Use the default installer
- Follow the installation instructions
- Restart your computer if required

After installation, open **Docker Desktop** and wait until it shows **“Docker is running”**.

You can verify the installation by running:
```bash
docker --version
```

## Step 2: Clone the Project Repository

Clone the project repository from GitHub:
```bash
git clone <REPOSITORY_URL>
```

Then go into the project folder:
```bash
cd <PROJECT_FOLDER>
```
## Step 3: Start MariaDB with Docker

In the root folder of the project (where docker-compose.yml is located), run:
```bash
docker compose up -d
```

This will:

- download the MariaDB image (first time only)
- start the database in the background

You can check that the database is running with:
```bash
docker ps
```
## Step 4: Create Database Tables

Run the schema file to create tables:
```bash
docker exec -i messaging-db mariadb -u root -proot messaging_app < database/schema.sql
```

If there are no errors, the tables were created successfully.

## Step 5: (Optional) Insert Sample Data

To insert test data, run:
```bash
docker exec -i messaging-db mariadb -u root -proot messaging_app < database/seed.sql
```

This is optional, but recommended for testing.

Step 6: Verify the Database (Optional)

You can connect to the database inside the container:
```bash
docker exec -it messaging-db mariadb -u root -proot 
```
Then run:
```bash
USE messaging_app;
SHOW TABLES;
```

---

## Database Localization (i18n) Implementation

The application now stores UI localization data in the database and serves it from the backend i18n endpoint.

### Localization Strategy

Chosen method: normalized key-value translation tables.

Tables:

* `i18n_keys` - one row per translation key (for example `app.brand`)
* `i18n_translations` - localized value per key and locale (`en`, `ar`, `ja`)

Markdown ERD relationship description:

* `i18n_keys (1) -> (many) i18n_translations`
* `i18n_translations.i18n_key_id` references `i18n_keys.i18n_key_id`
* unique key on `(i18n_key_id, locale)` prevents duplicate translations for same locale/key

### UTF-8 and Locale Configuration

Localization requires full UTF-8 support for Arabic and Japanese text.

Implemented configuration:

* MariaDB server configured with `--character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci`
* schema creates localization tables with explicit `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
* backend DB connection uses MySQL charset `utf8mb4`

### Seeding Translation Data

After creating schema, run seed script to populate sample app data and localization dictionaries:

```bash
docker exec -i messaging-db mariadb -u root -proot messaging_app < database/seed.sql
```

The seed includes localization rows for:

* `en` (English)
* `ar` (Arabic)
* `ja` (Japanese)

### Validation Queries

Check charset/collation settings:

```sql
SHOW VARIABLES LIKE 'character_set_%';
SHOW VARIABLES LIKE 'collation_%';
```

Check localization row counts:

```sql
SELECT locale, COUNT(*) AS translation_count
FROM i18n_translations
GROUP BY locale;
```

Preview a few translations:

```sql
SELECT k.key_name, t.locale, t.translation_text
FROM i18n_translations t
JOIN i18n_keys k ON k.i18n_key_id = t.i18n_key_id
WHERE k.key_name IN ('app.brand', 'auth.signIn', 'message.send')
ORDER BY k.key_name, t.locale;
```
