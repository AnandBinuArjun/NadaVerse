'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileEdit,
  Play,
  Square,
  RotateCcw,
  RotateCw,
  Save,
  Download,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TonicNote } from '../lib/audioEngine';
import { API_BASE_URL } from '../lib/api';

export interface SwaraNotationCell {
  id: string;
  swara: string;
  octave: 'mandra' | 'madhya' | 'tara';
  aksharas: number;
  sahitya: string;
  gamaka: 'none' | 'kampita' | 'jaru' | 'nokku' | 'spurita';
}

export interface SwaraNotationSection {
  id: string;
  name: string;
  notes: SwaraNotationCell[];
}

const SWARA_RATIO_LOOKUP: Record<string, number> = {
  S: 1.0,
  R1: 16 / 15,
  R2: 9 / 8,
  R3: 6 / 5,
  G1: 9 / 8,
  G2: 6 / 5,
  G3: 5 / 4,
  M1: 4 / 3,
  M2: 45 / 32,
  P: 3 / 2,
  D1: 8 / 5,
  D2: 5 / 3,
  D3: 9 / 5,
  N1: 5 / 3,
  N2: 9 / 5,
  N3: 15 / 8,
};

const MANODHARMA_PHRASE_TEMPLATES = [
  {
    id: 'maya-eduppu-ga',
    ragaName: 'Mayamalavagowla (Melakarta 15)',
    category: 'Kalpana Swara (Landing on G₃)',
    notes: [
      { swara: 'S', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'R1', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'G3', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'kampita' },
      { swara: 'M1', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'P', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'M1', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'G3', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'kampita' },
      { swara: 'R1', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
    ] as Omit<SwaraNotationCell, 'id'>[],
  },
  {
    id: 'mohanam-alapana-arc',
    ragaName: 'Mohanam (Audava Janya)',
    category: 'Alapana Signature Prayoga',
    notes: [
      { swara: 'G3', octave: 'madhya', aksharas: 1, sahitya: 'A', gamaka: 'kampita' },
      { swara: 'P', octave: 'madhya', aksharas: 1, sahitya: 'ka', gamaka: 'jaru' },
      { swara: 'D2', octave: 'madhya', aksharas: 2, sahitya: 'ra', gamaka: 'kampita' },
      { swara: 'S', octave: 'tara', aksharas: 2, sahitya: 'm', gamaka: 'none' },
      { swara: 'D2', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'jaru' },
      { swara: 'P', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
    ] as Omit<SwaraNotationCell, 'id'>[],
  },
  {
    id: 'kalyani-kalpana-m2',
    ragaName: 'Mechakalyani (Melakarta 65)',
    category: 'Kalpana Swara (M₂ & N₃ Flourish)',
    notes: [
      { swara: 'G3', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'kampita' },
      { swara: 'M2', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'P', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'D2', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'N3', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'kampita' },
      { swara: 'D2', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
      { swara: 'P', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'jaru' },
      { swara: 'M2', octave: 'madhya', aksharas: 1, sahitya: '', gamaka: 'none' },
    ] as Omit<SwaraNotationCell, 'id'>[],
  },
];

interface SwaraNotationEditorProps {
  activeTonic: TonicNote;
}

export const SwaraNotationEditor: React.FC<SwaraNotationEditorProps> = ({ activeTonic }) => {
  const { lang } = useLanguage();
  const [title, setTitle] = useState<string>('Mayamalavagowla Study & Kalpana Swara Draft');
  const ragaSlug = 'mayamalavagowla';
  const [talaAksharas, setTalaAksharas] = useState<number>(8);
  const bpm = 80;
  const [timbre, setTimbre] = useState<'vocal' | 'violin' | 'neutral'>('vocal');
  const cellSeqRef = useRef<number>(100);

  // Entry controls
  const [activeOctave, setActiveOctave] = useState<'mandra' | 'madhya' | 'tara'>('madhya');
  const [activeDuration, setActiveDuration] = useState<number>(1);
  const [activeGamaka, setActiveGamaka] = useState<SwaraNotationCell['gamaka']>('none');
  const [sahityaInput, setSahityaInput] = useState<string>('');

  const [sections, setSections] = useState<SwaraNotationSection[]>([
    {
      id: 'sec-pallavi',
      name: 'Pallavi / First Avartanam',
      notes: MANODHARMA_PHRASE_TEMPLATES[0].notes.map((n, idx) => ({
        ...n,
        id: `n-init-${idx}`,
      })),
    },
  ]);
  const activeSectionIdx = 0;
  const [historyStack, setHistoryStack] = useState<SwaraNotationSection[][]>([]);
  const [redoStack, setRedoStack] = useState<SwaraNotationSection[][]>([]);
  const [activePlayingCellId, setActivePlayingCellId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Load autosaved draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nadaverse_notation_editor_draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.sections && parsed.sections.length > 0) setSections(parsed.sections);
        }
      } catch {}
    }
  }, []);

  // Autosave on edit
  const updateSectionsWithHistory = (nextSections: SwaraNotationSection[]) => {
    setHistoryStack((prev) => [...prev.slice(-24), sections]);
    setRedoStack([]);
    setSections(nextSections);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'nadaverse_notation_editor_draft',
          JSON.stringify({ title, ragaSlug, talaAksharas, sections: nextSections })
        );
      } catch {}
    }
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setRedoStack((r) => [...r, sections]);
    setHistoryStack((h) => h.slice(0, -1));
    setSections(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack((h) => [...h, sections]);
    setRedoStack((r) => r.slice(0, -1));
    setSections(next);
  };

  const handleAppendSwara = (swaraToken: string) => {
    cellSeqRef.current += 1;
    const newCell: SwaraNotationCell = {
      id: `cell-${cellSeqRef.current}`,
      swara: swaraToken,
      octave: activeOctave,
      aksharas: activeDuration,
      sahitya: sahityaInput.trim(),
      gamaka: activeGamaka,
    };
    setSahityaInput('');

    const next = sections.map((sec, idx) =>
      idx === activeSectionIdx ? { ...sec, notes: [...sec.notes, newCell] } : sec
    );
    updateSectionsWithHistory(next);

    // Audition the inserted note immediately
    const baseRatio = SWARA_RATIO_LOOKUP[swaraToken];
    if (baseRatio) {
      const octFactor = activeOctave === 'mandra' ? 0.5 : activeOctave === 'tara' ? 2.0 : 1.0;
      audioEngine.setTonic(activeTonic.frequency);
      audioEngine.playSwaraNote(baseRatio * octFactor, 0.35);
    }
  };

  const handleRemoveCell = (cellId: string) => {
    const next = sections.map((sec, idx) =>
      idx === activeSectionIdx
        ? { ...sec, notes: sec.notes.filter((n) => n.id !== cellId) }
        : sec
    );
    updateSectionsWithHistory(next);
  };

  const handleLoadManodharmaTemplate = (tpl: (typeof MANODHARMA_PHRASE_TEMPLATES)[0]) => {
    const templatedNotes: SwaraNotationCell[] = tpl.notes.map((n) => {
      cellSeqRef.current += 1;
      return {
        ...n,
        id: `tpl-${cellSeqRef.current}`,
      };
    });
    const next = sections.map((sec, idx) =>
      idx === activeSectionIdx ? { ...sec, notes: [...sec.notes, ...templatedNotes] } : sec
    );
    updateSectionsWithHistory(next);
  };

  const handlePlayCompositionDraft = async () => {
    if (isPlaying) {
      audioEngine.stopAllSwaraNotes();
      setIsPlaying(false);
      setActivePlayingCellId(null);
      return;
    }

    await audioEngine.unlockAudio();
    audioEngine.setTonic(activeTonic.frequency);
    const ctx = audioEngine.getContext();
    const secPerAkshara = 60.0 / bpm;
    let cursorTime = ctx.currentTime + 0.05;

    setIsPlaying(true);
    const allCells = sections.flatMap((s) => s.notes);

    allCells.forEach((cell, idx) => {
      const durSec = cell.aksharas * secPerAkshara;
      const baseRatio = SWARA_RATIO_LOOKUP[cell.swara];
      const octFactor = cell.octave === 'mandra' ? 0.5 : cell.octave === 'tara' ? 2.0 : 1.0;

      if (baseRatio) {
        audioEngine.scheduleSwaraNote(
          cursorTime,
          baseRatio * octFactor,
          durSec * 0.94,
          cell.gamaka !== 'none' ? { type: cell.gamaka } : undefined,
          timbre
        );
      }

      const startOffsetMs = Math.max(0, (cursorTime - ctx.currentTime) * 1000);
      window.setTimeout(() => {
        setActivePlayingCellId(cell.id);
        if (idx === allCells.length - 1) {
          window.setTimeout(() => {
            setIsPlaying(false);
            setActivePlayingCellId(null);
          }, durSec * 1000);
        }
      }, startOffsetMs);

      cursorTime += durSec;
    });
  };

  const handleSaveToCloudAccount = async () => {
    setSaveMessage(lang === 'ml' ? 'സൂക്ഷിക്കുന്നു...' : 'Saving draft...');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/v1/notations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            composer: 'Musician Study Draft',
            raga_slug: ragaSlug,
            tala_slug: 'adi-tala',
            tala_aksharas: talaAksharas,
            nadai: 'chatusra',
            kalam: 1,
            tonic: activeTonic.name,
            sections: sections.map((s) => ({
              name: s.name,
              notes: s.notes.map((n) => ({
                swara: n.swara,
                octave: n.octave,
                aksharas: n.aksharas,
                sahitya: n.sahitya,
                gamaka: n.gamaka,
              })),
            })),
          }),
        });
        if (res.ok) {
          setSaveMessage(
            lang === 'ml'
              ? 'നൊട്ടേഷൻ അക്കൗണ്ടിലും ബ്രൗസറിലും സുരക്ഷിതമായി സൂക്ഷിച്ചു!'
              : 'Saved to your private account & local browser storage!'
          );
          return;
        }
      }
    } catch {}
    setSaveMessage(
      lang === 'ml'
        ? 'ബ്രൗസറിൽ ലോക്കലായി സൂക്ഷിച്ചു (Local Draft Saved).'
        : 'Saved locally in browser draft storage.'
    );
  };

  const handleExportNotationJson = () => {
    const payload = {
      schema: 'nadaverse-swara-notation-v1',
      title,
      ragaSlug,
      talaAksharas,
      tonic: activeTonic.name,
      sections,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentSection = sections[activeSectionIdx] || sections[0];
  const totalSectionAksharas = currentSection.notes.reduce((acc, n) => acc + n.aksharas, 0);
  const remainder = totalSectionAksharas % talaAksharas;
  const isCycleAligned = remainder === 0 && totalSectionAksharas > 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <FileEdit className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? 'സ്വര നൊട്ടേഷൻ എഡിറ്റർ & മനോധർമ്മ കളരി'
                  : 'Interactive Swara Notation Editor & Manodharma Studio'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'സ്വര രചന, താളവട്ട പരിശോധന & മനോധർമ്മ കല്പനാസ്വരം'
                : 'Compose, Validate & Audition Swara Notations and Kalpana Swaras'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-3xl">
              {lang === 'ml'
                ? 'മന്ദ്ര-മധ്യ-താര സ്ഥായികൾ, ഗമക ചിഹ്നങ്ങൾ, സാഹിത്യം എന്നിവയോടുകൂടി സ്വരങ്ങൾ ചിട്ടപ്പെടുത്തുകയും തത്സമയം കേൾക്കുകയും ചെയ്യാം.'
                : 'Author structured Carnatic swara notations with octave dots, akshara durations, gamaka markers, Tala cycle arithmetic verification, and real-time Just Intonation synthesis.'}
            </p>
          </div>

          {/* Playback & Export Action Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePlayCompositionDraft}
              className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg ${
                isPlaying ? 'bg-[#E17D73] text-[#11110F]' : 'nv-gold-btn text-[#11110F]'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? (lang === 'ml' ? 'നിർത്തുക' : 'Stop') : lang === 'ml' ? 'വായിക്കുക' : 'Synthesize Draft'}</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={historyStack.length === 0}
              className="p-3 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#E0C98F] disabled:opacity-40 cursor-pointer"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-3 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#E0C98F] disabled:opacity-40 cursor-pointer"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSaveToCloudAccount}
              className="px-3.5 py-3 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'സേവ്' : 'Save Draft'}</span>
            </button>
            <button
              onClick={handleExportNotationJson}
              className="px-3.5 py-3 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#3B392F] text-xs font-mono text-[#BDB4A4] hover:text-[#F4EBDD] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="px-3.5 py-3 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#3B392F] text-xs font-mono text-[#BDB4A4] hover:text-[#F4EBDD] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="p-3 rounded-xl bg-[#6EA887]/15 border border-[#6EA887]/40 text-xs text-[#F4EBDD] font-mono">
            {saveMessage}
          </div>
        )}

        {/* Metadata Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[#3B392F]">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-mono uppercase text-[#BDB4A4] mb-1">
              {lang === 'ml' ? 'രചനയുടെ പേര്:' : 'Document Title:'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#BDB4A4] mb-1">
              {lang === 'ml' ? 'താളവട്ട അക്ഷരങ്ങൾ:' : 'Tala Cycle (Aksharas):'}
            </label>
            <select
              value={talaAksharas}
              onChange={(e) => setTalaAksharas(parseInt(e.target.value, 10))}
              className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] font-mono"
            >
              <option value={8}>Adi Tala (8 Aksharas)</option>
              <option value={6}>Rupaka Tala (6 Aksharas)</option>
              <option value={5}>Khanda Chapu (5 Aksharas)</option>
              <option value={7}>Misra Chapu (7 Aksharas)</option>
              <option value={14}>Ata Tala (14 Aksharas)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#BDB4A4] mb-1">
              {lang === 'ml' ? 'ശബ്ദ തരം (Timbre):' : 'Synthesis Timbre:'}
            </label>
            <select
              value={timbre}
              onChange={(e) => setTimbre(e.target.value as any)}
              className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD] font-mono"
            >
              <option value="vocal">Vocal (Akara Resonance)</option>
              <option value="violin">Carnatic Violin</option>
              <option value="neutral">Veena / Neutral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Swara Entry Palette & Manodharma Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Swara Keyboard Palette & Active Notation Grid */}
        <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          {/* Octave, Duration, Gamaka & Sahitya Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#14130f] border border-[#3B392F] text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="text-[#BDB4A4]">Sthayi:</span>
              {(['mandra', 'madhya', 'tara'] as const).map((oct) => (
                <button
                  key={oct}
                  onClick={() => setActiveOctave(oct)}
                  className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer ${
                    activeOctave === oct ? 'bg-[#C7A45B] text-[#11110F] font-bold' : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  {oct}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[#BDB4A4]">Aksharas:</span>
              {[0.5, 1, 2, 4].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setActiveDuration(dur)}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    activeDuration === dur ? 'bg-[#C7A45B] text-[#11110F] font-bold' : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[#BDB4A4]">Gamaka:</span>
              {(['none', 'kampita', 'jaru', 'nokku', 'spurita'] as const).map((gm) => (
                <button
                  key={gm}
                  onClick={() => setActiveGamaka(gm)}
                  className={`px-2 py-1 rounded-lg capitalize cursor-pointer ${
                    activeGamaka === gm ? 'bg-[#E0C98F] text-[#11110F] font-bold' : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  {gm}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={sahityaInput}
              onChange={(e) => setSahityaInput(e.target.value)}
              placeholder={lang === 'ml' ? 'സാഹിത്യം (ഉദാ: ശ്രീ)...' : 'Sahitya syllable...'}
              className="bg-[#22221D] border border-[#3B392F] rounded-lg px-2.5 py-1 text-xs text-[#F4EBDD] w-36"
            />
          </div>

          {/* 16 Swarasthana Entry Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-[#C7A45B]">
              {lang === 'ml' ? 'സ്വരങ്ങൾ ചേർക്കാൻ ക്ലിക്ക് ചെയ്യുക:' : 'Click Swarasthana to Append & Audition:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['S', 'R1', 'R2', 'R3', 'G1', 'G2', 'G3', 'M1', 'M2', 'P', 'D1', 'D2', 'D3', 'N1', 'N2', 'N3', ','].map(
                (sw) => (
                  <button
                    key={sw}
                    onClick={() => handleAppendSwara(sw)}
                    className="px-3 py-2 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#F4EBDD] hover:text-[#11110F] border border-[#C7A45B]/35 font-mono font-bold text-xs transition-colors cursor-pointer"
                  >
                    {sw === ',' ? ', (Karvai)' : sw}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Tala Cycle Alignment Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#14130f] border border-[#3B392F] text-xs font-mono">
            <span>
              Total Duration: <strong className="text-[#E0C98F]">{totalSectionAksharas} Aksharas</strong> (
              {(totalSectionAksharas / talaAksharas).toFixed(2)} Avartanams)
            </span>
            {isCycleAligned ? (
              <span className="text-[#6EA887] flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Aligned with {talaAksharas}-Akshara Tala Cycle</span>
              </span>
            ) : (
              <span className="text-[#D9A441] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Needs +{(talaAksharas - remainder).toFixed(1)} akshara(s) to complete Avartanam
                </span>
              </span>
            )}
          </div>

          {/* Interactive Swara Grid Cells */}
          <div className="grid grid-cols-2 min-[400px]:grid-cols-4 sm:grid-cols-8 gap-2">
            {currentSection.notes.map((cell, idx) => {
              const isPlayingThis = activePlayingCellId === cell.id;
              const isAngaBoundary = (idx + 1) % talaAksharas === 0;
              return (
                <div
                  key={cell.id}
                  className={`relative p-2.5 rounded-xl border text-center transition-all group ${
                    isPlayingThis
                      ? 'bg-[#C7A45B] text-[#11110F] border-[#F4EBDD] scale-105 font-bold'
                      : isAngaBoundary
                      ? 'bg-[#22221D] border-[#C7A45B]/60 text-[#F4EBDD]'
                      : 'bg-[#14130f] border-[#3B392F] text-[#F4EBDD]'
                  }`}
                >
                  <button
                    onClick={() => handleRemoveCell(cell.id)}
                    className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 text-[#E17D73] hover:scale-110 transition-opacity cursor-pointer"
                    title="Delete swara cell"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="text-[9px] font-mono text-[#C7A45B] uppercase">
                    {cell.gamaka !== 'none' ? `~${cell.gamaka.slice(0, 3)}` : '\u00A0'}
                  </div>
                  <div className="text-base font-serif font-bold">
                    {cell.octave === 'tara' ? `${cell.swara}̇` : cell.octave === 'mandra' ? `${cell.swara}̣` : cell.swara}
                  </div>
                  <div className="text-[10px] text-[#BDB4A4] truncate">{cell.sahitya || '—'}</div>
                  <div className="text-[9px] font-mono opacity-75">{cell.aksharas}a</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Manodharma Practice Studio & Reviewed Phrase Templates */}
        <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C7A45B]">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ml' ? 'മനോധർമ്മം (ആലാപന & കല്പനാസ്വരം)' : 'Manodharma Phrase Builder'}</span>
          </div>

          {/* Non-Negotiable Manodharma Disclaimer (Required by Section 8) */}
          <div className="p-3 rounded-xl bg-[#14130f] border border-[#C7A45B]/25 text-[11px] text-[#BDB4A4] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
            <span>
              {lang === 'ml'
                ? 'ഇവിടെയുള്ള മനോധർമ്മ ശുപാർശകൾ പഠനസഹായികൾ മാത്രമാണ്; അവ ഒരു രാഗത്തിന്റെ അവസാന വാക്കല്ല.'
                : 'Manodharma phrase templates are pedagogical study blocks grounded in reviewed prayogas—never claimed as exhaustive or authoritative raga improvisations.'}
            </span>
          </div>

          <div className="space-y-3">
            {MANODHARMA_PHRASE_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3.5 rounded-2xl bg-[#22221D] border border-[#3B392F] hover:border-[#C7A45B]/50 space-y-2 transition-all"
              >
                <div className="text-[10px] font-mono text-[#C7A45B] uppercase">{tpl.ragaName}</div>
                <div className="text-sm font-serif font-bold text-[#F4EBDD]">{tpl.category}</div>
                <div className="text-xs font-mono text-[#E0C98F]">
                  {tpl.notes.map((n) => n.swara).join(' ')}
                </div>
                <button
                  onClick={() => handleLoadManodharmaTemplate(tpl)}
                  className="w-full py-2 rounded-xl bg-[#14130f] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'എഡിറ്ററിലേക്ക് ചേർക്കുക' : 'Append Phrase to Canvas'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
