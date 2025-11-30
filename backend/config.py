import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv

# Base folder of backend
BASE_DIR = Path(__file__).resolve().parent

# Load .env if available
ENV_PATH = BASE_DIR / ".env"
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)


class BaseConfig:
    """
    Base configuration used for both development and production.
    Safe for publishing to GitHub — real secrets must be stored in .env.
    """

    # SECURITY WARNING:
    # These fallback values are intentionally marked as unsafe.
    # They MUST be overridden in production using environment variables.
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "UNSAFE-DEFAULT-DO-NOT-USE-IN-PRODUCTION"
    )

    JWT_SECRET_KEY = os.environ.get(
        "JWT_SECRET_KEY",
        "UNSAFE-DEFAULT-DO-NOT-USE-IN-PRODUCTION"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT settings
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    SQLALCHEMY_ECHO = False


class Config(BaseConfig):
    """ Default configuration loaded by Flask (development-friendly). """

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR / 'app.db'}",
    )
    DEBUG = True


class ProdConfig(BaseConfig):
    """ Production configuration — stricter rules. """

    DEBUG = False

    # In production you SHOULD set DATABASE_URL in the environment,
    # but for development and tests we fall back to the local SQLite.
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR / 'app.db'}",
    )

