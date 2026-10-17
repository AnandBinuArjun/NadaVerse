"""
Pydantic Schemas for Teacher-Supported Learning.
100% Free Gurukulam learning groups, assignments, submissions, and feedback.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class LearningGroupCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=150)
    description: Optional[str] = Field(default="", max_length=1000)


class LearningGroupOut(BaseModel):
    id: str
    teacher_id: str
    name: str
    description: str
    created_at: datetime
    member_count: int = 0
    assignment_count: int = 0


class GroupInvitationCreate(BaseModel):
    invited_email: Optional[str] = Field(default=None, max_length=255)
    valid_days: int = Field(default=7, ge=1, le=30)


class GroupInvitationOut(BaseModel):
    id: str
    group_id: str
    token: str
    invited_email: Optional[str]
    expires_at: datetime
    is_revoked: bool
    created_at: datetime


class AssignmentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    lesson_id: Optional[str] = Field(default=None, max_length=100)
    exercise_id: Optional[str] = Field(default=None, max_length=100)
    target_kalam: int = Field(default=1, ge=1, le=3)
    target_bpm: int = Field(default=60, ge=40, le=240)
    instructions: Optional[str] = Field(default="", max_length=2000)
    due_days: Optional[int] = Field(default=14, ge=1, le=90)


class AssignmentOut(BaseModel):
    id: str
    group_id: str
    title: str
    lesson_id: Optional[str]
    exercise_id: Optional[str]
    target_kalam: int
    target_bpm: int
    instructions: str
    status: str
    due_date: Optional[datetime]
    created_at: datetime
    submission_count: int = 0


class AssignmentSubmissionCreate(BaseModel):
    notes: str = Field(..., min_length=2, max_length=2000)
    measured_cent_error: Optional[str] = None
    measured_stability_pct: Optional[str] = None


class AssignmentFeedbackCreate(BaseModel):
    feedback_text: str = Field(..., min_length=5, max_length=2000)
    recommended_lessons: Optional[str] = Field(default="", max_length=500)


class AssignmentFeedbackOut(BaseModel):
    id: str
    submission_id: str
    teacher_id: str
    feedback_text: str
    recommended_lessons: str
    created_at: datetime


class AssignmentSubmissionOut(BaseModel):
    id: str
    assignment_id: str
    student_id: str
    status: str
    notes: str
    measured_cent_error: Optional[str]
    measured_stability_pct: Optional[str]
    submitted_at: Optional[datetime]
    created_at: datetime
    feedback: Optional[AssignmentFeedbackOut] = None
