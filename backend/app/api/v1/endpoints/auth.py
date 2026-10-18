from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.entities import User, UserProfile, Bookmark, LessonProgress, AuditEvent
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserOut,
    UserProfileOut,
    BookmarkCreate,
    BookmarkOut,
    LessonProgressUpdate,
    LessonProgressOut,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & User Accounts"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check existing user
    stmt = select(User).where(User.email == payload.email)
    existing = await db.execute(stmt)
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Create new user
    user_role = payload.role if payload.role in ["student", "teacher", "editor", "admin"] else "student"
    new_user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role=user_role,
        is_active=True,
    )
    db.add(new_user)
    await db.flush()

    # Create associated profile
    profile = UserProfile(
        user_id=new_user.id,
        display_name=payload.display_name,
        experience_level=payload.experience_level or "beginner",
    )
    db.add(profile)

    # Audit log
    audit = AuditEvent(
        actor_id=new_user.id,
        action="user_registered",
        target_type="user",
        target_id=new_user.id,
        details="User self-registered via public portal",
    )
    db.add(audit)

    await db.commit()

    token = create_access_token(new_user.id)
    return TokenResponse(
        access_token=token,
        expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == payload.email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or user.deleted_at is not None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is currently inactive or suspended.",
        )

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    profile_out = None
    if current_user.profile:
        profile_out = UserProfileOut(
            display_name=current_user.profile.display_name,
            preferred_tonic=current_user.profile.preferred_tonic,
            preferred_locale=current_user.profile.preferred_locale,
            experience_level=current_user.profile.experience_level,
            notes=current_user.profile.notes,
        )
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        profile=profile_out,
    )


@router.delete("/me", status_code=status.HTTP_200_OK)
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Deactivates user account and permanently purges personal bookmarks,
    lesson progress, practice logs, and user profile data.
    """
    from app.models.entities import (
        PracticeSession,
        GroupMember,
        AssignmentSubmission,
        AssignmentFeedback,
        LearningGroup,
        HeritageEntry,
    )

    user_id = current_user.id

    # Purge all user-associated entities across learning, teaching, and practice domains
    await db.execute(delete(Bookmark).where(Bookmark.user_id == user_id))
    await db.execute(delete(LessonProgress).where(LessonProgress.user_id == user_id))
    await db.execute(delete(PracticeSession).where(PracticeSession.user_id == user_id))
    await db.execute(delete(UserProfile).where(UserProfile.user_id == user_id))
    await db.execute(delete(GroupMember).where(GroupMember.student_id == user_id))
    await db.execute(delete(AssignmentFeedback).where(AssignmentFeedback.teacher_id == user_id))
    await db.execute(delete(AssignmentSubmission).where(AssignmentSubmission.student_id == user_id))
    await db.execute(delete(LearningGroup).where(LearningGroup.teacher_id == user_id))

    # Anonymize any submitted heritage records
    heritage_res = await db.execute(select(HeritageEntry).where(HeritageEntry.submitter_id == user_id))
    for entry in heritage_res.scalars().all():
        entry.submitter_id = None
        entry.primary_contributor = "Anonymous Contributor (Account Deleted)"

    # Anonymize any submitted corrections
    from app.models.entities import ContentCorrection
    corr_res = await db.execute(select(ContentCorrection).where(ContentCorrection.submitter_id == user_id))
    for corr in corr_res.scalars().all():
        corr.submitter_id = None
        corr.submitter_name = "Anonymous Scholar (Account Deleted)"

    current_user.is_active = False
    current_user.deleted_at = datetime.now(timezone.utc)
    current_user.hashed_password = "account_deleted_unusable_hash"
    current_user.email = f"deleted_{user_id[:8]}@anonymized.nadaverse"

    audit = AuditEvent(
        actor_id=user_id,
        action="account_deleted",
        target_type="user",
        target_id=user_id,
        details="User requested account deletion. Personal data, profile, bookmarks, practice sessions, group memberships, and submissions purged.",
    )
    db.add(audit)
    await db.commit()
    return {
        "status": "success",
        "message": "Account successfully deactivated. All personal bookmarks, practice logs, group data, and profile records have been permanently purged.",
        "audit_event_logged": True
    }


# -----------------------------------------------------------------------------
# User Progress & Bookmarks Router
# -----------------------------------------------------------------------------
user_router = APIRouter(prefix="/me", tags=["User Preferences & Progress"])


@user_router.get("/bookmarks", response_model=List[BookmarkOut])
async def list_bookmarks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Bookmark).where(Bookmark.user_id == current_user.id).order_by(Bookmark.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@user_router.post("/bookmarks", response_model=BookmarkOut, status_code=status.HTTP_201_CREATED)
async def add_bookmark(
    payload: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if duplicate
    stmt = select(Bookmark).where(
        Bookmark.user_id == current_user.id,
        Bookmark.content_type == payload.content_type,
        Bookmark.content_slug == payload.content_slug
    )
    existing = await db.execute(stmt)
    bm = existing.scalars().first()
    if bm:
        return bm

    new_bm = Bookmark(
        user_id=current_user.id,
        content_type=payload.content_type,
        content_slug=payload.content_slug,
    )
    db.add(new_bm)
    await db.commit()
    await db.refresh(new_bm)
    return new_bm


@user_router.delete("/bookmarks/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(
    bookmark_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Object-level authorization: ensure bookmark belongs to current user
    stmt = select(Bookmark).where(Bookmark.id == bookmark_id, Bookmark.user_id == current_user.id)
    res = await db.execute(stmt)
    bm = res.scalars().first()
    if not bm:
        raise HTTPException(status_code=404, detail="Bookmark not found or does not belong to you.")
    
    await db.delete(bm)
    await db.commit()


@user_router.get("/progress", response_model=List[LessonProgressOut])
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(LessonProgress).where(LessonProgress.user_id == current_user.id)
    res = await db.execute(stmt)
    return res.scalars().all()


@user_router.put("/progress/{lesson_id}", response_model=LessonProgressOut)
async def update_progress(
    lesson_id: str,
    payload: LessonProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(LessonProgress).where(LessonProgress.user_id == current_user.id, LessonProgress.lesson_id == lesson_id)
    res = await db.execute(stmt)
    progress = res.scalars().first()

    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            status=payload.status,
            completed_at=datetime.now(timezone.utc)
        )
        db.add(progress)
    else:
        progress.status = payload.status
        progress.completed_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(progress)
    return progress


@user_router.get("/export", status_code=status.HTTP_200_OK)
async def export_my_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    FI-002: Generates a complete, user-scoped data export strictly containing the
    authenticated learner's owned profile, practice logs, bookmarks, and learning progress.
    Guarantees 100% data ownership and isolation from any other learner's private records.
    """
    from app.models.entities import PracticeSession, GroupMember, AssignmentSubmission

    user_id = current_user.id

    # 1. Profile
    profile_data = None
    if current_user.profile:
        profile_data = {
            "display_name": current_user.profile.display_name,
            "preferred_tonic": current_user.profile.preferred_tonic,
            "preferred_locale": current_user.profile.preferred_locale,
            "experience_level": current_user.profile.experience_level,
            "notes": current_user.profile.notes,
        }

    # 2. Bookmarks
    bm_res = await db.execute(select(Bookmark).where(Bookmark.user_id == user_id).order_by(Bookmark.created_at.desc()))
    bookmarks = [
        {
            "id": bm.id,
            "content_type": bm.content_type,
            "content_slug": bm.content_slug,
            "created_at": bm.created_at.isoformat() if bm.created_at else None,
        }
        for bm in bm_res.scalars().all()
    ]

    # 3. Lesson Progress
    prog_res = await db.execute(select(LessonProgress).where(LessonProgress.user_id == user_id))
    progress = [
        {
            "id": p.id,
            "lesson_id": p.lesson_id,
            "status": p.status,
            "completed_at": p.completed_at.isoformat() if p.completed_at else None,
        }
        for p in prog_res.scalars().all()
    ]

    # 4. Practice Sessions
    ps_res = await db.execute(select(PracticeSession).where(PracticeSession.user_id == user_id).order_by(PracticeSession.started_at.desc()))
    sessions = [
        {
            "id": s.id,
            "started_at": s.started_at.isoformat() if s.started_at else None,
            "completed_at": s.completed_at.isoformat() if s.completed_at else None,
            "duration_seconds": s.duration_seconds,
            "planned_duration_seconds": s.planned_duration_seconds,
            "status": s.status,
            "focus": s.focus,
            "tonic": s.tonic,
            "tala_id": s.tala_id,
            "notes": s.notes,
        }
        for s in ps_res.scalars().all()
    ]

    # 5. Group Memberships
    gm_res = await db.execute(select(GroupMember).where(GroupMember.student_id == user_id))
    memberships = [
        {
            "group_id": gm.group_id,
            "joined_at": gm.joined_at.isoformat() if gm.joined_at else None,
        }
        for gm in gm_res.scalars().all()
    ]

    # 6. Submissions
    sub_res = await db.execute(select(AssignmentSubmission).where(AssignmentSubmission.student_id == user_id))
    submissions = [
        {
            "id": sub.id,
            "assignment_id": sub.assignment_id,
            "status": sub.status,
            "audio_duration_seconds": sub.audio_duration_seconds,
            "acoustic_stability_score": sub.acoustic_stability_score,
            "notes": sub.notes,
            "submitted_at": sub.submitted_at.isoformat() if sub.submitted_at else None,
        }
        for sub in sub_res.scalars().all()
    ]

    return {
        "export_metadata": {
            "application": "NadaVerse Carnatic Platform",
            "service": "nadaverse-authoritative-api",
            "version": "1.0.0",
            "user_id": user_id,
            "email": current_user.email,
            "role": current_user.role,
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "retention_policy": "User data is 100% owned by the learner. No data is sold, monetized, or shared with third parties. Upon account deletion, all personal data is permanently purged.",
        },
        "profile": profile_data,
        "bookmarks": bookmarks,
        "lesson_progress": progress,
        "practice_sessions": sessions,
        "group_memberships": memberships,
        "submissions": submissions,
    }


@user_router.delete("", status_code=status.HTTP_200_OK)
async def delete_my_account_via_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    FI-002: Alias for account deletion under /api/v1/me matching REST standard.
    """
    return await delete_my_account(current_user=current_user, db=db)

