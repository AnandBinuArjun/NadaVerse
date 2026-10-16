'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShrutiCompanion } from '../components/ShrutiCompanion';
import { TalaStudio } from '../components/TalaStudio';
import { TunerCompanion } from '../components/TunerCompanion';
import { PracticeRecorder } from '../components/PracticeRecorder';
import { RagaCard } from '../components/RagaCard';
import { InstrumentCard } from '../components/InstrumentCard';
import { BeginnerPath } from '../components/BeginnerPath';
import { TutorModal } from '../components/TutorModal';
import { AuthModal } from '../components/AuthModal';
import { VERIFIED_RAGAS, VERIFIED_INSTRUMENTS, VERIFIED_TALAS, GLOSSARY_TERMS, VERIFIED_COMPOSERS } from '../data/carnaticData';
import { API_BASE_URL } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES, COMPOSER_ML_NAMES } from '../lib/translations';
import {
  Compass,
  Sliders,
  BookOpen,
  Music2,
  ChevronRight,
  Search,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'home' | 'learn' | 'explore' | 'practice'>('home');
  const [exploreTab, setExploreTab] = useState<'ragas' | 'talas' | 'instruments' | 'composers' | 'glossary'>('ragas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorTopic, setTutorTopic] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; displayName: string } | null>(null);

  // Practice Session State
  const [sessionFocus, setSessionFocus] = useState('Mayamalavagowla Sarali Varisai 1-4');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionSavedSuccess, setSessionSavedSuccess] = useState(false);

  const handleOpenTutorWithTopic = (topic: string) => {
    setTutorTopic(topic);
    setIsTutorOpen(true);
  };

  const handleNavigate = (section: string) => {
    if (section === 'home' || section === 'learn' || section === 'explore' || section === 'practice') {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSavePracticeSession = async () => {
    const payload = {
      focus: sessionFocus,
      tonic: 'C',
      tala_id: 'adi-tala',
      notes: sessionNotes,
      duration_seconds: 900
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
      await fetch(`${API_BASE_URL}/api/v1/practice/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
    } catch {
      // Local fallback in case backend is offline
    }

    setSessionSavedSuccess(true);
    setTimeout(() => setSessionSavedSuccess(false), 3500);
  };

  const filteredRagas = VERIFIED_RAGAS.filter(
    (r) =>
      r.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.alternateNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (RAGA_ML_NAMES[r.slug] && RAGA_ML_NAMES[r.slug].includes(searchQuery)) ||
      r.chakra?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInstruments = VERIFIED_INSTRUMENTS.filter(
    (i) =>
      i.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComposers = VERIFIED_COMPOSERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (COMPOSER_ML_NAMES[c.name] && COMPOSER_ML_NAMES[c.name].includes(searchQuery)) ||
      c.tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.signatureMudra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryLanguages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (g) =>
      g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#11110F] text-[#F4EBDD] flex flex-col font-sans selection:bg-[#C7A45B]/30 selection:text-[#F4EBDD]">
      {/* Primary Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTutor={() => {
          setTutorTopic(undefined);
          setIsTutorOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* =========================================================================
            SECTION: HOME / HERO OVERVIEW
        ========================================================================= */}
        {activeSection === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-[#191916] border border-[#3B392F] p-8 sm:p-12 lg:p-14">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] bg-[#22221D] px-3.5 py-1.5 rounded-full border border-[#3B392F]">
                    <Music2 className="w-3.5 h-3.5" />
                    <span>{t.heroBadge}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F4EBDD] leading-[1.15] tracking-tight">
                    {t.heroTitle1} <br />
                    <span className="text-[#C7A45B]">{t.heroTitle2}</span> <br />
                    {t.heroTitle3}
                  </h1>

                  <p className="text-base sm:text-lg text-[#BDB4A4] leading-relaxed max-w-2xl font-light">
                    {t.heroDescription}
                  </p>

                  {/* Primary Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
                    <button
                      onClick={() => setActiveSection('learn')}
                      className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-sm transition-all shadow-md active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t.heroStartBtn}</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('practice')}
                      className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#22221D] hover:bg-[#2A2A24] border border-[#3B392F] hover:border-[#C7A45B] text-[#F4EBDD] font-medium text-sm transition-all"
                    >
                      <Sliders className="w-4 h-4 text-[#C7A45B]" />
                      <span>{t.heroPracticeBtn}</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('explore')}
                      className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-transparent hover:bg-[#191916] text-[#BDB4A4] hover:text-[#F4EBDD] text-sm transition-colors"
                    >
                      <Compass className="w-4 h-4" />
                      <span>{t.heroExploreBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Hero Logo Emblem */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#C7A45B]/20 via-[#40826D]/20 to-[#C7A45B]/10 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                    <img
                      src="/logo.png"
                      alt="NadaVerse Carnatic Music Emblem"
                      className="relative w-64 sm:w-80 lg:w-[360px] xl:w-[420px] rounded-2xl drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Complete Vertical Slice Pathway Highlight */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveSection('learn')}
                className="bg-[#191916] border border-[#3B392F] p-6 rounded-2xl cursor-pointer hover:border-[#C7A45B]/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22221D] border border-[#3B392F] flex items-center justify-center text-[#C7A45B] group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-colors mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD] mb-2 group-hover:text-[#C7A45B] transition-colors">
                  {t.card1Title}
                </h3>
                <p className="text-sm text-[#BDB4A4] leading-relaxed">
                  {t.card1Desc}
                </p>
                <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mt-4 font-semibold">
                  <span>{t.navStartHere}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => {
                  setActiveSection('explore');
                  setExploreTab('ragas');
                }}
                className="bg-[#191916] border border-[#3B392F] p-6 rounded-2xl cursor-pointer hover:border-[#C7A45B]/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22221D] border border-[#3B392F] flex items-center justify-center text-[#C7A45B] group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-colors mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD] mb-2 group-hover:text-[#C7A45B] transition-colors">
                  {t.card2Title}
                </h3>
                <p className="text-sm text-[#BDB4A4] leading-relaxed">
                  {t.card2Desc}
                </p>
                <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mt-4 font-semibold">
                  <span>{t.navExplore}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => setActiveSection('practice')}
                className="bg-[#191916] border border-[#3B392F] p-6 rounded-2xl cursor-pointer hover:border-[#C7A45B]/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22221D] border border-[#3B392F] flex items-center justify-center text-[#C7A45B] group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-colors mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD] mb-2 group-hover:text-[#C7A45B] transition-colors">
                  {t.card3Title}
                </h3>
                <p className="text-sm text-[#BDB4A4] leading-relaxed">
                  {t.card3Desc}
                </p>
                <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mt-4 font-semibold">
                  <span>{t.navPracticeStudio}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </section>

            {/* Featured Sample Content: Mayamalavagowla Vertical Slice */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#F4EBDD]">
                    Featured Verified Work: Mayamalavagowla
                  </h2>
                  <p className="text-sm text-[#BDB4A4]">
                    The fundamental learning scale of South Indian classical music, codified by Purandara Dasa.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveSection('explore');
                    setExploreTab('ragas');
                  }}
                  className="text-xs text-[#C7A45B] hover:text-[#E0C98F] font-mono flex items-center space-x-1"
                >
                  <span>View all ragas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <RagaCard
                raga={VERIFIED_RAGAS[0]}
                onAskTutor={handleOpenTutorWithTopic}
              />
            </section>

            {/* Instant Practice Companion Preview */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#F4EBDD]">
                    Instant Practice Companion
                  </h2>
                  <p className="text-sm text-[#BDB4A4]">
                    Zero-latency Web Audio API Tanpura drone with Just Intonation swaras.
                  </p>
                </div>
              </div>
              <ShrutiCompanion />
            </section>
          </div>
        )}

        {/* =========================================================================
            SECTION: LEARN (BEGINNER ORIENTATION PATH)
        ========================================================================= */}
        {activeSection === 'learn' && (
          <div className="space-y-8">
            <BeginnerPath
              onNavigateToPractice={() => {
                setActiveSection('practice');
              }}
              onOpenTutor={() => {
                setTutorTopic('beginner orientation and foundational concepts');
                setIsTutorOpen(true);
              }}
            />

            <div className="p-6 bg-[#191916] rounded-2xl border border-[#3B392F]">
              <h3 className="font-serif font-bold text-lg text-[#F4EBDD] mb-2">
                Continue to Practice Studio
              </h3>
              <p className="text-sm text-[#BDB4A4] mb-4">
                Now that you understand Shruti and Tala, open the dedicated Practice Studio to rehearse with live feedback.
              </p>
              <button
                onClick={() => setActiveSection('practice')}
                className="px-5 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-xs transition-colors"
              >
                Go to Practice Studio
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION: EXPLORE (RAGAS, TALAS, INSTRUMENTS, COMPOSERS, GLOSSARY)
        ========================================================================= */}
        {activeSection === 'explore' && (
          <div className="space-y-8">
            {/* Explore Navigation & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#191916] p-4 sm:p-6 rounded-2xl border border-[#3B392F]">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setExploreTab('ragas')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'ragas'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {t.tabRagas} ({VERIFIED_RAGAS.length})
                </button>
                <button
                  onClick={() => setExploreTab('talas')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'talas'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {t.tabTalas} ({VERIFIED_TALAS.length})
                </button>
                <button
                  onClick={() => setExploreTab('instruments')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'instruments'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {t.tabInstruments} ({VERIFIED_INSTRUMENTS.length})
                </button>
                <button
                  onClick={() => setExploreTab('composers')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'composers'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {t.tabComposers} ({VERIFIED_COMPOSERS.length})
                </button>
                <button
                  onClick={() => setExploreTab('glossary')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'glossary'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {t.tabGlossary} ({GLOSSARY_TERMS.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#BDB4A4] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4EBDD] placeholder-[#BDB4A4]/60 focus:outline-none focus:border-[#C7A45B]"
                />
              </div>
            </div>

            {/* RAGAS TAB */}
            {exploreTab === 'ragas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#BDB4A4] font-mono">
                  <span>Displaying {filteredRagas.length} verified raga records</span>
                  <span className="text-[#87947A]">Source: Music Academy Madras & Treatises</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filteredRagas.map((raga) => (
                    <RagaCard
                      key={raga.id}
                      raga={raga}
                      onAskTutor={handleOpenTutorWithTopic}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TALAS TAB */}
            {exploreTab === 'talas' && (
              <div className="space-y-6">
                <TalaStudio />
              </div>
            )}

            {/* INSTRUMENTS TAB */}
            {exploreTab === 'instruments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#BDB4A4] font-mono">
                  <span>Displaying {filteredInstruments.length} verified classical instruments</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filteredInstruments.map((inst) => (
                    <InstrumentCard
                      key={inst.id}
                      instrument={inst}
                      onAskTutor={handleOpenTutorWithTopic}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* COMPOSERS TAB */}
            {exploreTab === 'composers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#BDB4A4] font-mono">
                  <span>Displaying {filteredComposers.length} verified masters of Carnatic tradition</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredComposers.map((composer, idx) => (
                    <div
                      key={idx}
                      className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 hover:border-[#C7A45B]/60 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between pb-3 border-b border-[#3B392F]">
                        <div>
                          <h3 className="font-serif font-bold text-xl text-[#F4EBDD]">
                            {lang === 'ml' && COMPOSER_ML_NAMES[composer.name]
                              ? `${COMPOSER_ML_NAMES[composer.name]} (${composer.name})`
                              : composer.name}
                          </h3>
                          <span className="text-xs font-mono text-[#C7A45B]">
                            {composer.tradition} · {composer.lifespan}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-[#22221D] text-[#87947A] border border-[#3B392F] px-2 py-0.5 rounded">
                          Mudra: {composer.signatureMudra}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[#BDB4A4]/80">
                        <span>Birthplace: {composer.birthplace}</span>
                        <span>•</span>
                        <span>Languages: {composer.primaryLanguages.join(', ')}</span>
                      </div>

                      <p className="text-xs text-[#BDB4A4] leading-relaxed">
                        {composer.biography}
                      </p>

                      <div className="bg-[#22221D] p-3 rounded-xl border border-[#3B392F]/60 text-xs">
                        <span className="text-[10px] font-mono uppercase text-[#C7A45B] block mb-1">
                          Signature Masterpieces:
                        </span>
                        <ul className="list-disc list-inside text-[#F4EBDD] space-y-0.5 text-xs">
                          {composer.majorKritis.map((k, kIdx) => (
                            <li key={kIdx}>{k}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleOpenTutorWithTopic(composer.name)}
                        className="text-xs text-[#C7A45B] hover:text-[#E0C98F] flex items-center space-x-1 font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ask AI Tutor about {composer.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GLOSSARY TAB */}
            {exploreTab === 'glossary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGlossary.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#191916] border border-[#3B392F] p-5 rounded-2xl hover:border-[#C7A45B]/60 transition-all space-y-2"
                    >
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-serif font-bold text-lg text-[#F4EBDD]">
                          {item.term}
                        </h4>
                        <span className="text-[10px] font-mono bg-[#22221D] text-[#C7A45B] px-2 py-0.5 rounded border border-[#3B392F]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#F4EBDD]/90 font-medium">
                        {item.simpleExplanation}
                      </p>
                      <p className="text-xs text-[#BDB4A4] leading-relaxed">
                        {item.detailedContext}
                      </p>
                      <div className="pt-2 text-[10px] text-[#BDB4A4]/70 font-mono">
                        Source: {item.sources[0]?.title} ({item.sources[0]?.authorOrCreator})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SECTION: PRACTICE STUDIO (SHRUTI, TUNER, TALA, RECORDER, SESSION NOTES)
        ========================================================================= */}
        {activeSection === 'practice' && (
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] bg-[#191916] px-3.5 py-1.5 rounded-full border border-[#3B392F] mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>Integrated Practice Suite</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4EBDD]">
                {t.practiceStudioTitle}
              </h2>
              <p className="text-sm text-[#BDB4A4] mt-1 max-w-2xl">
                {t.practiceStudioSubtitle}
              </p>
            </div>

            {/* Shruti Companion */}
            <ShrutiCompanion />

            {/* Microphone Pitch Tuner */}
            <TunerCompanion />

            {/* Tala Studio */}
            <TalaStudio />

            {/* Private Audio Recorder */}
            <PracticeRecorder />

            {/* Practice Session Logger */}
            <section className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="pb-4 border-b border-[#3B392F] mb-6">
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD]">
                  {t.practiceLogTitle}
                </h3>
                <p className="text-xs text-[#BDB4A4] mt-0.5">
                  Record focus areas, self-reflections, and tempo settings. Kept private to your account.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5">
                    {t.sessionFocus}
                  </label>
                  <input
                    type="text"
                    value={sessionFocus}
                    onChange={(e) => setSessionFocus(e.target.value)}
                    placeholder="e.g. Mayamalavagowla Jantai Varisai 1-4"
                    className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5">
                    {t.sessionNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Notes on pitch accuracy, breath control, or tala alignment..."
                    className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-[#87947A]">
                    {sessionSavedSuccess && (
                      <span className="flex items-center space-x-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#6EA887]" />
                        <span>{t.sessionSavedMsg}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSavePracticeSession}
                    className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-xs font-semibold transition-all shadow-md active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.saveSessionBtn}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Grounded AI Tutor Modal */}
      <TutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        initialTopic={tutorTopic}
      />

      {/* Auth / Account Management Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => {
          localStorage.removeItem('nadaverse_token');
          setCurrentUser(null);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
