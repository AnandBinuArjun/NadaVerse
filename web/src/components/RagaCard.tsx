'use client';

import React, { useState } from 'react';
import { Volume2, ShieldCheck, BookOpen, Sparkles } from 'lucide-react';
import { RagaItem, SwaraInfo } from '../types/carnatic';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES } from '../lib/translations';

interface RagaCardProps {
  raga: RagaItem;
  onAskTutor?: (ragaName: string) => void;
}

export const RagaCard: React.FC<RagaCardProps> = ({ raga, onAskTutor }) => {
  const { lang, t } = useLanguage();
  const [activeSwaraSymbol, setActiveSwaraSymbol] = useState<string | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState(false);

  const handlePlaySingleSwara = (swara: SwaraInfo) => {
    setActiveSwaraSymbol(swara.symbol);
    audioEngine.playSwaraNote(swara.ratio, 1.2);
    setTimeout(() => {
      setActiveSwaraSymbol(null);
    }, 500);
  };

  const handlePlayArohanam = async () => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);

    // Play each note of the arohanam in order
    for (let i = 0; i < raga.swaraDetails.length; i++) {
      const swara = raga.swaraDetails[i];
      setActiveSwaraSymbol(swara.symbol);
      audioEngine.playSwaraNote(swara.ratio, 0.7);
      await new Promise((resolve) => setTimeout(resolve, 550));
    }

    setActiveSwaraSymbol(null);
    setIsPlayingScale(false);
  };

  const malayalamName = RAGA_ML_NAMES[raga.slug];

  return (
    <div className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 hover:border-[#C7A45B]/60 transition-all shadow-md">
      {/* Header: Title, Melakarta, Review Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-[#3B392F] gap-3">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h3 className="text-2xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' && malayalamName ? `${malayalamName} (${raga.canonicalName})` : raga.canonicalName}
            </h3>
            {raga.melakartaNumber && (
              <span className="text-xs bg-[#22221D] text-[#C7A45B] border border-[#3B392F] px-2 py-0.5 rounded font-mono font-medium">
                {t.melakarta} #{raga.melakartaNumber}
              </span>
            )}
          </div>
          <div className="text-xs text-[#BDB4A4] font-mono">
            {raga.chakra || (raga.parentRaga ? `Janya of ${raga.parentRaga}` : '')}
          </div>
        </div>

        {/* Provenance & Review Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1 text-xs bg-[#22221D] text-[#87947A] border border-[#3B392F] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Expert Reviewed</span>
          </span>
        </div>
      </div>

      {/* Arohanam & Avarohanam Notation */}
      <div className="my-5 bg-[#22221D] p-4 rounded-xl border border-[#3B392F]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-mono text-[#BDB4A4]">
            Scale Structure (Arohanam / Avarohanam)
          </span>
          <button
            onClick={handlePlayArohanam}
            disabled={isPlayingScale}
            className="flex items-center space-x-1.5 text-xs text-[#C7A45B] hover:text-[#E0C98F] font-medium bg-[#191916] px-2.5 py-1 rounded border border-[#3B392F] hover:border-[#C7A45B] transition-colors"
            aria-label={`Listen to ${raga.canonicalName} ascending scale`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingScale ? 'Playing Scale...' : 'Hear Arohanam'}</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
            <span className="text-xs text-[#C7A45B] font-mono font-bold w-28">{t.arohanam}:</span>
            <span className="font-serif text-lg tracking-wider text-[#F4EBDD]">
              {raga.arohanam}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
            <span className="text-xs text-[#C7A45B] font-mono font-bold w-28">{t.avarohanam}:</span>
            <span className="font-serif text-lg tracking-wider text-[#F4EBDD]">
              {raga.avarohanam}
            </span>
          </div>
        </div>

        {/* Interactive Swara Pills */}
        <div className="mt-4 pt-3 border-t border-[#3B392F]/60">
          <div className="text-[11px] font-mono text-[#BDB4A4] mb-2">
            Tap any swara to audition its natural interval:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {raga.swaraDetails.map((swara) => {
              const isActive = activeSwaraSymbol === swara.symbol;
              return (
                <button
                  key={swara.symbol}
                  onClick={() => handlePlaySingleSwara(swara)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] scale-105 font-bold'
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
        <p>{raga.educationalSummary}</p>
        <div className="text-xs text-[#BDB4A4] bg-[#22221D]/50 p-3 rounded-lg border border-[#3B392F]/60">
          <strong className="text-[#F4EBDD]">Pedagogical Role:</strong> {raga.pedagogicalSignificance}
        </div>
      </div>

      {/* Famous Compositions */}
      {raga.famousCompositions && raga.famousCompositions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#3B392F]">
          <span className="text-xs font-mono uppercase text-[#BDB4A4] block mb-2">
            Notable Compositions in {raga.canonicalName}:
          </span>
          <div className="space-y-1.5">
            {raga.famousCompositions.map((comp, idx) => (
              <div
                key={idx}
                className="text-xs bg-[#22221D] p-2 rounded border border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between text-[#F4EBDD]"
              >
                <div>
                  <span className="font-semibold">{comp.title}</span> —{' '}
                  <span className="text-[#BDB4A4]">{comp.composer}</span>
                </div>
                <div className="text-[11px] font-mono text-[#C7A45B] mt-1 sm:mt-0">
                  {comp.tala} Tala · {comp.language}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources and Citation Metadata Footer */}
      <div className="mt-5 pt-4 border-t border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BDB4A4]">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#C7A45B]" />
          <span>
            Primary Source: <em>{raga.sources[0]?.title}</em> by {raga.sources[0]?.authorOrCreator}
          </span>
        </div>

        {onAskTutor && (
          <button
            onClick={() => onAskTutor(raga.canonicalName)}
            className="flex items-center space-x-1 text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Tutor about this Raga</span>
          </button>
        )}
      </div>
    </div>
  );
};
