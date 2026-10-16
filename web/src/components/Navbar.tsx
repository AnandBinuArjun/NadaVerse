'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Compass, Sparkles, Sliders, BookOpen, User, Globe } from 'lucide-react';
import { audioEngine, TONIC_OPTIONS } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenTutor?: () => void;
  onOpenAuth?: () => void;
  currentUser?: { email: string; displayName: string } | null;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTutor,
  onOpenAuth,
  currentUser,
  activeSection = 'home',
  onNavigate
}) => {
  const { lang, setLang, t } = useLanguage();
  const [isDroneOn, setIsDroneOn] = useState(false);
  const [selectedTonic, setSelectedTonic] = useState(TONIC_OPTIONS[0]); // C

  const toggleDrone = () => {
    if (isDroneOn) {
      audioEngine.stopTanpura();
      setIsDroneOn(false);
    } else {
      audioEngine.startTanpura(selectedTonic.frequency, 0.7);
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

  return (
    <header className="sticky top-0 z-50 bg-[#11110F]/95 backdrop-blur-md border-b border-[#3B392F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center space-x-3 text-left group"
            aria-label="NadaVerse Home"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C7A45B]/60 bg-[#191916] flex items-center justify-center shadow-md group-hover:border-[#C7A45B] group-hover:scale-105 transition-all shrink-0">
              <img
                src="/logo.png"
                alt="NadaVerse Emblem"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <span className="font-serif tracking-wide text-xl font-bold text-[#F4EBDD] block leading-tight">
                {t.brandName}
              </span>
              <span className="text-[11px] tracking-wider uppercase text-[#BDB4A4] block">
                {t.brandSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'home'
                ? 'bg-[#191916] text-[#C7A45B] border border-[#3B392F]'
                : 'text-[#F4EBDD] hover:text-[#C7A45B] hover:bg-[#191916]/50'
            }`}
          >
            {t.navOverview}
          </button>

          <button
            onClick={() => onNavigate && onNavigate('learn')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'learn'
                ? 'bg-[#191916] text-[#C7A45B] border border-[#3B392F]'
                : 'text-[#F4EBDD] hover:text-[#C7A45B] hover:bg-[#191916]/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C7A45B]" />
            <span>{t.navStartHere}</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('explore')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'explore'
                ? 'bg-[#191916] text-[#C7A45B] border border-[#3B392F]'
                : 'text-[#F4EBDD] hover:text-[#C7A45B] hover:bg-[#191916]/50'
            }`}
          >
            <Compass className="w-4 h-4 text-[#C7A45B]" />
            <span>{t.navExplore}</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('practice')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'practice'
                ? 'bg-[#191916] text-[#C7A45B] border border-[#3B392F]'
                : 'text-[#F4EBDD] hover:text-[#C7A45B] hover:bg-[#191916]/50'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#C7A45B]" />
            <span>{t.navPracticeStudio}</span>
          </button>

          <button
            onClick={onOpenTutor}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#F4EBDD] hover:text-[#E0C98F] hover:bg-[#191916]/70 transition-colors border border-transparent hover:border-[#3B392F]"
            aria-label="Open Grounded AI Music Tutor"
          >
            <Sparkles className="w-4 h-4 text-[#C7A45B]" />
            <span>{t.navAiTutor}</span>
          </button>
        </nav>

        {/* Global Quick Shruti Companion / Status & Auth */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#191916] border border-[#3B392F] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                lang === 'en'
                  ? 'bg-[#C7A45B] text-[#11110F] font-semibold shadow-xs'
                  : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('ml')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                lang === 'ml'
                  ? 'bg-[#C7A45B] text-[#11110F] font-semibold shadow-xs'
                  : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title="മലയാളം (Malayalam)"
              aria-label="മലയാളത്തിലേക്ക് മാറ്റുക"
            >
              മലയാളം
            </button>
          </div>

          <div className="flex items-center bg-[#191916] border border-[#3B392F] rounded-lg p-1 text-xs">
            <span className="text-[#BDB4A4] px-2 font-mono hidden sm:inline">{t.adharaSa}</span>
            <select
              value={selectedTonic.name}
              onChange={handleTonicChange}
              className="bg-[#22221D] text-[#F4EBDD] rounded px-2 py-1 text-xs border border-[#3B392F] focus:outline-none focus:border-[#C7A45B]"
              aria-label="Select global tonic pitch"
            >
              {TONIC_OPTIONS.map((tOpt) => (
                <option key={tOpt.name} value={tOpt.name}>
                  {tOpt.name} ({tOpt.kattai})
                </option>
              ))}
            </select>

            <button
              onClick={toggleDrone}
              className={`ml-1.5 flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-all ${
                isDroneOn
                  ? 'bg-[#C7A45B] text-[#11110F] shadow-sm animate-pulse'
                  : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title={isDroneOn ? 'Pause Tanpura Drone' : 'Start Tanpura Drone'}
              aria-label={isDroneOn ? 'Pause Tanpura Drone' : 'Start Tanpura Drone'}
            >
              {isDroneOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.droneActive}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.playShruti}</span>
                </>
              )}
            </button>
          </div>

          {/* Account & Profile Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#191916] hover:bg-[#22221D] border border-[#3B392F] text-xs text-[#F4EBDD] font-medium transition-colors"
              aria-label="User account and preferences"
            >
              <User className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.displayName : t.signIn}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
