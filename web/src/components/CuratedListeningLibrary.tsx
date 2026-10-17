'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones,
  Play,
  Square,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Landmark,
  ShieldCheck,
  Music2,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CURATED_LISTENING_COMPOSITIONS, ListeningComposition } from '../data/listeningLibraryData';
import { audioEngine } from '../lib/audioEngine';

interface CuratedListeningLibraryProps {
  onNavigateToPractice?: (ragaSlug: string, talaSlug: string) => void;
  onOpenTutor?: (topic: string) => void;
  onOpenProvenance?: (entityName: string, treatise: string, citation: string) => void;
}

export const CuratedListeningLibrary: React.FC<CuratedListeningLibraryProps> = ({
  onNavigateToPractice,
  onOpenTutor,
  onOpenProvenance,
}) => {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedCompositionId, setExpandedCompositionId] = useState<string | null>(
    CURATED_LISTENING_COMPOSITIONS[0].id
  );

  // Playback state
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const playbackTimersRef = useRef<number[]>([]);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      playbackTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const stopPhrasePlayback = () => {
    playbackTimersRef.current.forEach((t) => clearTimeout(t));
    playbackTimersRef.current = [];
    setActivePlayingId(null);
    setActiveNoteIndex(null);
  };

  const playOpeningPhrase = async (comp: ListeningComposition) => {
    stopPhrasePlayback();
    await audioEngine.unlockAudio();
    setActivePlayingId(comp.id);
    setActiveNoteIndex(0);

    let cumulativeDelay = 0;
    comp.openingSwaraPhrase.forEach((item, idx) => {
      const stepDuration = item.duration * 1000;
      const tid = window.setTimeout(() => {
        setActiveNoteIndex(idx);
        audioEngine.playSwaraNote(item.ratio, item.duration * 0.95);

        // If last note, schedule wrap up
        if (idx === comp.openingSwaraPhrase.length - 1) {
          const endTid = window.setTimeout(() => {
            setActivePlayingId(null);
            setActiveNoteIndex(null);
          }, stepDuration);
          playbackTimersRef.current.push(endTid);
        }
      }, cumulativeDelay);

      playbackTimersRef.current.push(tid);
      cumulativeDelay += stepDuration;
    });
  };

  // Filtered items
  const filteredCompositions = CURATED_LISTENING_COMPOSITIONS.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.titleMl.includes(q) ||
      c.ragaName.toLowerCase().includes(q) ||
      c.ragaMl.includes(q) ||
      c.composerName.toLowerCase().includes(q) ||
      c.composerMl.includes(q) ||
      c.talaName.toLowerCase().includes(q) ||
      c.language.toLowerCase().includes(q) ||
      c.deityOrTheme.toLowerCase().includes(q);

    const matchesForm = selectedForm === 'all' || c.form === selectedForm;
    const matchesDifficulty =
      selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;

    return matchesSearch && matchesForm && matchesDifficulty;
  });

  const forms: { id: string; labelEn: string; labelMl: string }[] = [
    { id: 'all', labelEn: 'All Forms', labelMl: 'എല്ലാ രൂപങ്ങളും' },
    { id: 'Geetham', labelEn: 'Geetham', labelMl: 'ഗീതം' },
    { id: 'Swarajathi', labelEn: 'Swarajathi', labelMl: 'സ്വരജതി' },
    { id: 'Varnam', labelEn: 'Varnam', labelMl: 'വർണ്ണം' },
    { id: 'Krithi', labelEn: 'Krithi', labelMl: 'കൃതി' },
    { id: 'Thillana', labelEn: 'Thillana', labelMl: 'തില്ലാന' },
  ];

  const difficulties: { id: string; labelEn: string; labelMl: string }[] = [
    { id: 'all', labelEn: 'All Levels', labelMl: 'എല്ലാ തലങ്ങളും' },
    { id: 'Beginner', labelEn: 'Beginner', labelMl: 'പ്രാരംഭം' },
    { id: 'Intermediate', labelEn: 'Intermediate', labelMl: 'മധ്യമം' },
    { id: 'Advanced', labelEn: 'Advanced', labelMl: 'ഉന്നതം' },
  ];

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1c1a14] via-[#14130f] to-[#0d0c0a] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/30 text-xs font-mono text-[#E0C98F]">
              <Headphones className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span className="font-semibold">
                {lang === 'ml' ? 'കേൾവി ജ്ഞാനം (Kelvi Gnanam)' : 'Kelvi Gnanam • Listening Library'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C7A45B]/20 text-[#F4EBDD] font-bold">
                100% FREE
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'സംഗീത കേൾവി കളരി'
                : 'Curated Listening & Ear Training Sanctuary'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
              {lang === 'ml'
                ? 'ശുദ്ധമായ സ്വരസ്ഥാനം, ഗമക സൂക്ഷ്മതകൾ, രാഗഭാവം, താള എടുപ്പുകൾ എന്നിവ ചിട്ടയായി തിരിച്ചറിയാൻ സഹായിക്കുന്ന ആധികാരിക കൃതികളുടെ ശ്രവണ സമാഹാരം. സമ്പൂർണ്ണ സൗജന്യം, വാണിജ്യരഹിതം.'
                : 'Structured, evidence-based listening pedagogy. Discover how masters articulate pivotal Jeeva Swaras, gamaka contours, eduppus, and sangatis in canonical forms. Free forever with zero paywalls.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <div className="p-3 bg-[#171511] border border-[#C7A45B]/20 rounded-xl text-xs space-y-1">
              <div className="text-[#E0C98F] font-mono font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ml' ? 'പബ്ലിക് ഡൊമൈൻ പൈതൃകം' : 'Public Domain Heritage'}</span>
              </div>
              <p className="text-[11px] text-[#A89E8C]">
                {lang === 'ml'
                  ? 'ക്ലാസിക്കൽ ഗ്രന്ഥങ്ങളാൽ സ്ഥിരീകരിച്ചത്'
                  : 'CC-BY-SA 4.0 & Classical Treatises'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#14120e]/90 p-4 rounded-2xl border border-[#C7A45B]/25 backdrop-blur-md shadow-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C7A45B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ml'
                  ? 'കൃതി, രാഗം, താളം, വാഗ്ഗേയകാരൻ എന്നിവ തിരയുക...'
                  : 'Search by composition, raga, tala, composer, deity...'
              }
              className="w-full bg-[#0d0c0a] border border-[#C7A45B]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-[#F4EBDD] placeholder-[#A89E8C]/50 focus:outline-none focus:border-[#C7A45B] transition-colors"
            />
          </div>

          {/* Form Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#C7A45B] px-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>{lang === 'ml' ? 'രൂപം:' : 'Form:'}</span>
            </div>
            {forms.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedForm(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedForm === f.id
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-sm'
                    : 'bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#282620]'
                }`}
              >
                {lang === 'ml' ? f.labelMl : f.labelEn}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            {difficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === d.id
                    ? 'bg-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 font-semibold'
                    : 'bg-[#181611] text-[#A89E8C] hover:text-[#F4EBDD]'
                }`}
              >
                {lang === 'ml' ? d.labelMl : d.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="text-[11px] font-mono text-[#A89E8C] flex items-center justify-between pt-1 border-t border-white/5">
          <span>
            {lang === 'ml'
              ? `${filteredCompositions.length} കൃതികൾ ലഭ്യമാണ്`
              : `Showing ${filteredCompositions.length} canonical compositions`}
          </span>
          <span className="text-[#C7A45B]/80">
            {lang === 'ml' ? 'ആധാര ഷഡ്ജം അനുസരിച്ച് കേൾക്കാം' : 'Auditioned at current Adhara Sa'}
          </span>
        </div>
      </div>

      {/* Composition Cards List */}
      <div className="space-y-4">
        {filteredCompositions.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[#14120e] border border-[#C7A45B]/20 space-y-3">
            <Music2 className="w-8 h-8 text-[#C7A45B]/40 mx-auto" />
            <p className="text-sm text-[#BDB4A4]">
              {lang === 'ml'
                ? 'നിങ്ങൾ തിരഞ്ഞ മാനദണ്ഡങ്ങൾക്കൊത്ത കൃതികൾ കണ്ടെത്തിയില്ല.'
                : 'No compositions match your selected search or filter criteria.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedForm('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-1.5 rounded-lg bg-[#C7A45B]/20 text-[#E0C98F] text-xs font-semibold hover:bg-[#C7A45B]/30"
            >
              {lang === 'ml' ? 'ഫിൽട്ടറുകൾ പുനഃക്രമീകരിക്കുക' : 'Reset all filters'}
            </button>
          </div>
        ) : (
          filteredCompositions.map((comp) => {
            const isExpanded = expandedCompositionId === comp.id;
            const isPlaying = activePlayingId === comp.id;

            return (
              <div
                key={comp.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isExpanded
                    ? 'bg-[#15130f] border-[#C7A45B]/50 shadow-xl shadow-black/40 ring-1 ring-[#C7A45B]/20'
                    : 'bg-[#12110d] border-[#C7A45B]/20 hover:border-[#C7A45B]/40 shadow-md'
                }`}
              >
                {/* Header Summary */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30">
                        {lang === 'ml' ? comp.formMl : comp.form}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A89E8C] bg-white/5">
                        {lang === 'ml' ? comp.difficultyMl : comp.difficulty}
                      </span>
                      <span className="text-[11px] text-[#C7A45B]/80 font-mono">
                        {comp.language}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] truncate">
                      {lang === 'ml' ? comp.titleMl : comp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#BDB4A4]">
                      <div>
                        <span className="text-[#A89E8C]">{lang === 'ml' ? 'രാഗം: ' : 'Raga: '}</span>
                        <span className="font-semibold text-[#E0C98F]">
                          {lang === 'ml' ? comp.ragaMl : comp.ragaName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#A89E8C]">{lang === 'ml' ? 'താളം: ' : 'Tala: '}</span>
                        <span className="font-semibold text-[#F4EBDD]">
                          {lang === 'ml' ? comp.talaMl : comp.talaName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#A89E8C]">{lang === 'ml' ? 'വാഗ്ഗേയകാരൻ: ' : 'Composer: '}</span>
                        <span className="font-semibold text-[#F4EBDD]">
                          {lang === 'ml' ? comp.composerMl : comp.composerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Live Melodic Audition Button */}
                    <button
                      onClick={() => {
                        if (isPlaying) {
                          stopPhrasePlayback();
                        } else {
                          playOpeningPhrase(comp);
                        }
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isPlaying
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-gradient-to-r from-[#DFB960] to-[#C7A45B] text-[#11110F] hover:brightness-110 shadow-md shadow-[#C7A45B]/20'
                      }`}
                      title={isPlaying ? 'Stop playback' : 'Audition opening motif with Web Audio'}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>{lang === 'ml' ? 'നിർത്തുക' : 'Stop Motif'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{lang === 'ml' ? 'ആലാപനം കേൾക്കുക' : 'Play Motif'}</span>
                        </>
                      )}
                    </button>

                    {/* Expand Details Toggle */}
                    <button
                      onClick={() =>
                        setExpandedCompositionId(isExpanded ? null : comp.id)
                      }
                      className="p-2 rounded-xl bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/25 text-[#E0C98F] transition-all"
                      aria-label={isExpanded ? 'Collapse analysis' : 'Expand analysis'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Live Swara Motif Visualizer Bar */}
                <div className="px-4 sm:px-5 py-2.5 bg-[#0e0d0a]/70 border-t border-b border-[#C7A45B]/15 flex items-center justify-between gap-3 overflow-x-auto">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Volume2 className="w-3.5 h-3.5 text-[#C7A45B]" />
                    <span className="text-[11px] font-mono text-[#A89E8C]">
                      {lang === 'ml' ? 'സ്വര സഞ്ചാരം:' : 'Opening Motif:'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {comp.openingSwaraPhrase.map((note, idx) => {
                      const isCurrent = isPlaying && activeNoteIndex === idx;
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-xs font-mono transition-all duration-150 ${
                            isCurrent
                              ? 'bg-[#C7A45B] text-[#11110F] font-bold scale-110 shadow-[0_0_12px_rgba(199,164,91,0.6)]'
                              : 'bg-[#1b1914] text-[#E0C98F] border border-[#C7A45B]/20'
                          }`}
                        >
                          {note.swara}
                        </span>
                      );
                    })}
                  </div>

                  <div className="text-[10px] font-mono text-[#A89E8C] shrink-0">
                    {comp.arohanam}
                  </div>
                </div>

                {/* Expanded Pedagogical Analysis Drawer */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-b from-[#15130f] to-[#100f0c] rounded-b-2xl animate-in fade-in duration-200">
                    {/* Notation & Sahityam Excerpt */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C7A45B] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          {lang === 'ml'
                            ? 'സ്വര-സാഹിത്യ വിന്യാസം (Notation & Syllables)'
                            : 'Notation & Sahityam Syllables'}
                        </span>
                      </h4>

                      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0a0a08] border border-[#C7A45B]/20 font-mono text-xs space-y-3 overflow-x-auto">
                        {comp.sahityamLines.map((line, lIdx) => (
                          <div key={lIdx} className="space-y-1">
                            <div className="text-[#C7A45B] font-semibold tracking-wider">
                              {line.swaraText}
                            </div>
                            <div className="text-[#F4EBDD] tracking-wide">
                              {line.sahityaText}
                            </div>
                            {lang === 'ml' && line.sahityaMl && (
                              <div className="text-[#A89E8C] text-[11px]">
                                {line.sahityaMl}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Listening Analysis Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Key Swaras & Resting Points */}
                      <div className="p-4 rounded-xl bg-[#171511] border border-[#C7A45B]/15 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-[#E0C98F] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {lang === 'ml'
                              ? 'ജീവ സ്വരങ്ങളും വിശ്രാന്തിയും'
                              : 'Jeeva Swaras & Resting Centres'}
                          </span>
                        </div>
                        <p className="text-xs text-[#BDB4A4] leading-relaxed">
                          {lang === 'ml'
                            ? comp.listeningAnalysis.keySwarasMl
                            : comp.listeningAnalysis.keySwaras}
                        </p>
                      </div>

                      {/* Gamaka Nuances */}
                      <div className="p-4 rounded-xl bg-[#171511] border border-[#C7A45B]/15 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-[#E0C98F] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
                          <span>
                            {lang === 'ml' ? 'ഗമക സൂക്ഷ്മതകൾ' : 'Gamaka & Ornamentation'}
                          </span>
                        </div>
                        <p className="text-xs text-[#BDB4A4] leading-relaxed">
                          {lang === 'ml'
                            ? comp.listeningAnalysis.gamakaDetailsMl
                            : comp.listeningAnalysis.gamakaDetails}
                        </p>
                      </div>

                      {/* Laya & Eduppu Structure */}
                      <div className="p-4 rounded-xl bg-[#171511] border border-[#C7A45B]/15 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-[#E0C98F] flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-[#C7A45B]" />
                          <span>
                            {lang === 'ml' ? 'ലയവും താള എടുപ്പും' : 'Laya & Eduppu Placement'}
                          </span>
                        </div>
                        <p className="text-xs text-[#BDB4A4] leading-relaxed">
                          {lang === 'ml'
                            ? comp.listeningAnalysis.layaAndEduppuMl
                            : comp.listeningAnalysis.layaAndEduppu}
                        </p>
                      </div>

                      {/* Structural Highlights */}
                      <div className="p-4 rounded-xl bg-[#171511] border border-[#C7A45B]/15 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-[#E0C98F] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#C7A45B]" />
                          <span>
                            {lang === 'ml' ? 'രചനാ വൈശിഷ്ട്യം' : 'Structural & Poetic Context'}
                          </span>
                        </div>
                        <p className="text-xs text-[#BDB4A4] leading-relaxed">
                          {lang === 'ml'
                            ? comp.listeningAnalysis.structuralHighlightsMl
                            : comp.listeningAnalysis.structuralHighlights}
                        </p>
                      </div>
                    </div>

                    {/* Structured Listening Prompts (Active Listening Focus) */}
                    <div className="space-y-3 p-4 rounded-xl bg-[#12110e] border border-[#C7A45B]/25">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E0C98F] flex items-center gap-1.5">
                          <Headphones className="w-3.5 h-3.5 text-[#C7A45B]" />
                          <span>
                            {lang === 'ml'
                              ? 'ശ്രവണ ശ്രദ്ധാ കേന്ദ്രങ്ങൾ (Active Listening Prompts)'
                              : 'Active Listening Prompts (What to Listen For)'}
                          </span>
                        </h4>
                        <span className="text-[10px] font-mono text-[#A89E8C]">
                          {comp.listeningPrompts.length} {lang === 'ml' ? 'നിരീക്ഷണങ്ങൾ' : 'prompts'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {comp.listeningPrompts.map((prompt, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#191712] border border-white/5 text-xs text-[#F4EBDD]"
                          >
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C7A45B]/20 text-[#E0C98F] shrink-0 mt-0.5">
                              {lang === 'ml' ? prompt.focusElementMl : prompt.focusElement}
                            </span>
                            <p className="leading-relaxed text-[#BDB4A4]">
                              {lang === 'ml' ? prompt.promptMl : prompt.prompt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Footer & Provenance Link */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#C7A45B]/15">
                      <div className="flex items-center gap-2 text-[11px] text-[#A89E8C]">
                        <Landmark className="w-3.5 h-3.5 text-[#C7A45B]" />
                        <span>
                          {comp.sourceTreatise.treatise} ({comp.sourceTreatise.author})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {onOpenProvenance && (
                          <button
                            onClick={() =>
                              onOpenProvenance(
                                comp.title,
                                comp.sourceTreatise.treatise,
                                comp.sourceTreatise.citation
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/30 text-xs text-[#E0C98F] font-medium transition-all"
                          >
                            {lang === 'ml' ? 'ഗ്രന്ഥ പരിശോധന' : 'Source Evidence'}
                          </button>
                        )}

                        {onOpenTutor && (
                          <button
                            onClick={() =>
                              onOpenTutor(
                                `composition ${comp.title} in ${comp.ragaName} raga, composed by ${comp.composerName}`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/30 text-xs text-[#E0C98F] font-medium transition-all flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
                            <span>{lang === 'ml' ? 'ഗുരുവിനോട് ചോദിക്കുക' : 'Ask AI Tutor'}</span>
                          </button>
                        )}

                        {onNavigateToPractice && (
                          <button
                            onClick={() =>
                              onNavigateToPractice(comp.ragaSlug, comp.talaSlug)
                            }
                            className="px-3.5 py-1.5 rounded-lg bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'ml' ? 'കളരിയിൽ സാധകം ചെയ്യുക' : 'Practise in Studio'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
