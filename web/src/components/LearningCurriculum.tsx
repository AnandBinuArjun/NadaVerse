'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Search,
  Filter,
  PlayCircle,
  RotateCcw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { PATHWAYS, CURRICULUM_LESSONS, CurriculumLesson } from '../data/curriculumData';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../lib/api';

interface LearningCurriculumProps {
  onNavigateToPractice?: (tool: 'shruti' | 'tala' | 'tuner' | 'exercises') => void;
  onOpenTutor?: (topic?: string) => void;
}

export const LearningCurriculum: React.FC<LearningCurriculumProps> = ({
  onNavigateToPractice,
  onOpenTutor
}) => {
  const { lang } = useLanguage();
  const [activePathwayId, setActivePathwayId] = useState<'vocal' | 'instrumental' | 'laya'>('vocal');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(CURRICULUM_LESSONS[0].id);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Filter lessons based on pathway, search, level, and completion
  const filteredPathwayLessons = useMemo(() => {
    return CURRICULUM_LESSONS.filter((l) => {
      if (l.pathwayId !== activePathwayId) return false;

      if (selectedLevel !== 'all' && l.skillLevel !== selectedLevel) return false;

      const isDone = completedLessonIds.includes(l.id);
      if (completionFilter === 'completed' && !isDone) return false;
      if (completionFilter === 'incomplete' && isDone) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          l.title.toLowerCase().includes(q) ||
          l.titleMl.includes(q) ||
          l.subtitle.toLowerCase().includes(q) ||
          l.coreTheory.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [activePathwayId, selectedLevel, completionFilter, searchQuery, completedLessonIds]);

  const activeLesson: CurriculumLesson = useMemo(() => {
    return (
      CURRICULUM_LESSONS.find((l) => l.id === selectedLessonId) ||
      filteredPathwayLessons[0] ||
      CURRICULUM_LESSONS[0]
    );
  }, [selectedLessonId, filteredPathwayLessons]);

  // Load progress from localStorage and backend (if authenticated)
  useEffect(() => {
    const loadProgress = async () => {
      let localCompleted: string[] = [];
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('nadaverse_curriculum_progress');
          if (stored) {
            localCompleted = JSON.parse(stored);
            if (Array.isArray(localCompleted)) setCompletedLessonIds(localCompleted);
          }
        } catch {}

        // Attempt server sync if token exists
        const token = localStorage.getItem('nadaverse_token');
        if (token) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/v1/curriculum/progress`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.completed_lesson_ids)) {
                const merged = Array.from(new Set([...localCompleted, ...data.completed_lesson_ids]));
                setCompletedLessonIds(merged);
                localStorage.setItem('nadaverse_curriculum_progress', JSON.stringify(merged));
              }
            }
          } catch {}
        }
      }
    };
    loadProgress();
  }, []);

  const handleSelectPathway = (id: 'vocal' | 'instrumental' | 'laya') => {
    setActivePathwayId(id);
    const firstLesson = CURRICULUM_LESSONS.find((l) => l.pathwayId === id);
    if (firstLesson) {
      setSelectedLessonId(firstLesson.id);
    }
  };

  // Resume learning: finds first incomplete lesson
  const handleResumeLearning = () => {
    const nextIncomplete = CURRICULUM_LESSONS.find((l) => !completedLessonIds.includes(l.id));
    if (nextIncomplete) {
      setActivePathwayId(nextIncomplete.pathwayId);
      setSelectedLessonId(nextIncomplete.id);
    } else {
      setSelectedLessonId(CURRICULUM_LESSONS[0].id);
    }
    const el = document.getElementById('lesson-content-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCompleteLesson = async (lessonId: string) => {
    let updated = completedLessonIds;
    if (!completedLessonIds.includes(lessonId)) {
      updated = [...completedLessonIds, lessonId];
      setCompletedLessonIds(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nadaverse_curriculum_progress', JSON.stringify(updated));
      }

      // Sync with backend if logged in
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
        if (token) {
          await fetch(`${API_BASE_URL}/api/v1/curriculum/progress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ lesson_id: lessonId, status: 'completed' })
          });
        }
      } catch {}
    }

    // Auto-advance to next lesson in pathway if available
    const pathwayLessons = CURRICULUM_LESSONS.filter((l) => l.pathwayId === activePathwayId);
    const currentIndex = pathwayLessons.findIndex((l) => l.id === lessonId);
    if (currentIndex >= 0 && currentIndex < pathwayLessons.length - 1) {
      setSelectedLessonId(pathwayLessons[currentIndex + 1].id);
      const el = document.getElementById('lesson-content-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setQuizSubmitted((prev) => ({ ...prev, [questionId]: true }));
  };

  // Navigation handlers
  const pathwayLessons = CURRICULUM_LESSONS.filter((l) => l.pathwayId === activePathwayId);
  const currentLessonIndex = pathwayLessons.findIndex((l) => l.id === activeLesson.id);
  const hasPrev = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < pathwayLessons.length - 1;

  const handlePrevLesson = () => {
    if (hasPrev) {
      setSelectedLessonId(pathwayLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      setSelectedLessonId(pathwayLessons[currentLessonIndex + 1].id);
    }
  };

  const isCurrentLessonDone = completedLessonIds.includes(activeLesson.id);

  return (
    <section className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden border border-[#C7A45B]/20">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Pathway Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#C7A45B]/20 gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'ശാസ്ത്രീയ പാഠ്യപദ്ധതി' : 'Structured Carnatic Curriculum'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'സംഗീത സാധക മാർഗ്ഗങ്ങൾ' : 'Authentic Learning Pathways'}
          </h2>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {lang === 'ml'
              ? 'കർണ്ണാടക സംഗീതത്തിന്റെ പ്രാഥമിക പാഠങ്ങൾ മുതൽ സങ്കീർണ്ണമായ താള-രാഗ സിദ്ധാന്തങ്ങൾ വരെ ആധികാരികമായി പഠിക്കുക.'
              : 'Progress systematically through voice placement, string execution, and classical rhythm with verified treatise citations.'}
          </p>
        </div>

        {/* Action Controls: Progress Badge & Resume Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 text-xs font-mono bg-[#0d0c0a]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#C7A45B]/30 shadow-md">
            <Award className="w-4 h-4 text-[#DFB960]" />
            <span className="text-[#BDB4A4]">{lang === 'ml' ? 'പൂർത്തിയായത്:' : 'Progress:'}</span>
            <span className="text-[#E0C98F] font-bold">
              {completedLessonIds.length} / {CURRICULUM_LESSONS.length}
            </span>
          </div>

          <button
            onClick={handleResumeLearning}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#DFB960] to-[#C7A45B] hover:brightness-110 text-[#11110F] text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{lang === 'ml' ? 'തുടർന്ന് പഠിക്കുക' : 'Resume Learning'}</span>
          </button>
        </div>
      </div>

      {/* Pathway Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 relative z-10">
        {PATHWAYS.map((p) => {
          const isSelected = p.id === activePathwayId;
          const pLessons = CURRICULUM_LESSONS.filter((l) => l.pathwayId === p.id);
          const doneCount = pLessons.filter((l) => completedLessonIds.includes(l.id)).length;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPathway(p.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#24211a] to-[#171612] border-[#C7A45B] shadow-xl shadow-[#C7A45B]/10 -translate-y-0.5'
                  : 'bg-[#11110f]/60 border-[#C7A45B]/15 text-[#BDB4A4] hover:border-[#C7A45B]/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#C7A45B] tracking-wider">
                  {p.id.toUpperCase()} PATH
                </span>
                <span className="text-[11px] font-mono text-[#87947A]">
                  {doneCount}/{pLessons.length} {lang === 'ml' ? 'പൂർത്തിയായി' : 'Done'}
                </span>
              </div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#F4EBDD] mb-1">
                {lang === 'ml' ? p.titleMl : p.title}
              </div>
              <p className="text-xs text-[#BDB4A4] line-clamp-2 leading-relaxed">
                {lang === 'ml' ? p.descriptionMl : p.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search & Level Filters Toolbar */}
      <div className="my-4 p-3 bg-[#11110f]/80 rounded-2xl border border-[#C7A45B]/20 flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#C7A45B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ml' ? 'പാഠങ്ങൾ തിരയുക...' : 'Search lessons in pathway...'}
            className="w-full bg-[#181714] border border-[#3B392F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F4EBDD] placeholder-[#BDB4A4]/50 focus:outline-none focus:border-[#C7A45B]"
          />
        </div>

        {/* Level & Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mr-1">
            <Filter className="w-3 h-3" />
            <span>{lang === 'ml' ? 'ലെവൽ:' : 'Level:'}</span>
          </div>

          {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                  : 'bg-[#181714] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
              }`}
            >
              {lvl === 'all' ? (lang === 'ml' ? 'എല്ലാം' : 'All') : lvl}
            </button>
          ))}

          <span className="text-[#3B392F] mx-1">|</span>

          {(['all', 'completed', 'incomplete'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setCompletionFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                completionFilter === st
                  ? 'bg-[#6EA887] text-[#11110F] font-bold'
                  : 'bg-[#181714] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
              }`}
            >
              {st === 'all'
                ? (lang === 'ml' ? 'എല്ലാം' : 'All')
                : st === 'completed'
                ? (lang === 'ml' ? 'പൂർത്തിയായവ' : 'Done')
                : (lang === 'ml' ? 'പൂർത്തിയാകാത്തവ' : 'Remaining')}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Step Navigation Strip */}
      <div className="flex items-center space-x-2 my-4 relative z-10 overflow-x-auto pb-2 border-b border-[#C7A45B]/15">
        {filteredPathwayLessons.length === 0 ? (
          <div className="text-xs font-mono text-[#BDB4A4] py-2">
            {lang === 'ml' ? 'തിരഞ്ഞെടുത്ത ഫിൽട്ടറുകൾക്ക് അനുയോജ്യമായ പാഠങ്ങൾ ഇല്ല.' : 'No lessons matching selected filters.'}
          </div>
        ) : (
          filteredPathwayLessons.map((lesson, idx) => {
            const isSelected = lesson.id === activeLesson.id;
            const isDone = completedLessonIds.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center space-x-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                    : isDone
                    ? 'bg-[#18231c] text-[#8ce2b0] border border-[#6EA887]/30'
                    : 'bg-[#141310] text-[#BDB4A4] border border-[#C7A45B]/20 hover:text-[#F4EBDD]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6EA887]" />
                ) : (
                  <span>0{idx + 1}.</span>
                )}
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {lang === 'ml' ? lesson.titleMl.split('—')[0] : lesson.title.split('—')[0]}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Active Lesson Content Panel */}
      <div id="lesson-content-panel" className="bg-[#141310] border border-[#C7A45B]/30 rounded-2xl p-5 sm:p-7 relative z-10 shadow-2xl space-y-6">
        {/* Title, Level, Prerequisites & Completion Badge */}
        <div className="pb-4 border-b border-[#C7A45B]/15">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30">
                Module #{activeLesson.order}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#6EA887]/15 text-[#8ce2b0] border border-[#6EA887]/30">
                {lang === 'ml' ? activeLesson.skillLevelMl : activeLesson.skillLevel}
              </span>
              <span className="text-xs font-mono text-[#BDB4A4]">
                ~{activeLesson.estimatedMinutes} mins
              </span>
            </div>

            {isCurrentLessonDone && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#6EA887]/15 text-[#8ce2b0] border border-[#6EA887]/30">
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'പാഠം പൂർത്തിയായി' : 'Lesson Completed'}</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? activeLesson.titleMl : activeLesson.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#C7A45B] mt-1 font-serif">
            {lang === 'ml' ? activeLesson.subtitleMl : activeLesson.subtitle}
          </p>

          {/* Prerequisites */}
          {activeLesson.prerequisites && activeLesson.prerequisites.length > 0 && (
            <div className="mt-2 text-xs font-mono text-[#87947A]">
              <span>{lang === 'ml' ? 'മുൻവ്യവസ്ഥ: ' : 'Prerequisites: '}</span>
              <span className="text-[#BDB4A4]">
                {(lang === 'ml' ? activeLesson.prerequisitesMl : activeLesson.prerequisites).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Objectives */}
        <div className="bg-[#0f0e0c] p-4 rounded-xl border border-[#C7A45B]/20">
          <div className="text-xs font-mono uppercase text-[#E0C98F] font-bold mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB960]" />
            <span>{lang === 'ml' ? 'പഠന ലക്ഷ്യങ്ങൾ' : 'Learning Objectives'}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#BDB4A4]">
            {(lang === 'ml' ? activeLesson.objectivesMl : activeLesson.objectives).map((obj, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-[#C7A45B] mt-0.5">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Theory */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-[#C7A45B] font-bold tracking-wider">
            {lang === 'ml' ? 'സംഗീത ശാസ്ത്ര സിദ്ധാന്തം' : 'Classical Musicology Theory'}
          </div>
          <div className="text-xs sm:text-sm text-[#F4EBDD]/90 font-serif leading-relaxed bg-[#191814] p-4 rounded-xl border border-[#C7A45B]/20">
            {lang === 'ml' ? activeLesson.coreTheoryMl : activeLesson.coreTheory}
          </div>
        </div>

        {/* Practical Application & Interactive Tool Prompt */}
        <div className="bg-gradient-to-r from-[#1e1b14] to-[#171612] p-4 sm:p-5 rounded-xl border border-[#DFB960]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-[#DFB960] font-bold mb-1">
              {lang === 'ml' ? 'പ്രാക്ടിക്കൽ അഭ്യാസം' : 'Hands-on Practice'}
            </div>
            <p className="text-xs text-[#F4EBDD] leading-relaxed max-w-lg">
              {lang === 'ml' ? activeLesson.practicalExercisePromptMl : activeLesson.practicalExercisePrompt}
            </p>
            <div className="mt-2 text-[11px] font-mono text-[#87947A]">
              <span>{lang === 'ml' ? 'പൂർത്തീകരണ മാനദണ്ഡം: ' : 'Completion Criteria: '}</span>
              <span className="text-[#BDB4A4]">
                {lang === 'ml' ? activeLesson.completionCriteriaMl : activeLesson.completionCriteria}
              </span>
            </div>
          </div>

          {onNavigateToPractice && (
            <button
              onClick={() => onNavigateToPractice(activeLesson.associatedTool)}
              className="px-4 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-xs font-bold font-mono flex items-center space-x-2 shrink-0 transition-all shadow-md self-start sm:self-auto cursor-pointer"
            >
              <span>{lang === 'ml' ? 'സ്റ്റുഡിയോ തുറക്കുക' : 'Launch Tool'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* End of Lesson Knowledge Check Quiz */}
        {activeLesson.quiz && activeLesson.quiz.length > 0 && (
          <div className="bg-[#0b0b0a] p-4 sm:p-5 rounded-xl border border-[#C7A45B]/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3B392F]">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#C7A45B] font-bold">
                <HelpCircle className="w-4 h-4 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'ജ്ഞാന പരിശോധന (Knowledge Check)' : 'Knowledge Check Quiz'}</span>
              </div>
            </div>

            {activeLesson.quiz.map((q) => {
              const selectedIdx = selectedQuizAnswers[q.id];
              const isAnswered = quizSubmitted[q.id];
              const isCorrect = selectedIdx === q.correctOptionIndex;

              return (
                <div key={q.id} className="space-y-2.5 pt-1">
                  <div className="text-xs sm:text-sm font-serif font-semibold text-[#F4EBDD]">
                    {lang === 'ml' ? q.questionMl : q.question}
                  </div>

                  <div className="space-y-1.5">
                    {(lang === 'ml' ? q.optionsMl : q.options).map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      let btnStyle = 'bg-[#181714] border-[#C7A45B]/20 text-[#BDB4A4] hover:border-[#C7A45B]/50';

                      if (isAnswered) {
                        if (optIdx === q.correctOptionIndex) {
                          btnStyle = 'bg-[#1a2b20] border-[#6EA887] text-[#8ce2b0] font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-[#2b1717] border-[#E17D73] text-[#f29b94]';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === q.correctOptionIndex && (
                            <CheckCircle2 className="w-4 h-4 text-[#6EA887] shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback and Explanation */}
                  {isAnswered && (
                    <div className={`p-3.5 rounded-xl text-xs leading-relaxed space-y-2 ${isCorrect ? 'bg-[#152319] border border-[#6EA887]/40 text-[#8ce2b0]' : 'bg-[#221815] border border-[#E17D73]/40 text-[#f29b94]'}`}>
                      <div className="font-bold flex items-center space-x-1.5">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#6EA887]" />
                            <span>{lang === 'ml' ? 'ശരിയുത്തരം!' : 'Correct!'}</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-[#E17D73]" />
                            <span>{lang === 'ml' ? 'തെറ്റായ ഉത്തരം — വിശദീകരണം:' : 'Incorrect Answer — Explanation:'}</span>
                          </>
                        )}
                      </div>
                      <div>{lang === 'ml' ? q.explanationMl : q.explanation}</div>

                      {/* Revision Recommendation if incorrect */}
                      {!isCorrect && activeLesson.revisionRecommendation && (
                        <div className="pt-2 border-t border-[#E17D73]/20 flex items-start space-x-2 text-[#E8D7A8]">
                          <RotateCcw className="w-3.5 h-3.5 text-[#DFB960] shrink-0 mt-0.5" />
                          <span>
                            <strong>{lang === 'ml' ? 'പുനരവലോകന ശുപാർശ: ' : 'Revision Recommendation: '}</strong>
                            {lang === 'ml' ? activeLesson.revisionRecommendationMl : activeLesson.revisionRecommendation}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions: Previous / Next & Complete Lesson & Treatise Citation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#C7A45B]/15 gap-4">
          <div className="text-[11px] font-mono text-[#87947A]">
            Citation: {activeLesson.citation.title} ({activeLesson.citation.author}, {activeLesson.citation.year || 'Classical'})
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
            {/* Previous Lesson */}
            <button
              onClick={handlePrevLesson}
              disabled={!hasPrev}
              className="px-3 py-2 rounded-xl border border-[#3B392F] text-xs font-mono text-[#BDB4A4] hover:text-[#F4EBDD] hover:border-[#C7A45B]/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'മുമ്പത്തെത്' : 'Prev'}</span>
            </button>

            {/* Next Lesson */}
            <button
              onClick={handleNextLesson}
              disabled={!hasNext}
              className="px-3 py-2 rounded-xl border border-[#3B392F] text-xs font-mono text-[#BDB4A4] hover:text-[#F4EBDD] hover:border-[#C7A45B]/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
            >
              <span>{lang === 'ml' ? 'അടുത്തത്' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onOpenTutor && (
              <button
                onClick={() => onOpenTutor(activeLesson.title)}
                className="px-3.5 py-2 rounded-xl border border-[#C7A45B]/30 text-xs font-mono text-[#C7A45B] hover:text-[#E0C98F] hover:bg-[#1a1914] transition-colors cursor-pointer"
              >
                {lang === 'ml' ? 'ട്യൂട്ടറോട് ചോദിക്കുക' : 'Ask AI Tutor'}
              </button>
            )}

            <button
              onClick={() => handleCompleteLesson(activeLesson.id)}
              className={`px-5 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-md cursor-pointer ${
                isCurrentLessonDone
                  ? 'bg-[#1a291f] text-[#8ce2b0] border border-[#6EA887]/40'
                  : 'bg-[#C7A45B] text-[#11110F] hover:bg-[#E0C98F]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCurrentLessonDone
                  ? (lang === 'ml' ? 'പൂർത്തിയായി (Completed)' : 'Completed')
                  : (lang === 'ml' ? 'പാഠം പൂർത്തിയാക്കുക' : 'Complete & Next')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
