from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    display_name: str = Field(..., min_length=2, max_length=100)
    experience_level: Optional[str] = "beginner"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_seconds: int


class UserProfileOut(BaseModel):
    display_name: str
    preferred_tonic: str
    preferred_locale: str
    experience_level: str
    notes: Optional[str] = None


class UserOut(BaseModel):
    id: str
    email: str
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileOut] = None


class BookmarkCreate(BaseModel):
    content_type: str # "raga", "tala", "instrument", "lesson"
    content_slug: str


class BookmarkOut(BaseModel):
    id: str
    content_type: str
    content_slug: str
    created_at: datetime


class LessonProgressUpdate(BaseModel):
    lesson_id: str
    status: str = "completed"


class LessonProgressOut(BaseModel):
    lesson_id: str
    status: str
    completed_at: datetime
