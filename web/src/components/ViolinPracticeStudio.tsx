'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Music,
  Activity,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { TONIC_OPTIONS, TonicNote, audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';

export interface ViolinPracticeStudioProps {
  activeTonic: TonicNote;
  onTonicChange: (tonic: TonicNote) => void;
  onLogToJournal?: (title: string, durationMinutes: number, notes: string) => void;
  onAskTutor?: (topic: string) => void;
}

export type ViolinTab = 'curriculum' | 'tuner' | 'longbow' | 'stringcrossing';

export interface ViolinStringConfig {
  number: number;
  label: string;
  swara: string;
  swaraMl: string;
  role: string;
  roleMl: string;
  intervalRatio: number; // Relative to Adhara Sa
  octaveOffset: number; // semitones relative to tonic
}

// 4 Carnatic Violin Strings tuned in pairs of Panchamam and Shadjam
export const CARNATIC_VIOLIN_STRINGS: ViolinStringConfig[] = [
  {
    number: 1,
    label: '1st String (Kambi / Chanterelle)',
    swara: 'Tara Sa (Ṡ)',
    swaraMl: 'താര ഷഡ്ജം (സ)',
    role: 'Tonic High Octave',
    roleMl: 'ഉയർന്ന ശ്രുതി',
    intervalRatio: 2.0,
    octaveOffset: 12
  },
  {
    number: 2,
    label: '2nd String (Pakka Sarani)',
    swara: 'Madhya Pa (P)',
    swaraMl: 'മധ്യ പഞ്ചമം (പ)',
    role: 'Fifth (Mandatory)',
    roleMl: 'മധ്യ പഞ്ചമം',
    intervalRatio: 1.5,
    octaveOffset: 7
  },
  {
    number: 3,
    label: '3rd String (Sarani)',
    swara: 'Madhya Sa (S)',
    swaraMl: 'മധ്യ ഷഡ്ജം (സ)',
    role: 'Fundamental Tonic',
    roleMl: 'ആധാര ഷഡ്ജം',
    intervalRatio: 1.0,
    octaveOffset: 0
  },
  {
    number: 4,
    label: '4th String (Mandaram)',
    swara: 'Mandra Pa (P̣)',
    swaraMl: 'മന്ദ്ര പഞ്ചമം (പ)',
    role: 'Lower Fifth (Bass Drone)',
    roleMl: 'താഴ്ന്ന പഞ്ചമം',
    intervalRatio: 0.75,
    octaveOffset: -5
  }
];

export interface ViolinLesson {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  titleMl: string;
  subtitle: string;
  subtitleMl: string;
  estimatedMinutes: number;
  objectives: string[];
  objectivesMl: string[];
  postureGuidance: string;
  postureGuidanceMl: string;
  commonMistakes: string[];
  commonMistakesMl: string[];
  selfChecklist: string[];
  selfChecklistMl: string[];
  suggestedBpm: number;
  bowTechnique: string;
}

export const VIOLIN_LESSONS: ViolinLesson[] = [
  // --- BEGINNER ---
  {
    id: 'vln-b1',
    level: 'beginner',
    title: 'Posture, Seating & Scroll Anchor',
    titleMl: 'ഇരിപ്പുരീതിയും വയലിൻ പിടുത്തവും',
    subtitle: 'The classical cross-legged floor posture and scroll-on-foot lock.',
    subtitleMl: 'താഴെ ഇരുന്നുകൊണ്ടുള്ള പരമ്പരാഗത കർണ്ണാടക ശൈലി.',
    estimatedMinutes: 12,
    objectives: [
      'Sit comfortably cross-legged on the floor (Sukhasana) with upright spine',
      'Rest the violin scroll firmly against the right foot or ankle',
      'Rest the lower rib/tailpiece against the left collarbone, ensuring the left hand carries zero weight'
    ],
    objectivesMl: [
      'നട്ടെല്ല് നിവർത്തി നിലത്ത് ചമ്രം പടിഞ്ഞിരിക്കുക',
      'വയലിന്റെ ചുരുൾ (Scroll) വലതുകാൽ വിരലുകളിലോ കണങ്കാലിലോ ഉറപ്പിച്ചു നിർത്തുക',
      'ഇടതുകൈയ്ക്ക് ഭാരമില്ലാതെ സ്വതന്ത്രമായി ചലിക്കാൻ പാകത്തിൽ താടിയെല്ലിന് താഴെ അമർത്തുക'
    ],
    postureGuidance: 'The hallmark of Carnatic violin technique is that the left hand does not support the weight of the violin. The instrument is securely braced between your collarbone and right foot, freeing all four fingers of the left hand for fluid jarus (slides) and gamakas.',
    postureGuidanceMl: 'ഇടതുകൈ വയലിന്റെ ഭാരം താങ്ങുന്നില്ല എന്നതാണ് കർണ്ണാടക ശൈലിയുടെ പ്രത്യേകത. ഇത് വിരലുകൾക്ക് പൂർണ്ണ സ്വാതന്ത്ര്യം നൽകുന്നു.',
    commonMistakes: [
      'Gripping the neck tightly with the left thumb, causing wrist stiffness',
      'Slouching the back, which compresses breathing and restricts bow freedom',
      'Letting the scroll slide off the foot during down-bows'
    ],
    commonMistakesMl: [
      'ഇടതു പെരുവിരൽ കൊണ്ട് കഴുത്ത് വല്ലാതെ അമർത്തിപ്പിടിക്കുന്നത് വിരലുകളുടെ വേഗത കുറയ്ക്കും',
      'കൂനിയിരിക്കുന്നത് ശ്വാസഗതിയെയും ബോയിങ്ങിനെയും ബാധിക്കും'
    ],
    selfChecklist: [
      'Can I completely lift my left hand off the fingerboard without the violin slipping?',
      'Are both shoulders dropped, relaxed, and level?',
      'Is my right bowing arm unconstrained by my right knee?'
    ],
    selfChecklistMl: [
      'ഇടതുകൈ പൂർണ്ണമായി മാറ്റിയാലും വയലിൻ താഴെ വീഴാതെ നിൽക്കുന്നുണ്ടോ?',
      'തോൾഭാഗം അയഞ്ഞു സ്വതന്ത്രമാണോ?'
    ],
    suggestedBpm: 60,
    bowTechnique: 'Open string bowing without left hand fingers'
  },
  {
    id: 'vln-b2',
    level: 'beginner',
    title: 'Bow Grip & Open String Resonance (Pa & Sa)',
    titleMl: 'ബോ പിടുത്തവും തുറന്ന തന്ത്രി നാദവും',
    subtitle: 'Balanced index and thumb pressure for a round, resonant sound.',
    subtitleMl: 'ശുദ്ധമായ നാദം പുറപ്പെടുവിക്കാനുള്ള വില്ലിന്റെ ചലനം.',
    estimatedMinutes: 15,
    objectives: [
      'Master the Carnatic bow grip with curved right pinky on the stick',
      'Draw the bow at a strict 90-degree angle parallel to the bridge',
      'Sustain pure open notes on Madhya Sa and Madhya Pa without scratchiness'
    ],
    objectivesMl: [
      'വില്ലിന്റെ പിടുത്തം കൈത്തണ്ട അയച്ചു പിടിക്കുക',
      'ബ്രിഡ്ജിന് സമാന്തരമായി 90 ഡിഗ്രിയിൽ ബോ ചലിപ്പിക്കുക',
      'സ, പ തന്ത്രികളിൽ പരുക്കനല്ലാത്ത ശുദ്ധ നാദം നിലനിർത്തുക'
    ],
    postureGuidance: 'Place the hair of the bow halfway between the fingerboard and the bridge. Draw full strokes from frog to tip using smooth forearm and wrist extension.',
    postureGuidanceMl: 'ഫിംഗർബോർഡിനും ബ്രിഡ്ജിനും മധ്യത്തിലായി വില്ല് വെച്ച് ഒരേ വേഗതയിൽ താഴോട്ടും (Down-bow) മുകളിലോട്ടും (Up-bow) ചലിപ്പിക്കുക.',
    commonMistakes: [
      'Pressing too hard near the frog, producing a harsh crunch',
      'Losing contact weight at the tip, causing a thin, wispy whistle',
      'Crooked bowing that hits two strings accidentally'
    ],
    commonMistakesMl: [
      'അമിതമായ മർദ്ദം നൽകി പരുക്കൻ ശബ്ദമുണ്ടാക്കുന്നത്',
      'അറിയാതെ അടുത്ത തന്ത്രിയിൽ തട്ടുന്നത്'
    ],
    selfChecklist: [
      'Does the sound stay consistent in volume from frog to tip?',
      'Is my wrist flexing naturally at the directional change?',
      'Am I breathing steadily in sync with each stroke?'
    ],
    selfChecklistMl: [
      'ബോയുടെ തുടക്കം മുതൽ അവസാനം വരെ ഒരേ ശബ്ദക്കനം ലഭിക്കുന്നുണ്ടോ?'
    ],
    suggestedBpm: 60,
    bowTechnique: 'Whole-bow sustained strokes (8 seconds per direction)'
  },
  {
    id: 'vln-b3',
    level: 'beginner',
    title: 'Sarali Varisai & First Finger Intonation',
    titleMl: 'സരളിവരിശയും വിരൽ വിന്യാസങ്ങളും',
    subtitle: 'R1, G3, and M1 finger placement on the Sarani string in Mayamalavagowla.',
    subtitleMl: 'മായാമാളവഗൗളയിലെ ആദ്യ സ്വരസ്ഥാനങ്ങൾ ഉറപ്പിക്കൽ.',
    estimatedMinutes: 20,
    objectives: [
      'Place 1st finger (Shuddha Rishabham) close to the nut (minor semitone: 16/15 ratio)',
      'Place 2nd finger (Antara Gandharam) leaving a distinct gap from R1 (major third: 5/4 ratio)',
      'Place 3rd finger (Shuddha Madhyamam) immediately adjacent to G3 (perfect fourth: 4/3 ratio)'
    ],
    objectivesMl: [
      'ഒന്നാം വിരൽ ശുദ്ധ രിഷഭ സ്ഥാനത്ത് വെയ്ക്കുക',
      'രണ്ടാം വിരൽ അന്തര ഗാന്ധാര സ്ഥാനത്ത് അകറ്റി വെയ്ക്കുക',
      'മൂന്നാം വിരൽ ശുദ്ധ മധ്യമത്തിൽ ഗാന്ധാരത്തോട് ചേർത്തു വെയ്ക്കുക'
    ],
    postureGuidance: 'In Mayamalavagowla, notice the microtonal geometry: R1 is close to the nut, G3 is far, and M1 hugs G3 tightly. Observe how G3 and M1 touch each other.',
    postureGuidanceMl: 'മായാമാളവഗൗളയിൽ ഗാന്ധാരവും മധ്യമവും തമ്മിൽ തൊട്ടുരുമ്മി നിൽക്കുന്നു എന്നത് പ്രത്യേകം ശ്രദ്ധിക്കുക.',
    commonMistakes: [
      'Flattening the fingertips instead of playing on the rounded tips',
      'Moving the thumb with every finger shift',
      'Intonating R1 too sharp (playing Western D natural instead of Carnatic Shuddha Ri)'
    ],
    commonMistakesMl: [
      'വിരലുകൾ ചരിച്ച് വെക്കാതെ കൂർത്ത അഗ്രം കൊണ്ട് തന്ത്രിയിൽ അമർത്തുക'
    ],
    selfChecklist: [
      'Does my Shuddha Madhyamam blend consonantly with the open Mandra Pa string?',
      'Are my unused fingers hovering relaxed above the fingerboard?'
    ],
    selfChecklistMl: [
      'മധ്യമം തംബുരുവിന്റെ പ-യോട് ചേർന്നു നിൽക്കുന്നുണ്ടോ?'
    ],
    suggestedBpm: 65,
    bowTechnique: 'Separate detaché strokes, one bow per swara'
  },

  // --- INTERMEDIATE ---
  {
    id: 'vln-i1',
    level: 'intermediate',
    title: 'String Crossing Fluidity & Jantai Varisais',
    titleMl: 'തന്ത്രി മാറ്റവും ജണ്ട വരിശകളും',
    subtitle: 'Crossing from Sarani (Sa) to Pakka Sarani (Pa) with silent wrist pivots.',
    subtitleMl: 'സ-യിൽ നിന്ന് പ-യിലേക്ക് തടസ്സമില്ലാതെ തന്ത്രികൾ മാറുന്ന വിദ്യ.',
    estimatedMinutes: 25,
    objectives: [
      'Maintain continuous bow contact while pivoting elbow angle across strings',
      'Execute forceful twin-note Jantai strikes (Sphuritam) from the finger knuckle',
      'Play Jantai Varisais 1 to 4 across three speeds (Prathama, Dwitiya, Tritiya Kalam)'
    ],
    objectivesMl: [
      'തന്ത്രികൾ മാറുമ്പോൾ കൈമുട്ടിന്റെ ആംഗിൾ മാത്രം മാറ്റി ബോയുടെ ചലനം നിലനിർത്തുക',
      'സ്ഫുരിത ഗമകത്തോടെ ജണ്ട വരിശകൾ വായിക്കുക',
      'മൂന്ന് കാലങ്ങളിൽ പരിശീലിക്കുക'
    ],
    postureGuidance: 'When crossing from 3rd to 2nd string, lower the right elbow slightly before the bow direction changes. Never jump or bounce the bow off the string.',
    postureGuidanceMl: 'തന്ത്രി മാറുമ്പോൾ വില്ല് ഉയർത്തി താഴേക്ക് അടിക്കരുത്. മൃദുവായി ഉരുട്ടി മാറ്റുക.',
    commonMistakes: [
      'Lifting the bow entirely off the string when switching strings',
      'Lagging behind the tala beat during the 3rd speed transition'
    ],
    commonMistakesMl: [
      'മൂന്നാം കാലത്തിൽ താളം തെറ്റി വേഗത കൂടുന്നത്'
    ],
    selfChecklist: [
      'Is the transition between Sa and Pa string completely silent and free of scrapes?',
      'Are the second notes in Jantai pairs accented cleanly from the finger strike?'
    ],
    selfChecklistMl: [
      'തന്ത്രി മാറുമ്പോൾ അനാവശ്യ ശബ്ദങ്ങൾ ഉണ്ടാകുന്നില്ലെന്ന് ഉറപ്പാക്കുക'
    ],
    suggestedBpm: 72,
    bowTechnique: 'Slurred pairs (2 swaras per bow) and articulated accents'
  },
  {
    id: 'vln-i2',
    level: 'intermediate',
    title: 'Introductory Gamakas: Kampitam & Jaru',
    titleMl: 'ഗമക സാധകം: കമ്പിതവും ജാരുവും',
    subtitle: 'Microtonal oscillations on Gandharam and expressive portamento glides.',
    subtitleMl: 'സ്വരങ്ങളിലെ കമ്പനവും തെന്നി നീങ്ങുന്ന ജാരു രീതികളും.',
    estimatedMinutes: 30,
    objectives: [
      'Produce Kampita gamaka using supple forearm and wrist motion without neck tension',
      'Execute ascending (Arohana) and descending (Avarohana) Jaru glides smoothly',
      'Apply authentic gamakas to Mayamalavagowla and Shankarabharanam'
    ],
    objectivesMl: [
      'കൈത്തണ്ടയുടെ അയവോടെ കമ്പിത ഗമകം വായിക്കുക',
      'സ്വരങ്ങൾക്കിടയിൽ തെന്നി നീങ്ങുന്ന ജാരു പിഴവില്ലാതെ ചെയ്യുക',
      'ശങ്കരാഭരണത്തിലും മായാമാളവഗൗളയിലും ഗമകങ്ങൾ പ്രയോഗിക്കുക'
    ],
    postureGuidance: 'A Carnatic gamaka on the violin is not Western vibrato. Western vibrato oscillates symmetrically above and below the pitch. A Carnatic Kampitam oscillates between two swarasthanas (e.g., oscillating Gandhara towards Madhyama and back to Rishabha), guided by tradition.',
    postureGuidanceMl: 'കർണ്ണാടക സംഗീതത്തിലെ കമ്പിതം പാശ്ചാത്യ വൈബ്രേറ്റോ പോലെയല്ല. അത് രണ്ട് സ്വരസ്ഥാനങ്ങൾക്കിടയിലെ കൃത്യമായ ആന്ദോളനമാണ്.',
    commonMistakes: [
      'Shaking only the fingertip without moving the wrist/forearm, producing nervous tremor',
      'Gliding too rapidly without sustaining the starting swara'
    ],
    commonMistakesMl: [
      'വിരൽത്തുമ്പ് മാത്രം വിറപ്പിച്ചു പാടുന്നത് ഗമകത്തിന്റെ മാധുര്യം നഷ്ടപ്പെടുത്തും'
    ],
    selfChecklist: [
      'Does the oscillation touch the upper target note rhythmically?',
      'Is the bow weight maintained steadily throughout the glide?'
    ],
    selfChecklistMl: [
      'ബോയുടെ മർദ്ദം ഗമകത്തിലുടനീളം ഒരുപോലെ നിൽക്കുന്നുണ്ടോ?'
    ],
    suggestedBpm: 60,
    bowTechnique: 'Long sustained bows with continuous microtonal finger deflection'
  },

  // --- ADVANCED ---
  {
    id: 'vln-a1',
    level: 'advanced',
    title: 'Varnam Mastery in 2 Kalams & Tisram',
    titleMl: 'വർണ്ണ സാധകം: രണ്ട് കാലങ്ങളും തിസ്രവും',
    subtitle: 'Ninnukori (Mohanam) and Sami Ninne (Shankarabharanam) bow distribution.',
    subtitleMl: 'വർണ്ണങ്ങൾ ഒന്നാം കാലത്തിലും രണ്ടാം കാലത്തിലും തിസ്ര നടയിലും വായിക്കൽ.',
    estimatedMinutes: 40,
    objectives: [
      'Calculate precise bow division: whole bow for long notes, half/quarter for rapid passages',
      'Shift positions effortlessly up to 3rd position on Tara Sa string (Tara Gandharam/Madhyamam)',
      'Render Adi Tala Varnams with unwavering laya and phrase continuity'
    ],
    objectivesMl: [
      'വർണ്ണങ്ങളിൽ ബോയുടെ അളവ് (Bow distribution) കൃത്യമായി വീതിക്കുക',
      'താരസ്ഥായിയിലെ മൂന്നാം പൊസിഷനിലേക്ക് തെറ്റാതെ വിരലുകൾ നീക്കുക',
      'താളപ്രമാണം ഒട്ടും വ്യതിചലിക്കാതെ വായിക്കുക'
    ],
    postureGuidance: 'When shifting to higher positions on the 1st string, let the palm glide smoothly along the violin rib without squeezing the neck. Keep the scroll anchored firmly on your right foot.',
    postureGuidanceMl: 'താരസ്ഥായിയിലേക്ക് വിരൽ നീക്കുമ്പോൾ വയലിന്റെ കഴുത്തിൽ മുറുകെ പിടിക്കരുത്.',
    commonMistakes: [
      'Running out of bow before the end of an elongated Karvai note',
      'Losing clarity in mukthayisvara fast phrases'
    ],
    commonMistakesMl: [
      'നീട്ടിപ്പിടിക്കേണ്ട സ്വരങ്ങളിൽ വില്ലിന്റെ നീളം തികയാതെ വരുന്നത്'
    ],
    selfChecklist: [
      'Can I execute the second kalam at exactly twice the speed of the first without rushing?',
      'Are all swara transitions smooth without involuntary bow bounce?'
    ],
    selfChecklistMl: [
      'രണ്ടാം കാലം കൃത്യം ഇരട്ടി വേഗതയിലാണോ വായിക്കുന്നത്?'
    ],
    suggestedBpm: 76,
    bowTechnique: 'Complex slurring matching Sahitya syllables'
  },
  {
    id: 'vln-a2',
    level: 'advanced',
    title: 'Vocal Accompaniment & Raga Alapana Following',
    titleMl: 'വായ്പ്പാട്ട് അകമ്പടിയും രാഗാലാപനയും',
    subtitle: 'Anticipation, responsive phrasing, shadowing, and concert etiquette.',
    subtitleMl: 'പാട്ടുകാരനെ അനുഗമിച്ചു വായിക്കലും രാഗസഞ്ചാരങ്ങളും.',
    estimatedMinutes: 45,
    objectives: [
      'Shadow the vocalist’s gamakas half a second behind without clashing',
      'Deliver brief, sparkling 15-second solo interludes when the vocalist rests',
      'Construct majestic Alapana phrases progressing from Mandra through Madhya to Tara sthayi'
    ],
    objectivesMl: [
      'പാട്ടുകാരന്റെ ആലാപനയെ തൊട്ടുപിന്നാലെ മനോഹരമായി പിന്തുടരുക',
      'പാട്ടുകാരൻ നിർത്തുമ്പോൾ ആ രാഗഭാവം ചോർന്നുപോകാതെ വായിക്കുക',
      'മന്ദ്ര സ്ഥായി മുതൽ താര സ്ഥായി വരെ ക്രമമായി രാഗം വിസ്തരിക്കുക'
    ],
    postureGuidance: 'The accompanist must listen with 80% of attention focused on the vocalist. Never overshadow the vocalist; support their pauses, lift their phrase cadences, and shine during your allocated solo space.',
    postureGuidanceMl: 'ശ്രദ്ധയുടെ 80 ശതമാനവും പ്രധാന ഗായകനിലേക്ക് കേന്ദ്രീകരിക്കുക. ഗായകന്റെ ആലാപനയ്ക്ക് പൂർണ്ണ പൂരകമായി മാറുക.',
    commonMistakes: [
      'Over-playing during vocal phrases instead of providing subtle harmonic backing',
      'Playing off-raga prayogas in solo turns'
    ],
    commonMistakesMl: [
      'ഗായകൻ പാടുമ്പോൾ അനാവശ്യമായി കൂടുതൽ സ്വരങ്ങൾ വായിച്ചു ശബ്ദമുണ്ടാക്കുന്നത്'
    ],
    selfChecklist: [
      'Did my solo phrase capture the exact mood (Bhava) set by the lead singer?',
      'Were my landing notes on the Samam rock solid?'
    ],
    selfChecklistMl: [
      'ഗായകന്റെ സമത്തിലേക്ക് കൃത്യമായി സന്ധിക്കാൻ കഴിഞ്ഞോ?'
    ],
    suggestedBpm: 60,
    bowTechnique: 'Spontaneous nuance-driven bowing and subtle dynamics'
  }
];

export const ViolinPracticeStudio: React.FC<ViolinPracticeStudioProps> = ({
  activeTonic,
  onTonicChange,
  onLogToJournal,
  onAskTutor
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<ViolinTab>('curriculum');
  const [selectedLesson, setSelectedLesson] = useState<ViolinLesson>(VIOLIN_LESSONS[0]);

  // Tuner State
  const [isTunerActive, setIsTunerActive] = useState(false);
  const [targetString, setTargetString] = useState<ViolinStringConfig>(CARNATIC_VIOLIN_STRINGS[2]); // Madhya Sa
  const [detectedHz, setDetectedHz] = useState<number | null>(null);
  const [centsOffset, setCentsOffset] = useState<number>(0);
  const [stabilityPct, setStabilityPct] = useState<number>(0);
  const [signalLevel, setSignalLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isDronePlaying, setIsDronePlaying] = useState<boolean>(false);

  // Long-Bow Timer State
  const [bowDurationSeconds, setBowDurationSeconds] = useState<number>(8);
  const [bowRestSeconds, setBowRestSeconds] = useState<number>(2);
  const [isLongBowActive, setIsLongBowActive] = useState<boolean>(false);
  const [bowPhase, setBowPhase] = useState<'down' | 'up' | 'rest'>('down');
  const [bowSecondsElapsed, setBowSecondsElapsed] = useState<number>(0);
  const [completedBowCycles, setCompletedBowCycles] = useState<number>(0);
  const [checklistTone, setChecklistTone] = useState<boolean>(false);
  const [checklistPressure, setChecklistPressure] = useState<boolean>(false);
  const [checklistAngle, setChecklistAngle] = useState<boolean>(false);

  // String Crossing Trainer State
  const [crossingPattern, setCrossingPattern] = useState<'adjacent' | 'leaps' | 'open_octaves'>('adjacent');
  const [trainerKalam, setTrainerKalam] = useState<1 | 2 | 3>(1);

  // Web Audio Context & Analyser Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up all audio resources on unmount
  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsTunerActive(false);
    setIsLongBowActive(false);
    audioEngine.stopTanpura();
    setIsDronePlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Autocorrelation Pitch Extraction
  const performAutocorrelation = (buffer: Float32Array, sampleRate: number): { freq: number; confidence: number } | null => {
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      sumOfSquares += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumOfSquares / SIZE);
    if (rms < 0.015) return null; // Silence threshold

    let r1 = 0;
    let r2 = SIZE - 1;
    const threshold = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmedBuffer = buffer.slice(r1, r2);
    const c = new Float32Array(trimmedBuffer.length);
    for (let lag = 0; lag < trimmedBuffer.length; lag++) {
      let sum = 0;
      for (let i = 0; i < trimmedBuffer.length - lag; i++) {
        sum += trimmedBuffer[i] * trimmedBuffer[i + lag];
      }
      c[lag] = sum;
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxVal = -1;
    let maxPos = -1;
    for (let i = d; i < trimmedBuffer.length; i++) {
      if (c[i] > maxVal) {
        maxVal = c[i];
        maxPos = i;
      }
    }

    let T0 = maxPos;
    if (T0 > 0 && T0 < trimmedBuffer.length - 1) {
      const x1 = c[T0 - 1];
      const x2 = c[T0];
      const x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);
    }

    const freq = sampleRate / T0;
    const confidence = maxVal / (c[0] || 1);
    if (confidence < 0.75 || freq < 100 || freq > 1600) return null;

    return { freq, confidence };
  };

  // Start Mic Listening for Tuner
  const handleToggleTuner = async () => {
    if (isTunerActive) {
      cleanupAudio();
      return;
    }

    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      micStreamRef.current = stream;

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsTunerActive(true);

      const buffer = new Float32Array(analyser.fftSize);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);

        // Signal Level (RMS)
        let sumSquares = 0;
        for (let i = 0; i < buffer.length; i++) {
          sumSquares += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sumSquares / buffer.length);
        const normLevel = Math.min(100, Math.round(rms * 400));
        setSignalLevel(normLevel);

        const result = performAutocorrelation(buffer, ctx.sampleRate);
        if (result) {
          setDetectedHz(Math.round(result.freq * 10) / 10);
          const targetHz = activeTonic.frequency * targetString.intervalRatio;
          const cents = 1200 * Math.log2(result.freq / targetHz);
          setCentsOffset(Math.round(cents * 10) / 10);
          setStabilityPct(Math.round(result.confidence * 100));
        } else {
          setDetectedHz(null);
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch {
      setMicError(lang === 'ml' ? 'മൈക്രോഫോൺ അനുമതി ലഭിച്ചില്ല. മാനുവൽ മോഡ് ഉപയോഗിക്കുക.' : 'Microphone access denied. You can still use the manual audio drone and visual reference.');
      setIsTunerActive(false);
    }
  };

  // Play Reference Tone for String
  const playStringReferenceTone = (str: ViolinStringConfig) => {
    audioEngine.setTonic(activeTonic.name);
    audioEngine.playSwaraNote(str.intervalRatio, 1.5);
  };

  // Toggle Tanpura Drone
  const handleToggleDrone = () => {
    if (isDronePlaying) {
      audioEngine.stopTanpura();
      setIsDronePlaying(false);
    } else {
      audioEngine.startTanpura(activeTonic.frequency);
      setIsDronePlaying(true);
    }
  };

  // Play cue beep using playSwaraNote
  const playCueSound = (ratio: number) => {
    audioEngine.setTonic(activeTonic.name);
    audioEngine.playSwaraNote(ratio, 0.1);
  };

  // Long-Bow Timer Routine
  const startLongBowTimer = () => {
    if (isLongBowActive) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsLongBowActive(false);
      return;
    }

    setIsLongBowActive(true);
    setBowPhase('down');
    setBowSecondsElapsed(0);
    setCompletedBowCycles(0);

    let currentPhase: 'down' | 'up' | 'rest' = 'down';
    let currentElapsed = 0;
    let cycles = 0;

    timerIntervalRef.current = setInterval(() => {
      currentElapsed++;
      setBowSecondsElapsed(currentElapsed);

      if (currentPhase === 'down' && currentElapsed >= bowDurationSeconds) {
        currentPhase = 'up';
        currentElapsed = 0;
        setBowPhase('up');
        setBowSecondsElapsed(0);
        playCueSound(1.5); // Cue for bow turn
      } else if (currentPhase === 'up' && currentElapsed >= bowDurationSeconds) {
        if (bowRestSeconds > 0) {
          currentPhase = 'rest';
          currentElapsed = 0;
          setBowPhase('rest');
          setBowSecondsElapsed(0);
        } else {
          currentPhase = 'down';
          currentElapsed = 0;
          cycles++;
          setCompletedBowCycles(cycles);
          setBowPhase('down');
          setBowSecondsElapsed(0);
          playCueSound(2.0);
        }
      } else if (currentPhase === 'rest' && currentElapsed >= bowRestSeconds) {
        currentPhase = 'down';
        currentElapsed = 0;
        cycles++;
        setCompletedBowCycles(cycles);
        setBowPhase('down');
        setBowSecondsElapsed(0);
        playCueSound(2.0);
      }
    }, 1000);
  };

  // Log Long-Bow Session to Sadhana Journal
  const handleLogLongBowToJournal = () => {
    if (!onLogToJournal) return;
    const totalMinutes = Math.max(1, Math.round((completedBowCycles * (bowDurationSeconds * 2 + bowRestSeconds)) / 60));
    const notes = `Long-Bow Tone Practice: ${completedBowCycles} full cycles at ${bowDurationSeconds}s per stroke. Quality self-checks: Tone=${checklistTone ? 'Pass' : 'Review'}, Pressure=${checklistPressure ? 'Pass' : 'Review'}, Angle=${checklistAngle ? 'Pass' : 'Review'}.`;
    onLogToJournal('Carnatic Violin Long-Bow Sustained Tone Drill', totalMinutes, notes);
  };

  // Target frequency for selected string
  const currentTargetHz = useMemo(() => {
    return Math.round(activeTonic.frequency * targetString.intervalRatio * 10) / 10;
  }, [activeTonic, targetString]);

  return (
    <div className="w-full bg-[#12110E] border border-[#3B392F] rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#3B392F] gap-4 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C7A45B]/15 border border-[#C7A45B]/40 flex items-center justify-center text-[#E0C98F] shadow-lg">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? 'കർണ്ണാടക വയലിൻ സാധക കളരി' : 'Carnatic Violin Practice Studio'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30">
                100% Free
              </span>
            </div>
            <p className="text-xs text-[#BDB4A4] font-mono mt-0.5">
              {lang === 'ml'
                ? 'പരമ്പരാഗത ഇരിപ്പ്, പ-സ-പ-സ ശ്രുതി, ബോയിങ് കൺട്രോൾ, വിരൽ വിന്യാസം.'
                : 'Tradition-grounded floor posture, Pa-Sa-Pa-Sa tuning, sustained tone, and string-crossing mastery.'}
            </p>
          </div>
        </div>

        {/* Global Tonic Selector Pill */}
        <div className="flex items-center space-x-2 bg-[#1A1915] p-2 rounded-2xl border border-[#3B392F]">
          <span className="text-[11px] font-mono text-[#C7A45B] uppercase pl-1">
            {lang === 'ml' ? 'ആധാര ഷഡ്ജം (ശ്രുതി):' : 'Tonic (Adhara Sa):'}
          </span>
          <select
            value={activeTonic.name}
            onChange={(e) => {
              const selected = TONIC_OPTIONS.find((t) => t.name === e.target.value);
              if (selected) onTonicChange(selected);
            }}
            className="bg-[#0D0C0A] border border-[#C7A45B]/40 text-[#F4EBDD] font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#C7A45B]"
          >
            {TONIC_OPTIONS.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} ({t.kattai}) — {t.frequency} Hz
              </option>
            ))}
          </select>
          <button
            onClick={handleToggleDrone}
            className={`p-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-1 ${
              isDronePlaying
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-[#22221D] hover:bg-[#2c2c25] text-[#E0C98F] border border-[#3B392F]'
            }`}
            title="Toggle Continuous Tanpura Drone"
          >
            {isDronePlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDronePlaying ? 'Drone ON' : 'Drone'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pt-5 pb-4 border-b border-[#2A2822] relative z-10">
        {[
          { id: 'curriculum', label: 'Learning Path (3 Levels)', labelMl: 'പഠന ക്രമം', icon: BookOpen },
          { id: 'tuner', label: 'Pa-Sa-Pa-Sa Tuner', labelMl: 'ശ്രുതി ട്യൂണർ', icon: Activity },
          { id: 'longbow', label: 'Long-Bow & Tone Timer', labelMl: 'ബോയിങ് സാധകം', icon: Clock },
          { id: 'stringcrossing', label: 'String-Crossing Trainer', labelMl: 'തന്ത്രി മാറ്റം', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ViolinTab)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                  : 'bg-[#191814] text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#22211C] border border-[#3B392F]/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{lang === 'ml' ? tab.labelMl : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VIOLIN LEARNING PATH */}
      {activeTab === 'curriculum' && (
        <div className="pt-6 space-y-6 relative z-10">
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-[#1B1914] border border-[#C7A45B]/30 text-[#E0C98F]">
            <Info className="w-5 h-5 text-[#C7A45B] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-[#BDB4A4]">
              <strong className="text-[#F4EBDD] block">
                {lang === 'ml' ? 'സംഗീത പാരമ്പര്യം: ' : 'Pedagogical Notice: '}
              </strong>
              {lang === 'ml'
                ? 'കർണ്ണാടക വയലിൻ ഒരു ഫ്രെറ്റ്‌ലെസ്സ് (Frets ഇല്ലാത്ത) വാദ്യമാണ്. വിരൽ സ്ഥാനങ്ങൾ തുല്യമായ സെമിടോണുകളിൽ ഒതുങ്ങുന്നില്ല; രാഗഭാവവും ഗമകവുമാണ് സ്വരത്തെ നിശ്ചയിക്കുന്നത്. ഒരു നിശ്ചിത വിരൽ രീതി മാത്രമേ പാടുള്ളൂ എന്ന കർക്കശ വാദം ശാസ്ത്രീയമല്ല.'
                : 'The Carnatic violin is an un-fretted instrument where intonation is governed by microtonal shrutis, gamaka oscillations, and prayoga context—not equal-tempered frets. Multiple fingering lineages (Lalgudi, Parur, MSG, Dwaram) enrich this art.'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lessons List Column */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7A45B] block font-bold">
                {lang === 'ml' ? 'പാഠങ്ങൾ (Curriculum Modules)' : 'Curriculum Modules (8 Lessons)'}
              </span>
              <div className="space-y-2">
                {VIOLIN_LESSONS.map((lesson, idx) => {
                  const isSelected = selectedLesson.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#24211A] border-[#C7A45B] text-[#F4EBDD] shadow-md'
                          : 'bg-[#161511] border-[#2E2C24] text-[#BDB4A4] hover:bg-[#1C1B16] hover:text-[#F4EBDD]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                            lesson.level === 'beginner'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : lesson.level === 'intermediate'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {lesson.level}
                          </span>
                          <span className="text-xs font-serif font-bold text-[#F4EBDD]">
                            {idx + 1}. {lang === 'ml' ? lesson.titleMl : lesson.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#87947A] font-mono line-clamp-1">
                          {lang === 'ml' ? lesson.subtitleMl : lesson.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C7A45B] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Lesson Detail Column */}
            <div className="lg:col-span-2 bg-[#171612] border border-[#3B392F] rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C2A22] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40 font-bold">
                      {selectedLesson.level.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#87947A] font-mono flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedLesson.estimatedMinutes} mins recommended</span>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] mt-1.5">
                    {lang === 'ml' ? selectedLesson.titleMl : selectedLesson.title}
                  </h3>
                  <p className="text-xs text-[#C7A45B] font-mono">
                    {lang === 'ml' ? selectedLesson.subtitleMl : selectedLesson.subtitle}
                  </p>
                </div>

                {onAskTutor && (
                  <button
                    onClick={() => onAskTutor(`Guide me on Carnatic violin lesson: ${selectedLesson.title}`)}
                    className="px-3 py-1.5 rounded-xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] text-[#E0C98F] text-xs font-mono transition-colors shrink-0 flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C7A45B]" />
                    <span>Ask Tutor</span>
                  </button>
                )}
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#C7A45B] font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8ce2b0]" />
                  <span>{lang === 'ml' ? 'ലക്ഷ്യങ്ങൾ (Objectives)' : 'Key Pedagogical Objectives'}</span>
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {(lang === 'ml' ? selectedLesson.objectivesMl : selectedLesson.objectives).map((obj, i) => (
                    <li key={i} className="text-xs text-[#BDB4A4] flex items-start space-x-2">
                      <span className="text-[#C7A45B]">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Posture & Ergonomics Detail */}
              <div className="p-4 rounded-2xl bg-[#0F0E0B] border border-[#2B2922] space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#E0C98F] font-bold block">
                  {lang === 'ml' ? 'ഇരിപ്പും വിരൽ വഴക്കവും (Ergonomics)' : 'Posture & Ergonomics Guidance'}
                </span>
                <p className="text-xs text-[#BDB4A4] leading-relaxed">
                  {lang === 'ml' ? selectedLesson.postureGuidanceMl : selectedLesson.postureGuidance}
                </p>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{lang === 'ml' ? 'ശ്രദ്ധിക്കേണ്ട തെറ്റുകൾ (Common Mistakes)' : 'Avoid Common Beginner Pitfalls'}</span>
                </h4>
                <ul className="space-y-1 text-xs text-rose-200/90 pl-1">
                  {(lang === 'ml' ? selectedLesson.commonMistakesMl : selectedLesson.commonMistakes).map((m, i) => (
                    <li key={i}>⚠ {m}</li>
                  ))}
                </ul>
              </div>

              {/* Self-Checklist & Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2C2A22]">
                <div className="text-xs text-[#87947A] font-mono">
                  Suggested Tempo: <strong>{selectedLesson.suggestedBpm} BPM</strong> • Bowing: {selectedLesson.bowTechnique}
                </div>
                <button
                  onClick={() => {
                    setActiveTab('longbow');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C7A45B] hover:bg-[#DFB960] text-[#11110F] text-xs font-bold font-mono transition-colors flex items-center space-x-1.5"
                >
                  <span>Practice with Bow Timer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PA-SA-PA-SA TUNER & SHRUti ASSISTANT */}
      {activeTab === 'tuner' && (
        <div className="pt-6 space-y-6 relative z-10">
          {/* Pegs & Fine-Tuner Safety Advice Banner */}
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-[#1B1914] border border-[#C7A45B]/30 text-[#E0C98F]">
            <ShieldCheck className="w-5 h-5 text-[#C7A45B] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-[#BDB4A4]">
              <strong className="text-[#F4EBDD] block">
                {lang === 'ml' ? 'വയലിൻ ട്യൂണിംഗ് സുരക്ഷാ നിർദ്ദേശം: ' : 'Safe Tuning & Instrument Care: '}
              </strong>
              {lang === 'ml'
                ? 'NadaVerse ഒരു ഇലക്ട്രോണിക് പിച്ച് ഗൈഡ് മാത്രമാണ്. ഇത് വയലിന്റെ പെഗ്ഗുകൾ തനിയെ തിരിക്കില്ല. പെഗ്ഗുകൾ തിരിക്കുമ്പോൾ തന്ത്രി പൊട്ടാതിരിക്കാൻ വളരെ ചെറിയ അളവിൽ മാത്രം തിരിക്കുക. സൂക്ഷ്മമായ മാറ്റങ്ങൾക്ക് ഫൈൻ ട്യൂണറുകൾ (Fine tuners) ഉപയോഗിക്കുക.'
                : 'NadaVerse acts as an acoustic ear-training and pitch guide. It cannot physically turn pegs or replace a qualified teacher/luthier. Turn wooden pegs in tiny fractions of a millimeter while pushing inward into the pegbox to prevent snapping strings. Use tailpiece fine-tuners for precision cents adjustments.'}
            </div>
          </div>

          {/* String Selection Grid */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7A45B] block mb-3 font-bold">
              {lang === 'ml' ? 'ട്യൂൺ ചെയ്യേണ്ട തന്ത്രി തിരഞ്ഞെടുക്കുക:' : 'Select Target Violin String (Carnatic Pa-Sa-Pa-Sa):'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CARNATIC_VIOLIN_STRINGS.map((str) => {
                const isSelected = targetString.number === str.number;
                const stringHz = Math.round(activeTonic.frequency * str.intervalRatio * 10) / 10;
                return (
                  <button
                    key={str.number}
                    onClick={() => setTargetString(str)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#29251E] border-[#C7A45B] shadow-[0_0_20px_rgba(199,164,91,0.2)]'
                        : 'bg-[#151410] border-[#2C2A22] text-[#BDB4A4] hover:bg-[#1C1A14]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#C7A45B] font-bold">
                        String #{str.number}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playStringReferenceTone(str);
                        }}
                        className="p-1.5 rounded-lg bg-[#22221D] hover:bg-[#2c2c25] text-[#E0C98F] text-[10px] transition-colors"
                        title="Hear Reference Pitch"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C7A45B]" />
                      </button>
                    </div>
                    <div className="text-base font-serif font-bold text-[#F4EBDD] mt-1">
                      {lang === 'ml' ? str.swaraMl : str.swara}
                    </div>
                    <div className="text-xs font-mono text-[#87947A] mt-0.5">
                      Target: <strong className="text-[#E0C98F]">{stringHz} Hz</strong>
                    </div>
                    <div className="text-[10px] text-[#BDB4A4] mt-1 italic">
                      {lang === 'ml' ? str.roleMl : str.role}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tuner Main Display Card */}
          <div className="p-6 rounded-3xl bg-[#0D0C0A] border border-[#3B392F] space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C7A45B]">
                {targetString.label}
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4EBDD]">
                {targetString.swara} • {currentTargetHz} Hz
              </h3>
            </div>

            {/* Cents Deviation Meter */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="relative h-6 bg-[#1A1915] rounded-full overflow-hidden border border-[#3B392F] flex items-center justify-center">
                {/* Center Zero Line */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10" />

                {/* Deviation Indicator Needle */}
                {detectedHz !== null && (
                  <div
                    className={`absolute top-1 bottom-1 w-2 rounded-full transition-all duration-100 ${
                      Math.abs(centsOffset) <= 5
                        ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                        : Math.abs(centsOffset) <= 15
                        ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                        : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                    }`}
                    style={{
                      left: `calc(50% + ${Math.max(-45, Math.min(45, centsOffset)) * 0.9}%)`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#87947A]">
                <span>-50 Cents (Flat / താഴെ)</span>
                <span className="text-emerald-400 font-bold">0 (Perfect Shruti)</span>
                <span>+50 Cents (Sharp / മുകളിൽ)</span>
              </div>
            </div>

            {/* Readouts Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
              <div className="p-3 rounded-xl bg-[#161511] border border-[#2B2922]">
                <span className="text-[10px] font-mono uppercase text-[#87947A] block">Detected Frequency</span>
                <span className="text-sm font-mono font-bold text-[#F4EBDD]">
                  {detectedHz ? `${detectedHz} Hz` : '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#161511] border border-[#2B2922]">
                <span className="text-[10px] font-mono uppercase text-[#87947A] block">Cents Error</span>
                <span className={`text-sm font-mono font-bold ${
                  Math.abs(centsOffset) <= 5 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {detectedHz ? `${centsOffset > 0 ? '+' : ''}${centsOffset}¢` : '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#161511] border border-[#2B2922]">
                <span className="text-[10px] font-mono uppercase text-[#87947A] block">Stability</span>
                <span className="text-sm font-mono font-bold text-[#E0C98F]">
                  {detectedHz ? `${stabilityPct}%` : '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#161511] border border-[#2B2922]">
                <span className="text-[10px] font-mono uppercase text-[#87947A] block">Mic Input Level</span>
                <span className="text-sm font-mono font-bold text-sky-400">
                  {signalLevel}%
                </span>
              </div>
            </div>

            {micError && (
              <p className="text-xs text-rose-300 max-w-md mx-auto">{micError}</p>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleToggleTuner}
                className={`px-6 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shadow-lg ${
                  isTunerActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                    : 'bg-[#C7A45B] hover:bg-[#DFB960] text-[#11110F] shadow-[#C7A45B]/20'
                }`}
              >
                {isTunerActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isTunerActive ? 'Stop Listening' : 'Listen with Microphone'}</span>
              </button>

              <button
                onClick={() => playStringReferenceTone(targetString)}
                className="px-5 py-2.5 rounded-2xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] text-[#E0C98F] text-xs font-mono transition-colors flex items-center space-x-1.5"
              >
                <Volume2 className="w-4 h-4 text-[#C7A45B]" />
                <span>Hear Reference ({currentTargetHz} Hz)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LONG-BOW & SUSTAINED TONE TIMER */}
      {activeTab === 'longbow' && (
        <div className="pt-6 space-y-6 relative z-10">
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-[#1B1914] border border-[#C7A45B]/30 text-[#E0C98F]">
            <Clock className="w-5 h-5 text-[#C7A45B] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-[#BDB4A4]">
              <strong className="text-[#F4EBDD] block">
                {lang === 'ml' ? 'ദീർഘ വില്ലടിക്കൽ (Long-Bow Sadhana): ' : 'Tone Mastery Foundation: '}
              </strong>
              {lang === 'ml'
                ? 'വയലിനിലെ നാദശുദ്ധിയുടെ അടിത്തറ ദീർഘമായ ബോയിങ് ആണ്. 8 മുതൽ 16 സെക്കൻഡ് വരെ ഒരൊറ്റ ബോയിൽ കുലുക്കമില്ലാതെ സ്വരം നീട്ടി വായിച്ചു പരിശീലിക്കുക.'
                : 'Sustained whole-bow exercises build the physical foundation of Carnatic violin tone. The goal is zero volume fluctuation, zero scratchiness at the frog, and zero thinning at the tip.'}
            </div>
          </div>

          {/* Timer Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#151410] border border-[#2C2A22] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#C7A45B] font-bold block">
                Bow Stroke Duration: {bowDurationSeconds}s
              </label>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={bowDurationSeconds}
                disabled={isLongBowActive}
                onChange={(e) => setBowDurationSeconds(parseInt(e.target.value))}
                className="w-full accent-[#C7A45B]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#87947A]">
                <span>4s (Beginner)</span>
                <span>12s</span>
                <span>24s (Master)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#151410] border border-[#2C2A22] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#C7A45B] font-bold block">
                Rest Between Turns: {bowRestSeconds}s
              </label>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={bowRestSeconds}
                disabled={isLongBowActive}
                onChange={(e) => setBowRestSeconds(parseInt(e.target.value))}
                className="w-full accent-[#C7A45B]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#87947A]">
                <span>0s (Continuous)</span>
                <span>3s</span>
                <span>6s</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#151410] border border-[#2C2A22] flex flex-col justify-center space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#C7A45B] font-bold">
                Completed Full Cycles
              </span>
              <span className="text-3xl font-serif font-bold text-[#F4EBDD]">
                {completedBowCycles}
              </span>
              <span className="text-[10px] font-mono text-[#87947A]">
                Total: {Math.round((completedBowCycles * (bowDurationSeconds * 2 + bowRestSeconds)) / 60 * 10) / 10} minutes
              </span>
            </div>
          </div>

          {/* Live Bow Animation Stage */}
          <div className="p-8 rounded-3xl bg-[#0C0B09] border border-[#3B392F] text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full font-bold ${
                bowPhase === 'down'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : bowPhase === 'up'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-500/20 text-slate-300'
              }`}>
                {bowPhase === 'down' ? '↓ Down-Bow (ത താഴോട്ട്)' : bowPhase === 'up' ? '↑ Up-Bow (മുകളിലോട്ട്)' : '⏸ Rest & Relax Wrist'}
              </span>
            </div>

            <div className="text-5xl sm:text-6xl font-serif font-bold text-[#F4EBDD] font-mono">
              {bowSecondsElapsed} <span className="text-2xl text-[#87947A]">/ {bowPhase === 'rest' ? bowRestSeconds : bowDurationSeconds}s</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="max-w-lg mx-auto h-4 bg-[#1C1B16] rounded-full overflow-hidden border border-[#3B392F]">
              <div
                className={`h-full transition-all duration-1000 ${
                  bowPhase === 'down' ? 'bg-amber-400' : bowPhase === 'up' ? 'bg-sky-400' : 'bg-slate-600'
                }`}
                style={{
                  width: `${(bowSecondsElapsed / (bowPhase === 'rest' ? (bowRestSeconds || 1) : bowDurationSeconds)) * 100}%`
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={startLongBowTimer}
                className={`px-6 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shadow-lg ${
                  isLongBowActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-[#C7A45B] hover:bg-[#DFB960] text-[#11110F]'
                }`}
              >
                {isLongBowActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isLongBowActive ? 'Pause Exercise' : 'Start Bowing Timer'}</span>
              </button>

              {completedBowCycles > 0 && onLogToJournal && (
                <button
                  onClick={handleLogLongBowToJournal}
                  className="px-5 py-2.5 rounded-2xl bg-[#22221D] hover:bg-[#2c2c25] border border-[#3B392F] text-[#E0C98F] text-xs font-mono transition-colors flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4 text-[#C7A45B]" />
                  <span>Log to Journal</span>
                </button>
              )}
            </div>
          </div>

          {/* Self-Checklist Cards */}
          <div className="p-5 rounded-2xl bg-[#161511] border border-[#2B2922] space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B] font-bold block">
              Tone & Contact Self-Reflection Checklist
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#0E0D0B] border border-[#26241D] cursor-pointer hover:border-[#C7A45B]/40">
                <input
                  type="checkbox"
                  checked={checklistTone}
                  onChange={(e) => setChecklistTone(e.target.checked)}
                  className="accent-[#C7A45B]"
                />
                <span className="text-[#BDB4A4]">Zero Scratchiness at Frog</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#0E0D0B] border border-[#26241D] cursor-pointer hover:border-[#C7A45B]/40">
                <input
                  type="checkbox"
                  checked={checklistPressure}
                  onChange={(e) => setChecklistPressure(e.target.checked)}
                  className="accent-[#C7A45B]"
                />
                <span className="text-[#BDB4A4]">Consistent Weight to the Tip</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#0E0D0B] border border-[#26241D] cursor-pointer hover:border-[#C7A45B]/40">
                <input
                  type="checkbox"
                  checked={checklistAngle}
                  onChange={(e) => setChecklistAngle(e.target.checked)}
                  className="accent-[#C7A45B]"
                />
                <span className="text-[#BDB4A4]">Bow Strictly Parallel to Bridge</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STRING CROSSING & FINGERING TRAINER */}
      {activeTab === 'stringcrossing' && (
        <div className="pt-6 space-y-6 relative z-10">
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-[#1B1914] border border-[#C7A45B]/30 text-[#E0C98F]">
            <Layers className="w-5 h-5 text-[#C7A45B] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-[#BDB4A4]">
              <strong className="text-[#F4EBDD] block">
                {lang === 'ml' ? 'തന്ത്രി മാറ്റ അഭ്യാസം: ' : 'String-Crossing Mechanics: '}
              </strong>
              {lang === 'ml'
                ? 'തന്ത്രികൾ മാറുമ്പോൾ ശബ്ദം മുറിഞ്ഞുപോകാതെ വില്ല് മൃദുവായി ഉരുട്ടി മാറ്റാൻ ശീലിക്കുക.'
                : 'Develop fluid elbow and wrist pivots to cross between the 4 strings seamlessly across the three speeds (Kalams).'}
            </div>
          </div>

          {/* Interactive Fretless Fingerboard Visualizer */}
          <div className="p-6 rounded-3xl bg-[#0D0C0A] border border-[#3B392F] space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B] block font-bold">
              Carnatic Fretless Fingerboard — String & Swara Position Guide
            </span>

            {/* 4 Strings Visual representation */}
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              {CARNATIC_VIOLIN_STRINGS.map((str) => (
                <div key={str.number} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#F4EBDD] font-bold">
                      Str #{str.number}: {str.label}
                    </span>
                    <span className="text-[#C7A45B]">
                      Open: {str.swara} ({Math.round(activeTonic.frequency * str.intervalRatio)} Hz)
                    </span>
                  </div>

                  {/* Fretless Neck Bar */}
                  <div className="relative h-7 bg-[#1C1A14] rounded-xl border border-[#3B392F] flex items-center px-4">
                    {/* Visual string wire */}
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"
                      style={{ opacity: 0.6 + str.number * 0.1 }}
                    />

                    {/* Open String Swara Badge */}
                    <div className="relative z-10 px-2.5 py-0.5 rounded-lg bg-[#0D0C0A] border border-[#C7A45B] text-[#E0C98F] text-[11px] font-mono font-bold">
                      Open: {str.swara.split(' ')[0]}
                    </div>

                    {/* Position Swaras Indicators for 1st string (Tara Sa) as an illustration */}
                    {str.number === 1 && (
                      <div className="relative z-10 flex space-x-6 ml-auto">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                          1st: Ṙ₁ / Ṙ₂
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                          2nd: Ġ₃
                        </span>
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono border border-sky-500/30">
                          3rd: Ṁ₁
                        </span>
                      </div>
                    )}

                    {/* Position Swaras for 3rd string (Madhya Sa) */}
                    {str.number === 3 && (
                      <div className="relative z-10 flex space-x-6 ml-auto">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                          1st: R₁ / R₂
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                          2nd: G₃
                        </span>
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono border border-sky-500/30">
                          3rd: M₁
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pattern Selection */}
            <div className="pt-4 border-t border-[#26241D] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[#C7A45B]">Exercise Pattern:</span>
                <select
                  value={crossingPattern}
                  onChange={(e) => setCrossingPattern(e.target.value as 'adjacent' | 'leaps' | 'open_octaves')}
                  className="bg-[#181712] border border-[#3B392F] text-[#F4EBDD] font-mono rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="adjacent">Adjacent Strings (3rd ↔ 2nd: Sa ↔ Pa)</option>
                  <option value="leaps">Octave Leaps (4th ↔ 1st: Mandra Pa ↔ Tara Sa)</option>
                  <option value="open_octaves">4-String Full Cascade (4 → 3 → 2 → 1)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-[#C7A45B]">Tempo:</span>
                <button
                  onClick={() => setTrainerKalam(1)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold ${
                    trainerKalam === 1 ? 'bg-[#C7A45B] text-[#11110F]' : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  1st Kalam
                </button>
                <button
                  onClick={() => setTrainerKalam(2)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold ${
                    trainerKalam === 2 ? 'bg-[#C7A45B] text-[#11110F]' : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  2nd Kalam
                </button>
                <button
                  onClick={() => setTrainerKalam(3)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold ${
                    trainerKalam === 3 ? 'bg-[#C7A45B] text-[#11110F]' : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  3rd Kalam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
