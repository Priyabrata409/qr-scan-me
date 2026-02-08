from sqlmodel import SQLModel, create_engine, Session
from os import getenv

sqlite_url = getenv("DATABASE_URL", "sqlite:///./database.db")

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
