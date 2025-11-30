"""
Small helper script to inspect the contents of the database.

Usage (from backend folder):

    python inspect_db.py

It will print all registered users and all tasks stored in the DB.
"""

from app import create_app
from database import db  # not strictly needed, but nice to have if you extend
from models.user import User
from models.task import Task


def show_data() -> None:
    """Print all users and tasks currently stored in the database."""
    app = create_app()

    # Use the Flask application context so SQLAlchemy knows which app/DB to use
    with app.app_context():
        print("=== Users ===")
        users = User.query.all()
        if not users:
            print("No users found.")
        else:
            for user in users:
                print(
                    f"- id={user.id}, username={user.username}, "
                    f"email={user.email}"
                )

        print("\n=== Tasks ===")
        tasks = Task.query.all()
        if not tasks:
            print("No tasks found.")
        else:
            for task in tasks:
                print(
                    f"- id={task.id}, title={task.title!r}, "
                    f"description={task.description!r}, "
                    f"completed={task.completed}, user_id={task.user_id}"
                )


if __name__ == "__main__":
    show_data()
