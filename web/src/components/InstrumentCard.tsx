'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Layers,
  Sparkles,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Info,
  ChevronDown,
  ChevronUp,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { InstrumentItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';
import { INSTRUMENT_ML_NAMES } from '../lib/translations';
import { INSTRUMENT_ML_DATA, ANATOMY_ML_DATA } from '../data/malayalamTranslations';
import { audioEngine } from '../lib/audioEngine';

interface InstrumentCardProps {
  instrument: InstrumentItem;
  onAskTutor?: (instrumentName: string) => void;
  onNavigateToPathway?: (pathwayId: string) => void;
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({
  instrument,
  onAskTutor,
  onNavigateToPathway
}) => {
  const { lang } = useLanguage();
  const malayalamName = INSTRUMENT_ML_NAMES[instrument.slug];
  const ml = INSTRUMENT_ML_DATA[instrument.slug];

  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);

  // Sync bookmark state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_bookmarked_instruments');
        if (stored) {
          const list: string[] = JSON.parse(stored);
          setIsBookmarked(list.includes(instrument.slug));
        }
      } catch {}
    }
  }, [instrument.slug]);

  const handleToggleBookmark = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_bookmarked_instruments');
        const list: string[] = stored ? JSON.parse(stored) : [];
        let updated: string[];
        if (list.includes(instrument.slug)) {
          updated = list.filter((s) => s !== instrument.slug);
          setIsBookmarked(false);
        } else {
          updated = [...list, instrument.slug];
          setIsBookmarked(true);
        }
        localStorage.setItem('nadaverse_bookmarked_instruments', JSON.stringify(updated));
        window.dispatchEvent(new Event('nadaverse:instrument_bookmarks_updated'));
      } catch {}
    }
  };

  const handlePlaySample = () => {
    setIsPlayingSample(true);
    audioEngine.auditionInstrument(instrument.slug);
    setTimeout(() => {
      setIsPlayingSample(false);
    }, 1800);
  };

  return (
    <div className="nv-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-[#C7A45B]/60 transition-all duration-300 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C7A45B]/5 rounded-bl-full pointer-events-none group-hover:bg-[#C7A45B]/10 transition-colors" />

      {/* Title, Family, Bookmark & Provenance */}
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

        {/* Action Controls: Audio Audition, Bookmark, Provenance */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Audio Demonstration Button */}
          <button
            onClick={handlePlaySample}
            disabled={isPlayingSample}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${
              isPlayingSample
                ? 'bg-[#C7A45B] text-[#11110F] border-[#C7A45B] font-bold shadow-md'
                : 'bg-[#181714] text-[#E0C98F] border-[#C7A45B]/30 hover:border-[#C7A45B] hover:bg-[#22201a]'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingSample ? 'animate-pulse' : ''}`} />
            <span>{isPlayingSample ? (lang === 'ml' ? 'കേൾക്കുന്നു...' : 'Auditioning...') : (lang === 'ml' ? 'ശബ്ദം കേൾക്കുക' : 'Acoustic Sample')}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark instrument'}
            className="p-1.5 rounded-full bg-[#181714] border border-[#C7A45B]/30 text-[#C7A45B] hover:text-[#E0C98F] hover:border-[#C7A45B] transition-colors cursor-pointer"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-[#DFB960]" />
            ) : (
              <Bookmark className="w-4 h-4 text-[#BDB4A4]" />
            )}
          </button>

          <span className="inline-flex items-center space-x-1.5 text-xs bg-[#6EA887]/10 text-[#6EA887] border border-[#6EA887]/30 px-3 py-1 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">
              {lang === 'ml' ? 'ശാസ്ത്രീയ വാദ്യ വിവരണം' : 'Treatise-Documented Organology'}
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
            {lang === 'ml' ? 'വാദന രീതി' : 'Playing Technique & Posture'}
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

      {/* Expandable Beginner Guidance, Common Mistakes & Maintenance */}
      <div className="my-4 relative z-10">
        <button
          onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141310] border border-[#C7A45B]/20 hover:border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] transition-all cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'തുടക്കക്കാർക്കുള്ള മാർഗ്ഗനിർദ്ദേശങ്ങളും പരിചരണവും' : 'Beginner Guidance, Pitfalls & Maintenance'}</span>
          </span>
          {isGuidanceExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#C7A45B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#C7A45B]" />
          )}
        </button>

        {isGuidanceExpanded && (
          <div className="mt-2.5 p-4 rounded-xl bg-[#0f0e0c] border border-[#C7A45B]/25 space-y-3.5 text-xs animate-in fade-in duration-200">
            {/* Beginner Guidance */}
            <div className="space-y-1">
              <div className="font-bold text-[#E0C98F] flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#DFB960]" />
                <span>{lang === 'ml' ? 'തുടക്കക്കാർ അറിയേണ്ട കാര്യങ്ങൾ' : 'Beginner Guidance & Posture'}</span>
              </div>
              <p className="text-[#BDB4A4] leading-relaxed">
                {instrument.slug === 'saraswati-veena' &&
                  'Sit strictly cross-legged with spine upright. Do not support the weight of the neck with the left hand; the left hand must be 100% loose to glide across frets for gamakas.'}
                {instrument.slug === 'carnatic-violin' &&
                  'Rest the scroll firmly on the right ankle/foot. Never hold the neck with a clenched fist or support it under the chin. The left wrist must remain straight and mobile.'}
                {instrument.slug === 'mridangam' &&
                  'Keep wrists relaxed above the drumheads. Avoid hitting hard with tense arms; resonant strokes come from whip-like forearm and fingertip release.'}
                {instrument.slug === 'ghatam' &&
                  'Position the mouth of the pot snugly against the stomach. Deep bass air beats are produced by stomach pumping pressure, not by striking harder.'}
                {instrument.slug === 'tambura' &&
                  'Pluck gently with finger pads, never with fingernails. Maintain a steady, unhurried 4-count rhythm synchronized with diaphragmatic breathing.'}
                {instrument.slug === 'carnatic-flute' &&
                  'Blow a focused, cold airstream across the outer edge of the embouchure hole. Start by getting a clear tone on Pa before attempting full closed fingerings.'}
                {instrument.slug === 'kanjira' &&
                  'Mist water sparingly on the inner lizard skin using fingertips before playing. Too much water will deaden the pitch; too little will produce a dry, unpliable sound.'}
                {instrument.slug === 'morsing' &&
                  'Never bite down on the metal frame. Hold it firmly against the teeth while keeping lips slightly apart to avoid cutting the tongue during rapid plucks.'}
                {instrument.slug === 'nadaswaram' &&
                  'Requires continuous circular breathing (nasal inhalation while sustaining cheeks). Begin practice with single swara breath endurance drills.'}
              </p>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-1 pt-2 border-t border-[#3B392F]/60">
              <div className="font-bold text-[#E17D73] flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-[#E17D73]" />
                <span>{lang === 'ml' ? 'സാധാരണ സംഭവിക്കുന്ന തെറ്റുകൾ' : 'Common Beginner Mistakes'}</span>
              </div>
              <p className="text-[#BDB4A4] leading-relaxed">
                {instrument.slug === 'saraswati-veena' &&
                  'Pressing down vertically on frets instead of pulling sideways. Carnatic gamakas require lateral string deflection across the fret wire.'}
                {instrument.slug === 'carnatic-violin' &&
                  'Using excessive bow pressure near the bridge, causing shrill acoustic scratch. Keep the bow parallel to the bridge with consistent gentle speed.'}
                {instrument.slug === 'mridangam' &&
                  'Striking the Karanai (black center) off-center or with stiff fingers, which deadens the pure bell-like harmonic ring.'}
                {instrument.slug === 'ghatam' &&
                  'Using open rigid slaps that fracture tone. Use cupped fingers and palm heels for resonant ringing tones.'}
                {instrument.slug === 'tambura' &&
                  'Rushing the sequence or plucking erratically. The Tambura is a meditative acoustic continuum, not a rhythm accompaniment.'}
                {instrument.slug === 'carnatic-flute' &&
                  'Tensing the lips into a tight grimace. The embouchure must remain relaxed with a soft aperture directed downward into the hole.'}
                {instrument.slug === 'kanjira' &&
                  'Applying water to the outer playing surface. Water must strictly be applied only to the unvarnished inner skin.'}
                {instrument.slug === 'morsing' &&
                  'Plucking backward instead of outward, causing the flexible steel tongue to strike against the teeth.'}
                {instrument.slug === 'nadaswaram' &&
                  'Neglecting reed soaking. The reed must be soaked in water or milk before playing to restore wood elasticity.'}
              </p>
            </div>

            {/* Maintenance & Care */}
            <div className="space-y-1 pt-2 border-t border-[#3B392F]/60">
              <div className="font-bold text-[#8ce2b0] flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <Wrench className="w-3.5 h-3.5 text-[#6EA887]" />
                <span>{lang === 'ml' ? 'പരിപാലനവും സൂക്ഷിപ്പും' : 'Care, Storage & Maintenance'}</span>
              </div>
              <p className="text-[#BDB4A4] leading-relaxed">
                Keep in a padded cotton gig bag away from direct sunlight, air conditioning drafts, and moisture. Clean fingerboards and strings with a soft microfiber cloth after every session to prevent rosin and sweat corrosion.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Provenance & Ask Tutor */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-[#C7A45B]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BDB4A4] relative z-10">
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
          <span className="leading-tight">
            {lang === 'ml' ? 'അവലംബം: ' : 'Source: '}
            <em>{instrument.sources[0]?.title}</em> by {instrument.sources[0]?.authorOrCreator}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {onNavigateToPathway && (
            <button
              onClick={() => onNavigateToPathway('veena')}
              className="flex items-center space-x-1.5 text-[#87947A] hover:text-[#C7A45B] font-medium transition-colors py-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ml' ? 'അഭ്യസന പാത' : 'Learning Pathway'}</span>
            </button>
          )}

          {onAskTutor && (
            <button
              onClick={() => onAskTutor(instrument.canonicalName)}
              className="flex items-center space-x-1.5 text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors py-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'ml'
                  ? `${malayalamName || instrument.canonicalName}-നെക്കുറിച്ച് ട്യൂട്ടറോട് ചോദിക്കുക`
                  : `Ask AI Tutor about ${instrument.canonicalName}`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
