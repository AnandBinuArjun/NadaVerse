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
  Volume2
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
  const [selectedRaga, setSelectedRaga] = useState<string>('all');
  const [selectedTala, setSelectedTala] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [violinOnly, setViolinOnly] = useState<boolean>(false);

  // Active playing composition (null = browse mode, composition = player mode)
  const [activeComposition, setActiveComposition] = useState<PlayableComposition | null>(null);

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
          comp.educationalSummary.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedRaga, selectedTala, violinOnly]);

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
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <InteractiveCompositionPlayer
          composition={activeComposition}
          onBackToLibrary={() => setActiveComposition(null)}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/40 border border-amber-500/20 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMl ? 'കർണ്ണാടക സംഗീത രചനാ ലൈബ്രറി' : 'Interactive Carnatic Composition Library'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {isMl ? 'വർണ്ണങ്ങളും കൃതികളും' : 'Playable Varnams & Keerthanams'}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            {isMl
              ? 'കർണ്ണാടക സംഗീതത്തിലെ പ്രമുഖ വർണ്ണങ്ങൾ, കീർത്തനങ്ങൾ, ഗീതങ്ങൾ, സ്വരജതികൾ, അഭ്യാസ പാഠങ്ങൾ എന്നിവ താംബുര ശ്രുതിയോടെയും സ്വര ഹൈലൈറ്റിംഗോടെയും കൃത്യമായി കേൾക്കാനും പഠിക്കാനും സാധകം ചെയ്യാനും.'
              : 'Listen to, study, and practise classical Carnatic compositions with high-precision Web Audio synthesis, synchronized swara highlighting, real-time Tala kriya beads, and Carnatic violin fingering annotations.'}
          </p>

          {/* Core Guarantees Banner */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isMl ? '100% സൗജന്യം എന്നെന്നും' : '100% Free Forever'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isMl ? 'ആധികാരിക പ്രമാണങ്ങൾ' : 'Treatise-Grounded Provenance'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/20">
              <Disc3 className="w-3.5 h-3.5" />
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
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              selectedCategory === cat.key
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-amber-500/30'
            }`}
          >
            <span>{isMl ? cat.labelMl : cat.labelEn}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.key ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Secondary Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isMl
                  ? 'രചന, രാഗം, താളം, വാഗ്ഗേയകാരൻ എന്നിവ തിരയുക...'
                  : 'Search by title, raga, tala, composer, or keywords...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Raga Filter */}
            <select
              value={selectedRaga}
              onChange={(e) => setSelectedRaga(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">{isMl ? 'എല്ലാ നിലവാരവും' : 'All Levels'}</option>
              <option value="beginner">{isMl ? 'പ്രാരംഭം (Beginner)' : 'Beginner'}</option>
              <option value="intermediate">{isMl ? 'മധ്യമം (Intermediate)' : 'Intermediate'}</option>
              <option value="advanced">{isMl ? 'ഉന്നതം (Advanced)' : 'Advanced'}</option>
            </select>

            {/* Violin Pieces Only Toggle */}
            <button
              onClick={() => setViolinOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                violinOnly
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>{isMl ? 'വയലിൻ കുറിപ്പുകൾ' : 'Violin Guides'}</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            {isMl ? 'കണ്ടെത്തിയ രചനകൾ' : 'Compositions found'}:{' '}
            <strong className="text-amber-400">{filteredCompositions.length}</strong>
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedRaga !== 'all' || selectedTala !== 'all' || selectedDifficulty !== 'all' || violinOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRaga('all');
                setSelectedTala('all');
                setSelectedDifficulty('all');
                setViolinOnly(false);
              }}
              className="text-amber-400 hover:underline text-xs"
            >
              {isMl ? 'ഫിൽട്ടറുകൾ നീക്കം ചെയ്യുക' : 'Reset all filters'}
            </button>
          )}
        </div>
      </div>

      {/* Composition Cards Grid */}
      {filteredCompositions.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {isMl ? 'രചനകൾ കണ്ടെത്തിയില്ല' : 'No compositions matched your filters'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isMl
              ? 'തിരഞ്ഞെടുത്ത മാനദണ്ഡങ്ങൾ മാറ്റുകയോ ഫിൽട്ടറുകൾ നീക്കം ചെയ്യുകയോ ചെയ്യുക.'
              : 'Try clearing your search query or selecting a different category or difficulty level.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompositions.map((comp) => {
            const hasViolinGuide = !!comp.violinPracticeNotes || comp.category === 'violin_piece';
            return (
              <div
                key={comp.id}
                className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Card Top: Badges & Title */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {isMl ? comp.categoryLabelMl : comp.categoryLabelEn}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {isMl ? comp.difficultyMl : comp.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                      {isMl ? comp.titleMl : comp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isMl ? comp.composerMl : comp.composerName}
                    </p>
                  </div>

                  {/* Summary / Pedagogy */}
                  <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
                    {isMl ? comp.educationalSummaryMl : comp.educationalSummary}
                  </p>
                </div>

                {/* Card Metadata Details */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] block text-slate-500 font-semibold uppercase">
                        {isMl ? 'രാഗം' : 'Raga'}
                      </span>
                      <span className="font-semibold text-amber-300">
                        {isMl ? comp.ragaMl : comp.ragaName}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] block text-slate-500 font-semibold uppercase">
                        {isMl ? 'താളം' : 'Tala'}
                      </span>
                      <span className="font-semibold text-cyan-300">
                        {isMl ? comp.talaMl : comp.talaName}
                      </span>
                    </div>
                  </div>

                  {/* Section Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {comp.sections.map((sec) => (
                      <span
                        key={sec.id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {isMl ? sec.nameMl : sec.name}
                      </span>
                    ))}
                  </div>

                  {/* Violin Guide Indicator */}
                  {hasViolinGuide && (
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/90 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      <Disc3 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{isMl ? 'വയലിൻ വിരൽ-വില്ല് കുറിപ്പുകൾ സഹിതം' : 'Includes Violin Fingering & Bowing'}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <button
                  onClick={() => setActiveComposition(comp)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all transform active:scale-98"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isMl ? 'പ്ലേ ചെയ്തു സാധകം ചെയ്യുക' : 'Practise & Play'}</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
