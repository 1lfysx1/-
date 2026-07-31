"""Basic health check tests"""
from fastapi.testclient import TestClient


class TestHealth:
    """System health and basic connectivity tests."""

    def test_root_endpoint(self, client: TestClient):
        """Root endpoint returns API info."""
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert "message" in data
        assert "docs" in data

    def test_positions_endpoint(self, client: TestClient):
        """Positions listing is publicly accessible."""
        resp = client.get("/api/positions")
        assert resp.status_code == 200
        data = resp.json()
        assert "success" in data
        assert "data" in data

    def test_cors_headers(self, client: TestClient):
        """API returns CORS headers for frontend origin."""
        resp = client.options(
            "/api/auth/login",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert resp.status_code == 200
