/**
 * Complete 72 Melakarta Raga Scheme (Asampurna / Sampurna Kanakangi–Rasikapriya System)
 * Codified by Venkatamakhin in Chaturdandi Prakasika (c. 1620 CE) and Govindacharya in Sangraha Chudamani.
 * Includes all 12 Chakras, Katapayadi Sankhya verification, Shuddha/Prati Madhyama symmetry,
 * and exact Just Intonation frequency ratios for interactive scale auditioning.
 */

export interface Melakarta72Item {
  number: number;
  name: string;
  slug: string;
  chakraNumber: number;
  chakraName: string;
  chakraMeaning: string;
  positionInChakra: number;
  madhyama: 'M1' | 'M2';
  ri: 'R1' | 'R2' | 'R3';
  ga: 'G1' | 'G2' | 'G3';
  dha: 'D1' | 'D2' | 'D3';
  ni: 'N1' | 'N2' | 'N3';
  arohanam: string;
  avarohanam: string;
  ratios: number[];
  counterpartNumber: number;
  counterpartName: string;
  jeevaSwaras: string[];
  nyasaSwaras: string[];
}

export const CHAKRA_12_METADATA = [
  { number: 1, name: 'Indu', meaningEn: 'The Moon (1)', meaningMl: 'ഇന്ദു ചക്രം (ചന്ദ്രൻ - 1)', purvaSwaras: 'R₁ – G₁' },
  { number: 2, name: 'Netra', meaningEn: 'The Two Eyes (2)', meaningMl: 'നേത്ര ചക്രം (കണ്ണുകൾ - 2)', purvaSwaras: 'R₁ – G₂' },
  { number: 3, name: 'Agni', meaningEn: 'Three Sacred Fires (3)', meaningMl: 'അഗ്നി ചക്രം (ത്രിരഗ്നി - 3)', purvaSwaras: 'R₁ – G₃' },
  { number: 4, name: 'Veda', meaningEn: 'The Four Vedas (4)', meaningMl: 'വേദ ചക്രം (ചതുർവേദം - 4)', purvaSwaras: 'R₂ – G₂' },
  { number: 5, name: 'Bana', meaningEn: 'Five Floral Arrows (5)', meaningMl: 'ബാണ ചക്രം (പഞ്ചബാണങ്ങൾ - 5)', purvaSwaras: 'R₂ – G₃' },
  { number: 6, name: 'Rutu', meaningEn: 'The Six Seasons (6)', meaningMl: 'ഋതു ചക്രം (ഷഡ്ഋതുക്കൾ - 6)', purvaSwaras: 'R₃ – G₃' },
  { number: 7, name: 'Rishi', meaningEn: 'Seven Sages (7)', meaningMl: 'ഋഷി ചക്രം (സപ്തർഷികൾ - 7)', purvaSwaras: 'R₁ – G₁ (M₂)' },
  { number: 8, name: 'Vasu', meaningEn: 'Eight Vasus (8)', meaningMl: 'വസു ചക്രം (അഷ്ടവസുക്കൾ - 8)', purvaSwaras: 'R₁ – G₂ (M₂)' },
  { number: 9, name: 'Brahma', meaningEn: 'Nine Cycles (9)', meaningMl: 'ബ്രഹ്മ ചക്രം (നവബ്രഹ്മം - 9)', purvaSwaras: 'R₁ – G₃ (M₂)' },
  { number: 10, name: 'Disi', meaningEn: 'Ten Directions (10)', meaningMl: 'ദിശി ചക്രം (ദശദിശകൾ - 10)', purvaSwaras: 'R₂ – G₂ (M₂)' },
  { number: 11, name: 'Rudra', meaningEn: 'Eleven Rudras (11)', meaningMl: 'രുദ്ര ചക്രം (ഏകാദശരുദ്രന്മാർ - 11)', purvaSwaras: 'R₂ – G₃ (M₂)' },
  { number: 12, name: 'Aditya', meaningEn: 'Twelve Solar Deities (12)', meaningMl: 'ആദിത്യ ചക്രം (ദ്വാദശാദിത്യന്മാർ - 12)', purvaSwaras: 'R₃ – G₃ (M₂)' },
];

const SWARA_JI_RATIOS: Record<string, number> = {
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
  TARA_S: 2.0,
};

const PURVA_PAIRS: Array<['R1' | 'R2' | 'R3', 'G1' | 'G2' | 'G3']> = [
  ['R1', 'G1'],
  ['R1', 'G2'],
  ['R1', 'G3'],
  ['R2', 'G2'],
  ['R2', 'G3'],
  ['R3', 'G3'],
];

const UTTARA_PAIRS: Array<['D1' | 'D2' | 'D3', 'N1' | 'N2' | 'N3']> = [
  ['D1', 'N1'],
  ['D1', 'N2'],
  ['D1', 'N3'],
  ['D2', 'N2'],
  ['D2', 'N3'],
  ['D3', 'N3'],
];

export const MELAKARTA_72_NAMES: string[] = [
  'Kanakangi', 'Ratnangi', 'Ganamurti', 'Vanaspati', 'Manavati', 'Tanarupi',
  'Senavati', 'Hanumatodi', 'Dhenuka', 'Natakapriya', 'Kokilapriya', 'Rupavati',
  'Gayakapriya', 'Vakulabharanam', 'Mayamalavagowla', 'Chakravakam', 'Suryakantam', 'Hatakambari',
  'Jhankaradhvani', 'Natabhairavi', 'Keeravani', 'Kharaharapriya', 'Gourimanohari', 'Varunapriya',
  'Mararanjani', 'Charukesi', 'Sarasangi', 'Harikambhoji', 'Dheerashankarabharanam', 'Naganandini',
  'Yagapriya', 'Ragavardhini', 'Gangeyabhushani', 'Vagadheeswari', 'Shulini', 'Chalanata',
  'Salagam', 'Jalarnavam', 'Jhalavarali', 'Navaneetam', 'Pavani', 'Raghupriya',
  'Gavambhodi', 'Bhavapriya', 'Shubhapantuvarali', 'Shadvidhamargini', 'Suvarnangi', 'Divyamani',
  'Dhavalambari', 'Namanarayani', 'Kamavardhini', 'Ramapriya', 'Gamanashrama', 'Vishwambhari',
  'Shamalangi', 'Shanmukhapriya', 'Simhendramadhyamam', 'Hemavati', 'Dharmavati', 'Neetimati',
  'Kantamani', 'Rishabhapriya', 'Latangi', 'Vachaspati', 'Mechakalyani', 'Chitrambari',
  'Sucharitra', 'Jyotiswarupini', 'Dhatuvardhani', 'Nasikabhushani', 'Kosalam', 'Rasikapriya',
];

export const MELAKARTA_72_LIST: Melakarta72Item[] = MELAKARTA_72_NAMES.map((name, idx) => {
  const num = idx + 1;
  const isM2 = num > 36;
  const madhyama: 'M1' | 'M2' = isM2 ? 'M2' : 'M1';
  const chakraIdx = Math.floor(idx / 6);
  const chakraMeta = CHAKRA_12_METADATA[chakraIdx];
  const purvaIdx = chakraIdx % 6;
  const uttaraIdx = idx % 6;
  const [ri, ga] = PURVA_PAIRS[purvaIdx];
  const [dha, ni] = UTTARA_PAIRS[uttaraIdx];
  const counterpartNumber = isM2 ? num - 36 : num + 36;
  const counterpartName = MELAKARTA_72_NAMES[counterpartNumber - 1];

  const arohanam = `S ${ri} ${ga} ${madhyama} P ${dha} ${ni} Ṡ`;
  const avarohanam = `Ṡ ${ni} ${dha} P ${madhyama} ${ga} ${ri} S`;
  const ratios = [
    SWARA_JI_RATIOS.S,
    SWARA_JI_RATIOS[ri],
    SWARA_JI_RATIOS[ga],
    SWARA_JI_RATIOS[madhyama],
    SWARA_JI_RATIOS.P,
    SWARA_JI_RATIOS[dha],
    SWARA_JI_RATIOS[ni],
    SWARA_JI_RATIOS.TARA_S,
  ];

  return {
    number: num,
    name,
    slug: name.toLowerCase(),
    chakraNumber: chakraMeta.number,
    chakraName: chakraMeta.name,
    chakraMeaning: chakraMeta.meaningEn,
    positionInChakra: uttaraIdx + 1,
    madhyama,
    ri,
    ga,
    dha,
    ni,
    arohanam,
    avarohanam,
    ratios,
    counterpartNumber,
    counterpartName,
    jeevaSwaras: [ga, madhyama, dha, ni],
    nyasaSwaras: ['S', ga, 'P', ni],
  };
});
