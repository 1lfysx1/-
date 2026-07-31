"""Tests for exercise endpoints"""
import pytest
from fastapi.testclient import TestClient


class TestExercise:
    """Exercise API tests."""

    def test_get_knowledge_points_no_auth(self, client: TestClient):
        """Knowledge points endpoint requires authentication."""
        resp = client.get("/api/exercise/knowledge-points")
        assert resp.status_code == 401

    def test_get_questions_no_auth(self, client: TestClient):
        """Questions endpoint requires authentication."""
        resp = client.get("/api/exercise/questions")
        assert resp.status_code == 401

    def test_submit_no_auth(self, client: TestClient):
        """Submit endpoint requires authentication."""
        resp = client.post("/api/exercise/submit", json={"answers": []})
        assert resp.status_code == 401

    def test_get_wrong_questions_no_auth(self, client: TestClient):
        """Wrong questions endpoint requires authentication."""
        resp = client.get("/api/exercise/wrong-questions")
        assert resp.status_code == 401

    def test_get_knowledge_points_authenticated(self, client: TestClient, student_token):
        """Authenticated user can access knowledge points."""
        resp = client.get(
            "/api/exercise/knowledge-points",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        # Should return successfully even if empty
        assert resp.status_code == 200
