from database import db

class Task(db.Model):
    """
    Task model representing a user's to-do item

    Each task:
    - Belongs to exactly one user (via user_id foreign key)
    - Has a title and optional description
    - May be marked as completed or not
    """

    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    # Short text describing the task
    title = db.Column(db.String(150), nullable=False)

    # Optional detailed description
    description = db.Column(db.Text, nullable=True)

    # Whether the task is complete; default is False
    completed = db.Column(db.Boolean, default=False, nullable=False)

    # Foreign Key linking the task to the user who created it
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationship back to the User Model
    user = db.relationship("User", back_populates="tasks")

    def __repr__(self) -> str:

        # Debugging
        return f"<Task {self.id}: {self.title} (User {self.user_id})>"
