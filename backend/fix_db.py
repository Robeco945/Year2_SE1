from database import SessionLocal
from sqlalchemy import text

def fix_enum_casing():
    db = SessionLocal()
    try:
        print("Updating database values...")
        # Force any lowercase 'private' to uppercase 'PRIVATE'
        db.execute(text("UPDATE conversations SET type = 'PRIVATE' WHERE type = 'private'"))
        db.execute(text("UPDATE conversations SET type = 'GROUP' WHERE type = 'group'"))
        db.commit()
        print("Success! Database values are now uppercase.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_enum_casing()