'use client';

import React, { useState } from 'react';
import { Music, Layout, Sliders, Volume2, Sparkles } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { VERIFIED_RAGAS } from '../data/carnaticData';
import { RagaItem } from '../types/carnatic';
import { useLanguage } from '../context/LanguageContext';
import { RAGA_ML_NAMES } from '../lib/translations';

// 12 Semitones mapped to Carnatic 16 Swarasthanas
export interface SwarasthanaDef {
  semitone: number; // 0 to 12
  isBlack: boolean;
  westernRelative: string; // "C", "C#", "D", ...
  primaryCarnatic: string; // e.g. "Shadjam", "Shuddha Rishabham"
  symbol: string; // e.g. "S", "R₁", "G₃", ...
  swarasthanaVariants: string; // Carnatic alternate names
  ratio: number;
  fraction: string;
}

const SWARASTHANAS: SwarasthanaDef[] = [
  { semitone: 0, isBlack: false, westernRelative: 'C', primaryCarnatic: 'Shadjam', symbol: 'S', swarasthanaVariants: 'Sa', ratio: 1.0, fraction: '1/1' },
  { semitone: 1, isBlack: true, westernRelative: 'C#', primaryCarnatic: 'Shuddha Rishabham', symbol: 'R₁', swarasthanaVariants: 'Suddha Ri', ratio: 16 / 15, fraction: '16/15' },
  { semitone: 2, isBlack: false, westernRelative: 'D', primaryCarnatic: 'Chatushruti Rishabham', symbol: 'R₂', swarasthanaVariants: 'Chatusruti Ri / Suddha Ga (G₁)', ratio: 9 / 8, fraction: '9/8' },
  { semitone: 3, isBlack: true, westernRelative: 'D#', primaryCarnatic: 'Sadharana Gandharam', symbol: 'G₂', swarasthanaVariants: 'Sadharana Ga / Shatsruti Ri (R₃)', ratio: 6 / 5, fraction: '6/5' },
  { semitone: 4, isBlack: false, westernRelative: 'E', primaryCarnatic: 'Antara Gandharam', symbol: 'G₃', swarasthanaVariants: 'Antara Ga', ratio: 5 / 4, fraction: '5/4' },
  { semitone: 5, isBlack: false, westernRelative: 'F', primaryCarnatic: 'Shuddha Madhyamam', symbol: 'M₁', swarasthanaVariants: 'Suddha Ma', ratio: 4 / 3, fraction: '4/3' },
  { semitone: 6, isBlack: true, westernRelative: 'F#', primaryCarnatic: 'Prati Madhyamam', symbol: 'M₂', swarasthanaVariants: 'Prati Ma', ratio: 45 / 32, fraction: '45/32' },
  { semitone: 7, isBlack: false, westernRelative: 'G', primaryCarnatic: 'Panchamam', symbol: 'P', swarasthanaVariants: 'Pa', ratio: 3 / 2, fraction: '3/2' },
  { semitone: 8, isBlack: true, westernRelative: 'G#', primaryCarnatic: 'Shuddha Dhaivatam', symbol: 'D₁', swarasthanaVariants: 'Suddha Dha', ratio: 8 / 5, fraction: '8/5' },
  { semitone: 9, isBlack: false, westernRelative: 'A', primaryCarnatic: 'Chatushruti Dhaivatam', symbol: 'D₂', swarasthanaVariants: 'Chatusruti Dha / Suddha Ni (N₁)', ratio: 5 / 3, fraction: '5/3' },
  { semitone: 10, isBlack: true, westernRelative: 'A#', primaryCarnatic: 'Kaishiki Nishadam', symbol: 'N₂', swarasthanaVariants: 'Kaisiki Ni / Shatsruti Dha (D₃)', ratio: 9 / 5, fraction: '9/5' },
  { semitone: 11, isBlack: false, westernRelative: 'B', primaryCarnatic: 'Kakali Nishadam', symbol: 'N₃', swarasthanaVariants: 'Kakali Ni', ratio: 15 / 8, fraction: '15/8' },
  { semitone: 12, isBlack: false, westernRelative: 'C˙', primaryCarnatic: 'Tara Shadjam', symbol: 'Ṡ', swarasthanaVariants: 'Tara Sa', ratio: 2.0, fraction: '2/1' }
];

export const SwarasthanaVisualizer: React.FC = () => {
  const { lang } = useLanguage();
  const [selectedRaga, setSelectedRaga] = useState<RagaItem>(VERIFIED_RAGAS[0]);
  const [viewMode, setViewMode] = useState<'keyboard' | 'veena'>('keyboard');
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);

  // Set of swaras active in the selected raga
  const activeSymbols = React.useMemo(() => {
    const symbols = new Set<string>();
    selectedRaga.swaraDetails.forEach((s) => symbols.add(s.symbol));
    symbols.add('S');
    symbols.add('Ṡ');
    return symbols;
  }, [selectedRaga]);

  // Check if a swarasthana semitone matches the active raga
  const isSwaraInRaga = (def: SwarasthanaDef): boolean => {
    // Check direct symbol
    if (activeSymbols.has(def.symbol)) return true;
    // Also check alternate notation variants (e.g. if raga has G1 vs R2)
    const activeInRaga = selectedRaga.swaraDetails.some((sw) => {
      if (sw.symbol === def.symbol) return true;
      // Match by approximate ratio
      return Math.abs(sw.ratio - def.ratio) < 0.02;
    });
    return activeInRaga;
  };

  const getMatchedSwaraInRaga = (def: SwarasthanaDef) => {
    return selectedRaga.swaraDetails.find(
      (sw) => sw.symbol === def.symbol || Math.abs(sw.ratio - def.ratio) < 0.02
    );
  };

  const handlePlayKey = (def: SwarasthanaDef) => {
    setActiveNoteIndex(def.semitone);
    audioEngine.playSwaraNote(def.ratio, 1.0);
    setTimeout(() => {
      setActiveNoteIndex((current) => (current === def.semitone ? null : current));
    }, 450);
  };

  return (
    <section className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden border border-[#C7A45B]/30">
      {/* Subtle background illumination */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#3B392F] gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Music className="w-4 h-4" />
            <span>{lang === 'ml' ? 'സ്വരസ്ഥാന ദൃശ്യബോധം' : 'Swarasthana Visualizer'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml'
              ? 'കീബോർഡ് & വീണ സ്വരസ്ഥാന ദർപ്പണം'
              : 'Interactive Keyboard & Veena Swarasthana Map'}
          </h3>
          <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-xl">
            {lang === 'ml'
              ? 'കർണ്ണാടക സംഗീതത്തിലെ 16 സ്വരസ്ഥാനങ്ങൾ പാശ്ചാത്യ കീബോർഡിലോ സരസ്വതീ വീണാ മെട്ടുകളിലോ എങ്ങനെ ക്രമീകരിച്ചിരിക്കുന്നു എന്ന് മനസ്സിലാക്കുക.'
              : 'Translate Carnatic 16 Swarasthanas directly to piano keys and Saraswati Veena frets. Notes in the selected raga are illuminated in gold.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-[#191916] p-1 rounded-xl border border-[#3B392F] self-start md:self-auto">
          <button
            onClick={() => setViewMode('keyboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              viewMode === 'keyboard'
                ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'കീബോർഡ് (Piano)' : 'Piano Keyboard'}</span>
          </button>
          <button
            onClick={() => setViewMode('veena')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              viewMode === 'veena'
                ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                : 'text-[#BDB4A4] hover:text-[#F4EBDD]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'വീണ മെട്ടുകൾ (Veena)' : 'Veena Frets'}</span>
          </button>
        </div>
      </div>

      {/* Raga Selection Chips */}
      <div className="my-5">
        <label className="block text-xs uppercase font-mono text-[#BDB4A4] mb-2">
          {lang === 'ml' ? 'രാഗം തിരഞ്ഞെടുക്കുക:' : 'Select Raga to Highlight Notes:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {VERIFIED_RAGAS.map((r) => {
            const isSelected = selectedRaga.slug === r.slug;
            const mlName = RAGA_ML_NAMES[r.slug];
            return (
              <button
                key={r.slug}
                onClick={() => setSelectedRaga(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md scale-102'
                    : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F] hover:border-[#C7A45B]/40'
                }`}
              >
                <span>{lang === 'ml' && mlName ? mlName : r.canonicalName}</span>
                {r.melakartaNumber && (
                  <span className="ml-1 opacity-75 text-[10px]">#{r.melakartaNumber}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visualizer Display Box */}
      {viewMode === 'keyboard' ? (
        /* ================= Piano Keyboard View ================= */
        <div className="bg-[#141310] p-4 sm:p-6 rounded-2xl border border-[#3B392F]">
          <div className="flex items-center justify-between mb-3 text-xs text-[#BDB4A4] font-mono">
            <span>{lang === 'ml' ? 'ശബ്ദം കേൾക്കാൻ ഏതു കീയിലും തൊടുക' : 'Tap any key to audition note'}</span>
            <span className="text-[#C7A45B] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedRaga.canonicalName} ({selectedRaga.arohanam})</span>
            </span>
          </div>

          {/* Interactive Keyboard Layout */}
          <div className="relative h-44 sm:h-52 w-full max-w-4xl mx-auto flex select-none overflow-x-auto pb-2">
            {/* White Keys */}
            {SWARASTHANAS.filter((k) => !k.isBlack).map((def) => {
              const inRaga = isSwaraInRaga(def);
              const matched = getMatchedSwaraInRaga(def);
              const isPlaying = activeNoteIndex === def.semitone;
              const displaySymbol = matched ? matched.symbol : def.symbol;

              return (
                <button
                  key={def.semitone}
                  onClick={() => handlePlayKey(def)}
                  className={`flex-1 min-w-[42px] sm:min-w-[50px] h-full rounded-b-xl border relative flex flex-col justify-end pb-3 items-center transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#E8D7A8] border-[#FFFFFF] shadow-[0_0_25px_rgba(232,215,168,0.8)] scale-98 z-10'
                      : inRaga
                      ? 'bg-gradient-to-b from-[#2d281d] via-[#3a3221] to-[#4a3f28] border-[#C7A45B]/60 text-[#F4EBDD] hover:border-[#E0C98F] shadow-[0_0_15px_rgba(199,164,91,0.2)]'
                      : 'bg-[#1e1c18] border-[#2e2a22] text-[#6b6456] opacity-60 hover:opacity-90'
                  }`}
                  title={`${def.primaryCarnatic} (${def.westernRelative})`}
                >
                  <div className="text-center">
                    <div
                      className={`text-sm sm:text-base font-serif font-bold ${
                        inRaga ? 'text-[#E0C98F]' : 'text-[#888173]'
                      }`}
                    >
                      {displaySymbol}
                    </div>
                    <div className="text-[9px] font-mono opacity-80">{def.fraction}</div>
                    <div className="text-[8px] font-mono text-[#87947A] uppercase mt-0.5">
                      {def.westernRelative}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Black Keys Positioned Above White Keys */}
            <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 flex pointer-events-none">
              {/* Note C# (semitone 1) - sits between white 0 and 1 */}
              <div className="w-[12.5%] relative flex justify-end">
                <BlackKeyItem
                  def={SWARASTHANAS[1]}
                  isSwaraInRaga={isSwaraInRaga(SWARASTHANAS[1])}
                  matched={getMatchedSwaraInRaga(SWARASTHANAS[1])}
                  isPlaying={activeNoteIndex === 1}
                  onPlay={() => handlePlayKey(SWARASTHANAS[1])}
                />
              </div>

              {/* Note D# (semitone 3) */}
              <div className="w-[12.5%] relative flex justify-end">
                <BlackKeyItem
                  def={SWARASTHANAS[3]}
                  isSwaraInRaga={isSwaraInRaga(SWARASTHANAS[3])}
                  matched={getMatchedSwaraInRaga(SWARASTHANAS[3])}
                  isPlaying={activeNoteIndex === 3}
                  onPlay={() => handlePlayKey(SWARASTHANAS[3])}
                />
              </div>

              {/* Spacer for E-F (no black key) */}
              <div className="w-[12.5%]" />

              {/* Note F# (semitone 6) */}
              <div className="w-[12.5%] relative flex justify-end">
                <BlackKeyItem
                  def={SWARASTHANAS[6]}
                  isSwaraInRaga={isSwaraInRaga(SWARASTHANAS[6])}
                  matched={getMatchedSwaraInRaga(SWARASTHANAS[6])}
                  isPlaying={activeNoteIndex === 6}
                  onPlay={() => handlePlayKey(SWARASTHANAS[6])}
                />
              </div>

              {/* Note G# (semitone 8) */}
              <div className="w-[12.5%] relative flex justify-end">
                <BlackKeyItem
                  def={SWARASTHANAS[8]}
                  isSwaraInRaga={isSwaraInRaga(SWARASTHANAS[8])}
                  matched={getMatchedSwaraInRaga(SWARASTHANAS[8])}
                  isPlaying={activeNoteIndex === 8}
                  onPlay={() => handlePlayKey(SWARASTHANAS[8])}
                />
              </div>

              {/* Note A# (semitone 10) */}
              <div className="w-[12.5%] relative flex justify-end">
                <BlackKeyItem
                  def={SWARASTHANAS[10]}
                  isSwaraInRaga={isSwaraInRaga(SWARASTHANAS[10])}
                  matched={getMatchedSwaraInRaga(SWARASTHANAS[10])}
                  isPlaying={activeNoteIndex === 10}
                  onPlay={() => handlePlayKey(SWARASTHANAS[10])}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= Saraswati Veena Fretboard View ================= */
        <div className="bg-[#181511] p-4 sm:p-6 rounded-2xl border border-[#C7A45B]/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 text-xs text-[#BDB4A4] font-mono">
            <span>
              {lang === 'ml'
                ? 'സരസ്വതീ വീണാ മേളം (സാരണി തന്തിയിലെ മെട്ടുകൾ)'
                : 'Saraswati Veena Melam (Frets along Sarani Main Melody String)'}
            </span>
            <span className="text-[#C7A45B] font-bold">24 Melam System</span>
          </div>

          {/* Wooden Dandi and Brass Frets Graphic */}
          <div className="relative py-6 px-2 bg-gradient-to-r from-[#291b10] via-[#3d2919] to-[#291b10] rounded-xl border border-[#523821] shadow-inner overflow-x-auto">
            {/* The Tensioned Sarani Brass Melody String running across */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#d9be75] via-[#ffea9f] to-[#d9be75] shadow-[0_0_8px_rgba(255,234,159,0.8)] z-10 pointer-events-none" />

            <div className="flex items-center justify-between min-w-[700px] relative z-20">
              {SWARASTHANAS.map((def, idx) => {
                const inRaga = isSwaraInRaga(def);
                const matched = getMatchedSwaraInRaga(def);
                const isPlaying = activeNoteIndex === def.semitone;
                const displaySymbol = matched ? matched.symbol : def.symbol;

                return (
                  <div key={def.semitone} className="flex flex-col items-center flex-1">
                    {/* Swara label pill above fret */}
                    <div
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all mb-2 ${
                        inRaga
                          ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                          : 'text-[#6b5843] opacity-60'
                      }`}
                    >
                      {displaySymbol}
                    </div>

                    {/* Brass Veena Fret (Mettu) */}
                    <button
                      onClick={() => handlePlayKey(def)}
                      className={`w-4 sm:w-5 h-20 sm:h-24 rounded-sm border transition-all cursor-pointer flex items-center justify-center ${
                        isPlaying
                          ? 'bg-[#FFFFFF] border-[#C7A45B] shadow-[0_0_20px_#FFFFFF] scale-110'
                          : inRaga
                          ? 'bg-gradient-to-b from-[#e3c784] via-[#c7a45b] to-[#8a6b29] border-[#ffe8a8] shadow-[0_0_12px_rgba(199,164,91,0.5)]'
                          : 'bg-gradient-to-b from-[#4a392a] via-[#36271a] to-[#291b10] border-[#5e442d] opacity-50 hover:opacity-80'
                      }`}
                      title={`Fret #${idx}: ${def.primaryCarnatic} (${def.westernRelative})`}
                    >
                      <div className="w-0.5 h-full bg-[#11110F]/30" />
                    </button>

                    {/* Fret index & ratio beneath */}
                    <div className="mt-2 text-center">
                      <span className="text-[10px] font-mono text-[#E8D7A8] block">
                        {def.westernRelative}
                      </span>
                      <span className="text-[9px] font-mono text-[#87947A]">{def.fraction}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Swara Details Grid */}
      <div className="mt-5 pt-4 border-t border-[#3B392F]/60">
        <span className="text-xs uppercase font-mono text-[#BDB4A4] block mb-2">
          {lang === 'ml'
            ? `${selectedRaga.canonicalName} രാഗത്തിലെ സ്വരസ്ഥാന വിവരങ്ങൾ:`
            : `Swarasthanas in ${selectedRaga.canonicalName}:`}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {selectedRaga.swaraDetails.map((swara) => (
            <div
              key={swara.symbol}
              onClick={() => audioEngine.playSwaraNote(swara.ratio, 1.0)}
              className="p-2.5 bg-[#191916] hover:bg-[#22221D] rounded-xl border border-[#3B392F] hover:border-[#C7A45B] cursor-pointer transition-all active:scale-95 text-center group"
            >
              <div className="text-base font-serif font-bold text-[#E0C98F] group-hover:text-[#FFFFFF]">
                {swara.symbol}
              </div>
              <div className="text-[10px] font-medium text-[#F4EBDD] truncate mt-0.5">
                {swara.name}
              </div>
              <div className="text-[9px] font-mono text-[#87947A] mt-0.5">
                {swara.ratioFraction} · {swara.westernEquivalentNote}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface BlackKeyProps {
  def: SwarasthanaDef;
  isSwaraInRaga: boolean;
  matched: any;
  isPlaying: boolean;
  onPlay: () => void;
}

const BlackKeyItem: React.FC<BlackKeyProps> = ({
  def,
  isSwaraInRaga,
  matched,
  isPlaying,
  onPlay
}) => {
  const displaySymbol = matched ? matched.symbol : def.symbol;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onPlay();
      }}
      className={`pointer-events-auto w-7 sm:w-9 h-full rounded-b-lg border translate-x-1/2 z-20 flex flex-col justify-end pb-2 items-center transition-all cursor-pointer ${
        isPlaying
          ? 'bg-[#E8D7A8] border-[#FFFFFF] shadow-[0_0_20px_rgba(232,215,168,0.9)] scale-98'
          : isSwaraInRaga
          ? 'bg-gradient-to-b from-[#403722] via-[#2d2514] to-[#1a150a] border-[#C7A45B] shadow-[0_0_15px_rgba(199,164,91,0.4)]'
          : 'bg-[#0f0e0c] border-[#222019] opacity-75 hover:opacity-100'
      }`}
      title={`${def.primaryCarnatic} (${def.westernRelative})`}
    >
      <div className="text-center">
        <div
          className={`text-xs font-serif font-bold ${
            isSwaraInRaga ? 'text-[#E0C98F]' : 'text-[#888173]'
          }`}
        >
          {displaySymbol}
        </div>
        <div className="text-[8px] font-mono text-[#87947A]">{def.fraction}</div>
      </div>
    </button>
  );
};
