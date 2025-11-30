from database import db

class User(db.Model):
    """
    User model representing accounts in the system

    Each user:
    - Has a unique email (used for login)
    - Stores a hashed password (never plain text)
    - Can own multiple tasks (one to many relationship)
    """

    __tablename__ = "users"

    
    id = db.Column(db.Integer, primary_key=True) # Unique user ID
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # Hashed password
    password_hash = db.Column(db.String(255), nullable=False)

    # A user can have many tasks
    # back_populates allows Task.user to refer back to this object
    tasks = db.relationship("Task", back_populates="user", lazy="select")

    def __repr__(self) -> str:
       
       # Debugging
       return f"<User {self.id}: {self.email}>"
    