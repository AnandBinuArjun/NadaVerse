'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Command,
  X,
  Compass,
  Sliders,
  BookOpen,
  Volume2,
  Sparkles,
  Headphones,
  Music,
  GraduationCap,
  Landmark,
  Languages,
  Mic,
  ArrowRight,
  Clock,
  GitCompare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  VERIFIED_RAGAS,
  VERIFIED_TALAS,
  VERIFIED_INSTRUMENTS,
  VERIFIED_COMPOSERS,
  GLOSSARY_TERMS
} from '../data/carnaticData';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { CURATED_LISTENING_COMPOSITIONS } from '../data/listeningLibraryData';
import { VERIFIED_COMPOSITIONS } from '../data/compositionLibraryData';
import { audioEngine } from '../lib/audioEngine';

export interface CommandPaletteAction {
  id: string;
  category: 'raga' | 'tala' | 'instrument' | 'composer' | 'lesson' | 'listening' | 'composition' | 'glossary' | 'tool';
  categoryLabelEn: string;
  categoryLabelMl: string;
  title: string;
  titleMl?: string;
  subtitle: string;
  subtitleMl?: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (section: 'home' | 'learn' | 'explore' | 'practice' | 'compositions' | 'violin' | 'teaching' | 'heritage') => void;
  onSelectExploreTab: (tab: 'ragas' | 'talas' | 'instruments' | 'composers' | 'glossary' | 'library' | 'compositions') => void;
  onOpenTutor: (topic?: string) => void;
  onOpenCalibration: () => void;
  onOpenOfflinePacks: () => void;
  onOpenRagaComparison?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onSelectExploreTab,
  onOpenTutor,
  onOpenCalibration,
  onOpenOfflinePacks,
  onOpenRagaComparison,
}) => {
  const { lang, toggleLang } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [recentSearchIds, setRecentSearchIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nadaverse_recent_searches');
        if (stored) {
          setRecentSearchIds(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveCategoryFilter('all');
    }
  }, [isOpen]);

  // Record a selected search to recents
  const saveRecent = (id: string) => {
    if (typeof window !== 'undefined') {
      try {
        const updated = [id, ...recentSearchIds.filter((item) => item !== id)].slice(0, 6);
        setRecentSearchIds(updated);
        localStorage.setItem('nadaverse_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  // Build the comprehensive catalog of searchable commands and items
  const allActions: CommandPaletteAction[] = useMemo(() => {
    const list: CommandPaletteAction[] = [];

    // 1. Navigation & Tools
    list.push(
      {
        id: 'tool-tanpura-toggle',
        category: 'tool',
        categoryLabelEn: 'Tool',
        categoryLabelMl: 'സഹായി',
        title: 'Toggle Tanpura Drone',
        titleMl: 'തംബുരു ശ്രുതി ഓൺ / ഓഫ് ചെയ്യുക',
        subtitle: 'Start or silence pure Just Intonation Tanpura drone',
        subtitleMl: 'ജസ്റ്റ് ഇൻ്റോണേഷൻ തംബുരു ശ്രുതി ആരംഭിക്കുക / നിർത്തുക',
        keywords: ['drone', 'tanpura', 'shruti', 'tambura', 'audio', 'sound'],
        icon: Volume2,
        onSelect: () => {
          if (audioEngine.getIsTanpuraPlaying()) {
            audioEngine.stopTanpura();
          } else {
            audioEngine.startTanpura(261.63, 0.7);
          }
        },
      },
      {
        id: 'tool-ai-tutor',
        category: 'tool',
        categoryLabelEn: 'AI Tutor',
        categoryLabelMl: 'എഐ ഗുരു',
        title: 'Ask Grounded Musicology Tutor',
        titleMl: 'കർണാടക സംഗീത എഐ ഗുരുവിനോട് ചോദിക്കുക',
        subtitle: 'Consult treatise-grounded AI music tutor with evidence links',
        subtitleMl: 'ശാസ്ത്രഗ്രന്ഥ ആധാരമുള്ള സംഗീത മാർഗ്ഗനിർദ്ദേശം',
        keywords: ['tutor', 'ai', 'ask', 'question', 'chat', 'guru'],
        icon: Sparkles,
        onSelect: () => {
          onOpenTutor();
        },
      },
      {
        id: 'tool-practice-studio',
        category: 'tool',
        categoryLabelEn: 'Studio',
        categoryLabelMl: 'കളരി',
        title: 'Open Practice Studio',
        titleMl: 'സാധക കളരി തുറക്കുക',
        subtitle: 'Tanpura drone, Tala metronome, and acoustic pitch tuner',
        subtitleMl: 'ശ്രുതി, താള മെട്രോനോം, ട്യൂണർ എന്നിവ അടങ്ങിയ കളരി',
        keywords: ['practice', 'studio', 'metronome', 'tala', 'tuner'],
        icon: Sliders,
        onSelect: () => {
          onNavigateSection('practice');
        },
      },
      {
        id: 'tool-violin-studio',
        category: 'tool',
        categoryLabelEn: 'Violin',
        categoryLabelMl: 'വയലിൻ',
        title: 'Carnatic Violin Practice Studio',
        titleMl: 'കർണാടക വയലിൻ സാധക കളരി',
        subtitle: 'Pa-Sa-Pa-Sa tuner, Long-Bow Timer, and Fretless String-Crossing Trainer',
        subtitleMl: 'പ-സ-പ-സ ശ്രുതി ട്യൂണർ, ലോങ് ബോ ടൈമർ, ഫ്രെറ്റ്‌ലെസ്സ് ഫിംഗറിംഗ് സഹായി',
        keywords: ['violin', 'carnatic violin', 'bowing', 'string crossing', 'tuner', 'fretless', 'long bow', 'vadhyam'],
        icon: Music,
        onSelect: () => {
          onNavigateSection('violin');
        },
      },
      {
        id: 'tool-curated-listening',
        category: 'tool',
        categoryLabelEn: 'Listening',
        categoryLabelMl: 'കേൾവി',
        title: 'Curated Listening Library (Kelvi Gnanam)',
        titleMl: 'കേൾവി ജ്ഞാനം • ആധികാരിക ശ്രവണ സമാഹാരം',
        subtitle: 'Structured ear training and analysis of canonical compositions',
        subtitleMl: 'കൃതികളുടെ ഘടനാ വിശകലനവും സ്വര ശ്രവണ പരിശീലനവും',
        keywords: ['listening', 'kelvi', 'library', 'compositions', 'varnam', 'krithi'],
        icon: Headphones,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('library');
        },
      },
      {
        id: 'tool-compositions-library',
        category: 'tool',
        categoryLabelEn: 'Library',
        categoryLabelMl: 'ലൈബ്രറി',
        title: 'Playable Carnatic Compositions Library',
        titleMl: 'കർണ്ണാടക സംഗീത രചനാ ലൈബ്രറി (വർണ്ണങ്ങളും കൃതികളും)',
        subtitle: 'Playable Varnams, Keerthanams, Geethams, and Violin practice pieces',
        subtitleMl: 'വർണ്ണങ്ങൾ, കൃതികൾ, ഗീതങ്ങൾ, വയലിൻ പാഠങ്ങൾ എന്നിവ കേൾക്കാനും പഠിക്കാനും',
        keywords: ['composition', 'varnam', 'keerthanam', 'kriti', 'geetham', 'swarajathi', 'varisai', 'violin piece', 'notation', 'score', 'play'],
        icon: Music,
        onSelect: () => {
          onNavigateSection('compositions');
        },
      },
      {
        id: 'tool-audio-calibration',
        category: 'tool',
        categoryLabelEn: 'Calibration',
        categoryLabelMl: 'കാലിബ്രേഷൻ',
        title: 'Microphone & Audio Calibration Wizard',
        titleMl: 'മൈക്രോഫോൺ കാലിബ്രേഷൻ വിസാർഡ്',
        subtitle: 'Test ambient room noise floor and input gain levels',
        subtitleMl: 'മുറിയിലെ പശ്ചാത്തല ശബ്ദവും മൈക്ക് ഇൻപുട്ടും ക്രമീകരിക്കുക',
        keywords: ['mic', 'microphone', 'calibration', 'gain', 'noise', 'audio'],
        icon: Mic,
        onSelect: () => {
          onOpenCalibration();
        },
      },
      {
        id: 'tool-offline-packs',
        category: 'tool',
        categoryLabelEn: 'Offline',
        categoryLabelMl: 'ഓഫ്‌ലൈൻ',
        title: 'Offline Pack Manager',
        titleMl: 'ഓഫ്‌ലൈൻ പാക്കേജ് മാനേജർ',
        subtitle: 'Download lessons, audio models, and ragas for offline access',
        subtitleMl: 'ഇന്റർനെറ്റ് ഇല്ലാതെ സാധകം ചെയ്യാൻ പാക്കുകൾ ഡൗൺലോഡ് ചെയ്യുക',
        keywords: ['offline', 'cache', 'download', 'storage', 'pwa'],
        icon: Landmark,
        onSelect: () => {
          onOpenOfflinePacks();
        },
      },
      {
        id: 'tool-raga-comparison',
        category: 'tool',
        categoryLabelEn: 'Analysis',
        categoryLabelMl: 'വിശകലനം',
        title: 'Compare Ragas Side-by-Side',
        titleMl: 'രാഗ താരതമ്യ വിശകലനം',
        subtitle: 'Compare swarasthana intervals, shared swaras, and scale differences',
        subtitleMl: 'രണ്ട് രാഗങ്ങളുടെ സ്വരസ്ഥാനങ്ങളും പ്രയോഗങ്ങളും താരതമ്യം ചെയ്യുക',
        keywords: ['compare', 'raga', 'comparison', 'swarasthana', 'scale', 'difference'],
        icon: GitCompare,
        onSelect: () => {
          if (onOpenRagaComparison) onOpenRagaComparison();
        },
      },
      {
        id: 'tool-toggle-language',
        category: 'tool',
        categoryLabelEn: 'Language',
        categoryLabelMl: 'ഭാഷ',
        title: `Switch Language (${lang === 'en' ? 'മലയാളം' : 'English'})`,
        titleMl: `ഭാഷ മാറ്റുക (${lang === 'en' ? 'മലയാളം' : 'English'})`,
        subtitle: 'Toggle UI language between English and Malayalam',
        subtitleMl: 'ഇന്റർഫേസ് ഭാഷ മാറ്റുക',
        keywords: ['language', 'malayalam', 'english', 'translate', 'bilingual'],
        icon: Languages,
        onSelect: () => {
          toggleLang();
        },
      }
    );

    // 2. Verified Ragas
    VERIFIED_RAGAS.forEach((raga) => {
      list.push({
        id: `raga-${raga.slug}`,
        category: 'raga',
        categoryLabelEn: 'Raga',
        categoryLabelMl: 'രാഗം',
        title: raga.canonicalName,
        titleMl: raga.canonicalName,
        subtitle: `${raga.isMelakarta ? `Melakarta #${raga.melakartaNumber}` : 'Janya Raga'} • Aro: ${raga.arohanam}`,
        subtitleMl: `${raga.isMelakarta ? `${raga.melakartaNumber}-ാം മേളകർത്ത` : 'ജന്യ രാഗം'}${raga.chakra ? ` • ${raga.chakra}` : ''}`,
        keywords: [
          raga.canonicalName,
          raga.slug,
          ...(raga.alternateNames || []),
          raga.arohanam,
          raga.avarohanam,
          raga.chakra || '',
          'raga',
          raga.isMelakarta ? 'melakarta' : 'janya'
        ].filter(Boolean),
        icon: Music,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('ragas');
        },
      });
    });

    // 3. Verified Talas
    VERIFIED_TALAS.forEach((tala) => {
      list.push({
        id: `tala-${tala.id}`,
        category: 'tala',
        categoryLabelEn: 'Tala',
        categoryLabelMl: 'താളം',
        title: tala.canonicalName,
        titleMl: tala.canonicalName,
        subtitle: `${tala.totalAksharas} aksharas • Angas: ${tala.angasFormula}`,
        subtitleMl: `${tala.totalAksharas} അക്ഷരങ്ങൾ • അംഗങ്ങൾ: ${tala.angasFormula}`,
        keywords: [tala.canonicalName, tala.slug, tala.angasFormula, tala.jati, 'tala', 'laya', 'rhythm'],
        icon: Sliders,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('talas');
        },
      });
    });

    // 4. Verified Instruments
    VERIFIED_INSTRUMENTS.forEach((inst) => {
      list.push({
        id: `instrument-${inst.slug}`,
        category: 'instrument',
        categoryLabelEn: 'Instrument',
        categoryLabelMl: 'വാദ്യം',
        title: inst.canonicalName,
        titleMl: inst.canonicalName,
        subtitle: `${inst.family} • ${inst.playingTechnique.slice(0, 60)}...`,
        subtitleMl: `${inst.family} വാദ്യം`,
        keywords: [inst.canonicalName, inst.slug, inst.family, 'instrument', 'vadya'],
        icon: Compass,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('instruments');
        },
      });
    });

    // 5. Verified Composers
    VERIFIED_COMPOSERS.forEach((comp) => {
      list.push({
        id: `composer-${comp.slug}`,
        category: 'composer',
        categoryLabelEn: 'Composer',
        categoryLabelMl: 'വാഗ്ഗേയകാരൻ',
        title: comp.name,
        titleMl: comp.name,
        subtitle: `${comp.lifespan} • Mudra: ${comp.signatureMudra || 'Traditional'}`,
        subtitleMl: `${comp.lifespan} • മുദ്ര: ${comp.signatureMudra || 'പരമ്പരാഗതം'}`,
        keywords: [comp.name, comp.slug, comp.signatureMudra, comp.tradition, 'composer', 'vaggeyakara'],
        icon: Landmark,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('composers');
        },
      });
    });

    // 6. Curriculum Lessons
    CURRICULUM_LESSONS.forEach((lesson) => {
      list.push({
        id: `lesson-${lesson.slug}`,
        category: 'lesson',
        categoryLabelEn: 'Lesson',
        categoryLabelMl: 'പാഠം',
        title: lesson.title,
        titleMl: lesson.titleMl,
        subtitle: `${lesson.pathwayId.toUpperCase()} • ${lesson.skillLevel} • ${lesson.subtitle}`,
        subtitleMl: `${lesson.skillLevelMl} • ${lesson.subtitleMl}`,
        keywords: [lesson.title, lesson.titleMl, lesson.pathwayId, lesson.skillLevel, 'lesson', 'curriculum', 'learn'],
        icon: GraduationCap,
        onSelect: () => {
          onNavigateSection('learn');
        },
      });
    });

    // 7. Listening Compositions
    CURATED_LISTENING_COMPOSITIONS.forEach((comp) => {
      list.push({
        id: `listening-${comp.id}`,
        category: 'listening',
        categoryLabelEn: 'Composition',
        categoryLabelMl: 'കൃതി',
        title: comp.title,
        titleMl: comp.titleMl,
        subtitle: `${comp.form} in ${comp.ragaName} • ${comp.composerName}`,
        subtitleMl: `${comp.ragaMl} • ${comp.composerMl}`,
        keywords: [
          comp.title,
          comp.titleMl,
          comp.ragaName,
          comp.ragaMl,
          comp.composerName,
          comp.form,
          'composition',
          'listening'
        ],
        icon: Headphones,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('library');
        },
      });
    });

    // 8. Glossary Terms
    GLOSSARY_TERMS.slice(0, 20).forEach((term) => {
      list.push({
        id: `glossary-${term.term.toLowerCase()}`,
        category: 'glossary',
        categoryLabelEn: 'Glossary',
        categoryLabelMl: 'നിഘണ്ടു',
        title: term.term,
        titleMl: term.term,
        subtitle: `${term.category} • ${term.simpleExplanation}`,
        subtitleMl: term.simpleExplanation,
        keywords: [term.term, term.category, 'glossary', 'definition', 'term'],
        icon: BookOpen,
        onSelect: () => {
          onNavigateSection('explore');
          onSelectExploreTab('glossary');
        },
      });
    });

    // 9. Playable Carnatic Compositions
    VERIFIED_COMPOSITIONS.forEach((comp) => {
      list.push({
        id: `composition-${comp.slug}`,
        category: 'composition',
        categoryLabelEn: 'Composition',
        categoryLabelMl: 'രചന',
        title: comp.title,
        titleMl: comp.titleMl,
        subtitle: `${comp.ragaName} • ${comp.talaName} • ${comp.composerName}`,
        subtitleMl: `${comp.ragaMl} • ${comp.talaMl} • ${comp.composerMl}`,
        keywords: [
          comp.title,
          comp.titleMl,
          comp.slug,
          comp.ragaName,
          comp.ragaMl,
          comp.talaName,
          comp.composerName,
          comp.category,
          'composition',
          'swara',
          'varnam',
          'keerthanam'
        ],
        icon: Music,
        onSelect: () => {
          onNavigateSection('compositions');
        },
      });
    });

    return list;
  }, [lang, onNavigateSection, onSelectExploreTab, onOpenTutor, onOpenCalibration, onOpenOfflinePacks, onOpenRagaComparison, toggleLang]);

  // Filter actions based on query and category chip
  const filteredActions = useMemo(() => {
    let base = allActions;

    // Filter by category chip
    if (activeCategoryFilter !== 'all') {
      base = base.filter((action) => action.category === activeCategoryFilter);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // If no query, return recent searches first, followed by key tools
      if (recentSearchIds.length > 0) {
        const recents = recentSearchIds
          .map((id) => allActions.find((a) => a.id === id))
          .filter(Boolean) as CommandPaletteAction[];
        const others = base.filter((a) => !recentSearchIds.includes(a.id));
        return [...recents, ...others].slice(0, 12);
      }
      return base.slice(0, 12);
    }

    // Keyword matching
    return base
      .filter((action) => {
        const titleMatch = action.title.toLowerCase().includes(trimmed);
        const titleMlMatch = action.titleMl ? action.titleMl.includes(trimmed) : false;
        const subMatch = action.subtitle.toLowerCase().includes(trimmed);
        const subMlMatch = action.subtitleMl ? action.subtitleMl.includes(trimmed) : false;
        const kwMatch = action.keywords.some((k) => k.toLowerCase().includes(trimmed));

        return titleMatch || titleMlMatch || subMatch || subMlMatch || kwMatch;
      })
      .slice(0, 25);
  }, [allActions, query, activeCategoryFilter, recentSearchIds]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredActions.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        const chosen = filteredActions[selectedIndex];
        saveRecent(chosen.id);
        chosen.onSelect();
        onClose();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Global hotkey listener: Ctrl+K, Cmd+K, or "/"
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via synthetic click or event
          window.dispatchEvent(new CustomEvent('nadaverse:open_command_palette'));
        }
      } else if (
        e.key === '/' &&
        !['input', 'textarea', 'select'].includes(
          (document.activeElement?.tagName || '').toLowerCase()
        )
      ) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('nadaverse:open_command_palette'));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryChips: { id: string; labelEn: string; labelMl: string }[] = [
    { id: 'all', labelEn: 'All', labelMl: 'എല്ലാം' },
    { id: 'raga', labelEn: 'Ragas', labelMl: 'രാഗങ്ങൾ' },
    { id: 'tala', labelEn: 'Talas', labelMl: 'താളങ്ങൾ' },
    { id: 'composition', labelEn: 'Compositions', labelMl: 'രചനകൾ' },
    { id: 'listening', labelEn: 'Listening', labelMl: 'കേൾവി' },
    { id: 'lesson', labelEn: 'Lessons', labelMl: 'പാഠങ്ങൾ' },
    { id: 'tool', labelEn: 'Tools', labelMl: 'സഹായികൾ' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#14120e] border border-[#C7A45B]/40 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150 ring-1 ring-[#C7A45B]/20"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#C7A45B]/20 flex items-center gap-3 bg-[#181611]/90">
          <Search className="w-5 h-5 text-[#C7A45B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              lang === 'ml'
                ? 'രാഗം, താളം, വാഗ്ഗേയകാരൻ, കൃതി, പാഠം അല്ലെങ്കിൽ സഹായി തിരയുക...'
                : 'Search ragas, talas, compositions, lessons, tools, or glossary (Ctrl+K)...'
            }
            className="w-full bg-transparent text-sm text-[#F4EBDD] placeholder-[#A89E8C]/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-[#A89E8C] hover:text-[#F4EBDD]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[#A89E8C] bg-[#222019] rounded border border-[#C7A45B]/20">
            <span>ESC</span>
          </kbd>
        </div>

        {/* Filter Category Chips */}
        <div className="px-3.5 py-2 bg-[#100f0c] border-b border-[#C7A45B]/15 flex items-center gap-1.5 overflow-x-auto">
          {categoryChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => {
                setActiveCategoryFilter(chip.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all shrink-0 ${
                activeCategoryFilter === chip.id
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-sm'
                  : 'bg-[#1a1813] text-[#A89E8C] hover:text-[#F4EBDD] hover:bg-[#25221b]'
              }`}
            >
              {lang === 'ml' ? chip.labelMl : chip.labelEn}
            </button>
          ))}
        </div>

        {/* Action Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-white/5"
        >
          {filteredActions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Command className="w-8 h-8 text-[#C7A45B]/30 mx-auto" />
              <p className="text-xs text-[#BDB4A4]">
                {lang === 'ml'
                  ? `"${query}" എന്നതിന് ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല.`
                  : `No results matching "${query}".`}
              </p>
              <p className="text-[11px] text-[#A89E8C]">
                {lang === 'ml'
                  ? 'മറ്റൊരു രാഗത്തിന്റെയോ താളത്തിന്റെയോ പേര് നൽകി നോക്കുക.'
                  : 'Try searching for a raga name like "Mayamalavagowla" or tool like "Metronome".'}
              </p>
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = action.icon;
              const isRecent = !query.trim() && recentSearchIds.includes(action.id);

              return (
                <div
                  key={action.id}
                  onClick={() => {
                    saveRecent(action.id);
                    action.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 sm:p-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-[#C7A45B]/20 text-[#F4EBDD] border border-[#C7A45B]/40'
                      : 'hover:bg-white/5 text-[#BDB4A4] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#C7A45B] text-[#11110F]'
                          : 'bg-[#222019] text-[#C7A45B] border border-[#C7A45B]/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F4EBDD] truncate">
                          {lang === 'ml' && action.titleMl ? action.titleMl : action.title}
                        </span>
                        {isRecent && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-[#A89E8C] px-1 rounded bg-white/5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Recent</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A89E8C] truncate">
                        {lang === 'ml' && action.subtitleMl ? action.subtitleMl : action.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1e1c17] text-[#E0C98F] border border-[#C7A45B]/20">
                      {lang === 'ml' ? action.categoryLabelMl : action.categoryLabelEn}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-[#C7A45B] translate-x-0.5' : 'text-transparent'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="p-2.5 bg-[#0f0e0b] border-t border-[#C7A45B]/20 flex items-center justify-between text-[11px] font-mono text-[#A89E8C]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1f1d17] rounded border border-white/10 text-[10px]">↑↓</kbd>
              <span>{lang === 'ml' ? 'സഞ്ചരിക്കുക' : 'Navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1f1d17] rounded border border-white/10 text-[10px]">↵</kbd>
              <span>{lang === 'ml' ? 'തുറക്കുക' : 'Select'}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1f1d17] rounded border border-white/10 text-[10px]">ESC</kbd>
              <span>{lang === 'ml' ? 'അടയ്ക്കുക' : 'Close'}</span>
            </span>
          </div>

          <div className="text-[10px] text-[#C7A45B]/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>NadaVerse Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
};
