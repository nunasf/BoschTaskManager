from flask_sqlalchemy import SQLAlchemy

"""
Create a single SQLAlchemy database instance
This object will be initialized inside create_app() in app.py
   
     db.init_app(app)
"""

db = SQLAlchemy()
