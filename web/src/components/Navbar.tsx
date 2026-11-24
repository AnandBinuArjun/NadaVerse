'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  Sliders,
  BookOpen,
  User,
  Menu,
  X,
  GraduationCap,
  Landmark,
  Search,
  Music2,
  Music,
  Headphones,
  Activity,
  Layers,
  FileEdit
} from 'lucide-react';
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
    const chosen = TONIC_OPTIONS.find((tOpt) => tOpt.name === e.target.value) || TONIC_OPTIONS[0];
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

  const navItems = [
    { id: 'home', label: t.navOverview, icon: null },
    { id: 'learn', label: t.navStartHere, icon: BookOpen },
    { id: 'ear-training', label: lang === 'ml' ? 'ശ്രവണം' : 'Ear Training', icon: Headphones },
    { id: 'explore', label: t.navExplore, icon: Compass },
    { id: 'melakarta', label: lang === 'ml' ? '72 മേളകർത്താ' : '72 Melakartas', icon: Compass },
    { id: 'practice', label: t.navPracticeStudio, icon: Sliders },
    { id: 'gamaka', label: lang === 'ml' ? 'ഗമക ലാബ്' : 'Gamaka Lab', icon: Activity },
    { id: 'konnakol', label: lang === 'ml' ? 'കൊന്നക്കോൽ' : 'Konnakol & Talas', icon: Layers },
    { id: 'compositions', label: lang === 'ml' ? 'രചനകൾ' : 'Compositions', icon: Music },
    { id: 'notation', label: lang === 'ml' ? 'നൊട്ടേഷൻ' : 'Notation Editor', icon: FileEdit },
    { id: 'violin', label: lang === 'ml' ? 'വയലിൻ' : 'Violin', icon: Music2 },
    { id: 'kutcheri', label: lang === 'ml' ? 'കച്ചേരി & സ്റ്റേജ്' : 'Perform & Kutcheri', icon: Music },
    { id: 'mir-lab', label: lang === 'ml' ? 'MIR & സ്പെക്ട്രോഗ്രാം' : 'MIR & Spectrogram', icon: Activity },
    { id: 'research', label: lang === 'ml' ? 'ഗവേഷണം & ഗ്രാഫ്' : 'Research & Graph', icon: Compass },
    { id: 'teaching', label: lang === 'ml' ? 'ഗുരുകുലം' : 'Gurukulam', icon: GraduationCap },
    { id: 'heritage', label: lang === 'ml' ? 'പൈതൃകം' : 'Heritage', icon: Landmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d0c0a]/95 backdrop-blur-2xl border-b border-[#C7A45B]/20 shadow-xl shadow-black/50 transition-all duration-300 w-full">
      {/* Top Row: Brand, Primary Desktop Nav (xl+), and Right Utility Cluster */}
      <div className="max-w-[1800px] w-full mx-auto px-2.5 sm:px-4 lg:px-6 2xl:px-8 h-14 sm:h-16 lg:h-18 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center shrink-0 min-w-0">
          <button
            onClick={() => handleNavigateSection('home')}
            className="flex items-center space-x-2 sm:space-x-3 text-left group transition-transform duration-300 cursor-pointer"
            aria-label="NadaVerse Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#C7A45B]/70 bg-[#161410] flex items-center justify-center shadow-[0_0_20px_rgba(199,164,91,0.25)] group-hover:border-[#C7A45B] transition-all duration-300 shrink-0">
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
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-wide text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-[#F4EBDD] via-[#E8D7A8] to-[#C7A45B] bg-clip-text text-transparent block leading-none whitespace-nowrap">
                  {t.brandName}
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.5 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider rounded-md bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/35">
                  Free
                </span>
              </div>
              <span className="hidden md:block text-[9px] tracking-wider uppercase text-[#BDB4A4]/80 font-mono mt-0.5 whitespace-nowrap">
                {lang === 'ml' ? 'സംഗീത സങ്കേതം' : t.brandSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Right Utility Cluster */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Spotlight Search Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-[#14120e]/80 hover:bg-[#222019] border border-[#C7A45B]/30 hover:border-[#C7A45B]/60 text-xs text-[#E0C98F] font-medium transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer min-h-[34px]"
            title="Search Ragas, Talas, Lessons, Compositions (Ctrl+K)"
            aria-label="Search NadaVerse (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span className="hidden lg:inline text-[11px] text-[#BDB4A4]">
              {lang === 'ml' ? 'തിരയുക' : 'Search'}
            </span>
            <kbd className="hidden sm:inline-flex items-center text-[9px] font-mono px-1 rounded bg-[#222019] text-[#C7A45B] border border-[#C7A45B]/25">
              ⌘K
            </kbd>
          </button>

          {/* AI Tutor Quick Pill */}
          <button
            onClick={onOpenTutor}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#C7A45B]/15 hover:bg-[#C7A45B]/25 border border-[#C7A45B]/40 text-xs text-[#E0C98F] font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer min-h-[34px]"
            aria-label="Open Grounded AI Music Tutor"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
            <span className="hidden md:inline">{t.navAiTutor}</span>
          </button>

          {/* Quick Tanpura Drone Capsule */}
          <div className="hidden md:flex items-center bg-[#14120e]/80 border border-[#C7A45B]/25 rounded-full p-0.5 text-xs backdrop-blur-md shadow-sm shrink-0">
            <select
              value={selectedTonic.name}
              onChange={handleTonicChange}
              className="bg-transparent text-[#E0C98F] rounded-full pl-2 pr-1 py-1 text-xs font-mono font-bold focus:outline-none cursor-pointer"
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
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
                  <span className="hidden xl:inline">{t.droneActive}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{t.playShruti}</span>
                </>
              )}
            </button>
          </div>

          {/* Language Switcher Capsule */}
          <div className="flex items-center bg-[#14120e]/80 border border-[#C7A45B]/25 rounded-full p-0.5 text-xs backdrop-blur-md shadow-sm shrink-0">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-[#DFB960] to-[#C7A45B] text-[#11110F]'
                  : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('ml')}
              className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                lang === 'ml'
                  ? 'bg-gradient-to-r from-[#DFB960] to-[#C7A45B] text-[#11110F]'
                  : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
              title="മലയാളം (Malayalam)"
              aria-label="മലയാളത്തിലേക്ക് മാറ്റുക"
            >
              ML
            </button>
          </div>

          {/* Account & Profile Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-[#14120e]/80 hover:bg-[#222019] border border-[#C7A45B]/30 hover:border-[#C7A45B]/60 text-xs text-[#F4EBDD] font-medium transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer min-h-[34px]"
              aria-label="User account and preferences"
            >
              <User className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span className="hidden lg:inline">
                {currentUser ? currentUser.displayName : t.signIn}
              </span>
            </button>
          )}

          {/* Mobile & Tablet Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#14120e]/80 border border-[#C7A45B]/25 text-[#E0C98F] hover:text-white hover:border-[#C7A45B]/50 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Universal Responsive Horizontal Navigation Ribbon (Works across Mobile, Tablet, Laptop & Ultrawide) */}
      <div className="border-t border-[#C7A45B]/15 bg-[#11100d]/95">
        <nav
          className="max-w-[1800px] w-full mx-auto px-2.5 sm:px-4 lg:px-6 2xl:px-8 py-1.5 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigateSection(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DFB960]/25 to-[#C7A45B]/25 text-[#E0C98F] border border-[#C7A45B]/50 shadow-sm font-semibold'
                    : 'text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-white/5 border border-transparent'
                }`}
              >
                {IconComp && <IconComp className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile & Tablet Full Drawer (Scrollable on any screen height) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#C7A45B]/20 bg-[#0d0c0a]/98 backdrop-blur-2xl px-4 sm:px-6 py-4 space-y-4 shadow-2xl max-h-[calc(100dvh-6.5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCommandPalette) onOpenCommandPalette();
              }}
              className="flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-medium bg-[#1a1813] border border-[#C7A45B]/30 text-[#E0C98F] hover:bg-[#25221b] transition-colors cursor-pointer"
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
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTutor) onOpenTutor();
              }}
              className="flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-medium text-[#E0C98F] bg-[#C7A45B]/15 border border-[#C7A45B]/35 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C7A45B]" />
                <span>{t.navAiTutor}</span>
              </div>
            </button>
          </div>

          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-2" aria-label="Mobile Drawer Navigation">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigateSection(item.id)}
                  className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 font-semibold'
                      : 'bg-[#14130f] text-[#BDB4A4] hover:bg-[#1c1a14] border border-[#3B392F]/50'
                  }`}
                >
                  {IconComp && <IconComp className="w-4 h-4 text-[#C7A45B] shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Tanpura Controls */}
          <div className="pt-3 border-t border-[#C7A45B]/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-[#BDB4A4] font-mono">{t.adharaSa}</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedTonic.name}
                onChange={handleTonicChange}
                className="bg-[#161410] text-[#E0C98F] rounded-lg px-2.5 py-1.5 text-xs border border-[#C7A45B]/30 font-mono"
              >
                {TONIC_OPTIONS.map((tOpt) => (
                  <option key={tOpt.name} value={tOpt.name}>
                    {tOpt.name} ({tOpt.kattai})
                  </option>
                ))}
              </select>

              <button
                onClick={toggleDrone}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
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
