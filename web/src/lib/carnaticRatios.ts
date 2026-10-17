/**
 * NadaVerse Canonical Carnatic Just Intonation Swarasthana Ratios & Definitions
 * Based on classical 22-Shruti / Just Intonation musicological treatises:
 * - Chaturdandi Prakasika (Venkatamakhin, c. 1620 CE)
 * - Sangita Ratnakara (Sarangadeva, 13th Century)
 * - Sangita Sampradaya Pradarsini (Subbarama Dikshitar, 1904)
 */

export interface SwarasthanaInfo {
  symbol: string;
  name: string;
  nameMl: string;
  ratio: number;
  fraction: string;
  expectedCents: number;
  westernRelative: string;
  description: string;
}

// Canonical Just Intonation ratios mapped across symbols, subscripts, and ascii aliases
export const STANDARD_SWARA_RATIOS: Record<string, number> = {
  // Shadjam (Tonic fundamental)
  'S': 1.0, 'Sa': 1.0, 's': 1.0,

  // Rishabham
  'R₁': 16 / 15, 'R1': 16 / 15, 'Ri1': 16 / 15, // Shuddha Rishabham (112 cents)
  'R₂': 9 / 8, 'R2': 9 / 8, 'Ri2': 9 / 8,       // Chatushruti Rishabham (204 cents)
  'R₃': 6 / 5, 'R3': 6 / 5, 'Ri3': 6 / 5,       // Shatshruti Rishabham (316 cents)

  // Gandharam
  'G₁': 9 / 8, 'G1': 9 / 8, 'Ga1': 9 / 8,       // Shuddha Gandharam (= R2)
  'G₂': 6 / 5, 'G2': 6 / 5, 'Ga2': 6 / 5,       // Sadharana Gandharam (= R3)
  'G₃': 5 / 4, 'G3': 5 / 4, 'Ga3': 5 / 4,       // Antara Gandharam (386 cents)

  // Madhyamam
  'M₁': 4 / 3, 'M1': 4 / 3, 'Ma1': 4 / 3,       // Shuddha Madhyamam (498 cents)
  'M₂': 45 / 32, 'M2': 45 / 32, 'Ma2': 45 / 32, // Prati Madhyamam (590 cents)

  // Panchamam
  'P': 3 / 2, 'Pa': 3 / 2, 'p': 3 / 2,          // Panchamam (702 cents)

  // Dhaivatam
  'D₁': 8 / 5, 'D1': 8 / 5, 'Dha1': 8 / 5,      // Shuddha Dhaivatam (814 cents)
  'D₂': 27 / 16, 'D2': 27 / 16, 'Dha2': 27 / 16, // Chatushruti Dhaivatam (906 cents)
  'D₃': 9 / 5, 'D3': 9 / 5, 'Dha3': 9 / 5,      // Shatshruti Dhaivatam (1018 cents)

  // Nishadam
  'N₁': 27 / 16, 'N1': 27 / 16, 'Ni1': 27 / 16, // Shuddha Nishadam (= D2)
  'N₂': 9 / 5, 'N2': 9 / 5, 'Ni2': 9 / 5,       // Kaisiki Nishadam (= D3)
  'N₃': 15 / 8, 'N3': 15 / 8, 'Ni3': 15 / 8,    // Kakali Nishadam (1088 cents)

  // Tara Shadjam (Higher Octave Tonic)
  'Ṡ': 2.0, 'S˙': 2.0, 'S.': 2.0, 'Sa.': 2.0, 'S_HIGH': 2.0,
  'R1_HIGH': (16 / 15) * 2, 'R2_HIGH': (9 / 8) * 2, 'G3_HIGH': (5 / 4) * 2,
  'M1_HIGH': (4 / 3) * 2, 'P_HIGH': (3 / 2) * 2,

  // Mandra Shadjam (Lower Octave Tonic)
  'Ṣ': 0.5, 'S,': 0.5, 'S_LOW': 0.5, 'P_LOW': (3 / 2) * 0.5,
};

// 12 Primary Swarasthanas with bilingual names, fractions, and expected cents
export const SWARASTHANA_DEFINITIONS: SwarasthanaInfo[] = [
  {
    symbol: 'S',
    name: 'Shadjam',
    nameMl: 'ഷഡ്ജം',
    ratio: 1.0,
    fraction: '1/1',
    expectedCents: 0,
    westernRelative: 'Root / Tonic',
    description: 'Adhara Shadjam — the fundamental invariant tonic reference.',
  },
  {
    symbol: 'R₁',
    name: 'Shuddha Rishabham',
    nameMl: 'ശുദ്ധ ഋഷഭം',
    ratio: 16 / 15,
    fraction: '16/15',
    expectedCents: 112,
    westernRelative: 'Minor 2nd (Db)',
    description: 'Minor semitone above Sa (Mayamalavagowla, Saveri).',
  },
  {
    symbol: 'R₂ / G₁',
    name: 'Chatushruti Rishabham / Shuddha Gandharam',
    nameMl: 'ചതുശ്രുതി ഋഷഭം',
    ratio: 9 / 8,
    fraction: '9/8',
    expectedCents: 204,
    westernRelative: 'Major 2nd (D)',
    description: 'Major whole tone (Shankarabharanam, Kalyani).',
  },
  {
    symbol: 'R₃ / G₂',
    name: 'Sadharana Gandharam / Shatshruti Rishabham',
    nameMl: 'സാധാരണ ഗാന്ധാരം',
    ratio: 6 / 5,
    fraction: '6/5',
    expectedCents: 316,
    westernRelative: 'Minor 3rd (Eb)',
    description: 'Minor third interval (Kharaharapriya, Thodi).',
  },
  {
    symbol: 'G₃',
    name: 'Antara Gandharam',
    nameMl: 'അന്തര ഗാന്ധാരം',
    ratio: 5 / 4,
    fraction: '5/4',
    expectedCents: 386,
    westernRelative: 'Major 3rd (E)',
    description: 'Pure 5-limit natural major third (Shankarabharanam, Mohanam).',
  },
  {
    symbol: 'M₁',
    name: 'Shuddha Madhyamam',
    nameMl: 'ശുദ്ധ മധ്യമം',
    ratio: 4 / 3,
    fraction: '4/3',
    expectedCents: 498,
    westernRelative: 'Perfect 4th (F)',
    description: 'Natural fourth interval (Mayamalavagowla, Shankarabharanam).',
  },
  {
    symbol: 'M₂',
    name: 'Prati Madhyamam',
    nameMl: 'പ്രതി മധ്യമം',
    ratio: 45 / 32,
    fraction: '45/32',
    expectedCents: 590,
    westernRelative: 'Augmented 4th (F#)',
    description: 'Sharp fourth interval (Kalyani, Pantuvarali).',
  },
  {
    symbol: 'P',
    name: 'Panchamam',
    nameMl: 'പഞ്ചമം',
    ratio: 3 / 2,
    fraction: '3/2',
    expectedCents: 702,
    westernRelative: 'Perfect 5th (G)',
    description: 'Prakriti swara — invariant perfect fifth.',
  },
  {
    symbol: 'D₁',
    name: 'Shuddha Dhaivatam',
    nameMl: 'ശുദ്ധ ധൈവതം',
    ratio: 8 / 5,
    fraction: '8/5',
    expectedCents: 814,
    westernRelative: 'Minor 6th (Ab)',
    description: 'Minor sixth interval (Mayamalavagowla, Saveri).',
  },
  {
    symbol: 'D₂ / N₁',
    name: 'Chatushruti Dhaivatam / Shuddha Nishadam',
    nameMl: 'ചതുശ്രുതി ധൈവതം',
    ratio: 27 / 16,
    fraction: '27/16',
    expectedCents: 906,
    westernRelative: 'Major 6th (A)',
    description: 'Major sixth interval (Shankarabharanam, Mohanam).',
  },
  {
    symbol: 'D₃ / N₂',
    name: 'Kaisiki Nishadam / Shatshruti Dhaivatam',
    nameMl: 'കൈശികീ നിഷാദം',
    ratio: 9 / 5,
    fraction: '9/5',
    expectedCents: 1018,
    westernRelative: 'Minor 7th (Bb)',
    description: 'Minor seventh interval (Kharaharapriya, Harikambhoji).',
  },
  {
    symbol: 'N₃',
    name: 'Kakali Nishadam',
    nameMl: 'കാകളി നിഷാദം',
    ratio: 15 / 8,
    fraction: '15/8',
    expectedCents: 1088,
    westernRelative: 'Major 7th (B)',
    description: 'Leading-tone major seventh (Shankarabharanam, Kalyani).',
  },
  {
    symbol: 'Ṡ',
    name: 'Tara Shadjam',
    nameMl: 'താരാ ഷഡ്ജം',
    ratio: 2.0,
    fraction: '2/1',
    expectedCents: 1200,
    westernRelative: 'Octave (C5)',
    description: 'Pure octave completion.',
  },
];

/**
 * Returns Just Intonation ratio for a given swara symbol or fallback to 1.0 (Sa).
 */
export function getSwaraRatio(symbol: string): number {
  if (!symbol) return 1.0;
  const clean = symbol.trim();
  return STANDARD_SWARA_RATIOS[clean] ?? 1.0;
}

/**
 * Calculates absolute Hz frequency for a given swara relative to active tonic.
 */
export function getSwaraFrequency(symbol: string, tonicHz: number): number {
  return tonicHz * getSwaraRatio(symbol);
}
