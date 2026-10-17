'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Flame, Download, Clock, FileText, Sparkles, Target, Settings2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface PracticeSessionRecord {
  id: string;
  date: string;
  focus: string;
  kattai: string;
  tala: string;
  durationMinutes: number;
  instrument?: string;
  category?: string;
  notes?: string;
  isDemo?: boolean;
}

/**
 * Calculates consecutive active practice streak days leading up to today or yesterday.
 */
export function calculateConsecutiveStreak(sessions: PracticeSessionRecord[]): number {
  const realSessions = sessions.filter((s) => !s.isDemo);
  if (!realSessions || realSessions.length === 0) return 0;

  const dateSet = new Set<string>();
  for (const s of realSessions) {
    if (s.date) {
      const d = new Date(s.date);
      if (!isNaN(d.getTime())) {
        const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dateSet.add(ymd);
      }
    }
  }

  const formatYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const today = new Date();
  const todayStr = formatYMD(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatYMD(yesterday);

  // Active streak requires practice today or yesterday
  const checkDate = dateSet.has(todayStr) ? today : (dateSet.has(yesterdayStr) ? yesterday : null);
  if (!checkDate) return 0;

  let streak = 0;
  const current = new Date(checkDate);
  while (dateSet.has(formatYMD(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
  }
  return streak;
}

export function calculateWeeklyHours(sessions: PracticeSessionRecord[]): number {
  const realSessions = sessions.filter((s) => !s.isDemo);
  if (!realSessions || realSessions.length === 0) return 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyMinutes = realSessions
    .filter((s) => new Date(s.date) >= sevenDaysAgo)
    .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  return parseFloat((weeklyMinutes / 60).toFixed(1));
}

const DEMO_CURRICULUM_SESSIONS: PracticeSessionRecord[] = [
  {
    id: 'demo-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    focus: 'Mayamalavagowla - Sarali & Jantai Varisais (1st & 2nd Kalam)',
    kattai: 'C (1 Kattai)',
    tala: 'Adi Tala (8 aksharas)',
    durationMinutes: 45,
    instrument: 'Vocal',
    category: 'Varisai',
    notes: 'Focus on pure Gandhara and Nishada intonation with Tanpura at Vilamba kalam.',
    isDemo: true
  },
  {
    id: 'demo-2',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    focus: 'Shankarabharanam - Alapana and Varnam Chalamela',
    kattai: 'C (1 Kattai)',
    tala: 'Adi Tala',
    durationMinutes: 60,
    instrument: 'Vocal',
    category: 'Varnam',
    notes: 'Practiced Dhaivatam gamakas and breath control during tara sthayi phrase transitions.',
    isDemo: true
  },
  {
    id: 'demo-3',
    date: new Date().toISOString(),
    focus: 'Kalyani - Geetham Kamaljadala & Tala alignment',
    kattai: 'C (1 Kattai)',
    tala: 'Triputa Tala',
    durationMinutes: 40,
    instrument: 'Veena',
    category: 'Geetham',
    notes: 'Synchronized with Solkattu clicks. Verified Prati Madhyamam with Tuner.',
    isDemo: true
  }
];

export const SadhanaTracker: React.FC = () => {
  const { lang } = useLanguage();
  const [sessions, setSessions] = useState<PracticeSessionRecord[]>([]);
  const [showDemo, setShowDemo] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [weeklyHours, setWeeklyHours] = useState<number>(0);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState<number>(180); // Default 3 hours / week
  const [isGoalEditorOpen, setIsGoalEditorOpen] = useState(false);

  const loadSessions = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_sadhana_sessions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSessions(parsed);
            return;
          }
        }
      } catch {
        // Fallback to empty
      }
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    if (typeof window !== 'undefined') {
      const storedGoal = localStorage.getItem('nadaverse_weekly_goal_mins');
      if (storedGoal) setWeeklyGoalMinutes(Number(storedGoal) || 180);
    }
    const handleUpdate = () => loadSessions();
    window.addEventListener('nadaverse:sadhana_updated', handleUpdate);
    return () => window.removeEventListener('nadaverse:sadhana_updated', handleUpdate);
  }, [loadSessions]);

  // Recalculate streak and weekly hours whenever sessions or demo toggle changes
  useEffect(() => {
    const activeList = showDemo && sessions.length === 0 ? DEMO_CURRICULUM_SESSIONS : sessions;
    setStreakDays(calculateConsecutiveStreak(activeList));
    setWeeklyHours(calculateWeeklyHours(activeList));
  }, [sessions, showDemo]);

  const handleUpdateWeeklyGoal = (mins: number) => {
    setWeeklyGoalMinutes(mins);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nadaverse_weekly_goal_mins', String(mins));
    }
    setIsGoalEditorOpen(false);
  };

  // Export real user sessions as CSV (strictly excludes demo/sample data)
  const handleExportCSV = () => {
    const realSessions = sessions.filter((s) => !s.isDemo);
    if (realSessions.length === 0) {
      alert(lang === 'ml' ? 'കയറ്റുമതി ചെയ്യാൻ വ്യക്തിഗത അഭ്യാസ രേഖകൾ ലഭ്യമല്ല.' : 'No recorded practice sessions to export yet. Complete a sadhana practice session to export your personal log.');
      return;
    }

    const headers = ['Date', 'Focus Area / Raga', 'Adhara Sa / Kattai', 'Tala', 'Duration (Min)', 'Instrument', 'Category', 'Student Notes', 'Type'];
    const rows = realSessions.map((s) => [
      `"${new Date(s.date).toLocaleDateString()}"`,
      `"${(s.focus || '').replace(/"/g, '""')}"`,
      `"${(s.kattai || '').replace(/"/g, '""')}"`,
      `"${(s.tala || '').replace(/"/g, '""')}"`,
      s.durationMinutes,
      `"${(s.instrument || 'Vocal').replace(/"/g, '""')}"`,
      `"${(s.category || 'General').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      '"User Practice Log"'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NadaVerse_Practice_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export full JSON backup (strictly excludes demo/sample data, includes bookmarks & learning state)
  const handleExportJSON = () => {
    const realSessions = sessions.filter((s) => !s.isDemo);
    if (realSessions.length === 0) {
      alert(lang === 'ml' ? 'കയറ്റുമതി ചെയ്യാൻ വ്യക്തിഗത അഭ്യാസ രേഖകൾ ലഭ്യമല്ല.' : 'No recorded practice sessions to export yet. Complete a sadhana practice session to export your backup.');
      return;
    }

    // Capture user bookmarks and lesson progress if present in localStorage
    let userBookmarks: string[] = [];
    let completedLessons: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        userBookmarks = JSON.parse(localStorage.getItem('nadaverse_bookmarked_ragas') || '[]');
        completedLessons = JSON.parse(localStorage.getItem('nadaverse_completed_lessons') || '[]');
      } catch {}
    }

    const exportPayload = {
      application: 'NadaVerse Carnatic Platform',
      version: '1.0.0-beta',
      exportDate: new Date().toISOString(),
      userLearningState: {
        totalRealSessions: realSessions.length,
        weeklyHours,
        consecutiveStreak: streakDays,
        completedLessonIds: completedLessons,
        bookmarkedRagas: userBookmarks,
      },
      sessions: realSessions
    };

    const jsonContent = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NadaVerse_Sadhana_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const displayedSessions = showDemo && sessions.length === 0 ? DEMO_CURRICULUM_SESSIONS : sessions;
  const loggedWeeklyMinutes = Math.round(weeklyHours * 60);
  const goalPercent = Math.min(100, Math.round((loggedWeeklyMinutes / weeklyGoalMinutes) * 100));

  return (
    <div className="space-y-6">
      {/* Metrics Row: Streak, Sadhana Hours & Goal Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak Counter */}
        <div className="nv-glass-card p-4 sm:p-5 rounded-2xl border border-[#C7A45B]/30 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DFB960] to-[#C7A45B] text-[#11110F] flex items-center justify-center shrink-0 shadow-lg shadow-[#C7A45B]/20">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {streakDays} {lang === 'ml' ? 'ദിവസം' : 'Days'}
            </div>
            <div className="text-xs font-mono text-[#E0C98F] uppercase tracking-wider">
              {lang === 'ml' ? 'സാധക ധാര (Practice Streak)' : 'Sadhana Streak'}
            </div>
          </div>
        </div>

        {/* Weekly Time Logged */}
        <div className="nv-glass-card p-4 sm:p-5 rounded-2xl border border-[#C7A45B]/30 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#C7A45B] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {weeklyHours} <span className="text-base sm:text-lg font-sans text-[#BDB4A4]">{lang === 'ml' ? 'മണിക്കൂർ' : 'hrs'}</span>
            </div>
            <div className="text-xs font-mono text-[#87947A] uppercase tracking-wider">
              {lang === 'ml' ? 'കഴിഞ്ഞ 7 ദിവസത്തെ സാധകം' : 'Past 7 Days Practice'}
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="nv-glass-card p-4 sm:p-5 rounded-2xl border border-[#C7A45B]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#E0C98F] uppercase">
              <Target className="w-4 h-4 text-[#DFB960]" />
              <span>{lang === 'ml' ? 'ആഴ്ചയിലെ ലക്ഷ്യം' : 'Weekly Goal'}</span>
            </div>
            <button
              onClick={() => setIsGoalEditorOpen(!isGoalEditorOpen)}
              className="text-[#BDB4A4] hover:text-[#F4EBDD] text-xs font-mono p-1 rounded"
              title="Configure Goal"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-1.5">
            <div className="flex justify-between text-xs font-mono text-[#F4EBDD] mb-1">
              <span>{weeklyHours} / {(weeklyGoalMinutes / 60).toFixed(1)} hrs</span>
              <span className="text-[#8ce2b0] font-bold">{goalPercent}%</span>
            </div>
            <div className="w-full bg-[#11110f] h-2.5 rounded-full overflow-hidden border border-[#C7A45B]/25">
              <div
                className="bg-gradient-to-r from-[#C7A45B] to-[#DFB960] h-full rounded-full transition-all duration-300"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>

          <div className="text-[10px] text-[#BDB4A4] font-mono">
            {goalPercent >= 100
              ? '✓ Goal achieved this week! Splendid discipline.'
              : `${Math.max(0, weeklyGoalMinutes - loggedWeeklyMinutes)} mins left to hit target`}
          </div>
        </div>
      </div>

      {/* Goal Configuration Popover */}
      {isGoalEditorOpen && (
        <div className="p-4 rounded-xl bg-[#171612] border border-[#C7A45B]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[#F4EBDD] font-mono">
            {lang === 'ml' ? 'പ്രതിവാര സാധക ലക്ഷ്യം തിരഞ്ഞെടുക്കുക:' : 'Select weekly target practice duration:'}
          </div>
          <div className="flex items-center space-x-2">
            {[120, 180, 240, 300].map((mins) => (
              <button
                key={mins}
                onClick={() => handleUpdateWeeklyGoal(mins)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  weeklyGoalMinutes === mins
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                    : 'bg-[#22221D] text-[#BDB4A4] border border-[#3B392F] hover:text-[#F4EBDD]'
                }`}
              >
                {mins / 60} hrs ({mins}m)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Header & Export Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#3B392F] gap-3">
        <div>
          <h4 className="text-base sm:text-lg font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'സാധക ഡയറിയും ഗുരു സമർപ്പണവും' : 'Sadhana Diary & Export Tools'}
          </h4>
          <p className="text-xs text-[#BDB4A4] mt-0.5">
            {lang === 'ml'
              ? 'നിങ്ങളുടെ സാധക വിവരങ്ങൾ സുരക്ഷിതമായി സൂക്ഷിക്കുകയോ ഗുരുവിന് സമർപ്പിക്കാൻ CSV / JSON ആയി ഡൗൺലോഡ് ചെയ്യുകയോ ചെയ്യാം.'
              : 'Export your practice diary as a CSV spreadsheet or JSON backup, or print a clean Guru Sign-Off report.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {sessions.length === 0 && (
            <button
              onClick={() => setShowDemo(!showDemo)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                showDemo
                  ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD]'
                  : 'bg-[#191916] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{showDemo ? (lang === 'ml' ? 'സാമ്പിൾ ഒഴിവാക്കുക' : 'Hide Sample Routine') : (lang === 'ml' ? 'സാമ്പിൾ കാണുക' : 'Preview Sample Routine')}</span>
            </button>
          )}

          {displayedSessions.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] hover:border-[#C7A45B] text-xs font-mono text-[#E0C98F] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Download CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] hover:border-[#C7A45B] text-xs font-mono text-[#E0C98F] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Download JSON backup"
              >
                <Download className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>JSON</span>
              </button>

              <button
                onClick={handlePrintReport}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#C7A45B]/20 hover:bg-[#C7A45B]/30 border border-[#C7A45B] text-xs font-mono text-[#F4EBDD] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Print or save as PDF"
              >
                <FileText className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty State when no real sessions logged */}
      {displayedSessions.length === 0 && (
        <div className="p-8 text-center bg-[#191916]/60 rounded-2xl border border-[#3B392F] border-dashed space-y-3">
          <Calendar className="w-8 h-8 text-[#C7A45B]/60 mx-auto" />
          <h5 className="font-serif font-bold text-[#F4EBDD] text-sm">
            {lang === 'ml' ? 'സാധക രേഖകൾ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല' : 'No Sadhana Sessions Logged Yet'}
          </h5>
          <p className="text-xs text-[#BDB4A4] max-w-md mx-auto leading-relaxed">
            {lang === 'ml'
              ? 'താഴെയുള്ള സാധക ലോഗറിൽ വിവരങ്ങൾ രേഖപ്പെടുത്തുകയോ റെക്കോർഡർ ഉപയോഗിക്കുകയോ ചെയ്യുമ്പോൾ നിങ്ങളുടെ സാധക ധാര (streak) തത്സമയം കണക്കാക്കപ്പെടും.'
              : 'Save an entry using the Practice Session Logger below or record with the Personal Practice Recorder to establish your daily sadhana streak.'}
          </p>
        </div>
      )}

      {/* Recent Sessions List */}
      {displayedSessions.length > 0 && (
        <div className="space-y-3">
          {displayedSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                session.isDemo
                  ? 'bg-[#191916]/50 border-[#C7A45B]/30 border-dashed'
                  : 'bg-[#191916] border-[#3B392F] hover:border-[#C7A45B]/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-[#F4EBDD]">{session.focus}</span>
                  <span className="bg-[#22221D] text-[#C7A45B] px-2 py-0.5 rounded font-mono text-[10px] border border-[#3B392F]">
                    {session.durationMinutes} min
                  </span>
                  {session.instrument && (
                    <span className="bg-[#1f1e18] text-[#E0C98F] px-2 py-0.5 rounded font-mono text-[10px] border border-[#C7A45B]/30">
                      {session.instrument}
                    </span>
                  )}
                  {session.isDemo && (
                    <span className="bg-[#C7A45B]/20 text-[#E0C98F] px-2 py-0.5 rounded font-mono text-[9px] border border-[#C7A45B]/40">
                      Sample Routine
                    </span>
                  )}
                </div>
                {session.notes && (
                  <p className="text-[#BDB4A4] text-xs italic font-light max-w-xl">
                    &ldquo;{session.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono text-[#87947A] shrink-0">
                <span>{session.kattai}</span>
                <span>·</span>
                <span>{session.tala}</span>
                <span>·</span>
                <span className="text-[#BDB4A4]">
                  {new Date(session.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
