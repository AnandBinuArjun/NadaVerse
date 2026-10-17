"""
Pydantic Schemas for Playable Carnatic Compositions
Adheres to Schema Version 1.0.0
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field, model_validator


class GamakaAnnotationSchema(BaseModel):
    type: Literal["none", "kampita", "jaru", "nokku", "spurita", "odukkal", "kandippu"] = "none"
    startRatio: Optional[float] = None
    endRatio: Optional[float] = None
    oscillationDepthCents: Optional[float] = None
    oscillationSpeedHz: Optional[float] = None
    description: Optional[str] = None
    descriptionMl: Optional[str] = None


class ViolinPerformanceAnnotationSchema(BaseModel):
    string: Literal[1, 2, 3, 4] = Field(..., description="1: Tara Sa, 2: Madhya Pa, 3: Madhya Sa, 4: Mandra Pa")
    finger: Literal[0, 1, 2, 3, 4] = Field(..., description="0: Open string, 1: Index, 2: Middle, 3: Ring, 4: Little")
    bowDirection: Literal["down", "up"] = Field(..., description="down: Uttana, up: Pratyuttana")
    positionNote: Optional[str] = None


class SwaraEventSchema(BaseModel):
    id: str
    swara: str = Field(..., min_length=1, description="Swara glyph e.g. S, R1, G3, M1, P, D1, N3")
    octave: Literal["mandra", "madhya", "tara"] = "madhya"
    ratio: float = Field(..., gt=0.4, lt=5.0, description="Harmonic ratio relative to Adhara Sa")
    durationAksharas: float = Field(..., gt=0.0, description="Duration in aksharas/beats")
    sahitya: Optional[str] = None
    sahityaMl: Optional[str] = None
    gamaka: Optional[GamakaAnnotationSchema] = None
    violin: Optional[ViolinPerformanceAnnotationSchema] = None


class RhythmicLineSchema(BaseModel):
    lineNumber: int
    totalAksharas: float = Field(..., gt=0)
    swaras: List[SwaraEventSchema] = Field(..., min_length=1)
    sahityaLineText: Optional[str] = None
    sahityaLineTextMl: Optional[str] = None


class CompositionSectionSchema(BaseModel):
    id: str
    name: str
    nameMl: str
    order: int
    cycleCount: int = Field(default=1, ge=1)
    lines: List[RhythmicLineSchema] = Field(..., min_length=1)
    pedagogicalFocus: Optional[str] = None
    pedagogicalFocusMl: Optional[str] = None


class CompositionAudioReferenceSchema(BaseModel):
    type: Literal["synthetic_browser_generated", "curated_licensed_recording", "teacher_recording"] = "synthetic_browser_generated"
    audioUrl: Optional[str] = None
    performer: Optional[str] = None
    recordingDate: Optional[str] = None
    attributionNote: Optional[str] = None


class RightsMetadataSchema(BaseModel):
    status: Literal["public_domain", "fair_use_educational", "licensed", "cc_by_sa"] = "public_domain"
    rightsHolder: str
    licenseNotes: Optional[str] = None


class SourceMetadataSchema(BaseModel):
    title: str
    authorOrCreator: str
    citation: str
    url: Optional[str] = None
    publicationYear: Optional[int] = None


class PlayableCompositionSchema(BaseModel):
    schemaVersion: Literal["1.0.0"] = "1.0.0"
    id: str
    slug: str
    title: str
    titleMl: str
    category: Literal["varnam", "keerthanam", "geetham", "swarajathi", "varisai", "raga_exercise", "violin_piece"]
    categoryLabelEn: str
    categoryLabelMl: str
    ragaName: str
    ragaMl: str
    ragaSlug: str
    melakartaNumber: Optional[int] = None
    talaName: str
    talaMl: str
    talaSlug: str
    talaTotalAksharas: int = Field(..., gt=0)
    talaAngas: str
    composerName: str
    composerMl: str
    composerSlug: str
    language: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    difficultyMl: str
    defaultBpm: int = Field(default=72, ge=30, le=240)
    slowPracticeBpm: int = Field(default=48, ge=20, le=160)
    sections: List[CompositionSectionSchema] = Field(..., min_length=1)
    audioReference: CompositionAudioReferenceSchema = Field(default_factory=CompositionAudioReferenceSchema)
    sources: List[SourceMetadataSchema] = Field(default_factory=list)
    rights: RightsMetadataSchema
    reviewStatus: Literal["draft", "in_review", "verified", "expert_reviewed", "archived"] = "verified"
    reviewerName: str
    reviewedAt: str
    educationalSummary: str
    educationalSummaryMl: str
    violinPracticeNotes: Optional[str] = None
    violinPracticeNotesMl: Optional[str] = None


class CompositionValidationReportSchema(BaseModel):
    isValid: bool
    errors: List[str]
    warnings: List[str]
    totalNotes: int
    totalDurationAksharas: float
    sectionCount: int
