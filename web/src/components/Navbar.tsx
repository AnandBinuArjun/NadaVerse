'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Compass, Sparkles, Sliders, BookOpen, User, Menu, X, GraduationCap, Landmark, Search, Music2, Music } from 'lucide-react';
import { audioEngine, TONIC_OPTIONS } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenTutor?: () => void;
  onOpenAuth?: () => void;
  onOpenCommandPalette?: () => void;
  currentUser?: { email: string; displayName: string } | null;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTutor,
  onOpenAuth,
  onOpenCommandPalette,
  currentUser,
  activeSection = 'home',
  onNavigate
}) => {
  const { lang, setLang, t } = useLanguage();
  const [isDroneOn, setIsDroneOn] = useState(false);
  const [selectedTonic, setSelectedTonic] = useState(TONIC_OPTIONS[0]); // C
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDrone = async () => {
    if (isDroneOn) {
      audioEngine.stopTanpura();
      setIsDroneOn(false);
    } else {
      await audioEngine.unlockAudio();
      await audioEngine.startTanpura(selectedTonic.frequency, 0.7);
      setIsDroneOn(true);
    }
  };

  const handleTonicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosen = TONIC_OPTIONS.find((t) => t.name === e.target.value) || TONIC_OPTIONS[0];
    setSelectedTonic(chosen);
    if (isDroneOn) {
      audioEngine.startTanpura(chosen.frequency, 0.7);
    }
  };

  const handleNavigateSection = (sec: string) => {
    if (onNavigate) {
      onNavigate(sec);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0c0a]/90 backdrop-blur-2xl border-b border-[#C7A45B]/20 shadow-xl shadow-black/50 transition-all duration-300 overflow-x-clip">
      <div className="max-w-[1800px] w-full mx-auto px-2 sm:px-4 lg:px-6 2xl:px-8 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center shrink-0 min-w-0">
          <button
            onClick={() => handleNavigateSection('home')}
            className="flex items-center space-x-2 sm:space-x-3 text-left group transition-transform duration-300"
            aria-label="NadaVerse Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-11 2xl:h-11 rounded-full overflow-hidden border-2 border-[#C7A45B]/70 bg-[#161410] flex items-center justify-center shadow-[0_0_20px_rgba(199,164,91,0.25)] group-hover:border-[#C7A45B] group-hover:shadow-[0_0_30px_rgba(199,164,91,0.5)] group-hover:scale-105 transition-all duration-300 shrink-0">
              <Image
                src="/logo.png"
                alt="NadaVerse Emblem"
                width={44}
                height={44}
                priority
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="shrink-0 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif tracking-wide text-base sm:text-xl 2xl:text-2xl font-bold bg-gradient-to-r from-[#F4EBDD] via-[#E8D7A8] to-[#C7A45B] bg-clip-text text-transparent block leading-none whitespace-nowrap">
                  {t.brandName}
                </span>
                <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] 2xl:text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/35 shadow-sm">
                  Public Beta
                </span>
              </div>
              <span className="hidden sm:block text-[8px] sm:text-[9px] 2xl:text-[10px] tracking-wider uppercase text-[#BDB4A4]/80 font-mono mt-0.5 sm:mt-1 whitespace-nowrap">
                {lang === 'ml' ? 'സംഗീത സങ്കേതം' : t.brandSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-0.5 2xl:gap-1 bg-[#14120e]/80 p-0.5 rounded-full border border-[#C7A45B]/25 backdrop-blur-xl shadow-inner shrink-0"
          aria-label="Main Navigation"
        >
          <button
            onClick={() => handleNavigateSection('home')}
            className={`whitespace-nowrap px-2 2xl:px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'home'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            {t.navOverview}
          </button>

          <button
            onClick={() => handleNavigateSection('learn')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'learn'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <BookOpen className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{t.navStartHere}</span>
          </button>

          <button
            onClick={() => handleNavigateSection('explore')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'explore'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <Compass className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{t.navExplore}</span>
          </button>

          <button
            onClick={() => handleNavigateSection('practice')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'practice'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <Sliders className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{t.navPracticeStudio}</span>
          </button>

          <button
            onClick={() => handleNavigateSection('compositions')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'compositions'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <Music className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'രചനകൾ' : 'Compositions'}</span>
          </button>

          <button
            onClick={() => handleNavigateSection('violin')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'violin'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <Music2 className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'വയലിൻ' : 'Violin'}</span>
          </button>

          <button
            onClick={() => handleNavigateSection('teaching')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'teaching'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <GraduationCap className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'ഗുരുകുലം' : 'Gurukulam'}</span>
          </button>

          <button
            onClick={() => handleNavigateSection('heritage')}
            className={`whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium transition-all duration-200 ${
              activeSection === 'heritage'
                ? 'bg-gradient-to-r from-[#DFB960]/20 to-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 shadow-sm font-semibold'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5'
            }`}
          >
            <Landmark className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'പൈതൃകം' : 'Heritage'}</span>
          </button>

          <button
            onClick={onOpenTutor}
            className="whitespace-nowrap flex items-center gap-1 px-1.5 2xl:px-2.5 py-1 rounded-full text-[11px] 2xl:text-xs font-medium text-[#E0C98F] hover:bg-[#C7A45B]/15 hover:border-[#C7A45B]/40 transition-all border border-transparent"
            aria-label="Open Grounded AI Music Tutor"
          >
            <Sparkles className="hidden 2xl:block w-3 h-3 text-[#C7A45B]" />
            <span>{t.navAiTutor}</span>
          </button>
        </nav>

        {/* Right Utility Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Spotlight Search Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-[#14120e]/80 hover:bg-[#222019] border border-[#C7A45B]/30 hover:border-[#C7A45B]/60 text-xs text-[#E0C98F] font-medium transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
            title="Search Ragas, Talas, Lessons, Compositions (Ctrl+K)"
            aria-label="Search NadaVerse (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span className="hidden 2xl:inline text-[11px] text-[#BDB4A4]">
              {lang === 'ml' ? 'തിരയുക' : 'Search'}
            </span>
            <kbd className="hidden sm:inline-flex items-center text-[9px] font-mono px-1 rounded bg-[#222019] text-[#C7A45B] border border-[#C7A45B]/25">
              ⌘K
            </kbd>
          </button>

          {/* Quick Tanpura Drone Capsule */}
          <div className="hidden sm:flex items-center bg-[#14120e]/80 border border-[#C7A45B]/25 rounded-full p-0.5 text-xs backdrop-blur-md shadow-sm shrink-0">
            <select
              value={selectedTonic.name}
              onChange={handleTonicChange}
              className="bg-transparent text-[#E0C98F] rounded-full pl-2 pr-1 py-0.5 sm:py-1 text-xs font-mono font-bold focus:outline-none cursor-pointer"
              aria-label="Select global tonic pitch"
            >
              {TONIC_OPTIONS.map((tOpt) => (
                <option key={tOpt.name} value={tOpt.name} className="bg-[#191916] text-[#F4EBDD]">
                  {tOpt.name} ({tOpt.kattai})
                </option>
              ))}
            </select>

            <button
              onClick={toggleDrone}
              className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isDroneOn
                  ? 'bg-gradient-to-r from-[#DFB960] to-[#C7A45B] text-[#11110F] shadow-[0_0_15px_rgba(199,164,91,0.5)] animate-pulse'
                  : 'bg-[#222019] text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#2a2820]'
              }`}
              title={isDroneOn ? 'Pause Tanpura Drone' : 'Start Tanpura Drone'}
              aria-label={isDroneOn ? 'Pause Tanpura Drone' : 'Start Tanpura Drone'}
            >
              {isDroneOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden 2xl:inline">{t.droneActive}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden 2xl:inline">{t.playShruti}</span>
                </>
              )}
            </button>
          </div>

          {/* Language Switcher Capsule */}
          <div className="flex items-center bg-[#14120e]/80 border border-[#C7A45B]/25 rounded-full p-0.5 text-xs backdrop-blur-md shadow-sm shrink-0">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-[#DFB960] to-[#C7A45B] text-[#11110F] shadow-[0_0_12px_rgba(199,164,91,0.4)]'
                  : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('ml')}
              className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                lang === 'ml'
                  ? 'bg-gradient-to-r from-[#DFB960] to-[#C7A45B] text-[#11110F] shadow-[0_0_12px_rgba(199,164,91,0.4)]'
                  : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title="മലയാളം (Malayalam)"
              aria-label="മലയാളത്തിലേക്ക് മാറ്റുക"
            >
              <span className="hidden 2xl:inline">മലയാളം</span>
              <span className="2xl:hidden inline">ML</span>
            </button>
          </div>

          {/* Account & Profile Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-[#14120e]/80 hover:bg-[#222019] border border-[#C7A45B]/30 hover:border-[#C7A45B]/60 text-xs text-[#F4EBDD] font-medium transition-all shadow-sm shrink-0 whitespace-nowrap"
              aria-label="User account and preferences"
            >
              <User className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span className="hidden md:inline">
                {currentUser ? currentUser.displayName : t.signIn}
              </span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#14120e]/80 border border-[#C7A45B]/25 text-[#E0C98F] hover:text-white hover:border-[#C7A45B]/50 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#C7A45B]/20 bg-[#0d0c0a]/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl animate-fade-in">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCommandPalette) onOpenCommandPalette();
              }}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-medium bg-[#1a1813] border border-[#C7A45B]/30 text-[#E0C98F] hover:bg-[#25221b] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'തിരയുക (Search)' : 'Spotlight Search'}</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#24211a] text-[#C7A45B] border border-[#C7A45B]/30">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => handleNavigateSection('home')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'home'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <span>{t.navOverview}</span>
            </button>

            <button
              onClick={() => handleNavigateSection('learn')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'learn'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C7A45B]" />
                <span>{t.navStartHere}</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigateSection('explore')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'explore'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C7A45B]" />
                <span>{t.navExplore}</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigateSection('practice')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'practice'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C7A45B]" />
                <span>{t.navPracticeStudio}</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigateSection('compositions')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'compositions'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'രചനാ ലൈബ്രറി' : 'Compositions Library'}</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigateSection('violin')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'violin'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'വയലിൻ കളരി' : 'Violin Studio'}</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigateSection('teaching')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'teaching'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'ഗുരുകുലം (പഠന കൂട്ടായ്മ)' : 'Gurukulam (Teaching)'}</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigateSection('heritage')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === 'heritage'
                  ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30'
                  : 'text-[#BDB4A4] hover:bg-[#161410]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'പൈതൃക ശേഖരം' : 'Heritage Archive'}</span>
              </div>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTutor) onOpenTutor();
              }}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-medium text-[#E0C98F] bg-[#C7A45B]/10 border border-[#C7A45B]/25"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C7A45B]" />
                <span>{t.navAiTutor}</span>
              </div>
            </button>
          </nav>

          {/* Mobile Tanpura Controls */}
          <div className="pt-3 border-t border-[#C7A45B]/20 flex items-center justify-between">
            <span className="text-xs text-[#BDB4A4] font-mono">{t.adharaSa}</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedTonic.name}
                onChange={handleTonicChange}
                className="bg-[#161410] text-[#E0C98F] rounded-lg px-2.5 py-1 text-xs border border-[#C7A45B]/30 font-mono"
              >
                {TONIC_OPTIONS.map((tOpt) => (
                  <option key={tOpt.name} value={tOpt.name}>
                    {tOpt.name} ({tOpt.kattai})
                  </option>
                ))}
              </select>

              <button
                onClick={toggleDrone}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                  isDroneOn
                    ? 'bg-[#C7A45B] text-[#11110F]'
                    : 'bg-[#222019] text-[#F4EBDD] border border-[#C7A45B]/30'
                }`}
              >
                {isDroneOn ? <Volume2 className="w-3.5 h-3.5 fill-current" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isDroneOn ? t.droneActive : t.playShruti}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
