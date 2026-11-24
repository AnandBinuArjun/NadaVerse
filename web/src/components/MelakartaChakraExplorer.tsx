'use client';

import React, { useState } from 'react';
import {
  Compass,
  Volume2,
  Sparkles,
  Info,
  Search,
  ArrowLeftRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TonicNote } from '../lib/audioEngine';
import {
  MELAKARTA_72_LIST,
  CHAKRA_12_METADATA,
  Melakarta72Item
} from '../data/melakarta72Data';

interface MelakartaChakraExplorerProps {
  activeTonic: TonicNote;
  onAskTutor?: (topic: string) => void;
}

export const MelakartaChakraExplorer: React.FC<MelakartaChakraExplorerProps> = ({
  activeTonic,
  onAskTutor,
}) => {
  const { lang } = useLanguage();
  const [selectedChakra, setSelectedChakra] = useState<number | 'all'>('all');
  const [madhyamaFilter, setMadhyamaFilter] = useState<'all' | 'M1' | 'M2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMela, setSelectedMela] = useState<Melakarta72Item>(MELAKARTA_72_LIST[14]); // #15 Mayamalavagowla

  const filteredMelas = MELAKARTA_72_LIST.filter((m) => {
    if (selectedChakra !== 'all' && m.chakraNumber !== selectedChakra) return false;
    if (madhyamaFilter !== 'all' && m.madhyama !== madhyamaFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.chakraName.toLowerCase().includes(q) ||
        String(m.number) === q ||
        m.arohanam.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAuditionMelakarta = async (mela: Melakarta72Item, direction: 'arohana' | 'avarohana' | 'both' = 'both') => {
    await audioEngine.unlockAudio();
    audioEngine.setTonic(activeTonic.frequency);
    const asc = mela.ratios;
    const desc = [...mela.ratios].reverse();
    const seq = direction === 'arohana' ? asc : direction === 'avarohana' ? desc : [...asc, ...desc.slice(1)];
    audioEngine.playRagaScale(seq, 340);
  };

  const handleSwitchToCounterpart = (mela: Melakarta72Item) => {
    const found = MELAKARTA_72_LIST.find((item) => item.number === mela.counterpartNumber);
    if (found) setSelectedMela(found);
  };

  return (
    <div className="space-y-8">
      {/* Header & Musicological Disclaimer */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? '72 മേളകർത്താ രാഗ ചക്ര നാവിഗേറ്റർ'
                  : 'Complete 72 Melakarta & 12 Chakra Architecture'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'വെങ്കടമഖിയുടെ 72 മേളകർത്താ പദ്ധതിയും കടപയാദി സംഖ്യയും'
                : 'Venkatamakhin’s 72 Melakarta Scheme & Katapayadi Inspector'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-3xl">
              {lang === 'ml'
                ? 'ഇന്ദു മുതൽ ആദിത്യ വരെയുള്ള 12 ചക്രങ്ങളിലായി ക്രമീകരിച്ചിരിക്കുന്ന 36 ശുദ്ധമധ്യമ രാഗങ്ങളും 36 പ്രതിമധ്യമ രാഗങ്ങളും ജസ്റ്റ് ഇൻ്റോണേഷനിൽ കേട്ട് പഠിക്കാം.'
                : 'Explore all 72 Janaka parent scales across the 12 Chakras (36 Shuddha Madhyama + 36 Prati Madhyama) with pure Just Intonation auditioning and M₁/M₂ symmetry pairing.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-[#C7A45B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ml' ? 'മേളകർത്താ നമ്പർ / പേര് തിരയുക...' : 'Search # (1-72), Raga, or Chakra...'}
              className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
            />
          </div>
        </div>

        {/* Non-Negotiable Raga Identity Disclaimer (Required by Section 7) */}
        <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/25 flex items-start gap-3 text-xs text-[#BDB4A4]">
          <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#E0C98F] font-semibold">
              {lang === 'ml' ? 'സംഗീത ശാസ്ത്ര തത്വം (സ്വരക്രമം ≠ രാഗസ്വരൂപം): ' : 'Musicological Principle (Scale ≠ Raga Swarupa): '}
            </strong>
            {lang === 'ml'
              ? 'മേളകർത്താ പട്ടിക 72 ജനക രാഗങ്ങളുടെ സ്വരസ്ഥാന ഘടനയെ (ആരോഹണ-അവരോഹണം) ഗണിതശാസ്ത്രപരമായി നിർവ്വചിക്കുന്നു. എന്നാൽ ഒരു രാഗത്തിന്റെ ജീവൻ അതിന്റെ ഗമകങ്ങളിലും വിശേഷ പ്രയോഗങ്ങളിലും അധിഷ്ഠിതമാണ്.'
              : 'The 72 Melakarta matrix defines the mathematical Janaka swarasthana permutations codified in Chaturdandi Prakasika (c. 1620 CE). Living raga identity transcends ascending and descending scales and resides in gamaka, prayoga, Kakus, and sampradaya.'}
          </div>
        </div>

        {/* 12 Chakra Selector Wheel / Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-[#C7A45B]">
              {lang === 'ml' ? '12 ചക്രങ്ങൾ തിരഞ്ഞെടുക്കുക:' : 'Filter by 12 Chakras (6 Melakartas per Chakra):'}
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', labelEn: 'All 72', labelMl: 'എല്ലാം (72)' },
                { id: 'M1', labelEn: 'Shuddha Ma (1–36)', labelMl: 'ശുദ്ധ മധ്യമം (1–36)' },
                { id: 'M2', labelEn: 'Prati Ma (37–72)', labelMl: 'പ്രതി മധ്യമം (37–72)' },
              ].map((mf) => (
                <button
                  key={mf.id}
                  onClick={() => setMadhyamaFilter(mf.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer ${
                    madhyamaFilter === mf.id
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {lang === 'ml' ? mf.labelMl : mf.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2">
            <button
              onClick={() => setSelectedChakra('all')}
              className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                selectedChakra === 'all'
                  ? 'bg-[#C7A45B] text-[#11110F] border-[#C7A45B] font-bold'
                  : 'bg-[#22221D] text-[#F4EBDD] border-[#3B392F] hover:border-[#C7A45B]/50'
              }`}
            >
              <div>{lang === 'ml' ? 'എല്ലാ ചക്രങ്ങളും' : 'All 12 Chakras'}</div>
              <div className="text-[10px] opacity-80">Melakartas 1–72</div>
            </button>
            {CHAKRA_12_METADATA.map((c) => {
              const active = selectedChakra === c.number;
              const startMela = (c.number - 1) * 6 + 1;
              const endMela = c.number * 6;
              return (
                <button
                  key={c.number}
                  onClick={() => setSelectedChakra(c.number)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                    active
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#C7A45B] font-bold'
                      : 'bg-[#22221D] text-[#F4EBDD] border-[#3B392F] hover:border-[#C7A45B]/50'
                  }`}
                >
                  <div className="font-bold">
                    {c.number}. {c.name}
                  </div>
                  <div className="text-[10px] opacity-80">
                    #{startMela}–{endMela} ({c.purvaSwaras})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Melakarta Spotlight & 72 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Selected Melakarta Deep Inspector */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/40 p-5 sm:p-7 space-y-5 shadow-xl self-start">
          <div className="flex items-start justify-between gap-2 pb-4 border-b border-[#3B392F]">
            <div>
              <span className="text-xs font-mono text-[#C7A45B] uppercase">
                Melakarta #{selectedMela.number} • Chakra {selectedMela.chakraNumber} ({selectedMela.chakraName})
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#F4EBDD] mt-0.5">{selectedMela.name}</h3>
              <span className="text-xs font-mono text-[#87947A]">{selectedMela.chakraMeaning}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#C7A45B]/20 border border-[#C7A45B]/40 text-xs font-mono font-bold text-[#E0C98F]">
              {selectedMela.madhyama}
            </span>
          </div>

          <div className="space-y-2.5 bg-[#14130f] p-4 rounded-2xl border border-[#3B392F] font-mono text-xs">
            <div>
              <span className="text-[#BDB4A4] block text-[10px] uppercase">Arohanam (Ascending):</span>
              <strong className="text-[#E0C98F] text-sm">{selectedMela.arohanam}</strong>
            </div>
            <div>
              <span className="text-[#BDB4A4] block text-[10px] uppercase">Avarohanam (Descending):</span>
              <strong className="text-[#F4EBDD] text-sm">{selectedMela.avarohanam}</strong>
            </div>
          </div>

          {/* Swarasthana Permutations Breakdown */}
          <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs">
            {[
              { label: 'Ri', val: selectedMela.ri },
              { label: 'Ga', val: selectedMela.ga },
              { label: 'Ma', val: selectedMela.madhyama },
              { label: 'Dha', val: selectedMela.dha },
              { label: 'Ni', val: selectedMela.ni },
            ].map((sw) => (
              <div key={sw.label} className="p-2.5 rounded-xl bg-[#22221D] border border-[#3B392F]">
                <div className="text-[10px] text-[#BDB4A4]">{sw.label}</div>
                <div className="text-sm font-bold text-[#E0C98F]">{sw.val}</div>
              </div>
            ))}
          </div>

          {/* Audition Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAuditionMelakarta(selectedMela, 'both')}
              className="flex-1 py-3 px-4 rounded-xl nv-gold-btn text-[#11110F] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {lang === 'ml'
                  ? `ആരോഹണ-അവരോഹണം കേൾക്കുക (${activeTonic.name})`
                  : `Audition Full Scale (${activeTonic.name})`}
              </span>
            </button>
          </div>

          {/* Shuddha / Prati Madhyama Counterpart Symmetry Card */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#C7A45B]/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#C7A45B]">
                {selectedMela.madhyama === 'M1'
                  ? 'Prati Madhyama (M₂) Counterpart (+36)'
                  : 'Shuddha Madhyama (M₁) Counterpart (-36)'}
              </span>
              <div className="text-sm font-serif font-bold text-[#F4EBDD]">
                #{selectedMela.counterpartNumber} {selectedMela.counterpartName}
              </div>
            </div>
            <button
              onClick={() => handleSwitchToCounterpart(selectedMela)}
              className="px-3 py-2 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'മാറ്റുക' : 'Inspect Pair'}</span>
            </button>
          </div>

          {onAskTutor && (
            <button
              onClick={() =>
                onAskTutor(`Melakarta #${selectedMela.number} ${selectedMela.name} lakshana and janya ragas`)
              }
              className="w-full py-2.5 rounded-xl bg-[#22221D] hover:bg-[#2a2820] border border-[#3B392F] text-xs font-mono text-[#E0C98F] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? `${selectedMela.name} രാഗത്തെക്കുറിച്ച് ഗുരുവിനോട് ചോദിക്കുക`
                  : `Ask AI Tutor about #${selectedMela.number} ${selectedMela.name}`}
              </span>
            </button>
          )}
        </div>

        {/* Right 7 Cols: Interactive 72 Melakarta Matrix Grid */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#BDB4A4]">
            <span>
              {lang === 'ml'
                ? `${filteredMelas.length} മേളകർത്താ രാഗങ്ങൾ കാണിക്കുന്നു`
                : `Showing ${filteredMelas.length} of 72 Melakarta Parent Ragas`}
            </span>
            <span className="text-[#C7A45B]">Katapayadi Verified • Chaturdandi Prakasika</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[540px] overflow-y-auto pr-1">
            {filteredMelas.map((mela) => {
              const isSelected = selectedMela.number === mela.number;
              return (
                <div
                  key={mela.number}
                  onClick={() => setSelectedMela(mela)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#C7A45B]/20 border-[#C7A45B] shadow-md'
                      : 'bg-[#22221D] border-[#3B392F] hover:border-[#C7A45B]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#C7A45B]">
                      <span>
                        #{mela.number} • {mela.chakraName} ({mela.chakraNumber}.{mela.positionInChakra})
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-black/30 text-[#E0C98F]">{mela.madhyama}</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-[#F4EBDD] mt-0.5">{mela.name}</div>
                    <div className="text-[11px] font-mono text-[#BDB4A4] mt-1 truncate">{mela.arohanam}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#3B392F]/60">
                    <span className="text-[10px] font-mono text-[#87947A]">
                      Pair: #{mela.counterpartNumber}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMela(mela);
                        handleAuditionMelakarta(mela, 'arohana');
                      }}
                      className="px-2 py-1 rounded-lg bg-[#14130f] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
