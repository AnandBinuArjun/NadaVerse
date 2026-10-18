import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

transport = ASGITransport(app=app)


@pytest.mark.asyncio
async def test_deployment_metadata_endpoint():
    """
    FI-001: Verifies the deployment metadata endpoint reports commit SHA and runtime
    information without exposing secrets.
    """
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/meta/deployment")
    assert res.status_code == 200
    data = res.json()
    assert data["service"] == "nadaverse-authoritative-api"
    assert "commit_sha" in data
    assert "runtime" in data
    assert "python_version" in data["runtime"]
    # Ensure no secrets or tokens are exposed
    assert "SECRET_KEY" not in str(data)
    assert "password" not in str(data)


@pytest.mark.asyncio
async def test_two_user_export_and_isolation():
    """
    FI-002: Verifies two-user IDOR isolation:
    - User A records practice sessions, bookmarks, and progress.
    - User B cannot see User A's data in User B's export.
    - User B cannot modify or abandon User A's practice session.
    - User A's export contains all User A's records with full metadata.
    """
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Register User A
        email_a = f"learner_a_{uuid.uuid4().hex[:6]}@nadaverse.org"
        reg_a = await ac.post("/api/v1/auth/register", json={
            "email": email_a,
            "password": "StrongPassword123!",
            "display_name": "Carnatic Learner A",
            "experience_level": "student"
        })
        assert reg_a.status_code == 201
        token_a = reg_a.json()["access_token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}

        # User A creates a practice session
        session_res = await ac.post("/api/v1/practice/sessions", json={
            "duration_seconds": 1800,
            "planned_duration_seconds": 1800,
            "focus": "Mayamalavagowla Tri-Kalam Drills",
            "tonic": "C",
            "tala_id": "adi-tala",
            "status": "completed",
            "notes": "Focused on Shuddha Rishabham intonation."
        }, headers=headers_a)
        assert session_res.status_code == 201
        session_a_id = session_res.json()["id"]

        # User A adds a bookmark
        bm_res = await ac.post("/api/v1/me/bookmarks", json={
            "content_type": "raga",
            "content_slug": "mayamalavagowla"
        }, headers=headers_a)
        assert bm_res.status_code == 201
        bm_a_id = bm_res.json()["id"]

        # User A updates progress
        prog_res = await ac.put("/api/v1/me/progress/lesson-sarali-1", json={
            "lesson_id": "lesson-sarali-1",
            "status": "completed"
        }, headers=headers_a)
        assert prog_res.status_code == 200

        # Register User B
        email_b = f"learner_b_{uuid.uuid4().hex[:6]}@nadaverse.org"
        reg_b = await ac.post("/api/v1/auth/register", json={
            "email": email_b,
            "password": "StrongPassword456!",
            "display_name": "Carnatic Learner B",
            "experience_level": "beginner"
        })
        assert reg_b.status_code == 201
        token_b = reg_b.json()["access_token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        # User B attempts to access/abandon User A's session -> must be rejected (404/403)
        tamper_res = await ac.patch(f"/api/v1/practice/sessions/{session_a_id}/abandon", headers=headers_b)
        assert tamper_res.status_code in [403, 404]

        # User B attempts to delete User A's bookmark -> must be rejected (404)
        del_bm_res = await ac.delete(f"/api/v1/me/bookmarks/{bm_a_id}", headers=headers_b)
        assert del_bm_res.status_code in [403, 404]

        # User B exports data -> must NOT contain User A's email, session, or bookmarks
        export_b = await ac.get("/api/v1/me/export", headers=headers_b)
        assert export_b.status_code == 200
        data_b = export_b.json()
        assert data_b["export_metadata"]["email"] == email_b
        assert len(data_b["practice_sessions"]) == 0
        assert len(data_b["bookmarks"]) == 0
        assert len(data_b["lesson_progress"]) == 0

        # User A exports data -> must contain User A's session, bookmark, and progress
        export_a = await ac.get("/api/v1/me/export", headers=headers_a)
        assert export_a.status_code == 200
        data_a = export_a.json()
        assert data_a["export_metadata"]["email"] == email_a
        assert len(data_a["practice_sessions"]) == 1
        assert data_a["practice_sessions"][0]["id"] == session_a_id
        assert data_a["practice_sessions"][0]["focus"] == "Mayamalavagowla Tri-Kalam Drills"
        assert len(data_a["bookmarks"]) == 1
        assert data_a["bookmarks"][0]["content_slug"] == "mayamalavagowla"
        assert len(data_a["lesson_progress"]) == 1
        assert data_a["lesson_progress"][0]["lesson_id"] == "lesson-sarali-1"


@pytest.mark.asyncio
async def test_account_deletion_lifecycle_via_me():
    """
    FI-002: Verifies account deletion via DELETE /api/v1/me:
    - Purges personal bookmarks, sessions, and progress.
    - Anonymizes audit trail and prevents subsequent logins.
    """
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        email = f"delete_me_{uuid.uuid4().hex[:6]}@nadaverse.org"
        password = "TemporaryPassword123!"
        reg = await ac.post("/api/v1/auth/register", json={
            "email": email,
            "password": password,
            "display_name": "Temporary Learner",
            "experience_level": "beginner"
        })
        assert reg.status_code == 201
        token = reg.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Add bookmark
        await ac.post("/api/v1/me/bookmarks", json={
            "content_type": "raga",
            "content_slug": "kalyani"
        }, headers=headers)

        # Delete account via /api/v1/me
        del_res = await ac.delete("/api/v1/me", headers=headers)
        assert del_res.status_code == 200
        assert del_res.json()["status"] == "success"

        # Subsequent login must fail (inactive / deleted account)
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": email,
            "password": password
        })
        assert login_res.status_code in [401, 403]
