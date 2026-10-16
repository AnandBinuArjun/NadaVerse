'use client';

import React, { useState } from 'react';
import { Volume2, ShieldCheck, BookOpen, Sparkles, Edit3 } from 'lucide-react';
import { RagaItem, SwaraInfo } from '../types/carnatic';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES } from '../lib/translations';
import { RAGA_ML_DATA } from '../data/malayalamTranslations';

interface RagaCardProps {
  raga: RagaItem;
  onAskTutor?: (ragaName: string) => void;
  onSuggestCorrection?: (ragaName: string) => void;
}

export const RagaCard: React.FC<RagaCardProps> = ({ raga, onAskTutor, onSuggestCorrection }) => {
  const { lang, t } = useLanguage();
  const [activeSwaraSymbol, setActiveSwaraSymbol] = useState<string | null>(null);
  const [playingMode, setPlayingMode] = useState<'arohanam' | 'avarohanam' | 'full' | null>(null);

  const handlePlaySingleSwara = (swara: SwaraInfo) => {
    setActiveSwaraSymbol(swara.symbol);
    audioEngine.playSwaraNote(swara.ratio, 1.2);
    setTimeout(() => {
      setActiveSwaraSymbol(null);
    }, 500);
  };

  const handleStopScale = () => {
    audioEngine.stopRagaScale();
    setPlayingMode(null);
    setActiveSwaraSymbol(null);
  };

  // Standard Carnatic 16 Swarasthana Just Intonation ratios lookup table
  const STANDARD_SWARA_RATIOS: Record<string, number> = {
    'S': 1.0, 'Sa': 1.0,
    'R₁': 16 / 15, 'R1': 16 / 15, 'Ri1': 16 / 15,
    'R₂': 9 / 8, 'R2': 9 / 8, 'Ri2': 9 / 8, 'G₁': 9 / 8, 'G1': 9 / 8, 'Ga1': 9 / 8,
    'R₃': 6 / 5, 'R3': 6 / 5, 'Ri3': 6 / 5, 'G₂': 6 / 5, 'G2': 6 / 5, 'Ga2': 6 / 5,
    'G₃': 5 / 4, 'G3': 5 / 4, 'Ga3': 5 / 4,
    'M₁': 4 / 3, 'M1': 4 / 3, 'Ma1': 4 / 3,
    'M₂': 45 / 32, 'M2': 45 / 32, 'Ma2': 45 / 32,
    'P': 3 / 2, 'Pa': 3 / 2,
    'D₁': 8 / 5, 'D1': 8 / 5, 'Dha1': 8 / 5,
    'D₂': 27 / 16, 'D2': 27 / 16, 'Dha2': 27 / 16, 'N₁': 27 / 16, 'N1': 27 / 16, 'Ni1': 27 / 16,
    'D₃': 9 / 5, 'D3': 9 / 5, 'Dha3': 9 / 5, 'N₂': 9 / 5, 'N2': 9 / 5, 'Ni2': 9 / 5,
    'N₃': 15 / 8, 'N3': 15 / 8, 'Ni3': 15 / 8,
    'Ṡ': 2.0, 'S˙': 2.0, 'S.': 2.0, 'Sa.': 2.0
  };

  // Build swara ratio lookup map from raga's specific swaraDetails + standard ratios
  const resolveSwaraRatio = React.useCallback(
    (sym: string): number => {
      const trimmed = sym.trim();
      const inRaga = raga.swaraDetails.find((s) => s.symbol === trimmed);
      if (inRaga) return inRaga.ratio;

      if (STANDARD_SWARA_RATIOS[trimmed]) return STANDARD_SWARA_RATIOS[trimmed];

      // Normalize unicode subscripts (e.g. R₁ -> R1)
      const normalized = trimmed
        .replace(/₁/g, '1')
        .replace(/₂/g, '2')
        .replace(/₃/g, '3')
        .replace(/˙/g, '');
      if (STANDARD_SWARA_RATIOS[normalized]) return STANDARD_SWARA_RATIOS[normalized];

      return 1.0;
    },
    [raga.swaraDetails]
  );

  const handlePlayScale = async (mode: 'arohanam' | 'avarohanam' | 'full') => {
    if (playingMode) {
      handleStopScale();
      return;
    }

    setPlayingMode(mode);

    // Extract exact swara symbols from notation string
    const aroSwaras = raga.arohanam
      ? raga.arohanam.trim().split(/\s+/).filter(Boolean)
      : raga.swaraDetails.map((s) => s.symbol);

    const avaSwaras = raga.avarohanam
      ? raga.avarohanam.trim().split(/\s+/).filter(Boolean)
      : [...raga.swaraDetails.map((s) => s.symbol)].reverse();

    let swaraSequence: string[] = [];
    if (mode === 'arohanam') {
      swaraSequence = aroSwaras;
    } else if (mode === 'avarohanam') {
      swaraSequence = avaSwaras;
    } else {
      swaraSequence = [...aroSwaras, ...avaSwaras];
    }

    const ratios = swaraSequence.map((sym) => resolveSwaraRatio(sym));

    audioEngine.playRagaScale(
      ratios,
      500, // Exact 500ms intervals as required
      (stepIndex) => {
        if (stepIndex < swaraSequence.length) {
          setActiveSwaraSymbol(swaraSequence[stepIndex]);
        }
      },
      () => {
        setPlayingMode(null);
        setActiveSwaraSymbol(null);
      }
    );
  };

  const malayalamName = RAGA_ML_NAMES[raga.slug];
  const ml = RAGA_ML_DATA[raga.slug];

  return (
    <div className="nv-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden transition-all duration-300 border border-[#C7A45B]/20 hover:border-[#C7A45B]/50 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(199,164,91,0.12)]">
      {/* Header: Title, Melakarta, Review Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-[#3B392F] gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' && malayalamName ? `${malayalamName} (${raga.canonicalName})` : raga.canonicalName}
            </h3>
            {raga.melakartaNumber && (
              <span className="text-xs bg-[#22221D] text-[#C7A45B] border border-[#3B392F] px-2 py-0.5 rounded font-mono font-medium">
                {t.melakarta} #{raga.melakartaNumber}
              </span>
            )}
          </div>
          <div className="text-xs text-[#BDB4A4] font-mono">
            {lang === 'ml' && ml?.chakraMl
              ? ml.chakraMl
              : lang === 'ml' && ml?.parentRagaMl
              ? ml.parentRagaMl
              : raga.chakra || (raga.parentRaga ? (lang === 'ml' ? `${raga.parentRaga}-യുടെ ജന്യരാഗം` : `Janya of ${raga.parentRaga}`) : '')}
          </div>
        </div>

        {/* Provenance & Review Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1 text-xs bg-[#22221D] text-[#87947A] border border-[#3B392F] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">
              {lang === 'ml' ? 'വിദഗ്ദ്ധ പരിശോധന പൂർത്തിയായത്' : 'Expert Reviewed'}
            </span>
          </span>
        </div>
      </div>

      {/* Arohanam & Avarohanam Notation */}
      <div className="my-4 sm:my-5 bg-[#22221D] p-3.5 sm:p-4 rounded-xl border border-[#3B392F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <span className="text-xs uppercase font-mono text-[#BDB4A4]">
            {lang === 'ml' ? 'സ്വര സഞ്ചാര ഘടന (ആരോഹണം / അവരോഹണം)' : 'Scale Structure (Arohanam / Avarohanam)'}
          </span>
          
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {playingMode ? (
              <button
                onClick={handleStopScale}
                className="flex items-center justify-center space-x-1.5 text-xs text-[#E8D7A8] bg-[#C7A45B]/20 hover:bg-[#C7A45B]/30 px-3 py-1.5 rounded-lg border border-[#C7A45B] transition-all animate-pulse w-full sm:w-auto min-h-[36px]"
                aria-label="Stop playback"
              >
                <div className="w-2 h-2 rounded-full bg-[#E0C98F] animate-ping" />
                <span>{lang === 'ml' ? 'നിർത്തുക (Stop)' : 'Stop Scale'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handlePlayScale('arohanam')}
                  className="flex items-center justify-center space-x-1 text-[11px] text-[#C7A45B] hover:text-[#E0C98F] font-medium bg-[#191916] hover:bg-[#22221D] px-2.5 py-1.5 rounded-lg border border-[#3B392F] hover:border-[#C7A45B] transition-colors flex-1 sm:flex-none min-h-[34px]"
                  aria-label={`Listen to ${raga.canonicalName} ascending scale`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'ആരോഹണം' : 'Arohanam'}</span>
                </button>
                <button
                  onClick={() => handlePlayScale('avarohanam')}
                  className="flex items-center justify-center space-x-1 text-[11px] text-[#C7A45B] hover:text-[#E0C98F] font-medium bg-[#191916] hover:bg-[#22221D] px-2.5 py-1.5 rounded-lg border border-[#3B392F] hover:border-[#C7A45B] transition-colors flex-1 sm:flex-none min-h-[34px]"
                  aria-label={`Listen to ${raga.canonicalName} descending scale`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'അവരോഹണം' : 'Avarohanam'}</span>
                </button>
                <button
                  onClick={() => handlePlayScale('full')}
                  className="flex items-center justify-center space-x-1 text-[11px] text-[#E0C98F] hover:text-[#F4EBDD] font-medium bg-[#C7A45B]/15 hover:bg-[#C7A45B]/25 px-2.5 py-1.5 rounded-lg border border-[#C7A45B]/40 hover:border-[#C7A45B] transition-colors flex-1 sm:flex-none min-h-[34px]"
                  aria-label={`Listen to ${raga.canonicalName} full scale`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C7A45B]" />
                  <span>{lang === 'ml' ? 'പൂർണ്ണ ആരോഹണ-അവരോഹണം' : 'Full Scale'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-xs text-[#C7A45B] font-mono font-bold sm:w-28 shrink-0">{t.arohanam}:</span>
            <span className="font-serif text-base sm:text-lg tracking-wider text-[#F4EBDD] break-words">
              {raga.arohanam}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-xs text-[#C7A45B] font-mono font-bold sm:w-28 shrink-0">{t.avarohanam}:</span>
            <span className="font-serif text-base sm:text-lg tracking-wider text-[#F4EBDD] break-words">
              {raga.avarohanam}
            </span>
          </div>
        </div>

        {/* Interactive Swara Pills */}
        <div className="mt-4 pt-3 border-t border-[#3B392F]/60">
          <div className="text-[11px] font-mono text-[#BDB4A4] mb-2 leading-tight">
            {lang === 'ml'
              ? 'സ്വാഭാവിക സ്വരസ്ഥാന അനുപാതം കേൾക്കാൻ ഏതു സ്വരത്തിലും തൊടുക:'
              : 'Tap any swara to audition its natural interval:'}
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {raga.swaraDetails.map((swara) => {
              const isActive = activeSwaraSymbol === swara.symbol;
              return (
                <button
                  key={swara.symbol}
                  onClick={() => handlePlaySingleSwara(swara)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all min-h-[38px] flex items-center justify-center active:scale-95 ${
                    isActive
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] scale-105 font-bold shadow-md'
                      : 'bg-[#191916] text-[#F4EBDD] border-[#3B392F] hover:border-[#C7A45B] hover:text-[#C7A45B]'
                  }`}
                  title={`${swara.name} (${swara.swarasthana})`}
                >
                  <span className="font-serif font-bold mr-1">{swara.symbol}</span>
                  <span className="text-[10px] opacity-75">{swara.ratioFraction}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Educational & Historical Details */}
      <div className="space-y-3 text-sm text-[#F4EBDD]/90 leading-relaxed">
        <p>{lang === 'ml' && ml ? ml.summaryMl : raga.educationalSummary}</p>
        <div className="text-xs text-[#BDB4A4] bg-[#22221D]/50 p-3 sm:p-3.5 rounded-xl border border-[#3B392F]/60">
          <strong className="text-[#F4EBDD]">
            {lang === 'ml' ? 'അഭ്യസന പ്രാധാന്യം: ' : 'Pedagogical Role: '}
          </strong>{' '}
          {lang === 'ml' && ml ? ml.pedagogyMl : raga.pedagogicalSignificance}
        </div>
      </div>

      {/* Famous Compositions */}
      {raga.famousCompositions && raga.famousCompositions.length > 0 && (
        <div className="mt-4 sm:mt-5 pt-4 border-t border-[#3B392F]">
          <span className="text-xs font-mono uppercase text-[#BDB4A4] block mb-2">
            {lang === 'ml'
              ? `${raga.canonicalName} രാഗത്തിലെ പ്രധാന കൃതികൾ:`
              : `Notable Compositions in ${raga.canonicalName}:`}
          </span>
          <div className="space-y-1.5">
            {raga.famousCompositions.map((comp, idx) => (
              <div
                key={idx}
                className="text-xs bg-[#22221D] p-2.5 sm:p-3 rounded-xl border border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#F4EBDD]"
              >
                <div>
                  <span className="font-semibold">{comp.title}</span> —{' '}
                  <span className="text-[#BDB4A4]">{comp.composer}</span>
                </div>
                <div className="text-[11px] font-mono text-[#C7A45B] mt-1 sm:mt-0">
                  {comp.tala} {lang === 'ml' ? 'താളം' : 'Tala'} · {comp.language}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources and Citation Metadata Footer */}
      <div className="mt-4 sm:mt-5 pt-4 border-t border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BDB4A4]">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
          <span className="leading-tight">
            {lang === 'ml' ? 'പ്രധാന അവലംബം: ' : 'Primary Source: '}
            <em>{raga.sources[0]?.title}</em> by {raga.sources[0]?.authorOrCreator}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onSuggestCorrection && (
            <button
              onClick={() => onSuggestCorrection(raga.canonicalName)}
              className="flex items-center space-x-1 text-[#87947A] hover:text-[#C7A45B] transition-colors py-1"
              title="Suggest a correction or musicological citation"
            >
              <Edit3 className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ml' ? 'തിരുത്തൽ നിർദ്ദേശിക്കുക' : 'Suggest Edit'}</span>
            </button>
          )}

          {onAskTutor && (
            <button
              onClick={() => onAskTutor(raga.canonicalName)}
              className="flex items-center space-x-1 text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors py-1"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'ml'
                  ? `${raga.canonicalName}-നെക്കുറിച്ച് സംഗീത ഗുരുവിനോട് ചോദിക്കുക`
                  : 'Ask AI Tutor about this Raga'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
