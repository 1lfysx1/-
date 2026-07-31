"""Test configuration and fixtures for pytest"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import Base, engine, SessionLocal
from app.main import app
from app.utils.security import create_access_token


@pytest.fixture(scope="function")
def client():
    """FastAPI test client using in-memory test DB."""
    # Use an in-memory SQLite database for tests
    test_db_url = "sqlite:///./test_training.db"
    os.environ["SQLITE_DATABASE_PATH"] = test_db_url
    
    with TestClient(app) as c:
        yield c
    
    # Cleanup
    if os.path.exists("./test_training.db"):
        os.remove("./test_training.db")


@pytest.fixture(scope="function")
def admin_token():
    """Generate a valid admin JWT token."""
    return create_access_token({"sub": "admin-test-id", "role": "admin"})


@pytest.fixture(scope="function")
def student_token():
    """Generate a valid student JWT token."""
    return create_access_token({"sub": "student-test-id", "role": "student"})


@pytest.fixture(scope="function")
def auth_header(admin_token):
    """Authorization header for admin requests."""
    return {"Authorization": f"Bearer {admin_token}"}
