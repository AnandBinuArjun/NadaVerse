'use client';

import React, { useState } from 'react';
import {
  Headphones,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Sliders,
  Award,
  ArrowRight,
  Music2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { API_BASE_URL } from '../lib/api';

type EarCategory = 'swara' | 'interval' | 'phrase' | 'raga' | 'shruti' | 'tala';
type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';

interface EarQuestion {
  id: string;
  category: EarCategory;
  difficulty: DifficultyTier;
  promptEn: string;
  promptMl: string;
  ratios: number[];
  noteDurationSec: number;
  options: { id: string; labelEn: string; labelMl: string }[];
  correctOptionId: string;
  explanationEn: string;
  explanationMl: string;
  treatiseSource: string;
}

const EAR_TRAINING_QUESTIONS: EarQuestion[] = [
  // 1. SWARA IDENTIFICATION
  {
    id: 'swara-1',
    category: 'swara',
    difficulty: 'beginner',
    promptEn: 'Listen to the reference Shadjam (Sa), followed by the target swara. Identify the swarasthana:',
    promptMl: 'ആധാര ഷഡ്ജത്തിന് (Sa) ശേഷം കേൾക്കുന്ന സ്വരസ്ഥാനം ഏതെന്ന് തിരിച്ചറിയുക:',
    ratios: [1.0, 1.5],
    noteDurationSec: 0.75,
    options: [
      { id: 'M1', labelEn: 'Shuddha Madhyamam (M₁ — 4/3)', labelMl: 'ശുദ്ധ മധ്യമം (M₁ — 4/3)' },
      { id: 'P', labelEn: 'Panchamam (P — 3/2)', labelMl: 'പഞ്ചമം (P — 3/2)' },
      { id: 'G3', labelEn: 'Antara Gandharam (G₃ — 5/4)', labelMl: 'അന്തര ഗാന്ധാരം (G₃ — 5/4)' },
      { id: 'D2', labelEn: 'Chatushruti Dhaivatam (D₂ — 5/3)', labelMl: 'ചതുശ്രുതി ധൈവതം (D₂ — 5/3)' },
    ],
    correctOptionId: 'P',
    explanationEn: 'Panchamam (Pa) forms the consonant fifth (3:2 ratio, ~702 cents above Sa), the primary upper consonance (Samvadi) in Tanpura Pa-shruti tuning.',
    explanationMl: 'ഷഡ്ജത്തിൽ നിന്ന് 3:2 അനുപാതത്തിലുള്ള (702 സെന്റ്സ്) അചല സ്വരമായ പഞ്ചമമാണ് (Pa) ഇത്.',
    treatiseSource: 'Sangita Ratnakara (Sarangadeva, Swaragata Adhyaya)',
  },
  {
    id: 'swara-2',
    category: 'swara',
    difficulty: 'beginner',
    promptEn: 'Listen to Sa followed by the third swara of Mayamalavagowla. Which swarasthana is played?',
    promptMl: 'ഷഡ്ജത്തിന് ശേഷം മായാമാളവഗൗളയിലെ മൂന്നാമത്തെ സ്വരം കേൾക്കുക. ഇത് ഏത് സ്വരസ്ഥാനമാണ്?',
    ratios: [1.0, 5 / 4],
    noteDurationSec: 0.75,
    options: [
      { id: 'G2', labelEn: 'Sadharana Gandharam (G₂ — 6/5)', labelMl: 'സാധാരണ ഗാന്ധാരം (G₂ — 6/5)' },
      { id: 'G3', labelEn: 'Antara Gandharam (G₃ — 5/4)', labelMl: 'അന്തര ഗാന്ധാരം (G₃ — 5/4)' },
      { id: 'R1', labelEn: 'Shuddha Rishabham (R₁ — 16/15)', labelMl: 'ശുദ്ധ ഋഷഭം (R₁ — 16/15)' },
      { id: 'M1', labelEn: 'Shuddha Madhyamam (M₁ — 4/3)', labelMl: 'ശുദ്ധ മധ്യമം (M₁ — 4/3)' },
    ],
    correctOptionId: 'G3',
    explanationEn: 'Antara Gandharam (G₃) corresponds to the pure Just Intonation major third (5:4 ratio, 386.3 cents above Sa).',
    explanationMl: 'ഷഡ്ജത്തിൽ നിന്ന് 5:4 അനുപാതത്തിലുള്ള (386.3 സെന്റ്സ്) അന്തര ഗാന്ധാരമാണ് (G₃) ഇത്.',
    treatiseSource: 'Chaturdandi Prakasika (Venkatamakhin, Swara Prakarana)',
  },
  {
    id: 'swara-3',
    category: 'swara',
    difficulty: 'intermediate',
    promptEn: 'Identify this characteristic microtonal swara placed immediately above Shadjam:',
    promptMl: 'ഷഡ്ജത്തിന് തൊട്ടുമുകളിലായി കേൾക്കുന്ന ഈ സ്വരസ്ഥാനം തിരിച്ചറിയുക:',
    ratios: [1.0, 16 / 15],
    noteDurationSec: 0.75,
    options: [
      { id: 'R1', labelEn: 'Shuddha Rishabham (R₁ — 16/15)', labelMl: 'ശുദ്ധ ഋഷഭം (R₁ — 16/15)' },
      { id: 'R2', labelEn: 'Chatushruti Rishabham (R₂ — 9/8)', labelMl: 'ചതുശ്രുതി ഋഷഭം (R₂ — 9/8)' },
      { id: 'G2', labelEn: 'Sadharana Gandharam (G₂ — 6/5)', labelMl: 'സാധാരണ ഗാന്ധാരം (G₂ — 6/5)' },
      { id: 'N3', labelEn: 'Kakali Nishadam (N₃ — 15/8)', labelMl: 'കാകളി നിഷാദം (N₃ — 15/8)' },
    ],
    correctOptionId: 'R1',
    explanationEn: 'Shuddha Rishabham (R₁, 16:15 ratio, 111.7 cents) creates the tight semitonal interval characteristic of Mayamalavagowla, Thodi, and Saveri.',
    explanationMl: 'മായാമാളവഗൗള, തോടി എന്നീ രാഗങ്ങളുടെ മുഖമുദ്രയായ ശുദ്ധ ഋഷഭമാണ് (R₁ — 16/15) ഇത്.',
    treatiseSource: 'Sangita Sampradaya Pradarsini (Subbarama Dikshitar, 1904)',
  },
  {
    id: 'swara-4',
    category: 'swara',
    difficulty: 'advanced',
    promptEn: 'Distinguish between the two Madhyamas: identify the swara played after Sa:',
    promptMl: 'ഷഡ്ജത്തിന് ശേഷം കേൾക്കുന്ന മധ്യമ സ്വരസ്ഥാനം ഏതെന്ന് തിരിച്ചറിയുക:',
    ratios: [1.0, 45 / 32],
    noteDurationSec: 0.75,
    options: [
      { id: 'M1', labelEn: 'Shuddha Madhyamam (M₁ — 4/3)', labelMl: 'ശുദ്ധ മധ്യമം (M₁ — 4/3)' },
      { id: 'M2', labelEn: 'Prati Madhyamam (M₂ — 45/32)', labelMl: 'പ്രതി മധ്യമം (M₂ — 45/32)' },
      { id: 'P', labelEn: 'Panchamam (P — 3/2)', labelMl: 'പഞ്ചമം (P — 3/2)' },
      { id: 'D1', labelEn: 'Shuddha Dhaivatam (D₁ — 8/5)', labelMl: 'ശുദ്ധ ധൈവതം (D₁ — 8/5)' },
    ],
    correctOptionId: 'M2',
    explanationEn: 'Prati Madhyamam (M₂, 45:32 ratio, ~590 cents) is the defining swara of Melakartas 37–72 (such as Mechakalyani, Kamavardhini, and Shanmukhapriya).',
    explanationMl: '37 മുതൽ 72 വരെയുള്ള മേളകർത്താ രാഗങ്ങളുടെ (കല്യാണി, പന്തുവരാളി മുതലായവ) ജീവസ്വരമായ പ്രതി മധ്യമമാണ് (M₂ — 45/32) ഇത്.',
    treatiseSource: 'Chaturdandi Prakasika (Melakarta Prakarana)',
  },

  // 2. INTERVAL RECOGNITION
  {
    id: 'interval-1',
    category: 'interval',
    difficulty: 'beginner',
    promptEn: 'Identify the two-note consonant interval (Samvada) played from Shadjam:',
    promptMl: 'ഷഡ്ജത്തിൽ നിന്ന് വായിക്കുന്ന ഈ സംവാദി സ്വര ഇടവേള (Interval) തിരിച്ചറിയുക:',
    ratios: [1.0, 4 / 3],
    noteDurationSec: 0.75,
    options: [
      { id: 'sa-ma', labelEn: 'Shadja–Madhyama Bhava (S → M₁, 4:3 Fourth)', labelMl: 'ഷഡ്ജ-മധ്യമ ഭാവം (S → M₁, 4:3)' },
      { id: 'sa-pa', labelEn: 'Shadja–Panchama Bhava (S → P, 3:2 Fifth)', labelMl: 'ഷഡ്ജ-പഞ്ചമ ഭാവം (S → P, 3:2)' },
      { id: 'sa-ga3', labelEn: 'Shadja–Antara Gandhara (S → G₃, 5:4)', labelMl: 'ഷഡ്ജ-അന്തര ഗാന്ധാരം (S → G₃, 5:4)' },
      { id: 'sa-tara', labelEn: 'Octave Sthayi (S → Ṡ, 2:1)', labelMl: 'താര സ്ഥായി ഷഡ്ജം (S → Ṡ, 2:1)' },
    ],
    correctOptionId: 'sa-ma',
    explanationEn: 'Shadja–Madhyama Bhava (4:3 ratio, 498 cents) is one of the two primary Samvadi (consonant) relationships defined in Bharata’s Natya Shastra (13-shruti distance).',
    explanationMl: 'നാട്യശാസ്ത്രത്തിൽ പ്രതിപാദിക്കുന്ന പ്രധാന സംവാദി ബന്ധമായ ഷഡ്ജ-മധ്യമ ഭാവമാണ് (S → M₁, 4:3) ഇത്.',
    treatiseSource: 'Natya Shastra (Bharata Muni, Chapter 28)',
  },
  {
    id: 'interval-2',
    category: 'interval',
    difficulty: 'intermediate',
    promptEn: 'Listen to the wide Daatu (leap) interval used in Mayamalavagowla. Which pair of swaras is heard?',
    promptMl: 'മായാമാളവഗൗളയിലെ ഈ ദാട്ടു സ്വര ഇടവേള ഏതെന്ന് തിരിച്ചറിയുക:',
    ratios: [16 / 15, 5 / 4],
    noteDurationSec: 0.75,
    options: [
      { id: 'r1-g3', labelEn: 'R₁ → G₃ (Augmented Second / 4-Shruti Gap)', labelMl: 'R₁ → G₃ (ശുദ്ധ ഋഷഭം → അന്തര ഗാന്ധാരം)' },
      { id: 'r2-g2', labelEn: 'R₂ → G₂ (Minor Semitone)', labelMl: 'R₂ → G₂ (ചതുശ്രുതി ഋഷഭം → സാധാരണ ഗാന്ധാരം)' },
      { id: 'm1-p', labelEn: 'M₁ → P (9:8 Tone)', labelMl: 'M₁ → P (ശുദ്ധ മധ്യമം → പഞ്ചമം)' },
      { id: 'p-d2', labelEn: 'P → D₂ (Chatushruti Dhaivata step)', labelMl: 'P → D₂ (പഞ്ചമം → ചതുശ്രുതി ധൈവതം)' },
    ],
    correctOptionId: 'r1-g3',
    explanationEn: 'The interval between R₁ (16/15) and G₃ (5/4) spans ~274.6 cents, giving Mayamalavagowla its unmistakable symmetry with D₁ → N₃.',
    explanationMl: 'R₁ (16/15), G₃ (5/4) എന്നിവയ്ക്കിടയിലുള്ള 274.6 സെന്റ്സ് ഇടവേളയാണ് മായാമാളവഗൗളയ്ക്ക് തനതായ ഭാവം നൽകുന്നത്.',
    treatiseSource: 'Sangita Sampradaya Pradarsini (Mayamalavagowla Lakshana)',
  },

  // 3. ASCENDING & DESCENDING PHRASE RECOGNITION
  {
    id: 'phrase-1',
    category: 'phrase',
    difficulty: 'beginner',
    promptEn: 'Listen to this 5-swara contour. Identify the direction and swara pattern:',
    promptMl: 'ഈ 5 സ്വരങ്ങളുടെ സഞ്ചാരം കേട്ട് ആരോഹണമാണോ അവരോഹണമാണോ എന്ന് തിരിച്ചറിയുക:',
    ratios: [1.0, 9 / 8, 5 / 4, 3 / 2, 5 / 3],
    noteDurationSec: 0.55,
    options: [
      { id: 'asc-mohanam', labelEn: 'Ascending (Arohana): S R₂ G₃ P D₂', labelMl: 'ആരോഹണ സഞ്ചാരം: S R₂ G₃ P D₂' },
      { id: 'desc-mohanam', labelEn: 'Descending (Avarohana): Ṡ D₂ P G₃ R₂', labelMl: 'അവരോഹണ സഞ്ചാരം: Ṡ D₂ P G₃ R₂' },
      { id: 'asc-maya', labelEn: 'Ascending (Arohana): S R₁ G₃ M₁ P', labelMl: 'ആരോഹണ സഞ്ചാരം: S R₁ G₃ M₁ P' },
      { id: 'desc-hindolam', labelEn: 'Descending (Avarohana): Ṡ N₂ D₁ M₁ G₂', labelMl: 'അവരോഹണ സഞ്ചാരം: Ṡ N₂ D₁ M₁ G₂' },
    ],
    correctOptionId: 'asc-mohanam',
    explanationEn: 'The phrase ascends through the Audava (pentatonic) swaras of Mohanam: S (1/1) → R₂ (9/8) → G₃ (5/4) → P (3/2) → D₂ (5/3), omitting Madhyamam.',
    explanationMl: 'മധ്യമം വർജ്ജിച്ചുകൊണ്ടുള്ള മോഹന രാഗത്തിലെ ആരോഹണ സഞ്ചാരമാണ് (S R₂ G₃ P D₂) ഇത്.',
    treatiseSource: 'Sangita Sampradaya Pradarsini (Mohanam)',
  },
  {
    id: 'phrase-2',
    category: 'phrase',
    difficulty: 'intermediate',
    promptEn: 'Listen to this Vakra (zig-zag) or descending phrase and identify the exact swara sequence:',
    promptMl: 'ഈ അവരോഹണ/വക്ര സ്വര സഞ്ചാരം കേട്ട് ശരിയായ സ്വരക്രമം തിരഞ്ഞെടുക്കുക:',
    ratios: [2.0, 15 / 8, 8 / 5, 3 / 2, 4 / 3],
    noteDurationSec: 0.55,
    options: [
      { id: 'desc-uttaranga', labelEn: 'Descending Uttaranga: Ṡ N₃ D₁ P M₁', labelMl: 'അവരോഹണ ഉത്തരാംഗം: Ṡ N₃ D₁ P M₁' },
      { id: 'asc-purvanga', labelEn: 'Ascending Purvanga: S R₁ G₃ M₁ P', labelMl: 'ആരോഹണ പൂർവ്വാംഗം: S R₁ G₃ M₁ P' },
      { id: 'vakra-ananda', labelEn: 'Vakra Phrase: S G₂ R₂ G₂ M₁', labelMl: 'വക്ര സഞ്ചാരം: S G₂ R₂ G₂ M₁' },
      { id: 'asc-hamsa', labelEn: 'Ascending: S R₂ G₃ P N₃', labelMl: 'ആരോഹണം: S R₂ G₃ P N₃' },
    ],
    correctOptionId: 'desc-uttaranga',
    explanationEn: 'The phrase descends from Tara Shadjam (2/1) through Kakali Nishadam (15/8), Shuddha Dhaivatam (8/5), Panchamam (3/2) to Shuddha Madhyamam (4/3).',
    explanationMl: 'താര സ്ഥായി ഷഡ്ജത്തിൽ നിന്ന് ക്രമമായി താഴോട്ട് വരുന്ന Ṡ N₃ D₁ P M₁ എന്ന അവരോഹണ സഞ്ചാരമാണിത്.',
    treatiseSource: 'Chaturdandi Prakasika (Mayamalavagowla)',
  },

  // 4. RAGA & CHARACTERISTIC PRAYOGA IDENTIFICATION
  {
    id: 'raga-1',
    category: 'raga',
    difficulty: 'beginner',
    promptEn: 'Listen to this signature prayoga (G₃ P N₃ Ṡ - Ṡ N₃ P G₃ R₂ S). Identify the Raga:',
    promptMl: 'ഈ സവിശേഷ പ്രയോഗം (G₃ P N₃ Ṡ - Ṡ N₃ P G₃ R₂ S) കേട്ട് രാഗം തിരിച്ചറിയുക:',
    ratios: [5 / 4, 3 / 2, 15 / 8, 2.0, 15 / 8, 3 / 2, 5 / 4, 9 / 8, 1.0],
    noteDurationSec: 0.48,
    options: [
      { id: 'hamsadhwani', labelEn: 'Hamsadhwani (Janya of 29th Melakarta)', labelMl: 'ഹംസധ്വനി (29-ാം മേളകർത്താവിന്റെ ജന്യം)' },
      { id: 'mohanam', labelEn: 'Mohanam (Uses D₂ instead of N₃)', labelMl: 'മോഹനം (N₃-ന് പകരം D₂ ഉപയോഗിക്കുന്നു)' },
      { id: 'hindolam', labelEn: 'Hindolam (S G₂ M₁ D₁ N₂ Ṡ)', labelMl: 'ഹിന്ദോളം (S G₂ M₁ D₁ N₂ Ṡ)' },
      { id: 'malayamarutam', labelEn: 'Malayamarutam (Uses R₁ and D₂)', labelMl: 'മലയമാരുതം (R₁, D₂ ഉപയോഗിക്കുന്നു)' },
    ],
    correctOptionId: 'hamsadhwani',
    explanationEn: 'Hamsadhwani (created by Ramaswami Dikshitar, immortalized in "Vatapi Ganapatim") is an Audava raga taking S R₂ G₃ P N₃ Ṡ with prominent G₃–P–N₃ phrases.',
    explanationMl: 'രാമസ്വാമി ദീക്ഷിതർ ചിട്ടപ്പെടുത്തിയ ഹംസധ്വനി രാഗത്തിന്റെ (S R₂ G₃ P N₃ Ṡ) ജീവസ്വര പ്രയോഗമാണിത്.',
    treatiseSource: 'Sangita Sampradaya Pradarsini (Hamsadhwani)',
  },
  {
    id: 'raga-2',
    category: 'raga',
    difficulty: 'intermediate',
    promptEn: 'Listen to this Panchama-varjya Audava prayoga (S G₂ M₁ D₁ N₂ Ṡ - Ṡ N₂ D₁ M₁ G₂ S). Identify the Raga:',
    promptMl: 'പഞ്ചമം വർജ്ജിച്ചുള്ള ഈ ഔഡവ രാഗ പ്രയോഗം (S G₂ M₁ D₁ N₂ Ṡ) കേട്ട് രാഗം തിരിച്ചറിയുക:',
    ratios: [1.0, 6 / 5, 4 / 3, 8 / 5, 9 / 5, 2.0, 9 / 5, 8 / 5, 4 / 3, 6 / 5, 1.0],
    noteDurationSec: 0.45,
    options: [
      { id: 'hindolam', labelEn: 'Hindolam (Janya of 20th Melakarta Natabhairavi)', labelMl: 'ഹിന്ദോളം (നഠഭൈരവിയുടെ ജന്യരാഗം)' },
      { id: 'mohanam', labelEn: 'Mohanam (S R₂ G₃ P D₂ Ṡ)', labelMl: 'മോഹനം (S R₂ G₃ P D₂ Ṡ)' },
      { id: 'abheri', labelEn: 'Abheri (Takes Panchamam P)', labelMl: 'ആഭേരി (പഞ്ചമം ഉൾപ്പെടുന്നു)' },
      { id: 'revati', labelEn: 'Revati (S R₁ M₁ P N₂ Ṡ)', labelMl: 'രേവതി (S R₁ M₁ P N₂ Ṡ)' },
    ],
    correctOptionId: 'hindolam',
    explanationEn: 'Hindolam omits both Rishabham and Panchamam (requiring Ma-shruti Tanpura tuning), highlighting the symmetrical consonance of G₂, M₁, D₁, and N₂.',
    explanationMl: 'ഋഷഭവും പഞ്ചമവും വർജ്ജിച്ചുള്ള ഹിന്ദോളം രാഗത്തിന്റെ ("സാമജ വര ഗമനാ") സവിശേഷ പ്രയോഗമാണിത്.',
    treatiseSource: 'Sangita Sampradaya Pradarsini & Tyagaraja Kriti Tradition',
  },

  // 5. SHRUTI MATCHING
  {
    id: 'shruti-1',
    category: 'shruti',
    difficulty: 'intermediate',
    promptEn: 'Listen closely to the reference Sa (First Tone) and the second tone. How is the second tone tuned relative to pure Adhara Shadjam?',
    promptMl: 'ആദ്യം കേൾക്കുന്ന ആധാര ഷഡ്ജവുമായി താരതമ്യം ചെയ്യുമ്പോൾ രണ്ടാമത്തെ സ്വരം എപ്രകാരമാണ്?',
    ratios: [1.0, Math.pow(2, 28 / 1200)],
    noteDurationSec: 0.9,
    options: [
      { id: 'sharp-28', labelEn: 'Sharp (+28 cents above Adhara Shadjam)', labelMl: 'ശ്രുതി കൂടുതൽ (+28 സെന്റ്സ് മുകളിൽ)' },
      { id: 'pure-0', labelEn: 'Exact Unison (0 cents difference)', labelMl: 'കൃത്യമായ ശ്രുതി ചേർച്ച (0 സെന്റ്സ്)' },
      { id: 'flat-28', labelEn: 'Flat (-28 cents below Adhara Shadjam)', labelMl: 'ശ്രുതി കുറവ് (-28 സെന്റ്സ് താഴെ)' },
      { id: 'fifth', labelEn: 'Panchamam (702 cents above Sa)', labelMl: 'പഞ്ചമം (+702 സെന്റ്സ്)' },
    ],
    correctOptionId: 'sharp-28',
    explanationEn: 'The second pitch is +28 cents higher than the reference Sa (exceeding a Prana/Pramana comma of ~22 cents), producing audible beating against the drone.',
    explanationMl: 'രണ്ടാമത്തെ സ്വരം ആധാര ഷഡ്ജത്തേക്കാൾ +28 സെന്റ്സ് (ഒരു ശ്രുതി പ്രമാണത്തിലധികം) ഉയർന്നതാണ്.',
    treatiseSource: 'Natya Shastra (22-Shruti Sarana Experiment)',
  },

  // 6. TALA & RHYTHM RECOGNITION
  {
    id: 'tala-1',
    category: 'tala',
    difficulty: 'beginner',
    promptEn: 'Listen to the accented Samam and Anga pulse pattern (2 + 3 = 5 counts: Tha Ka | Tha Ki Ta). Which Tala is this?',
    promptMl: 'ഈ താളവട്ടത്തിന്റെ അംഗഘടന (2 + 3 = 5 അക്ഷരങ്ങൾ: ത ക | ത കി ട) കേട്ട് താളം തിരിച്ചറിയുക:',
    ratios: [1.5, 1.0, 1.5, 1.0, 1.0],
    noteDurationSec: 0.36,
    options: [
      { id: 'khanda-chapu', labelEn: 'Khanda Chapu Tala (2 + 3 = 5 Aksharas)', labelMl: 'ഖണ്ഡ ചാപ്പു താളം (2 + 3 = 5 അക്ഷരങ്ങൾ)' },
      { id: 'misra-chapu', labelEn: 'Misra Chapu Tala (3 + 2 + 2 = 7 Aksharas)', labelMl: 'മിശ്ര ചാപ്പു താളം (3 + 2 + 2 = 7 അക്ഷരങ്ങൾ)' },
      { id: 'rupaka', labelEn: 'Chatusra Jati Rupaka Tala (2 + 4 = 6 Aksharas)', labelMl: 'രൂപക താളം (2 + 4 = 6 അക്ഷരങ്ങൾ)' },
      { id: 'adi', labelEn: 'Adi Tala (4 + 2 + 2 = 8 Aksharas)', labelMl: 'ആദി താളം (4 + 2 + 2 = 8 അക്ഷരങ്ങൾ)' },
    ],
    correctOptionId: 'khanda-chapu',
    explanationEn: 'Khanda Chapu features a 5-count cycle divided asymmetrically into 2 + 3 (accents on beats 1 and 3).',
    explanationMl: 'ഒന്നാമത്തെയും മൂന്നാമത്തെയും എണ്ണത്തിൽ തട്ടുകളുള്ള (2 + 3 = 5) ഖണ്ഡ ചാപ്പു താളമാണിത്.',
    treatiseSource: 'Sangita Ratnakara (Tala Adhyaya) & Classical Concert Practice',
  },
];

interface EarTrainingAcademyProps {
  activeTonic: TonicNote;
  onTonicChange?: (tonic: TonicNote) => void;
}

export const EarTrainingAcademy: React.FC<EarTrainingAcademyProps> = ({
  activeTonic,
  onTonicChange,
}) => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<EarCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>('beginner');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sessionTotal, setSessionTotal] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);

  // Interactive Shruti Cent Matcher Sandbox (Microphone-free slider mode)
  const [targetShrutiCents, setTargetShrutiCents] = useState<number>(386); // Antara Ga (5/4)
  const [userSliderCents, setUserSliderCents] = useState<number>(350);
  const [shrutiMatchChecked, setShrutiMatchChecked] = useState<boolean>(false);

  const filteredQuestions = EAR_TRAINING_QUESTIONS.filter(
    (q) => selectedCategory === 'all' || q.category === selectedCategory
  );
  const currentQuestion = filteredQuestions[currentIndex % filteredQuestions.length] || EAR_TRAINING_QUESTIONS[0];

  const handlePlayQuestionAudio = async () => {
    await audioEngine.unlockAudio();
    audioEngine.setTonic(activeTonic.frequency);
    const stepMs = Math.round((currentQuestion.noteDurationSec * 1000) / playbackSpeed);
    audioEngine.playRagaScale(currentQuestion.ratios, stepMs);
  };

  const handleSubmitAnswer = async (optId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optId);
    setIsSubmitted(true);

    const isCorrect = optId === currentQuestion.correctOptionId;
    const newTotal = sessionTotal + 1;
    const newCorrect = sessionCorrect + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? streakCount + 1 : 0;

    setSessionTotal(newTotal);
    setSessionCorrect(newCorrect);
    setStreakCount(newStreak);

    // Adaptive difficulty progression
    if (newStreak >= 3 && selectedDifficulty === 'beginner') {
      setSelectedDifficulty('intermediate');
    } else if (newStreak >= 5 && selectedDifficulty === 'intermediate') {
      setSelectedDifficulty('advanced');
    }

    const scorePct = Math.round((newCorrect / newTotal) * 100);
    if (typeof window !== 'undefined') {
      try {
        const raw = JSON.parse(localStorage.getItem('nadaverse_ear_training_history') || '[]');
        raw.unshift({
          id: `et-${newTotal}-${currentQuestion.id}`,
          category: currentQuestion.category,
          difficulty: selectedDifficulty,
          scorePct,
        });
        localStorage.setItem('nadaverse_ear_training_history', JSON.stringify(raw.slice(0, 50)));
        window.dispatchEvent(new Event('nadaverse:ear_training_updated'));
      } catch {}
    }

    // Persist to backend if authenticated
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
      if (token) {
        await fetch(`${API_BASE_URL}/api/v1/ear-training/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: currentQuestion.category,
            difficulty: selectedDifficulty,
            tonic: activeTonic.name,
            total_questions: 1,
            correct_answers: isCorrect ? 1 : 0,
          }),
        });
      }
    } catch {}
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const playCentsTone = async (cents: number) => {
    await audioEngine.unlockAudio();
    const freq = activeTonic.frequency * Math.pow(2, cents / 1200);
    audioEngine.auditionNote(freq, 0.7);
  };

  const [shrutiStepIdx, setShrutiStepIdx] = useState<number>(0);

  const randomizeShrutiTarget = () => {
    const pureSwaraCents = [112, 204, 316, 386, 498, 590, 702, 814, 884, 1088];
    const nextIdx = (shrutiStepIdx + 1) % pureSwaraCents.length;
    setShrutiStepIdx(nextIdx);
    const picked = pureSwaraCents[nextIdx];
    setTargetShrutiCents(picked);
    setUserSliderCents(Math.max(0, Math.min(1200, picked - 42)));
    setShrutiMatchChecked(false);
  };

  const shrutiErrorCents = Math.abs(userSliderCents - targetShrutiCents);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Headphones className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'ശ്രവണ ജ്ഞാന അക്കാദമി' : 'Advanced Carnatic Ear Training Academy'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'സ്വരസ്ഥാനം, പ്രയോഗം & ശ്രുതി തിരിച്ചറിയൽ കളരി'
                : 'Swarasthana, Prayoga & Microtonal Shruti Discrimination'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-3xl">
              {lang === 'ml'
                ? 'ജസ്റ്റ് ഇൻ്റോണേഷൻ (Just Intonation) സ്വരാനുപാതങ്ങളിൽ അധിഷ്ഠിതമായ ശ്രവണ പരിശീലനം. മൈക്രോഫോൺ ഇല്ലാതെയും പരിശീലിക്കാം.'
                : 'Deterministic Just Intonation ear training grounded in primary treatises. Includes adaptive difficulty, adjustable speed, and microphone-free interactive exercises.'}
            </p>
          </div>

          {/* Controls: Tonic & Speed */}
          <div className="flex flex-wrap items-center gap-2.5 bg-[#14130f] p-3 rounded-2xl border border-[#3B392F]">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <Music2 className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span className="text-[#BDB4A4]">{lang === 'ml' ? 'ശ്രുതി:' : 'Tonic:'}</span>
              <select
                value={activeTonic.name}
                onChange={(e) => {
                  const found = TONIC_OPTIONS.find((t) => t.name === e.target.value);
                  if (found && onTonicChange) onTonicChange(found);
                }}
                className="bg-[#22221D] text-[#E0C98F] border border-[#3B392F] rounded-lg px-2 py-1 text-xs font-mono"
                aria-label="Select Ear Training Tonic"
              >
                {TONIC_OPTIONS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.kattai})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono">
              <Sliders className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span className="text-[#BDB4A4]">{lang === 'ml' ? 'വേഗത:' : 'Speed:'}</span>
              {[0.65, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-[11px] cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Live Scoreboard */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#3B392F]">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', labelEn: 'All Modules', labelMl: 'എല്ലാം' },
              { id: 'swara', labelEn: 'Swara ID', labelMl: 'സ്വരസ്ഥാനം' },
              { id: 'interval', labelEn: 'Intervals (Samvada)', labelMl: 'സ്വര ഇടവേളകൾ' },
              { id: 'phrase', labelEn: 'Arohana / Avarohana', labelMl: 'ആരോഹണ / അവരോഹണം' },
              { id: 'raga', labelEn: 'Raga & Prayoga ID', labelMl: 'രാഗ പ്രയോഗങ്ങൾ' },
              { id: 'shruti', labelEn: 'Shruti Alignment', labelMl: 'ശ്രുതി ചേർച്ച' },
              { id: 'tala', labelEn: 'Tala & Rhythm', labelMl: 'താള തിരിച്ചറിയൽ' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  setCurrentIndex(0);
                  setIsSubmitted(false);
                  setSelectedOptionId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                    : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
                }`}
              >
                {lang === 'ml' ? cat.labelMl : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono bg-[#14130f] px-3.5 py-2 rounded-xl border border-[#C7A45B]/30">
            <Award className="w-4 h-4 text-[#C7A45B]" />
            <span className="text-[#F4EBDD]">
              {lang === 'ml' ? 'സ്കോർ:' : 'Score:'}{' '}
              <strong className="text-[#E0C98F]">
                {sessionCorrect}/{sessionTotal}
              </strong>
            </span>
            <span className="text-[#BDB4A4]">•</span>
            <span className="text-[#6EA887]">
              {lang === 'ml' ? 'സ്ട്രീക്ക്:' : 'Streak:'} {streakCount}
            </span>
            <span className="text-[#BDB4A4]">•</span>
            <span className="uppercase text-[#C7A45B]">{selectedDifficulty}</span>
          </div>
        </div>
      </div>

      {/* Main Question & Interactive Shruti Matcher Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Deterministic Ear Training Question */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#C7A45B]">
            <span className="uppercase">
              {currentQuestion.category} • {currentQuestion.difficulty}
            </span>
            <span>
              {lang === 'ml' ? 'ചോദ്യം' : 'Exercise'} {(currentIndex % filteredQuestions.length) + 1} /{' '}
              {filteredQuestions.length}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD] leading-snug">
            {lang === 'ml' ? currentQuestion.promptMl : currentQuestion.promptEn}
          </h3>

          {/* Audition Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayQuestionAudio}
              className="px-6 py-3.5 rounded-2xl nv-gold-btn text-[#11110F] font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {lang === 'ml'
                  ? `ശ്രവിക്കുക (${playbackSpeed}x വേഗത)`
                  : `Audition Musical Phrase (${playbackSpeed}x Speed)`}
              </span>
            </button>

            <button
              onClick={() => playCentsTone(0)}
              className="px-4 py-3 rounded-2xl bg-[#22221D] hover:bg-[#2a2820] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] cursor-pointer"
            >
              {lang === 'ml' ? `ആധാര ഷഡ്ജം (${activeTonic.name})` : `Play Reference Sa (${activeTonic.name})`}
            </button>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5 pt-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.id === currentQuestion.correctOptionId;

              let btnStyle = 'bg-[#22221D] hover:bg-[#2a2922] border-[#3B392F] text-[#F4EBDD]';
              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-[#6EA887]/20 border-[#6EA887] text-[#F4EBDD]';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-[#E17D73]/20 border-[#E17D73] text-[#F4EBDD]';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSubmitAnswer(opt.id)}
                  disabled={isSubmitted}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span>{lang === 'ml' ? opt.labelMl : opt.labelEn}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#6EA887] shrink-0" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#E17D73] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Musicological Rationale & Next Exercise */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-[#14130f] border border-[#C7A45B]/35 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E0C98F]">
                <Sparkles className="w-4 h-4 text-[#C7A45B]" />
                <span>
                  {selectedOptionId === currentQuestion.correctOptionId
                    ? lang === 'ml'
                      ? 'ശരിയായ ഉത്തരം • സംഗീത ശാസ്ത്ര വിശദീകരണം'
                      : 'Correct • Musicological Rationale'
                    : lang === 'ml'
                    ? 'പുനരവലോകന കുറിപ്പ് • സംഗീത ശാസ്ത്ര വിശദീകരണം'
                    : 'Revision Insight • Musicological Rationale'}
                </span>
              </div>
              <p className="text-xs text-[#F4EBDD] leading-relaxed">
                {lang === 'ml' ? currentQuestion.explanationMl : currentQuestion.explanationEn}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#3B392F]">
                <span className="text-[11px] font-mono text-[#87947A]">
                  {lang === 'ml' ? 'അവലംബം: ' : 'Source: '}
                  {currentQuestion.treatiseSource}
                </span>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'ml' ? 'അടുത്ത പരിശീലനം' : 'Next Exercise'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Interactive Microphone-Free Shruti Cent Matching Workbench */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C7A45B]">
              {lang === 'ml' ? 'മൈക്രോഫോൺ രഹിത ശ്രുതി മാച്ചിംഗ്' : 'Microphone-Free Shruti Matcher'}
            </span>
            <button
              onClick={randomizeShrutiTarget}
              className="text-xs font-mono text-[#E0C98F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'പുതിയ ശ്രുതി' : 'New Target'}</span>
            </button>
          </div>

          <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml'
              ? 'സെന്റ്സ് സ്ലൈഡർ ഉപയോഗിച്ച് സ്വരം ശ്രുതിചേർക്കുക'
              : 'Align the Microtonal Swara by Ear (Cent Slider)'}
          </h3>
          <p className="text-xs text-[#BDB4A4] leading-relaxed">
            {lang === 'ml'
              ? 'ആദ്യം ലക്ഷ്യ സ്വരം കേൾക്കുക. തുടർന്ന് സ്ലൈഡർ നീക്കി നിങ്ങളുടെ സ്വരം അതേ ശ്രുതിയിലേക്ക് ക്രമീകരിക്കുക.'
              : 'Play the Mystery Target Swara, then adjust your Tuning Slider and audition your pitch until the two tones lock in beatless unison.'}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => playCentsTone(targetShrutiCents)}
              className="p-3 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'ലക്ഷ്യ സ്വരം കേൾക്കുക' : '1. Play Target'}</span>
            </button>
            <button
              onClick={() => playCentsTone(userSliderCents)}
              className="p-3 rounded-xl bg-[#22221D] hover:bg-[#2c2a22] border border-[#3B392F] text-xs font-mono text-[#F4EBDD] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#87947A]" />
              <span>{lang === 'ml' ? 'നിങ്ങളുടെ സ്വരം കേൾക്കുക' : '2. Play Your Pitch'}</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono text-[#BDB4A4]">
              <span>Sa (0c)</span>
              <span className="text-[#E0C98F] font-bold">
                {userSliderCents} cents ({(activeTonic.frequency * Math.pow(2, userSliderCents / 1200)).toFixed(1)} Hz)
              </span>
              <span>Ṡ (1200c)</span>
            </div>
            <input
              type="range"
              min={0}
              max={1200}
              step={2}
              value={userSliderCents}
              onChange={(e) => {
                setUserSliderCents(parseInt(e.target.value, 10));
                setShrutiMatchChecked(false);
              }}
              className="w-full accent-[#C7A45B] cursor-pointer"
              aria-label="Adjust pitch in cents from Adhara Shadjam"
            />
          </div>

          <button
            onClick={() => setShrutiMatchChecked(true)}
            className="w-full py-3 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs cursor-pointer transition-colors"
          >
            {lang === 'ml' ? 'ശ്രുതി കൃത്യത പരിശോധിക്കുക' : 'Verify Shruti Alignment'}
          </button>

          {shrutiMatchChecked && (
            <div className="p-3.5 rounded-xl bg-[#14130f] border border-[#C7A45B]/35 text-xs space-y-1.5">
              <div className="font-mono font-bold text-[#E0C98F]">
                {shrutiErrorCents <= 8
                  ? lang === 'ml'
                    ? `അത്യുത്തമം! വ്യത്യാസം വെറും ${shrutiErrorCents} സെന്റ്സ് മാത്രം.`
                    : `Shruti Shuddham! Within ${shrutiErrorCents} cents of target (${targetShrutiCents}c).`
                  : shrutiErrorCents <= 22
                  ? lang === 'ml'
                    ? `വളരെ അടുത്തെത്തി! വ്യത്യാസം: ${shrutiErrorCents} സെന്റ്സ് (1 പ്രമാണ ശ്രുതിക്കുള്ളിൽ).`
                    : `Close Alignment! Deviation: ${shrutiErrorCents} cents (Target: ${targetShrutiCents}c).`
                  : lang === 'ml'
                  ? `വ്യത്യാസം: ${shrutiErrorCents} സെന്റ്സ് (ലക്ഷ്യം: ${targetShrutiCents} സെന്റ്സ്). വീണ്ടും ശ്രമിക്കുക.`
                  : `Deviation: ${shrutiErrorCents} cents (Target was ${targetShrutiCents}c). Adjust slider and re-audition.`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
