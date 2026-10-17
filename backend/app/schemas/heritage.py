"""
Pydantic Schemas for Carnatic Heritage Archive.
Curated, source-attributed historical records, instrument craftsmanship,
regional traditions, and peer-reviewed musicological history.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class HeritageEntryCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    category: str = Field(..., description="biography, instrument_craft, regional_tradition, treatise_history, oral_history")
    historical_period: str = Field(default="Historical", max_length=100)
    summary: str = Field(..., min_length=10, max_length=2000)
    content: str = Field(..., min_length=20)
    primary_contributor: Optional[str] = Field(default="Independent Scholar", max_length=120)
    source_citations: str = Field(..., min_length=5, description="Exact treatises, journal, or primary oral citations")
    licensing_info: str = Field(default="Public Domain / CC-BY-SA 4.0", max_length=150)


class HeritageReviewAction(BaseModel):
    editorial_status: str = Field(..., description="published or rejected")
    reviewer_notes: Optional[str] = Field(default="", max_length=1000)


class HeritageEntryOut(BaseModel):
    id: str
    slug: str
    title: str
    category: str
    historical_period: str
    summary: str
    content: str
    primary_contributor: str
    source_citations: str
    licensing_info: str
    editorial_status: str
    reviewer_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
