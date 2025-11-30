from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from database import db
from models.user import User

# Blueprint for all authentication-related routes
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user:
        {
            "username": "some_name"
            "email": user@example.com
            "password":" plain-text-password"
        }

    This endpoint:
    - Validates the input
    - Checks if the email is already registered
    - Hashes the password before storing it
    """

    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Basic validation of required fields
    if not username or not email or not password:
        return jsonify({"message":"username, email and password are required"}), 400
    
    # Check if a user with this email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message":" A user with this email already exists"}), 400
    
    # Hash the password before storing it in the database
    password_hash = generate_password_hash(password)

    # Create a new user instance
    new_user = User(
        username=username,
        email=email,
        password_hash=password_hash,
    )

    # Persist the new user in the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login endpoint
        {
            "email": "user@example.com"
            "password": "plain-text-password"
        }

    This endpoint:
    - Validates the input
    - Verifies if the user exists and the password is correct
    - Returns a JWT acess token if authentication suceeds
    """

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 400
    
    # Find the user by email
    user = User.query.filter_by(email=email).first()
    if not user:
        # Do not reveal whether the email exists or not
        return jsonify({"message":"Invalid email"}), 401
    
    # Compare the provided password with the stored hashed password
    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid password"}), 401
    
    # Create a JWT with the user ID as the indentity
    # On the frontend, this token will be sent into the Authorization header:
    #   Authotization: Bearer <token>
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "user":{
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    }), 200
