from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config
from database import db
from routes.auth import auth_bp
from routes.tasks import tasks_bp

# -------- Automatic .env creation --------
import secrets
from pathlib import Path

def ensure_env_file():
    """
    Ensures a .env file exists.
    If not, it automatically creates one with random secure keys.
    """
    env_path = Path(__file__).resolve().parent / ".env"

    if not env_path.exists():
        print(".env not found — creating a new one automatically...")

        secret_key = secrets.token_hex(32)
        jwt_secret = secrets.token_hex(32)

        env_data = (
            f"SECRET_KEY={secret_key}\n"
            f"JWT_SECRET_KEY={jwt_secret}\n"
            f"DATABASE_URL=sqlite:///app.db\n"
        )

        env_path.write_text(env_data)
        print(".env file created with secure random keys.")

# Run this BEFORE create_app loads configuration
ensure_env_file()
# ------------------------------------------


def create_app() -> Flask:
    """
    Application factory for the Flask app.

    Responsibilities:
    - Load configuration
    - Initialize extensions (SQLAlchemy, JWT, CORS)
    - Register blueprints
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize SQLAlchemy with the app
    db.init_app(app)

    # Initialize JWT handling
    jwt = JWTManager(app)

    # Enable CORS for the API
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:4200"}},
        supports_credentials=True,
    )

    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok"}), 200

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")

    return app


if __name__ == "__main__":
    flask_app = create_app()
    flask_app.run(host="0.0.0.0", port=500, debug=True)
