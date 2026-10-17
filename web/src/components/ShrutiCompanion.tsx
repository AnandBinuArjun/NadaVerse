'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Info, Music2, SlidersHorizontal } from 'lucide-react';
import { audioEngine, TONIC_OPTIONS, TonicNote, ShrutiTuning } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { practiceShortcuts } from '../lib/practiceShortcuts';

interface SwaraButton {
  symbol: string;
  name: string;
  nameMl: string;
  ratio: number;
  fraction: string;
  description: string;
}

const COMMON_SWARAS: SwaraButton[] = [
  { symbol: 'S', name: 'Shadjam', nameMl: 'ഷഡ്ജം', ratio: 1.0, fraction: '1/1', description: 'Adhara Shadjam (Tonic foundation)' },
  { symbol: 'R₁', name: 'Shuddha Rishabham', nameMl: 'ശുദ്ധ ഋഷഭം', ratio: 16 / 15, fraction: '16/15', description: 'Used in Mayamalavagowla, Saveri' },
  { symbol: 'R₂', name: 'Chatushruti Rishabham', nameMl: 'ചതുശ്രുതി ഋഷഭം', ratio: 9 / 8, fraction: '9/8', description: 'Used in Shankarabharanam, Kalyani' },
  { symbol: 'G₂', name: 'Sadharana Gandharam', nameMl: 'സാധാരണ ഗാന്ധാരം', ratio: 6 / 5, fraction: '6/5', description: 'Minor third (Kharaharapriya, Thodi)' },
  { symbol: 'G₃', name: 'Antara Gandharam', nameMl: 'അന്തര ഗാന്ധാരം', ratio: 5 / 4, fraction: '5/4', description: 'Major third (Mayamalavagowla, Kalyani)' },
  { symbol: 'M₁', name: 'Shuddha Madhyamam', nameMl: 'ശുദ്ധ മധ്യമം', ratio: 4 / 3, fraction: '4/3', description: 'Natural fourth (Shankarabharanam)' },
  { symbol: 'M₂', name: 'Prati Madhyamam', nameMl: 'പ്രതി മധ്യമം', ratio: 45 / 32, fraction: '45/32', description: 'Sharp fourth (Kalyani, Pantuvarali)' },
  { symbol: 'P', name: 'Panchamam', nameMl: 'പഞ്ചമം', ratio: 3 / 2, fraction: '3/2', description: 'Invariable fifth (Achala swara)' },
  { symbol: 'D₁', name: 'Shuddha Dhaivatam', nameMl: 'ശുദ്ധ ധൈവതം', ratio: 8 / 5, fraction: '8/5', description: 'Minor sixth (Mayamalavagowla)' },
  { symbol: 'D₂', name: 'Chatushruti Dhaivatam', nameMl: 'ചതുശ്രുതി ധൈവതം', ratio: 27 / 16, fraction: '27/16', description: 'Major sixth (Shankarabharanam)' },
  { symbol: 'N₂', name: 'Kaisiki Nishadam', nameMl: 'കൈശികി നിഷാദം', ratio: 9 / 5, fraction: '9/5', description: 'Minor seventh (Kharaharapriya)' },
  { symbol: 'N₃', name: 'Kakali Nishadam', nameMl: 'കാകലി നിഷാദം', ratio: 15 / 8, fraction: '15/8', description: 'Leading tone (Shankarabharanam, Kalyani)' },
  { symbol: 'Ṡ', name: 'Tara Shadjam', nameMl: 'താര ഷഡ്ജം', ratio: 2.0, fraction: '2/1', description: 'Higher octave tonic' }
];

export const ShrutiCompanion: React.FC = () => {
  const { lang } = useLanguage();
  const [selectedTonic, setSelectedTonic] = useState<TonicNote>(TONIC_OPTIONS[0]);
  const [shrutiTuning, setShrutiTuning] = useState<ShrutiTuning>('pa');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);

  const togglePlayback = React.useCallback(async () => {
    if (isPlaying) {
      audioEngine.stopTanpura();
      setIsPlaying(false);
    } else {
      await audioEngine.unlockAudio();
      await audioEngine.startTanpura(selectedTonic.frequency, volume, shrutiTuning);
      setIsPlaying(true);
    }
  }, [isPlaying, selectedTonic.frequency, volume, shrutiTuning]);

  useEffect(() => {
    const unsub = practiceShortcuts.subscribe('toggle_tanpura', () => {
      togglePlayback();
    });
    return unsub;
  }, [togglePlayback]);

  const handleTonicSelect = (note: TonicNote) => {
    setSelectedTonic(note);
    if (isPlaying) {
      audioEngine.startTanpura(note.frequency, volume, shrutiTuning);
    }
  };

  const handleTuningSelect = (tuning: ShrutiTuning) => {
    setShrutiTuning(tuning);
    audioEngine.setShrutiTuning(tuning);
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
    <section className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(199,164,91,0.08)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 sm:pb-6 border-b border-[#C7A45B]/20 gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Music2 className="w-4 h-4" />
            <span>{lang === 'ml' ? 'അടിസ്ഥാന ശ്രുതി സഹായി' : 'Foundational Companion'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'ശ്രുതി & തംബുരു എഞ്ചിൻ' : 'Shruti & Tanpura Engine'}
          </h2>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-xl leading-relaxed">
            {lang === 'ml'
              ? 'സ്വാഭാവിക ജീവാരി നാദത്തോടുകൂടിയ 4-തന്ത്രി തംബുരു (പ-സ-സ-സ), ശുദ്ധ ജസ്റ്റ് ഇൻ്റോണേഷൻ അനുപാതങ്ങൾ.'
              : 'Acoustically modeled 4-string Tambura with natural Jivari overtone resonance (Pa-Sa-Sa-Sa) and pure Just Intonation harmonic ratios.'}
          </p>
        </div>

        {/* Master Play Button with Aura */}
        <div className="flex items-center w-full sm:w-auto">
          <button
            onClick={togglePlayback}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg active:scale-95 cursor-pointer min-h-[46px] ${
              isPlaying
                ? 'bg-gradient-to-r from-[#E8D7A8] via-[#C7A45B] to-[#DFB960] text-[#11110F] shadow-[0_0_30px_rgba(199,164,91,0.6)] animate-pulse'
                : 'nv-gold-btn'
            }`}
            aria-label={isPlaying ? 'Pause Tanpura Drone' : 'Start Tanpura Drone'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>{lang === 'ml' ? 'ശ്രുതി നിർത്തുക' : 'Pause Drone'}</span>
                <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/30 rounded border border-black/20">S</kbd>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{lang === 'ml' ? 'തംബുരു ശ്രുതി ആരംഭിക്കുക' : 'Begin Tanpura Drone'}</span>
                <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-[#11110F]/20 rounded border border-[#11110F]/30">S</kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-5 sm:pt-6">
        {/* Left Column: Tonic Selection & Volume */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Shruti Tuning Mode: Pa / Ma / Ni */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-mono text-[#BDB4A4] flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>{lang === 'ml' ? 'തംബുരു ശ്രുതി ക്രമം (Tuning Mode)' : 'Tambura String Tuning'}</span>
              </label>
              <span className="text-[11px] font-mono text-[#C7A45B]">
                {shrutiTuning === 'pa' ? 'P - S - S - S' : shrutiTuning === 'ma' ? 'M₁ - S - S - S' : 'N₃ - S - S - S'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleTuningSelect('pa')}
                className={`py-2 px-2 rounded-xl border text-center transition-all min-h-[44px] ${
                  shrutiTuning === 'pa'
                    ? 'bg-[#C7A45B]/25 border-[#C7A45B] text-[#F4EBDD] font-bold shadow-md'
                    : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
                }`}
              >
                <div className="text-xs font-semibold">Pa Shruti</div>
                <div className="text-[9px] text-[#C7A45B] font-mono truncate">Standard (Panchama)</div>
              </button>
              <button
                onClick={() => handleTuningSelect('ma')}
                className={`py-2 px-2 rounded-xl border text-center transition-all min-h-[44px] ${
                  shrutiTuning === 'ma'
                    ? 'bg-[#C7A45B]/25 border-[#C7A45B] text-[#F4EBDD] font-bold shadow-md'
                    : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
                }`}
              >
                <div className="text-xs font-semibold">Ma Shruti</div>
                <div className="text-[9px] text-[#C7A45B] font-mono truncate">Hindolam, Kamas</div>
              </button>
              <button
                onClick={() => handleTuningSelect('ni')}
                className={`py-2 px-2 rounded-xl border text-center transition-all min-h-[44px] ${
                  shrutiTuning === 'ni'
                    ? 'bg-[#C7A45B]/25 border-[#C7A45B] text-[#F4EBDD] font-bold shadow-md'
                    : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
                }`}
              >
                <div className="text-xs font-semibold">Ni Shruti</div>
                <div className="text-[9px] text-[#C7A45B] font-mono truncate">Bhoopalam, Varali</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-[#BDB4A4] mb-2.5 sm:mb-3">
              {lang === 'ml' ? 'ആധാര ഷഡ്ജം തിരഞ്ഞെടുക്കുക (Tonic Pitch)' : 'Select Adhara Shadjam (Tonic Pitch)'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {TONIC_OPTIONS.map((tonic) => {
                const isSelected = selectedTonic.name === tonic.name;
                return (
                  <button
                    key={tonic.name}
                    onClick={() => handleTonicSelect(tonic)}
                    className={`py-2 px-1.5 sm:px-2.5 rounded-lg text-center transition-all border min-h-[44px] flex flex-col justify-center items-center ${
                      isSelected
                        ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD] font-semibold'
                        : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD] hover:border-[#3B392F]/80'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-medium">{tonic.name}</div>
                    <div className="text-[10px] text-[#C7A45B] font-mono">{tonic.kattai}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-[#22221D] p-3.5 sm:p-4 rounded-xl border border-[#3B392F]">
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

          {/* Active Resonance Display with Musical Soundwave Visualizer */}
          <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
            isPlaying
              ? 'bg-gradient-to-r from-[#1f1d17] to-[#171612] border-[#C7A45B]/50 shadow-[0_0_25px_rgba(199,164,91,0.15)]'
              : 'bg-[#181714]/60 border-[#3B392F]/60'
          }`}>
            <div className="flex items-center space-x-3 shrink-0">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-all duration-300 shrink-0 ${
                  isPlaying
                    ? 'border-[#C7A45B] bg-[#C7A45B]/20 text-[#E0C98F] shadow-[0_0_15px_rgba(199,164,91,0.3)] animate-pulse'
                    : 'border-[#3B392F] bg-[#1a1915] text-[#BDB4A4]'
                }`}
              >
                <Music2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs">
                <div className="text-[#F4EBDD] font-medium">
                  {isPlaying ? (lang === 'ml' ? 'നാദം സജീവം: ' : 'Resonance Active: ') : (lang === 'ml' ? 'സ്റ്റാൻഡ്ബൈ: ' : 'Drone Standby: ')}
                  <span className="text-[#C7A45B] font-mono font-bold">{selectedTonic.name}</span> ({selectedTonic.frequency.toFixed(1)} Hz)
                </div>
                <div className="text-[#BDB4A4] text-[10px] sm:text-[11px] mt-0.5 font-mono">
                  {lang === 'ml' ? 'പ · സ · സ · മന്ദ്ര സ' : 'Pa · Sa · Sa · Low Sa'}
                </div>
              </div>
            </div>

            {isPlaying && (
              <div className="flex items-center space-x-1 h-5 sm:h-6 pr-1 shrink-0">
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Just Intonation Swara Keyboard */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-[#F4EBDD]">
                {lang === 'ml' ? 'സ്വര സ്ഥാനങ്ങൾ കേൾക്കാം' : 'Interactive Swara Auditioning'}
              </h3>
              <p className="text-xs text-[#BDB4A4] leading-relaxed">
                {lang === 'ml'
                  ? `തിരഞ്ഞെടുത്ത സാ-യുമായുള്ള (${selectedTonic.name}) ശുദ്ധ ശ്രുതി അനുപാതം കേൾക്കാൻ അമർത്തുക:`
                  : `Click any note to hear its pure harmonic ratio relative to your active Sa (${selectedTonic.name}):`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {COMMON_SWARAS.map((swara) => {
              const isActive = activeSwara === swara.symbol;
              const calculatedHz = (selectedTonic.frequency * swara.ratio).toFixed(1);
              return (
                <button
                  key={swara.symbol}
                  onClick={() => handlePlaySwara(swara)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-h-[64px] active:scale-95 ${
                    isActive
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] scale-98 shadow-md'
                      : 'bg-[#22221D] border-[#3B392F] text-[#F4EBDD] hover:border-[#C7A45B]/70 hover:bg-[#2A2A24]'
                  }`}
                  aria-label={`Play ${swara.name} (${swara.symbol})`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm sm:text-base font-bold font-serif">{swara.symbol}</span>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#11110F]/20 text-[#11110F]' : 'bg-[#191916] text-[#C7A45B]'
                      }`}
                    >
                      {swara.fraction}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] sm:text-xs truncate ${isActive ? 'text-[#11110F] font-semibold' : 'text-[#BDB4A4]'}`}
                  >
                    {lang === 'ml' && swara.nameMl ? swara.nameMl : swara.name}
                  </div>
                  <div
                    className={`text-[9px] sm:text-[10px] font-mono mt-0.5 sm:mt-1 ${
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
          <div className="flex items-start space-x-2 text-xs text-[#BDB4A4] bg-[#22221D]/40 p-3 sm:p-3.5 rounded-xl border border-[#3B392F]/60">
            <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
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
