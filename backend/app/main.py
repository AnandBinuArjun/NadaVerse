"""
NadaVerse Authoritative Backend API Service
FastAPI-based modular monolith providing verified Carnatic content,
practice session persistence, user authentication, and grounded AI tutor orchestration.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, Depends, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import engine, Base, get_db
from app.models.entities import User, PracticeSession
from app.schemas.content import RagaDetail, TalaDetail, InstrumentDetail
from app.schemas.practice import PracticeSessionCreate, PracticeSessionOut
from app.schemas.tutor import TutorMessageRequest, TutorResponse
from app.api.deps import get_optional_current_user
from app.api.v1.endpoints.auth import router as auth_router, user_router
from app.api.v1.endpoints.search import router as search_router
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
    # Initialize database tables
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

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(user_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)


@app.get("/api/v1/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "nadaverse-api",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


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

    session = PracticeSession(
        id=session_id,
        user_id=user_id,
        started_at=now,
        duration_seconds=payload.duration_seconds,
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
        ended_at=session.started_at,
        duration_seconds=session.duration_seconds,
        focus=session.focus,
        tonic=session.tonic,
        tala_id=session.tala_id,
        notes=session.notes,
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
            ended_at=s.started_at,
            duration_seconds=s.duration_seconds,
            focus=s.focus,
            tonic=s.tonic,
            tala_id=s.tala_id,
            notes=s.notes,
        )
        for s in db_sessions
    ]


# -----------------------------------------------------------------------------
# AI Tutor: Grounded Retrieval Gateway
# -----------------------------------------------------------------------------
@app.post("/api/v1/tutor/messages", response_model=TutorResponse, tags=["AI Tutor"])
async def tutor_chat(payload: TutorMessageRequest):
    conv_id = payload.conversation_id or f"conv_{uuid.uuid4().hex[:8]}"
    return await ai_gateway.generate_grounded_response(
        conversation_id=conv_id,
        query=payload.query
    )
