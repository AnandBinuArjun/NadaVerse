'use client';

import React, { useState, useEffect } from 'react';
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
import { PrivacyModal } from '../components/PrivacyModal';
import { AttributionModal } from '../components/AttributionModal';
import { OnboardingModal, MusicianProfile } from '../components/OnboardingModal';
import { SwarasthanaVisualizer } from '../components/SwarasthanaVisualizer';
import { SadhanaTracker } from '../components/SadhanaTracker';
import { SuggestCorrectionModal } from '../components/SuggestCorrectionModal';
import { GradedExercises } from '../components/GradedExercises';
import { LearningCurriculum } from '../components/LearningCurriculum';
import { ExplainablePracticeCompanion } from '../components/ExplainablePracticeCompanion';
import { TeacherStudentWorkspace } from '../components/TeacherStudentWorkspace';
import { HeritageArchive } from '../components/HeritageArchive';
import { VERIFIED_RAGAS, VERIFIED_INSTRUMENTS, VERIFIED_TALAS, GLOSSARY_TERMS, VERIFIED_COMPOSERS } from '../data/carnaticData';
import { API_BASE_URL } from '../lib/api';
import { TONIC_OPTIONS, TonicNote, audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES, COMPOSER_ML_NAMES } from '../lib/translations';
import { GLOSSARY_ML_DATA, COMPOSER_ML_DATA } from '../data/malayalamTranslations';
import {
  Compass,
  Sliders,
  BookOpen,
  Music2,
  ChevronRight,
  Search,
  Save,
  CheckCircle2,
  Sparkles,
  Keyboard,
  Edit3,
  Bookmark,
  Filter
} from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'home' | 'learn' | 'explore' | 'practice' | 'teaching' | 'heritage'>('home');
  const [exploreTab, setExploreTab] = useState<'ragas' | 'talas' | 'instruments' | 'composers' | 'glossary'>('ragas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorTopic, setTutorTopic] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAttributionOpen, setIsAttributionOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSuggestCorrectionOpen, setIsSuggestCorrectionOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<{ name: string; type: 'raga' | 'composer' | 'tala' }>({
    name: 'Mayamalavagowla',
    type: 'raga'
  });
  const [activeTonic, setActiveTonic] = useState<TonicNote>(TONIC_OPTIONS[0]);
  const [currentUser, setCurrentUser] = useState<{ email: string; displayName: string } | null>(null);

  // Practice Session State
  const [sessionFocus, setSessionFocus] = useState('Mayamalavagowla Sarali Varisai 1-4');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(20);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionSavedStatus, setSessionSavedStatus] = useState<'idle' | 'saved_server' | 'saved_local'>('idle');

  // Raga Explorer Filters & Bookmarks
  const [ragaFilterMode, setRagaFilterMode] = useState<'all' | 'melakarta' | 'janya' | 'bookmarks' | 'M1' | 'M2'>('all');
  const [bookmarkedRagaSlugs, setBookmarkedRagaSlugs] = useState<string[]>([]);

  // Instrument Explorer Filters & Bookmarks
  const [instrumentFilterFamily, setInstrumentFilterFamily] = useState<'all' | 'Chordophone' | 'Aerophone' | 'Membranophone' | 'Idiophone' | 'bookmarks'>('all');
  const [bookmarkedInstrumentSlugs, setBookmarkedInstrumentSlugs] = useState<string[]>([]);

  // Initialize Onboarding and natural Adhara Sa from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('nadaverse_onboarding_completed');
      if (!completed) {
        setIsOnboardingOpen(true);
      }
      const storedProfile = localStorage.getItem('nadaverse_musician_profile');
      if (storedProfile) {
        try {
          const profile: MusicianProfile = JSON.parse(storedProfile);
          const found = TONIC_OPTIONS.find((t) => t.name.startsWith(profile.tonic));
          if (found) {
            setActiveTonic(found);
            audioEngine.setTonic(found.frequency);
          }
        } catch {}
      }
    }
  }, []);

  const handleOpenTutorWithTopic = (topic: string) => {
    setTutorTopic(topic);
    setIsTutorOpen(true);
  };

  const handleOpenSuggestCorrection = (name: string, type: 'raga' | 'composer' | 'tala' = 'raga') => {
    setCorrectionTarget({ name, type });
    setIsSuggestCorrectionOpen(true);
  };

  const handleNavigate = (section: string) => {
    if (section === 'home' || section === 'learn' || section === 'explore' || section === 'practice') {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSavePracticeSession = async () => {
    const durationMins = Math.max(1, sessionDurationMinutes || 15);
    const payload = {
      focus: sessionFocus || 'Mayamalavagowla Sarali Varisai',
      tonic: activeTonic.name,
      tala_id: 'adi-tala',
      notes: sessionNotes,
      duration_seconds: durationMins * 60
    };

    // Save to local storage for SadhanaTracker instant reactivity
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('nadaverse_sadhana_sessions') || '[]');
        const newRecord = {
          id: `s-${Date.now()}`,
          date: new Date().toISOString(),
          focus: sessionFocus || 'Mayamalavagowla Sarali Varisai',
          kattai: `${activeTonic.name} (${activeTonic.kattai})`,
          tala: 'Adi Tala (8 aksharas)',
          durationMinutes: durationMins,
          notes: sessionNotes
        };
        stored.unshift(newRecord);
        localStorage.setItem('nadaverse_sadhana_sessions', JSON.stringify(stored));
        window.dispatchEvent(new Event('nadaverse:sadhana_updated'));
      } catch {}
    }

    let synced = false;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/v1/practice/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          synced = true;
        }
      }
    } catch {
      // Offline fallback
    }

    setSessionSavedStatus(synced ? 'saved_server' : 'saved_local');
    setTimeout(() => setSessionSavedStatus('idle'), 4000);
  };

  // Sync bookmarks from localStorage & listen for updates
  // Sync raga & instrument bookmarks from localStorage & listen for updates
  useEffect(() => {
    const loadBookmarks = () => {
      if (typeof window !== 'undefined') {
        try {
          const storedRagas = localStorage.getItem('nadaverse_bookmarked_ragas');
          if (storedRagas) setBookmarkedRagaSlugs(JSON.parse(storedRagas));

          const storedInst = localStorage.getItem('nadaverse_bookmarked_instruments');
          if (storedInst) setBookmarkedInstrumentSlugs(JSON.parse(storedInst));
        } catch {}
      }
    };
    loadBookmarks();
    window.addEventListener('nadaverse:bookmarks_updated', loadBookmarks);
    window.addEventListener('nadaverse:instrument_bookmarks_updated', loadBookmarks);
    return () => {
      window.removeEventListener('nadaverse:bookmarks_updated', loadBookmarks);
      window.removeEventListener('nadaverse:instrument_bookmarks_updated', loadBookmarks);
    };
  }, []);

  const filteredRagas = VERIFIED_RAGAS.filter((r) => {
    const matchesSearch =
      r.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.alternateNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (RAGA_ML_NAMES[r.slug] && RAGA_ML_NAMES[r.slug].includes(searchQuery)) ||
      r.chakra?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (ragaFilterMode === 'melakarta') return r.isMelakarta === true;
    if (ragaFilterMode === 'janya') return r.isMelakarta === false;
    if (ragaFilterMode === 'bookmarks') return bookmarkedRagaSlugs.includes(r.slug);
    if (ragaFilterMode === 'M1') return r.arohanam.includes('M₁') || r.arohanam.includes('M1');
    if (ragaFilterMode === 'M2') return r.arohanam.includes('M₂') || r.arohanam.includes('M2');

    return true;
  });

  const filteredInstruments = VERIFIED_INSTRUMENTS.filter((i) => {
    const matchesSearch =
      i.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.roleInConcert.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (instrumentFilterFamily === 'bookmarks') return bookmarkedInstrumentSlugs.includes(i.slug);
    if (instrumentFilterFamily !== 'all') return i.family === instrumentFilterFamily;

    return true;
  });

  const filteredComposers = VERIFIED_COMPOSERS.filter((c) => {
    const ml = COMPOSER_ML_DATA[c.name];
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (COMPOSER_ML_NAMES[c.name] && COMPOSER_ML_NAMES[c.name].includes(searchQuery)) ||
      c.tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.signatureMudra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryLanguages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ml && (
        ml.biographyMl.includes(searchQuery) ||
        ml.traditionMl.includes(searchQuery) ||
        ml.birthplaceMl.includes(searchQuery)
      ))
    );
  });

  const filteredGlossary = GLOSSARY_TERMS.filter((g) => {
    const ml = GLOSSARY_ML_DATA[g.term];
    return (
      g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ml && (
        ml.termMl.includes(searchQuery) ||
        ml.categoryMl.includes(searchQuery) ||
        ml.simpleExplanationMl.includes(searchQuery)
      ))
    );
  });

  return (
    <div className="min-h-screen bg-[#0d0c0a] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(199,164,91,0.15),rgba(255,255,255,0))] text-[#F4EBDD] flex flex-col font-sans selection:bg-[#C7A45B]/30 selection:text-[#F4EBDD]">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* =========================================================================
            SECTION: HOME / HERO OVERVIEW
        ========================================================================= */}
        {activeSection === 'home' && (
          <div className="space-y-10 sm:space-y-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#181612]/95 via-[#13120e]/95 to-[#0f0e0b]/98 border border-[#C7A45B]/30 p-4 sm:p-8 lg:p-10 xl:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(199,164,91,0.1)] backdrop-blur-2xl">
              {/* Decorative Background Lighting */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none ambient-aura" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-center">
                <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-5 min-w-0">
                  {/* Badge with Live Soundwave Indicator */}
                  <div className="inline-flex items-center space-x-2.5 text-xs font-mono uppercase tracking-wider text-[#E8D7A8] bg-[#222019]/90 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#C7A45B]/40 shadow-[0_0_15px_rgba(199,164,91,0.15)] max-w-full overflow-hidden">
                    <Music2 className="w-4 h-4 text-[#C7A45B] shrink-0" />
                    <span className="font-semibold truncate">{t.heroBadge}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/35 text-[10px] font-bold tracking-widest shrink-0">
                      PUBLIC BETA
                    </span>
                    <div className="hidden sm:flex items-center space-x-1 h-3.5 pl-1.5 border-l border-[#C7A45B]/40 shrink-0">
                      <span className="soundwave-bar" />
                      <span className="soundwave-bar" />
                      <span className="soundwave-bar" />
                      <span className="soundwave-bar" />
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-serif font-bold text-[#F4EBDD] leading-[1.28] tracking-tight">
                    <span className="block">{t.heroTitle1}</span>
                    <span className="block nv-gold-gradient-text drop-shadow-[0_2px_12px_rgba(199,164,91,0.3)]">{t.heroTitle2}</span>
                    <span className="block">{t.heroTitle3}</span>
                  </h1>

                  <p className="text-xs sm:text-base text-[#BDB4A4] leading-relaxed font-light max-w-xl">
                    {t.heroDescription}
                  </p>

                  {/* Primary Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
                    <button
                      onClick={() => setActiveSection('learn')}
                      className="flex items-center justify-center space-x-2 px-5 sm:px-6 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#DFB960] to-[#C7A45B] hover:brightness-110 text-[#11110F] font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-lg shadow-[#C7A45B]/25 w-full sm:w-auto min-h-[44px]"
                    >
                      <BookOpen className="w-4 h-4 text-[#11110F] shrink-0" />
                      <span>{t.heroStartBtn}</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('practice')}
                      className="flex items-center justify-center space-x-2 px-5 sm:px-6 py-3.5 sm:py-3 rounded-xl bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/40 hover:border-[#C7A45B] hover:shadow-[0_0_20px_rgba(199,164,91,0.25)] text-[#F4EBDD] font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap shadow-sm w-full sm:w-auto min-h-[44px]"
                    >
                      <Sliders className="w-4 h-4 text-[#C7A45B] shrink-0" />
                      <span>{t.heroPracticeBtn}</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('explore')}
                      className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-3.5 sm:py-3 rounded-xl bg-[#14120e] hover:bg-[#1e1c17] border border-[#C7A45B]/25 hover:border-[#C7A45B]/50 text-[#BDB4A4] hover:text-[#F4EBDD] text-xs sm:text-sm transition-all duration-200 whitespace-nowrap shadow-sm w-full sm:w-auto min-h-[44px]"
                    >
                      <Compass className="w-4 h-4 text-[#C7A45B]/80 shrink-0" />
                      <span>{t.heroExploreBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Hero Logo Emblem with Radiant Aura */}
                <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center min-w-0 pt-2 lg:pt-0">
                  <div className="relative group w-full max-w-[220px] sm:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px]">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#C7A45B]/30 via-[#E8D7A8]/20 to-[#C7A45B]/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-[#C7A45B]/30 to-[#191916]/80 border border-[#C7A45B]/40 shadow-2xl backdrop-blur-sm">
                      <img
                        src="/logo.png"
                        alt="NadaVerse Carnatic Music Emblem"
                        className="w-full h-auto rounded-xl sm:rounded-2xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Complete Vertical Slice Pathway Highlight Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div
                onClick={() => setActiveSection('learn')}
                className="nv-glass-card p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A45B]/5 rounded-bl-full group-hover:bg-[#C7A45B]/15 transition-all duration-500" />
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C7A45B]/25 to-[#C7A45B]/5 border border-[#C7A45B]/30 flex items-center justify-center text-[#E0C98F] group-hover:scale-110 group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-all duration-300 mb-4 sm:mb-5 shadow-lg shadow-black/40">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] mb-2 sm:mb-2.5 group-hover:text-[#E0C98F] transition-colors">
                  {t.card1Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
                  {t.card1Desc}
                </p>
                <span className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#C7A45B] mt-4 sm:mt-5 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  <span>{t.navStartHere}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <div
                onClick={() => {
                  setActiveSection('explore');
                  setExploreTab('ragas');
                }}
                className="nv-glass-card p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A45B]/5 rounded-bl-full group-hover:bg-[#C7A45B]/15 transition-all duration-500" />
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C7A45B]/25 to-[#C7A45B]/5 border border-[#C7A45B]/30 flex items-center justify-center text-[#E0C98F] group-hover:scale-110 group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-all duration-300 mb-4 sm:mb-5 shadow-lg shadow-black/40">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] mb-2 sm:mb-2.5 group-hover:text-[#E0C98F] transition-colors">
                  {t.card2Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
                  {t.card2Desc}
                </p>
                <span className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#C7A45B] mt-4 sm:mt-5 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  <span>{t.navExplore}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <div
                onClick={() => setActiveSection('practice')}
                className="nv-glass-card p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A45B]/5 rounded-bl-full group-hover:bg-[#C7A45B]/15 transition-all duration-500" />
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C7A45B]/25 to-[#C7A45B]/5 border border-[#C7A45B]/30 flex items-center justify-center text-[#E0C98F] group-hover:scale-110 group-hover:bg-[#C7A45B] group-hover:text-[#11110F] transition-all duration-300 mb-4 sm:mb-5 shadow-lg shadow-black/40">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] mb-2 sm:mb-2.5 group-hover:text-[#E0C98F] transition-colors">
                  {t.card3Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
                  {t.card3Desc}
                </p>
                <span className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#C7A45B] mt-4 sm:mt-5 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  <span>{t.navPracticeStudio}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </section>

            {/* Featured Sample Content: Mayamalavagowla Vertical Slice */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#C7A45B]/20">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'ശാസ്ത്രീയ മാതൃക' : 'Canonical Benchmark'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
                    {lang === 'ml' ? 'പ്രത്യേക ശാസ്ത്രീയ രാഗം: മായാമാളവഗൗള' : 'Featured Verified Work: Mayamalavagowla'}
                  </h2>
                  <p className="text-sm text-[#BDB4A4] mt-1">
                    {lang === 'ml'
                      ? 'പുരന്ദര ദാസർ ചിട്ടപ്പെടുത്തിയ കർണ്ണാടക സംഗീതത്തിന്റെ പ്രാഥമിക അഭ്യസന രാഗം.'
                      : 'The fundamental learning scale of South Indian classical music, codified by Purandara Dasa.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveSection('explore');
                    setExploreTab('ragas');
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/30 hover:border-[#C7A45B] text-xs text-[#E0C98F] font-mono transition-all self-start sm:self-auto shadow-sm"
                >
                  <span>{lang === 'ml' ? 'എല്ലാ രാഗങ്ങളും കാണുക' : 'View all ragas'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C7A45B]" />
                </button>
              </div>

              <RagaCard
                raga={VERIFIED_RAGAS[0]}
                onAskTutor={handleOpenTutorWithTopic}
                onSuggestCorrection={(name) => handleOpenSuggestCorrection(name, 'raga')}
              />
            </section>

            {/* Instant Practice Companion Preview */}
            <section className="space-y-6">
              <div className="pb-2 border-b border-[#C7A45B]/20">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] mb-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'ശ്രുതി പരിശീലനം' : 'Shruti Practice'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
                  {lang === 'ml' ? 'തത്സമയ സാധക സഹായി' : 'Instant Practice Companion'}
                </h2>
                <p className="text-sm text-[#BDB4A4] mt-1">
                  {lang === 'ml'
                    ? 'ജസ്റ്റ് ഇൻ്റോണേഷൻ സ്വരങ്ങളോടുകൂടിയ വെബ് ഓഡിയോ തംബുരു ശ്രുതി.'
                    : 'Zero-latency Web Audio API Tanpura drone with Just Intonation swaras.'}
                </p>
              </div>
              <ShrutiCompanion />
            </section>
          </div>
        )}

        {/* =========================================================================
            SECTION: LEARN (BEGINNER ORIENTATION PATH & STRUCTURED CURRICULUM)
        ========================================================================= */}
        {activeSection === 'learn' && (
          <div className="space-y-8">
            {/* Structured Multi-Pathway Curriculum */}
            <LearningCurriculum />

            <BeginnerPath
              onNavigateToPractice={() => {
                setActiveSection('practice');
              }}
              onOpenTutor={() => {
                setTutorTopic('beginner orientation and foundational concepts');
                setIsTutorOpen(true);
              }}
            />

            {/* Interactive Swarasthana Visualizer for Learning */}
            <SwarasthanaVisualizer />

            <div className="p-6 bg-[#191916] rounded-2xl border border-[#3B392F]">
              <h3 className="font-serif font-bold text-lg text-[#F4EBDD] mb-2">
                {lang === 'ml' ? 'സാധക കളരിയിലേക്ക് തുടരുക' : 'Continue to Practice Studio'}
              </h3>
              <p className="text-sm text-[#BDB4A4] mb-4">
                {lang === 'ml'
                  ? 'ശ്രുതിയും താളവും മനസ്സിലാക്കിക്കഴിഞ്ഞാൽ, തത്സമയ സാധകത്തിനായി കളരി തുറന്ന് പരിശീലിക്കാം.'
                  : 'Now that you understand Shruti and Tala, open the dedicated Practice Studio to rehearse with live feedback.'}
              </p>
              <button
                onClick={() => setActiveSection('practice')}
                className="px-5 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-semibold text-xs transition-colors"
              >
                {lang === 'ml' ? 'സാധക കളരി തുറക്കുക' : 'Go to Practice Studio'}
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 nv-glass-panel p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#C7A45B]/25 shadow-xl">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => setExploreTab('ragas')}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all ${
                    exploreTab === 'ragas'
                      ? 'nv-gold-btn font-bold shadow-md shadow-[#C7A45B]/20'
                      : 'bg-[#0d0c0a]/60 hover:bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#C7A45B]/15 hover:border-[#C7A45B]/30'
                  }`}
                >
                  {t.tabRagas} ({VERIFIED_RAGAS.length})
                </button>
                <button
                  onClick={() => setExploreTab('talas')}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all ${
                    exploreTab === 'talas'
                      ? 'nv-gold-btn font-bold shadow-md shadow-[#C7A45B]/20'
                      : 'bg-[#0d0c0a]/60 hover:bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#C7A45B]/15 hover:border-[#C7A45B]/30'
                  }`}
                >
                  {t.tabTalas} ({VERIFIED_TALAS.length})
                </button>
                <button
                  onClick={() => setExploreTab('instruments')}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all ${
                    exploreTab === 'instruments'
                      ? 'nv-gold-btn font-bold shadow-md shadow-[#C7A45B]/20'
                      : 'bg-[#0d0c0a]/60 hover:bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#C7A45B]/15 hover:border-[#C7A45B]/30'
                  }`}
                >
                  {t.tabInstruments} ({VERIFIED_INSTRUMENTS.length})
                </button>
                <button
                  onClick={() => setExploreTab('composers')}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all ${
                    exploreTab === 'composers'
                      ? 'nv-gold-btn font-bold shadow-md shadow-[#C7A45B]/20'
                      : 'bg-[#0d0c0a]/60 hover:bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#C7A45B]/15 hover:border-[#C7A45B]/30'
                  }`}
                >
                  {t.tabComposers} ({VERIFIED_COMPOSERS.length})
                </button>
                <button
                  onClick={() => setExploreTab('glossary')}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all ${
                    exploreTab === 'glossary'
                      ? 'nv-gold-btn font-bold shadow-md shadow-[#C7A45B]/20'
                      : 'bg-[#0d0c0a]/60 hover:bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#C7A45B]/15 hover:border-[#C7A45B]/30'
                  }`}
                >
                  {t.tabGlossary} ({GLOSSARY_TERMS.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#C7A45B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-[#0d0c0a]/80 border border-[#C7A45B]/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4EBDD] placeholder-[#BDB4A4]/50 focus:outline-none focus:border-[#C7A45B] focus:ring-1 focus:ring-[#C7A45B]/40 transition-all shadow-inner min-h-[40px]"
                />
              </div>
            </div>

            {/* RAGAS TAB */}
            {exploreTab === 'ragas' && (
              <div className="space-y-6">
                {/* Raga Category & Bookmark Filters */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#14130f] rounded-2xl border border-[#C7A45B]/20">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-[#C7A45B] px-2 py-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'ഫിൽട്ടറുകൾ:' : 'Filter:'}</span>
                  </div>
                  {[
                    { id: 'all', labelEn: 'All Ragas', labelMl: 'എല്ലാം' },
                    { id: 'melakarta', labelEn: '72 Melakartas', labelMl: '72 മേളകർത്താക്കൾ' },
                    { id: 'janya', labelEn: 'Janya Ragas', labelMl: 'ജന്യ രാഗങ്ങൾ' },
                    { id: 'bookmarks', labelEn: `Bookmarks (${bookmarkedRagaSlugs.length})`, labelMl: `ബുക്ക്‌മാർക്കുകൾ (${bookmarkedRagaSlugs.length})` },
                    { id: 'M1', labelEn: 'Shuddha Ma (1-36)', labelMl: 'ശുദ്ധ മധ്യമം (1-36)' },
                    { id: 'M2', labelEn: 'Prati Ma (37-72)', labelMl: 'പ്രതി മധ്യമം (37-72)' }
                  ].map((filter) => {
                    const isActive = ragaFilterMode === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setRagaFilterMode(filter.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-sm'
                            : 'bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F] hover:border-[#C7A45B]/40'
                        }`}
                      >
                        {filter.id === 'bookmarks' && <Bookmark className="w-3 h-3" />}
                        <span>{lang === 'ml' ? filter.labelMl : filter.labelEn}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#BDB4A4] font-mono gap-1">
                  <span>
                    {lang === 'ml'
                      ? `${filteredRagas.length} ആധികാരിക രാഗ രേഖകൾ ലഭ്യമാണ്`
                      : `Displaying ${filteredRagas.length} verified raga records`}
                  </span>
                  <span className="text-[#87947A]">
                    {lang === 'ml'
                      ? 'അവലംബം: മ്യൂസിക് അക്കാദമി മദ്രാസ് & ഗ്രന്ഥങ്ങൾ'
                      : 'Source: Music Academy Madras & Treatises'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filteredRagas.map((raga) => (
                    <RagaCard
                      key={raga.id}
                      raga={raga}
                      onAskTutor={handleOpenTutorWithTopic}
                      onSuggestCorrection={(name) => handleOpenSuggestCorrection(name, 'raga')}
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
                {/* Instrument Family & Bookmark Filters */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#14130f] rounded-2xl border border-[#C7A45B]/20">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-[#C7A45B] px-2 py-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'വാദ്യ വർഗ്ഗങ്ങൾ:' : 'Family:'}</span>
                  </div>
                  {[
                    { id: 'all', labelEn: 'All Instruments', labelMl: 'എല്ലാ വാദ്യങ്ങളും' },
                    { id: 'Chordophone', labelEn: 'Tata (Strings)', labelMl: 'തത വാദ്യങ്ങൾ (തന്ത്രി)' },
                    { id: 'Aerophone', labelEn: 'Sushira (Winds)', labelMl: 'സുഷിര വാദ്യങ്ങൾ (സുഷിരം)' },
                    { id: 'Membranophone', labelEn: 'Avanaddha (Drums)', labelMl: 'അവനദ്ധ വാദ്യങ്ങൾ (തോൽ)' },
                    { id: 'Idiophone', labelEn: 'Ghana (Percussion)', labelMl: 'ഘന വാദ്യങ്ങൾ (ലോഹം/മണ്ണ്)' },
                    { id: 'bookmarks', labelEn: `Bookmarks (${bookmarkedInstrumentSlugs.length})`, labelMl: `ബുക്ക്‌മാർക്കുകൾ (${bookmarkedInstrumentSlugs.length})` }
                  ].map((filter) => {
                    const isActive = instrumentFilterFamily === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setInstrumentFilterFamily(filter.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-sm'
                            : 'bg-[#1e1c17] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F] hover:border-[#C7A45B]/40'
                        }`}
                      >
                        {filter.id === 'bookmarks' && <Bookmark className="w-3 h-3" />}
                        <span>{lang === 'ml' ? filter.labelMl : filter.labelEn}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-[#BDB4A4] font-mono">
                  <span>
                    {lang === 'ml'
                      ? `${filteredInstruments.length} ശാസ്ത്രീയ സംഗീത വാദ്യങ്ങൾ ലഭ്യമാണ്`
                      : `Displaying ${filteredInstruments.length} verified classical instruments`}
                  </span>
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
                  <span>
                    {lang === 'ml'
                      ? `${filteredComposers.length} മഹാരഥന്മാരായ വാഗ്ഗേയകാരന്മാർ`
                      : `Displaying ${filteredComposers.length} verified masters of Carnatic tradition`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {filteredComposers.map((composer, idx) => {
                    const ml = COMPOSER_ML_DATA[composer.name];
                    return (
                      <div
                        key={idx}
                        className="nv-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 hover:border-[#C7A45B]/60 transition-all duration-300 space-y-3.5 sm:space-y-4 group relative overflow-hidden shadow-xl"
                      >
                        <div className="absolute top-0 right-0 w-36 h-36 bg-[#C7A45B]/5 rounded-bl-full pointer-events-none group-hover:bg-[#C7A45B]/10 transition-colors" />

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3.5 sm:pb-4 border-b border-[#C7A45B]/20 gap-2 relative z-10">
                          <div>
                            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#F4EBDD] group-hover:text-[#E0C98F] transition-colors">
                              {lang === 'ml' && COMPOSER_ML_NAMES[composer.name]
                                ? `${COMPOSER_ML_NAMES[composer.name]} (${composer.name})`
                                : composer.name}
                            </h3>
                            <span className="text-xs font-mono text-[#C7A45B] block mt-0.5">
                              {lang === 'ml' && ml ? ml.traditionMl : composer.tradition} · {composer.lifespan}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-mono bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30 px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-auto">
                            {lang === 'ml' ? 'മുദ്ര: ' : 'Mudra: '}
                            {lang === 'ml' && ml ? ml.mudraMl : composer.signatureMudra}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs font-mono text-[#BDB4A4]/90 relative z-10">
                          <span>
                            {lang === 'ml' ? 'ജന്മസ്ഥലം: ' : 'Birthplace: '}
                            <strong className="text-[#F4EBDD]">{lang === 'ml' && ml ? ml.birthplaceMl : composer.birthplace}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            {lang === 'ml' ? 'ഭാഷകൾ: ' : 'Languages: '}
                            <strong className="text-[#F4EBDD]">{lang === 'ml' && ml ? ml.languagesMl.join(', ') : composer.primaryLanguages.join(', ')}</strong>
                          </span>
                        </div>

                        <p className="text-xs text-[#BDB4A4] leading-relaxed relative z-10">
                          {lang === 'ml' && ml ? ml.biographyMl : composer.biography}
                        </p>

                        <div className="bg-[#0d0c0a]/80 backdrop-blur-md p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#C7A45B]/20 text-xs relative z-10">
                          <span className="text-[11px] font-mono uppercase text-[#C7A45B] block mb-1.5 font-semibold">
                            {lang === 'ml' ? 'പ്രധാന അനശ്വര കൃതികൾ:' : 'Signature Masterpieces:'}
                          </span>
                          <ul className="list-disc list-inside text-[#F4EBDD] space-y-1 text-xs font-medium">
                            {composer.majorKritis.map((k, kIdx) => (
                              <li key={kIdx}>{k}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#3B392F]/50 relative z-10">
                          <button
                            onClick={() => handleOpenTutorWithTopic(composer.name)}
                            className="text-xs text-[#C7A45B] hover:text-[#E0C98F] flex items-center space-x-1.5 font-medium py-1"
                          >
                            <Sparkles className="w-4 h-4 text-[#C7A45B] shrink-0" />
                            <span>
                              {lang === 'ml'
                                ? 'ഗുരുവിനോട് ചോദിക്കുക'
                                : `Ask Tutor`}
                            </span>
                          </button>

                          <button
                            onClick={() => handleOpenSuggestCorrection(composer.name, 'composer')}
                            className="text-xs text-[#87947A] hover:text-[#C7A45B] flex items-center space-x-1 font-mono transition-colors py-1"
                            title="Suggest a biographical or critical musicological edit"
                          >
                            <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            <span>{lang === 'ml' ? 'തിരുത്തൽ നിർദ്ദേശിക്കുക' : 'Suggest Citation / Edit'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GLOSSARY TAB */}
            {exploreTab === 'glossary' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#BDB4A4] font-mono gap-1">
                  <span>
                    {lang === 'ml'
                      ? `${filteredGlossary.length} സംഗീത ശാസ്ത്ര പദങ്ങൾ ലഭ്യമാണ്`
                      : `Displaying ${filteredGlossary.length} verified musicology terms`}
                  </span>
                  <span className="text-[#87947A]">
                    {lang === 'ml'
                      ? 'സാധാരണക്കാർക്ക് എളുപ്പത്തിൽ മനസ്സിലാക്കാവുന്ന ലളിത വിവരണം'
                      : 'Plain-language definitions citing primary treatises'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {filteredGlossary.map((item, idx) => {
                    const ml = GLOSSARY_ML_DATA[item.term];
                    return (
                      <div
                        key={idx}
                        className="nv-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-[#C7A45B]/60 transition-all duration-300 space-y-3 relative overflow-hidden shadow-xl group"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A45B]/5 rounded-bl-full pointer-events-none group-hover:bg-[#C7A45B]/10 transition-colors" />

                        <div className="flex items-baseline justify-between relative z-10 gap-2">
                          <h4 className="font-serif font-bold text-lg sm:text-xl text-[#F4EBDD] group-hover:text-[#E0C98F] transition-colors">
                            {lang === 'ml' && ml ? `${ml.termMl} (${item.term})` : item.term}
                          </h4>
                          <span className="text-[10px] sm:text-[11px] font-mono bg-[#C7A45B]/15 text-[#E0C98F] px-2.5 py-0.5 rounded-full border border-[#C7A45B]/30 shrink-0">
                            {lang === 'ml' && ml ? ml.categoryMl : item.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#F4EBDD]/90 font-medium leading-relaxed relative z-10">
                          {lang === 'ml' && ml ? ml.simpleExplanationMl : item.simpleExplanation}
                        </p>
                        <p className="text-xs text-[#BDB4A4] leading-relaxed relative z-10">
                          {lang === 'ml' && ml ? ml.detailedContextMl : item.detailedContext}
                        </p>
                        <div className="pt-2 text-[11px] text-[#BDB4A4]/70 font-mono relative z-10 border-t border-[#C7A45B]/15">
                          {lang === 'ml' ? 'അവലംബം: ' : 'Source: '}
                          <span className="text-[#C7A45B]">{item.sources[0]?.title}</span> ({item.sources[0]?.authorOrCreator})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SECTION: PRACTICE STUDIO (SHRUTI, TUNER, TALA, RECORDER, SESSION NOTES)
        ========================================================================= */}
        {activeSection === 'practice' && (
          <div className="space-y-8 sm:space-y-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] bg-[#191916] px-3.5 py-1.5 rounded-full border border-[#3B392F] mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'സമഗ്ര സാധക കളരി' : 'Integrated Practice Suite'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F4EBDD]">
                {t.practiceStudioTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-2xl leading-relaxed">
                {t.practiceStudioSubtitle}
              </p>

              {/* Hands-Free Instrument Shortcuts Quick Bar */}
              <div className="mt-4 p-3 bg-[#161410] border border-[#C7A45B]/30 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs text-[#F4EBDD]">
                <div className="flex items-center space-x-2 text-[#C7A45B]">
                  <Keyboard className="w-4 h-4" />
                  <span className="font-semibold text-xs font-mono uppercase tracking-wider">
                    {lang === 'ml' ? 'കൈക്രിയാ കുറുക്കുവഴികൾ (Hotkeys):' : 'Hands-Free Shortcuts:'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#BDB4A4]">
                  <span className="bg-[#22221D] px-2 py-1 rounded border border-[#3B392F] flex items-center space-x-1">
                    <kbd className="text-[#C7A45B] font-bold">Space</kbd>
                    <span>{lang === 'ml' ? 'താളം' : 'Tala Metronome'}</span>
                  </span>
                  <span className="bg-[#22221D] px-2 py-1 rounded border border-[#3B392F] flex items-center space-x-1">
                    <kbd className="text-[#C7A45B] font-bold">T</kbd>
                    <span>{lang === 'ml' ? 'ടാപ്പ് ടെമ്പോ' : 'Tap Tempo'}</span>
                  </span>
                  <span className="bg-[#22221D] px-2 py-1 rounded border border-[#3B392F] flex items-center space-x-1">
                    <kbd className="text-[#C7A45B] font-bold">S</kbd>
                    <span>{lang === 'ml' ? 'തംബുരു' : 'Tanpura'}</span>
                  </span>
                  <span className="bg-[#22221D] px-2 py-1 rounded border border-[#3B392F] flex items-center space-x-1">
                    <kbd className="text-[#C7A45B] font-bold">M</kbd>
                    <span>{lang === 'ml' ? 'ട്യൂണർ' : 'Mic Tuner'}</span>
                  </span>
                </div>
              </div>

              {/* Natural Adhara Sa & Pre-tuned Pitch Banner */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#191916] rounded-2xl border border-[#C7A45B]/30">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C7A45B]/20 border border-[#C7A45B] flex items-center justify-center text-[#E0C98F]">
                    <Music2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#BDB4A4] uppercase">
                      {lang === 'ml' ? 'നിങ്ങളുടെ ആധാര ശ്രുതി (Natural Tonic):' : 'Pre-Tuned Musician Pitch:'}
                    </span>
                    <div className="text-sm font-serif font-bold text-[#F4EBDD]">
                      {activeTonic.name} ({activeTonic.kattai}) · {activeTonic.frequency.toFixed(2)} Hz
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#C7A45B]/40 hover:border-[#C7A45B] bg-[#22221D] hover:bg-[#2a2822] text-[#E0C98F] text-xs font-mono transition-all cursor-pointer"
                >
                  {lang === 'ml' ? 'കട്ട / വാദ്യം മാറ്റുക' : 'Change Pitch / Setup'}
                </button>
              </div>
            </div>

            {/* Shruti Companion */}
            <ShrutiCompanion />

            {/* Microphone Pitch Tuner */}
            <TunerCompanion
              activeTonic={activeTonic}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
            />

            {/* Fretboard & Piano Swarasthana Visualizer */}
            <SwarasthanaVisualizer />

            {/* Tala Studio & Accompaniment Loops */}
            <TalaStudio />

            {/* Explainable AI Practice Companion */}
            <ExplainablePracticeCompanion
              activeTonic={activeTonic}
              onNavigateToCurriculum={() => setActiveSection('learn')}
              onSaveSessionNotes={(notes, seconds) => {
                setSessionNotes(notes);
                setSessionDurationMinutes(Math.max(1, Math.round(seconds / 60)));
                setSessionFocus('AI Practice Companion Evaluation');
              }}
            />

            {/* Classical Graded Exercises (Sarali, Jantai, Alankaram) */}
            <GradedExercises
              activeTonic={activeTonic}
              onLogPracticeSession={(focus, mins) => {
                setSessionFocus(focus);
                setSessionDurationMinutes(mins);
              }}
            />

            {/* Private Audio Recorder */}
            <PracticeRecorder
              onSaveSessionNotes={(durationSeconds) => {
                const mins = Math.max(1, Math.round(durationSeconds / 60));
                setSessionDurationMinutes(mins);
              }}
            />

            {/* Sadhana Habit Tracker, Streaks & Export Report */}
            <SadhanaTracker />

            {/* Practice Session Logger */}
            <section className="bg-[#191916] border border-[#3B392F] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="pb-4 border-b border-[#3B392F] mb-5 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD]">
                  {t.practiceLogTitle}
                </h3>
                <p className="text-xs text-[#BDB4A4] mt-0.5 leading-relaxed">
                  {lang === 'ml'
                    ? 'സാധക വിഷയങ്ങൾ, അനുഭവങ്ങൾ, വേഗത എന്നിവ രേഖപ്പെടുത്തുക. അക്കൗണ്ടിൽ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.'
                    : 'Record focus areas, self-reflections, and tempo settings. Kept private to your account.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5">
                      {t.sessionFocus}
                    </label>
                    <input
                      type="text"
                      value={sessionFocus}
                      onChange={(e) => setSessionFocus(e.target.value)}
                      placeholder={lang === 'ml' ? 'ഉദാ: മായാമാളവഗൗള ജണ്ഡ വരിശ 1-4' : 'e.g. Mayamalavagowla Jantai Varisai 1-4'}
                      className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5">
                      {lang === 'ml' ? 'ദൈർഘ്യം (മിനിറ്റ്)' : 'Duration (Minutes)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="360"
                      value={sessionDurationMinutes}
                      onChange={(e) => setSessionDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5">
                    {t.sessionNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder={
                      lang === 'ml'
                        ? 'ശ്രുതി ശുദ്ധി, ശ്വാസ നിയന്ത്രണം, താള കൃത്യത എന്നിവയെക്കുറിച്ചുള്ള കുറിപ്പുകൾ...'
                        : 'Notes on pitch accuracy, breath control, or tala alignment...'
                    }
                    className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs">
                    {sessionSavedStatus === 'saved_server' && (
                      <span className="flex items-center space-x-1.5 font-medium text-[#6EA887]">
                        <CheckCircle2 className="w-4 h-4 text-[#6EA887]" />
                        <span>{lang === 'ml' ? 'അക്കൗണ്ടിൽ വിജയകരമായി സൂക്ഷിച്ചു.' : 'Practice session synced to your account.'}</span>
                      </span>
                    )}
                    {sessionSavedStatus === 'saved_local' && (
                      <span className="flex items-center space-x-1.5 font-medium text-[#E0C98F]">
                        <CheckCircle2 className="w-4 h-4 text-[#C7A45B]" />
                        <span>{lang === 'ml' ? 'ബ്രൗസറിൽ ലോക്കലായി സൂക്ഷിച്ചു.' : 'Saved locally to device storage.'}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSavePracticeSession}
                    className="flex items-center justify-center space-x-1.5 px-6 py-3 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-xs font-semibold transition-all shadow-md active:scale-95 w-full sm:w-auto min-h-[42px]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.saveSessionBtn}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            SECTION: TEACHING & GURUKULAM (FEATURE 5)
        ========================================================================= */}
        {activeSection === 'teaching' && (
          <TeacherStudentWorkspace
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateToCurriculum={() => setActiveSection('learn')}
          />
        )}

        {/* =========================================================================
            SECTION: CARNATIC HERITAGE ARCHIVE (FEATURE 6)
        ========================================================================= */}
        {activeSection === 'heritage' && (
          <HeritageArchive />
        )}
      </main>

      {/* First-Time Musician Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(profile) => {
          const matched = TONIC_OPTIONS.find((t) => t.name.startsWith(profile.tonic));
          if (matched) {
            setActiveTonic(matched);
            audioEngine.setTonic(matched.frequency);
          }
        }}
      />

      {/* Suggest a Musicological Edit Peer-Review Modal */}
      <SuggestCorrectionModal
        isOpen={isSuggestCorrectionOpen}
        onClose={() => setIsSuggestCorrectionOpen(false)}
        initialEntityName={correctionTarget.name}
        initialEntityType={correctionTarget.type}
      />

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

      {/* Privacy Policy & Microphone Data Sovereignty Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Classical Treatises & Attribution Modal */}
      <AttributionModal
        isOpen={isAttributionOpen}
        onClose={() => setIsAttributionOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenAttribution={() => setIsAttributionOpen(true)}
      />
    </div>
  );
}
