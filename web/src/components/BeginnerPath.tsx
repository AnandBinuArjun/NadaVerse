'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Volume2, Activity, Sparkles } from 'lucide-react';
import { BEGINNER_LESSONS } from '../data/carnaticData';
import { BEGINNER_LESSONS_ML } from '../data/malayalamTranslations';
import { LessonItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';

interface BeginnerPathProps {
  onNavigateToPractice?: (tool: 'shruti' | 'tala') => void;
  onOpenTutor?: () => void;
}

export const BeginnerPath: React.FC<BeginnerPathProps> = ({ onNavigateToPractice, onOpenTutor }) => {
  const { lang, t } = useLanguage();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const activeLesson: LessonItem = BEGINNER_LESSONS[activeLessonIndex];

  const handleCompleteCurrent = () => {
    if (!completedLessons.includes(activeLessonIndex)) {
      setCompletedLessons((prev) => [...prev, activeLessonIndex]);
    }
    if (activeLessonIndex < BEGINNER_LESSONS.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const stepTitles = [t.step1Title, t.step2Title, t.step3Title];

  return (
    <section className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 border-b border-[#C7A45B]/20 gap-3 sm:gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'പ്രാരംഭ പാഠങ്ങൾ' : 'Orientation Pathway'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD]">
            {t.beginnerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-xl leading-relaxed">
            {t.beginnerSubtitle}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between sm:justify-start space-x-2.5 text-xs font-mono bg-[#0d0c0a]/80 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-full border border-[#C7A45B]/30 shadow-md w-full sm:w-auto">
          <span className="text-[#BDB4A4]">{lang === 'ml' ? 'പുരോഗതി:' : 'Progress:'}</span>
          <span className="text-[#E0C98F] font-bold">
            {lang === 'ml' 
              ? `${completedLessons.length} / ${BEGINNER_LESSONS.length} പൂർത്തിയായി` 
              : `${completedLessons.length} of ${BEGINNER_LESSONS.length} Complete`}
          </span>
        </div>
      </div>

      {/* Module Selector Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-6 sm:my-8 relative z-10">
        {BEGINNER_LESSONS.map((lesson, idx) => {
          const isCurrent = activeLessonIndex === idx;
          const isCompleted = completedLessons.includes(idx);
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonIndex(idx)}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex items-start space-x-3 sm:space-x-3.5 relative overflow-hidden active:scale-98 ${
                isCurrent
                  ? 'bg-gradient-to-br from-[#1e1c17] to-[#141310] border-[#C7A45B] shadow-xl shadow-[#C7A45B]/10 -translate-y-0.5'
                  : 'bg-[#11110f]/60 backdrop-blur-sm border-[#C7A45B]/15 hover:border-[#C7A45B]/40 text-[#BDB4A4] hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 shadow-md ${
                  isCompleted
                    ? 'bg-[#6EA887] text-[#11110F] shadow-[#6EA887]/30'
                    : isCurrent
                    ? 'bg-gradient-to-br from-[#DFB960] to-[#C7A45B] text-[#11110F] shadow-[#C7A45B]/30'
                    : 'bg-[#191916] text-[#BDB4A4] border border-[#3B392F]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#C7A45B] block uppercase tracking-wider">
                  {lang === 'ml' ? `പാഠം ${idx + 1}` : `Module ${idx + 1}`} · {lesson.estimatedMinutes} {lang === 'ml' ? 'മിനിറ്റ്' : 'mins'}
                </span>
                <span
                  className={`text-xs sm:text-sm font-serif font-bold block mt-1 transition-colors leading-snug ${
                    isCurrent ? 'text-[#F4EBDD]' : 'text-[#BDB4A4]'
                  }`}
                >
                  {lang === 'ml' && stepTitles[idx] ? stepTitles[idx] : lesson.title.split(':')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Lesson Content Box */}
      {(() => {
        const mlLesson = BEGINNER_LESSONS_ML[activeLesson.id];
        return (
          <div className="bg-[#0d0c0a]/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#C7A45B]/25 shadow-2xl relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 sm:pb-4 border-b border-[#C7A45B]/15 gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B]">
                  {lang === 'ml' ? `ഘട്ടം ${activeLessonIndex + 1} / ${BEGINNER_LESSONS.length}` : `Step ${activeLessonIndex + 1} of ${BEGINNER_LESSONS.length}`}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#F4EBDD] mt-1">
                  {lang === 'ml' && mlLesson ? mlLesson.titleMl : activeLesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#BDB4A4] italic mt-0.5">
                  {lang === 'ml' && mlLesson ? mlLesson.subtitleMl : activeLesson.subtitle}
                </p>
              </div>
            </div>

            {/* Core Concept Banner */}
            <div className="my-5 sm:my-6 bg-[#141310]/90 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#C7A45B]/20 space-y-2.5 sm:space-y-3">
              <div className="text-xs font-mono uppercase text-[#C7A45B] tracking-wide font-semibold">
                {lang === 'ml' ? 'മുഖ്യ തത്വം:' : 'Key Insight:'}
              </div>
              <p className="text-[#F4EBDD] text-sm sm:text-base font-serif leading-relaxed">
                {lang === 'ml' && mlLesson ? mlLesson.coreConceptMl : activeLesson.coreConcept}
              </p>
              <p className="text-[#BDB4A4] text-xs sm:text-sm leading-relaxed">
                {lang === 'ml' && mlLesson ? mlLesson.explanationMl : activeLesson.explanation}
              </p>
            </div>

            {/* Practice Prompt & Interactive Trigger */}
            <div className="bg-gradient-to-r from-[#191916] to-[#141310] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#C7A45B]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-[#E0C98F] block font-semibold tracking-wider">
                  {lang === 'ml' ? 'പ്രാക്ടീസ് വ്യായാമം:' : 'Hands-On Exercise:'}
                </span>
                <p className="text-xs sm:text-sm text-[#F4EBDD] font-medium leading-relaxed">
                  {lang === 'ml' && mlLesson ? mlLesson.practicePromptMl : activeLesson.practicePrompt}
                </p>
              </div>

              <div className="flex items-center w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                {activeLesson.interactiveTool === 'shruti' && onNavigateToPractice && (
                  <button
                    onClick={() => onNavigateToPractice('shruti')}
                    className="nv-gold-btn flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold shadow-md active:scale-95 w-full sm:w-auto min-h-[42px]"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{lang === 'ml' ? 'ശ്രുതി ടൂൾ തുറക്കുക' : 'Open Shruti Tool'}</span>
                  </button>
                )}

                {activeLesson.interactiveTool === 'tala' && onNavigateToPractice && (
                  <button
                    onClick={() => onNavigateToPractice('tala')}
                    className="nv-gold-btn flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold shadow-md active:scale-95 w-full sm:w-auto min-h-[42px]"
                  >
                    <Activity className="w-4 h-4" />
                    <span>{lang === 'ml' ? 'താള സ്റ്റുഡിയോ തുറക്കുക' : 'Open Tala Studio'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Bottom Bar */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#C7A45B]/15 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={onOpenTutor}
                className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors py-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ml' ? 'ഈ പാഠത്തെക്കുറിച്ച് ട്യൂട്ടറോട് ചോദിക്കുക' : 'Ask Tutor about this lesson'}</span>
              </button>

              <button
                onClick={handleCompleteCurrent}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/40 hover:border-[#C7A45B] text-[#F4EBDD] font-medium text-xs transition-all shadow-md active:scale-95 min-h-[42px]"
              >
                <span>
                  {completedLessons.includes(activeLessonIndex)
                    ? (lang === 'ml' ? 'അടുത്തത് കാണുക' : 'Review Next')
                    : t.markCompleteBtn}
                </span>
                <ChevronRight className="w-4 h-4 text-[#C7A45B]" />
              </button>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
