'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Download,
  Hand,
  Calculator,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine } from '../lib/audioEngine';

type JatiType = 'tisra' | 'chatusra' | 'khanda' | 'misra' | 'sankirna';

interface SaptaTalaFamily {
  id: string;
  nameEn: string;
  nameMl: string;
  angaPattern: ('L' | 'D' | 'A')[]; // Laghu (I), Dhrutam (O), Anudhrutam (U)
  symbolString: string;
}

const SAPTA_TALA_FAMILIES: SaptaTalaFamily[] = [
  { id: 'dhruva', nameEn: 'Dhruva Tala', nameMl: 'ധ്രുവ താളം', angaPattern: ['L', 'D', 'L', 'L'], symbolString: 'I O I I' },
  { id: 'matya', nameEn: 'Matya Tala', nameMl: 'മഠ്യ താളം', angaPattern: ['L', 'D', 'L'], symbolString: 'I O I' },
  { id: 'rupaka', nameEn: 'Rupaka Tala', nameMl: 'രൂപക താളം', angaPattern: ['D', 'L'], symbolString: 'O I' },
  { id: 'jhampa', nameEn: 'Jhampa Tala', nameMl: 'ഝമ്പ താളം', angaPattern: ['L', 'A', 'D'], symbolString: 'I U O' },
  { id: 'triputa', nameEn: 'Triputa Tala (Adi in Chatusra)', nameMl: 'ത്രിപുട താളം', angaPattern: ['L', 'D', 'D'], symbolString: 'I O O' },
  { id: 'ata', nameEn: 'Ata Tala', nameMl: 'അട താളം', angaPattern: ['L', 'L', 'D', 'D'], symbolString: 'I I O O' },
  { id: 'eka', nameEn: 'Eka Tala', nameMl: 'ഏക താളം', angaPattern: ['L'], symbolString: 'I' },
];

const JATI_COUNTS: Record<JatiType, { count: number; nameEn: string; nameMl: string; solkattu: string[] }> = {
  tisra: { count: 3, nameEn: 'Tisra (3)', nameMl: 'തിസ്രം (3)', solkattu: ['Tha', 'Ki', 'Ta'] },
  chatusra: { count: 4, nameEn: 'Chatusra (4)', nameMl: 'ചതുസ്രം (4)', solkattu: ['Tha', 'Ka', 'Dhi', 'Mi'] },
  khanda: { count: 5, nameEn: 'Khanda (5)', nameMl: 'ഖണ്ഡം (5)', solkattu: ['Tha', 'Dhi', 'Gi', 'Na', 'Thom'] },
  misra: { count: 7, nameEn: 'Misra (7)', nameMl: 'മിശ്രം (7)', solkattu: ['Tha', 'Ki', 'Ta', 'Tha', 'Ka', 'Dhi', 'Mi'] },
  sankirna: { count: 9, nameEn: 'Sankirna (9)', nameMl: 'സങ്കീർണ്ണം (9)', solkattu: ['Tha', 'Ka', 'Dhi', 'Mi', 'Tha', 'Dhi', 'Gi', 'Na', 'Thom'] },
};

export const KonnakolAcademy: React.FC = () => {
  const { lang } = useLanguage();
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('triputa');
  const [selectedJati, setSelectedJati] = useState<JatiType>('chatusra');
  const [selectedNadai, setSelectedNadai] = useState<JatiType>('chatusra');
  const [bpm, setBpm] = useState<number>(72);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeBeat, setActiveBeat] = useState<number>(0);

  // Korvai & Mora Arithmetic Builder State
  const [purvangamMatras, setPurvangamMatras] = useState<number>(17);
  const [uttarangamPhraseMatras, setUttarangamPhraseMatras] = useState<number>(5);
  const [moraGapMatras, setMoraGapMatras] = useState<number>(0);
  const [eduppuOffsetMatras, setEduppuOffsetMatras] = useState<number>(0);

  // Tap-to-Beat Latency Calibration State
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [measuredTapBpm, setMeasuredTapBpm] = useState<number | null>(null);
  const [tapJitterMs, setTapJitterMs] = useState<number | null>(null);

  const activeFamily = SAPTA_TALA_FAMILIES.find((f) => f.id === selectedFamilyId) || SAPTA_TALA_FAMILIES[4];
  const laghuCount = JATI_COUNTS[selectedJati].count;

  // Calculate exact Akshara & Kriya breakdown for the selected Suladi Sapta Tala
  const kriyaBeats: { beatNumber: number; angaLabel: string; kriyaGesture: string; isAccent: boolean; syllable: string }[] = [];
  let beatCounter = 1;
  activeFamily.angaPattern.forEach((anga) => {
    if (anga === 'L') {
      for (let i = 0; i < laghuCount; i++) {
        kriyaBeats.push({
          beatNumber: beatCounter++,
          angaLabel: `Laghu (${laghuCount})`,
          kriyaGesture: i === 0 ? 'Thattu (Clap)' : `Finger ${i}`,
          isAccent: i === 0,
          syllable: i === 0 ? 'thom' : 'tha',
        });
      }
    } else if (anga === 'D') {
      kriyaBeats.push({
        beatNumber: beatCounter++,
        angaLabel: 'Dhrutam (2)',
        kriyaGesture: 'Thattu (Clap)',
        isAccent: true,
        syllable: 'tha',
      });
      kriyaBeats.push({
        beatNumber: beatCounter++,
        angaLabel: 'Dhrutam (2)',
        kriyaGesture: 'Veechu (Wave)',
        isAccent: false,
        syllable: 'dhi',
      });
    } else if (anga === 'A') {
      kriyaBeats.push({
        beatNumber: beatCounter++,
        angaLabel: 'Anudhrutam (1)',
        kriyaGesture: 'Thattu (Clap)',
        isAccent: true,
        syllable: 'thom',
      });
    }
  });

  const totalAksharas = kriyaBeats.length;
  const nadaiSubdivision = JATI_COUNTS[selectedNadai].count;
  const matrasPerAvartanam = totalAksharas * nadaiSubdivision;

  // Korvai Arithmetic Calculation
  const uttarangamTotalMatras = 3 * uttarangamPhraseMatras + 2 * moraGapMatras;
  const totalKorvaiMatras = purvangamMatras + uttarangamTotalMatras;
  const effectiveMatras = totalKorvaiMatras - eduppuOffsetMatras;
  const remainderMatras = ((effectiveMatras % matrasPerAvartanam) + matrasPerAvartanam) % matrasPerAvartanam;
  const isKorvaiAligned = remainderMatras === 0 && effectiveMatras > 0;
  const avartanamsSpanned = (effectiveMatras / matrasPerAvartanam).toFixed(2);
  const adjustmentNeeded = isKorvaiAligned ? 0 : matrasPerAvartanam - remainderMatras;

  const handleTogglePlay = async () => {
    if (isPlaying) {
      audioEngine.stopTala();
      setIsPlaying(false);
      return;
    }
    await audioEngine.unlockAudio();
    audioEngine.setSolkattuMode(true);
    audioEngine.setNadai(selectedNadai);
    audioEngine.setNadaiLoopsEnabled(true);
    setIsPlaying(true);

    await audioEngine.startTala(
      bpm,
      totalAksharas,
      kriyaBeats.map((kb) => ({ isAccent: kb.isAccent, syllable: kb.syllable })),
      (beatIdx) => {
        setActiveBeat(beatIdx);
      }
    );
  };

  useEffect(() => {
    return () => {
      audioEngine.stopTala();
    };
  }, []);

  const handleTapTempoAndLatency = () => {
    const now = performance.now();
    const recent = [...tapTimestamps.filter((t) => now - t < 4000), now];
    setTapTimestamps(recent);
    if (recent.length >= 3) {
      const intervals: number[] = [];
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i] - recent[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calcBpm = Math.round(60000 / avgMs);
      const meanDev =
        intervals.reduce((acc, cur) => acc + Math.abs(cur - avgMs), 0) / intervals.length;
      setMeasuredTapBpm(Math.max(30, Math.min(240, calcBpm)));
      setTapJitterMs(Math.round(meanDev * 10) / 10);
    }
  };

  const handleExportPatternJson = () => {
    const patternObj = {
      schema: 'nadaverse-konnakol-pattern-v1',
      talaFamily: activeFamily.id,
      jati: selectedJati,
      nadai: selectedNadai,
      totalAksharas,
      matrasPerAvartanam,
      bpm,
      korvai: {
        purvangamMatras,
        uttarangamPhraseMatras,
        moraGapMatras,
        eduppuOffsetMatras,
        totalKorvaiMatras,
        isKorvaiAligned,
      },
    };
    const blob = new Blob([JSON.stringify(patternObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nadaverse-korvai-${activeFamily.id}-${selectedJati}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? '35 സുലാദി സപ്ത താളങ്ങളും കൊന്നക്കോൽ കളരിയും' : 'Advanced Tala & Konnakol Academy'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? '35 സുലാദി സപ്ത താളങ്ങൾ, 5 നടകൾ & കോർവൈ ഗണിതം'
                : '35 Suladi Sapta Talas, 5-Nadai Engine & Korvai Arithmetic Studio'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-3xl">
              {lang === 'ml'
                ? '7 താള കുടുംബങ്ങളും 5 ജാതികളും ചേർന്ന 35 താളങ്ങളും, തിസ്ര-ചതുസ്ര-ഖണ്ഡ-മിശ്ര-സങ്കീർണ്ണ നടകളും, കോർവൈ കണക്കുകളും പരിശീലിക്കാം.'
                : 'Master all 35 Suladi Sapta Talas (7 families × 5 jatis), switch across all 5 Nadais (3, 4, 5, 7, 9 matras/akshara), and validate Korvai/Mora resolutions to Samam or Eduppu.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTogglePlay}
              className={`px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-all ${
                isPlaying
                  ? 'bg-[#E17D73] text-[#11110F]'
                  : 'nv-gold-btn text-[#11110F]'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>
                {isPlaying
                  ? lang === 'ml'
                    ? 'താളം നിർത്തുക'
                    : 'Stop Solkattu Cycle'
                  : lang === 'ml'
                  ? 'സൊൽകട്ട് കേൾക്കുക'
                  : 'Start 5-Nadai Solkattu'}
              </span>
            </button>

            <button
              onClick={handleExportPatternJson}
              className="px-4 py-3.5 rounded-2xl bg-[#22221D] hover:bg-[#2a2820] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'JSON എക്സ്പോർട്ട്' : 'Export JSON'}</span>
            </button>
          </div>
        </div>

        {/* 7 Tala Families × 5 Jatis × 5 Nadais Selector Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#3B392F]">
          {/* 1. Sapta Tala Family */}
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2">
            <label className="block text-[11px] font-mono uppercase text-[#C7A45B]">
              1. {lang === 'ml' ? 'സപ്ത താള കുടുംബം (7 Families):' : 'Suladi Sapta Tala Family (7):'}
            </label>
            <select
              value={selectedFamilyId}
              onChange={(e) => {
                setSelectedFamilyId(e.target.value);
                if (isPlaying) {
                  audioEngine.stopTala();
                  setIsPlaying(false);
                }
              }}
              className="w-full bg-[#22221D] text-[#F4EBDD] border border-[#3B392F] rounded-xl px-3 py-2 text-xs font-mono"
            >
              {SAPTA_TALA_FAMILIES.map((fam) => (
                <option key={fam.id} value={fam.id}>
                  {lang === 'ml' ? fam.nameMl : fam.nameEn} ({fam.symbolString})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Laghu Jati */}
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2">
            <label className="block text-[11px] font-mono uppercase text-[#C7A45B]">
              2. {lang === 'ml' ? 'ലഘു ജാതി (Laghu Jati):' : 'Laghu Jati (3, 4, 5, 7, 9):'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['tisra', 'chatusra', 'khanda', 'misra', 'sankirna'] as JatiType[]).map((j) => (
                <button
                  key={j}
                  onClick={() => {
                    setSelectedJati(j);
                    if (isPlaying) {
                      audioEngine.stopTala();
                      setIsPlaying(false);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                    selectedJati === j
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {JATI_COUNTS[j].nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Nadai / Gati Subdivision */}
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2">
            <label className="block text-[11px] font-mono uppercase text-[#C7A45B]">
              3. {lang === 'ml' ? 'നട / ഗതി (Nadai Subdivision):' : 'Nadai / Gati per Akshara:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['tisra', 'chatusra', 'khanda', 'misra', 'sankirna'] as JatiType[]).map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setSelectedNadai(n);
                    audioEngine.setNadai(n);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                    selectedNadai === n
                      ? 'bg-[#E0C98F] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {JATI_COUNTS[n].nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Kriya Timeline & Korvai Constructor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Visual Kriya Hand Gestures & Avartanam Timeline */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#3B392F]">
            <div>
              <span className="text-xs font-mono text-[#C7A45B] uppercase">
                {JATI_COUNTS[selectedJati].nameEn} Jati {activeFamily.nameEn} • {JATI_COUNTS[selectedNadai].nameEn} Nadai
              </span>
              <h3 className="text-xl font-serif font-bold text-[#F4EBDD] mt-0.5">
                {totalAksharas} Aksharas × {nadaiSubdivision} Matras = {matrasPerAvartanam} Matras / Cycle
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#BDB4A4]">BPM: {bpm}</span>
              <input
                type="range"
                min={40}
                max={180}
                value={bpm}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBpm(val);
                  audioEngine.setTalaBpm(val);
                }}
                className="w-24 accent-[#C7A45B]"
              />
            </div>
          </div>

          {/* Active Nadai Solkattu Syllable Strip */}
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/30 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-[#BDB4A4]">
              {lang === 'ml' ? 'നട സൊൽകട്ട്:' : 'Active Nadai Solkattu Subdivision:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {JATI_COUNTS[selectedNadai].solkattu.map((syl, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#22221D] border border-[#C7A45B]/40 text-xs font-mono font-bold text-[#E0C98F]"
                >
                  {syl}
                </span>
              ))}
            </div>
          </div>

          {/* Visual Kriya Hand Gesture Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {kriyaBeats.map((kb, idx) => {
              const isCurrent = isPlaying && activeBeat === idx;
              return (
                <div
                  key={kb.beatNumber}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#F4EBDD] scale-105 shadow-lg font-bold'
                      : kb.isAccent
                      ? 'bg-[#22221D] border-[#C7A45B]/50 text-[#F4EBDD]'
                      : 'bg-[#14130f] border-[#3B392F] text-[#BDB4A4]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span>Akshara #{kb.beatNumber}</span>
                    <Hand className="w-3 h-3" />
                  </div>
                  <div className="text-xs font-serif font-bold mt-1">{kb.kriyaGesture}</div>
                  <div className="text-[10px] font-mono opacity-80 mt-0.5">{kb.angaLabel}</div>
                </div>
              );
            })}
          </div>

          {/* Tap-to-Beat Latency & Laya Stability Calibrator */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-mono text-[#C7A45B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ലയ സ്ഥിരത & ടാപ്പ് ടെമ്പോ പരിശോധന' : 'Tap-to-Beat Laya Stability & Latency Calibrator'}</span>
              </div>
              <div className="text-xs text-[#BDB4A4]">
                {measuredTapBpm
                  ? `Measured Tempo: ${measuredTapBpm} BPM • Timing Jitter: ±${tapJitterMs} ms`
                  : lang === 'ml'
                  ? 'നിങ്ങളുടെ താള കൃത്യത അളക്കാൻ തുടർച്ചയായി 4 തവണ ടാപ്പ് ചെയ്യുക.'
                  : 'Tap 4+ steady beats to measure your internal Laya tempo and millisecond jitter.'}
              </div>
            </div>
            <button
              onClick={handleTapTempoAndLatency}
              className="px-4 py-2.5 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] border border-[#C7A45B]/40 text-xs font-mono font-bold cursor-pointer transition-colors shrink-0"
            >
              {lang === 'ml' ? 'ഇവിടെ ടാപ്പ് ചെയ്യുക (Tap Beat)' : 'Tap Beat (Kriya Pulse)'}
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Korvai & Mora Arithmetic Construction Studio */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              <span>{lang === 'ml' ? 'കോർവൈ & മോറ ഗണിത ശില്പശാല' : 'Korvai & Mora Arithmetic Validator'}</span>
            </span>
            <span className="text-xs font-mono text-[#87947A]">{matrasPerAvartanam} Matras/Cycle</span>
          </div>

          <p className="text-xs text-[#BDB4A4] leading-relaxed">
            {lang === 'ml'
              ? 'പൂർവ്വാംഗവും ഉത്തരാംഗവും (3 തവണ ആവർത്തിക്കുന്ന തീർമാനം + കാർവൈ വിടവ്) ചേർന്ന് സമത്തിലോ എടുപ്പിലോ കൃത്യമായി അവസാനിക്കുന്നുണ്ടോ എന്ന് പരിശോധിക്കുക.'
              : 'Construct a bipartite Korvai: Purvangam + [3 × Uttarangam Phrase + 2 × Mora Karvai Gap] and verify exact resolution on Samam or custom Eduppu.'}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[#BDB4A4] mb-1">Purvangam (Matras):</label>
              <input
                type="number"
                min={0}
                max={1000}
                value={purvangamMatras}
                onChange={(e) => setPurvangamMatras(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
            </div>
            <div>
              <label className="block text-[#BDB4A4] mb-1">Uttaranga Phrase (×3):</label>
              <input
                type="number"
                min={1}
                max={300}
                value={uttarangamPhraseMatras}
                onChange={(e) => setUttarangamPhraseMatras(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
            </div>
            <div>
              <label className="block text-[#BDB4A4] mb-1">Mora Gap (×2 Karvai):</label>
              <input
                type="number"
                min={0}
                max={100}
                value={moraGapMatras}
                onChange={(e) => setMoraGapMatras(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
            </div>
            <div>
              <label className="block text-[#BDB4A4] mb-1">Eduppu Offset (Matras):</label>
              <input
                type="number"
                min={-32}
                max={32}
                value={eduppuOffsetMatras}
                onChange={(e) => setEduppuOffsetMatras(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
            </div>
          </div>

          {/* Mathematical Equation & Resolution Verdict */}
          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#C7A45B]/30 space-y-2 text-xs font-mono">
            <div className="text-[#BDB4A4]">
              Equation: {purvangamMatras} + (3 × {uttarangamPhraseMatras}) + (2 × {moraGapMatras}) ={' '}
              <strong className="text-[#E0C98F]">{totalKorvaiMatras} Matras</strong>
            </div>
            <div className="text-[#BDB4A4]">
              Avartanams Spanned: <strong className="text-[#F4EBDD]">{avartanamsSpanned} cycle(s)</strong> (
              {matrasPerAvartanam} matras/cycle)
            </div>

            {isKorvaiAligned ? (
              <div className="pt-2 flex items-center gap-2 text-[#6EA887] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'ml'
                    ? 'ഗണിതശാസ്ത്രപരമായി സമത്തിൽ / എടുപ്പിൽ കൃത്യമായി ചേരുന്നു!'
                    : `Arithmetically Verified! Resolves cleanly on ${eduppuOffsetMatras === 0 ? 'Samam' : `Eduppu (+${eduppuOffsetMatras}m)`}.`}
                </span>
              </div>
            ) : (
              <div className="pt-2 flex items-start gap-2 text-[#D9A441]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Off by {remainderMatras} matra(s). Add <strong>+{adjustmentNeeded} matra(s)</strong> to Purvangam (set Purvangam to{' '}
                  {purvangamMatras + adjustmentNeeded}) to land on target.
                </span>
              </div>
            )}
          </div>

          {!isKorvaiAligned && (
            <button
              onClick={() => setPurvangamMatras(purvangamMatras + adjustmentNeeded)}
              className="w-full py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs cursor-pointer"
            >
              {lang === 'ml'
                ? `പൂർവ്വാംഗം ${purvangamMatras + adjustmentNeeded} മാത്രയിലേക്ക് സ്വയം ക്രമീകരിക്കുക`
                : `Auto-Balance Purvangam to ${purvangamMatras + adjustmentNeeded} Matras`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
