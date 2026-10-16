'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, Award, Download, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface PracticeSessionRecord {
  id: string;
  date: string; // ISO string
  focus: string;
  kattai: string; // e.g. "C / 1 Kattai"
  tala: string; // e.g. "Adi Tala"
  durationMinutes: number;
  notes?: string;
}

const DEFAULT_SESSIONS: PracticeSessionRecord[] = [
  {
    id: 's-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    focus: 'Mayamalavagowla - Sarali & Jantai Varisais (1st & 2nd Kalam)',
    kattai: 'C (1 Kattai)',
    tala: 'Adi Tala (8 aksharas)',
    durationMinutes: 45,
    notes: 'Focus on pure Gandhara and Nishada intonation with Tanpura at Vilamba kalam.'
  },
  {
    id: 's-2',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    focus: 'Shankarabharanam - Alapana and Varnam Chalamela',
    kattai: 'C (1 Kattai)',
    tala: 'Adi Tala',
    durationMinutes: 60,
    notes: 'Practiced Dhaivatam gamakas and breath control during tara sthayi phrase transitions.'
  },
  {
    id: 's-3',
    date: new Date().toISOString(),
    focus: 'Kalyani - Geetham Kamaljadala & Tala alignment',
    kattai: 'C (1 Kattai)',
    tala: 'Triputa Tala',
    durationMinutes: 40,
    notes: 'Synchronized with Solkattu clicks. Verified Prati Madhyamam with Tuner.'
  }
];

export const SadhanaTracker: React.FC = () => {
  const { lang } = useLanguage();
  const [sessions, setSessions] = useState<PracticeSessionRecord[]>(DEFAULT_SESSIONS);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [weeklyHours, setWeeklyHours] = useState<number>(2.4);

  const loadSessions = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_sadhana_sessions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
          }
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
  }, []);

  useEffect(() => {
    loadSessions();
    const handleUpdate = () => loadSessions();
    window.addEventListener('nadaverse:sadhana_updated', handleUpdate);
    return () => window.removeEventListener('nadaverse:sadhana_updated', handleUpdate);
  }, [loadSessions]);

  // Calculate streak and total hours whenever sessions change
  useEffect(() => {
    if (sessions.length === 0) {
      setStreakDays(0);
      setWeeklyHours(0);
      return;
    }

    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    setWeeklyHours(parseFloat((totalMinutes / 60).toFixed(1)));

    // Calculate streak days
    const uniqueDays = new Set(
      sessions.map((s) => new Date(s.date).toISOString().split('T')[0])
    );
    setStreakDays(Math.max(1, uniqueDays.size));
  }, [sessions]);

  // Export as CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Focus Area / Raga', 'Adhara Sa / Kattai', 'Tala', 'Duration (Min)', 'Student Notes'];
    const rows = sessions.map((s) => [
      `"${new Date(s.date).toLocaleDateString()}"`,
      `"${s.focus.replace(/"/g, '""')}"`,
      `"${s.kattai.replace(/"/g, '""')}"`,
      `"${s.tala.replace(/"/g, '""')}"`,
      s.durationMinutes,
      `"${(s.notes || '').replace(/"/g, '""')}"`
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

  // Printable Guru Report / PDF
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row: Streak, Sadhana Hours, Discipline */}
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

        {/* Weekly Sadhana Time */}
        <div className="nv-glass-card p-4 sm:p-5 rounded-2xl border border-[#C7A45B]/30 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#C7A45B] flex items-center justify-center shrink-0 shadow">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {weeklyHours} {lang === 'ml' ? 'മണിക്കൂർ' : 'Hours'}
            </div>
            <div className="text-xs font-mono text-[#BDB4A4] uppercase tracking-wider">
              {lang === 'ml' ? 'ഈ ആഴ്ചത്തെ സാധകം' : 'Logged This Week'}
            </div>
          </div>
        </div>

        {/* Guru Sign-off Ready */}
        <div className="nv-glass-card p-4 sm:p-5 rounded-2xl border border-[#C7A45B]/30 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#87947A] flex items-center justify-center shrink-0 shadow">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' ? 'ഗുരുസാക്ഷ്യ റിപ്പോർട്ട്' : 'Guru Sign-Off Ready'}
            </div>
            <div className="text-xs text-[#87947A] font-mono mt-0.5">
              {sessions.length} {lang === 'ml' ? 'സെഷനുകൾ രേഖപ്പെടുത്തി' : 'Verified Sessions'}
            </div>
          </div>
        </div>
      </div>

      {/* Export Toolbar & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#3B392F] gap-3">
        <div>
          <h4 className="text-base sm:text-lg font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'സാധക രേഖകൾ & ഗുരു റിപ്പോർട്ട്' : 'Sadhana History & Student Reports'}
          </h4>
          <p className="text-xs text-[#BDB4A4]">
            {lang === 'ml'
              ? 'നിങ്ങളുടെ ഗുരുവിനോ സംഗീത അധ്യാപകനോ സമർപ്പിക്കാൻ സാധക രേഖകൾ PDF/CSV ആയി ഡൗൺലോഡ് ചെയ്യുക.'
              : 'Download your practice diary as a CSV spreadsheet or print a clean Guru Sign-Off report.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] hover:border-[#C7A45B] text-xs font-mono text-[#E0C98F] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'CSV ഡൗൺലോഡ്' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#C7A45B]/20 hover:bg-[#C7A45B]/30 border border-[#C7A45B] text-xs font-mono text-[#F4EBDD] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Print or save as PDF"
          >
            <FileText className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'റിപ്പോർട്ട് പ്രിന്റ് (PDF)' : 'Print Report (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 bg-[#191916] rounded-xl border border-[#3B392F] hover:border-[#C7A45B]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-[#F4EBDD]">{session.focus}</span>
                <span className="bg-[#22221D] text-[#C7A45B] px-2 py-0.5 rounded font-mono text-[10px] border border-[#3B392F]">
                  {session.durationMinutes} min
                </span>
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
    </div>
  );
};
