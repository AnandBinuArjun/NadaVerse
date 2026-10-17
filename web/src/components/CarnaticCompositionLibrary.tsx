'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Disc3,
  ArrowRight,
  CheckCircle2,
  Volume2,
  Mic,
  Layers,
  Music
} from 'lucide-react';
import { VERIFIED_COMPOSITIONS } from '../data/compositionLibraryData';
import { PlayableComposition } from '../types/composition';
import { InteractiveCompositionPlayer } from './InteractiveCompositionPlayer';
import { useLanguage } from '../context/LanguageContext';

export function CarnaticCompositionLibrary() {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMedium, setSelectedMedium] = useState<'all' | 'vocal' | 'violin' | 'both'>('all');
  const [selectedRaga, setSelectedRaga] = useState<string>('all');
  const [selectedTala, setSelectedTala] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [violinOnly, setViolinOnly] = useState<boolean>(false);

  // Active playing composition (null = browse mode, composition = player mode)
  const [activeComposition, setActiveComposition] = useState<PlayableComposition | null>(null);
  const [playerInitialMode, setPlayerInitialMode] = useState<'all' | 'violin' | 'vocal'>('all');

  // Category Tabs
  const categories: { key: string; labelEn: string; labelMl: string; count: number }[] = useMemo(() => {
    return [
      { key: 'all', labelEn: 'All Pieces', labelMl: 'എല്ലാം', count: VERIFIED_COMPOSITIONS.length },
      {
        key: 'varnam',
        labelEn: 'Varnams',
        labelMl: 'വർണ്ണങ്ങൾ',
        count: VERIFIED_COMPOSITIONS.filter((c) => c.category === 'varnam').length
      },
      {
        key: 'keerthanam',
        labelEn: 'Kritis & Keerthanams',
        labelMl: 'കൃതികൾ / കീർത്തനങ്ങൾ',
        count: VERIFIED_COMPOSITIONS.filter((c) => c.category === 'keerthanam').length
      },
      {
        key: 'geetham',
        labelEn: 'Geethams',
        labelMl: 'ഗീതങ്ങൾ',
        count: VERIFIED_COMPOSITIONS.filter((c) => c.category === 'geetham').length
      },
      {
        key: 'swarajathi',
        labelEn: 'Swarajathis',
        labelMl: 'സ്വരജതികൾ',
        count: VERIFIED_COMPOSITIONS.filter((c) => c.category === 'swarajathi').length
      },
      {
        key: 'varisai',
        labelEn: 'Varisai & Abhyasa Ganam',
        labelMl: 'അഭ്യാസ ഗാനം',
        count: VERIFIED_COMPOSITIONS.filter((c) => c.category === 'varisai').length
      },
      {
        key: 'violin_piece',
        labelEn: 'Violin Studies',
        labelMl: 'വയലിൻ സാധകങ്ങൾ',
        count: VERIFIED_COMPOSITIONS.filter((c) => c.category === 'violin_piece').length
      }
    ];
  }, []);

  // Filtered compositions
  const filteredCompositions = useMemo(() => {
    return VERIFIED_COMPOSITIONS.filter((comp) => {
      // Category filter
      if (selectedCategory !== 'all' && comp.category !== selectedCategory) {
        return false;
      }
      // Rendition medium filter
      if (selectedMedium === 'vocal') {
        const isVocal = comp.renditionTypes?.includes('vocal') || !!comp.vocalPracticeNotes || comp.category !== 'violin_piece';
        if (!isVocal) return false;
      } else if (selectedMedium === 'violin') {
        const isViolin = comp.renditionTypes?.includes('violin') || !!comp.violinPracticeNotes || comp.category === 'violin_piece';
        if (!isViolin) return false;
      } else if (selectedMedium === 'both') {
        const hasBoth = (comp.renditionTypes?.includes('vocal') && comp.renditionTypes?.includes('violin')) ||
          (!!comp.vocalPracticeNotes && !!comp.violinPracticeNotes);
        if (!hasBoth) return false;
      }
      // Raga filter
      if (selectedRaga !== 'all' && comp.ragaSlug !== selectedRaga) {
        return false;
      }
      // Tala filter
      if (selectedTala !== 'all' && comp.talaSlug !== selectedTala) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && comp.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }
      // Violin filter
      if (violinOnly && !comp.violinPracticeNotes && comp.category !== 'violin_piece') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          comp.title.toLowerCase().includes(q) ||
          comp.titleMl.toLowerCase().includes(q) ||
          comp.ragaName.toLowerCase().includes(q) ||
          comp.ragaMl.toLowerCase().includes(q) ||
          comp.composerName.toLowerCase().includes(q) ||
          comp.composerMl.toLowerCase().includes(q) ||
          comp.talaName.toLowerCase().includes(q) ||
          comp.educationalSummary.toLowerCase().includes(q) ||
          (comp.heritagePerformers?.vocalLegends && comp.heritagePerformers.vocalLegends.some(l => l.toLowerCase().includes(q))) ||
          (comp.heritagePerformers?.violinLegends && comp.heritagePerformers.violinLegends.some(l => l.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedMedium, selectedDifficulty, selectedRaga, selectedTala, violinOnly]);

  // Unique ragas and talas for filter dropdowns
  const availableRagas = useMemo(() => {
    const map = new Map<string, string>();
    VERIFIED_COMPOSITIONS.forEach((c) => map.set(c.ragaSlug, isMl ? c.ragaMl : c.ragaName));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [isMl]);

  const availableTalas = useMemo(() => {
    const map = new Map<string, string>();
    VERIFIED_COMPOSITIONS.forEach((c) => map.set(c.talaSlug, isMl ? c.talaMl : c.talaName));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [isMl]);

  // If a composition is actively open in player mode, render player
  if (activeComposition) {
    return (
      <div className="w-full">
        <InteractiveCompositionPlayer
          composition={activeComposition}
          initialMode={playerInitialMode}
          onBackToLibrary={() => setActiveComposition(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1a14] via-[#14130f] to-[#0d0c0a] border border-[#C7A45B]/30 p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/30 text-[#E0C98F] text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
            <span>{isMl ? 'കർണ്ണാടക സംഗീത രചനാ ലൈബ്രറി' : 'Interactive Carnatic Composition Library'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-[#F4EBDD] tracking-tight">
            {isMl ? 'വർണ്ണങ്ങളും കൃതികളും' : 'Playable Varnams & Keerthanams'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#BDB4A4] leading-relaxed">
            {isMl
              ? 'കർണ്ണാടക സംഗീതത്തിലെ പ്രമുഖ വർണ്ണങ്ങൾ, കീർത്തനങ്ങൾ, ഗീതങ്ങൾ, സ്വരജതികൾ, അഭ്യാസ പാഠങ്ങൾ എന്നിവ താംബുര ശ്രുതിയോടെയും സ്വര ഹൈലൈറ്റിംഗോടെയും കൃത്യമായി കേൾക്കാനും പഠിക്കാനും സാധകം ചെയ്യാനും.'
              : 'Listen to, study, and practise classical Carnatic compositions with high-precision Web Audio synthesis, synchronized swara highlighting, real-time Tala kriya beads, and Carnatic violin fingering annotations.'}
          </p>

          {/* Core Guarantees Banner */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{isMl ? '100% സൗജന്യം എന്നെന്നും' : '100% Free Forever'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#C7A45B]/15 text-[#E0C98F] px-3 py-1 rounded-full border border-[#C7A45B]/30 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
              <span>{isMl ? 'ആധികാരിക പ്രമാണങ്ങൾ' : 'Treatise-Grounded Provenance'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#C7A45B]/15 text-[#E0C98F] px-3 py-1 rounded-full border border-[#C7A45B]/30 font-mono">
              <Disc3 className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
              <span>{isMl ? 'വയലിൻ സാധക കുറിപ്പുകൾ' : 'Violin Fingering & Bowing'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
              selectedCategory === cat.key
                ? 'nv-gold-btn font-bold border-[#C7A45B] shadow-lg shadow-[#C7A45B]/20'
                : 'bg-[#161410] text-[#BDB4A4] border-[#3B392F] hover:border-[#C7A45B]/40 hover:text-[#F4EBDD]'
            }`}
          >
            <span>{isMl ? cat.labelMl : cat.labelEn}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                selectedCategory === cat.key ? 'bg-[#11110F]/20 text-[#11110F] font-bold' : 'bg-[#22221D] text-[#8A7F6D]'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Rendition Medium Filter (Vocal & Violin) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[11px] font-mono text-[#8A7F6D] uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#C7A45B]" />
          <span>{isMl ? 'മാധ്യമം:' : 'Discipline:'}</span>
        </span>
        {[
          { key: 'all', labelEn: 'All Pieces', labelMl: 'എല്ലാം' },
          { key: 'vocal', labelEn: '🎤 Sung / Vocal Pieces', labelMl: '🎤 വായ്പ്പാട്ട് കൃതികൾ' },
          { key: 'violin', labelEn: '🎻 Played / Violin Pieces', labelMl: '🎻 വയലിൻ കൃതികൾ' },
          { key: 'both', labelEn: '🎵 Both Vocal & Violin (Dual)', labelMl: '🎵 രണ്ടും ഒന്നിച്ച്' },
        ].map((med) => (
          <button
            key={med.key}
            onClick={() => setSelectedMedium(med.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap border cursor-pointer ${
              selectedMedium === med.key
                ? 'bg-[#C7A45B]/25 text-[#E0C98F] border-[#C7A45B]/60 shadow-md font-bold'
                : 'bg-[#161410] text-[#BDB4A4] border-[#3B392F] hover:border-[#C7A45B]/30 hover:text-[#F4EBDD]'
            }`}
          >
            {isMl ? med.labelMl : med.labelEn}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filters Bar */}
      <div className="bg-[#14120e]/90 border border-[#C7A45B]/25 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-3 sm:space-y-4 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#C7A45B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isMl
                  ? 'രചന, രാഗം, താളം, വാഗ്ഗേയകാരൻ, ഗായകർ എന്നിവ തിരയുക...'
                  : 'Search by title, raga, tala, composer, or performer...'
              }
              className="w-full bg-[#1c1a14] border border-[#3B392F] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4EBDD] placeholder-[#8A7F6D] focus:outline-none focus:border-[#C7A45B] focus:ring-1 focus:ring-[#C7A45B]/40 transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            {/* Raga Filter */}
            <select
              value={selectedRaga}
              onChange={(e) => setSelectedRaga(e.target.value)}
              className="bg-[#1c1a14] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B] cursor-pointer"
            >
              <option value="all">{isMl ? 'എല്ലാ രാഗങ്ങളും' : 'All Ragas'}</option>
              {availableRagas.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Tala Filter */}
            <select
              value={selectedTala}
              onChange={(e) => setSelectedTala(e.target.value)}
              className="bg-[#1c1a14] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B] cursor-pointer"
            >
              <option value="all">{isMl ? 'എല്ലാ താളങ്ങളും' : 'All Talas'}</option>
              {availableTalas.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#1c1a14] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B] cursor-pointer"
            >
              <option value="all">{isMl ? 'എല്ലാ നിലവാരവും' : 'All Levels'}</option>
              <option value="beginner">{isMl ? 'പ്രാരംഭം (Beginner)' : 'Beginner'}</option>
              <option value="intermediate">{isMl ? 'മധ്യമം (Intermediate)' : 'Intermediate'}</option>
              <option value="advanced">{isMl ? 'ഉന്നതം (Advanced)' : 'Advanced'}</option>
            </select>

            {/* Violin Pieces Only Toggle */}
            <button
              onClick={() => setViolinOnly((prev) => !prev)}
              className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                violinOnly
                  ? 'bg-[#C7A45B]/20 text-[#E0C98F] border-[#C7A45B]/50'
                  : 'bg-[#1c1a14] text-[#BDB4A4] border-[#3B392F] hover:text-[#F4EBDD] hover:border-[#C7A45B]/30'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
              <span>{isMl ? 'വയലിൻ കുറിപ്പുകൾ' : 'Violin Guides'}</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#BDB4A4] pt-1 border-t border-[#3B392F]/60">
          <span>
            {isMl ? 'കണ്ടെത്തിയ രചനകൾ' : 'Compositions found'}:{' '}
            <strong className="text-[#E0C98F] font-mono">{filteredCompositions.length}</strong>
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedMedium !== 'all' || selectedRaga !== 'all' || selectedTala !== 'all' || selectedDifficulty !== 'all' || violinOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedMedium('all');
                setSelectedRaga('all');
                setSelectedTala('all');
                setSelectedDifficulty('all');
                setViolinOnly(false);
              }}
              className="text-[#C7A45B] hover:text-[#E0C98F] underline text-xs font-mono cursor-pointer"
            >
              {isMl ? 'ഫിൽട്ടറുകൾ നീക്കം ചെയ്യുക' : 'Reset all filters'}
            </button>
          )}
        </div>
      </div>

      {/* Composition Cards Grid */}
      {filteredCompositions.length === 0 ? (
        <div className="bg-[#161410] border border-[#3B392F] rounded-3xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#8A7F6D] mx-auto" />
          <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
            {isMl ? 'രചനകൾ കണ്ടെത്തിയില്ല' : 'No compositions matched your filters'}
          </h3>
          <p className="text-xs text-[#BDB4A4] max-w-md mx-auto">
            {isMl
              ? 'തിരഞ്ഞെടുത്ത മാനദണ്ഡങ്ങൾ മാറ്റുകയോ ഫിൽട്ടറുകൾ നീക്കം ചെയ്യുകയോ ചെയ്യുക.'
              : 'Try clearing your search query or selecting a different category or difficulty level.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredCompositions.map((comp) => {
            const hasViolinGuide = !!comp.violinPracticeNotes || comp.category === 'violin_piece' || comp.renditionTypes?.includes('violin');
            const hasVocalGuide = !!comp.vocalPracticeNotes || comp.renditionTypes?.includes('vocal') || comp.category !== 'violin_piece';
            return (
              <div
                key={comp.id}
                className="group bg-[#161410] hover:bg-[#1a1813] border border-[#3B392F] hover:border-[#C7A45B]/60 rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-[#C7A45B]/10 hover:-translate-y-0.5"
              >
                {/* Main Card Body (Fills Space Above Action Button) */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  {/* Card Top: Badges & Title */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/30 text-[#E0C98F]">
                        {isMl ? comp.categoryLabelMl : comp.categoryLabelEn}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#22221D] text-[#BDB4A4] border border-[#3B392F]">
                        {isMl ? comp.difficultyMl : comp.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] group-hover:text-[#E0C98F] transition-colors line-clamp-2">
                        {isMl ? comp.titleMl : comp.title}
                      </h3>
                      <p className="text-xs text-[#8A7F6D] mt-0.5 truncate">
                        {isMl ? comp.composerMl : comp.composerName}
                      </p>
                    </div>

                    {/* Summary / Pedagogy */}
                    <p className="text-xs text-[#BDB4A4] leading-relaxed line-clamp-2">
                      {isMl ? comp.educationalSummaryMl : comp.educationalSummary}
                    </p>
                  </div>

                  {/* Card Metadata Details */}
                  <div className="space-y-3 pt-3 border-t border-[#3B392F]/80 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#11100D] p-2 sm:p-2.5 rounded-xl border border-[#3B392F]/80 min-w-0">
                        <span className="text-[10px] block text-[#8A7F6D] font-mono uppercase tracking-wider">
                          {isMl ? 'രാഗം' : 'Raga'}
                        </span>
                        <span
                          className="font-semibold text-[#E0C98F] block truncate"
                          title={isMl ? comp.ragaMl : comp.ragaName}
                        >
                          {isMl ? comp.ragaMl : comp.ragaName}
                        </span>
                      </div>
                      <div className="bg-[#11100D] p-2 sm:p-2.5 rounded-xl border border-[#3B392F]/80 min-w-0">
                        <span className="text-[10px] block text-[#8A7F6D] font-mono uppercase tracking-wider">
                          {isMl ? 'താളം' : 'Tala'}
                        </span>
                        <span
                          className="font-semibold text-[#D9A441] block truncate"
                          title={isMl ? comp.talaMl : comp.talaName}
                        >
                          {isMl ? comp.talaMl : comp.talaName}
                        </span>
                      </div>
                    </div>

                    {/* Section Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 min-h-[24px]">
                      {comp.sections.map((sec) => (
                        <span
                          key={sec.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1c1a14] text-[#BDB4A4] border border-[#3B392F] whitespace-nowrap"
                        >
                          {isMl ? sec.nameMl : sec.name}
                        </span>
                      ))}
                    </div>

                    {/* Rendition Indicators (Vocal & Violin) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {hasVocalGuide && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <Mic className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{isMl ? 'വായ്പ്പാട്ട് സാധകം' : 'Vocal / Sung'}</span>
                        </div>
                      )}
                      {hasViolinGuide && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#E0C98F] bg-[#C7A45B]/10 px-2 py-0.5 rounded-md border border-[#C7A45B]/25">
                          <Disc3 className="w-3 h-3 text-[#C7A45B] shrink-0" />
                          <span>{isMl ? 'വയലിൻ വാദനം' : 'Violin / Played'}</span>
                        </div>
                      )}
                    </div>

                    {/* Heritage Legends Snippet if available */}
                    {comp.heritagePerformers && (
                      <div className="bg-[#11100D] p-2 rounded-xl border border-[#3B392F]/60 text-[11px] space-y-1">
                        {comp.heritagePerformers.vocalLegends && comp.heritagePerformers.vocalLegends.length > 0 && (
                          <div className="truncate">
                            <span className="text-[#8A7F6D] font-mono font-medium">{isMl ? '🎤 പാടിയത്:' : '🎤 Sung by:'} </span>
                            <span className="text-[#E0C98F]">{comp.heritagePerformers.vocalLegends.slice(0, 2).join(', ')}</span>
                          </div>
                        )}
                        {comp.heritagePerformers.violinLegends && comp.heritagePerformers.violinLegends.length > 0 && (
                          <div className="truncate">
                            <span className="text-[#8A7F6D] font-mono font-medium">{isMl ? '🎻 വയലിൻ:' : '🎻 Violin by:'} </span>
                            <span className="text-[#E0C98F]">{comp.heritagePerformers.violinLegends.slice(0, 2).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons (Direct Vocal / Violin / Ensemble Modes) */}
                <div className="pt-4 mt-auto">
                  {hasVocalGuide && hasViolinGuide ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setPlayerInitialMode('vocal');
                          setActiveComposition(comp);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#1c1a14] hover:bg-[#22221D] text-[#E0C98F] border border-[#C7A45B]/40 hover:border-[#C7A45B] font-mono text-xs font-semibold transition-all cursor-pointer shadow-sm"
                        title={isMl ? 'വായ്പ്പാട്ട് സാധകം ആരംഭിക്കുക' : 'Practise Singing Vocal'}
                      >
                        <Mic className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
                        <span>{isMl ? 'പാടുക' : 'Sing'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setPlayerInitialMode('violin');
                          setActiveComposition(comp);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#1c1a14] hover:bg-[#22221D] text-[#E0C98F] border border-[#C7A45B]/40 hover:border-[#C7A45B] font-mono text-xs font-semibold transition-all cursor-pointer shadow-sm"
                        title={isMl ? 'വയലിൻ സാധകം ആരംഭിക്കുക' : 'Practise Playing Violin'}
                      >
                        <Disc3 className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
                        <span>{isMl ? 'വായിക്കുക' : 'Play'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setPlayerInitialMode('all');
                          setActiveComposition(comp);
                        }}
                        className="py-2.5 px-3 rounded-xl nv-gold-btn font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center"
                        title={isMl ? 'രണ്ടും ഒന്നിച്ച്' : 'Both Vocal & Violin'}
                      >
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setPlayerInitialMode(hasViolinGuide ? 'violin' : 'vocal');
                        setActiveComposition(comp);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl nv-gold-btn font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 shrink-0" />
                      <span>{isMl ? 'പ്ലേ ചെയ്തു സാധകം ചെയ്യുക' : 'Practise & Play'}</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
