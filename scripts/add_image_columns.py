import sqlite3
import os

# Database file path
DB_FILE = "database.db"

def add_columns():
    if not os.path.exists(DB_FILE):
        print(f"Error: {DB_FILE} not found.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Add image_data column
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN image_data BLOB")
            print("Added 'image_data' column.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("'image_data' column already exists.")
            else:
                raise e

        # Add image_content_type column
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN image_content_type VARCHAR")
            print("Added 'image_content_type' column.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("'image_content_type' column already exists.")
            else:
                raise e

        conn.commit()
        print("Database schema updated successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_columns()
