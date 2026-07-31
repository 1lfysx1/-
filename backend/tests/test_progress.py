"""Tests for progress tracking endpoints"""
from fastapi.testclient import TestClient


class TestProgress:
    """Progress tracking API tests."""

    def test_get_mastery_no_auth(self, client: TestClient):
        """Mastery endpoint requires authentication."""
        resp = client.get("/api/progress/mastery")
        assert resp.status_code == 401

    def test_get_recommendations_no_auth(self, client: TestClient):
        """Recommendations endpoint requires authentication."""
        resp = client.get("/api/progress/recommendations")
        assert resp.status_code == 401

    def test_get_mastery_authenticated(self, client: TestClient, student_token):
        """Authenticated user can get mastery data."""
        resp = client.get(
            "/api/progress/mastery",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        assert resp.status_code == 200

    def test_get_recommendations_authenticated(self, client: TestClient, student_token):
        """Authenticated user can get recommendations."""
        resp = client.get(
            "/api/progress/recommendations",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        assert resp.status_code == 200
