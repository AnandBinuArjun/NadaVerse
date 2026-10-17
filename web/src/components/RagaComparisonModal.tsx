'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Volume2,
  GitCompare,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { RagaItem } from '../types/carnatic';
import { VERIFIED_RAGAS } from '../data/carnaticData';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES } from '../lib/translations';

interface RagaComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRagaA?: RagaItem;
  initialRagaB?: RagaItem;
  onAskTutor?: (topic: string) => void;
}

// Just intonation swara ratios for scale audiation
const SWARA_RATIO_TABLE: Record<string, number> = {
  'S': 1.0, 'Sa': 1.0,
  'R₁': 16 / 15, 'R1': 16 / 15, 'Ri1': 16 / 15,
  'R₂': 9 / 8, 'R2': 9 / 8, 'Ri2': 9 / 8, 'G₁': 9 / 8, 'G1': 9 / 8,
  'R₃': 6 / 5, 'R3': 6 / 5, 'Ri3': 6 / 5, 'G₂': 6 / 5, 'G2': 6 / 5,
  'G₃': 5 / 4, 'G3': 5 / 4, 'Ga3': 5 / 4,
  'M₁': 4 / 3, 'M1': 4 / 3, 'Ma1': 4 / 3,
  'M₂': 45 / 32, 'M2': 45 / 32, 'Ma2': 45 / 32,
  'P': 3 / 2, 'Pa': 3 / 2,
  'D₁': 8 / 5, 'D1': 8 / 5, 'Dha1': 8 / 5,
  'D₂': 27 / 16, 'D2': 27 / 16, 'Dha2': 27 / 16, 'N₁': 27 / 16, 'N1': 27 / 16,
  'D₃': 9 / 5, 'D3': 9 / 5, 'Dha3': 9 / 5, 'N₂': 9 / 5, 'N2': 9 / 5,
  'N₃': 15 / 8, 'N3': 15 / 8, 'Ni3': 15 / 8,
  'Ṡ': 2.0, 'S˙': 2.0, 'S.': 2.0
};

export const RagaComparisonModal: React.FC<RagaComparisonModalProps> = ({
  isOpen,
  onClose,
  initialRagaA,
  initialRagaB,
  onAskTutor
}) => {
  const { lang } = useLanguage();
  const defaultRagaA = initialRagaA || VERIFIED_RAGAS[0] || null; // Mayamalavagowla
  const defaultRagaB = initialRagaB || VERIFIED_RAGAS.find((r) => r.slug === 'shankarabharanam') || VERIFIED_RAGAS[1] || null;

  const [slugA, setSlugA] = useState<string>(defaultRagaA?.slug || 'mayamalavagowla');
  const [slugB, setSlugB] = useState<string>(defaultRagaB?.slug || 'shankarabharanam');
  const [playingTarget, setPlayingTarget] = useState<'A' | 'B' | null>(null);

  // Sync state if initial props change
  React.useEffect(() => {
    if (initialRagaA) setSlugA(initialRagaA.slug);
    if (initialRagaB) setSlugB(initialRagaB.slug);
  }, [initialRagaA, initialRagaB]);

  const ragaA = useMemo(() => VERIFIED_RAGAS.find((r) => r.slug === slugA) || VERIFIED_RAGAS[0], [slugA]);
  const ragaB = useMemo(() => VERIFIED_RAGAS.find((r) => r.slug === slugB) || VERIFIED_RAGAS[1], [slugB]);

  // Extract swara symbols from arohanam string
  const swarasA = useMemo(() => (ragaA?.arohanam ? ragaA.arohanam.split(/\s+/).filter(Boolean) : []), [ragaA]);
  const swarasB = useMemo(() => (ragaB?.arohanam ? ragaB.arohanam.split(/\s+/).filter(Boolean) : []), [ragaB]);

  // Swara set comparison
  const commonSwaras = useMemo(() => {
    const setB = new Set(swarasB);
    return swarasA.filter((s) => setB.has(s));
  }, [swarasA, swarasB]);

  const uniqueToA = useMemo(() => {
    const setB = new Set(swarasB);
    return swarasA.filter((s) => !setB.has(s));
  }, [swarasA, swarasB]);

  const uniqueToB = useMemo(() => {
    const setA = new Set(swarasA);
    return swarasB.filter((s) => !setA.has(s));
  }, [swarasA, swarasB]);

  if (!isOpen || !ragaA || !ragaB) return null;

  const playScale = async (swaras: string[], target: 'A' | 'B') => {
    if (playingTarget) return;
    setPlayingTarget(target);
    const durationPerNote = 0.5;

    for (let i = 0; i < swaras.length; i++) {
      const sym = swaras[i];
      const ratio = SWARA_RATIO_TABLE[sym] || 1.0;
      audioEngine.playSwaraNote(ratio, durationPerNote);
      await new Promise((res) => setTimeout(res, durationPerNote * 1000 * 0.9));
    }

    setPlayingTarget(null);
  };

  const nameA = lang === 'ml' && RAGA_ML_NAMES[ragaA.canonicalName] ? RAGA_ML_NAMES[ragaA.canonicalName] : ragaA.canonicalName;
  const nameB = lang === 'ml' && RAGA_ML_NAMES[ragaB.canonicalName] ? RAGA_ML_NAMES[ragaB.canonicalName] : ragaB.canonicalName;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="raga-comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#1c1914] via-[#14120e] to-[#0d0c0a] border border-[#C7A45B]/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(199,164,91,0.15)] overflow-hidden flex flex-col">
        {/* Decorative lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#3B392F] relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C7A45B]/20 border border-[#C7A45B] flex items-center justify-center text-[#E0C98F]">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 id="raga-comparison-title" className="text-base sm:text-xl font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? 'രാഗ താരതമ്യം (രാഗ വിശകലനം)' : 'Raga Comparison & Scale Analysis'}
              </h3>
              <p className="text-xs font-mono text-[#C7A45B]">
                {lang === 'ml' ? 'സ്വരസ്ഥാന സാമ്യതകളും വ്യത്യാസങ്ങളും' : 'Swarasthana Commonalities, Intervals & Rasa Contrast'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#22221D] transition-colors"
            aria-label="Close raga comparison modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 relative z-10 text-xs sm:text-sm">
          {/* Musicological Disclaimer Banner */}
          <div className="flex items-start space-x-2.5 p-3 sm:p-4 rounded-xl bg-[#1b1912] border border-[#C7A45B]/30 text-[#E0C98F]">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#C7A45B]" />
            <p className="text-[11px] sm:text-xs leading-relaxed text-[#BDB4A4]">
              <strong className="text-[#F4EBDD]">
                {lang === 'ml' ? 'സംഗീതശാസ്ത്ര തത്ത്വം: ' : 'Musicological Foundation: '}
              </strong>
              {lang === 'ml'
                ? 'ഒരു രാഗം കേവലം സ്വരങ്ങളുടെ ഗണിത ആരോഹണ-അവരോഹണ ക്രമമല്ല. ഗമകങ്ങൾ, ജീവസ്വരങ്ങൾ, പ്രയോഗങ്ങൾ, പാരമ്പര്യം എന്നിവയാണ് ഓരോ രാഗത്തിനും തനിമ നൽകുന്നത്.'
                : 'A raga is an organic melodic entity defined by gamakas, prayogas (characteristic phrases), and traditional lineage—not merely an unadorned mathematical scale.'}
            </p>
          </div>

          {/* Raga Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Raga A Selector */}
            <div className="p-4 rounded-2xl bg-[#161410] border border-[#3B392F] space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#C7A45B] block">
                {lang === 'ml' ? 'ആദ്യത്തെ രാഗം (Raga A)' : 'Primary Raga (Raga A)'}
              </label>
              <select
                value={slugA}
                onChange={(e) => setSlugA(e.target.value)}
                className="w-full bg-[#0d0c0a] border border-[#C7A45B]/40 rounded-xl px-3 py-2 text-[#F4EBDD] font-serif text-sm focus:outline-none focus:border-[#C7A45B]"
              >
                {VERIFIED_RAGAS.map((r) => (
                  <option key={`a-${r.slug}`} value={r.slug}>
                    {r.isMelakarta ? `Mela #${r.melakartaNumber}: ` : ''}{r.canonicalName}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#87947A] font-mono">
                  {ragaA.isMelakarta ? `Melakarta #${ragaA.melakartaNumber}` : 'Janya Scale'}
                </span>
                <button
                  onClick={() => playScale(swarasA, 'A')}
                  disabled={playingTarget !== null}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] text-[#E0C98F] text-[11px] font-mono transition-colors disabled:opacity-50"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C7A45B]" />
                  <span>{playingTarget === 'A' ? 'Playing...' : 'Hear Arohanam'}</span>
                </button>
              </div>
            </div>

            {/* Raga B Selector */}
            <div className="p-4 rounded-2xl bg-[#161410] border border-[#3B392F] space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#C7A45B] block">
                {lang === 'ml' ? 'താരതമ്യം ചെയ്യേണ്ട രാഗം (Raga B)' : 'Comparative Raga (Raga B)'}
              </label>
              <select
                value={slugB}
                onChange={(e) => setSlugB(e.target.value)}
                className="w-full bg-[#0d0c0a] border border-[#C7A45B]/40 rounded-xl px-3 py-2 text-[#F4EBDD] font-serif text-sm focus:outline-none focus:border-[#C7A45B]"
              >
                {VERIFIED_RAGAS.map((r) => (
                  <option key={`b-${r.slug}`} value={r.slug}>
                    {r.isMelakarta ? `Mela #${r.melakartaNumber}: ` : ''}{r.canonicalName}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#87947A] font-mono">
                  {ragaB.isMelakarta ? `Melakarta #${ragaB.melakartaNumber}` : 'Janya Scale'}
                </span>
                <button
                  onClick={() => playScale(swarasB, 'B')}
                  disabled={playingTarget !== null}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] text-[#E0C98F] text-[11px] font-mono transition-colors disabled:opacity-50"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C7A45B]" />
                  <span>{playingTarget === 'B' ? 'Playing...' : 'Hear Arohanam'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Side-by-Side Scale Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card A Details */}
            <div className="p-4 rounded-2xl bg-[#12110d] border border-[#3B392F] space-y-3">
              <div className="flex items-center justify-between border-b border-[#292720] pb-2">
                <h4 className="font-serif font-bold text-base text-[#F4EBDD]">{nameA}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30">
                  {ragaA.chakra || 'Standard Scale'}
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="text-[#BDB4A4]">
                  <span className="text-[#87947A]">Arohanam:</span>{' '}
                  <span className="text-[#F4EBDD] font-semibold">{ragaA.arohanam}</span>
                </div>
                <div className="text-[#BDB4A4]">
                  <span className="text-[#87947A]">Avarohanam:</span>{' '}
                  <span className="text-[#F4EBDD] font-semibold">{ragaA.avarohanam}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#292720]">
                <div className="text-[11px] font-mono text-[#87947A] mb-1">Rasa & Mood:</div>
                <p className="text-xs text-[#BDB4A4] italic">{ragaA.rasaAndMood}</p>
              </div>
            </div>

            {/* Card B Details */}
            <div className="p-4 rounded-2xl bg-[#12110d] border border-[#3B392F] space-y-3">
              <div className="flex items-center justify-between border-b border-[#292720] pb-2">
                <h4 className="font-serif font-bold text-base text-[#F4EBDD]">{nameB}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30">
                  {ragaB.chakra || 'Standard Scale'}
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="text-[#BDB4A4]">
                  <span className="text-[#87947A]">Arohanam:</span>{' '}
                  <span className="text-[#F4EBDD] font-semibold">{ragaB.arohanam}</span>
                </div>
                <div className="text-[#BDB4A4]">
                  <span className="text-[#87947A]">Avarohanam:</span>{' '}
                  <span className="text-[#F4EBDD] font-semibold">{ragaB.avarohanam}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#292720]">
                <div className="text-[11px] font-mono text-[#87947A] mb-1">Rasa & Mood:</div>
                <p className="text-xs text-[#BDB4A4] italic">{ragaB.rasaAndMood}</p>
              </div>
            </div>
          </div>

          {/* Swara Set Commonalities and Differences Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#15130f] border border-[#C7A45B]/30 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#F4EBDD] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'സ്വര സ്ഥാന വ്യത്യാസങ്ങൾ' : 'Swara Interval Matrix & Commonalities'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Shared Swaras */}
              <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#8ce2b0]/30 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[#8ce2b0] font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'തുല്യമായ സ്വരങ്ങൾ' : 'Shared Swaras'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {commonSwaras.map((s, i) => (
                    <span key={`common-${i}`} className="px-2 py-0.5 rounded bg-[#8ce2b0]/15 text-[#8ce2b0] font-mono text-xs border border-[#8ce2b0]/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Unique to A */}
              <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#C7A45B]/40 space-y-1.5">
                <div className="text-[#C7A45B] font-mono text-[11px]">
                  {lang === 'ml' ? `${ragaA.canonicalName}-ൽ മാത്രം` : `Only in ${ragaA.canonicalName}`}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {uniqueToA.length === 0 ? (
                    <span className="text-[11px] text-[#87947A] italic">None (Subset of B)</span>
                  ) : (
                    uniqueToA.map((s, i) => (
                      <span key={`ua-${i}`} className="px-2 py-0.5 rounded bg-[#C7A45B]/20 text-[#F4EBDD] font-mono text-xs border border-[#C7A45B]/50">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Unique to B */}
              <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#60a5fa]/40 space-y-1.5">
                <div className="text-[#60a5fa] font-mono text-[11px]">
                  {lang === 'ml' ? `${ragaB.canonicalName}-ൽ മാത്രം` : `Only in ${ragaB.canonicalName}`}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {uniqueToB.length === 0 ? (
                    <span className="text-[11px] text-[#87947A] italic">None (Subset of A)</span>
                  ) : (
                    uniqueToB.map((s, i) => (
                      <span key={`ub-${i}`} className="px-2 py-0.5 rounded bg-[#60a5fa]/20 text-[#93c5fd] font-mono text-xs border border-[#60a5fa]/50">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ask AI Tutor action */}
          {onAskTutor && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#191916] border border-[#3B392F]">
              <div>
                <div className="text-xs font-serif font-bold text-[#F4EBDD]">
                  {lang === 'ml' ? 'കൂടുതൽ സംശയങ്ങളുണ്ടോ?' : 'Deepen Musicological Understanding'}
                </div>
                <div className="text-[11px] text-[#BDB4A4]">
                  {lang === 'ml'
                    ? `ഈ രണ്ട് രാഗങ്ങളുടെ ഗമകങ്ങളെയും സാഹിത്യ പ്രയോഗങ്ങളെയും കുറിച്ച് AI ട്യൂട്ടറോട് ചോദിക്കുക.`
                    : `Inquire about prayogas, gamaka contours, and treatise citations between ${ragaA.canonicalName} and ${ragaB.canonicalName}.`}
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAskTutor(`Compare the prayogas, gamakas, and historical development of ${ragaA.canonicalName} and ${ragaB.canonicalName}`);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#C7A45B] hover:bg-[#DFB960] text-[#11110F] font-bold text-xs transition-colors shrink-0 shadow"
              >
                {lang === 'ml' ? 'ട്യൂട്ടറോട് ചോദിക്കുക' : 'Ask AI Tutor'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#3B392F] flex justify-end bg-[#11110f] relative z-10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] text-[#F4EBDD] font-mono text-xs transition-colors"
          >
            {lang === 'ml' ? 'അടയ്ക്കുക' : 'Close Comparison'}
          </button>
        </div>
      </div>
    </div>
  );
};
