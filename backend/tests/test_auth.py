"""Tests for authentication endpoints"""
import pytest
from fastapi.testclient import TestClient


class TestAuth:
    """Authentication API tests."""

    def test_login_missing_fields(self, client: TestClient):
        """Login with empty credentials returns 422."""
        resp = client.post("/api/auth/login", json={})
        assert resp.status_code == 422

    def test_login_invalid_credentials(self, client: TestClient):
        """Login with wrong password returns 401."""
        resp = client.post("/api/auth/login", json={
            "username": "nonexistent",
            "password": "wrong",
        })
        assert resp.status_code == 401

    def test_register_missing_code(self, client: TestClient):
        """Register without verification code returns 400."""
        resp = client.post("/api/auth/register", json={
            "username": "newuser",
            "email": "new@test.com",
            "password": "Test123!@#",
            "code": "000000",
        })
        assert resp.status_code == 400

    def test_register_with_valid_code(self, client: TestClient):
        """Register with special code 123456 succeeds (mock fallback)."""
        # First send code
        client.post("/api/auth/send-code", json={"email": "new@test.com"})
        resp = client.post("/api/auth/register", json={
            "username": "newuser",
            "email": "new@test.com",
            "password": "Test123!@#",
            "code": "123456",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "token" in data
        assert data["user"]["username"] == "newuser"

    def test_register_duplicate_username(self, client: TestClient):
        """Registering with an existing username returns 400."""
        # First registration
        client.post("/api/auth/send-code", json={"email": "dup@test.com"})
        client.post("/api/auth/register", json={
            "username": "dupuser",
            "email": "dup@test.com",
            "password": "Test123!@#",
            "code": "123456",
        })
        # Duplicate username
        client.post("/api/auth/send-code", json={"email": "dup2@test.com"})
        resp = client.post("/api/auth/register", json={
            "username": "dupuser",
            "email": "dup2@test.com",
            "password": "Test123!@#",
            "code": "123456",
        })
        assert resp.status_code == 400
