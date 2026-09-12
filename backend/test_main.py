import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, engine

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Dubzeek AI Security Auth Engine" in response.json()["service"]

def test_send_otp_flow():
    test_email = "test_user_pytest@dubzeek.ai"
    response = client.post("/api/auth/send-otp", json={"email": test_email})
    assert response.status_code in [200, 429] # 200 OK or Rate Limited

def test_invalid_login():
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@dubzeek.ai",
        "password": "wrongpassword123"
    })
    assert response.status_code in [401, 429]

