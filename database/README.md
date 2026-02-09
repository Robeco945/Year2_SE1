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
