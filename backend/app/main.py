"""
NadaVerse Authoritative Backend API Service
FastAPI-based modular monolith providing verified Carnatic content,
practice session persistence, user authentication, and grounded AI tutor orchestration.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, Depends, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import engine, Base, get_db
from app.models.entities import User, PracticeSession, AuditEvent
from app.schemas.content import RagaDetail, TalaDetail, InstrumentDetail
from app.schemas.practice import PracticeSessionCreate, PracticeSessionComplete, PracticeSessionOut
from app.schemas.tutor import TutorMessageRequest, TutorResponse
from app.api.deps import get_optional_current_user, get_current_user
from app.api.v1.endpoints.auth import router as auth_router, user_router
from app.api.v1.endpoints.search import router as search_router
from app.api.v1.endpoints.curriculum import router as curriculum_router
from app.api.v1.endpoints.audio_practice import router as audio_router
from app.api.v1.endpoints.teaching import router as teaching_router
from app.api.v1.endpoints.heritage import router as heritage_router
from app.services.ai_gateway import ai_gateway
from app.data.verified_corpus import (
    VERIFIED_RAGAS_DATA,
    VERIFIED_TALAS_DATA,
    VERIFIED_INSTRUMENTS_DATA,
    VERIFIED_COMPOSERS_DATA,
    VERIFIED_COMPOSITIONS_DATA,
    VERIFIED_GLOSSARY_DATA,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Production startup safety validations
    if settings.APP_ENV == "production":
        if settings.DEBUG:
            raise RuntimeError("CRITICAL: DEBUG mode cannot be enabled in production.")
        if "*" in settings.CORS_ORIGINS:
            raise RuntimeError("CRITICAL: Wildcard CORS origin is forbidden in production.")
        # In production, schema migrations are performed out-of-band via 'alembic upgrade head'
    else:
        # Development / test database automatic table initialization
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="The official authoritative API for NadaVerse Carnatic Music Platform.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Sentry Initialization (if configured)
if settings.SENTRY_DSN:
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.APP_ENV,
            traces_sample_rate=0.2,
            integrations=[FastApiIntegration()]
        )
    except Exception:
        pass

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Rate Limiting Middleware
from app.core.rate_limit import RateLimitMiddleware
app.add_middleware(RateLimitMiddleware)

# CORS Middleware configuration
cors_kwargs = {
    "allow_origins": settings.CORS_ORIGINS,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if settings.APP_ENV != "production":
    cors_kwargs["allow_origin_regex"] = r"https://.*\.vercel\.app"

app.add_middleware(CORSMiddleware, **cors_kwargs)

# Register Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(user_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)
app.include_router(curriculum_router, prefix=settings.API_V1_PREFIX)
app.include_router(audio_router, prefix=settings.API_V1_PREFIX)
app.include_router(teaching_router, prefix=settings.API_V1_PREFIX)
app.include_router(heritage_router, prefix=settings.API_V1_PREFIX)


@app.get("/api/v1/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "nadaverse-api",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/v1/health/liveness", tags=["System"])
async def health_liveness():
    return {"status": "alive"}


@app.get("/api/v1/health/readiness", tags=["System"])
async def health_readiness(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "healthy"}
    except Exception:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database connectivity unavailable")


# -----------------------------------------------------------------------------
# Content: Ragas
# -----------------------------------------------------------------------------
@app.get("/api/v1/ragas", response_model=List[RagaDetail], tags=["Ragas"])
async def list_ragas(
    q: Optional[str] = Query(None, description="Search query for raga name or chakra"),
    melakarta_only: Optional[bool] = Query(None, description="Filter for Melakarta parent ragas"),
):
    results = VERIFIED_RAGAS_DATA
    if melakarta_only is not None:
        results = [r for r in results if r.get("is_melakarta") == melakarta_only]
    if q:
        query_lower = q.lower()
        results = [
            r
            for r in results
            if query_lower in r["canonical_name"].lower()
            or any(query_lower in alias.lower() for alias in r.get("alternate_names", []))
            or (r.get("chakra") and query_lower in r["chakra"].lower())
        ]
    return results


@app.get("/api/v1/ragas/{slug}", response_model=RagaDetail, tags=["Ragas"])
async def get_raga(slug: str):
    for raga in VERIFIED_RAGAS_DATA:
        if raga["slug"] == slug:
            return raga
    raise HTTPException(status_code=404, detail=f"Raga with slug '{slug}' not found in verified corpus.")


# -----------------------------------------------------------------------------
# Content: Talas
# -----------------------------------------------------------------------------
@app.get("/api/v1/talas", response_model=List[TalaDetail], tags=["Talas"])
async def list_talas():
    return VERIFIED_TALAS_DATA


@app.get("/api/v1/talas/{slug}", response_model=TalaDetail, tags=["Talas"])
async def get_tala(slug: str):
    for tala in VERIFIED_TALAS_DATA:
        if tala["slug"] == slug:
            return tala
    raise HTTPException(status_code=404, detail=f"Tala with slug '{slug}' not found.")


# -----------------------------------------------------------------------------
# Content: Instruments
# -----------------------------------------------------------------------------
@app.get("/api/v1/instruments", response_model=List[InstrumentDetail], tags=["Instruments"])
async def list_instruments():
    return VERIFIED_INSTRUMENTS_DATA


@app.get("/api/v1/instruments/{slug}", response_model=InstrumentDetail, tags=["Instruments"])
async def get_instrument(slug: str):
    for inst in VERIFIED_INSTRUMENTS_DATA:
        if inst["slug"] == slug:
            return inst
    raise HTTPException(status_code=404, detail=f"Instrument with slug '{slug}' not found.")


# -----------------------------------------------------------------------------
# Content: Composers & Compositions
# -----------------------------------------------------------------------------
@app.get("/api/v1/composers", tags=["Composers"])
async def list_composers():
    return VERIFIED_COMPOSERS_DATA


@app.get("/api/v1/compositions", tags=["Compositions"])
async def list_compositions():
    return VERIFIED_COMPOSITIONS_DATA


@app.get("/api/v1/glossary", tags=["Glossary"])
async def list_glossary():
    return VERIFIED_GLOSSARY_DATA


# -----------------------------------------------------------------------------
# Practice Sessions (Database Persisted with Guest or User Scope)
# -----------------------------------------------------------------------------
@app.post("/api/v1/practice/sessions", response_model=PracticeSessionOut, status_code=status.HTTP_201_CREATED, tags=["Practice"])
async def create_practice_session(
    payload: PracticeSessionCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    session_id = f"session_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    user_id = current_user.id if current_user else "guest_session"

    status_str = payload.status or "completed"
    if status_str == "completed":
        # When user finishes and logs an exercise with duration_seconds,
        # the session was completed at 'now' and started 'duration_seconds' ago.
        # This prevents ended_at from being a calculated future timestamp.
        completed_at = now
        started_at = now - timedelta(seconds=payload.duration_seconds)
        ended_at = completed_at
        actual_duration = payload.duration_seconds
    else:
        # For in_progress sessions (live active timer), actual completed duration is 0,
        # completed_at is None until explicitly finished.
        started_at = now
        completed_at = None
        ended_at = None
        actual_duration = 0

    session = PracticeSession(
        id=session_id,
        user_id=user_id,
        started_at=started_at,
        completed_at=completed_at,
        duration_seconds=actual_duration,
        planned_duration_seconds=payload.planned_duration_seconds or (payload.duration_seconds if status_str != "completed" else None),
        status=status_str,
        focus=payload.focus,
        tonic=payload.tonic or "C",
        tala_id=payload.tala_id or "adi-tala",
        notes=payload.notes or "",
    )
    if current_user:
        db.add(session)
        await db.commit()

    return PracticeSessionOut(
        id=session.id,
        user_id=session.user_id,
        started_at=session.started_at,
        ended_at=ended_at,
        completed_at=completed_at,
        duration_seconds=session.duration_seconds,
        planned_duration_seconds=session.planned_duration_seconds,
        status=session.status,
        focus=session.focus,
        tonic=session.tonic,
        tala_id=session.tala_id,
        notes=session.notes or "",
    )


@app.patch("/api/v1/practice/sessions/{session_id}/complete", response_model=PracticeSessionOut, tags=["Practice"])
async def complete_practice_session(
    session_id: str,
    payload: PracticeSessionComplete,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(PracticeSession).where(PracticeSession.id == session_id, PracticeSession.user_id == current_user.id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Practice session not found or does not belong to you.")

    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Practice session has already been completed.")

    now = datetime.now(timezone.utc)
    session.duration_seconds = payload.actual_duration_seconds
    session.completed_at = now
    session.status = "completed"
    if payload.notes is not None:
        session.notes = payload.notes

    await db.commit()
    await db.refresh(session)
    return PracticeSessionOut(
        id=session.id,
        user_id=session.user_id,
        started_at=session.started_at,
        ended_at=session.completed_at,
        completed_at=session.completed_at,
        duration_seconds=session.duration_seconds,
        planned_duration_seconds=session.planned_duration_seconds,
        status=session.status,
        focus=session.focus,
        tonic=session.tonic,
        tala_id=session.tala_id,
        notes=session.notes or "",
    )


@app.get("/api/v1/practice/sessions", response_model=List[PracticeSessionOut], tags=["Practice"])
async def list_practice_sessions(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        return []

    stmt = select(PracticeSession).where(PracticeSession.user_id == current_user.id).order_by(PracticeSession.started_at.desc())
    res = await db.execute(stmt)
    db_sessions = res.scalars().all()
    return [
        PracticeSessionOut(
            id=s.id,
            user_id=s.user_id,
            started_at=s.started_at,
            ended_at=s.completed_at or (s.started_at + timedelta(seconds=s.duration_seconds) if s.duration_seconds else None),
            completed_at=s.completed_at,
            duration_seconds=s.duration_seconds,
            planned_duration_seconds=s.planned_duration_seconds,
            status=s.status or "completed",
            focus=s.focus,
            tonic=s.tonic,
            tala_id=s.tala_id,
            notes=s.notes or "",
        )
        for s in db_sessions
    ]


# -----------------------------------------------------------------------------
# AI Tutor: Grounded Retrieval Gateway & Real-Time Streaming
# -----------------------------------------------------------------------------
from fastapi.responses import StreamingResponse
import json

@app.post("/api/v1/tutor/messages", response_model=TutorResponse, tags=["AI Tutor"])
async def tutor_chat(payload: TutorMessageRequest):
    conv_id = payload.conversation_id or f"conv_{uuid.uuid4().hex[:8]}"
    return await ai_gateway.generate_grounded_response(
        conversation_id=conv_id,
        query=payload.query
    )


@app.get("/api/v1/tutor/stream", tags=["AI Tutor"])
async def tutor_stream_get(query: str = Query(..., description="Query for tutor"), conversation_id: Optional[str] = None):
    conv_id = conversation_id or f"conv_{uuid.uuid4().hex[:8]}"
    
    async def sse_event_stream():
        async for chunk in ai_gateway.stream_grounded_response(conv_id, query):
            data = json.dumps({"chunk": chunk})
            yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        sse_event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.post("/api/v1/tutor/stream", tags=["AI Tutor"])
async def tutor_stream_post(payload: TutorMessageRequest):
    conv_id = payload.conversation_id or f"conv_{uuid.uuid4().hex[:8]}"
    
    async def sse_event_stream():
        async for chunk in ai_gateway.stream_grounded_response(conv_id, payload.query):
            data = json.dumps({"chunk": chunk})
            yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        sse_event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# -----------------------------------------------------------------------------
# Attribution & Treatises Reference
# -----------------------------------------------------------------------------
@app.get("/api/v1/meta/treatises", tags=["Attribution"])
async def list_canonical_treatises():
    return {
        "title": "NadaVerse Canonical Musicological Sources",
        "peer_review_status": "Verified against Classical Treatises",
        "primary_treatises": [
            {
                "name": "Chaturdandi Prakasika",
                "author": "Venkatamakhin",
                "century": "17th Century CE",
                "significance": "Foundational treatise codifying the 72 Melakarta Raga classification scheme using mathematical permutations."
            },
            {
                "name": "Sangita Ratnakara",
                "author": "Sarangadeva",
                "century": "13th Century CE",
                "significance": "Seminal pan-Indian musicological text outlining swaras, gramas, murchanas, and tala lakshanas."
            },
            {
                "name": "Sangita Sampradaya Pradarsini",
                "author": "Subbarama Dikshitar",
                "year": "1904 CE",
                "significance": "Definitive encyclopedia documenting notations, gamakas, and authoritative compositions of the Dikshitar lineage."
            },
            {
                "name": "Natya Shastra",
                "author": "Bharata Muni",
                "period": "c. 200 BCE – 200 CE",
                "significance": "Earliest comprehensive treatise on Indian dramaturgy, foundational modal tuning, and shruti intervals."
            }
        ]
    }


# -----------------------------------------------------------------------------
# Peer-Review & Musicological Corrections
# -----------------------------------------------------------------------------
from pydantic import BaseModel

class CorrectionSubmission(BaseModel):
    entity_type: str
    entity_name: str
    target_field: str
    proposed_edit: str
    citation_source: str
    submitter_name: Optional[str] = "Anonymous Scholar"
    submitter_affiliation: Optional[str] = None
    submitted_at: Optional[str] = None

@app.post("/api/v1/corrections", status_code=status.HTTP_201_CREATED, tags=["Peer Review"])
async def submit_musicological_correction(
    correction: CorrectionSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Submits a peer-reviewed musicological correction or treatise citation
    from senior vidwans, students, or institutional bodies.
    """
    audit = AuditEvent(
        actor_id=current_user.id if current_user else "anonymous_scholar",
        action="suggest_correction",
        target_type=correction.entity_type,
        target_id=correction.entity_name,
        details=f"Field: {correction.target_field} | Edit: {correction.proposed_edit} | Citation: {correction.citation_source} | Submitter: {correction.submitter_name} ({correction.submitter_affiliation or 'N/A'})"
    )
    db.add(audit)
    await db.commit()
    return {
        "status": "success",
        "message": "Musicological correction successfully logged for editorial peer review.",
        "entity": correction.entity_name
    }


