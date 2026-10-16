from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class ReviewStatus(str, Enum):
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    VERIFIED = "verified"
    EXPERT_REVIEWED = "expert_reviewed"
    ARCHIVED = "archived"


class RightsStatus(str, Enum):
    PUBLIC_DOMAIN = "public_domain"
    FAIR_USE_EDUCATIONAL = "fair_use_educational"
    LICENSED = "licensed"
    CC_BY_SA = "cc_by_sa"


class SourceMetadata(BaseModel):
    title: str
    author_or_creator: str
    citation: str
    url: Optional[str] = None
    publication_year: Optional[int] = None
    access_date: Optional[str] = None


class RightsMetadata(BaseModel):
    status: RightsStatus
    rights_holder: Optional[str] = "Public domain / Traditional knowledge"
    license_notes: Optional[str] = None


class SwaraInfo(BaseModel):
    symbol: str
    full_name: str
    frequency_ratio: float
    swarasthana_name: str


class RagaComposition(BaseModel):
    title: str
    composer: str
    tala: str
    language: str


class RagaDetail(BaseModel):
    id: str
    slug: str
    canonical_name: str
    alternate_names: List[str] = Field(default_factory=list)
    melakarta_number: Optional[int] = None
    is_melakarta: bool = False
    parent_raga: Optional[str] = None
    chakra: Optional[str] = None
    arohanam: str
    avarohanam: str
    arohanam_notes: List[str]
    avarohanam_notes: List[str]
    swaras: List[SwaraInfo]
    characteristic_phrases: List[str] = Field(default_factory=list)
    mood_and_rasa: Optional[str] = None
    educational_summary: str
    historical_context: str
    famous_compositions: List[RagaComposition] = Field(default_factory=list)
    sources: List[SourceMetadata] = Field(default_factory=list)
    rights: RightsMetadata
    review_status: ReviewStatus
    reviewer_name: Optional[str] = None
    reviewed_at: Optional[str] = None


class TalaBeatAction(BaseModel):
    beat_number: int
    anga: str # "Laghu", "Dhrutam", "Anudhrutam"
    action_type: str # "thattu" (clap), "finger_count", "veecheduthal" (wave)
    finger_or_motion_label: str
    syllable: Optional[str] = None


class TalaDetail(BaseModel):
    id: str
    slug: str
    canonical_name: str
    angas_formula: str # e.g. "I₄ + O + O"
    total_aksharas: int
    laghu_beats: int
    dhrutam_count: int
    jati: str # e.g. "Chatusra"
    description: str
    beat_actions: List[TalaBeatAction]
    common_compositions: List[str] = Field(default_factory=list)
    sources: List[SourceMetadata] = Field(default_factory=list)
    rights: RightsMetadata
    review_status: ReviewStatus
    reviewer_name: Optional[str] = None
    reviewed_at: Optional[str] = None


class InstrumentSample(BaseModel):
    label: str
    description: str
    audio_url: Optional[str] = None
    attribution: str


class InstrumentDetail(BaseModel):
    id: str
    slug: str
    canonical_name: str
    family: str # Chordophone, Membranophone, Aerophone, Idiophone
    materials: List[str]
    playing_technique: str
    tuning_system: str
    role_in_concert: str
    historical_context: str
    learning_curve_guide: str
    samples: List[InstrumentSample] = Field(default_factory=list)
    sources: List[SourceMetadata] = Field(default_factory=list)
    rights: RightsMetadata
    review_status: ReviewStatus
    reviewer_name: Optional[str] = None
    reviewed_at: Optional[str] = None


class GlossaryItem(BaseModel):
    id: str
    term: str
    category: str # "Fundamentals", "Rhythm", "Melody", "Aesthetics"
    pronunciation: str
    definition: str
    cultural_context: str
    related_terms: List[str] = Field(default_factory=list)
    sources: List[SourceMetadata] = Field(default_factory=list)
