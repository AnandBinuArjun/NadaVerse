'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface PlaylistItem {
  id: string;
  title: string;
  category: 'sarali' | 'jantai' | 'alankaram' | 'varnam' | 'swara_exercise';
  targetKalam: 1 | 2 | 3;
  targetBpm: number;
  repetitions: number;
  completedRepetitions: number;
  notes?: string;
  swaraNotation?: string;
}

export interface PracticePlaylist {
  id: string;
  name: string;
  description: string;
  items: PlaylistItem[];
  createdAt: string;
}

const DEFAULT_PLAYLISTS: PracticePlaylist[] = [
  {
    id: 'pl-warmup-15',
    name: '15-Minute Fundamental Warmup',
    description: 'Sarali Varisais 1 to 4 executed in 1st & 2nd Kalam with steady Tala pulse.',
    createdAt: '2026-10-17T00:00:00Z',
    items: [
      {
        id: 'item-1',
        title: 'Sarali Varisai 1 (Straight Octave Stride)',
        category: 'sarali',
        targetKalam: 1,
        targetBpm: 60,
        repetitions: 2,
        completedRepetitions: 0,
        swaraNotation: 'S R G M | P D | N S || S N D P | M G | R S ||',
        notes: 'Focus on pure Adhara Sa and symmetrical breath distribution.',
      },
      {
        id: 'item-2',
        title: 'Sarali Varisai 2 (Double Step Ascent)',
        category: 'sarali',
        targetKalam: 1,
        targetBpm: 60,
        repetitions: 2,
        completedRepetitions: 0,
        swaraNotation: 'S R S R | S R | G M || S R G M | P D | N S ||',
        notes: 'Check Shuddha Rishabham (R1) against tanpura drone.',
      },
      {
        id: 'item-3',
        title: 'Sarali Varisai 3 (Triple Step Progression)',
        category: 'sarali',
        targetKalam: 2,
        targetBpm: 60,
        repetitions: 2,
        completedRepetitions: 0,
        swaraNotation: 'S R G S | R G | S R || S R G M | P D | N S ||',
        notes: 'Double speed (2 notes per akshara). Keep hand kriya firm.',
      },
      {
        id: 'item-4',
        title: 'Sarali Varisai 4 (Intervallic Swaravali)',
        category: 'sarali',
        targetKalam: 2,
        targetBpm: 64,
        repetitions: 2,
        completedRepetitions: 0,
        swaraNotation: 'S R G M | S R | G M || S R G M | P D | N S ||',
        notes: 'Prepare tongue / plectrum agility for Jantai varisais.',
      },
    ],
  },
  {
    id: 'pl-jantai-sphuritam',
    name: 'Jantai Articulation & Sphuritam Drill',
    description: 'Twin-swara stress articulation (sphuritam) across Mayamalavagowla.',
    createdAt: '2026-10-17T00:00:00Z',
    items: [
      {
        id: 'item-j1',
        title: 'Jantai Varisai 1 (Twin Swara Direct Stress)',
        category: 'jantai',
        targetKalam: 1,
        targetBpm: 56,
        repetitions: 3,
        completedRepetitions: 0,
        swaraNotation: 'S S R R | G G | M M || P P D D | N N | S S ||',
        notes: 'Second note in pair receives downward inflection from next higher swara.',
      },
      {
        id: 'item-j2',
        title: 'Jantai Varisai 2 (Interspersed Accent Pairs)',
        category: 'jantai',
        targetKalam: 2,
        targetBpm: 60,
        repetitions: 2,
        completedRepetitions: 0,
        swaraNotation: 'S S R R | G G | M M || S R G M | P D | N S ||',
        notes: 'Transition cleanly from twin notes into straight kalam.',
      },
    ],
  },
];

export const PracticePlaylistRunner: React.FC = () => {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  const [playlists, setPlaylists] = useState<PracticePlaylist[]>(DEFAULT_PLAYLISTS);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(DEFAULT_PLAYLISTS[0].id);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Load user playlists from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nadaverse_custom_playlists');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlaylists(parsed);
          setSelectedPlaylistId(parsed[0].id);
        }
      }
    } catch {
      // fallback to default
    }
  }, []);

  const savePlaylists = (newPlaylists: PracticePlaylist[]) => {
    setPlaylists(newPlaylists);
    localStorage.setItem('nadaverse_custom_playlists', JSON.stringify(newPlaylists));
  };

  const currentPlaylist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];
  const currentItem = currentPlaylist.items[activeItemIndex] || currentPlaylist.items[0];

  const handleIncrementRep = () => {
    if (!currentItem) return;
    const updatedItems = [...currentPlaylist.items];
    const item = { ...updatedItems[activeItemIndex] };
    item.completedRepetitions = (item.completedRepetitions || 0) + 1;
    updatedItems[activeItemIndex] = item;

    const updatedPl = { ...currentPlaylist, items: updatedItems };
    const updatedPlaylists = playlists.map((p) => (p.id === updatedPl.id ? updatedPl : p));
    savePlaylists(updatedPlaylists);

    // Auto-advance if reached target
    if (item.completedRepetitions >= item.repetitions && activeItemIndex < currentPlaylist.items.length - 1) {
      setActiveItemIndex(activeItemIndex + 1);
    }
  };

  const handleResetReps = () => {
    const updatedItems = currentPlaylist.items.map((i) => ({ ...i, completedRepetitions: 0 }));
    const updatedPl = { ...currentPlaylist, items: updatedItems };
    const updatedPlaylists = playlists.map((p) => (p.id === updatedPl.id ? updatedPl : p));
    savePlaylists(updatedPlaylists);
    setActiveItemIndex(0);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentPlaylist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentPlaylist.name.toLowerCase().replace(/\s+/g, '_')}_playlist.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJsonText);
      if (!parsed.name || !Array.isArray(parsed.items) || parsed.items.length === 0) {
        throw new Error('Invalid playlist format: Must contain a name and items array.');
      }
      const importedPl: PracticePlaylist = {
        id: `pl-${Date.now()}`,
        name: parsed.name,
        description: parsed.description || 'Imported user playlist',
        items: parsed.items.map((item: any, i: number) => ({
          id: item.id || `item-${i + 1}`,
          title: item.title || `Exercise ${i + 1}`,
          category: item.category || 'swara_exercise',
          targetKalam: item.targetKalam || 1,
          targetBpm: item.targetBpm || 60,
          repetitions: item.repetitions || 2,
          completedRepetitions: 0,
          swaraNotation: item.swaraNotation || '',
          notes: item.notes || '',
        })),
        createdAt: new Date().toISOString(),
      };

      const updated = [importedPl, ...playlists];
      savePlaylists(updated);
      setSelectedPlaylistId(importedPl.id);
      setActiveItemIndex(0);
      setIsImportModalOpen(false);
      setImportJsonText('');
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse JSON playlist.');
    }
  };

  const totalCompletedInList = currentPlaylist.items.reduce((sum, item) => sum + (item.completedRepetitions || 0), 0);
  const totalTargetInList = currentPlaylist.items.reduce((sum, item) => sum + item.repetitions, 0);

  return (
    <div className="bg-stone-900/90 border border-amber-900/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header & Playlist Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {isMl ? 'അഭ്യാസ പ്ലേലിസ്റ്റ് റണ്ണർ' : 'Practice Playlist Runner'}
            </span>
            <span className="text-xs text-stone-400">Sequential Loops · Kalam Lock</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-100">
            {isMl ? 'ക്രമബദ്ധമായ അഭ്യാസ പ്ലേലിസ്റ്റുകൾ' : 'Ordered Practice Playlists'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {isMl
              ? 'വരിശകളും അലങ്കാരങ്ങളും നിശ്ചിത ആവർത്തനങ്ങളോടെ അനുക്രമമായി പരിശീലിക്കുക.'
              : 'Assemble, loop, and master structured Carnatic sequences with automatic progression.'}
          </p>
        </div>

        {/* Playlist Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedPlaylistId}
            onChange={(e) => {
              setSelectedPlaylistId(e.target.value);
              setActiveItemIndex(0);
            }}
            className="px-3 py-1.5 rounded-lg text-xs bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            {playlists.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name} ({pl.items.length} items)
              </option>
            ))}
          </select>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-700 hover:border-amber-500 text-stone-300 hover:text-amber-200 transition-colors"
            title="Export playlist as JSON"
          >
            Export JSON
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-700 hover:border-amber-500 text-stone-300 hover:text-amber-200 transition-colors"
          >
            Import JSON
          </button>
        </div>
      </div>

      {/* Active Exercise Stage */}
      {currentItem && (
        <div className="my-6 p-5 rounded-2xl bg-stone-950/80 border border-amber-900/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Item {activeItemIndex + 1} of {currentPlaylist.items.length}
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                {currentItem.category}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-300 font-mono">
              <span className="bg-stone-900 px-2 py-1 rounded border border-stone-800">
                Kalam: <strong className="text-amber-300">{currentItem.targetKalam}</strong>
              </span>
              <span className="bg-stone-900 px-2 py-1 rounded border border-stone-800">
                Target BPM: <strong className="text-amber-300">{currentItem.targetBpm}</strong>
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-amber-100 mt-4">{currentItem.title}</h3>

          {/* Notation Display */}
          {currentItem.swaraNotation && (
            <div className="my-4 p-4 rounded-xl bg-stone-900/90 border border-stone-800 font-mono text-sm text-amber-200 tracking-wider overflow-x-auto select-all">
              {currentItem.swaraNotation}
            </div>
          )}

          {currentItem.notes && (
            <p className="text-xs text-stone-400 italic mb-5">
              Guru Guidance: {currentItem.notes}
            </p>
          )}

          {/* Repetition Counter & Controller */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-800/80">
            <div className="flex items-center gap-3">
              <div className="text-sm text-stone-300">
                Repetitions:{' '}
                <span className="font-mono text-lg font-bold text-emerald-400">
                  {currentItem.completedRepetitions}
                </span>{' '}
                / <span className="font-mono text-stone-400">{currentItem.repetitions}</span>
              </div>
              <button
                onClick={handleIncrementRep}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-stone-950 transition-colors shadow-sm flex items-center gap-1"
              >
                +1 Rep Done
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={activeItemIndex === 0}
                onClick={() => setActiveItemIndex(activeItemIndex - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 disabled:opacity-30"
              >
                Previous Item
              </button>
              <button
                disabled={activeItemIndex === currentPlaylist.items.length - 1}
                onClick={() => setActiveItemIndex(activeItemIndex + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors disabled:opacity-30"
              >
                Next Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Overview Queue */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
          <span className="font-medium text-stone-300">
            Playlist Progress: {totalCompletedInList} / {totalTargetInList} Repetitions Completed
          </span>
          <button
            onClick={handleResetReps}
            className="text-stone-500 hover:text-amber-400 text-xs transition-colors"
          >
            Reset Progress
          </button>
        </div>

        <div className="space-y-2">
          {currentPlaylist.items.map((item, idx) => {
            const isCurrent = idx === activeItemIndex;
            const isComplete = item.completedRepetitions >= item.repetitions;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItemIndex(idx)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : isComplete
                    ? 'bg-stone-950/30 border-stone-800/50 text-stone-500'
                    : 'bg-stone-900/40 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-stone-500 min-w-5">{idx + 1}.</span>
                  <span className={`font-semibold ${isComplete ? 'line-through' : ''}`}>{item.title}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-stone-400">
                    {item.completedRepetitions}/{item.repetitions} reps
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                    {item.targetBpm} BPM
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-amber-100">Import Playlist JSON</h3>
            <p className="text-xs text-stone-400">
              Paste documented NadaVerse playlist JSON to import exercises into your browser storage.
            </p>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              rows={8}
              className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />

            {importError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2.5 rounded-lg">
                {importError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-stone-800 text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors"
              >
                Import Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
