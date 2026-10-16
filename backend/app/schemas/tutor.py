from typing import List, Optional
from pydantic import BaseModel, Field


class TutorCitation(BaseModel):
    content_slug: str
    title: str
    content_type: str # "raga", "tala", "instrument", "concept"
    excerpt: str
    source_attribution: str


class TutorMessageRequest(BaseModel):
    conversation_id: Optional[str] = None
    query: str = Field(..., min_length=2, max_length=1000)
    current_context_slug: Optional[str] = Field(default=None, description="Current page or item being viewed")


class TutorResponse(BaseModel):
    conversation_id: str
    answer: str
    citations: List[TutorCitation] = Field(default_factory=list)
    confidence_level: str = Field(default="high", description="high, moderate, uncertain")
    uncertainty_note: Optional[str] = None
    suggested_followups: List[str] = Field(default_factory=list)
    pedagogical_disclaimer: str = "NadaVerse AI Tutor provides grounded educational guidance based on verified texts. It is an educational companion, not a substitute for an authoritative guru."
