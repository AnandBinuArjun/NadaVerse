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
    role = Column(String(50), default="student", nullable=False) # student, teacher, editor, admin
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
    duration_seconds = Column(Integer, default=0)  # Actual completed elapsed seconds
    planned_duration_seconds = Column(Integer, nullable=True)  # Intended target duration
    notes = Column(Text, default="")
    has_recording = Column(Boolean, default=False)
    recording_asset_key = Column(String(255), nullable=True)
    status = Column(String(30), default="completed")  # completed, in_progress, paused, abandoned
    started_at = Column(DateTime(timezone=True), default=utc_now)
    completed_at = Column(DateTime(timezone=True), nullable=True)

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


# -----------------------------------------------------------------------------
# Feature 5: Teacher-Supported Learning Models
# -----------------------------------------------------------------------------
class LearningGroup(Base):
    __tablename__ = "learning_groups"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    teacher_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    teacher = relationship("User", foreign_keys=[teacher_id])
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    invitations = relationship("GroupInvitation", back_populates="group", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="group", cascade="all, delete-orphan")


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(36), ForeignKey("learning_groups.id", ondelete="CASCADE"), index=True, nullable=False)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status = Column(String(30), default="active")  # active, left, revoked
    joined_at = Column(DateTime(timezone=True), default=utc_now)

    group = relationship("LearningGroup", back_populates="members")
    student = relationship("User", foreign_keys=[student_id])


class GroupInvitation(Base):
    __tablename__ = "group_invitations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(36), ForeignKey("learning_groups.id", ondelete="CASCADE"), index=True, nullable=False)
    token = Column(String(64), unique=True, index=True, nullable=False)
    invited_email = Column(String(255), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    group = relationship("LearningGroup", back_populates="invitations")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(36), ForeignKey("learning_groups.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    lesson_id = Column(String(100), nullable=True)
    exercise_id = Column(String(100), nullable=True)
    target_kalam = Column(Integer, default=1)
    target_bpm = Column(Integer, default=60)
    instructions = Column(Text, default="")
    status = Column(String(30), default="draft")  # draft, published, archived
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    group = relationship("LearningGroup", back_populates="assignments")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assignment_id = Column(String(36), ForeignKey("assignments.id", ondelete="CASCADE"), index=True, nullable=False)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status = Column(String(30), default="in_progress")  # in_progress, submitted, reviewed, returned_for_revision
    notes = Column(Text, default="")
    measured_cent_error = Column(Text, nullable=True)
    measured_stability_pct = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", foreign_keys=[student_id])
    feedbacks = relationship("AssignmentFeedback", back_populates="submission", cascade="all, delete-orphan")


class AssignmentFeedback(Base):
    __tablename__ = "assignment_feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("assignment_submissions.id", ondelete="CASCADE"), index=True, nullable=False)
    teacher_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    feedback_text = Column(Text, nullable=False)
    recommended_lessons = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    submission = relationship("AssignmentSubmission", back_populates="feedbacks")
    teacher = relationship("User", foreign_keys=[teacher_id])


# -----------------------------------------------------------------------------
# Feature 6: Carnatic Heritage Archive Models
# -----------------------------------------------------------------------------
class HeritageEntry(Base):
    __tablename__ = "heritage_entries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(50), index=True, nullable=False)  # biography, instrument_craft, regional_tradition, treatise_history
    historical_period = Column(String(100), default="Historical")
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    primary_contributor = Column(String(120), default="NadaVerse Archive Board")
    source_citations = Column(Text, nullable=False)
    licensing_info = Column(String(150), default="Public Domain / CC-BY-SA 4.0")
    editorial_status = Column(String(30), default="draft", index=True)  # draft, pending_review, published, rejected
    reviewer_notes = Column(Text, nullable=True)
    submitter_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now)

    submitter = relationship("User", foreign_keys=[submitter_id])


# -----------------------------------------------------------------------------
# Feature: Peer-Review & Musicological Corrections Queue
# -----------------------------------------------------------------------------
class ContentCorrection(Base):
    __tablename__ = "content_corrections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    entity_type = Column(String(50), nullable=False)
    entity_name = Column(String(150), nullable=False)
    target_field = Column(String(100), nullable=False)
    proposed_edit = Column(Text, nullable=False)
    citation_source = Column(Text, nullable=False)
    submitter_name = Column(String(120), default="Anonymous Scholar")
    submitter_affiliation = Column(String(200), nullable=True)
    submitter_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), default="pending_review", index=True)  # pending_review, approved, rejected
    reviewer_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    submitter = relationship("User", foreign_keys=[submitter_id])
