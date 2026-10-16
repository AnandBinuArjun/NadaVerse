import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

transport = ASGITransport(app=app)


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "nadaverse-api"


@pytest.mark.asyncio
async def test_list_ragas_and_provenance():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/ragas")
    assert response.status_code == 200
    ragas = response.json()
    assert len(ragas) >= 2

    # Check Mayamalavagowla
    maya = next(r for r in ragas if r["slug"] == "mayamalavagowla")
    assert maya["melakarta_number"] == 15
    assert maya["review_status"] == "expert_reviewed"
    assert len(maya["sources"]) > 0
    assert maya["rights"]["status"] == "public_domain"
    assert "S R₁ G₃ M₁ P D₁ N₃ Ṡ" in maya["arohanam"]


@pytest.mark.asyncio
async def test_get_raga_by_slug():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/ragas/mayamalavagowla")
        res_404 = await ac.get("/api/v1/ragas/nonexistent-raga-xyz")

    assert response.status_code == 200
    data = response.json()
    assert data["canonical_name"] == "Mayamalavagowla"
    assert res_404.status_code == 404


@pytest.mark.asyncio
async def test_list_talas():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/talas")
    assert response.status_code == 200
    talas = response.json()
    assert len(talas) >= 1
    adi = talas[0]
    assert adi["slug"] == "adi-tala"
    assert adi["total_aksharas"] == 8
    assert len(adi["beat_actions"]) == 8


@pytest.mark.asyncio
async def test_practice_session_lifecycle():
    create_payload = {
        "focus": "Mayamalavagowla Sarali Varisai 1-4",
        "tonic": "C",
        "tala_id": "adi-tala",
        "notes": "Practised at 72 BPM; focused on clean G3 and D1 intonation.",
        "duration_seconds": 900,
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        create_res = await ac.post("/api/v1/practice/sessions", json=create_payload)
        list_res = await ac.get("/api/v1/practice/sessions")

    assert create_res.status_code == 201
    created = create_res.json()
    assert created["id"].startswith("session_")
    assert created["focus"] == create_payload["focus"]

    assert list_res.status_code == 200
    sessions = list_res.json()
    assert any(s["id"] == created["id"] for s in sessions)


@pytest.mark.asyncio
async def test_ai_tutor_grounded_answer_and_citations():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post(
            "/api/v1/tutor/messages",
            json={"query": "Why did Purandara Dasa choose Mayamalavagowla for beginners?"},
        )
    assert res.status_code == 200
    data = res.json()
    assert data["confidence_level"] == "high"
    assert len(data["citations"]) > 0
    assert "symmetrical" in data["answer"].lower() or "purandara" in data["answer"].lower()


@pytest.mark.asyncio
async def test_ai_tutor_fallback_on_unverified_content():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post(
            "/api/v1/tutor/messages",
            json={"query": "What is the exact guitar distortion pedal used in heavy metal rock?"},
        )
    assert res.status_code == 200
    data = res.json()
    assert data["confidence_level"] == "uncertain"
    assert data["uncertainty_note"] is not None
    assert "verified" in data["answer"].lower()
