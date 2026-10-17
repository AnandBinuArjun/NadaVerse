"""
Pydantic schemas for Explainable AI Practice Companion
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DetectedSwaraMetric(BaseModel):
    swara: str = Field(..., description="Swara symbol (e.g. S, R1, G3, M1, P, D1, N3)")
    expected_cents: float = Field(..., description="Theoretical just intonation cent offset from Sa")
    measured_cents: float = Field(..., description="Measured cent offset in user recording")
    deviation_cents: float = Field(..., description="Deviation from expected pitch in cents")
    stability_pct: float = Field(..., ge=0, le=100, description="Pitch stability percentage on this swara")
    status: str = Field(..., description="accurate, sharp, or flat")


class AudioPracticeAnalysisRequest(BaseModel):
    exercise_name: str = Field(..., description="Name of exercise (e.g. Mayamalavagowla Sarali Varisai 1)")
    tonic: str = Field(default="C", description="Adhara Shadjam pitch reference")
    tonic_frequency: float = Field(default=261.63, description="Reference frequency in Hz")
    duration_seconds: float = Field(..., ge=1.0, description="Duration of performance in seconds")
    swara_metrics: List[DetectedSwaraMetric] = Field(default=[], description="List of measured swaras")
    overall_stability_pct: float = Field(..., ge=0, le=100, description="Overall pitch stability index")
    mean_absolute_cent_error: float = Field(..., ge=0, description="Mean cent deviation from expected pitch")
    tempo_bpm: Optional[int] = Field(default=72, description="Estimated or configured tempo")
    user_consent_granted: bool = Field(default=True, description="Explicit user consent for educational audio feature processing")


class AudioPracticeAnalysisResponse(BaseModel):
    exercise_name: str
    overall_score_pct: float
    pitch_accuracy_label: str
    stability_label: str
    summary_explanation: str
    identified_strengths: List[str]
    targeted_improvements: List[str]
    recommended_exercises: List[str]
    limitations_notice: str
    confidence: str
    provenance: str
