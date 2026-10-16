'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Compass, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { audioEngine, TONIC_OPTIONS } from '../lib/audioEngine';

interface NavbarProps {
  onOpenTutor?: () => void;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTutor, activeSection = 'home', onNavigate }) => {
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
            className="flex items-center space-x-2 text-left group"
            aria-label="NadaVerse Home"
          >
            <div className="w-9 h-9 rounded-full bg-[#191916] border border-[#C7A45B] flex items-center justify-center text-[#C7A45B] font-serif font-bold text-lg shadow-sm group-hover:bg-[#22221D] transition-colors">
              N
            </div>
            <div>
              <span className="font-serif tracking-wide text-xl font-bold text-[#F4EBDD] block leading-tight">
                NadaVerse
              </span>
              <span className="text-[11px] tracking-wider uppercase text-[#BDB4A4] block">
                Carnatic Sanctuary
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
            Overview
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
            <span>Start Here</span>
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
            <span>Explore</span>
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
            <span>Practice Studio</span>
          </button>

          <button
            onClick={onOpenTutor}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#F4EBDD] hover:text-[#E0C98F] hover:bg-[#191916]/70 transition-colors border border-transparent hover:border-[#3B392F]"
            aria-label="Open Grounded AI Music Tutor"
          >
            <Sparkles className="w-4 h-4 text-[#C7A45B]" />
            <span>AI Tutor</span>
          </button>
        </nav>

        {/* Global Quick Shruti Companion / Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#191916] border border-[#3B392F] rounded-lg p-1 text-xs">
            <span className="text-[#BDB4A4] px-2 font-mono hidden sm:inline">Adhara Sa:</span>
            <select
              value={selectedTonic.name}
              onChange={handleTonicChange}
              className="bg-[#22221D] text-[#F4EBDD] rounded px-2 py-1 text-xs border border-[#3B392F] focus:outline-none focus:border-[#C7A45B]"
              aria-label="Select global tonic pitch"
            >
              {TONIC_OPTIONS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.kattai})
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
                  <span className="hidden sm:inline">Drone Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Play Shruti</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
