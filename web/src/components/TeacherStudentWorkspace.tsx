'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Plus,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LearningGroup {
  id: string;
  teacher_id: string;
  name: string;
  description: string;
  member_count: number;
  assignment_count: number;
}

interface Assignment {
  id: string;
  group_id: string;
  title: string;
  lesson_id?: string;
  exercise_id?: string;
  target_kalam: number;
  target_bpm: number;
  instructions: string;
  status: string;
  due_date?: string;
  created_at: string;
}

const DEMO_GROUPS: LearningGroup[] = [
  {
    id: 'group-demo-1',
    teacher_id: 'teacher-demo',
    name: 'Mayamalavagowla Foundation Cohort',
    description: 'Fundamental Sarali, Jantai, and Dhatu Varisai practice with Gamaka calibration',
    member_count: 14,
    assignment_count: 2
  },
  {
    id: 'group-demo-2',
    teacher_id: 'teacher-demo',
    name: 'Alankaram & Saptatala Speed Studio',
    description: 'Developing firm laya grasp across Dhruva, Matya, Rupaka, and Triputa talas in 3 kalams',
    member_count: 8,
    assignment_count: 1
  }
];

const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-demo-1',
    group_id: 'group-demo-1',
    title: 'Sarali Varisai 1 to 4 with Steady Microtonal Sa',
    target_kalam: 1,
    target_bpm: 60,
    instructions: 'Focus on full vocal resonance (Akaaram). Ensure Sa matches the Adhara Shadjam within 15 cents.',
    status: 'assigned',
    due_date: '2026-10-25T00:00:00Z',
    created_at: '2026-10-15T00:00:00Z'
  },
  {
    id: 'assign-demo-2',
    group_id: 'group-demo-1',
    title: 'Jantai Varisai 1 (Double Swara Stress) in 2nd Kalam',
    target_kalam: 2,
    target_bpm: 72,
    instructions: 'Apply crisp sphurita gamaka on the second swara of each pair (S-S, R-R, G-G) without dragging.',
    status: 'assigned',
    due_date: '2026-10-28T00:00:00Z',
    created_at: '2026-10-16T00:00:00Z'
  }
];

interface Props {
  currentUser?: { email: string; displayName: string } | null;
  onOpenAuth?: () => void;
  onNavigateToCurriculum?: (lessonId?: string) => void;
}

export const TeacherStudentWorkspace: React.FC<Props> = ({
  currentUser,
  onOpenAuth
}) => {
  const { lang } = useLanguage();
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [enrolledGroups, setEnrolledGroups] = useState<LearningGroup[]>([]);
  const [teachingGroups, setTeachingGroups] = useState<LearningGroup[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Invitation join modal/input
  const [joinToken, setJoinToken] = useState('');

  // Create group form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Create assignment form
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignExercise, setAssignExercise] = useState('sarali_varisai_1');
  const [assignKalam, setAssignKalam] = useState(1);
  const [assignBpm, setAssignBpm] = useState(60);
  const [assignInstructions, setAssignInstructions] = useState('');

  // Student submission form
  const [submittingAssignId, setSubmittingAssignId] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionCentError, setSubmissionCentError] = useState('');
  const [submissionStability, setSubmissionStability] = useState('');

  // Generated invitation token display
  const [generatedInvite, setGeneratedInvite] = useState<{ groupId: string; token: string } | null>(null);

  const makeHeaders = (includeJson: boolean = true): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (includeJson) headers['Content-Type'] = 'application/json';
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nadaverse_access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const loadData = useCallback(async () => {
    if (!currentUser) {
      if (isDemoMode) {
        setEnrolledGroups(DEMO_GROUPS);
        setTeachingGroups(DEMO_GROUPS);
        setAssignments(DEMO_ASSIGNMENTS);
        if (!activeGroupId) setActiveGroupId(DEMO_GROUPS[0].id);
      }
      return;
    }
    setErrorNotice(null);
    try {
      // Enrolled groups
      const enrollRes = await fetch('/api/v1/teaching/groups/enrolled', { headers: makeHeaders(false) });
      if (enrollRes.ok) {
        setEnrolledGroups(await enrollRes.json());
      }

      // My assignments as student
      const assignRes = await fetch('/api/v1/teaching/my-assignments', { headers: makeHeaders(false) });
      if (assignRes.ok) {
        setAssignments(await assignRes.json());
      }

      // Teaching groups
      const teachRes = await fetch('/api/v1/teaching/groups/teaching', { headers: makeHeaders(false) });
      if (teachRes.ok) {
        const tGroups: LearningGroup[] = await teachRes.json();
        setTeachingGroups(tGroups);
        if (tGroups.length > 0 && !activeGroupId) {
          setActiveGroupId(tGroups[0].id);
        }
      }
    } catch {
      setErrorNotice('Could not load Gurukulam records.');
    }
  }, [currentUser, isDemoMode, activeGroupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Join via Token
  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinToken.trim()) return;
    setErrorNotice(null);
    setSuccessNotice(null);
    try {
      const res = await fetch('/api/v1/teaching/invitations/accept', {
        method: 'POST',
        headers: makeHeaders(true),
        body: JSON.stringify({ token: joinToken.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessNotice('Successfully joined Gurukulam group!');
        setJoinToken('');
        loadData();
      } else {
        setErrorNotice(data.detail || 'Could not join group with this token.');
      }
    } catch {
      setErrorNotice('Network error while joining group.');
    }
  };

  // Handle Create Group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setErrorNotice(null);
    try {
      const res = await fetch('/api/v1/teaching/groups', {
        method: 'POST',
        headers: makeHeaders(true),
        body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
      });
      if (res.ok) {
        setNewGroupName('');
        setNewGroupDesc('');
        setSuccessNotice('New Gurukulam class created!');
        loadData();
      }
    } catch {
      setErrorNotice('Error creating Gurukulam group.');
    }
  };

  // Handle Generate Invite Token
  const handleGenerateInvite = async (groupId: string) => {
    setErrorNotice(null);
    try {
      const res = await fetch(`/api/v1/teaching/groups/${groupId}/invitations`, {
        method: 'POST',
        headers: makeHeaders(true),
        body: JSON.stringify({ valid_days: 7 }),
      });
      if (res.ok) {
        const inv = await res.json();
        setGeneratedInvite({ groupId, token: inv.token });
      }
    } catch {
      setErrorNotice('Failed to generate invite token.');
    }
  };

  // Handle Create Assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroupId || !assignTitle.trim()) return;
    setErrorNotice(null);
    try {
      const res = await fetch(`/api/v1/teaching/groups/${activeGroupId}/assignments`, {
        method: 'POST',
        headers: makeHeaders(true),
        body: JSON.stringify({
          title: assignTitle,
          exercise_id: assignExercise,
          target_kalam: assignKalam,
          target_bpm: assignBpm,
          instructions: assignInstructions,
        }),
      });
      if (res.ok) {
        setAssignTitle('');
        setAssignInstructions('');
        setSuccessNotice('Practice assignment published to students!');
        loadData();
      }
    } catch {
      setErrorNotice('Failed to publish assignment.');
    }
  };

  // Handle Student Submit
  const handleSubmitResponse = async (assignmentId: string) => {
    if (!submissionNotes.trim()) return;
    setErrorNotice(null);
    try {
      const res = await fetch(`/api/v1/teaching/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: makeHeaders(true),
        body: JSON.stringify({
          notes: submissionNotes,
          measured_cent_error: submissionCentError || undefined,
          measured_stability_pct: submissionStability || undefined,
        }),
      });
      if (res.ok) {
        setSubmittingAssignId(null);
        setSubmissionNotes('');
        setSubmissionCentError('');
        setSubmissionStability('');
        setSuccessNotice('Practice reflections submitted to your teacher!');
        loadData();
      }
    } catch {
      setErrorNotice('Failed to submit assignment notes.');
    }
  };

  if (!currentUser && !isDemoMode) {
    return (
      <div className="bg-[#14130f] border border-[#C7A45B]/20 rounded-3xl p-8 text-center shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C7A45B]/10 border border-[#C7A45B]/25 flex items-center justify-center text-[#C7A45B] mb-4">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold font-serif text-[#F4EBDD]">
          {lang === 'ml' ? 'ഗുരുകുല വിദ്യാ സമ്പർക്കം' : 'Teacher-Supported Gurukulam Learning'}
        </h3>
        <p className="text-sm text-[#BDB4A4] max-w-lg mx-auto mt-2 leading-relaxed">
          {lang === 'ml'
            ? 'സൗജന്യ അദ്ധ്യാപക-ശിഷ്യ ബന്ധം. അഭ്യാസങ്ങൾ ഏൽപ്പിക്കുക, സാധക പുരോഗതി വിലയിരുത്തുക, ഗുരു നിർദ്ദേശങ്ങൾ സ്വീകരിക്കുക.'
            : 'Structured, 100% free teacher and student mentorship. Form learning groups, assign graded exercises, submit practice reflections, and receive personalized feedback.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-6 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C7A45B]/20 cursor-pointer"
            >
              {lang === 'ml' ? 'ലോഗിൻ / സൈൻ അപ്പ്' : 'Sign In or Create Free Account'}
            </button>
          )}
          <button
            onClick={() => setIsDemoMode(true)}
            className="px-5 py-2.5 rounded-xl border border-[#C7A45B]/40 hover:border-[#C7A45B] bg-[#1e1c17] hover:bg-[#282620] text-[#E0C98F] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'ഡെമോ പരീക്ഷിക്കുക' : 'Explore Interactive Demo'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#14130f] border border-[#C7A45B]/20 rounded-3xl p-6 sm:p-8 shadow-xl text-[#F4EBDD]">
      {/* Demo Mode Notice */}
      {isDemoMode && !currentUser && (
        <div className="mb-6 p-3.5 bg-[#C7A45B]/15 border border-[#C7A45B]/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs text-[#E0C98F]">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C7A45B] shrink-0" />
            <span>
              {lang === 'ml'
                ? 'ഗുരുകുലം മാതൃകാ പ്രദർശനം (Demo Preview). യഥാർത്ഥ ക്ലാസുകൾക്കായി അക്കൗണ്ട് ആരംഭിക്കുക.'
                : 'Interactive Gurukulam Demo Preview. Sign in to save real student-teacher cohorts.'}
            </span>
          </span>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold rounded-lg text-xs"
            >
              {lang === 'ml' ? 'സൈൻ ഇൻ' : 'Sign In'}
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#3B392F]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#C7A45B]/10 text-[#C7A45B] rounded-xl border border-[#C7A45B]/20">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' ? 'ഗുരുകുല വിദ്യാ സമ്പർക്കം' : 'Teacher-Supported Learning'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              100% Free
            </span>
          </div>
          <p className="text-xs text-[#BDB4A4] mt-1">
            {lang === 'ml'
              ? 'അദ്ധ്യാപക-ശിഷ്യ സൗജന്യ പഠന കളരി. ഗ്രൂപ്പുകൾ, അസൈൻമെന്റുകൾ, അഭിപ്രായങ്ങൾ.'
              : 'Collaborative Carnatic pedagogy. Direct teacher assignments, structured practice reviews, and feedback.'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-[#0d0c0a] p-1 rounded-xl border border-[#C7A45B]/20">
          <button
            onClick={() => setRoleTab('student')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              roleTab === 'student'
                ? 'bg-[#C7A45B] text-[#11110F] shadow'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
            }`}
          >
            {lang === 'ml' ? 'ശിഷ്യൻ (Student)' : 'Student Mode'}
          </button>
          <button
            onClick={() => setRoleTab('teacher')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              roleTab === 'teacher'
                ? 'bg-[#C7A45B] text-[#11110F] shadow'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
            }`}
          >
            {lang === 'ml' ? 'ഗുരു (Teacher)' : 'Teacher Mode'}
          </button>
        </div>
      </div>

      {/* Notices */}
      {errorNotice && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}
      {successNotice && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* STUDENT MODE */}
      {roleTab === 'student' && (
        <div className="mt-6 space-y-6">
          {/* Join Group via Invitation Token */}
          <div className="p-4 bg-[#0d0c0a]/60 border border-[#C7A45B]/15 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7A45B] mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Join Gurukulam via Invitation Token
            </h4>
            <form onSubmit={handleJoinGroup} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste invitation token from your teacher..."
                value={joinToken}
                onChange={(e) => setJoinToken(e.target.value)}
                className="flex-1 bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs rounded-xl transition-colors"
              >
                Join Group
              </button>
            </form>
          </div>

          {/* Enrolled Groups */}
          <div>
            <h4 className="text-sm font-bold text-[#F4EBDD] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C7A45B]" /> Enrolled Learning Groups ({enrolledGroups.length})
            </h4>
            {enrolledGroups.length === 0 ? (
              <p className="text-xs text-[#BDB4A4] italic">You have not joined any Gurukulam classes yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enrolledGroups.map((g) => (
                  <div key={g.id} className="p-3.5 bg-[#191916] border border-[#3B392F] rounded-xl">
                    <span className="font-semibold text-sm text-[#F4EBDD] block">{g.name}</span>
                    <p className="text-xs text-[#BDB4A4] mt-1">{g.description || 'Carnatic class group'}</p>
                    <span className="inline-block mt-2 text-[10px] text-[#C7A45B] font-mono">
                      {g.member_count} Active Students
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Tasks */}
          <div>
            <h4 className="text-sm font-bold text-[#F4EBDD] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C7A45B]" /> My Assigned Tasks ({assignments.length})
            </h4>
            {assignments.length === 0 ? (
              <p className="text-xs text-[#BDB4A4] italic">No pending assignments from your teacher.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => (
                  <div key={a.id} className="p-4 bg-[#191916] border border-[#3B392F] rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-[#F4EBDD]">{a.title}</h5>
                        <p className="text-xs text-[#BDB4A4] mt-1">{a.instructions}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-mono text-[#C7A45B]">
                          <span>Kalam: {a.target_kalam}</span>
                          <span>•</span>
                          <span>BPM: {a.target_bpm}</span>
                          {a.due_date && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400">Due: {new Date(a.due_date).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSubmittingAssignId(a.id)}
                        className="px-3 py-1.5 bg-[#C7A45B]/10 hover:bg-[#C7A45B]/20 border border-[#C7A45B]/30 rounded-lg text-xs font-semibold text-[#C7A45B] transition-colors"
                      >
                        Submit Response
                      </button>
                    </div>

                    {/* Submit Response Form Modal/Inline */}
                    {submittingAssignId === a.id && (
                      <div className="mt-4 p-3 bg-[#0d0c0a] border border-[#C7A45B]/30 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-[#C7A45B] block">Submit Practice Reflections</span>
                        <textarea
                          placeholder="Describe your practice session, swara placement, challenges faced..."
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                          className="w-full bg-[#191916] border border-[#3B392F] rounded-lg p-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B] h-20"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Mean cent error (e.g. 14.2)"
                            value={submissionCentError}
                            onChange={(e) => setSubmissionCentError(e.target.value)}
                            className="bg-[#191916] border border-[#3B392F] rounded-lg p-2 text-xs text-[#F4EBDD]"
                          />
                          <input
                            type="text"
                            placeholder="Stability % (e.g. 85.0)"
                            value={submissionStability}
                            onChange={(e) => setSubmissionStability(e.target.value)}
                            className="bg-[#191916] border border-[#3B392F] rounded-lg p-2 text-xs text-[#F4EBDD]"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSubmittingAssignId(null)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmitResponse(a.id)}
                            className="px-3 py-1.5 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold rounded-lg text-xs"
                          >
                            Send to Teacher
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEACHER MODE */}
      {roleTab === 'teacher' && (
        <div className="mt-6 space-y-6">
          {/* Create Group */}
          <div className="p-4 bg-[#0d0c0a]/60 border border-[#C7A45B]/15 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7A45B] mb-3 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Create New Gurukulam Class
            </h4>
            <form onSubmit={handleCreateGroup} className="space-y-3">
              <input
                type="text"
                placeholder="Class Name (e.g. Mohanam Advanced Varisais)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
              />
              <input
                type="text"
                placeholder="Description / Syllabus Focus"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs rounded-xl transition-colors"
              >
                Create Gurukulam Class
              </button>
            </form>
          </div>

          {/* Manage Groups & Generate Invitations */}
          <div>
            <h4 className="text-sm font-bold text-[#F4EBDD] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C7A45B]" /> Classes You Teach ({teachingGroups.length})
            </h4>
            {teachingGroups.length === 0 ? (
              <p className="text-xs text-[#BDB4A4] italic">You have not created any classes yet.</p>
            ) : (
              <div className="space-y-3">
                {teachingGroups.map((g) => (
                  <div key={g.id} className="p-4 bg-[#191916] border border-[#3B392F] rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-sm text-[#F4EBDD]">{g.name}</h5>
                        <p className="text-xs text-[#BDB4A4] mt-0.5">{g.description}</p>
                        <span className="text-[11px] text-[#C7A45B] font-mono mt-1 block">
                          {g.member_count} Enrolled Students • {g.assignment_count} Assignments
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGenerateInvite(g.id)}
                          className="px-3 py-1.5 bg-[#C7A45B]/10 hover:bg-[#C7A45B]/20 border border-[#C7A45B]/30 rounded-lg text-xs font-semibold text-[#C7A45B] flex items-center gap-1.5"
                        >
                          <Key className="w-3.5 h-3.5" /> Generate Student Invite
                        </button>
                        <button
                          onClick={() => setActiveGroupId(g.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            activeGroupId === g.id
                              ? 'bg-[#C7A45B] text-[#11110F]'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          Select
                        </button>
                      </div>
                    </div>

                    {/* Display Generated Token */}
                    {generatedInvite && generatedInvite.groupId === g.id && (
                      <div className="mt-3 p-3 bg-[#0d0c0a] border border-emerald-500/30 rounded-lg flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-400">
                          Invite Token: <strong className="select-all">{generatedInvite.token}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400">Valid for 7 days</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Assignment for Active Group */}
          {activeGroupId && (
            <div className="p-4 bg-[#0d0c0a]/60 border border-[#C7A45B]/25 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7A45B] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Create Assignment for Selected Class
              </h4>
              <form onSubmit={handleCreateAssignment} className="space-y-3">
                <input
                  type="text"
                  placeholder="Assignment Title (e.g. Jantai Varisai 1 in 2nd Kalam)"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Curriculum Exercise</label>
                    <select
                      value={assignExercise}
                      onChange={(e) => setAssignExercise(e.target.value)}
                      className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                    >
                      <option value="sarali_varisai_1">Sarali Varisai 1</option>
                      <option value="sarali_varisai_2">Sarali Varisai 2</option>
                      <option value="jantai_varisai_1">Jantai Varisai 1</option>
                      <option value="dhatu_varisai_1">Dhatu Varisai 1</option>
                      <option value="alankaram_dhruva">Dhruva Tala Alankaram</option>
                      <option value="varnam_ninnukori">Varnam: Ninnukori (Mohanam)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Target Speed (Kalam)</label>
                    <select
                      value={assignKalam}
                      onChange={(e) => setAssignKalam(Number(e.target.value))}
                      className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                    >
                      <option value={1}>1st Kalam (1 note/beat)</option>
                      <option value={2}>2nd Kalam (2 notes/beat)</option>
                      <option value={3}>3rd Kalam (4 notes/beat)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Metronome Tempo (BPM)</label>
                    <input
                      type="number"
                      value={assignBpm}
                      onChange={(e) => setAssignBpm(Number(e.target.value))}
                      className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Specific pedagogical instructions, breath control focus, gamaka nuances..."
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl p-2.5 text-xs text-[#F4EBDD] h-20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs rounded-xl"
                >
                  Publish Assignment to Class
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
