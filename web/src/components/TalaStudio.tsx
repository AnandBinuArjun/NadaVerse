'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Activity,
  Disc3,
  Smartphone,
  Drum,
  Clock,
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { audioKeepAlive } from '../lib/audioKeepAlive';
import { practiceShortcuts } from '../lib/practiceShortcuts';
import { VERIFIED_TALAS } from '../data/carnaticData';
import { TalaItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';
import { TALA_ML_NAMES } from '../lib/translations';
import { TALA_ML_DETAILS } from '../data/malayalamTranslations';

interface RhythmExercise {
  id: string;
  title: string;
  titleMl: string;
  talaSlug: string;
  startBpm: number;
  targetBpm: number;
  nadai: 'chatusra' | 'tisra';
  solkattu: boolean;
  rampCycles: number;
  description: string;
  descriptionMl: string;
}

const RHYTHM_DRILLS: RhythmExercise[] = [
  {
    id: 'drill-adi-kalam',
    title: 'Adi Tala Kalam Acceleration (60 → 120 BPM)',
    titleMl: 'ആദിതാള ദ്വിതീയ കാല സാധകം (60 → 120 BPM)',
    talaSlug: 'adi-tala',
    startBpm: 60,
    targetBpm: 120,
    nadai: 'chatusra',
    solkattu: true,
    rampCycles: 2,
    description: 'Master transitioning smoothly from 1st Kalam (Vilamba) to 2nd Kalam (Madhyama).',
    descriptionMl: 'ഒന്നാം കാലത്തിൽ നിന്ന് രണ്ടാം കാലത്തിലേക്ക് പിഴവില്ലാതെ വേഗത വർദ്ധിപ്പിച്ചു ശീലിക്കുക.'
  },
  {
    id: 'drill-rupaka-tisra',
    title: 'Rupaka Tala Tisra Nadai Drill (72 BPM)',
    titleMl: 'രൂപക താള തിസ്ര നട സാധകം (72 BPM)',
    talaSlug: 'rupaka-tala',
    startBpm: 72,
    targetBpm: 72,
    nadai: 'tisra',
    solkattu: true,
    rampCycles: 0,
    description: 'Subdivide each akshara into 3 matras (Tha-Ki-Ta) within 6-count Rupaka Tala.',
    descriptionMl: 'രൂപക താളത്തിന്റെ 6 അക്ഷരങ്ങളിൽ തിസ്ര നട (ത-കി-ട) ഉറപ്പിച്ചു പാടുക.'
  },
  {
    id: 'drill-khanda-chapu',
    title: 'Khanda Chapu Balance Drill (84 BPM)',
    titleMl: 'ഖണ്ഡ ചാപ്പ് ലയ സമതുലനം (84 BPM)',
    talaSlug: 'khanda-chapu',
    startBpm: 84,
    targetBpm: 108,
    nadai: 'chatusra',
    solkattu: false,
    rampCycles: 4,
    description: '2 + 3 asymmetrical syncopation developing internal laya agility.',
    descriptionMl: '2 + 3 എന്ന അസമമായ വിഭജനത്തിൽ താളത്തിൽ ഉറച്ചുനിൽക്കാൻ സഹായിക്കുന്ന സാധകം.'
  },
  {
    id: 'drill-misra-chapu',
    title: 'Misra Chapu 7-Beat Flow (76 BPM)',
    titleMl: 'മിശ്ര ചാപ്പ് 7 മാത്ര സഞ്ചാരം (76 BPM)',
    talaSlug: 'misra-chapu',
    startBpm: 76,
    targetBpm: 76,
    nadai: 'chatusra',
    solkattu: true,
    rampCycles: 0,
    description: '3 + 2 + 2 rhythmic kriya used in revered Syama Sastri masterworks.',
    descriptionMl: 'ശ്യാമ ശാസ്ത്രി കൃതികളിൽ വ്യാപകമായ 3 + 2 + 2 ക്രമത്തിലുള്ള ചാപ്പ് താള ലയം.'
  }
];

export const TalaStudio: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedTala, setSelectedTala] = useState<TalaItem>(VERIFIED_TALAS[0]); // Adi Tala
  const [bpm, setBpm] = useState(72);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number>(-1);
  const [isAccentBeat, setIsAccentBeat] = useState<boolean>(false);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(audioKeepAlive.getHapticsEnabled());
  const [isSolkattuMode, setIsSolkattuMode] = useState<boolean>(false);
  const [nadai, setNadai] = useState<'chatusra' | 'tisra'>('chatusra');
  const [isNadaiLoopEnabled, setIsNadaiLoopEnabled] = useState<boolean>(false);

  // Advanced features: Count-in, Tempo Ramp, Cycle Tracker, Timer
  const [countInEnabled, setCountInEnabled] = useState<boolean>(false);
  const [isCountingIn, setIsCountingIn] = useState<boolean>(false);
  const [countInValue, setCountInValue] = useState<number>(4);

  // Tempo Ramp State
  const [tempoRampEnabled, setTempoRampEnabled] = useState<boolean>(false);
  const [targetBpm, setTargetBpm] = useState<number>(120);
  const [rampCycleInterval, setRampCycleInterval] = useState<number>(2); // every N cycles
  const [rampBpmIncrement, setRampBpmIncrement] = useState<number>(5); // +X bpm

  // Cycle and Timer
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cycleCountRef = useRef<number>(0);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  // Stop metronome when unmounting
  useEffect(() => {
    return () => {
      audioEngine.stopTala();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer runner
  useEffect(() => {
    if (isPlaying && !isCountingIn) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isCountingIn]);

  const handleBpmChange = useCallback((newBpm: number) => {
    const clamped = Math.max(30, Math.min(240, newBpm));
    setBpm(clamped);
    audioEngine.setTalaBpm(clamped);
  }, []);

  const startActualMetronome = useCallback(async () => {
    const beatActions = selectedTala.beatActions.map((b) => ({
      isAccent: b.actionType === 'thattu',
      syllable: b.syllable
    }));

    audioEngine.setSolkattuMode(isSolkattuMode);
    audioEngine.setNadai(nadai);
    audioEngine.setNadaiLoopsEnabled(isNadaiLoopEnabled);

    cycleCountRef.current = 0;
    setCycleCount(0);

    await audioEngine.unlockAudio();
    audioEngine.startTala(bpm, selectedTala.totalAksharas, beatActions, (beatIdx, isAccent) => {
      setActiveBeat(beatIdx);
      setIsAccentBeat(isAccent);

      // On Samam (beat 0), increment cycle
      if (beatIdx === 0) {
        cycleCountRef.current += 1;
        setCycleCount(cycleCountRef.current);

        // Check tempo ramp
        if (tempoRampEnabled && rampCycleInterval > 0) {
          if (cycleCountRef.current > 1 && (cycleCountRef.current - 1) % rampCycleInterval === 0) {
            setBpm((currentBpm) => {
              if (currentBpm < targetBpm) {
                const nextBpm = Math.min(targetBpm, currentBpm + rampBpmIncrement);
                audioEngine.setTalaBpm(nextBpm);
                return nextBpm;
              }
              return currentBpm;
            });
          }
        }
      }
    });
    setIsPlaying(true);
    setIsCountingIn(false);
  }, [bpm, selectedTala, isSolkattuMode, nadai, isNadaiLoopEnabled, tempoRampEnabled, rampCycleInterval, targetBpm, rampBpmIncrement]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying || isCountingIn) {
      audioEngine.stopTala();
      setIsPlaying(false);
      setIsCountingIn(false);
      setActiveBeat(-1);
    } else {
      if (countInEnabled) {
        setIsCountingIn(true);
        setCountInValue(4);
        let count = 4;
        const intervalMs = Math.round(60000 / bpm);

        // Lead-in audio click
        audioEngine.auditionNote(880, 0.08);

        const countInterval = setInterval(() => {
          count -= 1;
          if (count > 0) {
            setCountInValue(count);
            audioEngine.auditionNote(660, 0.08);
          } else {
            clearInterval(countInterval);
            audioEngine.auditionNote(1320, 0.12);
            startActualMetronome();
          }
        }, intervalMs);
      } else {
        startActualMetronome();
      }
    }
  }, [isPlaying, isCountingIn, countInEnabled, bpm, startActualMetronome]);

  const handleTapTempo = useCallback(() => {
    const now = performance.now();
    const recentTaps = tapTimesRef.current.filter((t) => now - t < 3000);
    recentTaps.push(now);
    tapTimesRef.current = recentTaps;

    if (recentTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < recentTaps.length; i++) {
        intervals.push(recentTaps[i] - recentTaps[i - 1]);
      }
      const avgIntervalMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgIntervalMs > 0) {
        const calculatedBpm = Math.round(60000 / avgIntervalMs);
        handleBpmChange(calculatedBpm);
      }
    }
  }, [handleBpmChange]);

  // Keyboard shortcut listener
  useEffect(() => {
    const unsubTala = practiceShortcuts.subscribe('toggle_tala', () => {
      handleTogglePlay();
    });
    const unsubTap = practiceShortcuts.subscribe('tap_tempo', () => {
      handleTapTempo();
    });
    return () => {
      unsubTala();
      unsubTap();
    };
  }, [handleTogglePlay, handleTapTempo]);

  const handleTalaChange = (tala: TalaItem) => {
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      audioEngine.stopTala();
    }
    setSelectedTala(tala);
    setActiveBeat(-1);
    setCycleCount(0);
    cycleCountRef.current = 0;

    if (wasPlaying) {
      const beatActions = tala.beatActions.map((b) => ({
        isAccent: b.actionType === 'thattu',
        syllable: b.syllable
      }));
      audioEngine.startTala(bpm, tala.totalAksharas, beatActions, (beatIdx, isAccent) => {
        setActiveBeat(beatIdx);
        setIsAccentBeat(isAccent);
        if (beatIdx === 0) {
          cycleCountRef.current += 1;
          setCycleCount(cycleCountRef.current);
        }
      });
    }
  };

  const handleApplyDrill = (drill: RhythmExercise) => {
    const foundTala = VERIFIED_TALAS.find((t) => t.slug === drill.talaSlug) || VERIFIED_TALAS[0];
    handleTalaChange(foundTala);
    handleBpmChange(drill.startBpm);
    setNadai(drill.nadai);
    audioEngine.setNadai(drill.nadai);
    setIsSolkattuMode(drill.solkattu);
    audioEngine.setSolkattuMode(drill.solkattu);

    if (drill.rampCycles > 0 && drill.targetBpm > drill.startBpm) {
      setTempoRampEnabled(true);
      setTargetBpm(drill.targetBpm);
      setRampCycleInterval(drill.rampCycles);
    } else {
      setTempoRampEnabled(false);
    }
  };

  const handleLogToSadhana = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('nadaverse_sadhana_sessions') || '[]');
        const mins = Math.max(1, Math.round(elapsedSeconds / 60) || 5);
        const record = {
          id: `s-${Date.now()}`,
          date: new Date().toISOString(),
          focus: `${selectedTala.canonicalName} (${bpm} BPM - ${cycleCount} cycles)`,
          kattai: 'Laya Studio',
          tala: `${selectedTala.canonicalName} (${selectedTala.totalAksharas} aksharas)`,
          durationMinutes: mins,
          instrument: 'Tala Metronome',
          category: 'Laya Practice',
          notes: `Tempo: ${bpm} BPM, Nadai: ${nadai}, Solkattu: ${isSolkattuMode ? 'ON' : 'OFF'}`
        };
        stored.unshift(record);
        localStorage.setItem('nadaverse_sadhana_sessions', JSON.stringify(stored));
        window.dispatchEvent(new Event('nadaverse:sadhana_updated'));
        alert(lang === 'ml' ? 'താള സാധകം വിജയകരമായി രേഖപ്പെടുത്തി!' : 'Tala session saved to Sadhana Journal!');
      } catch {}
    }
  };

  const ml = TALA_ML_DETAILS[selectedTala.slug];
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden border border-[#C7A45B]/20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header, BPM & Primary Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 sm:pb-6 border-b border-[#C7A45B]/20 gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'ശാസ്ത്രീയ താള യന്ത്രം' : 'Interactive Tala Studio'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' && TALA_ML_NAMES[selectedTala.slug]
              ? `${TALA_ML_NAMES[selectedTala.slug]} (${selectedTala.canonicalName})`
              : selectedTala.canonicalName}
          </h2>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {lang === 'ml' && ml ? ml.descriptionMl : selectedTala.description}
          </p>
        </div>

        {/* Live Cycle Counter & Timer HUD */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Cycle Counter */}
          <div className="bg-[#141310] px-3.5 py-2 rounded-xl border border-[#C7A45B]/30 font-mono text-xs flex items-center space-x-2">
            <Disc3 className={`w-4 h-4 text-[#C7A45B] ${isPlaying ? 'animate-spin' : ''}`} />
            <span className="text-[#BDB4A4]">{lang === 'ml' ? 'ആവർത്തനം:' : 'Cycle:'}</span>
            <span className="text-[#E0C98F] font-bold text-sm">#{cycleCount}</span>
          </div>

          {/* Practice Timer */}
          <div className="bg-[#141310] px-3.5 py-2 rounded-xl border border-[#C7A45B]/30 font-mono text-xs flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#6EA887]" />
            <span className="text-[#BDB4A4]">{lang === 'ml' ? 'സമയം:' : 'Time:'}</span>
            <span className="text-[#F4EBDD] font-bold text-sm">{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Master Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`flex items-center justify-center space-x-2.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg active:scale-95 cursor-pointer min-h-[46px] ${
              isPlaying || isCountingIn
                ? 'bg-gradient-to-r from-[#E8D7A8] via-[#C7A45B] to-[#DFB960] text-[#11110F] shadow-[0_0_30px_rgba(199,164,91,0.6)]'
                : 'nv-gold-btn'
            }`}
          >
            {isCountingIn ? (
              <span className="font-mono text-base font-bold animate-pulse text-[#11110F]">
                Count-in: {countInValue}
              </span>
            ) : isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>{t.stopMetronome}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{t.startMetronome}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tala Selector Pills */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-5 relative z-10">
        <span className="text-xs font-mono uppercase text-[#C7A45B] mr-2 font-semibold">
          {lang === 'ml' ? 'താളങ്ങൾ:' : 'Select Tala:'}
        </span>
        {VERIFIED_TALAS.map((tala) => {
          const isSelected = tala.id === selectedTala.id;
          return (
            <button
              key={tala.id}
              onClick={() => handleTalaChange(tala)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md shadow-[#C7A45B]/20'
                  : 'bg-[#181714] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F] hover:border-[#C7A45B]/40'
              }`}
            >
              {lang === 'ml' && TALA_ML_NAMES[tala.slug] ? TALA_ML_NAMES[tala.slug] : tala.canonicalName}
              <span className="ml-1 opacity-70">({tala.totalAksharas})</span>
            </button>
          );
        })}
      </div>

      {/* Prominent Visual Beat Progression Grid */}
      <div className="my-6 bg-[#0d0c0a]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#C7A45B]/25 relative z-10 shadow-inner">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#BDB4A4]">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DFB960] inline-block" />
            <span>Samam (Beat 1)</span>
          </span>
          <span>
            Formula: {selectedTala.angasFormula} = {selectedTala.totalAksharas} Aksharas
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
          {selectedTala.beatActions.map((beat, idx) => {
            const isActive = activeBeat === idx;
            const isSamam = idx === 0;

            let cardStyle = 'bg-[#141310] border-[#3B392F]/60 text-[#BDB4A4]';
            if (isActive) {
              if (isSamam) {
                cardStyle = 'bg-gradient-to-br from-[#DFB960] to-[#C7A45B] border-[#F4EBDD] text-[#11110F] font-bold shadow-[0_0_25px_rgba(223,185,96,0.8)] scale-105';
              } else if (isAccentBeat) {
                cardStyle = 'bg-[#C7A45B] border-[#F4EBDD] text-[#11110F] font-bold shadow-[0_0_20px_rgba(199,164,91,0.6)] scale-105';
              } else {
                cardStyle = 'bg-[#6EA887] border-[#F4EBDD] text-[#11110F] font-bold shadow-[0_0_15px_rgba(110,168,135,0.6)] scale-105';
              }
            } else if (isSamam) {
              cardStyle = 'bg-[#1e1c15] border-[#C7A45B]/40 text-[#E0C98F]';
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all duration-100 flex flex-col justify-between min-h-[75px] ${cardStyle}`}
              >
                <div className="text-[10px] font-mono opacity-80 uppercase">
                  {beat.anga}
                </div>
                <div className="text-base sm:text-lg font-serif font-bold">
                  {idx + 1}
                </div>
                <div className="text-[10px] font-mono font-semibold truncate">
                  {beat.syllable || beat.actionLabel.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rhythm Engine Settings & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 relative z-10 text-xs">
        {/* Tempo & Tap Controls */}
        <div className="bg-[#141310] p-4 rounded-2xl border border-[#3B392F] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase text-[#C7A45B] font-bold">
              {lang === 'ml' ? 'കാലപ്രമാണം (Tempo BPM)' : 'Tempo & Tap Control'}
            </span>
            <span className="font-mono text-sm text-[#F4EBDD] font-bold bg-[#1e1c17] px-2.5 py-0.5 rounded border border-[#C7A45B]/30">
              {bpm} BPM
            </span>
          </div>

          <input
            type="range"
            min="30"
            max="240"
            value={bpm}
            onChange={(e) => handleBpmChange(parseInt(e.target.value) || 72)}
            className="w-full accent-[#C7A45B] cursor-pointer"
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center space-x-1.5 font-mono">
              {[60, 72, 90, 120].map((presetBpm) => (
                <button
                  key={presetBpm}
                  onClick={() => handleBpmChange(presetBpm)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                    bpm === presetBpm ? 'bg-[#C7A45B] text-[#11110F] font-bold' : 'bg-[#1e1c17] text-[#BDB4A4] border-[#3B392F]'
                  }`}
                >
                  {presetBpm}
                </button>
              ))}
            </div>

            <button
              onClick={handleTapTempo}
              className="px-3.5 py-1.5 rounded-xl bg-[#22221D] hover:bg-[#2b2923] border border-[#C7A45B]/40 text-[#E0C98F] font-mono cursor-pointer transition-all"
            >
              Tap Tempo
            </button>
          </div>
        </div>

        {/* Accompaniment Options (Solkattu, Nadai, Count-In, Haptics) */}
        <div className="bg-[#141310] p-4 rounded-2xl border border-[#3B392F] space-y-3">
          <span className="font-mono uppercase text-[#C7A45B] font-bold block">
            {lang === 'ml' ? 'ശബ്ദ & സ്പർശ ക്രമീകരണങ്ങൾ' : 'Acoustics & Subdivisions'}
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Solkattu Toggle */}
            <button
              onClick={() => {
                const next = !isSolkattuMode;
                setIsSolkattuMode(next);
                audioEngine.setSolkattuMode(next);
              }}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                isSolkattuMode
                  ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD]'
                  : 'bg-[#181714] border-[#3B392F] text-[#BDB4A4]'
              }`}
            >
              <Drum className="w-4 h-4 text-[#C7A45B]" />
              <span className="font-mono text-[11px]">{isSolkattuMode ? 'Mridangam: ON' : 'Mridangam: OFF'}</span>
            </button>

            {/* Count-In Toggle */}
            <button
              onClick={() => setCountInEnabled(!countInEnabled)}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                countInEnabled
                  ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD]'
                  : 'bg-[#181714] border-[#3B392F] text-[#BDB4A4]'
              }`}
            >
              <Clock className="w-4 h-4 text-[#C7A45B]" />
              <span className="font-mono text-[11px]">{countInEnabled ? 'Count-in: 4 Beats' : 'Count-in: OFF'}</span>
            </button>

            {/* Nadai Selection (Chatusra / Tisra) */}
            <button
              onClick={() => {
                const next = nadai === 'chatusra' ? 'tisra' : 'chatusra';
                setNadai(next);
                audioEngine.setNadai(next);
              }}
              className="p-2.5 rounded-xl border bg-[#181714] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD] flex items-center space-x-2 cursor-pointer"
            >
              <Disc3 className="w-4 h-4 text-[#C7A45B]" />
              <span className="font-mono text-[11px]">Nadai: {nadai === 'chatusra' ? 'Chatusra (4)' : 'Tisra (3)'}</span>
            </button>

            {/* Subdivisions Loop Toggle */}
            <button
              onClick={() => {
                const next = !isNadaiLoopEnabled;
                setIsNadaiLoopEnabled(next);
                audioEngine.setNadaiLoopsEnabled(next);
              }}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                isNadaiLoopEnabled
                  ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD]'
                  : 'bg-[#181714] border-[#3B392F] text-[#BDB4A4]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#C7A45B]" />
              <span className="font-mono text-[11px]">{isNadaiLoopEnabled ? 'Subdivisions: ON' : 'Subdivisions: OFF'}</span>
            </button>

            {/* Haptics */}
            <button
              onClick={() => {
                const next = !hapticsEnabled;
                setHapticsEnabled(next);
                audioKeepAlive.setHapticsEnabled(next);
                if (next) audioKeepAlive.triggerSamamHaptic(35);
              }}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                hapticsEnabled
                  ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD]'
                  : 'bg-[#181714] border-[#3B392F] text-[#BDB4A4]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#C7A45B]" />
              <span className="font-mono text-[11px]">{hapticsEnabled ? 'Haptics: ON' : 'Haptics: OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bounded Tempo Ramp Module */}
      <div className="p-4 rounded-2xl bg-[#141310] border border-[#C7A45B]/20 my-5 relative z-10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#E0C98F] font-bold">
            <TrendingUp className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'ഓട്ടോമാറ്റിക് ടെമ്പോ റാംപ് (Gradual Speed Acceleration)' : 'Configurable Tempo Ramp'}</span>
          </div>

          <button
            onClick={() => setTempoRampEnabled(!tempoRampEnabled)}
            className={`px-3 py-1 rounded-lg text-xs font-mono border cursor-pointer transition-all ${
              tempoRampEnabled
                ? 'bg-[#6EA887] text-[#11110F] font-bold border-[#6EA887]'
                : 'bg-[#1e1c17] text-[#BDB4A4] border-[#3B392F]'
            }`}
          >
            {tempoRampEnabled ? 'Tempo Ramp: Active' : 'Tempo Ramp: Disabled'}
          </button>
        </div>

        {tempoRampEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-[#BDB4A4]">
            <div>
              <label className="block mb-1 text-[11px] uppercase">Target BPM:</label>
              <input
                type="number"
                min="40"
                max="240"
                value={targetBpm}
                onChange={(e) => setTargetBpm(Math.max(40, Math.min(240, parseInt(e.target.value) || 120)))}
                className="w-full bg-[#1e1c17] border border-[#3B392F] rounded-lg px-2.5 py-1 text-[#F4EBDD]"
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] uppercase">Every N Cycles:</label>
              <input
                type="number"
                min="1"
                max="16"
                value={rampCycleInterval}
                onChange={(e) => setRampCycleInterval(Math.max(1, parseInt(e.target.value) || 2))}
                className="w-full bg-[#1e1c17] border border-[#3B392F] rounded-lg px-2.5 py-1 text-[#F4EBDD]"
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] uppercase">Increment BPM (+):</label>
              <input
                type="number"
                min="1"
                max="20"
                value={rampBpmIncrement}
                onChange={(e) => setRampBpmIncrement(Math.max(1, parseInt(e.target.value) || 5))}
                className="w-full bg-[#1e1c17] border border-[#3B392F] rounded-lg px-2.5 py-1 text-[#F4EBDD]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Curated Reusable Rhythm Practice Drills */}
      <div className="my-6 relative z-10 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#C7A45B] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#DFB960]" />
          <span>{lang === 'ml' ? 'ക്ലാസിക്കൽ താള സാധക പാഠങ്ങൾ' : 'Curated Rhythm Practice Presets'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RHYTHM_DRILLS.map((drill) => (
            <div
              key={drill.id}
              className="p-3.5 rounded-xl bg-[#141310] border border-[#C7A45B]/15 hover:border-[#C7A45B]/40 transition-all flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="text-xs font-serif font-bold text-[#F4EBDD] mb-1">
                  {lang === 'ml' ? drill.titleMl : drill.title}
                </div>
                <p className="text-[11px] text-[#BDB4A4] leading-relaxed">
                  {lang === 'ml' ? drill.descriptionMl : drill.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#3B392F]/40">
                <span className="text-[10px] font-mono text-[#87947A]">
                  {drill.startBpm} BPM {drill.rampCycles > 0 ? `→ ${drill.targetBpm} BPM` : ''} · {drill.nadai}
                </span>

                <button
                  onClick={() => handleApplyDrill(drill)}
                  className="px-2.5 py-1 rounded-lg bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-[11px] font-mono font-bold cursor-pointer transition-all"
                >
                  Load Drill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Sadhana Logger Action */}
      <div className="pt-4 border-t border-[#C7A45B]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono relative z-10">
        <span className="text-[#87947A]">
          {selectedTala.sources[0]?.title} ({selectedTala.sources[0]?.authorOrCreator})
        </span>

        <button
          onClick={handleLogToSadhana}
          className="px-4 py-2 rounded-xl bg-[#22221D] hover:bg-[#2b2923] border border-[#C7A45B]/40 hover:border-[#C7A45B] text-[#E0C98F] font-mono flex items-center space-x-2 self-start sm:self-auto cursor-pointer transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#6EA887]" />
          <span>{lang === 'ml' ? 'സാധക ഡയറിയിൽ രേഖപ്പെടുത്തുക' : 'Log to Sadhana Journal'}</span>
        </button>
      </div>
    </div>
  );
};
