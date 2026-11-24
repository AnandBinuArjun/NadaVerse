"""
NadaVerse Master Product Expansion Verification Suite (Pytest)
Tests:
1. Security headers (CSP, Permissions-Policy) and RBAC 403 enforcement on GET /api/v1/corrections/pending
2. Idempotent Guest-to-Account progress migration (POST /api/v1/me/migrate-guest-state)
3. Complete 72 Melakarta Raga mathematical scheme across 12 Chakras & M1/M2 symmetry (GET /api/v1/ragas/melakarta-72)
4. 5-Nadai & Suladi Sapta Tala Konnakol Korvai arithmetic validator (POST /api/v1/tala/validate-korvai)
5. Deterministic Ear Training attempts & category accuracy summary (POST /api/v1/ear-training/attempts, GET /api/v1/ear-training/summary)
6. Interactive Swara Notation Editor CRUD, schema validation, and BOLA/IDOR isolation (POST/GET/PUT/DELETE /api/v1/notations)
"""

import time
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.rate_limit import in_memory_limiter

transport = ASGITransport(app=app)


@pytest.mark.asyncio
async def test_security_headers_and_pending_corrections_rbac():
    """Verify hardened CSP/Permissions-Policy headers and strict 403 RBAC on GET /api/v1/corrections/pending."""
    in_memory_limiter.clear()
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        health_res = await ac.get("/api/v1/health")
        assert health_res.status_code == 200
        assert "Content-Security-Policy" in health_res.headers
        assert "Permissions-Policy" in health_res.headers
        assert "microphone=(self)" in health_res.headers["Permissions-Policy"]

        ts = int(time.time() * 1000)
        stu_res = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": f"stu_rbac_{ts}@nadaverse.internal",
                "password": "StrongPassword123!",
                "display_name": "Regular Learner",
                "role": "student",
            },
        )
        assert stu_res.status_code == 201
        stu_token = stu_res.json()["access_token"]
        stu_headers = {"Authorization": f"Bearer {stu_token}"}

        # Student must be forbidden (403) from viewing pending unreviewed editorial corrections
        pending_res = await ac.get("/api/v1/corrections/pending", headers=stu_headers)
        assert pending_res.status_code == 403


@pytest.mark.asyncio
async def test_guest_to_account_progress_migration_idempotency():
    """Verify POST /api/v1/me/migrate-guest-state idempotently migrates lessons, bookmarks, and sessions."""
    in_memory_limiter.clear()
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        ts = int(time.time() * 1000)
        reg = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": f"guest_mig_{ts}@nadaverse.internal",
                "password": "StrongPassword123!",
                "display_name": "Migrating Guest",
            },
        )
        assert reg.status_code == 201
        headers = {"Authorization": f"Bearer {reg.json()['access_token']}"}

        payload = {
            "completed_lesson_ids": ["vocal-shruti-1", "vocal-sarali-2"],
            "bookmarked_raga_slugs": ["mayamalavagowla", "mohanam"],
            "bookmarked_instrument_slugs": ["saraswati-veena"],
            "practice_sessions": [
                {
                    "focus": "Mayamalavagowla Sarali Varisai 1-4",
                    "tonic": "C",
                    "tala_id": "adi-tala",
                    "duration_minutes": 20,
                    "notes": "Migrated from local storage",
                }
            ],
        }

        res1 = await ac.post("/api/v1/me/migrate-guest-state", json=payload, headers=headers)
        assert res1.status_code == 200
        d1 = res1.json()
        assert d1["migrated_lessons_count"] == 2
        assert d1["migrated_bookmarks_count"] == 3
        assert d1["migrated_sessions_count"] == 1

        # Second call with same lessons and bookmarks must not duplicate them
        res2 = await ac.post(
            "/api/v1/me/migrate-guest-state",
            json={
                "completed_lesson_ids": ["vocal-shruti-1", "vocal-sarali-2"],
                "bookmarked_raga_slugs": ["mayamalavagowla", "mohanam"],
                "bookmarked_instrument_slugs": ["saraswati-veena"],
                "practice_sessions": [],
            },
            headers=headers,
        )
        assert res2.status_code == 200
        d2 = res2.json()
        assert d2["migrated_lessons_count"] == 0
        assert d2["migrated_bookmarks_count"] == 0
        assert d2["total_completed_lessons"] == 2


@pytest.mark.asyncio
async def test_melakarta_72_mathematical_scheme_and_filters():
    """Verify GET /api/v1/ragas/melakarta-72 returns all 72 Melakartas with exact Chakra and M1/M2 symmetry."""
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/ragas/melakarta-72")
        assert res.status_code == 200
        data = res.json()
        assert data["total_count"] == 72
        assert len(data["chakras"]) == 12
        melas = data["melakartas"]
        assert len(melas) == 72

        # Check #15 Mayamalavagowla and its Prati Madhyama counterpart #51 Kamavardhini
        m15 = melas[14]
        assert m15["melakarta_number"] == 15
        assert m15["canonical_name"] == "Mayamalavagowla"
        assert m15["chakra_name"] == "Agni"
        assert m15["madhyama_counterpart_number"] == 51
        assert m15["madhyama_counterpart_name"] == "Kamavardhini"

        # Filter by Chakra 11 (Rudra Chakra, containing #65 Mechakalyani)
        c11_res = await ac.get("/api/v1/ragas/melakarta-72?chakra=11")
        assert c11_res.status_code == 200
        c11_data = c11_res.json()
        assert c11_data["total_count"] == 6
        names = [m["canonical_name"] for m in c11_data["melakartas"]]
        assert "Mechakalyani" in names


@pytest.mark.asyncio
async def test_tala_korvai_arithmetic_validator():
    """Verify POST /api/v1/tala/validate-korvai across multiple Nadais and resolutions."""
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Adi Tala (8 aksharas) in Chatusra Nadai (4) = 32 matras/cycle.
        # Purvangam 17 + 3 * 5 (Uttaranga) + 0 gap = 32 matras -> Valid resolution!
        res_ok = await ac.post(
            "/api/v1/tala/validate-korvai",
            json={
                "tala_aksharas": 8,
                "nadai": "chatusra",
                "purvangam_matras": 17,
                "uttarangam_phrase_matras": 5,
                "mora_gap_matras": 0,
                "eduppu_offset_matras": 0,
            },
        )
        assert res_ok.status_code == 200
        d_ok = res_ok.json()
        assert d_ok["valid_resolution"] is True
        assert d_ok["total_korvai_matras"] == 32
        assert d_ok["avartanams_spanned"] == 1.0

        # 2. Misaligned Korvai in Khanda Nadai (5 matras/akshara * 8 = 40 matras/cycle)
        res_off = await ac.post(
            "/api/v1/tala/validate-korvai",
            json={
                "tala_aksharas": 8,
                "nadai": "khanda",
                "purvangam_matras": 20,
                "uttarangam_phrase_matras": 5,
                "mora_gap_matras": 1,
                "eduppu_offset_matras": 0,
            },
        )
        assert res_off.status_code == 200
        d_off = res_off.json()
        # 20 + 15 + 2 = 37 matras (3 matras short of 40)
        assert d_off["valid_resolution"] is False
        assert d_off["suggested_purvangam_adjustment"] == 3


@pytest.mark.asyncio
async def test_ear_training_attempts_and_summary():
    """Verify deterministic Ear Training attempt persistence and summary aggregation."""
    in_memory_limiter.clear()
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        ts = int(time.time() * 1000)
        reg = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": f"ear_student_{ts}@nadaverse.internal",
                "password": "StrongPassword123!",
                "display_name": "Ear Training Student",
            },
        )
        headers = {"Authorization": f"Bearer {reg.json()['access_token']}"}

        att1 = await ac.post(
            "/api/v1/ear-training/attempts",
            json={
                "category": "swara",
                "difficulty": "beginner",
                "tonic": "C",
                "total_questions": 5,
                "correct_answers": 4,
            },
            headers=headers,
        )
        assert att1.status_code == 201
        assert att1.json()["score_pct"] == 80

        sum_res = await ac.get("/api/v1/ear-training/summary", headers=headers)
        assert sum_res.status_code == 200
        summary = sum_res.json()
        assert summary["total_attempts"] == 1
        assert summary["average_score_pct"] == 80
        assert summary["by_category"]["swara"]["best_score_pct"] == 80


@pytest.mark.asyncio
async def test_swara_notation_editor_crud_and_bola_isolation():
    """Verify Swara Notation Editor CRUD, invalid swara rejection (422), and cross-user BOLA protection (403)."""
    in_memory_limiter.clear()
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        ts = int(time.time() * 1000)
        u1 = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": f"composer_a_{ts}@nadaverse.internal",
                "password": "StrongPassword123!",
                "display_name": "Composer A",
            },
        )
        u1_headers = {"Authorization": f"Bearer {u1.json()['access_token']}"}

        u2 = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": f"composer_b_{ts}@nadaverse.internal",
                "password": "StrongPassword123!",
                "display_name": "Composer B",
            },
        )
        u2_headers = {"Authorization": f"Bearer {u2.json()['access_token']}"}

        # 1. Invalid swara token must be rejected with 422
        bad_res = await ac.post(
            "/api/v1/notations",
            json={
                "title": "Invalid Swara Test",
                "raga_slug": "mayamalavagowla",
                "tala_slug": "adi-tala",
                "tala_aksharas": 8,
                "nadai": "chatusra",
                "kalam": 1,
                "tonic": "C",
                "sections": [
                    {
                        "name": "Pallavi",
                        "notes": [{"swara": "H9", "octave": "madhya", "aksharas": 1.0, "sahitya": "", "gamaka": "none"}],
                    }
                ],
            },
            headers=u1_headers,
        )
        assert bad_res.status_code == 422

        # 2. Valid 8-akshara Adi Tala notation creation by User A
        create_res = await ac.post(
            "/api/v1/notations",
            json={
                "title": "Mayamalavagowla Kalpana Swara Study",
                "raga_slug": "mayamalavagowla",
                "tala_slug": "adi-tala",
                "tala_aksharas": 8,
                "nadai": "chatusra",
                "kalam": 1,
                "tonic": "C",
                "sections": [
                    {
                        "name": "Pallavi",
                        "notes": [
                            {"swara": "S", "octave": "madhya", "aksharas": 1.0, "sahitya": "Sri", "gamaka": "none"},
                            {"swara": "R1", "octave": "madhya", "aksharas": 1.0, "sahitya": "Ga", "gamaka": "none"},
                            {"swara": "G3", "octave": "madhya", "aksharas": 2.0, "sahitya": "na", "gamaka": "kampita"},
                            {"swara": "M1", "octave": "madhya", "aksharas": 1.0, "sahitya": "na", "gamaka": "none"},
                            {"swara": "P", "octave": "madhya", "aksharas": 3.0, "sahitya": "tha", "gamaka": "jaru"},
                        ],
                    }
                ],
            },
            headers=u1_headers,
        )
        assert create_res.status_code == 201
        doc_data = create_res.json()
        doc_id = doc_data["id"]
        assert doc_data["validation"]["cycle_aligned"] is True
        assert doc_data["validation"]["total_aksharas"] == 8.0

        # 3. User B attempts to read, update, or delete User A's private draft -> 403 Forbidden (BOLA check)
        bola_get = await ac.get(f"/api/v1/notations/{doc_id}", headers=u2_headers)
        assert bola_get.status_code == 403

        bola_del = await ac.delete(f"/api/v1/notations/{doc_id}", headers=u2_headers)
        assert bola_del.status_code == 403

        # 4. User A reads and deletes their own draft
        owner_get = await ac.get(f"/api/v1/notations/{doc_id}", headers=u1_headers)
        assert owner_get.status_code == 200

        owner_del = await ac.delete(f"/api/v1/notations/{doc_id}", headers=u1_headers)
        assert owner_del.status_code == 204


@pytest.mark.asyncio
async def test_v2_open_developer_public_api_knowledge_graph_and_phrase_search():
    """Verify NadaVerse 2.0 Open Developer Public API (/api/v1/public/*), Knowledge Graph, and Phrase Search."""
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Public Ragas API with pagination & license metadata
        ragas_res = await ac.get("/api/v1/public/ragas?limit=5&offset=0")
        assert ragas_res.status_code == 200
        r_data = ragas_res.json()
        assert r_data["meta"]["contains_private_user_data"] is False
        assert "CC-BY-SA 4.0" in r_data["meta"]["license"]
        assert len(r_data["items"]) == 5

        # 2. Public Talas, Composers, Instruments, Glossary, Compositions
        for endpoint in [
            "/api/v1/public/talas",
            "/api/v1/public/composers",
            "/api/v1/public/instruments",
            "/api/v1/public/glossary?q=Shruti",
            "/api/v1/public/compositions",
        ]:
            ep_res = await ac.get(endpoint)
            assert ep_res.status_code == 200
            assert ep_res.json()["total"] >= 1

        # 3. Carnatic Knowledge Graph Relationships API
        kg_res = await ac.get("/api/v1/public/relationships?entity_type=raga")
        assert kg_res.status_code == 200
        kg_data = kg_res.json()
        assert kg_data["node_count"] >= 5
        assert kg_data["edge_count"] >= 8
        assert all(n["type"] == "raga" for n in kg_data["nodes"])

        # 4. Musical Phrase Search Engine API
        ps_res = await ac.get("/api/v1/public/phrase-search?swaras=G3+P+N3+S")
        assert ps_res.status_code == 200
        ps_data = ps_res.json()
        assert ps_data["total_matches"] >= 1
        top_match = ps_data["matches"][0]
        assert top_match["raga"] == "Hamsadhwani"
        assert top_match["match_type"] == "exact_subsequence"

