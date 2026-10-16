'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Activity, Disc3 } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { VERIFIED_TALAS } from '../data/carnaticData';
import { TalaItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';
import { TALA_ML_NAMES } from '../lib/translations';
import { TALA_ML_DETAILS } from '../data/malayalamTranslations';

export const TalaStudio: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedTala, setSelectedTala] = useState<TalaItem>(VERIFIED_TALAS[0]); // Adi Tala
  const [bpm, setBpm] = useState(72);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number>(-1);
  const [isAccentBeat, setIsAccentBeat] = useState<boolean>(false);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    // Stop metronome when unmounting
    return () => {
      audioEngine.stopTala();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stopTala();
      setIsPlaying(false);
      setActiveBeat(-1);
    } else {
      const beatActions = selectedTala.beatActions.map((b) => ({
        isAccent: b.actionType === 'thattu'
      }));

      audioEngine.startTala(bpm, selectedTala.totalAksharas, beatActions, (beatIdx, isAccent) => {
        setActiveBeat(beatIdx);
        setIsAccentBeat(isAccent);
      });
      setIsPlaying(true);
    }
  };

  const handleTalaChange = (tala: TalaItem) => {
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      audioEngine.stopTala();
    }
    setSelectedTala(tala);
    setActiveBeat(-1);

    if (wasPlaying) {
      const beatActions = tala.beatActions.map((b) => ({
        isAccent: b.actionType === 'thattu'
      }));
      audioEngine.startTala(bpm, tala.totalAksharas, beatActions, (beatIdx, isAccent) => {
        setActiveBeat(beatIdx);
        setIsAccentBeat(isAccent);
      });
    }
  };

  const handleBpmChange = (newBpm: number) => {
    const clamped = Math.max(30, Math.min(220, newBpm));
    setBpm(clamped);
    audioEngine.setTalaBpm(clamped);
  };

  const handleTapTempo = () => {
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
  };

  const currentAction = activeBeat >= 0 ? selectedTala.beatActions[activeBeat] : null;
  const talaMl = TALA_ML_DETAILS[selectedTala.slug];

  const getActionLabel = (actionType: string, fallback: string) => {
    if (lang !== 'ml') return fallback;
    if (actionType === 'thattu') return 'തട്ട് (അടി)';
    if (actionType === 'veecheduthal') return 'വീച്ചെടുക്കൽ';
    return 'വിരലെണ്ണൽ';
  };

  const getAngaName = (anga: string) => {
    if (lang !== 'ml') return anga;
    if (anga === 'Laghu') return 'ലഘു';
    if (anga === 'Dhrutam') return 'ദ്രുതം';
    if (anga === 'Anudhrutam') return 'അനുദ്രുതം';
    return anga;
  };

  return (
    <section className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#3B392F] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>{lang === 'ml' ? 'താള കൃത്യതാ വാസ്തുവിദ്യ' : 'Rhythmic Precision Architecture'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'താള സ്റ്റുഡിയോ & മെട്രോനോം' : 'Tala Studio & Metronome'}
          </h2>
          <p className="text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {lang === 'ml'
              ? 'ലഘു, ദ്രുതം എന്നീ അംഗങ്ങളും, ചൊല്ല്കെട്ടുകളും, തട്ട്/വീച്ച് കൈക്രിയകളും കൃത്യമായി പാലിച്ച് സാധകം ചെയ്യാനുള്ള ഉന്നത മെട്രോനോം.'
              : 'Precision audio scheduler tracking traditional Carnatic Angas (Laghu & Dhrutam) with solkattu syllables and thattu/veechu kriya guidance.'}
          </p>
        </div>

        {/* Master Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-md ${
              isPlaying
                ? 'bg-[#C7A45B] text-[#11110F] hover:bg-[#E0C98F]'
                : 'bg-[#22221D] text-[#F4EBDD] border border-[#C7A45B]/60 hover:border-[#C7A45B] hover:bg-[#2A2A24]'
            }`}
            aria-label={isPlaying ? 'Stop Tala Metronome' : 'Start Tala Metronome'}
          >
            {isPlaying ? (
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

      {/* Tala Selector Tabs */}
      <div className="pt-6">
        <label className="block text-xs uppercase tracking-wider font-mono text-[#BDB4A4] mb-3">
          {t.talaSelector}
        </label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {VERIFIED_TALAS.map((tala) => {
            const isSelected = selectedTala.slug === tala.slug;
            const mlName = TALA_ML_NAMES[tala.slug];
            return (
              <button
                key={tala.slug}
                onClick={() => handleTalaChange(tala)}
                className={`py-2.5 px-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD]'
                    : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD] hover:border-[#3B392F]/80'
                }`}
              >
                <div className="text-sm font-semibold">
                  {lang === 'ml' && mlName ? mlName : tala.canonicalName}
                </div>
                <div className="text-[11px] text-[#C7A45B] font-mono mt-0.5">
                  {tala.angasFormula} ({tala.totalAksharas} {t.aksharas})
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tala Visualizer */}
      <div className="mt-8 bg-[#22221D] p-6 rounded-2xl border border-[#3B392F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3B392F]/60 gap-2">
          <div className="flex items-center space-x-2">
            <Disc3
              className={`w-5 h-5 ${isPlaying ? 'text-[#C7A45B] animate-spin' : 'text-[#BDB4A4]'}`}
            />
            <span className="font-serif font-bold text-lg text-[#F4EBDD]">
              {lang === 'ml' && TALA_ML_NAMES[selectedTala.slug]
                ? `${TALA_ML_NAMES[selectedTala.slug]} (${selectedTala.canonicalName})`
                : selectedTala.canonicalName}
            </span>
            <span className="text-xs bg-[#191916] text-[#C7A45B] px-2 py-0.5 rounded font-mono border border-[#3B392F]">
              {selectedTala.totalAksharas} {lang === 'ml' ? 'അക്ഷരങ്ങൾ' : 'Beats'}
            </span>
          </div>

          <div className="text-xs font-mono text-[#BDB4A4]">
            {lang === 'ml' ? 'അംഗങ്ങൾ: ' : 'Angas: '}
            <span className="text-[#F4EBDD] font-bold">{selectedTala.angasFormula}</span>
          </div>
        </div>

        {/* Beat Sequence Cards */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 my-6">
          {selectedTala.beatActions.map((action, idx) => {
            const isActive = activeBeat === idx;
            const isClap = action.actionType === 'thattu';
            return (
              <div
                key={action.beatIndex}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isActive
                    ? isAccentBeat
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] scale-105 shadow-lg'
                      : 'bg-[#E0C98F] text-[#11110F] border-[#F4EBDD] scale-102 shadow-md'
                    : 'bg-[#191916] border-[#3B392F] text-[#F4EBDD]'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                  {getAngaName(action.anga)}
                </span>
                <span className="text-xl font-bold font-serif my-0.5">
                  {action.beatIndex}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-[#11110F]/20 text-[#11110F]'
                      : isClap
                      ? 'bg-[#C7A45B]/20 text-[#C7A45B]'
                      : 'text-[#BDB4A4]'
                  }`}
                >
                  {action.syllable || '—'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Kriya & Gesture Instruction Banner */}
        <div className="bg-[#191916] p-4 rounded-xl border border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div>
            <span className="text-xs font-mono uppercase text-[#BDB4A4] block">
              {lang === 'ml' ? 'നിലവിലെ കൈക്രിയ (മുദ്ര):' : 'Current Hand Gesture (Kriya):'}
            </span>
            <span className="text-[#F4EBDD] font-medium text-base">
              {currentAction ? (
                <>
                  <strong className="text-[#C7A45B]">
                    {getActionLabel(currentAction.actionType, currentAction.actionLabel)}
                  </strong>{' '}
                  — {lang === 'ml' ? 'ചൊല്ല്കെട്ട്: ' : 'Solkattu: '}
                  <span className="font-mono text-[#E0C98F]">{currentAction.syllable}</span>
                </>
              ) : (
                lang === 'ml' ? 'താളം തുടങ്ങാൻ "താളം തുടങ്ങുക" അമർത്തുക' : 'Press Start Tala to begin rhythmic tracking'
              )}
            </span>
          </div>

          <div className="text-xs text-[#BDB4A4] sm:text-right max-w-sm leading-relaxed">
            {lang === 'ml' && talaMl ? talaMl.handMovementsGuideMl : selectedTala.handMovementsGuide}
          </div>
        </div>
      </div>

      {/* Tempo Controls & Tap Tempo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        {/* BPM Slider */}
        <div className="md:col-span-8 bg-[#22221D] p-5 rounded-xl border border-[#3B392F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#BDB4A4]">
              {lang === 'ml' ? 'ലയ വേഗത (ടെമ്പോ)' : 'Tempo (Laya Speed)'}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold font-mono text-[#C7A45B]">{bpm}</span>
              <span className="text-xs text-[#BDB4A4] font-mono">BPM</span>
            </div>
          </div>

          <input
            type="range"
            min="40"
            max="180"
            step="1"
            value={bpm}
            onChange={(e) => handleBpmChange(parseInt(e.target.value))}
            className="w-full accent-[#C7A45B] cursor-pointer"
            aria-label="Adjust Tala BPM"
          />

          {/* Quick Laya Presets */}
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-[#3B392F]/60 text-xs">
            <span className="text-[#BDB4A4] font-mono text-[11px]">
              {lang === 'ml' ? 'കാലങ്ങൾ:' : 'Carnatic Kalams:'}
            </span>
            <button
              onClick={() => handleBpmChange(56)}
              className={`px-2.5 py-1 rounded font-mono text-xs ${
                bpm === 56 ? 'bg-[#C7A45B] text-[#11110F]' : 'bg-[#191916] text-[#F4EBDD] hover:text-[#C7A45B]'
              }`}
            >
              {lang === 'ml' ? 'വിളംബ കാലം (56)' : 'Vilamba (56)'}
            </button>
            <button
              onClick={() => handleBpmChange(76)}
              className={`px-2.5 py-1 rounded font-mono text-xs ${
                bpm === 76 ? 'bg-[#C7A45B] text-[#11110F]' : 'bg-[#191916] text-[#F4EBDD] hover:text-[#C7A45B]'
              }`}
            >
              {lang === 'ml' ? 'മധ്യമ കാലം (76)' : 'Madhyama (76)'}
            </button>
            <button
              onClick={() => handleBpmChange(112)}
              className={`px-2.5 py-1 rounded font-mono text-xs ${
                bpm === 112 ? 'bg-[#C7A45B] text-[#11110F]' : 'bg-[#191916] text-[#F4EBDD] hover:text-[#C7A45B]'
              }`}
            >
              {lang === 'ml' ? 'ദ്രുത കാലം (112)' : 'Durita (112)'}
            </button>
          </div>
        </div>

        {/* Tap Tempo Button */}
        <div className="md:col-span-4 bg-[#22221D] p-5 rounded-xl border border-[#3B392F] flex flex-col items-center justify-center text-center">
          <button
            onClick={handleTapTempo}
            className="w-full py-3 px-4 rounded-xl bg-[#191916] hover:bg-[#2A2A24] border border-[#3B392F] hover:border-[#C7A45B] text-[#F4EBDD] font-medium text-sm transition-all active:scale-95"
          >
            {lang === 'ml' ? 'വേഗത നിശ്ചയിക്കാൻ ഇവിടെ തട്ടുക' : 'Tap Here to Set Tempo'}
          </button>
          <span className="text-[11px] text-[#BDB4A4] mt-2 font-mono">
            {lang === 'ml'
              ? 'നിങ്ങളുടെ മനസ്സിലെ വേഗത ക്രമീകരിക്കാൻ ഇവിടെ ആവർത്തിച്ചു തട്ടുക'
              : 'Tap repeatedly to synchronize with your inner pulse'}
          </span>
        </div>
      </div>
    </section>
  );
};
