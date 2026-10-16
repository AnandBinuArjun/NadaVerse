'use client';

import React, { useState } from 'react';
import { Volume2, Play, Pause, Info, Music2 } from 'lucide-react';
import { audioEngine, TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';

interface SwaraButton {
  symbol: string;
  name: string;
  ratio: number;
  fraction: string;
  description: string;
}

const COMMON_SWARAS: SwaraButton[] = [
  { symbol: 'S', name: 'Shadjam', ratio: 1.0, fraction: '1/1', description: 'Adhara Shadjam (Tonic foundation)' },
  { symbol: 'R₁', name: 'Shuddha Rishabham', ratio: 16 / 15, fraction: '16/15', description: 'Used in Mayamalavagowla, Saveri' },
  { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, fraction: '9/8', description: 'Used in Shankarabharanam, Kalyani' },
  { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, fraction: '6/5', description: 'Minor third (Kharaharapriya, Thodi)' },
  { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, fraction: '5/4', description: 'Major third (Mayamalavagowla, Kalyani)' },
  { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, fraction: '4/3', description: 'Natural fourth (Shankarabharanam)' },
  { symbol: 'M₂', name: 'Prati Madhyamam', ratio: 45 / 32, fraction: '45/32', description: 'Sharp fourth (Kalyani, Pantuvarali)' },
  { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, fraction: '3/2', description: 'Invariable fifth (Achala swara)' },
  { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, fraction: '8/5', description: 'Minor sixth (Mayamalavagowla)' },
  { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, fraction: '27/16', description: 'Major sixth (Shankarabharanam)' },
  { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, fraction: '9/5', description: 'Minor seventh (Kharaharapriya)' },
  { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, fraction: '15/8', description: 'Leading tone (Shankarabharanam, Kalyani)' },
  { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, fraction: '2/1', description: 'Higher octave tonic' }
];

export const ShrutiCompanion: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedTonic, setSelectedTonic] = useState<TonicNote>(TONIC_OPTIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);

  const togglePlayback = () => {
    if (isPlaying) {
      audioEngine.stopTanpura();
      setIsPlaying(false);
    } else {
      audioEngine.startTanpura(selectedTonic.frequency, volume);
      setIsPlaying(true);
    }
  };

  const handleTonicSelect = (note: TonicNote) => {
    setSelectedTonic(note);
    if (isPlaying) {
      audioEngine.startTanpura(note.frequency, volume);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setTanpuraVolume(val);
  };

  const handlePlaySwara = (swara: SwaraButton) => {
    setActiveSwara(swara.symbol);
    audioEngine.playSwaraNote(swara.ratio, 1.4);
    setTimeout(() => {
      setActiveSwara(null);
    }, 600);
  };

  return (
    <section className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#3B392F] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Music2 className="w-4 h-4" />
            <span>{lang === 'ml' ? 'അടിസ്ഥാന ശ്രുതി സഹായി' : 'Foundational Companion'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'ശ്രുതി & തംബുരു എഞ്ചിൻ' : 'Shruti & Tanpura Engine'}
          </h2>
          <p className="text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {lang === 'ml'
              ? 'സ്വാഭാവിക ജീവാരി നാദത്തോടുകൂടിയ 4-തന്ത്രി തംബുരു (പ-സ-സ-സ), ശുദ്ധ ജസ്റ്റ് ഇൻ്റോണേഷൻ അനുപാതങ്ങൾ.'
              : 'Acoustically modeled 4-string Tambura with natural Jivari overtone resonance (Pa-Sa-Sa-Sa) and pure Just Intonation harmonic ratios.'}
          </p>
        </div>

        {/* Master Play Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayback}
            className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-md ${
              isPlaying
                ? 'bg-[#C7A45B] text-[#11110F] hover:bg-[#E0C98F]'
                : 'bg-[#22221D] text-[#F4EBDD] border border-[#C7A45B]/60 hover:border-[#C7A45B] hover:bg-[#2A2A24]'
            }`}
            aria-label={isPlaying ? 'Pause Tanpura Drone' : 'Start Tanpura Drone'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>{lang === 'ml' ? 'ശ്രുതി നിർത്തുക' : 'Pause Drone'}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{lang === 'ml' ? 'തംബുരു ശ്രുതി ആരംഭിക്കുക' : 'Begin Tanpura Drone'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Tonic Selection & Volume */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-[#BDB4A4] mb-3">
              {lang === 'ml' ? 'ആധാര ഷഡ്ജം തിരഞ്ഞെടുക്കുക (Tonic Pitch)' : 'Select Adhara Shadjam (Tonic Pitch)'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TONIC_OPTIONS.map((tonic) => {
                const isSelected = selectedTonic.name === tonic.name;
                return (
                  <button
                    key={tonic.name}
                    onClick={() => handleTonicSelect(tonic)}
                    className={`py-2 px-2.5 rounded-lg text-center transition-all border ${
                      isSelected
                        ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD] font-semibold'
                        : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD] hover:border-[#3B392F]/80'
                    }`}
                  >
                    <div className="text-sm font-medium">{tonic.name}</div>
                    <div className="text-[10px] text-[#C7A45B] font-mono">{tonic.kattai}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-[#22221D] p-4 rounded-xl border border-[#3B392F]">
            <div className="flex items-center justify-between text-xs text-[#BDB4A4] mb-2 font-mono">
              <span className="flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'തംബുരു ശബ്ദം' : 'Tambura Volume'}</span>
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-[#C7A45B] cursor-pointer"
              aria-label="Adjust Tanpura volume"
            />
          </div>

          {/* Active Resonance Display */}
          <div className="bg-[#22221D]/60 p-4 rounded-xl border border-[#3B392F]/80 flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                isPlaying
                  ? 'border-[#C7A45B] bg-[#C7A45B]/10 animate-pulse text-[#C7A45B]'
                  : 'border-[#3B392F] text-[#BDB4A4]'
              }`}
            >
              <Music2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="text-[#F4EBDD] font-medium">
                {isPlaying ? (lang === 'ml' ? 'നാദം സജീവം: ' : 'Resonance Active: ') : (lang === 'ml' ? 'സ്റ്റാൻഡ്ബൈ: ' : 'Drone Standby: ')}
                <span className="text-[#C7A45B] font-mono">{selectedTonic.name}</span> ({selectedTonic.frequency.toFixed(2)} Hz)
              </div>
              <div className="text-[#BDB4A4] mt-0.5">
                {lang === 'ml' ? 'സ്വര ശ്രേണി: പ (196 Hz) · സ (261 Hz) · സ (262 Hz) · മന്ദ്ര സ (131 Hz)' : 'Harmonic sequence: Pa (196 Hz) · Sa (261 Hz) · Sa (262 Hz) · Low Sa (131 Hz)'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Just Intonation Swara Keyboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-semibold text-[#F4EBDD]">
                {lang === 'ml' ? 'സ്വര സ്ഥാനങ്ങൾ കേൾക്കാം' : 'Interactive Swara Auditioning'}
              </h3>
              <p className="text-xs text-[#BDB4A4]">
                {lang === 'ml'
                  ? `തിരഞ്ഞെടുത്ത സാ-യുമായുള്ള (${selectedTonic.name}) ശുദ്ധ ശ്രുതി അനുപാതം കേൾക്കാൻ അമർത്തുക:`
                  : `Click any note to hear its pure harmonic ratio relative to your active Sa (${selectedTonic.name}):`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {COMMON_SWARAS.map((swara) => {
              const isActive = activeSwara === swara.symbol;
              const calculatedHz = (selectedTonic.frequency * swara.ratio).toFixed(1);
              return (
                <button
                  key={swara.symbol}
                  onClick={() => handlePlaySwara(swara)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] scale-98 shadow-md'
                      : 'bg-[#22221D] border-[#3B392F] text-[#F4EBDD] hover:border-[#C7A45B]/70 hover:bg-[#2A2A24]'
                  }`}
                  aria-label={`Play ${swara.name} (${swara.symbol})`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold font-serif">{swara.symbol}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#11110F]/20 text-[#11110F]' : 'bg-[#191916] text-[#C7A45B]'
                      }`}
                    >
                      {swara.fraction}
                    </span>
                  </div>
                  <div
                    className={`text-xs truncate ${isActive ? 'text-[#11110F] font-semibold' : 'text-[#BDB4A4]'}`}
                  >
                    {swara.name}
                  </div>
                  <div
                    className={`text-[10px] font-mono mt-1 ${
                      isActive ? 'text-[#11110F]' : 'text-[#87947A]'
                    }`}
                  >
                    {calculatedHz} Hz
                  </div>
                </button>
              );
            })}
          </div>

          {/* Educational Note */}
          <div className="flex items-start space-x-2 text-xs text-[#BDB4A4] bg-[#22221D]/40 p-3 rounded-lg border border-[#3B392F]/60">
            <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
            <span>
              <strong>{lang === 'ml' ? 'സംഗീതശാസ്ത്ര തത്വം:' : 'Musicological Integrity Note:'}</strong>{' '}
              {lang === 'ml'
                ? 'കേവല ആവൃത്തി (pitch) മാത്രമല്ല സ്വരം. ആധാര ഷഡ്ജവുമായുള്ള ബന്ധം, രാഗ സഞ്ചാരം, ഗമകം എന്നിവ ചേരുമ്പോഴാണ് സ്വരഭാവം കൈവരുന്നത്.'
                : 'A detected pitch alone is not equivalent to a swara. Swara expression in Carnatic music arises from relation to the tonic (Adhara Shadjam), contextual raga sancharas, and microtonal gamakas.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
