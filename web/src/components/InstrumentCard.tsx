'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Layers, Sparkles } from 'lucide-react';
import { InstrumentItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';
import { INSTRUMENT_ML_NAMES } from '../lib/translations';

interface InstrumentCardProps {
  instrument: InstrumentItem;
  onAskTutor?: (instrumentName: string) => void;
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument, onAskTutor }) => {
  const { lang, t } = useLanguage();
  const malayalamName = INSTRUMENT_ML_NAMES[instrument.slug];

  return (
    <div className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 hover:border-[#C7A45B]/60 transition-all shadow-md">
      {/* Title & Family */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-[#3B392F] gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-2xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' && malayalamName ? `${malayalamName} (${instrument.canonicalName})` : instrument.canonicalName}
            </h3>
            <span className="text-xs bg-[#22221D] text-[#C7A45B] border border-[#3B392F] px-2 py-0.5 rounded font-mono font-medium">
              {instrument.family}
            </span>
          </div>
          <div className="text-xs text-[#BDB4A4] font-mono">
            {instrument.materials.join(' · ')}
          </div>
        </div>

        {/* Provenance Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1 text-xs bg-[#22221D] text-[#87947A] border border-[#3B392F] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Organology Verified</span>
          </span>
        </div>
      </div>

      {/* Anatomy Breakdown */}
      <div className="my-5 bg-[#22221D] p-4 rounded-xl border border-[#3B392F]">
        <div className="flex items-center space-x-2 text-xs uppercase font-mono text-[#C7A45B] mb-3">
          <Layers className="w-4 h-4" />
          <span>Acoustic Anatomy & Construction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {instrument.anatomy.map((part, idx) => (
            <div key={idx} className="bg-[#191916] p-3 rounded-lg border border-[#3B392F]/60 text-xs">
              <span className="font-serif font-bold text-[#F4EBDD] block text-sm mb-1">
                {part.part}
              </span>
              <p className="text-[#BDB4A4] leading-relaxed">{part.function}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Playing Technique & Concert Role */}
      <div className="space-y-4 text-sm text-[#F4EBDD]/90 leading-relaxed">
        <div>
          <span className="text-xs font-mono uppercase text-[#C7A45B] block mb-1">
            Concert Role & Aesthetic Significance
          </span>
          <p>{instrument.roleInConcert}</p>
        </div>

        <div>
          <span className="text-xs font-mono uppercase text-[#C7A45B] block mb-1">
            Playing Technique
          </span>
          <p className="text-[#BDB4A4] text-xs">{instrument.playingTechnique}</p>
        </div>

        <div className="text-xs bg-[#22221D]/50 p-3 rounded-lg border border-[#3B392F]/60 text-[#BDB4A4]">
          <strong className="text-[#F4EBDD]">Tuning:</strong> {instrument.tuningSystem}
        </div>
      </div>

      {/* Footer / Provenance */}
      <div className="mt-5 pt-4 border-t border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BDB4A4]">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#C7A45B]" />
          <span>
            Source: <em>{instrument.sources[0]?.title}</em> by {instrument.sources[0]?.authorOrCreator}
          </span>
        </div>

        {onAskTutor && (
          <button
            onClick={() => onAskTutor(instrument.canonicalName)}
            className="flex items-center space-x-1 text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Tutor about this Instrument</span>
          </button>
        )}
      </div>
    </div>
  );
};
