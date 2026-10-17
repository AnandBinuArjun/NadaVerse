'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface SadhanaActivity {
  id: string;
  category: 'shruti' | 'swara' | 'alankaram' | 'raga' | 'composition' | 'reflection';
  title: string;
  rationale: string;
  durationMinutes: number;
  completed: boolean;
  actionRoute?: string;
}

export interface SadhanaPlan {
  id: string;
  title: string;
  totalDurationMinutes: number;
  level: 'beginner' | 'student' | 'practising_musician';
  focusArea: string;
  instrument: string;
  activities: SadhanaActivity[];
  createdAt: string;
}

const buildDefaultPlan = (
  mins: number,
  lvl: 'beginner' | 'student' | 'practising_musician',
  focus: string,
  inst: string,
  isMl: boolean
): SadhanaPlan => {
  let activities: SadhanaActivity[] = [];

  if (mins === 15) {
    activities = [
      {
        id: 'act-1',
        category: 'shruti',
        title: isMl ? 'നാദ സന്ധാനം & ധ്യാനം' : 'Adhara Shadjam Alignment & Tanpura Attunement',
        rationale: isMl ? 'ശ്രുതി ശുദ്ധി ഉറപ്പാക്കുക' : 'Anchor internal ear to tonic drone; breathe and sustain Tara & Mandra Sa.',
        durationMinutes: 3,
        completed: false,
        actionRoute: 'shruti-companion',
      },
      {
        id: 'act-2',
        category: 'swara',
        title: isMl ? 'സരളീ വരിശകൾ (1-ാം & 2-ാം കാലം)' : 'Sarali Varisai Drills (1st & 2nd Kalam)',
        rationale: isMl ? 'സ്വരസ്ഥാന കൃത്യത' : 'Maintain precise swarasthana intervals in Mayamalavagowla with Tala pulse.',
        durationMinutes: 7,
        completed: false,
        actionRoute: 'tala-studio',
      },
      {
        id: 'act-3',
        category: 'reflection',
        title: isMl ? 'അഭ്യാസ അവലോകനം' : 'Cent Error Check & Sadhana Reflection',
        rationale: isMl ? 'കുറിപ്പുകൾ രേഖപ്പെടുത്തുക' : 'Inspect pitch stability and log self-observations.',
        durationMinutes: 5,
        completed: false,
        actionRoute: 'practice-companion',
      },
    ];
  } else if (mins === 45) {
    activities = [
      {
        id: 'act-1',
        category: 'shruti',
        title: isMl ? 'ശ്രുതി സന്ധാനം & പ്രാണായാമം' : 'Shruti Meditation & Breath-Tone Alignment',
        rationale: isMl ? 'സ്ഥിരത ഉറപ്പാക്കുക' : 'Harmonize with Sa-Pa-Sa overtones; warm up vocal cords or finger touch.',
        durationMinutes: 5,
        completed: false,
        actionRoute: 'shruti-companion',
      },
      {
        id: 'act-2',
        category: 'swara',
        title: isMl ? 'ജണ്ട വരിശ & ദാട്ടു വരിശകൾ' : 'Jantai & Dhattu Varisai Agility Stride',
        rationale: isMl ? 'സ്വര ബലം' : 'Reinforce twin-swara articulation (sphuritam) and intervallic skips.',
        durationMinutes: 12,
        completed: false,
        actionRoute: 'exercises',
      },
      {
        id: 'act-3',
        category: 'alankaram',
        title: isMl ? 'സപ്ത താള അലങ്കാരങ്ങൾ (ത്രിപുര/രൂപകം)' : 'Sapta Tala Alankaram in Multiple Kalams',
        rationale: isMl ? 'താള ബോധം' : 'Internalize asymmetrical akshara subdivisions and cross-rhythm precision.',
        durationMinutes: 10,
        completed: false,
        actionRoute: 'tala-studio',
      },
      {
        id: 'act-4',
        category: 'raga',
        title: isMl ? 'രാഗാലാപന / വർണ്ണം' : 'Mohanam / Kalyani Phrase Study & Gamaka Polish',
        rationale: isMl ? 'ജീവ സ്വരങ്ങൾ' : 'Examine Vadi-Samvadi notes and subtle gamaka curves against reference pitch.',
        durationMinutes: 13,
        completed: false,
        actionRoute: 'practice-companion',
      },
      {
        id: 'act-5',
        category: 'reflection',
        title: isMl ? 'സാധന ജേണൽ രേഖപ്പെടുത്തൽ' : 'Sadhana Journal Log & Next-Step Goal',
        rationale: isMl ? 'പുരോഗതി രേഖപ്പെടുത്തുക' : 'Record actual elapsed practice time and insights.',
        durationMinutes: 5,
        completed: false,
        actionRoute: 'sadhana-journal',
      },
    ];
  } else if (mins === 60) {
    activities = [
      {
        id: 'act-1',
        category: 'shruti',
        title: isMl ? 'ആധാര ഷഡ്ജം അറ്റ്യൂൺമെന്റ്' : 'Deep Tanpura Resonance & Mandra Stay',
        rationale: isMl ? 'മന്ത്ര സ്ഥായി സാധന' : 'Descending Mandra stay to awaken chest resonance and unwavering tonic focus.',
        durationMinutes: 8,
        completed: false,
        actionRoute: 'shruti-companion',
      },
      {
        id: 'act-2',
        category: 'swara',
        title: isMl ? 'വേഗ സാധന (അകരം & സ്വരം)' : 'Akaram & Swara Speed Acceleration',
        rationale: isMl ? 'മൂന്ന് കാലങ്ങൾ' : 'Tri-kalam traversal across Sarali & Jantai sequences with steady volume.',
        durationMinutes: 15,
        completed: false,
        actionRoute: 'exercises',
      },
      {
        id: 'act-3',
        category: 'alankaram',
        title: isMl ? 'ഖണ്ഡ/മിശ്ര ചാപു നാടൈ പരിശീലനം' : 'Tisra / Khanda Nadai Tala Exercises',
        rationale: isMl ? 'ലയ പ്രാഗൽഭ്യം' : 'Practice subdividing Adi Tala into 3s and 5s without losing Samam tempo.',
        durationMinutes: 12,
        completed: false,
        actionRoute: 'tala-studio',
      },
      {
        id: 'act-4',
        category: 'composition',
        title: isMl ? 'വർണ്ണ సాధന & കീർത്തന സാഹിത്യം' : 'Varnam Two-Speed Practice & Sahitya Clarity',
        rationale: isMl ? 'സംഗീത രൂപങ്ങൾ' : 'Consolidate lyric articulation, padagarbham phrasing, and melodic continuity.',
        durationMinutes: 18,
        completed: false,
        actionRoute: 'curriculum',
      },
      {
        id: 'act-5',
        category: 'reflection',
        title: isMl ? 'ശ്രവണ നിരീക്ഷണം & ജേണൽ' : 'Acoustic Self-Review & Sadhana Notes',
        rationale: isMl ? 'ആത്മപരിശോധന' : 'Document challenging phrases and plan tomorrow’s remedial drills.',
        durationMinutes: 7,
        completed: false,
        actionRoute: 'sadhana-journal',
      },
    ];
  } else {
    // 30 Minutes Standard
    activities = [
      {
        id: 'act-1',
        category: 'shruti',
        title: isMl ? 'ശ്രുതി സന്ധാനം (ഓംകാര/ഷഡ്ജ ധ്യാനം)' : 'Shruti Meditation & Sa-Pa-Sa Tone Stability',
        rationale: isMl ? 'ശ്രുതി ലയം' : 'Lock voice or instrument tone to 440/261 Hz Tanpura Jivari resonance.',
        durationMinutes: 5,
        completed: false,
        actionRoute: 'shruti-companion',
      },
      {
        id: 'act-2',
        category: 'swara',
        title: isMl ? 'സരളീ & ജണ്ട വരിശകൾ (1 & 2 കാലം)' : 'Sarali & Jantai Varisais (2 Speeds)',
        rationale: isMl ? 'സ്ഥാന ശുദ്ധി' : 'Execute pure notes with rhythmic kriya precision in Adi Tala.',
        durationMinutes: 10,
        completed: false,
        actionRoute: 'exercises',
      },
      {
        id: 'act-3',
        category: 'alankaram',
        title: isMl ? 'ധ്രുവ / ത്രിപുട താള അലങ്കാരം' : 'Alankaram / Tala Synchronization',
        rationale: isMl ? 'താള വ്യവസ്ഥ' : 'Coordinate finger finger-counts and beat waves against accelerating tempos.',
        durationMinutes: 7,
        completed: false,
        actionRoute: 'tala-studio',
      },
      {
        id: 'act-4',
        category: 'raga',
        title: isMl ? 'മായാമാളവഗൗള / മോഹനം സഞ്ചാരങ്ങൾ' : 'Raga Sanchara & Swara Intonation Practice',
        rationale: isMl ? 'ആരോഹണ അവരോഹണ സഞ്ചാരം' : 'Sing/play signature sancharas and check microtonal deviation in cents.',
        durationMinutes: 8,
        completed: false,
        actionRoute: 'practice-companion',
      },
    ];
  }

  return {
    id: `plan-${Date.now()}`,
    title: `${mins}-Minute ${lvl.toUpperCase()} Sadhana (${focus.replace('_', ' ').toUpperCase()})`,
    totalDurationMinutes: mins,
    level: lvl,
    focusArea: focus,
    instrument: inst,
    activities,
    createdAt: new Date().toISOString(),
  };
};

interface DailySadhanaPlannerProps {
  onStartSession?: (planTitle: string, plannedMinutes: number, focus: string) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const DailySadhanaPlanner: React.FC<DailySadhanaPlannerProps> = ({
  onStartSession,
  onNavigateToSection,
}) => {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  // Configuration options
  const [targetMinutes, setTargetMinutes] = useState<number>(30);
  const [level, setLevel] = useState<'beginner' | 'student' | 'practising_musician'>('beginner');
  const [focusArea, setFocusArea] = useState<string>('vocal_agility');
  const [instrument, setInstrument] = useState<string>('vocal');
  const [activePlan, setActivePlan] = useState<SadhanaPlan | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Load saved plan from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nadaverse_daily_sadhana_plan');
      if (saved) {
        const parsed: SadhanaPlan = JSON.parse(saved);
        setActivePlan(parsed);
      } else {
        const plan = buildDefaultPlan(30, 'beginner', 'vocal_agility', 'vocal', isMl);
        setActivePlan(plan);
        localStorage.setItem('nadaverse_daily_sadhana_plan', JSON.stringify(plan));
      }
    } catch {
      const plan = buildDefaultPlan(30, 'beginner', 'vocal_agility', 'vocal', isMl);
      setActivePlan(plan);
    }
  }, [isMl]);

  const applyNewPlan = (
    mins: number,
    lvl: 'beginner' | 'student' | 'practising_musician',
    focus: string,
    inst: string
  ) => {
    const newPlan = buildDefaultPlan(mins, lvl, focus, inst, isMl);
    setActivePlan(newPlan);
    setCompletedActivities(new Set());
    localStorage.setItem('nadaverse_daily_sadhana_plan', JSON.stringify(newPlan));
  };

  const handleToggleActivity = (id: string) => {
    setCompletedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDurationChange = (activityId: string, delta: number) => {
    if (!activePlan) return;
    const updated = activePlan.activities.map((a) => {
      if (a.id === activityId) {
        const newDur = Math.max(1, a.durationMinutes + delta);
        return { ...a, durationMinutes: newDur };
      }
      return a;
    });
    const total = updated.reduce((sum, a) => sum + a.durationMinutes, 0);
    const modifiedPlan = { ...activePlan, activities: updated, totalDurationMinutes: total };
    setActivePlan(modifiedPlan);
    localStorage.setItem('nadaverse_daily_sadhana_plan', JSON.stringify(modifiedPlan));
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    if (!activePlan) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activePlan.activities.length) return;
    const list = [...activePlan.activities];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const modifiedPlan = { ...activePlan, activities: list };
    setActivePlan(modifiedPlan);
    localStorage.setItem('nadaverse_daily_sadhana_plan', JSON.stringify(modifiedPlan));
  };

  const handleRemoveActivity = (id: string) => {
    if (!activePlan || activePlan.activities.length <= 1) return;
    const list = activePlan.activities.filter((a) => a.id !== id);
    const total = list.reduce((sum, a) => sum + a.durationMinutes, 0);
    const modifiedPlan = { ...activePlan, activities: list, totalDurationMinutes: total };
    setActivePlan(modifiedPlan);
    localStorage.setItem('nadaverse_daily_sadhana_plan', JSON.stringify(modifiedPlan));
  };

  const handleStartActiveSession = () => {
    if (!activePlan) return;
    if (onStartSession) {
      onStartSession(activePlan.title, activePlan.totalDurationMinutes, activePlan.focusArea);
    }
  };

  const totalCompletedMins = activePlan
    ? activePlan.activities
        .filter((a) => completedActivities.has(a.id))
        .reduce((sum, a) => sum + a.durationMinutes, 0)
    : 0;

  const completionPct = activePlan && activePlan.totalDurationMinutes > 0
    ? Math.round((totalCompletedMins / activePlan.totalDurationMinutes) * 100)
    : 0;

  return (
    <div className="bg-stone-900/90 border border-amber-900/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {isMl ? 'ദിവസേന സാധന പ്ലാനർ' : 'Daily Sadhana Planner'}
            </span>
            <span className="text-xs text-stone-400">100% Free · Deterministic Routine</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-100">
            {isMl ? 'ഇന്നത്തെ സാധന ചിട്ട' : 'Structured Daily Practice Routine'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {isMl
              ? 'നിങ്ങളുടെ സമയവും ലക്ഷ്യവും അനുസരിച്ച് ശാസ്ത്രീയമായി ചിട്ടപ്പെടുത്തിയ സാധന.'
              : 'Scientifically sequenced Carnatic practice: Shruti $\\to$ Swara $\\to$ Tala $\\to$ Raga $\\to$ Reflection.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-200 transition-colors"
          >
            {isCustomizing ? (isMl ? 'പൂർത്തിയായി' : 'Close Setup') : isMl ? 'പ്ലാൻ മാറ്റുക' : 'Configure Plan'}
          </button>
          <button
            onClick={handleStartActiveSession}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-all shadow-md shadow-amber-950/40 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {isMl ? 'സാധന ആരംഭിക്കുക' : 'Start Session Now'}
          </button>
        </div>
      </div>

      {/* Customizer Drawer */}
      {isCustomizing && (
        <div className="my-5 p-4 rounded-xl bg-stone-950/80 border border-amber-800/20 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Target Duration */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                {isMl ? 'ലഭ്യമായ സമയം (മിനിറ്റ്)' : 'Available Minutes'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTargetMinutes(m)}
                    className={`py-1.5 rounded-md text-xs font-semibold border transition-all ${
                      targetMinutes === m
                        ? 'bg-amber-500 text-stone-950 border-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                {isMl ? 'അഭ്യാസ നിലവാരം' : 'Skill Level'}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full py-1.5 px-2.5 rounded-md text-xs bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="beginner">{isMl ? 'ആരംഭകൻ (അഭ്യാസ ഗാനം)' : 'Beginner (Abhyasa Gana)'}</option>
                <option value="student">{isMl ? 'വിദ്യാർത്ഥി (വർണ്ണം & കൃതി)' : 'Student (Varnam & Krithi)'}</option>
                <option value="practising_musician">{isMl ? 'ഗായകൻ/വാദ്യകാരൻ (മനോധർമ്മം)' : 'Practitioner (Manodharma)'}</option>
              </select>
            </div>

            {/* Focus Area */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                {isMl ? 'പ്രധാന ശ്രദ്ധാകേന്ദ്രം' : 'Focus Area'}
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-md text-xs bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="vocal_agility">{isMl ? 'സ്വര വേഗത & സ്ഥാനം' : 'Swara Agility & Intonation'}</option>
                <option value="tala_precision">{isMl ? 'താള കൃത്യത & നാടൈകൾ' : 'Tala Precision & Nadai Flow'}</option>
                <option value="gamaka_stability">{isMl ? 'ഗമക ശുദ്ധി & ശ്രുതി' : 'Gamaka Finesse & Tone Hold'}</option>
                <option value="repertoire_study">{isMl ? 'കൃതി & വർണ്ണ പഠനം' : 'Repertoire & Sahitya Clarity'}</option>
              </select>
            </div>

            {/* Medium / Instrument */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                {isMl ? 'മാധ്യമം / വാദ്യം' : 'Voice / Instrument'}
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-md text-xs bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="vocal">{isMl ? 'ശബ്ദം (Vocal)' : 'Vocal (Gāyana)'}</option>
                <option value="veena">{isMl ? 'സരസ്വതി വീണ' : 'Saraswati Veena'}</option>
                <option value="violin">{isMl ? 'വയലിൻ' : 'Carnatic Violin'}</option>
                <option value="flute">{isMl ? 'പുല്ലാങ്കുഴൽ' : 'Carnatic Bamboo Flute'}</option>
                <option value="mridangam">{isMl ? 'മൃദംഗം' : 'Mridangam'}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                applyNewPlan(targetMinutes, level, focusArea, instrument);
                setIsCustomizing(false);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
            >
              {isMl ? 'പുതിയ പ്ലാൻ നിർമ്മിക്കുക' : 'Regenerate Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar & Summary Metrics */}
      <div className="my-5 p-4 rounded-xl bg-stone-950/60 border border-stone-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-stone-300 font-medium">
            {isMl ? 'പൂർത്തീകരിച്ച സാധന' : 'Completed Sadhana'}: {totalCompletedMins} /{' '}
            {activePlan?.totalDurationMinutes || 0} {isMl ? 'മിനിറ്റ്' : 'mins'} ({completionPct}%)
          </span>
          <span className="text-amber-400 text-xs font-semibold">
            {completedActivities.size} / {activePlan?.activities.length || 0} {isMl ? 'ഘട്ടങ്ങൾ' : 'Steps Done'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Activities Sequence */}
      <div className="space-y-3">
        {activePlan?.activities.map((act, index) => {
          const isDone = completedActivities.has(act.id);
          return (
            <div
              key={act.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-stone-950/40 border-stone-800/40 opacity-75'
                  : 'bg-stone-900/60 border-stone-800 hover:border-amber-900/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleActivity(act.id)}
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-amber-500 border-amber-400 text-stone-950'
                      : 'border-stone-700 bg-stone-950/80 hover:border-amber-500'
                  }`}
                  aria-label={`Mark ${act.title} as ${isDone ? 'incomplete' : 'complete'}`}
                >
                  {isDone && (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-stone-800 text-stone-300 uppercase">
                      {act.category}
                    </span>
                    <h3 className={`text-sm font-semibold ${isDone ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                      {act.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">{act.rationale}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 sm:self-center ml-8 sm:ml-0">
                {/* Duration Editor */}
                <div className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                  <button
                    onClick={() => handleDurationChange(act.id, -1)}
                    className="text-stone-400 hover:text-amber-300 text-xs px-1 font-bold"
                    title="Decrease duration"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono text-amber-200 min-w-8 text-center">
                    {act.durationMinutes}m
                  </span>
                  <button
                    onClick={() => handleDurationChange(act.id, 1)}
                    className="text-stone-400 hover:text-amber-300 text-xs px-1 font-bold"
                    title="Increase duration"
                  >
                    +
                  </button>
                </div>

                {/* Reorder Up */}
                <button
                  disabled={index === 0}
                  onClick={() => handleMoveActivity(index, 'up')}
                  className="p-1 rounded text-stone-500 hover:text-stone-300 disabled:opacity-30"
                  aria-label="Move step up"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Reorder Down */}
                <button
                  disabled={!activePlan || index === activePlan.activities.length - 1}
                  onClick={() => handleMoveActivity(index, 'down')}
                  className="p-1 rounded text-stone-500 hover:text-stone-300 disabled:opacity-30"
                  aria-label="Move step down"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Direct Launch Route */}
                {act.actionRoute && onNavigateToSection && (
                  <button
                    onClick={() => onNavigateToSection(act.actionRoute!)}
                    className="px-2 py-1 rounded text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-900/40 hover:bg-amber-900/60"
                  >
                    {isMl ? 'തുടങ്ങുക' : 'Open Tool'}
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleRemoveActivity(act.id)}
                  className="p-1 rounded text-stone-600 hover:text-red-400 transition-colors"
                  aria-label="Remove activity"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
