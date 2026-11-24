'use client';

import React, { useState, useEffect } from 'react';
import {
  Music,
  Play,
  Square,
  Plus,
  Trash2,
  Printer,
  Download,
  Maximize2,
  Sun,
  Moon,
  Clock,
  Info,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TonicNote } from '../lib/audioEngine';

interface KutcheriItem {
  id: string;
  slotRole: string;
  title: string;
  raga: string;
  tala: string;
  composer: string;
  durationMinutes: number;
  rehearsalStatus: 'learning' | 'practising' | 'stage_ready';
  notes: string;
}

const DEFAULT_KUTCHERI_SETLIST: KutcheriItem[] = [
  {
    id: 'k-1',
    slotRole: '1. Opening Tana Varnam',
    title: 'Ninnukori',
    raga: 'Mohanam',
    tala: 'Adi Tala',
    composer: 'Poochi Srinivasa Iyengar',
    durationMinutes: 12,
    rehearsalStatus: 'stage_ready',
    notes: 'Render Ettugada Swaras in 2 Kalams with crisp Tisra jump.',
  },
  {
    id: 'k-2',
    slotRole: '2. Invocatory Ganapati Kriti',
    title: 'Vatapi Ganapatim Bhajeham',
    raga: 'Hamsadhwani',
    tala: 'Adi Tala',
    composer: 'Muthuswami Dikshitar',
    durationMinutes: 14,
    rehearsalStatus: 'stage_ready',
    notes: 'Brief 3-minute Chaya Alapana + Kalpana Swaras at Pallavi.',
  },
  {
    id: 'k-3',
    slotRole: '3. Sub-Main Kriti & Neraval',
    title: 'Samaja Vara Gamana',
    raga: 'Hindolam',
    tala: 'Adi Tala',
    composer: 'Saint Tyagaraja',
    durationMinutes: 20,
    rehearsalStatus: 'practising',
    notes: 'Switch Tanpura / Shruti reminder to Ma-shruti resonance.',
  },
  {
    id: 'k-4',
    slotRole: '4. Main Kriti & Tani Avartanam',
    title: 'Raghuvamsa Sudha',
    raga: 'Kathanakuthuhalam',
    tala: 'Adi Tala',
    composer: 'Patnam Subramania Iyer',
    durationMinutes: 25,
    rehearsalStatus: 'practising',
    notes: 'Coordinate Korvai cue with Mridangam & Ghatam accompanists.',
  },
];

interface NotebookNote {
  id: string;
  title: string;
  tag: 'raga' | 'tala' | 'concert' | 'lesson';
  content: string;
  updatedAt: string;
}

interface KutcheriAndPerformanceStudioProps {
  activeTonic: TonicNote;
}

export const KutcheriAndPerformanceStudio: React.FC<KutcheriAndPerformanceStudioProps> = ({
  activeTonic,
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'kutcheri' | 'stage-mode' | 'ensemble' | 'notebook'>('kutcheri');

  // 1. Kutcheri Planner State (Section 11)
  const [concertTitle, setConcertTitle] = useState<string>('NadaVerse Classical Chamber Recital');
  const concertVenue = 'Gurukulam Sabhamandapam';
  const [setlist, setSetlist] = useState<KutcheriItem[]>(DEFAULT_KUTCHERI_SETLIST);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newRaga, setNewRaga] = useState<string>('Mechakalyani');
  const newTala = 'Adi Tala';
  const [newDuration, setNewDuration] = useState<number>(10);

  // 2. Live Performance Stage Mode State (Section 12)
  const [stageItemIndex, setStageItemIndex] = useState<number>(0);
  const [stageTheme, setStageTheme] = useState<'dark' | 'light'>('dark');
  const [stageFontScale, setStageFontScale] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [stageElapsedSeconds, setStageElapsedSeconds] = useState<number>(0);
  const [isStageTimerRunning, setIsStageTimerRunning] = useState<boolean>(false);

  // 3. Virtual Carnatic Ensemble Mixer State (Sections 9 & 10)
  const [isEnsemblePlaying, setIsEnsemblePlaying] = useState<boolean>(false);
  const [ensembleBpm, setEnsembleBpm] = useState<number>(76);
  const [tanpuraVol, setTanpuraVol] = useState<number>(0.75);
  const [leadMelodicVol, setLeadMelodicVol] = useState<number>(0.80);
  const [mridangamVol, setMridangamVol] = useState<number>(0.75);
  const [ghatamVol, setGhatamVol] = useState<number>(0.55);
  const [leadInstrument, setLeadInstrument] = useState<'saraswati-veena' | 'carnatic-violin' | 'carnatic-flute'>('carnatic-violin');

  // 4. Digital Music Notebook State (Sections 13 & 14)
  const [notebookEntries, setNotebookEntries] = useState<NotebookNote[]>([
    {
      id: 'nb-1',
      title: 'Mayamalavagowla G3 & N3 Gamaka Anchors',
      tag: 'raga',
      content: 'Anchor Antara Gandhara (G3) from Shuddha Madhyama (M1) and Kakali Nishada (N3) from Tara Shadja (S) with zero flat settling.',
      updatedAt: 'Nov 2026',
    },
    {
      id: 'nb-2',
      title: 'Adi Tala 1.5 Akshara Ateeta/Anagata Eduppu Cue',
      tag: 'tala',
      content: 'Count 6 Chatusra matras after Samam (1 full akshara + 2 matras) before launching the Pallavi uptake.',
      updatedAt: 'Nov 2026',
    },
  ]);
  const [noteTitleInput, setNoteTitleInput] = useState<string>('');
  const [noteTagInput, setNoteTagInput] = useState<NotebookNote['tag']>('raga');
  const [noteBodyInput, setNoteBodyInput] = useState<string>('');

  useEffect(() => {
    if (!isStageTimerRunning) return;
    const id = window.setInterval(() => {
      setStageElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isStageTimerRunning]);

  const totalConcertMinutes = setlist.reduce((sum, item) => sum + item.durationMinutes, 0);

  const handleAddKutcheriItem = () => {
    if (!newTitle.trim()) return;
    const nextItem: KutcheriItem = {
      id: `k-${setlist.length + 1}`,
      slotRole: `${setlist.length + 1}. Custom Concert Piece`,
      title: newTitle.trim(),
      raga: newRaga.trim() || 'Shankarabharanam',
      tala: newTala.trim() || 'Adi Tala',
      composer: 'Classical Repertoire',
      durationMinutes: newDuration,
      rehearsalStatus: 'learning',
      notes: 'Custom musician addition.',
    };
    setSetlist([...setlist, nextItem]);
    setNewTitle('');
  };

  const handleExportKutcheriJson = () => {
    const blob = new Blob(
      [JSON.stringify({ concertTitle, concertVenue, totalConcertMinutes, setlist }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nadaverse-kutcheri-setlist.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleVirtualEnsemble = async () => {
    if (isEnsemblePlaying) {
      audioEngine.stopTanpura();
      audioEngine.stopTala();
      setIsEnsemblePlaying(false);
      return;
    }
    await audioEngine.unlockAudio();
    if (tanpuraVol > 0.05) {
      await audioEngine.startTanpura(activeTonic.frequency, tanpuraVol, 'pa');
    }
    if (leadMelodicVol > 0.05) {
      audioEngine.auditionInstrument(leadInstrument);
    }
    if (mridangamVol > 0.05 || ghatamVol > 0.05) {
      audioEngine.setSolkattuMode(true);
      audioEngine.setNadai('chatusra');
      audioEngine.setNadaiLoopsEnabled(true);
      await audioEngine.startTala(
        ensembleBpm,
        8,
        [
          { isAccent: true, syllable: 'thom' },
          { isAccent: false, syllable: 'tha' },
          { isAccent: false, syllable: 'dhi' },
          { isAccent: false, syllable: 'mi' },
          { isAccent: true, syllable: 'tha' },
          { isAccent: false, syllable: 'ka' },
          { isAccent: true, syllable: 'tha' },
          { isAccent: false, syllable: 'dhi' },
        ],
        () => {}
      );
    }
    setIsEnsemblePlaying(true);
  };

  useEffect(() => {
    return () => {
      audioEngine.stopTala();
    };
  }, []);

  const handleAddNotebookEntry = () => {
    if (!noteTitleInput.trim() || !noteBodyInput.trim()) return;
    setNotebookEntries([
      {
        id: `nb-${notebookEntries.length + 1}`,
        title: noteTitleInput.trim(),
        tag: noteTagInput,
        content: noteBodyInput.trim(),
        updatedAt: 'Saved Locally',
      },
      ...notebookEntries,
    ]);
    setNoteTitleInput('');
    setNoteBodyInput('');
  };

  const activeStageItem = setlist[stageItemIndex % Math.max(1, setlist.length)] || DEFAULT_KUTCHERI_SETLIST[0];
  const nextStageItem = setlist[(stageItemIndex + 1) % Math.max(1, setlist.length)];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Music className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? 'കച്ചേരി പ്ലാനർ, സ്റ്റേജ് മോഡ് & വിർച്വൽ പക്കവാദ്യം'
                  : 'NadaVerse 2.0 • Kutcheri Planner, Live Stage Mode & Virtual Ensemble'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'കച്ചേരി ആസൂത്രണം, തത്സമയ കച്ചേരി മോഡ് & പക്കവാദ്യ മിക്സർ'
                : 'Concert Preparation, Distraction-Free Stage Reader & Ensemble Mixer'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'kutcheri', labelEn: '1. Kutcheri Planner', labelMl: '1. കച്ചേരി പ്ലാനർ' },
              { id: 'stage-mode', labelEn: '2. Live Stage Mode', labelMl: '2. സ്റ്റേജ് മോഡ്' },
              { id: 'ensemble', labelEn: '3. Virtual Ensemble', labelMl: '3. പക്കവാദ്യ മിക്സർ' },
              { id: 'notebook', labelEn: '4. Musician Notebook', labelMl: '4. സംഗീത നോട്ട്ബുക്ക്' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                    : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
                }`}
              >
                {lang === 'ml' ? tab.labelMl : tab.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: KUTCHERI CONCERT PLANNER (Section 11)
      ===================================================================== */}
      {activeTab === 'kutcheri' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3B392F]">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#F4EBDD]">{concertTitle}</h3>
                <span className="text-xs font-mono text-[#C7A45B]">
                  {concertVenue} • Total Estimated Duration: {totalConcertMinutes} mins
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportKutcheriJson}
                  className="px-3.5 py-2 rounded-xl bg-[#22221D] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C7A45B]" />
                  <span>Export Setlist</span>
                </button>
                <button
                  onClick={() => typeof window !== 'undefined' && window.print()}
                  className="px-3.5 py-2 rounded-xl bg-[#22221D] border border-[#3B392F] text-xs font-mono text-[#BDB4A4] hover:text-[#F4EBDD] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Programme</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#14130f] border border-[#C7A45B]/25 text-xs text-[#BDB4A4] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
              <span>
                The default layout follows the classical Varnam → Kriti → RTP/Main → Tukda arc as an optional suggestion. Musicians can freely reorder, add, or override any slot to fit thematic, chamber, or lecture-demonstration formats.
              </span>
            </div>

            <div className="space-y-3">
              {setlist.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C7A45B]/15 text-[#E0C98F]">
                        {item.slotRole}
                      </span>
                      <span className="text-xs font-mono text-[#6EA887]">
                        {item.durationMinutes} min • {item.rehearsalStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-base font-serif font-bold text-[#F4EBDD]">
                      {item.title} — <span className="text-[#E0C98F]">{item.raga}</span> ({item.tala})
                    </div>
                    <div className="text-xs text-[#BDB4A4]">{item.notes}</div>
                  </div>

                  <button
                    onClick={() => setSetlist(setlist.filter((_, i) => i !== idx))}
                    className="p-2 rounded-xl bg-[#22221D] hover:bg-[#E17D73]/20 text-[#E17D73] self-end sm:self-center cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right 4 Cols: Add Piece to Kutcheri */}
          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl self-start">
            <h3 className="text-base font-serif font-bold text-[#F4EBDD]">
              Add Composition to Concert Programme
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#BDB4A4] mb-1">Concert Title:</label>
                <input
                  type="text"
                  value={concertTitle}
                  onChange={(e) => setConcertTitle(e.target.value)}
                  className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
                />
              </div>
              <div>
                <label className="block text-[#BDB4A4] mb-1">Composition Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Endaro Mahanubhavulu"
                  className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
                />
              </div>
              <div>
                <label className="block text-[#BDB4A4] mb-1">Raga:</label>
                <input
                  type="text"
                  value={newRaga}
                  onChange={(e) => setNewRaga(e.target.value)}
                  className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
                />
              </div>
              <div>
                <label className="block text-[#BDB4A4] mb-1">Estimated Minutes:</label>
                <input
                  type="number"
                  min={2}
                  max={90}
                  value={newDuration}
                  onChange={(e) => setNewDuration(Math.max(2, parseInt(e.target.value, 10) || 10))}
                  className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
                />
              </div>
              <button
                onClick={handleAddKutcheriItem}
                className="w-full py-3 rounded-xl nv-gold-btn text-[#11110F] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Append to Concert Setlist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: DISTRACTION-FREE LIVE PERFORMANCE STAGE MODE (Section 12)
      ===================================================================== */}
      {activeTab === 'stage-mode' && (
        <div
          className={`rounded-3xl border p-6 sm:p-10 shadow-2xl space-y-6 transition-colors ${
            stageTheme === 'light'
              ? 'bg-[#F8F3E6] text-[#181612] border-[#C7A45B]'
              : 'bg-[#0D0C0A] text-[#F4EBDD] border-[#C7A45B]/50'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#C7A45B]/30">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Maximize2 className="w-4 h-4 text-[#C7A45B]" />
              <span className="uppercase font-bold">
                Live Stage Performance Mode • Adhara Sa: {activeTonic.name} ({activeTonic.kattai})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStageTheme(stageTheme === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] text-[#E0C98F] border border-[#C7A45B]/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                {stageTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{stageTheme === 'dark' ? 'High-Contrast Light Sheet' : 'Obsidian Stage Dark'}</span>
              </button>

              {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setStageFontScale(sz)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase cursor-pointer ${
                    stageFontScale === sz
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  {sz}
                </button>
              ))}

              <button
                onClick={() => setIsStageTimerRunning((r) => !r)}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] text-[#6EA887] border border-[#6EA887]/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(stageElapsedSeconds / 60)}m {stageElapsedSeconds % 60}s{' '}
                  {isStageTimerRunning ? '(Pause)' : '(Start Timer)'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-[#C7A45B]">
              Now Performing ({stageItemIndex + 1} of {setlist.length}): {activeStageItem.slotRole}
            </span>
            <h3
              className={`font-serif font-bold leading-tight ${
                stageFontScale === 'xlarge'
                  ? 'text-3xl sm:text-5xl'
                  : stageFontScale === 'large'
                  ? 'text-2xl sm:text-4xl'
                  : 'text-xl sm:text-2xl'
              }`}
            >
              {activeStageItem.title}
            </h3>
            <div className="text-sm sm:text-lg font-mono text-[#C7A45B]">
              Raga: <strong>{activeStageItem.raga}</strong> • Tala: <strong>{activeStageItem.tala}</strong> • Composer:{' '}
              {activeStageItem.composer}
            </div>
            <div
              className={`p-5 rounded-2xl border font-mono ${
                stageTheme === 'light'
                  ? 'bg-[#EFE7D4] border-[#C7A45B]/50 text-[#181612]'
                  : 'bg-[#161511] border-[#3B392F] text-[#E0C98F]'
              } ${stageFontScale === 'xlarge' ? 'text-xl' : stageFontScale === 'large' ? 'text-base' : 'text-sm'}`}
            >
              Stage Cue & Private Notes: {activeStageItem.notes}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#C7A45B]/30">
            <div className="text-xs font-mono opacity-80">
              Up Next: <strong>{nextStageItem ? `${nextStageItem.title} (${nextStageItem.raga})` : 'Mangalam'}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => audioEngine.auditionNote(activeTonic.frequency, 0.9)}
                className="px-4 py-2.5 rounded-xl bg-[#22221D] text-[#E0C98F] border border-[#C7A45B]/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#C7A45B]" />
                <span>Check Shruti ({activeTonic.name})</span>
              </button>
              <button
                onClick={() => setStageItemIndex((i) => (i + 1) % Math.max(1, setlist.length))}
                className="px-5 py-2.5 rounded-xl nv-gold-btn text-[#11110F] font-bold text-xs cursor-pointer"
              >
                Next Piece →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: VIRTUAL CARNATIC ENSEMBLE & ACCOMPANIMENT MIXER (Sec 9 & 10)
      ===================================================================== */}
      {activeTab === 'ensemble' && (
        <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/25 flex items-start gap-3 text-xs text-[#BDB4A4]">
            <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#E0C98F]">Synthesized Practice Ensemble Disclosure: </strong>
              All ensemble tracks (Tanpura, Veena, Violin, Flute, Mridangam, Ghatam) are generated in real time via Web Audio API physical modeling and harmonic oscillators for practice accompaniment—never claimed as studio recordings of human performers.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-mono text-[#C7A45B]">Lead Melodic Timbre:</label>
              <select
                value={leadInstrument}
                onChange={(e) => setLeadInstrument(e.target.value as any)}
                className="bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-xs font-mono text-[#F4EBDD]"
              >
                <option value="carnatic-violin">Carnatic Violin (Pa-Sa-Pa-Sa)</option>
                <option value="saraswati-veena">Saraswati Veena</option>
                <option value="carnatic-flute">Venu (Bamboo Flute)</option>
              </select>

              <span className="text-xs font-mono text-[#BDB4A4]">Tempo: {ensembleBpm} BPM</span>
              <input
                type="range"
                min={45}
                max={160}
                value={ensembleBpm}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setEnsembleBpm(v);
                  audioEngine.setTalaBpm(v);
                }}
                className="w-28 accent-[#C7A45B]"
              />
            </div>

            <button
              onClick={handleToggleVirtualEnsemble}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                isEnsemblePlaying ? 'bg-[#E17D73] text-[#11110F]' : 'nv-gold-btn text-[#11110F]'
              }`}
            >
              {isEnsemblePlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isEnsemblePlaying ? 'Stop Virtual Ensemble' : 'Start Synchronized Ensemble'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '1. Tanpura Drone (Pa-Sa-Sa)', vol: tanpuraVol, setVol: setTanpuraVol },
              { label: '2. Melodic Lead Phrase', vol: leadMelodicVol, setVol: setLeadMelodicVol },
              { label: '3. Mridangam Solkattu', vol: mridangamVol, setVol: setMridangamVol },
              { label: '4. Upapakkavadyam (Ghatam)', vol: ghatamVol, setVol: setGhatamVol },
            ].map((ch) => (
              <div key={ch.label} className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4EBDD] font-bold">{ch.label}</span>
                  <span className="text-[#E0C98F]">{Math.round(ch.vol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={ch.vol}
                  onChange={(e) => ch.setVol(parseFloat(e.target.value))}
                  className="w-full accent-[#C7A45B]"
                />
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => ch.setVol(0)}
                    className="flex-1 py-1 rounded-lg bg-[#22221D] text-[11px] font-mono text-[#BDB4A4] hover:text-[#F4EBDD] cursor-pointer"
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => ch.setVol(0.85)}
                    className="flex-1 py-1 rounded-lg bg-[#22221D] text-[11px] font-mono text-[#E0C98F] cursor-pointer"
                  >
                    85%
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: DIGITAL MUSIC NOTEBOOK & REPERTOIRE NOTES (Sections 13 & 14)
      ===================================================================== */}
      {activeTab === 'notebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
              Private Musician Notebook ({notebookEntries.length} Entries)
            </h3>
            <div className="space-y-3">
              {notebookEntries.map((entry) => (
                <div key={entry.id} className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="uppercase px-2 py-0.5 rounded bg-[#C7A45B]/15 text-[#E0C98F]">
                      {entry.tag}
                    </span>
                    <span className="text-[#87947A]">{entry.updatedAt}</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-[#F4EBDD]">{entry.title}</div>
                  <p className="text-xs text-[#BDB4A4] leading-relaxed">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl self-start">
            <h3 className="text-base font-serif font-bold text-[#F4EBDD]">New Notebook Reflection</h3>
            <div className="space-y-3 text-xs font-mono">
              <input
                type="text"
                value={noteTitleInput}
                onChange={(e) => setNoteTitleInput(e.target.value)}
                placeholder="Observation title..."
                className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
              <select
                value={noteTagInput}
                onChange={(e) => setNoteTagInput(e.target.value as any)}
                className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              >
                <option value="raga">Raga Lakshana Observation</option>
                <option value="tala">Tala & Korvai Calculation</option>
                <option value="concert">Concert / Kutcheri Reflection</option>
                <option value="lesson">Gurukulam Lesson Note</option>
              </select>
              <textarea
                rows={3}
                value={noteBodyInput}
                onChange={(e) => setNoteBodyInput(e.target.value)}
                placeholder="Write private swara annotations, guru instructions, or research notes..."
                className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl p-3 text-[#F4EBDD]"
              />
              <button
                onClick={handleAddNotebookEntry}
                className="w-full py-2.5 rounded-xl nv-gold-btn text-[#11110F] font-bold text-xs cursor-pointer"
              >
                Save to Private Notebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
