'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Volume2, Activity, Sparkles } from 'lucide-react';
import { BEGINNER_LESSONS } from '../data/carnaticData';
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
    <section className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#3B392F] gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ml' ? 'പ്രാരംഭ പാഠങ്ങൾ' : 'Orientation Pathway'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
            {t.beginnerTitle}
          </h2>
          <p className="text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {t.beginnerSubtitle}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-[#22221D] px-3.5 py-1.5 rounded-full border border-[#3B392F]">
          <span className="text-[#BDB4A4]">{lang === 'ml' ? 'പുരോഗതി:' : 'Progress:'}</span>
          <span className="text-[#C7A45B] font-bold">
            {lang === 'ml' 
              ? `${completedLessons.length} / ${BEGINNER_LESSONS.length} പൂർത്തിയായി` 
              : `${completedLessons.length} of ${BEGINNER_LESSONS.length} Complete`}
          </span>
        </div>
      </div>

      {/* Module Selector Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
        {BEGINNER_LESSONS.map((lesson, idx) => {
          const isCurrent = activeLessonIndex === idx;
          const isCompleted = completedLessons.includes(idx);
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonIndex(idx)}
              className={`p-4 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                isCurrent
                  ? 'bg-[#22221D] border-[#C7A45B] shadow-md'
                  : 'bg-[#191916] border-[#3B392F] hover:border-[#3B392F]/80 text-[#BDB4A4]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                  isCompleted
                    ? 'bg-[#87947A] text-[#11110F]'
                    : isCurrent
                    ? 'bg-[#C7A45B] text-[#11110F]'
                    : 'bg-[#22221D] text-[#BDB4A4] border border-[#3B392F]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div>
                <span className="text-xs font-mono text-[#C7A45B] block">
                  {lang === 'ml' ? `പാഠം ${idx + 1}` : `Module ${idx + 1}`} · {lesson.estimatedMinutes} {lang === 'ml' ? 'മിനിറ്റ്' : 'mins'}
                </span>
                <span
                  className={`text-sm font-serif font-semibold block mt-0.5 ${
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
      <div className="bg-[#22221D] p-6 sm:p-8 rounded-2xl border border-[#3B392F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3B392F]/60 gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B]">
              {lang === 'ml' ? `ഘട്ടം ${activeLessonIndex + 1} / ${BEGINNER_LESSONS.length}` : `Step ${activeLessonIndex + 1} of ${BEGINNER_LESSONS.length}`}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD] mt-1">
              {lang === 'ml' && stepTitles[activeLessonIndex] ? `${stepTitles[activeLessonIndex]}: ${activeLesson.title.split(':')[1] || activeLesson.title}` : activeLesson.title}
            </h3>
            <p className="text-sm text-[#BDB4A4] italic mt-0.5">{activeLesson.subtitle}</p>
          </div>
        </div>

        {/* Core Concept Banner */}
        <div className="my-6 bg-[#191916] p-5 rounded-xl border border-[#3B392F] space-y-3">
          <div className="text-xs font-mono uppercase text-[#C7A45B] tracking-wide">
            {lang === 'ml' ? 'മുഖ്യ തത്വം:' : 'Key Insight:'}
          </div>
          <p className="text-[#F4EBDD] text-base leading-relaxed">{activeLesson.coreConcept}</p>
          <p className="text-[#BDB4A4] text-sm leading-relaxed">{activeLesson.explanation}</p>
        </div>

        {/* Practice Prompt & Interactive Trigger */}
        <div className="bg-[#11110F] p-5 rounded-xl border border-[#C7A45B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[#E0C98F] block font-semibold">
              {lang === 'ml' ? 'പ്രാക്ടീസ് വ്യായാമം:' : 'Hands-On Exercise:'}
            </span>
            <p className="text-sm text-[#F4EBDD]">{activeLesson.practicePrompt}</p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {activeLesson.interactiveTool === 'shruti' && onNavigateToPractice && (
              <button
                onClick={() => onNavigateToPractice('shruti')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ശ്രുതി ടൂൾ തുറക്കുക' : 'Open Shruti Tool'}</span>
              </button>
            )}

            {activeLesson.interactiveTool === 'tala' && onNavigateToPractice && (
              <button
                onClick={() => onNavigateToPractice('tala')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-xs transition-colors"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'താള സ്റ്റുഡിയോ തുറക്കുക' : 'Open Tala Studio'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#3B392F]/60 flex items-center justify-between">
          <button
            onClick={onOpenTutor}
            className="flex items-center space-x-1 text-xs text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'ഈ പാഠത്തെക്കുറിച്ച് ട്യൂട്ടറോട് ചോദിക്കുക' : 'Ask Tutor about this lesson'}</span>
          </button>

          <button
            onClick={handleCompleteCurrent}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#22221D] hover:bg-[#2A2A24] border border-[#C7A45B] text-[#F4EBDD] font-medium text-xs transition-all"
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
    </section>
  );
};
