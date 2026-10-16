import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    lesson_progress = relationship("LessonProgress", back_populates="user", cascade="all, delete-orphan")
    practice_sessions = relationship("PracticeSession", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    preferred_tonic = Column(String(10), default="C")
    preferred_locale = Column(String(10), default="en")
    experience_level = Column(String(50), default="beginner") # beginner, student, practising_musician
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    content_type = Column(String(50), nullable=False) # raga, tala, instrument, lesson
    content_slug = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="bookmarks")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    lesson_id = Column(String(100), index=True, nullable=False)
    status = Column(String(30), default="completed") # in_progress, completed
    completed_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="lesson_progress")


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    focus = Column(String(200), nullable=False)
    tonic = Column(String(10), default="C")
    tala_id = Column(String(50), default="adi-tala")
    duration_seconds = Column(Integer, default=0)
    notes = Column(Text, default="")
    has_recording = Column(Boolean, default=False)
    recording_asset_key = Column(String(255), nullable=True)
    started_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="practice_sessions")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(100), nullable=False)
    timestamp = Column(DateTime(timezone=True), default=utc_now)
    details = Column(Text, nullable=True)
