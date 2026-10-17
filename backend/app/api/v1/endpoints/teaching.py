"""
Endpoints for Teacher-Supported Learning (Gurukulam).
100% Free teacher and student collaboration with strict backend authorization.
Enforces assignment state transitions and cross-user data isolation.
"""

from typing import List, Optional
import uuid
import secrets
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.entities import (
    User,
    LearningGroup,
    GroupMember,
    GroupInvitation,
    Assignment,
    AssignmentSubmission,
    AssignmentFeedback,
    AuditEvent
)
from app.api.deps import get_current_user
from app.schemas.teaching import (
    LearningGroupCreate,
    LearningGroupOut,
    GroupInvitationCreate,
    GroupInvitationOut,
    AssignmentCreate,
    AssignmentOut,
    AssignmentSubmissionCreate,
    AssignmentSubmissionOut,
    AssignmentFeedbackCreate,
    AssignmentFeedbackOut
)

router = APIRouter(prefix="/teaching", tags=["Teacher-Supported Learning"])


# -----------------------------------------------------------------------------
# Groups
# -----------------------------------------------------------------------------
@router.post("/groups", response_model=LearningGroupOut, status_code=status.HTTP_201_CREATED)
async def create_learning_group(
    payload: LearningGroupCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    group = LearningGroup(
        teacher_id=current_user.id,
        name=payload.name,
        description=payload.description or "",
    )
    db.add(group)
    await db.commit()
    await db.refresh(group)

    audit = AuditEvent(
        actor_id=current_user.id,
        action="create_learning_group",
        target_type="group",
        target_id=group.id,
        details=f"Created Gurukulam group '{group.name}'"
    )
    db.add(audit)
    await db.commit()

    return LearningGroupOut(
        id=group.id,
        teacher_id=group.teacher_id,
        name=group.name,
        description=group.description,
        created_at=group.created_at,
        member_count=0,
        assignment_count=0
    )


@router.get("/groups/teaching", response_model=List[LearningGroupOut])
async def list_teacher_groups(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(LearningGroup)
        .where(LearningGroup.teacher_id == current_user.id)
        .order_by(LearningGroup.created_at.desc())
    )
    res = await db.execute(stmt)
    groups = res.scalars().all()

    result: List[LearningGroupOut] = []
    for g in groups:
        # count members
        m_count = await db.scalar(
            select(func.count(GroupMember.id)).where(
                and_(GroupMember.group_id == g.id, GroupMember.status == "active")
            )
        ) or 0
        a_count = await db.scalar(
            select(func.count(Assignment.id)).where(Assignment.group_id == g.id)
        ) or 0
        result.append(
            LearningGroupOut(
                id=g.id,
                teacher_id=g.teacher_id,
                name=g.name,
                description=g.description,
                created_at=g.created_at,
                member_count=m_count,
                assignment_count=a_count
            )
        )
    return result


@router.get("/groups/enrolled", response_model=List[LearningGroupOut])
async def list_enrolled_groups(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(LearningGroup)
        .join(GroupMember, GroupMember.group_id == LearningGroup.id)
        .where(and_(GroupMember.student_id == current_user.id, GroupMember.status == "active"))
    )
    res = await db.execute(stmt)
    groups = res.scalars().all()

    result: List[LearningGroupOut] = []
    for g in groups:
        m_count = await db.scalar(
            select(func.count(GroupMember.id)).where(
                and_(GroupMember.group_id == g.id, GroupMember.status == "active")
            )
        ) or 0
        a_count = await db.scalar(
            select(func.count(Assignment.id)).where(
                and_(Assignment.group_id == g.id, Assignment.status == "published")
            )
        ) or 0
        result.append(
            LearningGroupOut(
                id=g.id,
                teacher_id=g.teacher_id,
                name=g.name,
                description=g.description,
                created_at=g.created_at,
                member_count=m_count,
                assignment_count=a_count
            )
        )
    return result


# -----------------------------------------------------------------------------
# Invitations & Joining
# -----------------------------------------------------------------------------
@router.post("/groups/{group_id}/invitations", response_model=GroupInvitationOut, status_code=status.HTTP_201_CREATED)
async def create_invitation(
    group_id: str,
    payload: GroupInvitationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    group = await db.get(LearningGroup, group_id)
    if not group or group.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only group owner can generate invitations.")

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=payload.valid_days)

    invitation = GroupInvitation(
        group_id=group_id,
        token=token,
        invited_email=payload.invited_email,
        expires_at=expires_at,
        is_revoked=False
    )
    db.add(invitation)
    await db.commit()
    await db.refresh(invitation)

    return GroupInvitationOut(
        id=invitation.id,
        group_id=invitation.group_id,
        token=invitation.token,
        invited_email=invitation.invited_email,
        expires_at=invitation.expires_at,
        is_revoked=invitation.is_revoked,
        created_at=invitation.created_at
    )


from pydantic import BaseModel
class AcceptInvitationRequest(BaseModel):
    token: str

@router.post("/invitations/accept", status_code=status.HTTP_200_OK)
async def accept_invitation(
    payload: AcceptInvitationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(GroupInvitation).where(GroupInvitation.token == payload.token)
    res = await db.execute(stmt)
    invitation = res.scalar_one_or_none()

    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation token not found or invalid.")

    if invitation.is_revoked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This invitation token has been revoked by the teacher.")

    # Check expiration (ensure tz-aware)
    now = datetime.now(timezone.utc)
    exp = invitation.expires_at
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if now > exp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This invitation token has expired.")

    # Check if already active member
    member_stmt = select(GroupMember).where(
        and_(GroupMember.group_id == invitation.group_id, GroupMember.student_id == current_user.id)
    )
    m_res = await db.execute(member_stmt)
    existing_member = m_res.scalar_one_or_none()

    if existing_member:
        if existing_member.status == "active":
            return {"status": "success", "message": "You are already an active member of this group."}
        existing_member.status = "active"
        await db.commit()
        return {"status": "success", "message": "Successfully re-joined Gurukulam learning group."}

    new_member = GroupMember(
        group_id=invitation.group_id,
        student_id=current_user.id,
        status="active"
    )
    db.add(new_member)
    await db.commit()

    return {"status": "success", "message": "Successfully joined Gurukulam learning group."}


# -----------------------------------------------------------------------------
# Assignments
# -----------------------------------------------------------------------------
@router.post("/groups/{group_id}/assignments", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    group_id: str,
    payload: AssignmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    group = await db.get(LearningGroup, group_id)
    if not group or group.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teacher can create assignments for this group.")

    due_date = datetime.now(timezone.utc) + timedelta(days=payload.due_days) if payload.due_days else None

    assignment = Assignment(
        group_id=group_id,
        title=payload.title,
        lesson_id=payload.lesson_id,
        exercise_id=payload.exercise_id,
        target_kalam=payload.target_kalam,
        target_bpm=payload.target_bpm,
        instructions=payload.instructions or "",
        status="published",
        due_date=due_date
    )
    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)

    return AssignmentOut(
        id=assignment.id,
        group_id=assignment.group_id,
        title=assignment.title,
        lesson_id=assignment.lesson_id,
        exercise_id=assignment.exercise_id,
        target_kalam=assignment.target_kalam,
        target_bpm=assignment.target_bpm,
        instructions=assignment.instructions,
        status=assignment.status,
        due_date=assignment.due_date,
        created_at=assignment.created_at,
        submission_count=0
    )


@router.get("/groups/{group_id}/assignments", response_model=List[AssignmentOut])
async def list_group_assignments(
    group_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    group = await db.get(LearningGroup, group_id)
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found.")

    # Check if user is teacher or active member
    is_teacher = group.teacher_id == current_user.id
    if not is_teacher:
        member = await db.scalar(
            select(GroupMember).where(
                and_(GroupMember.group_id == group_id, GroupMember.student_id == current_user.id, GroupMember.status == "active")
            )
        )
        if not member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to group assignments.")

    stmt = select(Assignment).where(Assignment.group_id == group_id).order_by(Assignment.created_at.desc())
    res = await db.execute(stmt)
    assignments = res.scalars().all()

    result: List[AssignmentOut] = []
    for a in assignments:
        sub_count = await db.scalar(
            select(func.count(AssignmentSubmission.id)).where(AssignmentSubmission.assignment_id == a.id)
        ) or 0
        result.append(
            AssignmentOut(
                id=a.id,
                group_id=a.group_id,
                title=a.title,
                lesson_id=a.lesson_id,
                exercise_id=a.exercise_id,
                target_kalam=a.target_kalam,
                target_bpm=a.target_bpm,
                instructions=a.instructions,
                status=a.status,
                due_date=a.due_date,
                created_at=a.created_at,
                submission_count=sub_count
            )
        )
    return result


@router.get("/my-assignments", response_model=List[AssignmentOut])
async def list_my_assignments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Assignment)
        .join(LearningGroup, LearningGroup.id == Assignment.group_id)
        .join(GroupMember, GroupMember.group_id == LearningGroup.id)
        .where(and_(GroupMember.student_id == current_user.id, GroupMember.status == "active", Assignment.status == "published"))
        .order_by(Assignment.created_at.desc())
    )
    res = await db.execute(stmt)
    assignments = res.scalars().all()

    return [
        AssignmentOut(
            id=a.id,
            group_id=a.group_id,
            title=a.title,
            lesson_id=a.lesson_id,
            exercise_id=a.exercise_id,
            target_kalam=a.target_kalam,
            target_bpm=a.target_bpm,
            instructions=a.instructions,
            status=a.status,
            due_date=a.due_date,
            created_at=a.created_at,
            submission_count=0
        )
        for a in assignments
    ]


# -----------------------------------------------------------------------------
# Submissions & Teacher Feedback
# -----------------------------------------------------------------------------
@router.post("/assignments/{assignment_id}/submit", response_model=AssignmentSubmissionOut, status_code=status.HTTP_201_CREATED)
async def submit_assignment_response(
    assignment_id: str,
    payload: AssignmentSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignment = await db.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    # Verify user is enrolled student in this group
    member = await db.scalar(
        select(GroupMember).where(
            and_(GroupMember.group_id == assignment.group_id, GroupMember.student_id == current_user.id, GroupMember.status == "active")
        )
    )
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Must be an enrolled student in this group to submit.")

    # Check for existing submission to update or create
    sub_stmt = select(AssignmentSubmission).where(
        and_(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.student_id == current_user.id)
    )
    res = await db.execute(sub_stmt)
    sub = res.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if sub:
        sub.notes = payload.notes
        sub.measured_cent_error = payload.measured_cent_error
        sub.measured_stability_pct = payload.measured_stability_pct
        sub.status = "submitted"
        sub.submitted_at = now
    else:
        sub = AssignmentSubmission(
            assignment_id=assignment_id,
            student_id=current_user.id,
            status="submitted",
            notes=payload.notes,
            measured_cent_error=payload.measured_cent_error,
            measured_stability_pct=payload.measured_stability_pct,
            submitted_at=now
        )
        db.add(sub)

    await db.commit()
    await db.refresh(sub)

    return AssignmentSubmissionOut(
        id=sub.id,
        assignment_id=sub.assignment_id,
        student_id=sub.student_id,
        status=sub.status,
        notes=sub.notes,
        measured_cent_error=sub.measured_cent_error,
        measured_stability_pct=sub.measured_stability_pct,
        submitted_at=sub.submitted_at,
        created_at=sub.created_at,
        feedback=None
    )


@router.get("/assignments/{assignment_id}/my-submission", response_model=Optional[AssignmentSubmissionOut])
async def get_my_assignment_submission(
    assignment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignment = await db.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    stmt = (
        select(AssignmentSubmission)
        .options(selectinload(AssignmentSubmission.feedbacks))
        .where(
            and_(
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.student_id == current_user.id
            )
        )
    )
    res = await db.execute(stmt)
    sub = res.scalar_one_or_none()
    if not sub:
        return None

    fb_out = None
    if sub.feedbacks:
        fb = sub.feedbacks[0]
        fb_out = AssignmentFeedbackOut(
            id=fb.id,
            submission_id=fb.submission_id,
            teacher_id=fb.teacher_id,
            feedback_text=fb.feedback_text,
            recommended_lessons=fb.recommended_lessons or "",
            created_at=fb.created_at
        )

    return AssignmentSubmissionOut(
        id=sub.id,
        assignment_id=sub.assignment_id,
        student_id=sub.student_id,
        status=sub.status,
        notes=sub.notes,
        measured_cent_error=sub.measured_cent_error,
        measured_stability_pct=sub.measured_stability_pct,
        submitted_at=sub.submitted_at,
        created_at=sub.created_at,
        feedback=fb_out
    )


@router.get("/assignments/{assignment_id}/submissions", response_model=List[AssignmentSubmissionOut])
async def list_assignment_submissions(
    assignment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignment = await db.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    group = await db.get(LearningGroup, assignment.group_id)
    if not group or group.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the teacher can inspect student submissions.")

    stmt = (
        select(AssignmentSubmission)
        .options(selectinload(AssignmentSubmission.feedbacks))
        .where(AssignmentSubmission.assignment_id == assignment_id)
        .order_by(AssignmentSubmission.submitted_at.desc())
    )
    res = await db.execute(stmt)
    subs = res.scalars().all()

    out: List[AssignmentSubmissionOut] = []
    for s in subs:
        fb_out = None
        if s.feedbacks:
            fb = s.feedbacks[0]
            fb_out = AssignmentFeedbackOut(
                id=fb.id,
                submission_id=fb.submission_id,
                teacher_id=fb.teacher_id,
                feedback_text=fb.feedback_text,
                recommended_lessons=fb.recommended_lessons or "",
                created_at=fb.created_at
            )
        out.append(
            AssignmentSubmissionOut(
                id=s.id,
                assignment_id=s.assignment_id,
                student_id=s.student_id,
                status=s.status,
                notes=s.notes,
                measured_cent_error=s.measured_cent_error,
                measured_stability_pct=s.measured_stability_pct,
                submitted_at=s.submitted_at,
                created_at=s.created_at,
                feedback=fb_out
            )
        )
    return out


@router.post("/submissions/{submission_id}/feedback", response_model=AssignmentFeedbackOut, status_code=status.HTTP_201_CREATED)
async def provide_teacher_feedback(
    submission_id: str,
    payload: AssignmentFeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    sub = await db.get(AssignmentSubmission, submission_id)
    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found.")

    assignment = await db.get(Assignment, sub.assignment_id)
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated assignment not found.")

    group = await db.get(LearningGroup, assignment.group_id)
    if not group or group.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the teacher of this Gurukulam group can provide feedback.")

    feedback = AssignmentFeedback(
        submission_id=submission_id,
        teacher_id=current_user.id,
        feedback_text=payload.feedback_text,
        recommended_lessons=payload.recommended_lessons or ""
    )
    db.add(feedback)

    # State transition: submitted -> reviewed
    sub.status = "reviewed"

    await db.commit()
    await db.refresh(feedback)

    return AssignmentFeedbackOut(
        id=feedback.id,
        submission_id=feedback.submission_id,
        teacher_id=feedback.teacher_id,
        feedback_text=feedback.feedback_text,
        recommended_lessons=feedback.recommended_lessons,
        created_at=feedback.created_at
    )
