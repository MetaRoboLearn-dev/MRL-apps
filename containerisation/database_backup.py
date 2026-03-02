import subprocess, re, os, datetime
from dotenv import load_dotenv

def backup_database():
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL not found in .env file")
        return

    protocol, rest = database_url.split("://", 1)
    protocol = protocol.replace("postgresql+psycopg2", "postgresql")
    rest = re.sub(r'@\d{1,3}(?:\.\d{1,3}){3}', '@localhost', rest)
    modified_database_url = f"{protocol}://{rest}"
    
    now = datetime.datetime.now()
    backup_file = f"backups/{now.year}/{now.month:02d}/{now.day:02d}/{now.strftime('%H%M%S')}_backup.sql"
    os.makedirs(os.path.dirname(backup_file), exist_ok=True)
    try:
        subprocess.run(["pg_dump", modified_database_url, "-f", backup_file], check=True)
        print(f"Database backup created successfully at {backup_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error creating database backup: {e}")

if __name__ == "__main__":
    backup_database()

