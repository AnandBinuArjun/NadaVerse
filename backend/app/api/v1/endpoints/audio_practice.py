"""
Audio Practice Analysis & Explainable AI Companion Endpoints.
Receives client-extracted acoustic features, validates measurement ranges,
and synthesizes evidence-based pedagogical feedback.
Never retains raw user audio recordings on server without explicit consent.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import User
from app.api.deps import get_optional_current_user
from app.schemas.audio_practice import AudioPracticeAnalysisRequest, AudioPracticeAnalysisResponse
from app.services.ai_gateway import ai_gateway

router = APIRouter(prefix="/audio", tags=["Explainable AI Practice Companion"])


@router.post(
    "/analyze-practice",
    response_model=AudioPracticeAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate evidence-grounded feedback for recorded Carnatic practice"
)
async def analyze_practice_performance(
    payload: AudioPracticeAnalysisRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyzes measured pitch and stability metrics against just intonation references.
    Requires explicit user consent for audio feature processing.
    """
    if not payload.user_consent_granted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit user consent is required before audio feature analysis can proceed."
        )

    if payload.duration_seconds < 1.0 or payload.duration_seconds > 600.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Exercise duration must be between 1.0 and 600.0 seconds."
        )

    if payload.tonic_frequency < 50.0 or payload.tonic_frequency > 1000.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Tonic reference frequency must be within audible musical range (50-1000 Hz)."
        )

    response = await ai_gateway.generate_practice_analysis_explanation(payload)
    return response
