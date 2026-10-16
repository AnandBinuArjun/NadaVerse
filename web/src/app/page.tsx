'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShrutiCompanion } from '../components/ShrutiCompanion';
import { TalaStudio } from '../components/TalaStudio';
import { RagaCard } from '../components/RagaCard';
import { InstrumentCard } from '../components/InstrumentCard';
import { BeginnerPath } from '../components/BeginnerPath';
import { TutorModal } from '../components/TutorModal';
import { VERIFIED_RAGAS, VERIFIED_INSTRUMENTS, VERIFIED_TALAS, GLOSSARY_TERMS } from '../data/carnaticData';
import {
  Compass,
  Sliders,
  BookOpen,
  Music2,
  ChevronRight,
  Search
} from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState<'home' | 'learn' | 'explore' | 'practice'>('home');
  const [exploreTab, setExploreTab] = useState<'ragas' | 'talas' | 'instruments' | 'glossary'>('ragas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorTopic, setTutorTopic] = useState<string | undefined>(undefined);

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

  const filteredRagas = VERIFIED_RAGAS.filter(
    (r) =>
      r.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.alternateNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.chakra?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInstruments = VERIFIED_INSTRUMENTS.filter(
    (i) =>
      i.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.family.toLowerCase().includes(searchQuery.toLowerCase())
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
            <section className="relative overflow-hidden rounded-3xl bg-[#191916] border border-[#3B392F] p-8 sm:p-12 lg:p-16">
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] bg-[#22221D] px-3.5 py-1.5 rounded-full border border-[#3B392F]">
                  <Music2 className="w-3.5 h-3.5" />
                  <span>The Sovereign Digital Sanctuary of Carnatic Music</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F4EBDD] leading-[1.15] tracking-tight">
                  Discover Carnatic music. <br />
                  <span className="text-[#C7A45B]">Understand its language.</span> <br />
                  Practise with purpose.
                </h1>

                <p className="text-base sm:text-lg text-[#BDB4A4] leading-relaxed max-w-2xl font-light">
                  A peer-reviewed, completely free learning and practice platform. Connect foundational beginner orientation, verifiable raga and tala musicology, precision Web Audio practice companions, and grounded AI guidance.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
                  <button
                    onClick={() => setActiveSection('learn')}
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-sm transition-all shadow-md active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Start Here: New to Carnatic?</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('practice')}
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#22221D] hover:bg-[#2A2A24] border border-[#3B392F] hover:border-[#C7A45B] text-[#F4EBDD] font-medium text-sm transition-all"
                  >
                    <Sliders className="w-4 h-4 text-[#C7A45B]" />
                    <span>Open Practice Studio</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('explore')}
                    className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-transparent hover:bg-[#191916] text-[#BDB4A4] hover:text-[#F4EBDD] text-sm transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Ragas & Instruments</span>
                  </button>
                </div>
              </div>

              {/* Subtle background acoustic motif */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none opacity-5 hidden lg:flex items-center justify-center font-serif text-[380px] text-[#C7A45B] select-none">
                ॐ
              </div>
            </section>

            {/* Complete Vertical Slice Pathway Highlight */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Discover */}
              <div
                onClick={() => setActiveSection('learn')}
                className="bg-[#191916] border border-[#3B392F] p-6 rounded-2xl cursor-pointer hover:border-[#C7A45B]/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22221D] border border-[#3B392F] flex items-center justify-center text-[#C7A45B] group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-colors mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD] mb-2 group-hover:text-[#C7A45B] transition-colors">
                  1. Structured Orientation
                </h3>
                <p className="text-sm text-[#BDB4A4] leading-relaxed">
                  Understand Adhara Shadjam (the eternal drone), the seven Sapta Swaras, and how Adi Tala measures time.
                </p>
                <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mt-4 font-semibold">
                  <span>Begin 3-part orientation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Step 2: Explore */}
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
                  2. Verified Raga & Tala Knowledge
                </h3>
                <p className="text-sm text-[#BDB4A4] leading-relaxed">
                  Audition Mayamalavagowla, Shankarabharanam, and Saraswati Veena with verified sources from Subbarama Dikshitar and Sambamoorthy.
                </p>
                <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mt-4 font-semibold">
                  <span>Explore Verified Corpus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Step 3: Practise */}
              <div
                onClick={() => setActiveSection('practice')}
                className="bg-[#191916] border border-[#3B392F] p-6 rounded-2xl cursor-pointer hover:border-[#C7A45B]/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22221D] border border-[#3B392F] flex items-center justify-center text-[#C7A45B] group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-colors mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD] mb-2 group-hover:text-[#C7A45B] transition-colors">
                  3. Precision Practice Studio
                </h3>
                <p className="text-sm text-[#BDB4A4] leading-relaxed">
                  Tune with the Web Audio Tanpura harmonic drone, audition Just Intonation swara intervals, and lock your laya with the Tala metronome.
                </p>
                <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#C7A45B] mt-4 font-semibold">
                  <span>Launch Practice Studio</span>
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

            {/* Quick Practice Studio Preview */}
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

            {/* Practical Connection to Practice Tools */}
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
            SECTION: EXPLORE (RAGAS, TALAS, INSTRUMENTS, GLOSSARY)
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
                  Ragas ({VERIFIED_RAGAS.length})
                </button>
                <button
                  onClick={() => setExploreTab('talas')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'talas'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  Talas ({VERIFIED_TALAS.length})
                </button>
                <button
                  onClick={() => setExploreTab('instruments')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'instruments'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  Instruments ({VERIFIED_INSTRUMENTS.length})
                </button>
                <button
                  onClick={() => setExploreTab('glossary')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    exploreTab === 'glossary'
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  Glossary ({GLOSSARY_TERMS.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#BDB4A4] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, swara, jati..."
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
                  {filteredRagas.length === 0 && (
                    <div className="bg-[#191916] p-12 text-center rounded-2xl border border-[#3B392F] text-[#BDB4A4]">
                      No matching ragas found for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}
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
            SECTION: PRACTICE STUDIO (SHRUTI COMPANION + TALA STUDIO)
        ========================================================================= */}
        {activeSection === 'practice' && (
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] bg-[#191916] px-3.5 py-1.5 rounded-full border border-[#3B392F] mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>Integrated Practice Suite</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4EBDD]">
                Musician&apos;s Practice Studio
              </h2>
              <p className="text-sm text-[#BDB4A4] mt-1 max-w-2xl">
                Dual Web Audio tools running synchronously in your browser. Maintain your tonic drone while tracking tala cycles with precise hand kriyas.
              </p>
            </div>

            {/* Shruti Companion */}
            <ShrutiCompanion />

            {/* Tala Studio */}
            <TalaStudio />
          </div>
        )}
      </main>

      {/* Grounded AI Tutor Modal */}
      <TutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        initialTopic={tutorTopic}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
