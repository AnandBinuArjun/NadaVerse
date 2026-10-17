"""
Curriculum and Learning Progress API Endpoints
Provides authenticated and guest curriculum progression tracking,
lesson completion persistence, and quiz attempt recording.
"""

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import User, LessonProgress
from app.api.deps import get_optional_current_user, get_current_user


router = APIRouter(prefix="/curriculum", tags=["Curriculum & Learning Paths"])


class LessonProgressCreate(BaseModel):
    lesson_id: str = Field(..., max_length=100, description="Unique identifier of curriculum lesson")
    status: str = Field(default="completed", description="Status: in_progress or completed")
    quiz_score: Optional[int] = Field(default=None, ge=0, le=100, description="Percentage score on quiz")


class LessonProgressOut(BaseModel):
    lesson_id: str
    status: str
    completed_at: datetime


class CurriculumProgressSummary(BaseModel):
    completed_lesson_ids: List[str]
    total_completed: int


@router.get("/progress", response_model=CurriculumProgressSummary)
async def get_user_curriculum_progress(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns list of completed lesson IDs for authenticated user, or empty for guest.
    """
    if not current_user:
        return CurriculumProgressSummary(completed_lesson_ids=[], total_completed=0)

    stmt = select(LessonProgress.lesson_id).where(
        LessonProgress.user_id == current_user.id,
        LessonProgress.status == "completed"
    )
    result = await db.execute(stmt)
    completed_ids = [row[0] for row in result.all()]

    return CurriculumProgressSummary(
        completed_lesson_ids=completed_ids,
        total_completed=len(completed_ids)
    )


@router.post("/progress", response_model=LessonProgressOut, status_code=status.HTTP_201_CREATED)
async def record_lesson_progress(
    payload: LessonProgressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Persists authenticated learner completion of a curriculum module.
    """
    # Check if existing record exists
    stmt = select(LessonProgress).where(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == payload.lesson_id
    )
    existing = (await db.execute(stmt)).scalars().first()

    now = datetime.now(timezone.utc)
    if existing:
        existing.status = payload.status
        existing.completed_at = now
        await db.commit()
        await db.refresh(existing)
        return LessonProgressOut(
            lesson_id=existing.lesson_id,
            status=existing.status,
            completed_at=existing.completed_at
        )

    new_record = LessonProgress(
        user_id=current_user.id,
        lesson_id=payload.lesson_id,
        status=payload.status,
        completed_at=now
    )
    db.add(new_record)
    await db.commit()
    await db.refresh(new_record)

    return LessonProgressOut(
        lesson_id=new_record.lesson_id,
        status=new_record.status,
        completed_at=new_record.completed_at
    )
