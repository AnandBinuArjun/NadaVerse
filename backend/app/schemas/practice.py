from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ShrutiSettings(BaseModel):
    tonic: str = Field(default="C", description="Tonic note name (e.g., C, C#, D)")
    base_frequency_hz: float = Field(default=261.63, description="Adhara Shadjam frequency in Hertz")
    octave: int = Field(default=4, ge=2, le=5)
    volume: float = Field(default=0.75, ge=0.0, le=1.0)
    tuning_mode: str = Field(default="just_intonation", description="Carnatic swarasthana just ratios or 12-TET")
    harmonics_enabled: bool = True


class TalaMetronomeSettings(BaseModel):
    tala_id: str = "adi-tala"
    bpm: int = Field(default=72, ge=30, le=240)
    subdivisions_per_beat: int = Field(default=4, ge=1, le=8, description="Gati / Nadai (e.g. 4 for Chatusra nadai)")
    sound_timbre: str = Field(default="synthetic_mridangam", description="Sound profile: synthetic_mridangam, woodblock, chime")


class PracticeSessionCreate(BaseModel):
    focus: str = Field(..., max_length=150, description="e.g. Mayamalavagowla Jantai Varisai 1-4")
    tonic: Optional[str] = "C"
    tala_id: Optional[str] = "adi-tala"
    notes: Optional[str] = Field(default="", max_length=2000)
    duration_seconds: int = Field(default=0, ge=0, le=86400, description="Actual completed practice duration in elapsed seconds")
    planned_duration_seconds: Optional[int] = Field(default=None, ge=0, le=86400, description="Intended practice goal duration in seconds")
    status: Optional[str] = Field(default="completed", description="Lifecycle state: in_progress, completed, abandoned")


class PracticeSessionComplete(BaseModel):
    actual_duration_seconds: int = Field(..., ge=0, le=86400, description="Actual practice elapsed seconds completed")
    notes: Optional[str] = Field(default=None, max_length=2000)


class PracticeSessionOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_seconds: int
    planned_duration_seconds: Optional[int] = None
    status: str = "completed"
    focus: str
    tonic: Optional[str]
    tala_id: Optional[str]
    notes: str


class PracticeSummaryOut(BaseModel):
    total_completed_sessions: int
    total_completed_minutes: int
    weekly_completed_minutes: int
    consecutive_streak_days: int

