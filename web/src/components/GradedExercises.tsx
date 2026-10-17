'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, BookOpen } from 'lucide-react';
import { CARNATIC_EXERCISES } from '../data/carnaticExercises';
import { audioEngine, TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { STANDARD_SWARA_RATIOS } from '../lib/carnaticRatios';

interface GradedExercisesProps {
  activeTonic?: TonicNote;
  onLogPracticeSession?: (focus: string, durationMinutes: number) => void;
}

// Swara frequency multiplier ratios in Just Intonation (Mayamalavagowla)
const MAYAMALAVAGOWLA_SWARA_RATIOS: Record<string, number> = {
  ...STANDARD_SWARA_RATIOS,
  '•': 0, // Karvai / pause
};

export const GradedExercises: React.FC<GradedExercisesProps> = ({
  activeTonic = TONIC_OPTIONS[0],
  onLogPracticeSession
}) => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'sarali' | 'jantai' | 'alankaram'>('sarali');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(CARNATIC_EXERCISES[0].id);
  const [speedKalam, setSpeedKalam] = useState<1 | 2 | 3>(1); // 1 = 1 swara/beat, 2 = 2 swaras/beat, 3 = 4 swaras/beat
  const [bpm, setBpm] = useState<number>(72);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSwaraIndex, setActiveSwaraIndex] = useState<number>(-1);
  const [isDescendingPhase, setIsDescendingPhase] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [showWesternEquivalent, setShowWesternEquivalent] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredExercises = CARNATIC_EXERCISES.filter((e) => e.category === selectedCategory);
  const currentExercise = CARNATIC_EXERCISES.find((e) => e.id === selectedExerciseId) || filteredExercises[0];

  // Load completed exercises from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_completed_exercises');
        if (stored) setCompletedExercises(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setActiveSwaraIndex(-1);
    setIsDescendingPhase(false);
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  // Audio tone synthesizer for individual swaras
  const playSwaraTone = (swara: string, durationSec: number) => {
    const ratio = MAYAMALAVAGOWLA_SWARA_RATIOS[swara];
    if (!ratio || ratio === 0) return; // Karvai or rest
    const freq = activeTonic.frequency * ratio;
    audioEngine.auditionNote(freq, durationSec * 0.9);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const swaraList = isDescendingPhase ? currentExercise.swarasDescending : currentExercise.swarasAscending;
    const intervalMs = (60000 / bpm) / speedKalam;
    const durationSec = intervalMs / 1000;

    setIsPlaying(true);
    let index = 0;
    let isDescending = isDescendingPhase;

    // Play initial note
    setActiveSwaraIndex(index);
    playSwaraTone(swaraList[index], durationSec);

    timerRef.current = setInterval(() => {
      index++;
      const currentList = isDescending ? currentExercise.swarasDescending : currentExercise.swarasAscending;

      if (index >= currentList.length) {
        if (!isDescending) {
          // Switch to descending sequence
          isDescending = true;
          setIsDescendingPhase(true);
          index = 0;
        } else {
          // Finished full cycle
          stopPlayback();
          return;
        }
      }

      setActiveSwaraIndex(index);
      const nextList = isDescending ? currentExercise.swarasDescending : currentExercise.swarasAscending;
      playSwaraTone(nextList[index], durationSec);
    }, intervalMs);
  };

  const handleMarkCompleted = () => {
    if (!completedExercises.includes(currentExercise.id)) {
      const updated = [...completedExercises, currentExercise.id];
      setCompletedExercises(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nadaverse_completed_exercises', JSON.stringify(updated));
      }
    }
    if (onLogPracticeSession) {
      onLogPracticeSession(`${currentExercise.title} (${speedKalam}st Kalam)`, 15);
    }
  };

  return (
    <div className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden border border-[#C7A45B]/20">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#C7A45B]/20 gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'വർണ്ണാത്മക സാധക ക്രമം' : 'Graded Exercise Studio'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'സരളീ - ജണ്ട - അലങ്കാര പാഠങ്ങൾ' : 'Sarali, Jantai & Alankara Exercises'}
          </h2>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {lang === 'ml'
              ? 'കർണ്ണാടക സംഗീത ശാസ്ത്രത്തിലെ അടിസ്ഥാന സാധക പാഠങ്ങൾ കൃത്യമായ ശ്രുതിയിലും താളത്തിലും അഭ്യസിക്കുക.'
              : 'Master canonical exercises codified by Saint Purandara Dasa with calibrated Just Intonation tones and tempo control.'}
          </p>
        </div>

        {/* Tonic & Speed Badges */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-[#1e1c17] border border-[#C7A45B]/30 text-xs font-mono text-[#E0C98F]">
            {lang === 'ml' ? 'ആധാര ഷഡ്ജം:' : 'Adhara Sa:'} <span className="font-bold text-[#F4EBDD]">{activeTonic.name}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1e1c17] border border-[#C7A45B]/30 text-xs font-mono text-[#E0C98F]">
            {bpm} BPM
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center space-x-2 my-5 relative z-10 border-b border-[#C7A45B]/15 pb-3 overflow-x-auto">
        <button
          onClick={() => { setSelectedCategory('sarali'); setSelectedExerciseId(CARNATIC_EXERCISES[0].id); stopPlayback(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === 'sarali'
              ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
              : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#1a1914]'
          }`}
        >
          {lang === 'ml' ? 'സരളിവരിശ (Sarali)' : 'Sarali Varisais'}
        </button>
        <button
          onClick={() => { setSelectedCategory('jantai'); setSelectedExerciseId(CARNATIC_EXERCISES[5].id); stopPlayback(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === 'jantai'
              ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
              : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#1a1914]'
          }`}
        >
          {lang === 'ml' ? 'ജണ്ടവരിശ (Jantai)' : 'Jantai Varisais'}
        </button>
        <button
          onClick={() => { setSelectedCategory('alankaram'); setSelectedExerciseId(CARNATIC_EXERCISES[7].id); stopPlayback(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === 'alankaram'
              ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
              : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#1a1914]'
          }`}
        >
          {lang === 'ml' ? 'സപ്തതാള അലങ്കാരങ്ങൾ (Alankarams)' : 'Sapta Tala Alankarams'}
        </button>
      </div>

      {/* Exercise Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-6 relative z-10">
        {filteredExercises.map((ex) => {
          const isSelected = ex.id === currentExercise.id;
          const isDone = completedExercises.includes(ex.id);
          return (
            <button
              key={ex.id}
              onClick={() => { setSelectedExerciseId(ex.id); stopPlayback(); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-[#24211a] to-[#171612] border-[#C7A45B] text-[#F4EBDD] shadow-lg shadow-[#C7A45B]/10'
                  : 'bg-[#11110f]/60 border-[#C7A45B]/15 text-[#BDB4A4] hover:border-[#C7A45B]/40 hover:text-[#F4EBDD]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono uppercase text-[#C7A45B]">#{ex.number}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#6EA887]" />}
              </div>
              <div className="text-xs font-serif font-semibold line-clamp-1">
                {lang === 'ml' ? ex.titleMl.split('—')[0] : ex.title.split('—')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Exercise Display Card */}
      <div className="bg-[#141310] border border-[#C7A45B]/30 rounded-2xl p-5 sm:p-6 mb-6 relative z-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C7A45B]/15 gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' ? currentExercise.titleMl : currentExercise.title}
            </h3>
            <div className="text-xs text-[#BDB4A4] font-mono mt-0.5">
              {currentExercise.raga} • {currentExercise.tala} • {currentExercise.angaStructure}
            </div>
          </div>

          {/* Western Note Toggle */}
          <button
            onClick={() => setShowWesternEquivalent(!showWesternEquivalent)}
            className="text-xs font-mono text-[#C7A45B] hover:text-[#E0C98F] border border-[#C7A45B]/30 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
          >
            {showWesternEquivalent ? 'Show Carnatic Swaras' : 'Show Western Equivalents'}
          </button>
        </div>

        {/* Interactive Swara Notation Stream */}
        <div className="my-6 space-y-4">
          {/* Ascending Scale (Arohanam) */}
          <div className="bg-[#0b0b0a] p-4 rounded-xl border border-[#C7A45B]/15">
            <div className="text-[11px] font-mono uppercase text-[#C7A45B] mb-2 flex items-center justify-between">
              <span>{lang === 'ml' ? 'ആരോഹണം (Ascending)' : 'Ascending Movement (Arohanam)'}</span>
              {!isDescendingPhase && isPlaying && <span className="text-[#6EA887] text-[10px] animate-pulse">● Playing</span>}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {currentExercise.swarasAscending.map((swara, idx) => {
                const isHighlight = isPlaying && !isDescendingPhase && activeSwaraIndex === idx;
                return (
                  <div
                    key={`asc-${idx}`}
                    className={`min-w-8 sm:min-w-10 px-2 py-1.5 rounded-lg text-center font-serif text-sm sm:text-base font-bold transition-all duration-150 ${
                      isHighlight
                        ? 'bg-[#C7A45B] text-[#11110F] scale-110 shadow-lg shadow-[#C7A45B]/30'
                        : 'bg-[#181714] text-[#F4EBDD] border border-[#C7A45B]/20'
                    }`}
                  >
                    <div>{swara}</div>
                    {showWesternEquivalent && (
                      <div className="text-[9px] font-mono text-[#BDB4A4] font-normal">
                        {swara === 'S' ? 'C' : swara === 'R₁' ? 'Db' : swara === 'G₃' ? 'E' : swara === 'M₁' ? 'F' : swara === 'P' ? 'G' : swara === 'D₁' ? 'Ab' : swara === 'N₃' ? 'B' : swara === 'Ṡ' ? "C'" : '•'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Descending Scale (Avarohanam) */}
          <div className="bg-[#0b0b0a] p-4 rounded-xl border border-[#C7A45B]/15">
            <div className="text-[11px] font-mono uppercase text-[#C7A45B] mb-2 flex items-center justify-between">
              <span>{lang === 'ml' ? 'അവരോഹണം (Descending)' : 'Descending Movement (Avarohanam)'}</span>
              {isDescendingPhase && isPlaying && <span className="text-[#6EA887] text-[10px] animate-pulse">● Playing</span>}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {currentExercise.swarasDescending.map((swara, idx) => {
                const isHighlight = isPlaying && isDescendingPhase && activeSwaraIndex === idx;
                return (
                  <div
                    key={`desc-${idx}`}
                    className={`min-w-8 sm:min-w-10 px-2 py-1.5 rounded-lg text-center font-serif text-sm sm:text-base font-bold transition-all duration-150 ${
                      isHighlight
                        ? 'bg-[#C7A45B] text-[#11110F] scale-110 shadow-lg shadow-[#C7A45B]/30'
                        : 'bg-[#181714] text-[#F4EBDD] border border-[#C7A45B]/20'
                    }`}
                  >
                    <div>{swara}</div>
                    {showWesternEquivalent && (
                      <div className="text-[9px] font-mono text-[#BDB4A4] font-normal">
                        {swara === 'S' ? 'C' : swara === 'R₁' ? 'Db' : swara === 'G₃' ? 'E' : swara === 'M₁' ? 'F' : swara === 'P' ? 'G' : swara === 'D₁' ? 'Ab' : swara === 'N₃' ? 'B' : swara === 'Ṡ' ? "C'" : '•'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Practice Notes & Kriya Instructions */}
        <div className="bg-[#181713] p-4 rounded-xl border border-[#C7A45B]/20 text-xs text-[#BDB4A4] space-y-1.5 leading-relaxed">
          <div className="font-semibold text-[#E0C98F]">
            {lang === 'ml' ? 'സാധക നിർദ്ദേശങ്ങൾ:' : 'Pedagogical Guidelines:'}
          </div>
          <p>{lang === 'ml' ? currentExercise.practiceNotesMl : currentExercise.practiceNotes}</p>
        </div>
      </div>

      {/* Control Bar: Play/Stop, Speeds (Kalams), BPM, Mark Done */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f0e0c] border border-[#C7A45B]/30 relative z-10 shadow-lg">
        {/* Play & Reset */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTogglePlay}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all ${
              isPlaying
                ? 'bg-[#DFB960] text-[#11110F] font-bold shadow-lg shadow-[#DFB960]/20'
                : 'bg-[#C7A45B] text-[#11110F] font-bold hover:bg-[#E0C98F]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{lang === 'ml' ? 'നിർത്തുക' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{lang === 'ml' ? 'കേൾക്കുക' : 'Play Exercise'}</span>
              </>
            )}
          </button>

          <button
            onClick={stopPlayback}
            className="p-2.5 rounded-xl border border-[#C7A45B]/30 text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#1a1914] transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed / Kalam Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-[#BDB4A4] mr-1">
            {lang === 'ml' ? 'കാലം:' : 'Kalam (Speed):'}
          </span>
          {([1, 2, 3] as const).map((kalam) => (
            <button
              key={kalam}
              onClick={() => { setSpeedKalam(kalam); stopPlayback(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                speedKalam === kalam
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                  : 'bg-[#1a1914] text-[#BDB4A4] border border-[#C7A45B]/20 hover:text-[#F4EBDD]'
              }`}
            >
              {kalam === 1 ? '1st (1x)' : kalam === 2 ? '2nd (2x)' : '3rd (4x)'}
            </button>
          ))}
        </div>

        {/* Tempo BPM Slider */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-[#BDB4A4]">Tempo:</span>
          <input
            type="range"
            min="40"
            max="160"
            step="2"
            value={bpm}
            onChange={(e) => { setBpm(Number(e.target.value)); if (isPlaying) stopPlayback(); }}
            className="w-24 sm:w-32 accent-[#C7A45B]"
          />
          <span className="text-xs font-mono text-[#E0C98F] w-12 font-bold">{bpm} BPM</span>
        </div>

        {/* Log / Mark Practiced */}
        <button
          onClick={handleMarkCompleted}
          className="px-4 py-2 rounded-xl border border-[#6EA887]/50 bg-[#16211a] text-[#8ce2b0] hover:bg-[#1d2d23] text-xs font-medium flex items-center space-x-2 transition-all self-end md:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{lang === 'ml' ? 'സാധകം രേഖപ്പെടുത്തുക' : 'Log Practice'}</span>
        </button>
      </div>
    </div>
  );
};
