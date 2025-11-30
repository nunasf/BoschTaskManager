"""
Helper script to initialize the database.
Run this file manually to create the initial app.db.
"""

from app import create_app
from database import db

# Import models so SQLAlchemy knows they exist
from models.user import User
from models.task import Task   # if you have Task model

def init_db():
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Database initialized with tables: users, tasks.")

if __name__ == "__main__":
    init_db()
