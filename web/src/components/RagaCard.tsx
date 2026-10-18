'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, ShieldCheck, BookOpen, Sparkles, Edit3, Bookmark, BookmarkCheck, GitCompare } from 'lucide-react';
import { RagaItem, SwaraInfo } from '../types/carnatic';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES } from '../lib/translations';
import { RAGA_ML_DATA } from '../data/malayalamTranslations';
import { STANDARD_SWARA_RATIOS } from '../lib/carnaticRatios';

interface RagaCardProps {
  raga: RagaItem;
  onAskTutor?: (ragaName: string) => void;
  onSuggestCorrection?: (ragaName: string) => void;
  onInspectProvenance?: (raga: RagaItem) => void;
  onSelectRelatedRaga?: (ragaSlug: string) => void;
  onCompareRaga?: (raga: RagaItem) => void;
}

// Verified related raga networks
const RELATED_RAGA_MAPPING: Record<string, string[]> = {
  'mayamalavagowla': ['Malahari', 'Saveri', 'Bowli', 'Jaganmohini', 'Revagupti'],
  'shankarabharanam': ['Hamsadhwani', 'Bilahari', 'Mohanam', 'Shuddha Saveri', 'Arabhi'],
  'kalyani': ['Mohanakalyani', 'Saranga', 'Hamirkalyani', 'Yamunakalyani'],
  'harikambhoji': ['Khamas', 'Mohanam', 'Sahana', 'Kedaragowla', 'Natakurinji'],
  'kharaharapriya': ['Abheri', 'Sriranjani', 'Madhyamavati', 'Darbar', 'Kapi'],
  'thodi': ['Asaveri', 'Ahiri', 'Dhanyasi', 'Punnagavarali'],
  'natabhairavi': ['Anandabhairavi', 'Hindolam', 'Jaunpuri', 'Saramati'],
  'chakravakam': ['Bindumalini', 'Malayamarutam', 'Valaji'],
  'charukesi': ['Tarangini'],
  'simhendramadhyamam': ['Urmika', 'Seshanada']
};

interface RagaPrayoga {
  phrase: string;
  phraseMl: string;
  context: string;
  contextMl: string;
  notes: string[];
}

const CANONICAL_PRAYOGAS: Record<string, RagaPrayoga[]> = {
  'mayamalavagowla': [
    {
      phrase: 'S R₁ G₃ M₁ P',
      phraseMl: 'സ രി₁ ഗ₃ മ₁ പ',
      context: 'Fundamental ascending ascent establishing the pure Shuddha Rishabham and Antara Gandharam intervals.',
      contextMl: 'ശുദ്ധ ഋഷഭവും അന്തര ഗാന്ധാരവും ഉറപ്പിക്കുന്ന അടിസ്ഥാന സഞ്ചാരം.',
      notes: ['S', 'R₁', 'G₃', 'M₁', 'P']
    },
    {
      phrase: 'P D₁ P M₁ G₃ R₁ S',
      phraseMl: 'പ ധ₁ പ മ₁ ഗ₃ രി₁ സ',
      context: 'Characteristic resting descent highlighting the Vadi-Samvadi harmonic balance (Sa-Pa).',
      contextMl: 'ഷഡ്ജ-പഞ്ചമ സംവാദിത്വവും ഗാന്ധാര വിശ്രാന്തിയും വ്യക്തമാക്കുന്ന അവരോഹണ സഞ്ചാരം.',
      notes: ['P', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S']
    }
  ],
  'shankarabharanam': [
    {
      phrase: 'S R₂ G₃ M₁ P D₂ N₃ Ṡ',
      phraseMl: 'സ രി₂ ഗ₃ മ₁ പ ധ₂ നി₃ സ',
      context: 'Majestic whole-tone modal expansion codified in Chaturdandi Prakasika.',
      contextMl: 'ചതുർദണ്ഡി പ്രകാശികയിൽ രേഖപ്പെടുത്തിയ ഗാംഭീര്യമുള്ള സാർവത്രിക മേള സഞ്ചാരം.',
      notes: ['S', 'R₂', 'G₃', 'M₁', 'P', 'D₂', 'N₃', 'Ṡ']
    },
    {
      phrase: 'Ṡ N₃ D₂ P M₁ G₃ R₂ S',
      phraseMl: 'സ നി₃ ധ₂ പ മ₁ ഗ₃ രി₂ സ',
      context: 'Classic descending glide with gentle oscillation on Antara Gandhara.',
      contextMl: 'ഗാന്ധാരത്തിന് ജീവൻ നൽകുന്ന മനോഹരമായ അവരോഹണം.',
      notes: ['Ṡ', 'N₃', 'D₂', 'P', 'M₁', 'G₃', 'R₂', 'S']
    }
  ],
  'kalyani': [
    {
      phrase: 'S R₂ G₃ M₂ P D₂ N₃ Ṡ',
      phraseMl: 'സ രി₂ ഗ₃ മ₂ പ ധ₂ നി₃ സ',
      context: 'Radiant Prati Madhyamam signature phrase creating shimmering overtones.',
      contextMl: 'പ്രതി മധ്യമത്തിന്റെ പ്രകാശം നിറയുന്ന അദ്വിതീയ സഞ്ചാരം.',
      notes: ['S', 'R₂', 'G₃', 'M₂', 'P', 'D₂', 'N₃', 'Ṡ']
    },
    {
      phrase: 'G₃ M₂ P D₂ N₃ Ṡ',
      phraseMl: 'ഗ₃ മ₂ പ ധ₂ നി₃ സ',
      context: 'Signature Vishesha Prayoga omitting lower Sa for immediate melodic color.',
      contextMl: 'താഴത്തെ ഷഡ്ജം ഒഴിവാക്കി മധ്യസ്ഥായിയിൽ തുടങ്ങുന്ന വിശേഷ പ്രയോഗം.',
      notes: ['G₃', 'M₂', 'P', 'D₂', 'N₃', 'Ṡ']
    }
  ],
  'kharaharapriya': [
    {
      phrase: 'R₂ G₂ M₁ P D₂ N₂ Ṡ',
      phraseMl: 'രി₂ ഗ₂ മ₁ പ ധ₂ നി₂ സ',
      context: 'Chaste Sadharana Gandhara and Kaisiki Nishada anchoring the mood of deep bhakti.',
      contextMl: 'സാധാരണ ഗാന്ധാരവും കൈശികി നിഷാദവും സംയോജിക്കുന്ന ഭക്തിരസ സഞ്ചാരം.',
      notes: ['R₂', 'G₂', 'M₁', 'P', 'D₂', 'N₂', 'Ṡ']
    }
  ],
  'thodi': [
    {
      phrase: 'S R₁ G₂ M₁ P D₁ N₂ Ṡ',
      phraseMl: 'സ രി₁ ഗ₂ മ₁ പ ധ₁ നി₂ സ',
      context: 'Deep oscillating gamakas on Gandhara and Dhaivata from their adjacent lower swaras.',
      contextMl: 'ഗാന്ധാരത്തിലും ധൈവതത്തിലും ആഴത്തിലുള്ള കമ്പിത ഗമകം ഉള്ള സഞ്ചാരം.',
      notes: ['S', 'R₁', 'G₂', 'M₁', 'P', 'D₁', 'N₂', 'Ṡ']
    }
  ]
};


export const RagaCard: React.FC<RagaCardProps> = ({
  raga,
  onAskTutor,
  onSuggestCorrection,
  onInspectProvenance,
  onSelectRelatedRaga,
  onCompareRaga
}) => {
  const { lang, t } = useLanguage();
  const [activeSwaraSymbol, setActiveSwaraSymbol] = useState<string | null>(null);
  const [playingMode, setPlayingMode] = useState<'arohanam' | 'avarohanam' | 'full' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Load bookmark status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_bookmarked_ragas');
        if (stored) {
          const arr: string[] = JSON.parse(stored);
          setIsBookmarked(arr.includes(raga.slug));
        }
      } catch {}
    }
  }, [raga.slug]);

  const toggleBookmark = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('nadaverse_bookmarked_ragas');
      const arr: string[] = stored ? JSON.parse(stored) : [];
      let updated: string[];
      if (arr.includes(raga.slug)) {
        updated = arr.filter((s) => s !== raga.slug);
        setIsBookmarked(false);
      } else {
        updated = [...arr, raga.slug];
        setIsBookmarked(true);
      }
      localStorage.setItem('nadaverse_bookmarked_ragas', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('nadaverse:bookmarks_updated'));
    } catch {}
  };

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

    // Parse swara sequences
    const arohanaSymbols = raga.arohanam.split(/\s+/).filter((s) => s.trim().length > 0);
    const avarohanaSymbols = raga.avarohanam.split(/\s+/).filter((s) => s.trim().length > 0);

    const arohanaNotes = arohanaSymbols.map((sym) => ({
      symbol: sym,
      ratio: resolveSwaraRatio(sym)
    }));

    const avarohanaNotes = avarohanaSymbols.map((sym) => ({
      symbol: sym,
      ratio: resolveSwaraRatio(sym)
    }));

    let sequence: { symbol: string; ratio: number }[] = [];
    if (mode === 'arohanam') {
      sequence = arohanaNotes;
    } else if (mode === 'avarohanam') {
      sequence = avarohanaNotes;
    } else {
      sequence = [...arohanaNotes, ...avarohanaNotes.slice(1)];
    }
    const ratios = sequence.map((n) => n.ratio);

    audioEngine.playRagaScale(
      ratios,
      500,
      (idx) => {
        setActiveSwaraSymbol(sequence[idx]?.symbol || null);
      },
      () => {
        setPlayingMode(null);
        setActiveSwaraSymbol(null);
      }
    );
  };

  const ml = RAGA_ML_DATA[raga.slug];
  const malayalamName = RAGA_ML_NAMES[raga.slug];
  const relatedRagas = RELATED_RAGA_MAPPING[raga.slug] || [];
  const prayogas = CANONICAL_PRAYOGAS[raga.slug] || [];
  const [activePrayogaIdx, setActivePrayogaIdx] = useState<number | null>(null);

  const handlePlayPrayoga = (notes: string[], prayogaIdx: number) => {
    if (activePrayogaIdx === prayogaIdx) {
      handleStopScale();
      setActivePrayogaIdx(null);
      return;
    }
    handleStopScale();
    setActivePrayogaIdx(prayogaIdx);
    const ratios = notes.map((n) => resolveSwaraRatio(n));
    audioEngine.playRagaScale(
      ratios,
      600,
      (idx) => {
        setActiveSwaraSymbol(notes[idx] || null);
      },
      () => {
        setActivePrayogaIdx(null);
        setActiveSwaraSymbol(null);
      }
    );
  };

  return (
    <div className="nv-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden transition-all duration-300 border border-[#C7A45B]/20 hover:border-[#C7A45B]/50 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(199,164,91,0.12)]">
      {/* Header: Title, Melakarta, Bookmark & Review Badge */}
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

        {/* Provenance Badge & Bookmark Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#DFB960]'
                : 'bg-[#191916] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD] hover:border-[#C7A45B]/40'
            }`}
            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark raga'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <span className="inline-flex items-center space-x-1 text-xs bg-[#22221D] text-[#87947A] border border-[#3B392F] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">
              {lang === 'ml' ? 'വിദഗ്ദ്ധ പരിശോധന പൂർത്തിയായത്' : 'Expert Reviewed'}
            </span>
          </span>
        </div>
      </div>

      {/* Scale Exploration & Audio Demonstration */}
      <div className="my-4 sm:my-5 bg-[#191916]/80 p-4 sm:p-5 rounded-2xl border border-[#3B392F]/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#3B392F]/60 gap-3 mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B] flex items-center space-x-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'രാഗ സ്വര സഞ്ചാരം' : 'Scale Audio Demonstration'}</span>
          </span>

          {/* Scale Playback Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePlayScale('arohanam')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                playingMode === 'arohanam'
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                  : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
            >
              {playingMode === 'arohanam' ? 'Stop' : 'Arohanam'}
            </button>
            <button
              onClick={() => handlePlayScale('avarohanam')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                playingMode === 'avarohanam'
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                  : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
            >
              {playingMode === 'avarohanam' ? 'Stop' : 'Avarohanam'}
            </button>
            <button
              onClick={() => handlePlayScale('full')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                playingMode === 'full'
                  ? 'bg-[#DFB960] text-[#11110F] font-bold shadow'
                  : 'bg-[#C7A45B]/15 border-[#C7A45B]/40 text-[#E0C98F] hover:bg-[#C7A45B]/30'
              }`}
            >
              {playingMode === 'full' ? 'Stop' : 'Full Scale'}
            </button>
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

      {/* Raga Prayoga Explorer & Contextual Sancharas (FI-006) */}
      {prayogas.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#3B392F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DFB960]" />
              <span>{lang === 'ml' ? 'പ്രധാന രാഗ സഞ്ചാരങ്ങൾ (സവിശേഷ പ്രയോഗങ്ങൾ):' : 'Characteristic Sancharas & Signature Prayogas:'}</span>
            </span>
            <span className="text-[10px] text-[#8A7F6D] font-mono">Scale $\\neq$ Raga</span>
          </div>

          <div className="space-y-2">
            {prayogas.map((prayoga, pIdx) => (
              <div
                key={pIdx}
                className="bg-[#191916] p-3 rounded-xl border border-[#3B392F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-serif font-bold text-sm tracking-wider text-[#F4EBDD]">
                    {lang === 'ml' ? prayoga.phraseMl : prayoga.phrase}
                  </div>
                  <div className="text-[11px] text-[#BDB4A4] leading-relaxed">
                    {lang === 'ml' ? prayoga.contextMl : prayoga.context}
                  </div>
                </div>

                <button
                  onClick={() => handlePlayPrayoga(prayoga.notes, pIdx)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                    activePrayogaIdx === pIdx
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                      : 'bg-[#22221D] border-[#3B392F] text-[#E0C98F] hover:border-[#C7A45B]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{activePrayogaIdx === pIdx ? (lang === 'ml' ? 'നിർത്തുക' : 'Stop') : (lang === 'ml' ? 'കേൾക്കുക' : 'Audition')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Ragas & Sibling Janyas */}
      {relatedRagas.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#3B392F]">
          <span className="text-[11px] font-mono uppercase text-[#C7A45B] block mb-2">
            {lang === 'ml' ? 'ബന്ധപ്പെട്ട / ജന്യ രാഗങ്ങൾ:' : 'Related Ragas & Notable Janyas:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {relatedRagas.map((rel, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectRelatedRaga && onSelectRelatedRaga(rel)}
                className="px-2.5 py-1 rounded-lg bg-[#22221D] hover:bg-[#2e2d27] border border-[#3B392F] hover:border-[#C7A45B]/50 text-xs font-serif text-[#F4EBDD] transition-all cursor-pointer"
              >
                {rel}
              </button>
            ))}
          </div>
        </div>
      )}

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
          {onCompareRaga && (
            <button
              onClick={() => onCompareRaga(raga)}
              className="flex items-center space-x-1 text-[#E0C98F] hover:text-[#F4EBDD] bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] px-2.5 py-1 rounded-lg transition-colors font-medium text-xs font-mono"
              title="Compare with another raga side-by-side"
            >
              <GitCompare className="w-3.5 h-3.5 shrink-0 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'രാഗ താരതമ്യം' : 'Compare'}</span>
            </button>
          )}

          {onInspectProvenance && (
            <button
              onClick={() => onInspectProvenance(raga)}
              className="flex items-center space-x-1 text-[#C7A45B] hover:text-[#E0C98F] transition-colors py-1 font-medium"
              title="Inspect canonical treatise edition and historical manuscript provenance"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'അവലംബ വിവരങ്ങൾ' : 'Source & Provenance'}</span>
            </button>
          )}

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
                  ? `${raga.canonicalName}-നെക്കുറിച്ച് ചോദിക്കുക`
                  : 'Ask AI Tutor about this Raga'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
