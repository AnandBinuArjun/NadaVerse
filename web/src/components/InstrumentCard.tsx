'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Layers, Sparkles } from 'lucide-react';
import { InstrumentItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';
import { INSTRUMENT_ML_NAMES } from '../lib/translations';
import { INSTRUMENT_ML_DATA, ANATOMY_ML_DATA } from '../data/malayalamTranslations';

interface InstrumentCardProps {
  instrument: InstrumentItem;
  onAskTutor?: (instrumentName: string) => void;
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument, onAskTutor }) => {
  const { lang, t } = useLanguage();
  const malayalamName = INSTRUMENT_ML_NAMES[instrument.slug];
  const ml = INSTRUMENT_ML_DATA[instrument.slug];

  return (
    <div className="nv-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-[#C7A45B]/60 transition-all duration-300 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C7A45B]/5 rounded-bl-full pointer-events-none group-hover:bg-[#C7A45B]/10 transition-colors" />

      {/* Title & Family */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 sm:pb-5 border-b border-[#C7A45B]/20 gap-3 sm:gap-4 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD] group-hover:text-[#E0C98F] transition-colors">
              {lang === 'ml' && malayalamName ? `${malayalamName} (${instrument.canonicalName})` : instrument.canonicalName}
            </h3>
            <span className="text-xs bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30 px-2.5 py-0.5 rounded-full font-mono font-medium">
              {lang === 'ml' && ml ? ml.familyMl : instrument.family}
            </span>
          </div>
          <div className="text-xs text-[#BDB4A4] font-mono">
            {lang === 'ml' && ml ? ml.materialsMl.join(' · ') : instrument.materials.join(' · ')}
          </div>
        </div>

        {/* Provenance Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1.5 text-xs bg-[#6EA887]/10 text-[#6EA887] border border-[#6EA887]/30 px-3 py-1 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">
              {lang === 'ml' ? 'വാദ്യ ശാസ്ത്രം ഉറപ്പുവരുത്തിയത്' : 'Organology Verified'}
            </span>
          </span>
        </div>
      </div>

      {/* Anatomy Breakdown */}
      <div className="my-4 sm:my-6 bg-[#0d0c0a]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#C7A45B]/20 relative z-10">
        <div className="flex items-center space-x-2 text-xs uppercase font-mono text-[#C7A45B] mb-3 font-semibold">
          <Layers className="w-4 h-4 text-[#C7A45B]" />
          <span>
            {lang === 'ml' ? 'ശബ്ദ ശാസ്ത്ര ഘടനയും നിർമ്മാണ രീതിയും' : 'Acoustic Anatomy & Construction'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
          {instrument.anatomy.map((part, idx) => {
            const partMl = ANATOMY_ML_DATA[part.part];
            return (
              <div key={idx} className="bg-[#141310] p-3 sm:p-3.5 rounded-xl border border-[#C7A45B]/15 text-xs hover:border-[#C7A45B]/35 transition-colors">
                <span className="font-serif font-bold text-[#F4EBDD] block text-sm mb-1 text-[#E0C98F]">
                  {lang === 'ml' && partMl ? partMl.nameMl : part.part}
                </span>
                <p className="text-[#BDB4A4] leading-relaxed">
                  {lang === 'ml' && partMl ? partMl.descMl : part.function}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playing Technique & Concert Role */}
      <div className="space-y-3.5 sm:space-y-4 text-sm text-[#F4EBDD]/90 leading-relaxed relative z-10">
        <div>
          <span className="text-xs font-mono uppercase text-[#C7A45B] block mb-1 font-semibold">
            {lang === 'ml' ? 'കച്ചേരികളിലെ സ്ഥാനവും പ്രാധാന്യവും' : 'Concert Role & Aesthetic Significance'}
          </span>
          <p className="font-serif text-[#F4EBDD] text-xs sm:text-sm">{lang === 'ml' && ml ? ml.roleInConcertMl : instrument.roleInConcert}</p>
        </div>

        <div>
          <span className="text-xs font-mono uppercase text-[#C7A45B] block mb-1 font-semibold">
            {lang === 'ml' ? 'വാദന രീതി' : 'Playing Technique'}
          </span>
          <p className="text-[#BDB4A4] text-xs leading-relaxed">
            {lang === 'ml' && ml ? ml.playingTechniqueMl : instrument.playingTechnique}
          </p>
        </div>

        <div className="text-xs bg-[#0d0c0a]/60 p-3 sm:p-3.5 rounded-xl border border-[#C7A45B]/20 text-[#BDB4A4] leading-relaxed">
          <strong className="text-[#E0C98F]">
            {lang === 'ml' ? 'ശ്രുതി ക്രമീകരണം: ' : 'Tuning: '}
          </strong>{' '}
          {lang === 'ml' && ml ? ml.tuningSystemMl : instrument.tuningSystem}
        </div>
      </div>

      {/* Footer / Provenance */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-[#C7A45B]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BDB4A4] relative z-10">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
          <span className="leading-tight">
            {lang === 'ml' ? 'അവലംബം: ' : 'Source: '}
            <em>{instrument.sources[0]?.title}</em> by {instrument.sources[0]?.authorOrCreator}
          </span>
        </div>

        {onAskTutor && (
          <button
            onClick={() => onAskTutor(instrument.canonicalName)}
            className="flex items-center space-x-1.5 text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors w-full sm:w-auto text-left sm:text-right py-1"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              {lang === 'ml'
                ? `ഈ വാദ്യത്തെക്കുറിച്ച് സംഗീത ഗുരുവിനോട് ചോദിക്കുക`
                : 'Ask AI Tutor about this Instrument'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
