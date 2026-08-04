import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import engine
from app.database.base import Base

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "MeetFlow AI API"

def test_full_auth_and_crud_flow():
    # 1. Register
    reg_payload = {
        "full_name": "Test User",
        "email": "test@meetflow.ai",
        "password": "password123"
    }
    response = client.post("/register", json=reg_payload)
    assert response.status_code == 201
    user_data = response.json()
    assert user_data["email"] == "test@meetflow.ai"
    assert user_data["full_name"] == "Test User"

    # 2. Login
    login_payload = {
        "email": "test@meetflow.ai",
        "password": "password123"
    }
    response = client.post("/login", json=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get /me
    response = client.get("/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@meetflow.ai"

    # 4. Create Meeting
    meeting_payload = {
        "title": "Sprint Planning Sync",
        "description": "Discuss sprint goals and backlog priorities",
        "meeting_date": "2026-08-10T10:00:00Z"
    }
    response = client.post("/meetings", json=meeting_payload, headers=headers)
    assert response.status_code == 201
    meeting = response.json()
    meeting_id = meeting["id"]
    assert meeting["title"] == "Sprint Planning Sync"

    # 5. List Meetings
    response = client.get("/meetings", headers=headers)
    assert response.status_code == 200
    meetings_list = response.json()
    assert len(meetings_list) >= 1

    # 6. Add Note to Meeting
    note_payload = {
        "meeting_id": meeting_id,
        "raw_note": "Discussed API redesign. Todo: assign backend tasks. Action item: update schema documentation by Friday."
    }
    response = client.post("/notes", json=note_payload, headers=headers)
    assert response.status_code == 201
    note = response.json()
    assert note["meeting_id"] == meeting_id

    # 7. AI Summarize Note
    sum_payload = {
        "meeting_id": meeting_id,
        "raw_note": note_payload["raw_note"]
    }
    response = client.post("/notes/summarize", json=sum_payload, headers=headers)
    assert response.status_code == 200
    sum_res = response.json()
    assert "ai_summary" in sum_res
    assert "Executive Key Takeaways" in sum_res["ai_summary"]

    # 8. Create Task linked to Meeting
    task_payload = {
        "meeting_id": meeting_id,
        "title": "Update schema documentation",
        "description": "Refactor pydantic models",
        "priority": "high",
        "status": "pending"
    }
    response = client.post("/tasks", json=task_payload, headers=headers)
    assert response.status_code == 201
    task = response.json()
    task_id = task["id"]
    assert task["title"] == "Update schema documentation"

    # 9. Update Task status
    up_task_payload = {"status": "completed"}
    response = client.put(f"/tasks/{task_id}", json=up_task_payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "completed"

    # 10. Dashboard Stats
    response = client.get("/dashboard", headers=headers)
    assert response.status_code == 200
    dash = response.json()
    assert dash["total_meetings"] >= 1
    assert dash["total_notes"] >= 1
    assert dash["task_stats"]["total"] >= 1
    assert dash["task_stats"]["completed"] >= 1
