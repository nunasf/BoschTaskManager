from app import create_app
from database import db
from models.user import User
from models.task import Task

def clear_database():
    app = create_app()

    with app.app_context():
        # Delete child rows first (tasks)
        Task.query.delete()
        User.query.delete()

        db.session.commit()
        print("All users and tasks have been deleted.")

if __name__ == "__main__":
    clear_database()
