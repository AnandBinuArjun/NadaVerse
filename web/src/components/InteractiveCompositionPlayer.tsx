'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Sparkles,
  Music,
  Radio,
  ShieldCheck,
  Disc3,
  Activity,
  Mic,
  AlertTriangle
} from 'lucide-react';
import { audioEngine, TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { audioKeepAlive } from '../lib/audioKeepAlive';
import {
  PlayableComposition,
  SwaraEvent
} from '../types/composition';
import { useLanguage } from '../context/LanguageContext';

interface InteractiveCompositionPlayerProps {
  composition: PlayableComposition;
  onBackToLibrary?: () => void;
}

export function InteractiveCompositionPlayer({
  composition,
  onBackToLibrary
}: InteractiveCompositionPlayerProps) {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  // --- Playback State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentSwaraIndex, setCurrentSwaraIndex] = useState(0);
  const [currentAksharaInCycle, setCurrentAksharaInCycle] = useState(0);
  const [tempoBpm, setTempoBpm] = useState(composition.defaultBpm);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.5 (slow practice), 1 (1st kalam), 2 (2nd kalam)
  const [isLoopSection, setIsLoopSection] = useState(false);

  // --- Violin Practice Mode State ---
  const [violinMode, setViolinMode] = useState(false);
  const [micPitchActive, setMicPitchActive] = useState(false);
  const [detectedPitchNote, setDetectedPitchNote] = useState<string | null>(null);

  // --- Tanpura / Shruti State ---
  const [isTanpuraActive, setIsTanpuraActive] = useState(false);
  const [selectedTonic, setSelectedTonic] = useState<TonicNote>(() => {
    return TONIC_OPTIONS.find((t) => t.name === 'C') || TONIC_OPTIONS[0];
  });

  // Audio clock scheduling tracking refs
  const schedulerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const currentSectionIndexRef = useRef(currentSectionIndex);
  const tempoBpmRef = useRef(tempoBpm);
  const speedMultiplierRef = useRef(speedMultiplier);
  const isLoopSectionRef = useRef(isLoopSection);
  const compositionRef = useRef(composition);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    currentSectionIndexRef.current = currentSectionIndex;
    tempoBpmRef.current = tempoBpm;
    speedMultiplierRef.current = speedMultiplier;
    isLoopSectionRef.current = isLoopSection;
    compositionRef.current = composition;
  }, [isPlaying, currentSectionIndex, tempoBpm, speedMultiplier, isLoopSection, composition]);

  const activeSection = composition.sections[currentSectionIndex] || composition.sections[0];
  const activeLine = activeSection?.lines[currentLineIndex] || activeSection?.lines[0];

  // Flatten events in current section for clock scheduling
  interface FlatScheduledEvent {
    sectionIndex: number;
    lineIndex: number;
    eventIndex: number;
    event: SwaraEvent;
    startAkshara: number;
    durationAksharas: number;
    cycleAkshara: number;
  }

  const sectionFlatEvents = useMemo(() => {
    if (!activeSection) return [];
    const events: FlatScheduledEvent[] = [];
    let accAkshara = 0;
    activeSection.lines.forEach((line, lIdx) => {
      let lineAkshara = 0;
      line.swaras.forEach((sw, evIdx) => {
        events.push({
          sectionIndex: currentSectionIndex,
          lineIndex: lIdx,
          eventIndex: evIdx,
          event: sw,
          startAkshara: accAkshara,
          durationAksharas: sw.durationAksharas,
          cycleAkshara: lineAkshara
        });
        accAkshara += sw.durationAksharas;
        lineAkshara += sw.durationAksharas;
      });
    });
    return events;
  }, [activeSection, currentSectionIndex]);

  // Current playing note tracking
  const playbackStartTimeRef = useRef<number>(0);
  const playbackStartAksharaRef = useRef<number>(0);

  // Stop all playback
  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    audioEngine.stopAllSwaraNotes();
    audioKeepAlive.disableKeepAlive();
    if (schedulerRef.current) {
      window.clearTimeout(schedulerRef.current);
      schedulerRef.current = null;
    }
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Schedule Web Audio events into the audio hardware clock
  const scheduleSectionPlayback = useCallback(
    (fromAksharaOffset = 0, targetSectionIdx = currentSectionIndexRef.current) => {
      const ctx = audioEngine.getContext();
      const now = ctx.currentTime;
      playbackStartTimeRef.current = now;
      playbackStartAksharaRef.current = fromAksharaOffset;

      const effectiveBpm = tempoBpmRef.current * speedMultiplierRef.current;
      const secPerAkshara = 60 / effectiveBpm;

      const sec = compositionRef.current.sections[targetSectionIdx];
      if (!sec) return;

      // Calculate relative notes
      let accAkshara = 0;
      sec.lines.forEach((line) => {
        line.swaras.forEach((sw) => {
          if (accAkshara >= fromAksharaOffset) {
            const noteStartDelay = (accAkshara - fromAksharaOffset) * secPerAkshara;
            const noteStartTime = now + noteStartDelay;
            const noteDurationSec = sw.durationAksharas * secPerAkshara;

            audioEngine.scheduleSwaraNote(
              noteStartTime,
              sw.ratio,
              noteDurationSec,
              sw.gamaka ? {
                type: sw.gamaka.type,
                startRatio: sw.gamaka.startRatio,
                endRatio: sw.gamaka.endRatio,
                oscillationDepthCents: sw.gamaka.oscillationDepthCents,
                oscillationSpeedHz: sw.gamaka.oscillationSpeedHz
              } : undefined
            );
          }
          accAkshara += sw.durationAksharas;
        });
      });
    },
    []
  );

  // Update swara highlighting using requestAnimationFrame synchronized to Web Audio hardware time
  const startHighlightLoop = useCallback(() => {
    const updateHighlight = () => {
      if (!isPlayingRef.current) return;
      const ctx = audioEngine.getContext();
      const elapsedSec = ctx.currentTime - playbackStartTimeRef.current;
      const effectiveBpm = tempoBpmRef.current * speedMultiplierRef.current;
      const aksharasPerSec = effectiveBpm / 60;
      const currentAkshara = playbackStartAksharaRef.current + elapsedSec * aksharasPerSec;

      // Find the event matching this akshara
      const totalAksharas = sectionFlatEvents.reduce((acc, ev) => acc + ev.durationAksharas, 0);

      if (currentAkshara >= totalAksharas) {
        if (isLoopSectionRef.current) {
          // Loop section
          playbackStartTimeRef.current = ctx.currentTime;
          playbackStartAksharaRef.current = 0;
          scheduleSectionPlayback(0);
        } else if (currentSectionIndexRef.current < compositionRef.current.sections.length - 1) {
          // Advance to next section
          const nextSec = currentSectionIndexRef.current + 1;
          setCurrentSectionIndex(nextSec);
          setCurrentLineIndex(0);
          setCurrentSwaraIndex(0);
          playbackStartTimeRef.current = ctx.currentTime;
          playbackStartAksharaRef.current = 0;
          scheduleSectionPlayback(0, nextSec);
        } else {
          // Finished composition
          stopPlayback();
          setCurrentLineIndex(0);
          setCurrentSwaraIndex(0);
          setCurrentAksharaInCycle(0);
          return;
        }
      } else {
        const activeEv = sectionFlatEvents.find(
          (ev) => currentAkshara >= ev.startAkshara && currentAkshara < ev.startAkshara + ev.durationAksharas
        );
        if (activeEv) {
          setCurrentLineIndex(activeEv.lineIndex);
          setCurrentSwaraIndex(activeEv.eventIndex);
          setCurrentAksharaInCycle(Math.floor(activeEv.cycleAkshara));
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(updateHighlight);
    };

    animationFrameRef.current = window.requestAnimationFrame(updateHighlight);
  }, [scheduleSectionPlayback, sectionFlatEvents, stopPlayback]);

  // Play / Pause toggle
  const handleTogglePlay = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      audioKeepAlive.enableKeepAlive();
      await audioEngine.unlockAudio();
      setIsPlaying(true);
      isPlayingRef.current = true;
      scheduleSectionPlayback(0);
      startHighlightLoop();
    }
  }, [isPlaying, stopPlayback, scheduleSectionPlayback, startHighlightLoop]);

  // Restart from beginning of section
  const handleRestart = () => {
    stopPlayback();
    setCurrentLineIndex(0);
    setCurrentSwaraIndex(0);
    setCurrentAksharaInCycle(0);
  };

  // Switch section
  const handleSelectSection = useCallback((idx: number) => {
    const wasPlaying = isPlaying;
    stopPlayback();
    setCurrentSectionIndex(idx);
    setCurrentLineIndex(0);
    setCurrentSwaraIndex(0);
    setCurrentAksharaInCycle(0);
    if (wasPlaying) {
      setTimeout(() => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        scheduleSectionPlayback(0, idx);
        startHighlightLoop();
      }, 50);
    }
  }, [isPlaying, stopPlayback, scheduleSectionPlayback, startHighlightLoop]);

  // Toggle Tanpura
  const handleToggleTanpura = () => {
    const nextState = !isTanpuraActive;
    setIsTanpuraActive(nextState);
    if (nextState) {
      audioKeepAlive.enableKeepAlive();
      audioEngine.startTanpura(selectedTonic.frequency, 0.7);
    } else {
      audioEngine.stopTanpura();
      audioKeepAlive.disableKeepAlive();
    }
  };

  // Change Tonic
  const handleTonicChange = (tonic: TonicNote) => {
    setSelectedTonic(tonic);
    audioEngine.setTonic(tonic.name);
  };

  // Keyboard accessibility listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLoopSection((prev) => !prev);
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setViolinMode((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // Advance to next section if exists
        if (currentSectionIndex < composition.sections.length - 1) {
          handleSelectSection(currentSectionIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
          handleSelectSection(currentSectionIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, handleTogglePlay, handleSelectSection, isPlaying, composition.sections.length]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      audioEngine.stopTanpura();
    };
  }, [stopPlayback]);

  // Simulated approximate pitch detection mock for demo / testing
  const toggleMicPitch = () => {
    setMicPitchActive((prev) => {
      const next = !prev;
      if (next) {
        // Simple approximate feedback based on active swara
        const sw = activeLine?.swaras[currentSwaraIndex]?.swara || 'S';
        setDetectedPitchNote(sw);
      } else {
        setDetectedPitchNote(null);
      }
      return next;
    });
  };

  const activeSwara = activeLine?.swaras[currentSwaraIndex];

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161410] border border-[#C7A45B]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {onBackToLibrary && (
              <button
                onClick={onBackToLibrary}
                className="text-xs text-[#E0C98F] hover:text-[#F4EBDD] transition-colors flex items-center gap-1 font-mono font-medium px-2.5 py-1 bg-[#C7A45B]/15 rounded-lg border border-[#C7A45B]/30"
              >
                ← {isMl ? 'ലൈബ്രറിയിലേക്ക് മടങ്ങുക' : 'Back to Library'}
              </button>
            )}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/30 text-[#E0C98F] font-mono font-semibold tracking-wide uppercase">
              {isMl ? composition.categoryLabelMl : composition.categoryLabelEn}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#22221D] border border-[#3B392F] text-[#BDB4A4] font-mono">
              {isMl ? composition.difficultyMl : composition.difficulty}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1c1a14] border border-[#3B392F] text-[#8A7F6D] font-mono">
              Schema v{composition.schemaVersion}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD] tracking-tight flex items-center gap-3">
            <span>{isMl ? composition.titleMl : composition.title}</span>
            {composition.titleMl && !isMl && (
              <span className="text-lg text-[#8A7F6D] font-normal">({composition.titleMl})</span>
            )}
          </h1>
          <p className="text-sm text-[#BDB4A4] mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[#E0C98F] font-medium">
              {isMl ? 'രാഗം' : 'Raga'}: {isMl ? composition.ragaMl : composition.ragaName}
            </span>
            <span className="text-[#3B392F]">•</span>
            <span className="text-[#D9A441] font-medium">
              {isMl ? 'താളം' : 'Tala'}: {isMl ? composition.talaMl : composition.talaName}
            </span>
            <span className="text-[#3B392F]">•</span>
            <span className="text-[#BDB4A4]">
              {isMl ? 'രചന' : 'Composer'}: {isMl ? composition.composerMl : composition.composerName}
            </span>
          </p>
        </div>

        {/* Tonic & Tanpura Selector */}
        <div className="flex flex-wrap items-center gap-3 bg-[#11100D] p-3 rounded-xl border border-[#3B392F]">
          <div className="flex flex-col">
            <label className="text-[11px] text-[#8A7F6D] font-mono font-medium uppercase tracking-wider">
              {isMl ? 'ആധാര ഷഡ്ജം (ശ്രുതി)' : 'Shruti (Adhara Sa)'}
            </label>
            <select
              value={selectedTonic.name}
              onChange={(e) => {
                const tonic = TONIC_OPTIONS.find((t) => t.name === e.target.value);
                if (tonic) handleTonicChange(tonic);
              }}
              className="mt-1 bg-[#1c1a14] border border-[#3B392F] text-[#E0C98F] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C7A45B]"
            >
              {TONIC_OPTIONS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.kattai} - {t.frequency} Hz)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleToggleTanpura}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
              isTanpuraActive
                ? 'nv-gold-btn border-[#C7A45B] shadow-lg shadow-[#C7A45B]/20'
                : 'bg-[#1c1a14] text-[#BDB4A4] border-[#3B392F] hover:border-[#C7A45B]/40 hover:text-[#F4EBDD]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isTanpuraActive ? 'animate-pulse text-[#11110F]' : 'text-[#C7A45B]'}`} />
            <span>{isTanpuraActive ? (isMl ? 'താംബുര നിർത്തുക' : 'Drone Active') : (isMl ? 'താംബുര ഓൺ' : 'Start Drone')}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Swara Notation Sheet & Current Highlighting */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#3B392F]/60">
            {composition.sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => handleSelectSection(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  currentSectionIndex === idx
                    ? 'nv-gold-btn border border-[#C7A45B] shadow-inner'
                    : 'bg-[#161410] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
                }`}
              >
                <span>{isMl ? sec.nameMl : sec.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  currentSectionIndex === idx ? 'bg-[#11110F]/20 text-[#11110F]' : 'bg-[#22221D] text-[#8A7F6D]'
                }`}>
                  {sec.lines.length} {isMl ? 'വരി' : 'lines'}
                </span>
              </button>
            ))}
          </div>

          {/* Notation Sheet Viewport */}
          <div className="bg-[#14120E] border border-[#3B392F] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#3B392F]/60">
              <span className="text-xs font-mono font-bold text-[#E0C98F] uppercase tracking-wider">
                {isMl ? activeSection?.nameMl : activeSection?.name}
              </span>
              <span className="text-[11px] font-mono text-[#BDB4A4] bg-[#1c1a14] px-2.5 py-1 rounded-md border border-[#3B392F] w-fit">
                {isMl ? 'താള ആവർത്തനം' : 'Tala'}: {composition.talaTotalAksharas} {isMl ? 'അക്ഷരങ്ങൾ' : 'Aksharas'}
              </span>
            </div>

            <div className="space-y-6">
              {activeSection?.lines.map((line, lIdx) => {
                const isLineActive = isPlaying && currentLineIndex === lIdx;
                return (
                  <div
                    key={`line-${line.lineNumber}`}
                    className={`p-4 rounded-xl transition-all border ${
                      isLineActive
                        ? 'bg-[#C7A45B]/10 border-[#C7A45B]/40 shadow-md'
                        : 'bg-[#161410]/80 border-[#3B392F]/80'
                    }`}
                  >
                    {/* Line Header & Sahitya text */}
                    <div className="flex items-center justify-between gap-3 text-xs text-[#8A7F6D] mb-3 border-b border-[#3B392F]/70 pb-1.5 min-w-0">
                      <span className="font-mono text-[#E0C98F] shrink-0">
                        {isMl ? `വരി ${line.lineNumber}` : `Line ${line.lineNumber}`}
                      </span>
                      {line.sahityaLineText && (
                        <span
                          className="font-serif italic text-[#F4EBDD] tracking-wide text-xs truncate min-w-0 text-right"
                          title={isMl && line.sahityaLineTextMl ? line.sahityaLineTextMl : line.sahityaLineText}
                        >
                          {isMl && line.sahityaLineTextMl ? line.sahityaLineTextMl : line.sahityaLineText}
                        </span>
                      )}
                    </div>

                    {/* Swara Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {line.swaras.map((sw, swIdx) => {
                        const isNoteActive = isPlaying && currentLineIndex === lIdx && currentSwaraIndex === swIdx;
                        return (
                          <div
                            key={sw.id}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border text-center relative min-w-0 overflow-hidden ${
                              isNoteActive
                                ? 'bg-[#C7A45B] text-[#11110F] font-bold border-[#E0C98F] scale-105 shadow-lg shadow-[#C7A45B]/30'
                                : 'bg-[#1c1a14] text-[#F4EBDD] border-[#3B392F] hover:border-[#C7A45B]/40'
                            }`}
                          >
                            {/* Swara Sign */}
                            <span className="text-base font-serif font-extrabold tracking-wider truncate w-full">
                              {sw.swara}
                            </span>

                            {/* Duration Indicator */}
                            <span
                              className={`text-[10px] font-mono ${
                                isNoteActive ? 'text-[#11110F]' : 'text-[#8A7F6D]'
                              }`}
                            >
                              {sw.durationAksharas > 1 ? `${sw.durationAksharas} ak` : '1 ak'}
                            </span>

                            {/* Sahitya / Syllable */}
                            {sw.sahitya && (
                              <span
                                className={`text-[11px] font-medium mt-0.5 truncate w-full px-1 ${
                                  isNoteActive ? 'text-[#11110F] font-semibold' : 'text-[#E0C98F]'
                                }`}
                                title={isMl && sw.sahityaMl ? sw.sahityaMl : sw.sahitya}
                              >
                                {isMl && sw.sahityaMl ? sw.sahityaMl : sw.sahitya}
                              </span>
                            )}

                            {/* Gamaka Badge if present */}
                            {sw.gamaka && (
                              <span
                                className={`text-[9px] uppercase px-1 rounded-sm mt-1 font-mono tracking-tighter ${
                                  isNoteActive
                                    ? 'bg-[#11110F] text-[#C7A45B]'
                                    : 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                                }`}
                              >
                                {sw.gamaka.type}
                              </span>
                            )}

                            {/* Violin Practice Annotation Overlay */}
                            {violinMode && sw.violin && (
                              <div
                                className={`mt-1 text-[10px] flex items-center gap-1 font-mono px-1 rounded ${
                                  isNoteActive ? 'bg-[#11110F] text-[#E0C98F]' : 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/25'
                                }`}
                              >
                                <span>S{sw.violin.string}</span>
                                <span>•</span>
                                <span>F{sw.violin.finger}</span>
                                <span>{sw.violin.bowDirection === 'down' ? '⊓' : '∨'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Synchronized Tala Kriya Beat Matrix */}
            <div className="mt-6 pt-4 border-t border-[#3B392F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C7A45B]" />
                <span className="text-xs font-mono font-semibold text-[#F4EBDD] uppercase tracking-wider">
                  {isMl ? 'താള ക്രിയകൾ' : 'Tala Kriyas'}:
                </span>
                <span className="text-xs text-[#BDB4A4] font-mono">{composition.talaAngas}</span>
              </div>

              {/* Tala Beat Beads */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {Array.from({ length: composition.talaTotalAksharas }).map((_, bIdx) => {
                  const isCurrentBeat = isPlaying && currentAksharaInCycle === bIdx;
                  return (
                    <div
                      key={`beat-${bIdx}`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all border ${
                        isCurrentBeat
                          ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] scale-110 shadow-md shadow-[#C7A45B]/40 animate-pulse'
                          : 'bg-[#1c1a14] text-[#8A7F6D] border-[#3B392F]'
                      }`}
                    >
                      {bIdx + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Practice Controls Bar */}
          <div className="bg-[#161410] border border-[#3B392F] rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
            {/* Primary Transport Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause composition' : 'Play composition'}
                className="w-12 h-12 rounded-2xl nv-gold-btn flex items-center justify-center font-bold shadow-lg shadow-[#C7A45B]/25 transition-all transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current text-[#11110F]" /> : <Play className="w-6 h-6 fill-current text-[#11110F] ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                aria-label="Restart from beginning"
                className="w-10 h-10 rounded-xl bg-[#1c1a14] hover:bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] flex items-center justify-center border border-[#3B392F] transition-colors"
                title={isMl ? 'ആരംഭത്തിലേക്ക്' : 'Restart'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLoopSection((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  isLoopSection
                    ? 'bg-[#C7A45B]/20 text-[#E0C98F] border-[#C7A45B]/40'
                    : 'bg-[#1c1a14] text-[#BDB4A4] border-[#3B392F] hover:text-[#F4EBDD]'
                }`}
                title="L key shortcut"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{isMl ? 'ലൂപ്പ്' : 'Loop'}</span>
              </button>
            </div>

            {/* Tempo Controls & Kalam Speeds */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-[#BDB4A4] font-mono mb-1">
                  <span>BPM: {Math.round(tempoBpm * speedMultiplier)}</span>
                  <span className="text-[#E0C98F]">
                    {speedMultiplier === 0.5
                      ? 'Slow Practice (0.5x)'
                      : speedMultiplier === 1
                      ? '1st Kalam (1x)'
                      : '2nd Kalam (2x)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="36"
                  max="140"
                  value={tempoBpm}
                  onChange={(e) => setTempoBpm(Number(e.target.value))}
                  className="w-32 sm:w-40 accent-[#C7A45B] h-1.5 bg-[#22221D] rounded-lg cursor-pointer"
                />
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-[#11100D] p-1 rounded-xl border border-[#3B392F]">
                <button
                  onClick={() => setSpeedMultiplier(0.5)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    speedMultiplier === 0.5
                      ? 'nv-gold-btn shadow-sm'
                      : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                  title="Slow tempo practice"
                >
                  0.5x
                </button>
                <button
                  onClick={() => setSpeedMultiplier(1)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    speedMultiplier === 1
                      ? 'nv-gold-btn shadow-sm'
                      : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                  title="First speed"
                >
                  1x
                </button>
                <button
                  onClick={() => setSpeedMultiplier(2)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    speedMultiplier === 2
                      ? 'nv-gold-btn shadow-sm'
                      : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                  title="Second speed (Double tempo)"
                >
                  2x
                </button>
              </div>
            </div>

            {/* Mode Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViolinMode((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                  violinMode
                    ? 'bg-[#C7A45B]/20 text-[#E0C98F] border-[#C7A45B]/40 shadow-sm'
                    : 'bg-[#1c1a14] text-[#BDB4A4] border-[#3B392F] hover:text-[#F4EBDD]'
                }`}
                title="Press 'V' to toggle Violin Practice Mode"
              >
                <Disc3 className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>{isMl ? 'വയലിൻ മോഡ്' : 'Violin Mode'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Violin Practice Guides, Acoustic Info & Cultural Provenance */}
        <div className="space-y-4">
          {/* Active Note Pedagogical Focus */}
          <div className="bg-[#161410] border border-[#3B392F] rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#E0C98F] uppercase tracking-wider flex items-center gap-2">
              <Music className="w-4 h-4 text-[#C7A45B]" />
              <span>{isMl ? 'സ്വര സാങ്കേതിക വിവരണം' : 'Active Swara Acoustics'}</span>
            </h3>

            {activeSwara ? (
              <div className="bg-[#11100D] p-4 rounded-xl border border-[#3B392F]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-black text-[#E0C98F]">{activeSwara.swara}</span>
                  <span className="text-xs font-mono text-[#BDB4A4] bg-[#1c1a14] px-2.5 py-1 rounded border border-[#3B392F]">
                    Ratio: {activeSwara.ratio.toFixed(4)}
                  </span>
                </div>
                <div className="text-xs text-[#BDB4A4]">
                  <span className="text-[#8A7F6D] font-mono">{isMl ? 'സ്ഥായി' : 'Octave'}:</span>{' '}
                  <span className="capitalize font-medium text-[#F4EBDD]">{activeSwara.octave} Sthayi</span>
                </div>
                {activeSwara.gamaka && (
                  <div className="text-xs text-[#E0C98F] bg-[#C7A45B]/10 p-2.5 rounded-lg border border-[#C7A45B]/20">
                    <span className="font-bold uppercase tracking-wider font-mono">{activeSwara.gamaka.type} Gamaka:</span>{' '}
                    <span>
                      {activeSwara.gamaka.type === 'jaru'
                        ? 'Continuous portamento slide across pitch ratios.'
                        : 'Periodic microtonal oscillation around the harmonic center.'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-[#8A7F6D] italic p-3 text-center">
                {isMl ? 'സ്വരങ്ങൾ പ്ലേ ചെയ്യുക' : 'Start playback to inspect swara acoustics'}
              </div>
            )}
          </div>

          {/* Violin Practice Guide Card (when violin mode active) */}
          {violinMode && (
            <div className="bg-[#1c1a14] border border-[#C7A45B]/30 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-[#E0C98F] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C7A45B]" />
                  <span>{isMl ? 'വയലിൻ സാധക സഹായി' : 'Violin Practice Guide'}</span>
                </h3>
                <span className="text-[10px] font-mono bg-[#C7A45B]/15 text-[#E0C98F] px-2 py-0.5 rounded-full border border-[#C7A45B]/30">
                  Tradition-Aware
                </span>
              </div>

              {composition.violinPracticeNotes && (
                <p className="text-xs text-[#BDB4A4] leading-relaxed bg-[#11100D] p-3 rounded-xl border border-[#3B392F]">
                  {isMl && composition.violinPracticeNotesMl
                    ? composition.violinPracticeNotesMl
                    : composition.violinPracticeNotes}
                </p>
              )}

              {/* String & Bowing Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#11100D] p-2.5 rounded-xl border border-[#3B392F]">
                  <div className="text-[10px] text-[#8A7F6D] font-mono font-semibold mb-1">Carnatic Tuning:</div>
                  <div className="font-mono text-[11px] text-[#E0C98F]">
                    S1: Ṡ | S2: P | S3: S | S4: Ḍ
                  </div>
                </div>
                <div className="bg-[#11100D] p-2.5 rounded-xl border border-[#3B392F]">
                  <div className="text-[10px] text-[#8A7F6D] font-mono font-semibold mb-1">Bowing Glyphs:</div>
                  <div className="font-mono text-[11px] text-[#E0C98F]">
                    ⊓ Down-Bow | ∨ Up-Bow
                  </div>
                </div>
              </div>

              {/* Microphone Pitch Feedback Toggle with Non-judgmental Disclaimer */}
              <div className="bg-[#11100D] p-3.5 rounded-xl border border-[#3B392F] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[#F4EBDD] flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-[#C7A45B]" />
                    <span>{isMl ? 'മൈക്രോഫോൺ പിച്ച് സഹായി' : 'Mic Pitch Reference'}</span>
                  </span>
                  <button
                    onClick={toggleMicPitch}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                      micPitchActive
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#1c1a14] text-[#BDB4A4] border border-[#3B392F] hover:text-[#F4EBDD]'
                    }`}
                  >
                    {micPitchActive ? (isMl ? 'ഓഫ്' : 'Stop') : (isMl ? 'ഓൺ' : 'Start')}
                  </button>
                </div>

                {micPitchActive && (
                  <div className="p-2.5 bg-[#C7A45B]/10 border border-[#C7A45B]/30 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-[#BDB4A4] font-mono">Target Note:</span>
                    <span className="text-base font-serif font-extrabold text-[#E0C98F]">
                      {detectedPitchNote || activeSwara?.swara || 'S'}
                    </span>
                  </div>
                )}

                {/* Honest Cultural Accuracy Disclaimer */}
                <div className="flex items-start gap-1.5 text-[10px] text-[#E0C98F]/90 bg-[#C7A45B]/10 p-2.5 rounded-lg border border-[#C7A45B]/20">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#C7A45B]" />
                  <span>
                    {isMl
                      ? 'മൈക്രോഫോൺ പിച്ച് ഗമകങ്ങളുടെയോ വില്ലിന്റെ സൂക്ഷ്മ ഭാവങ്ങളുടെയോ പൂർണ്ണത അളക്കുന്നതല്ല; സാധക സഹായി മാത്രമാണ്.'
                      : 'Pitch feedback provides an approximate acoustic reference only. It cannot evaluate gamaka subtleties, bowing dynamics, or traditional aesthetic expression.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cultural Provenance & Copyright Status */}
          <div className="bg-[#161410] border border-[#3B392F] rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#E0C98F] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isMl ? 'പൈതൃക ആധികാരികതയും പകർപ്പവകാശവും' : 'Provenance & Rights'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-[#11100D] p-2.5 rounded-xl border border-[#3B392F]">
                <span className="text-[#8A7F6D] font-mono">{isMl ? 'അവകാശം' : 'Rights Status'}:</span>
                <span className="font-semibold text-emerald-400 font-mono capitalize">
                  {composition.rights.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#11100D] p-2.5 rounded-xl border border-[#3B392F]">
                <span className="text-[#8A7F6D] font-mono">{isMl ? 'ഓഡിയോ മാധ്യമം' : 'Audio Engine'}:</span>
                <span className="font-mono text-[11px] text-[#E0C98F]">
                  {composition.audioReference?.type === 'synthetic_browser_generated'
                    ? 'Pure Just Intonation Web Audio'
                    : 'Verified Classical Recording'}
                </span>
              </div>
              {composition.sources && composition.sources.length > 0 && (
                <div className="bg-[#11100D] p-2.5 rounded-xl border border-[#3B392F] space-y-1">
                  <span className="text-[#8A7F6D] block text-[11px] font-mono font-semibold">
                    {isMl ? 'പ്രമാണ സ്രോതസ്സ്' : 'Primary Source Citation'}:
                  </span>
                  <div className="text-[11px] text-[#F4EBDD]">
                    {composition.sources[0].title} — {composition.sources[0].authorOrCreator} (
                    {composition.sources[0].citation})
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#8A7F6D] italic text-center pt-1 font-mono">
              {isMl
                ? 'നാദവേഴ്സ് എന്നെന്നും 100% സൗജന്യമാണ്. പരസ്യങ്ങളോ സബ്‌സ്‌ക്രിപ്ഷനുകളോ ഇല്ല.'
                : 'NadaVerse is 100% free forever. No paywalls, no subscriptions, no ads.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
