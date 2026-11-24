'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Bookmark,
  Award,
  ArrowRight,
  RefreshCw,
  Info,
  Target,
  Headphones,
  Activity,
  FileEdit,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../lib/api';
import { TonicNote } from '../lib/audioEngine';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { VERIFIED_RAGAS } from '../data/carnaticData';
import { COMPOSITION_CATALOG } from '../data/compositionLibraryData';

interface PersonalisedLearningDashboardProps {
  currentUser: { email: string; displayName: string } | null;
  activeTonic: TonicNote;
  onNavigateSection: (section: string) => void;
  onOpenAuth: () => void;
  onStartPracticeSession: (title: string, minutes: number, focus: string) => void;
}

interface SadhanaRecord {
  id: string;
  date: string;
  focus: string;
  durationMinutes?: number;
  duration_minutes?: number;
  notes?: string;
}

export const PersonalisedLearningDashboard: React.FC<PersonalisedLearningDashboardProps> = ({
  currentUser,
  activeTonic,
  onNavigateSection,
  onOpenAuth,
  onStartPracticeSession,
}) => {
  const { lang } = useLanguage();
  const [experienceMode, setExperienceMode] = useState<'beginner' | 'standard' | 'advanced' | 'research'>('standard');
  const [selectedPathway, setSelectedPathway] = useState<'vocal' | 'violin' | 'veena' | 'mridangam'>('vocal');
  const [selectedTier, setSelectedTier] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [bookmarkedRagas, setBookmarkedRagas] = useState<string[]>([]);
  const [bookmarkedInstruments, setBookmarkedInstruments] = useState<string[]>([]);
  const [repertoireSlugs, setRepertoireSlugs] = useState<string[]>([]);
  const [sadhanaSessions, setSadhanaSessions] = useState<SadhanaRecord[]>([]);
  const [earTrainingCount, setEarTrainingCount] = useState<number>(0);
  const [earTrainingAvgScore, setEarTrainingAvgScore] = useState<number>(0);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState<number>(120);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'migrated' | 'error'>('idle');
  const [migrationSummary, setMigrationSummary] = useState<string>('');

  const loadLocalActivity = () => {
    if (typeof window === 'undefined') return;
    try {
      const rawLessons = localStorage.getItem('nadaverse_completed_lessons');
      if (rawLessons) setCompletedLessonIds(JSON.parse(rawLessons));

      const rawRagas = localStorage.getItem('nadaverse_bookmarked_ragas');
      if (rawRagas) setBookmarkedRagas(JSON.parse(rawRagas));

      const rawInst = localStorage.getItem('nadaverse_bookmarked_instruments');
      if (rawInst) setBookmarkedInstruments(JSON.parse(rawInst));

      const rawRep = localStorage.getItem('nadaverse_personal_repertoire');
      if (rawRep) {
        setRepertoireSlugs(JSON.parse(rawRep));
      } else {
        setRepertoireSlugs(['sarali-varisai-1-mayamalavagowla', 'sri-gananatha-malahari-geetham']);
      }

      const rawSessions = localStorage.getItem('nadaverse_sadhana_sessions');
      if (rawSessions) setSadhanaSessions(JSON.parse(rawSessions));

      const rawEar = localStorage.getItem('nadaverse_ear_training_history');
      if (rawEar) {
        const earList = JSON.parse(rawEar) as { scorePct: number }[];
        setEarTrainingCount(earList.length);
        if (earList.length > 0) {
          const avg = Math.round(earList.reduce((acc, cur) => acc + (cur.scorePct || 0), 0) / earList.length);
          setEarTrainingAvgScore(avg);
        }
      }

      const rawGoal = localStorage.getItem('nadaverse_weekly_goal_minutes');
      if (rawGoal) setWeeklyGoalMinutes(Math.max(30, parseInt(rawGoal, 10) || 120));
    } catch {}
  };

  useEffect(() => {
    loadLocalActivity();
    window.addEventListener('nadaverse:sadhana_updated', loadLocalActivity);
    window.addEventListener('nadaverse:bookmarks_updated', loadLocalActivity);
    window.addEventListener('nadaverse:ear_training_updated', loadLocalActivity);
    return () => {
      window.removeEventListener('nadaverse:sadhana_updated', loadLocalActivity);
      window.removeEventListener('nadaverse:bookmarks_updated', loadLocalActivity);
      window.removeEventListener('nadaverse:ear_training_updated', loadLocalActivity);
    };
  }, []);

  const totalPracticeMinutes = sadhanaSessions.reduce(
    (sum, s) => sum + (s.durationMinutes || s.duration_minutes || 15),
    0
  );

  const nextRecommendedLesson =
    CURRICULUM_LESSONS.find((l) => !completedLessonIds.includes(l.id)) || CURRICULUM_LESSONS[0];

  // Explainable, activity-grounded recommendations
  const explainableRecommendations = [
    {
      id: 'rec-lesson',
      titleEn: `Continue Lesson: ${nextRecommendedLesson.title}`,
      titleMl: `പാഠം തുടരുക: ${nextRecommendedLesson.titleMl || nextRecommendedLesson.title}`,
      reasonEn:
        completedLessonIds.length === 0
          ? 'Explainable Rationale: You have not yet recorded a completed curriculum lesson. Starting with foundational Shruti and Swarasthana alignment establishes your Adhara Shadjam reference.'
          : `Explainable Rationale: Based on your ${completedLessonIds.length} completed curriculum module(s), this is the next sequential prerequisite-unlocked lesson.`,
      reasonMl:
        completedLessonIds.length === 0
          ? 'ശുപാർശയുടെ കാരണം: അടിസ്ഥാന ശ്രുതിയും സ്വരസ്ഥാനങ്ങളും ഉറപ്പിക്കുന്നതിനായി ആദ്യ പാഠത്തിൽ നിന്ന് ആരംഭിക്കുക.'
          : `ശുപാർശയുടെ കാരണം: നിങ്ങൾ പൂർത്തിയാക്കിയ ${completedLessonIds.length} പാഠങ്ങളുടെ അടിസ്ഥാനത്തിൽ അടുത്ത പടിയായി ഈ പാഠം നിർദ്ദേശിക്കുന്നു.`,
      actionLabelEn: 'Resume Lesson',
      actionLabelMl: 'പാഠം തുറക്കുക',
      onAction: () => onNavigateSection('learn'),
    },
    {
      id: 'rec-ear',
      titleEn:
        earTrainingCount === 0
          ? 'Calibrate Swara Perception in Ear Training Academy'
          : `Ear Training Revision (Current Avg: ${earTrainingAvgScore}%)`,
      titleMl:
        earTrainingCount === 0
          ? 'സ്വര തിരിച്ചറിയൽ പരിശീലനം (Ear Training Academy)'
          : `ശ്രവണ പരിശീലന പുനരവലോകനം (ശരാശരി: ${earTrainingAvgScore}%)`,
      reasonEn:
        earTrainingCount === 0
          ? 'Explainable Rationale: No ear training attempts recorded yet. Active swara and prayoga discrimination strengthens internal Shruti perception before gamaka execution.'
          : `Explainable Rationale: Derived from ${earTrainingCount} deterministic ear training session(s) at tonic ${activeTonic.name}.`,
      reasonMl:
        earTrainingCount === 0
          ? 'ശുപാർശയുടെ കാരണം: സ്വരസ്ഥാനങ്ങൾ കേട്ട് തിരിച്ചറിയാനുള്ള ശേഷി വർദ്ധിപ്പിക്കാൻ ശ്രവണ പരിശീലനം സഹായിക്കും.'
          : `ശുപാർശയുടെ കാരണം: നിങ്ങളുടെ ${earTrainingCount} ശ്രവണ പരിശീലന സെഷനുകളുടെ അടിസ്ഥാനത്തിൽ തയ്യാറാക്കിയത്.`,
      actionLabelEn: 'Open Ear Training',
      actionLabelMl: 'ശ്രവണ കളരി തുറക്കുക',
      onAction: () => onNavigateSection('ear-training'),
    },
    {
      id: 'rec-sadhana',
      titleEn:
        selectedPathway === 'violin'
          ? 'Carnatic Violin Long-Bow & Pa-Sa-Pa-Sa Alignment (15 min)'
          : 'Mayamalavagowla Sarali & Gamaka Contour Sadhana (15 min)',
      titleMl:
        selectedPathway === 'violin'
          ? 'വയലിൻ ബോയിംഗ് & ശ്രുതി സാധക സെഷൻ (15 മിനിറ്റ്)'
          : 'മായാമാളവഗൗള സരളി വരിശ & ഗമക സാധകം (15 മിനിറ്റ്)',
      reasonEn: `Explainable Rationale: Tailored to your selected ${selectedPathway.toUpperCase()} (${selectedTier}) pathway and ${totalPracticeMinutes} logged Sadhana minutes across ${sadhanaSessions.length} session(s).`,
      reasonMl: `ശുപാർശയുടെ കാരണം: നിങ്ങൾ തിരഞ്ഞെടുത്ത ${selectedPathway.toUpperCase()} പാതയുടെയും ${totalPracticeMinutes} മിനിറ്റ് സാധകത്തിന്റെയും അടിസ്ഥാനത്തിൽ.`,
      actionLabelEn: 'Start 15m Sadhana',
      actionLabelMl: 'സാധകം തുടങ്ങുക',
      onAction: () =>
        onStartPracticeSession(
          selectedPathway === 'violin' ? 'Violin Bowing & Swarasthana Drill' : 'Mayamalavagowla Foundational Sadhana',
          15,
          selectedPathway === 'violin'
            ? 'Carnatic Violin Long-Bow & String Crossing'
            : 'Mayamalavagowla Sarali Varisai & Kampita Gamaka'
        ),
    },
  ];

  const handleMigrateGuestToAccount = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
    if (!token) {
      onOpenAuth();
      return;
    }

    setMigrationStatus('migrating');
    try {
      const payload = {
        completed_lesson_ids: completedLessonIds,
        bookmarked_raga_slugs: bookmarkedRagas,
        bookmarked_instrument_slugs: bookmarkedInstruments,
        practice_sessions: sadhanaSessions.slice(0, 15).map((s) => ({
          focus: s.focus || 'Carnatic Sadhana Session',
          tonic: activeTonic.name,
          tala_id: 'adi-tala',
          duration_minutes: Math.max(1, s.durationMinutes || s.duration_minutes || 15),
          notes: s.notes || '',
        })),
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/me/migrate-guest-state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setMigrationStatus('migrated');
        setMigrationSummary(
          lang === 'ml'
            ? `${data.migrated_lessons_count} പാഠങ്ങളും ${data.migrated_bookmarks_count} ബുക്ക്‌മാർക്കുകളും ${data.migrated_sessions_count} സാധക സെഷനുകളും അക്കൗണ്ടിലേക്ക് സുരക്ഷിതമായി മാറ്റി.`
            : `Synced ${data.migrated_lessons_count} lesson(s), ${data.migrated_bookmarks_count} bookmark(s), and ${data.migrated_sessions_count} practice session(s) to your account.`
        );
      } else {
        setMigrationStatus('error');
      }
    } catch {
      setMigrationStatus('error');
    }
  };

  const toggleRepertoireItem = (slug: string) => {
    const updated = repertoireSlugs.includes(slug)
      ? repertoireSlugs.filter((s) => s !== slug)
      : [...repertoireSlugs, slug];
    setRepertoireSlugs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nadaverse_personal_repertoire', JSON.stringify(updated));
    }
  };

  const progressPct = Math.min(100, Math.round((totalPracticeMinutes / Math.max(1, weeklyGoalMinutes)) * 100));

  return (
    <section
      className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-4 sm:p-7 lg:p-8 shadow-2xl space-y-6"
      aria-label="Personalised Learner Dashboard"
    >
      {/* Header & Guest-to-Account Migration Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#3B392F]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span>
              {lang === 'ml'
                ? 'വ്യക്തിഗത സംഗീത പഠന ഡാഷ്‌ബോർഡ്'
                : 'Personalised Carnatic Learning Sanctuary'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#F4EBDD]">
            {currentUser
              ? lang === 'ml'
                ? `സ്വാഗതം, ${currentUser.displayName}`
                : `Welcome back, ${currentUser.displayName}`
              : lang === 'ml'
              ? 'സ്വതന്ത്ര അതിഥി പഠന മോഡ് (100% സൗജന്യം)'
              : 'Guest Musician Workspace (100% Free Forever)'}
          </h2>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1">
            {lang === 'ml'
              ? `ആധാര ശ്രുതി: ${activeTonic.name} (${activeTonic.kattai} · ${activeTonic.frequency.toFixed(2)} Hz) — നിങ്ങളുടെ പഠന പുരോഗതിയും സാധക ശുപാർശകളും.`
              : `Adhara Shadjam: ${activeTonic.name} (${activeTonic.kattai} · ${activeTonic.frequency.toFixed(2)} Hz) — Activity-grounded progress, repertoire & studio shortcuts.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleMigrateGuestToAccount}
            disabled={migrationStatus === 'migrating'}
            className="px-4 py-2.5 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#C7A45B]/45 hover:border-[#C7A45B] text-xs font-mono text-[#E0C98F] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Migrate local guest progress to your authenticated account"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C7A45B] ${migrationStatus === 'migrating' ? 'animate-spin' : ''}`} />
            <span>
              {currentUser
                ? lang === 'ml'
                  ? 'അതിഥി പഠന വിവരങ്ങൾ അക്കൗണ്ടിലേക്ക് മാറ്റുക'
                  : 'Sync Guest Progress to Account'
                : lang === 'ml'
                ? 'അക്കൗണ്ടിലേക്ക് പുരോഗതി സൂക്ഷിക്കാൻ ലോഗിൻ ചെയ്യുക'
                : 'Sign In to Migrate Guest Progress'}
            </span>
          </button>
        </div>
      </div>

      {migrationStatus === 'migrated' && (
        <div className="p-3.5 rounded-xl bg-[#6EA887]/15 border border-[#6EA887]/40 text-xs text-[#F4EBDD] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#6EA887] shrink-0" />
          <span>{migrationSummary}</span>
        </div>
      )}

      {/* Pedagogical Honesty Disclaimer (Required by Section 4: Never confuse lesson completion with musical proficiency) */}
      <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/25 flex items-start gap-3 text-xs text-[#BDB4A4]">
        <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#E0C98F] font-semibold">
            {lang === 'ml'
              ? 'സംഗീത ശാസ്ത്ര അറിയിപ്പ് (പാഠപുരോഗതി ≠ സംഗീത വൈദഗ്ധ്യം): '
              : 'Pedagogical Integrity Notice (Lesson Completion ≠ Musical Proficiency): '}
          </strong>
          {lang === 'ml'
            ? 'പാഠങ്ങൾ പൂർത്തിയാക്കുന്നത് സൈദ്ധാന്തികമായ അറിവിനെ മാത്രമാണ് സൂചിപ്പിക്കുന്നത്. യഥാർത്ഥ കർണ്ണാടക സംഗീത വൈദഗ്ധ്യത്തിന് നിരന്തരമായ സാധകവും ഗുരുമുഖത്തുനിന്നുള്ള ശിക്ഷണവും അനിവാര്യമാണ്.'
            : 'Completing digital lessons or quizzes indicates conceptual familiarity, not vocal or instrumental mastery. Authentic Carnatic proficiency develops through sustained daily sadhana, critical listening, and guidance from a qualified guru.'}
        </div>
      </div>

      {/* Progressive Disclosure Experience Mode Switcher (Required by NadaVerse 2.0 Sec 37 — 100% Free) */}
      <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B] font-bold">
            {lang === 'ml' ? 'അനുഭവ തലം തിരഞ്ഞെടുക്കുക (Progressive Disclosure Mode):' : 'Progressive Experience Mode (100% Free Forever):'}
          </span>
          <p className="text-[11px] text-[#BDB4A4]">
            {experienceMode === 'beginner'
              ? 'Focused view highlighting Shruti, Foundational Curriculum, and Ear Training without advanced DSP clutter.'
              : experienceMode === 'standard'
              ? 'Balanced workspace with Ear Training, Gamaka Lab, 72 Melakartas, 35 Talas, and Swara Notation.'
              : experienceMode === 'advanced'
              ? 'Concert performer workspace unlocking Kutcheri Planner, Live Stage Mode, Virtual Ensemble, and Manodharma.'
              : 'Musicology & MIR workspace unlocking Spectrogram Lab, Monophonic Swara Transcription, Experimental Raga ID, and Knowledge Graph.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {[
            { id: 'beginner', labelEn: 'Beginner', labelMl: 'പ്രാരംഭം' },
            { id: 'standard', labelEn: 'Standard', labelMl: 'സാധാരണം' },
            { id: 'advanced', labelEn: 'Advanced Musician', labelMl: 'കച്ചേരി തലം' },
            { id: 'research', labelEn: 'Research & MIR', labelMl: 'ഗവേഷണം & MIR' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setExperienceMode(m.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                experienceMode === m.id
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-sm'
                  : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
              }`}
            >
              {lang === 'ml' ? m.labelMl : m.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Launch Hub for Flagship Expansion Studios */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          {
            id: 'ear-training',
            icon: Headphones,
            titleEn: 'Ear Training Academy',
            titleMl: 'ശ്രവണ പരിശീലന കളരി',
            subEn: 'Swara, Prayoga & Shruti',
            subMl: 'സ്വര-രാഗ തിരിച്ചറിയൽ',
            modes: ['beginner', 'standard', 'advanced', 'research'],
          },
          {
            id: 'gamaka',
            icon: Activity,
            titleEn: 'Gamaka Laboratory',
            titleMl: 'ഗമക പരീക്ഷണശാല',
            subEn: 'Dasavidha Contour DSP',
            subMl: 'ദശവിധ ഗമകങ്ങൾ',
            modes: ['standard', 'advanced', 'research'],
          },
          {
            id: 'melakarta',
            icon: Compass,
            titleEn: '72 Melakarta Universe',
            titleMl: '72 മേളകർത്താ ചക്രങ്ങൾ',
            subEn: '12 Chakras & Katapayadi',
            subMl: '12 ചക്രങ്ങളും രാഗങ്ങളും',
            modes: ['beginner', 'standard', 'advanced', 'research'],
          },
          {
            id: 'konnakol',
            icon: Layers,
            titleEn: 'Konnakol & 35 Talas',
            titleMl: 'കൊന്നക്കോൽ & 35 താളങ്ങൾ',
            subEn: '5 Nadais & Korvai Math',
            subMl: '5 നടകളും കോർവൈയും',
            modes: ['standard', 'advanced', 'research'],
          },
          {
            id: 'notation',
            icon: FileEdit,
            titleEn: 'Swara Notation & Manodharma',
            titleMl: 'സ്വര നൊട്ടേഷൻ & മനോധർമ്മം',
            subEn: 'Compose, Validate & Play',
            subMl: 'സ്വര രചനയും ആലാപനവും',
            modes: ['standard', 'advanced', 'research'],
          },
          {
            id: 'kutcheri',
            icon: Award,
            titleEn: 'Kutcheri, Stage & Ensemble',
            titleMl: 'കച്ചേരി പ്ലാനർ & സ്റ്റേജ് മോഡ്',
            subEn: 'Setlists, Stage & Mixer',
            subMl: 'കച്ചേരി & പക്കവാദ്യ മിക്സർ',
            modes: ['advanced', 'research', 'standard'],
          },
          {
            id: 'mir-lab',
            icon: Activity,
            titleEn: 'MIR & Spectrogram Lab',
            titleMl: 'MIR & സ്പെക്ട്രോഗ്രാം ലാബ്',
            subEn: 'Harmonics, Transcription & Raga ID',
            subMl: 'ട്രാൻസ്ക്രിപ്ഷൻ & രാഗ പരീക്ഷണം',
            modes: ['research', 'advanced', 'standard'],
          },
          {
            id: 'research',
            icon: Compass,
            titleEn: 'Knowledge Graph & 6-Lang Dict',
            titleMl: 'നോളജ് ഗ്രാഫ് & 6-ഭാഷാ നിഘണ്ടു',
            subEn: 'Phrase Search, Certs & Open API',
            subMl: 'സ്വര തിരച്ചിൽ & ഓപ്പൺ API',
            modes: ['research', 'advanced', 'standard', 'beginner'],
          },
        ]
          .filter((hub) => hub.modes.includes(experienceMode))
          .map((hub) => {
          const IconComp = hub.icon;
          return (
            <button
              key={hub.id}
              onClick={() => onNavigateSection(hub.id)}
              className="p-3.5 rounded-2xl bg-[#22221D] hover:bg-[#2a2922] border border-[#3B392F] hover:border-[#C7A45B] text-left transition-all group cursor-pointer shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-[#C7A45B]/15 border border-[#C7A45B]/35 flex items-center justify-center text-[#E0C98F] group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-colors mb-2.5">
                <IconComp className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm font-serif font-bold text-[#F4EBDD] group-hover:text-[#E0C98F] leading-snug">
                {lang === 'ml' ? hub.titleMl : hub.titleEn}
              </div>
              <div className="text-[11px] font-mono text-[#BDB4A4] mt-0.5">
                {lang === 'ml' ? hub.subMl : hub.subEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Metrics & Pathway Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Explainable Daily Recommendations & Instrument Pathway */}
        <div className="lg:col-span-7 space-y-5">
          {/* Instrument & Tier Selector */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B] font-semibold">
                {lang === 'ml' ? 'നിങ്ങളുടെ പഠന മാർഗ്ഗം (Pathway & Tier):' : 'Active Instrument Pathway & Tier:'}
              </span>
              <div className="flex items-center gap-1.5">
                {(['beginner', 'intermediate', 'advanced'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all cursor-pointer ${
                      selectedTier === tier
                        ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                        : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'vocal', labelEn: 'Gāyana (Vocal)', labelMl: 'വായ്പ്പാട്ട്' },
                { id: 'violin', labelEn: 'Carnatic Violin', labelMl: 'വയലിൻ' },
                { id: 'veena', labelEn: 'Saraswati Veena', labelMl: 'വീണ' },
                { id: 'mridangam', labelEn: 'Mridangam / Laya', labelMl: 'മൃദംഗം / ലയം' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathway(p.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    selectedPathway === p.id
                      ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#E0C98F] font-semibold'
                      : 'bg-[#191916] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {lang === 'ml' ? p.labelMl : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Explainable Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#E0C98F] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? 'വിശദീകരണത്തോടുകൂടിയ ദൈനംദിന പഠന ശുപാർശകൾ'
                  : 'Explainable Activity-Grounded Recommendations'}
              </span>
            </h3>

            {explainableRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-[#22221D] border border-[#3B392F] hover:border-[#C7A45B]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-serif font-bold text-[#F4EBDD]">
                    {lang === 'ml' ? rec.titleMl : rec.titleEn}
                  </div>
                  <p className="text-xs text-[#BDB4A4] leading-relaxed">
                    {lang === 'ml' ? rec.reasonMl : rec.reasonEn}
                  </p>
                </div>
                <button
                  onClick={rec.onAction}
                  className="px-4 py-2 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-xs whitespace-nowrap flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors"
                >
                  <span>{lang === 'ml' ? rec.actionLabelMl : rec.actionLabelEn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Weekly Objectives, Repertoire & Bookmarks */}
        <div className="lg:col-span-5 space-y-4">
          {/* Weekly Sadhana Objective Progress */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'പ്രതിവാര സാധക ലക്ഷ്യം' : 'Weekly Sadhana Objective'}</span>
              </span>
              <span className="text-xs font-mono text-[#E0C98F] font-bold">
                {totalPracticeMinutes} / {weeklyGoalMinutes} min ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#22221D] rounded-full overflow-hidden border border-[#3B392F]">
              <div
                className="h-full bg-gradient-to-r from-[#C7A45B] to-[#E0C98F] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-[#191916] border border-[#3B392F]">
                <div className="text-base font-serif font-bold text-[#F4EBDD]">
                  {completedLessonIds.length}/{CURRICULUM_LESSONS.length}
                </div>
                <div className="text-[10px] font-mono text-[#BDB4A4]">
                  {lang === 'ml' ? 'പാഠങ്ങൾ' : 'Lessons Read'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#191916] border border-[#3B392F]">
                <div className="text-base font-serif font-bold text-[#F4EBDD]">{sadhanaSessions.length}</div>
                <div className="text-[10px] font-mono text-[#BDB4A4]">
                  {lang === 'ml' ? 'സാധക സെഷനുകൾ' : 'Sadhana Logs'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#191916] border border-[#3B392F]">
                <div className="text-base font-serif font-bold text-[#F4EBDD]">
                  {earTrainingCount > 0 ? `${earTrainingAvgScore}%` : '—'}
                </div>
                <div className="text-[10px] font-mono text-[#BDB4A4]">
                  {lang === 'ml' ? 'ശ്രവണ കൃത്യത' : 'Ear Accuracy'}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Repertoire Tracker */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ml'
                    ? `സ്വന്തം കൃതി ശേഖരം (${repertoireSlugs.length})`
                    : `Personal Repertoire Tracker (${repertoireSlugs.length})`}
                </span>
              </span>
              <button
                onClick={() => onNavigateSection('compositions')}
                className="text-[11px] font-mono text-[#E0C98F] hover:underline cursor-pointer"
              >
                {lang === 'ml' ? 'എല്ലാ കൃതികളും →' : 'Open Studio →'}
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {COMPOSITION_CATALOG.slice(0, 6).map((comp) => {
                const inRep = repertoireSlugs.includes(comp.slug);
                return (
                  <div
                    key={comp.slug}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#191916] border border-[#3B392F] text-xs"
                  >
                    <div className="truncate">
                      <span className="font-semibold text-[#F4EBDD]">{comp.title}</span>
                      <span className="text-[#BDB4A4] font-mono text-[10px] ml-1.5">({comp.ragaName})</span>
                    </div>
                    <button
                      onClick={() => toggleRepertoireItem(comp.slug)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 cursor-pointer transition-colors ${
                        inRep
                          ? 'bg-[#6EA887]/20 text-[#6EA887] border border-[#6EA887]/40'
                          : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                      }`}
                    >
                      {inRep
                        ? lang === 'ml'
                          ? 'പഠിക്കുന്നു ✓'
                          : 'In Repertoire ✓'
                        : lang === 'ml'
                        ? '+ ചേർക്കുക'
                        : '+ Track'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Favourite Ragas & Gurukulam Shortcut */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-mono text-[#C7A45B] flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ml'
                    ? `${bookmarkedRagas.length} പ്രിയപ്പെട്ട രാഗങ്ങൾ`
                    : `${bookmarkedRagas.length} Bookmarked Ragas`}
                </span>
              </div>
              <div className="text-xs text-[#BDB4A4]">
                {bookmarkedRagas.length > 0
                  ? VERIFIED_RAGAS.filter((r) => bookmarkedRagas.includes(r.slug))
                      .slice(0, 3)
                      .map((r) => r.canonicalName)
                      .join(', ')
                  : lang === 'ml'
                  ? 'ഗുരുകുലം അസൈൻമെന്റുകളും രാഗ ബുക്ക്‌മാർക്കുകളും'
                  : 'Access Gurukulam teacher assignments & saved ragas'}
              </div>
            </div>
            <button
              onClick={() => onNavigateSection('teaching')}
              className="px-3.5 py-2 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'ഗുരുകുലം' : 'Gurukulam'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
