"""feature_tables_and_practice_lifecycle

Revision ID: 95d82f7c0a11
Revises: 74c0a37e6556
Create Date: 2026-10-17 15:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '95d82f7c0a11'
down_revision: Union[str, None] = '74c0a37e6556'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Update practice_sessions with new lifecycle columns
    with op.batch_alter_table('practice_sessions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('planned_duration_seconds', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('status', sa.String(length=30), nullable=True, server_default='completed'))
        batch_op.add_column(sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True))

    # 2. learning_groups
    op.create_table(
        'learning_groups',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('teacher_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['teacher_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_learning_groups_teacher_id', 'learning_groups', ['teacher_id'])

    # 3. group_members
    op.create_table(
        'group_members',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('group_id', sa.String(length=36), nullable=False),
        sa.Column('student_id', sa.String(length=36), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=True, server_default='active'),
        sa.Column('joined_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['group_id'], ['learning_groups.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['student_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_group_members_group_id', 'group_members', ['group_id'])
    op.create_index('ix_group_members_student_id', 'group_members', ['student_id'])

    # 4. group_invitations
    op.create_table(
        'group_invitations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('group_id', sa.String(length=36), nullable=False),
        sa.Column('token', sa.String(length=64), nullable=False),
        sa.Column('invited_email', sa.String(length=255), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_revoked', sa.Boolean(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['group_id'], ['learning_groups.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_group_invitations_group_id', 'group_invitations', ['group_id'])
    op.create_index('ix_group_invitations_token', 'group_invitations', ['token'], unique=True)

    # 5. assignments
    op.create_table(
        'assignments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('group_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('lesson_id', sa.String(length=100), nullable=True),
        sa.Column('exercise_id', sa.String(length=100), nullable=True),
        sa.Column('target_kalam', sa.Integer(), nullable=True, server_default='1'),
        sa.Column('target_bpm', sa.Integer(), nullable=True, server_default='60'),
        sa.Column('instructions', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True, server_default='draft'),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['group_id'], ['learning_groups.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_assignments_group_id', 'assignments', ['group_id'])

    # 6. assignment_submissions
    op.create_table(
        'assignment_submissions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('assignment_id', sa.String(length=36), nullable=False),
        sa.Column('student_id', sa.String(length=36), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=True, server_default='in_progress'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('measured_cent_error', sa.Text(), nullable=True),
        sa.Column('measured_stability_pct', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['assignment_id'], ['assignments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['student_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_assignment_submissions_assignment_id', 'assignment_submissions', ['assignment_id'])
    op.create_index('ix_assignment_submissions_student_id', 'assignment_submissions', ['student_id'])

    # 7. assignment_feedback
    op.create_table(
        'assignment_feedback',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('submission_id', sa.String(length=36), nullable=False),
        sa.Column('teacher_id', sa.String(length=36), nullable=False),
        sa.Column('feedback_text', sa.Text(), nullable=False),
        sa.Column('recommended_lessons', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['submission_id'], ['assignment_submissions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['teacher_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_assignment_feedback_submission_id', 'assignment_feedback', ['submission_id'])
    op.create_index('ix_assignment_feedback_teacher_id', 'assignment_feedback', ['teacher_id'])

    # 8. heritage_entries
    op.create_table(
        'heritage_entries',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('historical_period', sa.String(length=100), nullable=True),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('primary_contributor', sa.String(length=120), nullable=True),
        sa.Column('source_citations', sa.Text(), nullable=False),
        sa.Column('licensing_info', sa.String(length=150), nullable=True),
        sa.Column('editorial_status', sa.String(length=30), nullable=True, server_default='draft'),
        sa.Column('reviewer_notes', sa.Text(), nullable=True),
        sa.Column('submitter_id', sa.String(length=36), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['submitter_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_heritage_entries_slug', 'heritage_entries', ['slug'], unique=True)
    op.create_index('ix_heritage_entries_category', 'heritage_entries', ['category'])
    op.create_index('ix_heritage_entries_editorial_status', 'heritage_entries', ['editorial_status'])

    # 9. content_corrections
    op.create_table(
        'content_corrections',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('entity_type', sa.String(length=50), nullable=False),
        sa.Column('entity_name', sa.String(length=150), nullable=False),
        sa.Column('target_field', sa.String(length=100), nullable=False),
        sa.Column('proposed_edit', sa.Text(), nullable=False),
        sa.Column('citation_source', sa.Text(), nullable=False),
        sa.Column('submitter_name', sa.String(length=120), nullable=True),
        sa.Column('submitter_affiliation', sa.String(length=200), nullable=True),
        sa.Column('submitter_id', sa.String(length=36), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True, server_default='pending_review'),
        sa.Column('reviewer_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['submitter_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_content_corrections_status', 'content_corrections', ['status'])


def downgrade() -> None:
    op.drop_index('ix_content_corrections_status', table_name='content_corrections')
    op.drop_table('content_corrections')
    op.drop_index('ix_heritage_entries_editorial_status', table_name='heritage_entries')
    op.drop_index('ix_heritage_entries_category', table_name='heritage_entries')
    op.drop_index('ix_heritage_entries_slug', table_name='heritage_entries')
    op.drop_table('heritage_entries')
    op.drop_index('ix_assignment_feedback_teacher_id', table_name='assignment_feedback')
    op.drop_index('ix_assignment_feedback_submission_id', table_name='assignment_feedback')
    op.drop_table('assignment_feedback')
    op.drop_index('ix_assignment_submissions_student_id', table_name='assignment_submissions')
    op.drop_index('ix_assignment_submissions_assignment_id', table_name='assignment_submissions')
    op.drop_table('assignment_submissions')
    op.drop_index('ix_assignments_group_id', table_name='assignments')
    op.drop_table('assignments')
    op.drop_index('ix_group_invitations_token', table_name='group_invitations')
    op.drop_index('ix_group_invitations_group_id', table_name='group_invitations')
    op.drop_table('group_invitations')
    op.drop_index('ix_group_members_student_id', table_name='group_members')
    op.drop_index('ix_group_members_group_id', table_name='group_members')
    op.drop_table('group_members')
    op.drop_index('ix_learning_groups_teacher_id', table_name='learning_groups')
    op.drop_table('learning_groups')
    with op.batch_alter_table('practice_sessions', schema=None) as batch_op:
        batch_op.drop_column('completed_at')
        batch_op.drop_column('status')
        batch_op.drop_column('planned_duration_seconds')
