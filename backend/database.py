from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator
import os
from dotenv import load_dotenv

# load .env
load_dotenv()

# get database using environment variable
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://user:password@localhost:3306/fastapi_db"
)

engine_options = {"echo": True}
if DATABASE_URL.startswith("mysql"):
    engine_options["connect_args"] = {"charset": "utf8mb4"}

engine = create_engine(DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
