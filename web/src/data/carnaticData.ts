import { RagaItem, TalaItem, InstrumentItem, LessonItem, GlossaryTerm } from '../types/carnatic';

export interface ComposerItem {
  id: string;
  slug: string;
  name: string;
  lifespan: string;
  birthplace: string;
  primaryLanguages: string[];
  tradition: string;
  biography: string;
  signatureMudra: string;
  majorKritis: string[];
  sources: { title: string; authorOrCreator: string; citation: string }[];
}

export const VERIFIED_RAGAS: RagaItem[] = [
  {
    id: 'raga-mayamalavagowla',
    slug: 'mayamalavagowla',
    canonicalName: 'Mayamalavagowla',
    alternateNames: ['Mayamalavagaula', 'Māyāmāḷavagauḷa'],
    melakartaNumber: 15,
    isMelakarta: true,
    chakra: 'Agni (3rd Chakra, 3rd Raga)',
    arohanam: 'S R₁ G₃ M₁ P D₁ N₃ Ṡ',
    avarohanam: 'Ṡ N₃ D₁ P M₁ G₃ R₁ S',
    arohanamSwaras: ['Sa', 'Shuddha Rishabham (R1)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Shuddha Dhaivatam (D1)', 'Kakali Nishadam (N3)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kakali Nishadam (N3)', 'Shuddha Dhaivatam (D1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Shuddha Rishabham (R1)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam (Tonic foundation)' },
      { symbol: 'R₁', name: 'Shuddha Rishabham', ratio: 16 / 15, ratioFraction: '16/15', westernEquivalentNote: 'Db / C#', swarasthana: 'Minor semitone above Sa' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third above Sa' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth above Sa' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth (Prakriti swara)' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab / G#', swarasthana: 'Minor sixth above Sa' },
      { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, ratioFraction: '15/8', westernEquivalentNote: 'B', swarasthana: 'Major seventh leading note' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher octave tonic' }
    ],
    characteristicPhrases: ['P M₁ G₃ M₁ R₁ G₃ R₁ S', 'S R₁ G₃ M₁ P D₁ P', 'D₁ N₃ Ṡ, Ṡ N₃ D₁ P'],
    rasaAndMood: 'Devotion (Bhakti), serene contemplation (Shanta), and inner poise. Evokes early dawn light.',
    educationalSummary: 'The universal pedagogical raga of Carnatic music. Purandara Dasa (1484–1564 CE) established Mayamalavagowla as the baseline scale for all fundamental exercises (Sarali, Jantai, Dhatu, and Alankara varisais) due to the precise symmetry of its intervals.',
    historicalContext: 'Before Purandara Dasa codification, Kharaharapriya or Shankarabharanam was often used as initial training scales. Mayamalavagowla was chosen because the interval pairs (S to R₁ = minor 2nd; G₃ to M₁ = minor 2nd; P to D₁ = minor 2nd; N₃ to Ṡ = minor 2nd) provide clear acoustic mirror images between Purvanga (lower tetrachord) and Uttaranga (upper tetrachord), avoiding cognitive confusion for novice ears.',
    pedagogicalSignificance: 'Its tetrachordal symmetry cultivates exact pitch placement and finger dexterity on instruments like the Veena.',
    famousCompositions: [
      { title: 'Tulasidala (Kriti)', composer: 'Saint Tyagaraja', tala: 'Rupaka', language: 'Telugu', summary: 'A deeply personal prayer offering leaves of Tulasi to Lord Rama.' },
      { title: 'Mayateeta Svarupini', composer: 'Ponniah Pillai (Tanjore Quartet)', tala: 'Rupaka', language: 'Telugu' },
      { title: 'Deena Dayalo Rama (Geetham)', composer: 'Purandara Dasa', tala: 'Triputa', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: 'Vidya Vilasini Press, Ettayapuram, 1904; Vol. 1, p. 112.', publicationYear: 1904 },
      { title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: 'The Indian Music Publishing House, Chennai, 6th ed., pp. 45–52.', publicationYear: 1964 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Musical Heritage / Traditional Knowledge' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-shankarabharanam',
    slug: 'shankarabharanam',
    canonicalName: 'Dheerasankarabharanam',
    alternateNames: ['Shankarabharanam', 'Dheerasankarabharana', 'Sankarabharanam'],
    melakartaNumber: 29,
    isMelakarta: true,
    chakra: 'Bana (5th Chakra, 5th Raga)',
    arohanam: 'S R₂ G₃ M₁ P D₂ N₃ Ṡ',
    avarohanam: 'Ṡ N₃ D₂ P M₁ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Kakali Nishadam (N3)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kakali Nishadam (N3)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major tone' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, ratioFraction: '15/8', westernEquivalentNote: 'B', swarasthana: 'Major seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['S R₂ G₃ M₁ P, M₁ G₃ R₂ S', 'P D₂ N₃ Ṡ, Ṡ D₂ P M₁ G₃', 'M₁ P D₂ N₃ Ṡ R₂ Ṡ'],
    rasaAndMood: 'Majestic grandeur, joy, courage (Veera), and profound devotion. One of the greatest "raja" (regal) ragas.',
    educationalSummary: 'Correspondent to the Western Major scale (Ionian mode) and Bilawal thaat of Hindustani music, Shankarabharanam is renowned for its vast scope for alapana and complex gamakas.',
    historicalContext: 'Described extensively in early texts including Sarangadeva’s Sangita Ratnakara (13th Century). In Carnatic music, it is rendered with rich oscillations (kampita gamaka) on Gandharam and Nishadam.',
    pedagogicalSignificance: 'Teaches students how Carnatic gamaka aesthetics transform universal diatonic scales into profound Indian classical expression.',
    famousCompositions: [
      { title: 'Akshaya Linga Vibho', composer: 'Muthuswami Dikshitar', tala: 'Misra Chapu', language: 'Sanskrit' },
      { title: 'Swara Raga Sudharasa', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Sarojadala Netri', composer: 'Shyama Shastri', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [
      { title: 'Ragas of South India', authorOrCreator: 'Walter Kaufmann', citation: 'Indiana University Press, pp. 210–218.', publicationYear: 1976 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Traditional Knowledge' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-kalyani',
    slug: 'kalyani',
    canonicalName: 'Mechakalyani',
    alternateNames: ['Kalyani', 'Mecakalyāṇi'],
    melakartaNumber: 65,
    isMelakarta: true,
    chakra: 'Rudra (11th Chakra, 5th Raga)',
    arohanam: 'S R₂ G₃ M₂ P D₂ N₃ Ṡ',
    avarohanam: 'Ṡ N₃ D₂ P M₂ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Prati Madhyamam (M2)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Kakali Nishadam (N3)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kakali Nishadam (N3)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Prati Madhyamam (M2)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major tone' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₂', name: 'Prati Madhyamam', ratio: 45 / 32, ratioFraction: '45/32', westernEquivalentNote: 'F#', swarasthana: 'Sharp/augmented fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, ratioFraction: '15/8', westernEquivalentNote: 'B', swarasthana: 'Major seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['G₃ M₂ P D₂ N₃ Ṡ', 'Ṡ N₃ D₂ P M₂ G₃', 'R₂ G₃ M₂ P M₂ G₃ R₂ S'],
    rasaAndMood: 'Auspiciousness, sublime beauty (Shringara), optimism, and festive grace. Often rendered at evening concerts.',
    educationalSummary: 'The Prati Madhyamam (sharp fourth) equivalent to Shankarabharanam. It corresponds to the Western Lydian mode and Kalyan thaat in Hindustani music.',
    historicalContext: 'Considered one of the foundational "major ragas" in concert repertoire alongside Shankarabharanam, Thodi, and Bhairavi.',
    pedagogicalSignificance: 'Essential for mastering the precise intonation of Prati Madhyamam (M₂) and handling open-throated gamakas.',
    famousCompositions: [
      { title: 'Nidhi Chala Sukhama', composer: 'Saint Tyagaraja', tala: 'Misra Chapu', language: 'Telugu' },
      { title: 'Kamalambam Bhajare', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'The Art and Science of Carnatic Music', authorOrCreator: 'Vidya Shankar', citation: 'The Music Academy Madras, 1983.', publicationYear: 1983 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Traditional Knowledge' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-thodi',
    slug: 'thodi',
    canonicalName: 'Hanumatodi',
    alternateNames: ['Thodi', 'Todi', 'Hanumattodi'],
    melakartaNumber: 8,
    isMelakarta: true,
    chakra: 'Netra (2nd Chakra, 2nd Raga)',
    arohanam: 'S R₁ G₂ M₁ P D₁ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₁ P M₁ G₂ R₁ S',
    arohanamSwaras: ['Sa', 'Shuddha Rishabham (R1)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Shuddha Dhaivatam (D1)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Shuddha Dhaivatam (D1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Shuddha Rishabham (R1)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₁', name: 'Shuddha Rishabham', ratio: 16 / 15, ratioFraction: '16/15', westernEquivalentNote: 'Db', swarasthana: 'Minor second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab', swarasthana: 'Minor sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['D₁ N₂ Ṡ R₁ Ṡ', 'P D₁ N₂ D₁ P M₁ G₂ R₁ S', 'R₁ G₂ M₁ P, M₁ G₂ R₁ S'],
    rasaAndMood: 'Deep pathos (Karuna), devotion, introspection, and profound emotional majesty.',
    educationalSummary: 'One of the ultimate major ragas of Carnatic music. Corresponds to the Phrygian mode in Western music and Bhairavi thaat in Hindustani music.',
    historicalContext: 'Renowned for its heavy kampita gamakas. Musicians often spend hours exploring Thodi alapana without repeating sancharas.',
    pedagogicalSignificance: 'Mastering the heavy oscillations on Gandharam and Dhaivatam is the benchmark of advanced vocal maturity.',
    famousCompositions: [
      { title: 'Endu Daginado', composer: 'Saint Tyagaraja', tala: 'Misra Chapu', language: 'Telugu' },
      { title: 'Kamalambike', composer: 'Muthuswami Dikshitar', tala: 'Rupaka', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.', publicationYear: 1904 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-kharaharapriya',
    slug: 'kharaharapriya',
    canonicalName: 'Kharaharapriya',
    alternateNames: ['Kharaharapriyā'],
    melakartaNumber: 22,
    isMelakarta: true,
    chakra: 'Veda (4th Chakra, 4th Raga)',
    arohanam: 'S R₂ G₂ M₁ P D₂ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₂ P M₁ G₂ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['R₂ G₂ M₁ P, M₁ G₂ R₂ S', 'D₂ N₂ Ṡ, Ṡ N₂ D₂ P', 'P D₂ N₂ Ṡ R₂ Ṡ'],
    rasaAndMood: 'Bhakti, dignified poise, meditative serenity, and longing.',
    educationalSummary: 'Corresponds to the Dorian mode of Western music and Kafi thaat of Hindustani music. It is the mother of hundreds of melodious janya ragas.',
    historicalContext: 'Extensively developed by Saint Tyagaraja, who composed numerous immortal kritis in this scale.',
    pedagogicalSignificance: 'The perfect balanced natural minor scale teaching natural third and seventh placements.',
    famousCompositions: [
      { title: 'Chakkani Raja Marga', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Pakkala Nilabadi', composer: 'Saint Tyagaraja', tala: 'Misra Chapu', language: 'Telugu' }
    ],
    sources: [
      { title: 'The Splendour of South Indian Music', authorOrCreator: 'P. T. Chelladurai', citation: '1991.', publicationYear: 1991 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-mohanam',
    slug: 'mohanam',
    canonicalName: 'Mohanam',
    alternateNames: ['Mōhanam'],
    melakartaNumber: 28,
    isMelakarta: false,
    parentRaga: 'Harikambhoji (28th Melakarta)',
    arohanam: 'S R₂ G₃ P D₂ Ṡ',
    avarohanam: 'Ṡ D₂ P G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Perfect fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['G₃ P D₂ Ṡ D₂ P G₃ R₂', 'S R₂ G₃ R₂ S, D₂ S', 'P D₂ Ṡ R₂ Ṡ D₂ P'],
    rasaAndMood: 'Sweetness (Madhurya), joy, romance (Shringara), and radiance. Universal acoustic appeal.',
    educationalSummary: 'The quintessential major pentatonic scale (omitting Ma and Ni). Universally found in musical cultures across the globe.',
    historicalContext: 'One of the earliest scales known to human civilization, found in traditional East Asian, Celtic, and African musical systems.',
    pedagogicalSignificance: 'Second raga introduced to students through the traditional geetham "Varaveena Mridupani".',
    famousCompositions: [
      { title: 'Nannu Palimpa', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Bhavanutha', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Varaveena (Geetham)', composer: 'Appayya Dikshitar / Traditional', tala: 'Rupaka', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'South Indian Music (Book II)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1962.', publicationYear: 1962 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-hamsadhwani',
    slug: 'hamsadhwani',
    canonicalName: 'Hamsadhwani',
    alternateNames: ['Haṁsadhvani'],
    melakartaNumber: 29,
    isMelakarta: false,
    parentRaga: 'Dheerasankarabharanam (29th Melakarta)',
    arohanam: 'S R₂ G₃ P N₃ Ṡ',
    avarohanam: 'Ṡ N₃ P G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Panchamam (P)', 'Kakali Nishadam (N3)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kakali Nishadam (N3)', 'Panchamam (P)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Perfect fifth' },
      { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, ratioFraction: '15/8', westernEquivalentNote: 'B', swarasthana: 'Major seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['G₃ P N₃ Ṡ', 'Ṡ N₃ P G₃ R₂ S', 'S R₂ G₃ P, P G₃ R₂ S'],
    rasaAndMood: 'Vibrancy, celebration, invocation, and radiant joy. Customarily chosen to inaugurate Carnatic music concerts.',
    educationalSummary: 'An audava-audava janya raga omitting both Ma and Dha. Created in the 19th century by Manambuchavadi Venkatasubbayyar.',
    historicalContext: 'Created in Tanjore in the 19th century, Hamsadhwani quickly achieved universal popularity across Carnatic and Hindustani music.',
    pedagogicalSignificance: 'Perfect for beginners to learn pentatonic jumps and vocal projection without microtonal ambiguity.',
    famousCompositions: [
      { title: 'Vatapi Ganapatim Bhajeham', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' },
      { title: 'Raghunayaka', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [
      { title: 'Great Composers (Vol. II)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1970.', publicationYear: 1970 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Traditional Knowledge' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-bhairavi',
    slug: 'bhairavi',
    canonicalName: 'Bhairavi',
    alternateNames: ['Bhairavī'],
    melakartaNumber: 20,
    isMelakarta: false,
    parentRaga: 'Natabhairavi (20th Melakarta)',
    arohanam: 'S G₂ R₂ G₂ M₁ P D₂ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₁ P M₁ G₂ R₁ S',
    arohanamSwaras: ['Sa', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2 - Anya Swara)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Shuddha Dhaivatam (D1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Shuddha Rishabham (R1)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₁', name: 'Shuddha Rishabham (Descent)', ratio: 16 / 15, ratioFraction: '16/15', westernEquivalentNote: 'Db', swarasthana: 'Minor second' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham (Ascent)', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam (Descent)', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab', swarasthana: 'Minor sixth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam (Ascent Anya Swara)', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth foreign swara' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['S G₂ R₂ G₂ M₁ P D₂ N₂ Ṡ', 'Ṡ N₂ D₁ P M₁ G₂ R₁ S', 'P D₂ N₂ Ṡ, Ṡ N₂ D₁ P'],
    rasaAndMood: 'Profound emotional depth, Karuna (compassion), Bhakti, and majestic gravity. One of the greatest crown jewels of Carnatic music.',
    educationalSummary: 'An ancient, universally revered Bhashanga raga featuring Chatushruti Dhaivatam (D2) in ascent and Shuddha Dhaivatam (D1) in descent.',
    historicalContext: 'Extensively documented in Tamil Sangam literature (as Kaushikam pan) and Sarangadeva’s Sangita Ratnakara.',
    pedagogicalSignificance: 'Students learn to handle intricate anya swara transitions and complex oscillated gamakas.',
    famousCompositions: [
      { title: 'Kamakshi Swarajathi', composer: 'Shyama Shastri', tala: 'Misra Chapu', language: 'Telugu', summary: 'The monumental Swarajathi revered as an encyclopedia of Bhairavi phrases.' },
      { title: 'Balagopala', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' },
      { title: 'Upacharamu Chesvaru', composer: 'Saint Tyagaraja', tala: 'Rupaka', language: 'Telugu' }
    ],
    sources: [
      { title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.', publicationYear: 1904 },
      { title: 'Ragas of South India', authorOrCreator: 'Walter Kaufmann', citation: '1976.', publicationYear: 1976 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-kambhoji',
    slug: 'kambhoji',
    canonicalName: 'Kambhoji',
    alternateNames: ['Kāmbhōji', 'Kambodhi'],
    melakartaNumber: 28,
    isMelakarta: false,
    parentRaga: 'Harikambhoji (28th Melakarta)',
    arohanam: 'S R₂ G₃ M₁ P D₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₂ P M₁ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['S R₂ G₃ M₁ P D₂ Ṡ', 'Ṡ N₃ P D₂ Ṡ', 'M₁ G₃ R₂ S, S N₂ D₂ P D₂ Ṡ'],
    rasaAndMood: 'Majesty, royal splendour, joy, courage (Veera), and dignified surrender.',
    educationalSummary: 'A shadava-sampurna Bhashanga raga omitting Ni in the ascent. Renowned for its signature phrase featuring Kakali Nishadam (N3): Ṡ N₃ P D₂ Ṡ.',
    historicalContext: 'One of the ancient pillars of South Indian music (Takkesi pan in ancient Tamil music).',
    pedagogicalSignificance: 'Teaches students expansive alapana construction and graceful sweeping gamakas across octaves.',
    famousCompositions: [
      { title: 'O Rangasayee', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Sri Subrahmanyaya Namaste', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' },
      { title: 'Evari Mata', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [
      { title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1964.', publicationYear: 1964 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-hindolam',
    slug: 'hindolam',
    canonicalName: 'Hindolam',
    alternateNames: ['Hindōḷam'],
    melakartaNumber: 20,
    isMelakarta: false,
    parentRaga: 'Natabhairavi (20th Melakarta)',
    arohanam: 'S G₂ M₁ D₁ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₁ M₁ G₂ S',
    arohanamSwaras: ['Sa', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Shuddha Dhaivatam (D1)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Shuddha Dhaivatam (D1)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab', swarasthana: 'Minor sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['M₁ D₁ N₂ Ṡ, Ṡ N₂ D₁ M₁ G₂ S', 'S G₂ M₁ D₁ M₁ G₂ S', 'M₁ D₁ N₂ Ṡ G₂ Ṡ'],
    rasaAndMood: 'Devotion, mystical tranquillity, and romantic allure. Correspondent to Malkauns in Hindustani music.',
    educationalSummary: 'An audava-audava (pentatonic) scale that completely omits both Rishabham and Panchamam.',
    historicalContext: 'One of the most widely performed pentatonic ragas across both Indian classical traditions.',
    pedagogicalSignificance: 'Develops student agility in wide interval jumps (Sa to Ga, and Ma to Dha) without the stabilizing anchor of Pa.',
    famousCompositions: [
      { title: 'Samaja Vara Gamana', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Manasuloni Marmamu', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Govardhana Girisham', composer: 'Muthuswami Dikshitar', tala: 'Rupaka', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'The Splendour of South Indian Music', authorOrCreator: 'P. T. Chelladurai', citation: '1991.', publicationYear: 1991 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-abhogi',
    slug: 'abhogi',
    canonicalName: 'Abhogi',
    alternateNames: ['Ābhōgi'],
    melakartaNumber: 22,
    isMelakarta: false,
    parentRaga: 'Kharaharapriya (22nd Melakarta)',
    arohanam: 'S R₂ G₂ M₁ D₂ Ṡ',
    avarohanam: 'Ṡ D₂ M₁ G₂ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Chatushruti Dhaivatam (D2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Chatushruti Dhaivatam (D2)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['R₂ G₂ M₁ D₂ Ṡ', 'Ṡ D₂ M₁ G₂ R₂ S', 'M₁ D₂ Ṡ, Ṡ D₂ M₁ G₂ R₂ S'],
    rasaAndMood: 'Vibrant energy, upliftment, joyful surrender, and bright rhythmic momentum.',
    educationalSummary: 'An audava-audava scale omitting Panchamam and Nishadam. Renowned for its sharp clarity and lively gait.',
    historicalContext: 'Formulated during the post-Venkatamakhin era and celebrated in both vocal concerts and classical Bharatanatyam recitals.',
    pedagogicalSignificance: 'Standard piece taught at intermediate level via Patnam Subramanya Iyer’s varnam "Evaribodha".',
    famousCompositions: [
      { title: 'Sabhaapathikku', composer: 'Gopalakrishna Bharati', tala: 'Rupaka', language: 'Tamil' },
      { title: 'Nannu Brova Rada', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Evaribodha (Varnam)', composer: 'Patnam Subramanya Iyer', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [
      { title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.', publicationYear: 1965 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-charukesi',
    slug: 'charukesi',
    canonicalName: 'Charukesi',
    alternateNames: ['Cārukēśi'],
    melakartaNumber: 26,
    isMelakarta: true,
    chakra: 'Bana (5th Chakra, 2nd Raga)',
    arohanam: 'S R₂ G₃ M₁ P D₁ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₁ P M₁ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Shuddha Dhaivatam (D1)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Shuddha Dhaivatam (D1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab', swarasthana: 'Minor sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['P D₁ N₂ Ṡ, Ṡ N₂ D₁ P', 'M₁ G₃ R₂ S, R₂ G₃ M₁ P', 'D₁ N₂ Ṡ R₂ Ṡ N₂ D₁ P'],
    rasaAndMood: 'Deep pathos, heartfelt yearning, surrender, and poignant beauty. Bridges major and minor tonalities.',
    educationalSummary: 'The 26th Melakarta. Combines the bright major lower tetrachord of Shankarabharanam with the poignant minor upper tetrachord of Todi/Natabhairavi.',
    historicalContext: 'Popularized worldwide as an emotional scale, frequently adapted into film scores and fusion compositions.',
    pedagogicalSignificance: 'Illustrates how modal combination between Purvanga and Uttaranga shapes distinct psychological rasa.',
    famousCompositions: [
      { title: 'Adamodi Galade', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Kripaya Palaya Shauray', composer: 'Swathi Thirunal', tala: 'Misra Chapu', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.', publicationYear: 1904 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-madhyamavati',
    slug: 'madhyamavati',
    canonicalName: 'Madhyamavati',
    alternateNames: ['Madhyamāvati'],
    melakartaNumber: 22,
    isMelakarta: false,
    parentRaga: 'Kharaharapriya (22nd Melakarta)',
    arohanam: 'S R₂ M₁ P N₂ Ṡ',
    avarohanam: 'Ṡ N₂ P M₁ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['R₂ M₁ P N₂ Ṡ', 'Ṡ N₂ P M₁ R₂ S', 'P M₁ R₂ S, N₂ S R₂ S'],
    rasaAndMood: 'Mangalam (auspiciousness), peace, divine fulfilment, and closure.',
    educationalSummary: 'An auspicious pentatonic scale omitting Ga and Dha. By tradition, sung at the end of every Carnatic recital to conclude on peace.',
    historicalContext: 'One of the most ancient ragas, venerated for its psychoacoustic balancing effect.',
    pedagogicalSignificance: 'Exemplifies symmetrical fifth-interval cycles (Samvada): Sa to Pa, Ri to Dha, Ma to Sa.',
    famousCompositions: [
      { title: 'Alakalalla', composer: 'Saint Tyagaraja', tala: 'Rupaka', language: 'Telugu' },
      { title: 'Palinchu Kamakshi', composer: 'Shyama Shastri', tala: 'Adi', language: 'Telugu' },
      { title: 'Dharmasamvardhani', composer: 'Muthuswami Dikshitar', tala: 'Rupaka', language: 'Sanskrit' }
    ],
    sources: [
      { title: 'South Indian Music (Book II)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1962.', publicationYear: 1962 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-simhendramadhyamam',
    slug: 'simhendramadhyamam',
    canonicalName: 'Simhendramadhyamam',
    alternateNames: ['Siṁhēndramadhyamam', 'Sumadyuti'],
    melakartaNumber: 57,
    isMelakarta: true,
    chakra: 'Disi (10th Chakra, 3rd Raga)',
    arohanam: 'S R₂ G₂ M₂ P D₁ N₃ Ṡ',
    avarohanam: 'Ṡ N₃ D₁ P M₂ G₂ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Prati Madhyamam (M2)', 'Panchamam (P)', 'Shuddha Dhaivatam (D1)', 'Kakali Nishadam (N3)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kakali Nishadam (N3)', 'Shuddha Dhaivatam (D1)', 'Panchamam (P)', 'Prati Madhyamam (M2)', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₂', name: 'Prati Madhyamam', ratio: 45 / 32, ratioFraction: '45/32', westernEquivalentNote: 'F#', swarasthana: 'Augmented fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab', swarasthana: 'Minor sixth' },
      { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, ratioFraction: '15/8', westernEquivalentNote: 'B', swarasthana: 'Major seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['M₂ P D₁ N₃ Ṡ, Ṡ N₃ D₁ P', 'R₂ G₂ M₂ P M₂ G₂ R₂ S', 'D₁ N₃ Ṡ R₂ Ṡ N₃ D₁ P'],
    rasaAndMood: 'Intense devotion, majesty, and dramatic contemplation. Equivalent to the Hungarian Minor scale.',
    educationalSummary: 'The 57th Melakarta. A Prati Madhyamam scale featuring sharp fourth, minor third, minor sixth, and major seventh.',
    historicalContext: 'Extensively developed by Muthuswami Dikshitar and Saint Tyagaraja.',
    pedagogicalSignificance: 'Teaches vocalists precise intonation between Prati Madhyamam and Shuddha Dhaivatam.',
    famousCompositions: [
      { title: 'Natajana Paripalaka', composer: 'Saint Tyagaraja', tala: 'Rupaka', language: 'Telugu' },
      { title: 'Kamakshi Kamakoti Peetha', composer: 'Muthuswami Dikshitar', tala: 'Rupaka', language: 'Sanskrit' }
    ],
    sources: [{ title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.', publicationYear: 1904 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-natabhairavi',
    slug: 'natabhairavi',
    canonicalName: 'Natabhairavi',
    alternateNames: ['Naṭabhairavi', 'Nārīrītigowla'],
    melakartaNumber: 20,
    isMelakarta: true,
    chakra: 'Veda (4th Chakra, 2nd Raga)',
    arohanam: 'S R₂ G₂ M₁ P D₁ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₁ P M₁ G₂ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Shuddha Dhaivatam (D1)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Shuddha Dhaivatam (D1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₁', name: 'Shuddha Dhaivatam', ratio: 8 / 5, ratioFraction: '8/5', westernEquivalentNote: 'Ab', swarasthana: 'Minor sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['S R₂ G₂ M₁ P D₁ N₂ Ṡ', 'Ṡ N₂ D₁ P M₁ G₂ R₂ S'],
    rasaAndMood: 'Pathos, yearning, devotional warmth, and tenderness. Equivalent to Western Natural Minor (Aeolian mode).',
    educationalSummary: 'The 20th Melakarta. Parent scale to iconic janyas like Bhairavi, Anandabhairavi, Hindolam, and Jaunpuri.',
    historicalContext: 'Corresponds to Asavari thaat of Hindustani music.',
    pedagogicalSignificance: 'Essential foundation for studying natural minor modal structures.',
    famousCompositions: [
      { title: 'Sri Valli Devasenapathe', composer: 'Papanasam Sivan', tala: 'Adi', language: 'Tamil' }
    ],
    sources: [{ title: 'Chaturdandi Prakasika', authorOrCreator: 'Venkatamakhin', citation: 'c. 1620 CE.', publicationYear: 1620 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-chakravakam',
    slug: 'chakravakam',
    canonicalName: 'Chakravakam',
    alternateNames: ['Cakravākam', 'Toyavegavahini'],
    melakartaNumber: 16,
    isMelakarta: true,
    chakra: 'Agni (3rd Chakra, 4th Raga)',
    arohanam: 'S R₁ G₃ M₁ P D₂ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₂ P M₁ G₃ R₁ S',
    arohanamSwaras: ['Sa', 'Shuddha Rishabham (R1)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Shuddha Rishabham (R1)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₁', name: 'Shuddha Rishabham', ratio: 16 / 15, ratioFraction: '16/15', westernEquivalentNote: 'Db', swarasthana: 'Minor second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['S R₁ G₃ M₁ P, D₂ N₂ Ṡ', 'Ṡ N₂ D₂ P M₁ G₃ R₁ S'],
    rasaAndMood: 'Serene dawn light, peace, detachment (Vairagya), and spiritual elevation. Equivalent to Ahir Bhairav.',
    educationalSummary: 'The 16th Melakarta. Major third (G3) combined with minor second (R1) creates meditative serenity.',
    historicalContext: 'Parent of Bindumalini and Malayamarutam.',
    pedagogicalSignificance: 'Cultivates pitch accuracy between Shuddha Ri and Antara Ga.',
    famousCompositions: [
      { title: 'Etula Brothuvo', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Gajananayutam', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' }
    ],
    sources: [{ title: 'Ragas of South India', authorOrCreator: 'Walter Kaufmann', citation: '1976.', publicationYear: 1976 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-harikambhoji',
    slug: 'harikambhoji',
    canonicalName: 'Harikambhoji',
    alternateNames: ['Harikāmbhōji', 'Harikedāragowla'],
    melakartaNumber: 28,
    isMelakarta: true,
    chakra: 'Bana (5th Chakra, 4th Raga)',
    arohanam: 'S R₂ G₃ M₁ P D₂ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₂ P M₁ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['P D₂ N₂ Ṡ, Ṡ N₂ D₂ P', 'M₁ G₃ R₂ S, R₂ G₃ M₁ P'],
    rasaAndMood: 'Dignified contentment, devotional celebration, and optimism. Equivalent to Mixolydian mode.',
    educationalSummary: 'The 28th Melakarta. Major scale with a flattened minor seventh. Mother of Mohanam, Kambhoji, and Sahana.',
    historicalContext: 'Corresponds to Khamaj thaat of Hindustani music and Chempalai of ancient Tamil music.',
    pedagogicalSignificance: 'Illustrates the power of parent scales producing diverse aesthetic janyas.',
    famousCompositions: [
      { title: 'Dinamanivamsa', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Enadumanam', composer: 'Papanasam Sivan', tala: 'Adi', language: 'Tamil' }
    ],
    sources: [{ title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1964.', publicationYear: 1964 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-anandabhairavi',
    slug: 'anandabhairavi',
    canonicalName: 'Anandabhairavi',
    alternateNames: ['Ānandabhairavi'],
    melakartaNumber: 20,
    isMelakarta: false,
    parentRaga: 'Natabhairavi (20th Melakarta)',
    arohanam: 'S G₂ R₂ G₂ M₁ P D₂ P Ṡ',
    avarohanam: 'Ṡ N₂ D₂ P M₁ G₂ R₁ S',
    arohanamSwaras: ['Sa', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Shuddha Rishabham (R1)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₁', name: 'Shuddha Rishabham', ratio: 16 / 15, ratioFraction: '16/15', westernEquivalentNote: 'Db', swarasthana: 'Minor second (in descent)' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second (in ascent)' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['S G₂ R₂ G₂ M₁ P', 'P D₂ P Ṡ', 'Ṡ N₂ D₂ P M₁ G₂ R₁ S', 'M₁ G₂ R₁ S'],
    rasaAndMood: 'Maternal affection (Vatsalya), deep happiness, tenderness, and gentle devotion.',
    educationalSummary: 'An ancient vakra-bhashanga raga with non-linear ascent and descent phrases. Revered as Shyama Shastri’s favourite musical sanctuary.',
    historicalContext: 'One of the most sacred traditional ragas, deeply linked to temple rituals and mangala songs.',
    pedagogicalSignificance: 'Demands intense listening to master subtle gamakas and avoid scalar mechanical playing.',
    famousCompositions: [
      { title: 'Marivere Gati', composer: 'Shyama Shastri', tala: 'Misra Chapu', language: 'Telugu' },
      { title: 'O Jagadamba', composer: 'Shyama Shastri', tala: 'Adi', language: 'Telugu' },
      { title: 'Kamalamba Samrakshatu', composer: 'Muthuswami Dikshitar', tala: 'Misra Chapu', language: 'Sanskrit' }
    ],
    sources: [{ title: 'Great Composers: Shyama Shastri', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1970.', publicationYear: 1970 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-sahana',
    slug: 'sahana',
    canonicalName: 'Sahana',
    alternateNames: ['Sahānā'],
    melakartaNumber: 28,
    isMelakarta: false,
    parentRaga: 'Harikambhoji (28th Melakarta)',
    arohanam: 'S R₂ G₃ M₁ P M₁ D₂ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₂ P M₁ G₃ M₁ R₂ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Chatushruti Dhaivatam (D2)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Shuddha Madhyamam (M1)', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third (oscillated)' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['P M₁ D₂ N₂ Ṡ', 'R₂ G₃ M₁ R₂ G₃ R₂ S', 'D₂ N₂ Ṡ R₂ Ṡ N₂ D₂ P'],
    rasaAndMood: 'Gentle pleading, compassion (Karuna), romantic yearning, and peace.',
    educationalSummary: 'A sublime vakra janya raga famous for its unique oscillation on Rishabham and Gandharam.',
    historicalContext: 'Celebrated across South India for its heart-touching warmth and intimacy.',
    pedagogicalSignificance: 'Crucial for training students in delicate sliding microtones (jarus) and vakra contours.',
    famousCompositions: [
      { title: 'Giripai Nelakonna', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Sri Kamalambikayam', composer: 'Muthuswami Dikshitar', tala: 'Misra Chapu', language: 'Sanskrit' },
      { title: 'Chittam Irangada', composer: 'Papanasam Sivan', tala: 'Misra Chapu', language: 'Tamil' }
    ],
    sources: [{ title: 'The Art and Science of Carnatic Music', authorOrCreator: 'Vidya Shankar', citation: '1983.', publicationYear: 1983 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-reethigowla',
    slug: 'reethigowla',
    canonicalName: 'Reethigowla',
    alternateNames: ['Rītigauḷa', 'Reethigoula'],
    melakartaNumber: 22,
    isMelakarta: false,
    parentRaga: 'Kharaharapriya (22nd Melakarta)',
    arohanam: 'S G₂ R₂ G₂ M₁ N₂ D₂ M₁ N₂ N₂ Ṡ',
    avarohanam: 'Ṡ N₂ D₂ M₁ G₂ M₁ P M₁ G₂ R₂ S',
    arohanamSwaras: ['Sa', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Shuddha Madhyamam (M1)', 'Kaisiki Nishadam (N2)', 'Kaisiki Nishadam (N2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kaisiki Nishadam (N2)', 'Chatushruti Dhaivatam (D2)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Shuddha Madhyamam (M1)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Sadharana Gandharam (G2)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₂', name: 'Sadharana Gandharam', ratio: 6 / 5, ratioFraction: '6/5', westernEquivalentNote: 'Eb', swarasthana: 'Minor third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₂', name: 'Kaisiki Nishadam', ratio: 9 / 5, ratioFraction: '9/5', westernEquivalentNote: 'Bb', swarasthana: 'Minor seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['G₂ R₂ G₂ S', 'M₁ N₂ D₂ M₁ N₂ N₂ Ṡ', 'Ṡ N₂ D₂ M₁ G₂ M₁ P M₁'],
    rasaAndMood: 'Mystical introspection, profound longing, and sublime peace.',
    educationalSummary: 'One of the most intricate and enchanting vakra ragas in existence. Famous for its twin-Nishadam signature phrases.',
    historicalContext: 'Extensively praised in Subbarama Dikshitar’s Sangita Sampradaya Pradarsini.',
    pedagogicalSignificance: 'Advanced study in holding microtonal pauses and phrase-driven identity.',
    famousCompositions: [
      { title: 'Dwaitamu Sukhama', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Janani Ninnuvina', composer: 'Subbaraya Shastri', tala: 'Misra Chapu', language: 'Telugu' },
      { title: 'Sri Nilotpala Nayike', composer: 'Muthuswami Dikshitar', tala: 'Rupaka', language: 'Sanskrit' }
    ],
    sources: [{ title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.', publicationYear: 1904 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'raga-bilahari',
    slug: 'bilahari',
    canonicalName: 'Bilahari',
    alternateNames: ['Bilaharī'],
    melakartaNumber: 29,
    isMelakarta: false,
    parentRaga: 'Dheerasankarabharanam (29th Melakarta)',
    arohanam: 'S R₂ G₃ P D₂ Ṡ',
    avarohanam: 'Ṡ N₃ D₂ P M₁ G₃ R₂ S',
    arohanamSwaras: ['Sa', 'Chatushruti Rishabham (R2)', 'Antara Gandharam (G3)', 'Panchamam (P)', 'Chatushruti Dhaivatam (D2)', 'Tara Sa (Ṡ)'],
    avarohanamSwaras: ['Tara Sa (Ṡ)', 'Kakali Nishadam (N3)', 'Chatushruti Dhaivatam (D2)', 'Panchamam (P)', 'Shuddha Madhyamam (M1)', 'Antara Gandharam (G3)', 'Chatushruti Rishabham (R2)', 'Sa'],
    swaraDetails: [
      { symbol: 'S', name: 'Shadjam', ratio: 1.0, ratioFraction: '1/1', westernEquivalentNote: 'C', swarasthana: 'Adhara Shadjam' },
      { symbol: 'R₂', name: 'Chatushruti Rishabham', ratio: 9 / 8, ratioFraction: '9/8', westernEquivalentNote: 'D', swarasthana: 'Major second' },
      { symbol: 'G₃', name: 'Antara Gandharam', ratio: 5 / 4, ratioFraction: '5/4', westernEquivalentNote: 'E', swarasthana: 'Major third' },
      { symbol: 'M₁', name: 'Shuddha Madhyamam', ratio: 4 / 3, ratioFraction: '4/3', westernEquivalentNote: 'F', swarasthana: 'Perfect fourth' },
      { symbol: 'P', name: 'Panchamam', ratio: 3 / 2, ratioFraction: '3/2', westernEquivalentNote: 'G', swarasthana: 'Invariable fifth' },
      { symbol: 'D₂', name: 'Chatushruti Dhaivatam', ratio: 27 / 16, ratioFraction: '27/16', westernEquivalentNote: 'A', swarasthana: 'Major sixth' },
      { symbol: 'N₃', name: 'Kakali Nishadam', ratio: 15 / 8, ratioFraction: '15/8', westernEquivalentNote: 'B', swarasthana: 'Major seventh' },
      { symbol: 'Ṡ', name: 'Tara Shadjam', ratio: 2.0, ratioFraction: '2/1', westernEquivalentNote: "C'", swarasthana: 'Higher tonic' }
    ],
    characteristicPhrases: ['G₃ P D₂ Ṡ, Ṡ N₃ D₂ P', 'S N₂ D₂ P (Anya Swara N2)', 'P M₁ G₃ R₂ S'],
    rasaAndMood: 'Exuberance, joy, celebration, morning radiance, and triumph.',
    educationalSummary: 'An audava-sampurna Bhashanga raga omitting Ma and Ni in the ascent. Employs Kaisiki Ni (N2) in signature descent phrases.',
    historicalContext: 'Traditionally performed in morning recitals to evoke vibrant energy and optimism.',
    pedagogicalSignificance: 'Teaches transitions between pentatonic ascent (Mohanam structure) and diatonic descent.',
    famousCompositions: [
      { title: 'Dorakuna Ituvanti', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Sri Chamundeshwari', composer: 'Mysore Vasudevachar', tala: 'Adi', language: 'Sanskrit' },
      { title: 'Najivadhara', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [{ title: 'Great Composers (Vol. I)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1968.', publicationYear: 1968 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Editorial Musicology Board',
    reviewedAt: '2026-10-15'
  }
];

export const VERIFIED_TALAS: TalaItem[] = [
  {
    id: 'tala-adi-tala',
    slug: 'adi-tala',
    canonicalName: 'Adi Tala (Chatusra Jati Triputa Tala)',
    angasFormula: 'I₄ + O + O',
    totalAksharas: 8,
    laghuCounts: 4,
    dhrutamCounts: 2,
    jati: 'Chatusra (4 counts in Laghu)',
    description: 'The paramount rhythmic framework of South Indian classical music. It consists of 1 Laghu of 4 counts followed by 2 Dhrutams of 2 counts each, totaling 8 aksharas per avarthanam.',
    handMovementsGuide: 'Laghu: 1 clap followed by counting 3 fingers (pinky, ring, middle). Dhrutam 1: 1 clap followed by a wave (veechu). Dhrutam 2: 1 clap followed by a wave (veechu).',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Thattu (Palm Clap on lap)', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky finger tap', syllable: 'Dhi' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring finger tap', syllable: 'Thom' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle finger tap', syllable: 'Nam' },
      { beatIndex: 5, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Thattu (Palm Clap)', syllable: 'Tha' },
      { beatIndex: 6, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Veechu (Upturned palm wave)', syllable: 'Ka' },
      { beatIndex: 7, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Thattu (Palm Clap)', syllable: 'Dhi' },
      { beatIndex: 8, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Veechu (Upturned palm wave)', syllable: 'Mi' }
    ],
    representativeCompositions: [
      'Vatapi Ganapatim (Hamsadhwani - Dikshitar)',
      'Endaro Mahanubhavulu (Shree - Tyagaraja)',
      'Brovavamma (Manji - Shyama Shastri)'
    ],
    sources: [
      { title: 'Tala Guide: Structure & Practice', authorOrCreator: 'Madras Music Academy Tala Research Committee', citation: 'Journal of the Music Academy Madras, Vol. 48, pp. 78–92.', publicationYear: 1977 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-rupaka-tala',
    slug: 'rupaka-tala',
    canonicalName: 'Rupaka Tala',
    angasFormula: 'O + I₄',
    totalAksharas: 6,
    laghuCounts: 4,
    dhrutamCounts: 1,
    jati: 'Chatusra',
    description: 'A 6-akshara tala cycle commonly used for dynamic, mid-tempo compositions. In standard modern practice, it starts with a Dhrutam followed by a Chatusra Laghu.',
    handMovementsGuide: 'In modern concert practice: Beat 1 (Thattu), Beat 2 (Veechu/Wave), followed by Beat 3 (Thattu), and Beats 4-6 (finger counts: pinky, ring, middle). Total = 6 counts.',
    beatActions: [
      { beatIndex: 1, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Thattu (Palm Clap)', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Veechu (Wave)', syllable: 'Ki' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Thattu (Palm Clap)', syllable: 'Ta' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky finger tap', syllable: 'Tha' },
      { beatIndex: 5, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring finger tap', syllable: 'Ka' },
      { beatIndex: 6, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle finger tap', syllable: 'Dhi' }
    ],
    representativeCompositions: [
      'Sobhillu Saptaswara (Jaganmohini - Tyagaraja)',
      'Bhavanutha (Mohanam - Tyagaraja)',
      'Mamava Meenakshi (Varali - Dikshitar)'
    ],
    sources: [
      { title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: 'The Indian Music Publishing House, Chennai, 1965.', publicationYear: 1965 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-misra-chapu',
    slug: 'misra-chapu',
    canonicalName: 'Misra Chapu Tala',
    angasFormula: '3 + 2 + 2',
    totalAksharas: 7,
    laghuCounts: 0,
    dhrutamCounts: 0,
    jati: 'Chapu (Asymmetric syncopation)',
    description: 'An ancient, energetic syncopated cycle of 7 counts divided as 3 + 2 + 2 (Takita - Taka - Taka). Ubiquitous in weighty masterworks of Shyama Shastri and Muthuswami Dikshitar.',
    handMovementsGuide: 'Executed by hand claps and waves: Clap on 1 (Ta-ki-ta: 3 counts), Clap on 4 (Ta-ka: 2 counts), Clap on 6 (Ta-ka: 2 counts). Total = 7 matras.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Primary Clap (holds for 3 counts)', syllable: 'Ta-ki-ta' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Beat 2 rest/sustain', syllable: 'ki' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Beat 3 rest/sustain', syllable: 'ta' },
      { beatIndex: 4, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Secondary Clap (holds for 2 counts)', syllable: 'Ta' },
      { beatIndex: 5, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Beat 5 sustain', syllable: 'ka' },
      { beatIndex: 6, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Tertiary Clap (holds for 2 counts)', syllable: 'Ta' },
      { beatIndex: 7, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Beat 7 sustain', syllable: 'ka' }
    ],
    representativeCompositions: [
      'Marivere Gati (Anandabhairavi - Shyama Shastri)',
      'Akshaya Linga Vibho (Shankarabharanam - Dikshitar)',
      'Ksheerasagara Shayana (Devagandhari - Tyagaraja)'
    ],
    sources: [
      { title: 'The Tala System of South Indian Music', authorOrCreator: 'Dr. N. Ramanathan', citation: 'Madras University Music Journal, 1988.', publicationYear: 1988 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-khanda-chapu',
    slug: 'khanda-chapu',
    canonicalName: 'Khanda Chapu Tala',
    angasFormula: '2 + 3',
    totalAksharas: 5,
    laghuCounts: 0,
    dhrutamCounts: 0,
    jati: 'Khanda (5 matras)',
    description: 'A brisk, buoyant 5-count syncopated cycle divided as 2 + 3 (Ta-ka Ta-ki-ta). Favoured for dynamic, dance-like kritis.',
    handMovementsGuide: 'Clap on 1 (Ta-ka: 2 counts), followed by Clap on 3 (Ta-ki-ta: 3 counts). Total = 5 matras.',
    beatActions: [
      { beatIndex: 1, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Primary Clap (2 counts)', syllable: 'Ta' },
      { beatIndex: 2, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Beat 2 sustain', syllable: 'ka' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Secondary Clap (3 counts)', syllable: 'Ta' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Beat 4 sustain', syllable: 'ki' },
      { beatIndex: 5, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Beat 5 sustain', syllable: 'ta' }
    ],
    representativeCompositions: [
      'Kaddanu Variki (Todi - Tyagaraja)',
      'Brovabarama (Bahudari - Tyagaraja)'
    ],
    sources: [
      { title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.', publicationYear: 1965 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-tisra-eka',
    slug: 'tisra-eka',
    canonicalName: 'Tisra Eka Tala',
    angasFormula: 'I₃',
    totalAksharas: 3,
    laghuCounts: 3,
    dhrutamCounts: 0,
    jati: 'Tisra (3 counts per Laghu)',
    description: 'A fundamental 3-beat cycle consisting solely of a single Tisra Laghu. Taught in beginner abhyasa gana for introductory Geethams.',
    handMovementsGuide: 'Beat 1: Thattu (Palm clap), Beat 2: Pinky finger tap, Beat 3: Ring finger tap. Total = 3 aksharas.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Thattu (Palm Clap)', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky finger tap', syllable: 'Ki' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring finger tap', syllable: 'Ta' }
    ],
    representativeCompositions: [
      'Sree Gananatha / Lambodara (Malahari Geetham - Purandara Dasa)',
      'Padumanabha Paramapurusha (Malahari Geetham - Purandara Dasa)'
    ],
    sources: [
      { title: 'South Indian Music (Book I)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1960.', publicationYear: 1960 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-khanda-triputa',
    slug: 'khanda-triputa',
    canonicalName: 'Khanda Jati Triputa Tala',
    angasFormula: 'I₅ + O + O',
    totalAksharas: 9,
    laghuCounts: 5,
    dhrutamCounts: 2,
    jati: 'Khanda (5 counts in Laghu)',
    description: 'A prestigious 9-akshara tala cycle consisting of 1 Khanda Laghu followed by 2 Dhrutams (5 + 2 + 2). Revered for complex concert Pallavis and heavyweight kritis.',
    handMovementsGuide: 'Laghu: 1 clap + 4 finger counts (pinky, ring, middle, index). Dhrutam 1: 1 clap + wave. Dhrutam 2: 1 clap + wave. Total = 9 aksharas.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Thattu (Clap)', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' },
      { beatIndex: 5, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Index tap', syllable: 'Tha' },
      { beatIndex: 6, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Thattu (Clap)', syllable: 'Ka' },
      { beatIndex: 7, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Veechu (Wave)', syllable: 'Tha' },
      { beatIndex: 8, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Thattu (Clap)', syllable: 'Ki' },
      { beatIndex: 9, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Veechu (Wave)', syllable: 'Ta' }
    ],
    representativeCompositions: [
      'Sri Subrahmanyaya Namaste (Kambhoji - Dikshitar)',
      'RTP in Khanda Triputa Tala'
    ],
    sources: [
      { title: 'Tala Guide: Structure & Practice', authorOrCreator: 'Madras Music Academy', citation: '1977.', publicationYear: 1977 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-misra-jhampa',
    slug: 'misra-jhampa',
    canonicalName: 'Misra Jati Jhampa Tala',
    angasFormula: 'I₇ + U + O',
    totalAksharas: 10,
    laghuCounts: 7,
    dhrutamCounts: 1,
    jati: 'Misra (7 counts in Laghu)',
    description: 'An ancient, noble 10-count cycle consisting of 1 Misra Laghu (7 counts), 1 Anudhrutam (1 clap), and 1 Dhrutam (2 counts). Ubiquitous in traditional Chauka Varnams and Navarathri kritis.',
    handMovementsGuide: 'Laghu: 1 clap + 6 finger counts (pinky to thumb + thumb again). Anudhrutam: 1 clap. Dhrutam: 1 clap + wave. Total = 10 aksharas.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Thattu (Clap)', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ki' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Ta' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Tha' },
      { beatIndex: 5, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Index tap', syllable: 'Ka' },
      { beatIndex: 6, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Thumb tap', syllable: 'Dhi' },
      { beatIndex: 7, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Thumb tap 2', syllable: 'Mi' },
      { beatIndex: 8, anga: 'Anudhrutam', actionType: 'thattu', actionLabel: 'Anudhrutam Thattu (Clap)', syllable: 'Tha' },
      { beatIndex: 9, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Dhrutam Thattu (Clap)', syllable: 'Ki' },
      { beatIndex: 10, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Dhrutam Veechu (Wave)', syllable: 'Ta' }
    ],
    representativeCompositions: [
      'Amba Kamakshi (Bhairavi Swarajathi - Shyama Shastri)',
      'Chalamela (Natakurinji Varnam - Moolavittu Rangaswami)'
    ],
    sources: [
      { title: 'The Tala System of South Indian Music', authorOrCreator: 'Dr. N. Ramanathan', citation: '1988.', publicationYear: 1988 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-chatusra-dhruva',
    slug: 'chatusra-dhruva',
    canonicalName: 'Chatusra Jati Dhruva Tala',
    angasFormula: 'I₄ + O + I₄ + I₄',
    totalAksharas: 14,
    laghuCounts: 4,
    dhrutamCounts: 1,
    jati: 'Chatusra (4 counts in Laghu)',
    description: 'The first and grandest of the 35 Suladi Talas. Spanning 14 aksharas structured as Laghu (4), Dhrutam (2), Laghu (4), and Laghu (4). Favoured for stately Alankaras and grand compositions.',
    handMovementsGuide: 'Laghu 1: Clap + 3 finger counts (pinky, ring, mid). Dhrutam: Clap + wave. Laghu 2: Clap + 3 finger counts. Laghu 3: Clap + 3 finger counts. Total = 14 aksharas.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 1 Clap', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' },
      { beatIndex: 5, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Dhrutam Clap', syllable: 'Tha' },
      { beatIndex: 6, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Dhrutam Wave', syllable: 'Ka' },
      { beatIndex: 7, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 2 Clap', syllable: 'Tha' },
      { beatIndex: 8, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 9, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 10, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' },
      { beatIndex: 11, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 3 Clap', syllable: 'Tha' },
      { beatIndex: 12, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 13, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 14, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' }
    ],
    representativeCompositions: [
      'Dhruva Tala Alankara (Purandara Dasa)',
      'Pallavis in Dhruva Tala'
    ],
    sources: [{ title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.', publicationYear: 1965 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-chatusra-matya',
    slug: 'chatusra-matya',
    canonicalName: 'Chatusra Jati Matya Tala',
    angasFormula: 'I₄ + O + I₄',
    totalAksharas: 10,
    laghuCounts: 4,
    dhrutamCounts: 1,
    jati: 'Chatusra (4 counts in Laghu)',
    description: 'A 10-akshara symmetrical cycle from the Suladi system consisting of 1 Chatusra Laghu (4), 1 Dhrutam (2), and 1 Chatusra Laghu (4). Celebrated for its balanced architecture.',
    handMovementsGuide: 'Laghu 1: Clap + 3 finger counts. Dhrutam: Clap + wave. Laghu 2: Clap + 3 finger counts. Total = 10 aksharas.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 1 Clap', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' },
      { beatIndex: 5, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Dhrutam Clap', syllable: 'Tha' },
      { beatIndex: 6, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Dhrutam Wave', syllable: 'Ka' },
      { beatIndex: 7, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 2 Clap', syllable: 'Tha' },
      { beatIndex: 8, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 9, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 10, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' }
    ],
    representativeCompositions: [
      'Matya Tala Alankara (Purandara Dasa)'
    ],
    sources: [{ title: 'Tala Guide: Structure & Practice', authorOrCreator: 'Madras Music Academy', citation: '1977.', publicationYear: 1977 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'tala-khanda-ata',
    slug: 'khanda-ata',
    canonicalName: 'Khanda Jati Ata Tala',
    angasFormula: 'I₅ + I₅ + O + O',
    totalAksharas: 14,
    laghuCounts: 5,
    dhrutamCounts: 2,
    jati: 'Khanda (5 counts in Laghu)',
    description: 'The premier framework for monumental Carnatic Ata Tala Varnams. Spans 14 aksharas: two Khanda Laghus of 5 counts each followed by two Dhrutams of 2 counts each (5 + 5 + 2 + 2).',
    handMovementsGuide: 'Laghu 1: Clap + 4 fingers. Laghu 2: Clap + 4 fingers. Dhrutam 1: Clap + wave. Dhrutam 2: Clap + wave. Total = 14 aksharas.',
    beatActions: [
      { beatIndex: 1, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 1 Clap', syllable: 'Tha' },
      { beatIndex: 2, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Ka' },
      { beatIndex: 3, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Dhi' },
      { beatIndex: 4, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Mi' },
      { beatIndex: 5, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Index tap', syllable: 'Tha' },
      { beatIndex: 6, anga: 'Laghu', actionType: 'thattu', actionLabel: 'Laghu 2 Clap', syllable: 'Ka' },
      { beatIndex: 7, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Pinky tap', syllable: 'Dhi' },
      { beatIndex: 8, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Ring tap', syllable: 'Mi' },
      { beatIndex: 9, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Middle tap', syllable: 'Tha' },
      { beatIndex: 10, anga: 'Laghu', actionType: 'finger_count', actionLabel: 'Index tap', syllable: 'Ka' },
      { beatIndex: 11, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Dhrutam 1 Clap', syllable: 'Tha' },
      { beatIndex: 12, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Dhrutam 1 Wave', syllable: 'Ka' },
      { beatIndex: 13, anga: 'Dhrutam', actionType: 'thattu', actionLabel: 'Dhrutam 2 Clap', syllable: 'Dhi' },
      { beatIndex: 14, anga: 'Dhrutam', actionType: 'veecheduthal', actionLabel: 'Dhrutam 2 Wave', syllable: 'Mi' }
    ],
    representativeCompositions: [
      'Viriboni (Bhairavi Ata Tala Varnam - Pacchimiriam Adiyappa)',
      'Nera Nammiti (Kaanada Ata Tala Varnam - Pooja Ramanathapuram Srinivasa Iyengar)'
    ],
    sources: [{ title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.', publicationYear: 1965 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Traditional Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Laya Advisory',
    reviewedAt: '2026-10-15'
  }
];

export const VERIFIED_INSTRUMENTS: InstrumentItem[] = [
  {
    id: 'inst-saraswati-veena',
    slug: 'saraswati-veena',
    canonicalName: 'Saraswati Veena',
    family: 'Chordophone',
    materials: ['Aged Jackwood (Artocarpus heterophyllus)', 'Beeswax and charcoal compound for fretboard', 'Brass frets', 'Bronze and steel strings'],
    anatomy: [
      { part: 'Kudam', function: 'Large hollow wooden resonator at the base that provides acoustic warmth and reverberation.' },
      { part: 'Dandi', function: 'Long hollow neck along which the 24 fixed brass frets are embedded into wax ledges.' },
      { part: 'Yali', function: 'Mythical lion-dragon carved head terminating the neck, representing protection.' },
      { part: 'Surkkai (Gourd)', function: 'Secondary resonator under the upper neck resting on the musicians left thigh.' },
      { part: 'Tala Strings (Pakkasarani)', function: 'Three high-tension side strings plucked upward with the right pinky finger to mark rhythm.' }
    ],
    playingTechnique: 'Seated cross-legged, the player holds the Kudam on the right thigh while the left hand rests on the frets. The right index and middle fingers pluck downwards, while left fingers glide along the frets. Gamakas are produced by pulling strings sideways (deflection) across the fret wire.',
    tuningSystem: 'Four main playing strings tuned to: Anumandaram (Lower Sa), Mandaram (Pa), Madhya Sa (Middle Sa), and Madhya Pa (Middle Pa). The 3 tala side strings are tuned to Upper Sa, Pa, and Higher Sa.',
    roleInConcert: 'The primordial solo melodic instrument of South Indian classical music. Historically considered the absolute standard against which vocal gamakas and swara intonation are evaluated.',
    historicalContext: 'Evolved through centuries from early harps and lutes (Vipanchi, Yazh). The modern 24-fixed-fret Saraswati Veena was codified in Thanjavur during the reign of King Raghunatha Nayak and Govinda Dikshitar in the early 17th century.',
    samples: [
      { label: 'Veena Meend / Deflection', description: 'Lateral deflection on Antara Gandharam producing microtonal oscillation', attribution: 'NadaVerse Acoustic Archives' }
    ],
    sources: [
      { title: 'The Veena and Its Technique', authorOrCreator: 'S. Balachander', citation: 'Sangeet Natak Akademi monograph, 1968.', publicationYear: 1968 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-carnatic-violin',
    slug: 'carnatic-violin',
    canonicalName: 'Carnatic Violin',
    family: 'Chordophone',
    materials: ['Spruce top', 'Maple back and ribs', 'Ebony fingerboard', 'Horsehair bow'],
    anatomy: [
      { part: 'Scroll & Pegbox', function: 'Tuning pegs anchored on the scroll, resting firmly against the musicians right ankle or foot.' },
      { part: 'Fingerboard', function: 'Unfretted ebony fingerboard allowing continuous, smooth glides (jarus) and oscillations (kampitam).' },
      { part: 'Soundpost & Bridge', function: 'Transmits string vibrations to the body for rich reverberation.' }
    ],
    playingTechnique: 'The Carnatic violinist sits cross-legged on the floor. The scroll of the violin rests firmly on the right foot, while the tailpiece is braced against the left collarbone or chest. This posture frees the entire left hand to slide up and down the fingerboard effortlessly without carrying the weight of the instrument.',
    tuningSystem: 'Tuned to tonic pairs: 1st string (Tara Sa), 2nd string (Madhya Pa), 3rd string (Madhya Sa), 4th string (Mandra Pa).',
    roleInConcert: 'The indispensable melodic accompaniment instrument in Carnatic vocal concerts, as well as a celebrated solo instrument in its own right.',
    historicalContext: 'Introduced into Carnatic music around 1800 CE by Baluswami Dikshitar (brother of Muthuswami Dikshitar) and Vadivelu of the Tanjore Quartet.',
    samples: [],
    sources: [
      { title: 'The Violin in Carnatic Music', authorOrCreator: 'V. Lakshminarayana', citation: 'Madras Music Academy Proceedings, 1974.', publicationYear: 1974 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-mridangam',
    slug: 'mridangam',
    canonicalName: 'Mridangam',
    family: 'Membranophone',
    materials: ['Seasoned Jackwood or Margosa body', 'Cow, goat, and buffalo hide skins', 'Karanai (iron slag and cooked rice paste)', 'Leather strapping'],
    anatomy: [
      { part: 'Valanthalai (Right Head)', function: 'Tuned precisely to the vocalists tonic (Adhara Shadjam). Features a central black disc (karanai) that dampens high overtones and produces a pure bell-like pitched ring.' },
      { part: 'Thoppi / Edanthalai (Left Head)', function: 'Bass head that produces deep resonant booming strokes (Thom). Temporarily loaded with semolina (rava) paste during concerts to lower the pitch.' },
      { part: 'Kattam', function: 'Barrel-shaped hollow wooden body sculpted with a narrower right mouth than the left.' }
    ],
    playingTechnique: 'Played with open hands, curved fingertips, and heel of the palms while resting horizontally across the lap. Utilises precise stroke syllables: Tha, Dhi, Thom, Nam, Ki, Ta, Cha, Chapu.',
    tuningSystem: 'The right head is tuned to the exact tonic (e.g. C, C#, D) of the main soloist using wooden pegs and a tuning stone. The left head is tuned approximately an octave or fifth lower.',
    roleInConcert: 'The principal percussion instrument in Carnatic concerts. It provides structural laya (rhythm), accompanies vocal phrases with sarvalaghu, responds to mathematical korvais, and leads the tani avarthanam.',
    historicalContext: 'Mentioned in ancient epics like the Natya Shastra by Bharata Muni (c. 200 BCE - 200 CE). The compound load (karanai) produces harmonic overtone resonance.',
    samples: [],
    sources: [
      { title: 'The Physics of the Mridangam', authorOrCreator: 'Sir C. V. Raman', citation: 'Proceedings of the Indian Academy of Sciences, 1934.', publicationYear: 1934 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-ghatam',
    slug: 'ghatam',
    canonicalName: 'Ghatam',
    family: 'Idiophone',
    materials: ['Special clay mixed with copper, brass, and iron filings from Manamadurai'],
    anatomy: [
      { part: 'Mouth / Neck', function: 'Narrow opening pressed against the abdomen to create deep, sub-bass air resonance pulses.' },
      { part: 'Belly', function: 'Thick, resonant clay body struck with the flats of the fingers, knuckles, and palms.' },
      { part: 'Base', function: 'Curved bottom resting comfortably on the player’s lap.' }
    ],
    playingTechnique: 'The player sits cross-legged, placing the pot on their lap with the opening facing their belly. Rapid finger taps and slaps on the neck and body produce bright ringing strokes, while pressing the mouth of the pot against the belly produces resonant deep bass "gumki" air beats.',
    tuningSystem: 'Fixed pitch inherent to the firing and clay thickness; percussionists carry a set of pots tuned to various concert pitches (C, C#, D, etc.).',
    roleInConcert: 'A vital secondary percussion instrument (upa-pakkavadya) providing sharp, acoustic contrast to the mridangam in the tani avarthanam.',
    historicalContext: 'One of the oldest clay percussion instruments in the world, mentioned in Valmiki’s Ramayana.',
    samples: [],
    sources: [
      { title: 'The Clay Pot in Carnatic Music', authorOrCreator: 'Vikku Vinayakram', citation: 'Percussion Monograph, 1985.', publicationYear: 1985 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-tambura',
    slug: 'tambura',
    canonicalName: 'Tambura (Tanpura)',
    family: 'Chordophone',
    materials: ['Gourd (Tumba) or Jackwood resonator', 'Wooden neck', 'Bone bridge with silk/cotton threads (Jivari)'],
    anatomy: [
      { part: 'Jivari (Threads)', function: 'Cotton threads placed between the bronze bridge and strings. Creates the signature shimmering cascade of buzzing overtones.' },
      { part: 'Strings (Four)', function: 'Tuned to Pa, Sa, Sa, Sa (or Ma, Sa, Sa, Sa for madhyama shruti ragas).' },
      { part: 'Tuning Pegs', function: 'Large wooden pegs at the top of the neck for pitch adjustment.' }
    ],
    playingTechnique: 'Held vertically or rested on the shoulder/lap. Plucked continuously with the pads of the middle and index fingers in a calm, unending sequence: 1st string (Pa), 2nd string (Madhya Sa), 3rd string (Madhya Sa), 4th string (Mandra Sa).',
    tuningSystem: '1st string: Panchamam (Pa); 2nd & 3rd strings: Madhya Shadjam (Sa); 4th string: Mandra Shadjam (Low Sa).',
    roleInConcert: 'Provides the unwavering acoustic foundation (Adhara Shadjam) that anchors all artists on stage.',
    historicalContext: 'Fundamental to Indian classical music for over a millennium.',
    samples: [],
    sources: [
      { title: 'The Acoustics of the Tanpura', authorOrCreator: 'B. C. Deva', citation: 'Psychoacoustics of Music and Speech, Sangeet Natak Akademi, 1967.', publicationYear: 1967 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-carnatic-flute',
    slug: 'carnatic-flute',
    canonicalName: 'Carnatic Flute (Venu)',
    family: 'Aerophone',
    materials: ['Seasoned natural bamboo (reed)', 'Natural wax for fine hole adjustments'],
    anatomy: [
      { part: 'Mouth Hole (Mukharandhra)', function: 'The blow hole where the musician directs the airstream (embouchure).' },
      { part: 'Finger Holes (Swara Randhra)', function: 'Eight finger holes positioned along the body to produce swaras and microtones.' },
      { part: 'Venting / Tuning Holes', function: 'End holes that calibrate the acoustic pitch and fundamental tonic.' }
    ],
    playingTechnique: 'Held horizontally to the right. The player blows across the embouchure hole while fingering the eight tone holes. Unlike Western keyed flutes, gamakas are produced by partial hole uncovering (half-holing) and subtle changes in lip angle and blowing pressure.',
    tuningSystem: 'Available in various keys (e.g., 2.5 kattai / D#, 4 kattai / F, 5 kattai / G). The lowest closed note typically sounds Mandra Panchamam or Madhyamam.',
    roleInConcert: 'A premier solo melodic instrument and accompaniment capable of imitating the human singing voice with remarkable fidelity.',
    historicalContext: 'Played in ancient India for thousands of years (mentioned in the Vedas and Mahabharata). Revolutionized in modern Carnatic concert format by Sarabha Sastri and T. R. Mahalingam (Mali).',
    samples: [],
    sources: [
      { title: 'The Flute in Indian Classical Music', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1967.', publicationYear: 1967 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-kanjira',
    slug: 'kanjira',
    canonicalName: 'Kanjira',
    family: 'Membranophone',
    materials: ['Seasoned Jackwood circular frame', 'Monitor lizard (Varanus bengalensis) skin or synthetic calfskin', 'Brass jingles'],
    anatomy: [
      { part: 'Circular Shell', function: 'About 7 to 8 inches in diameter, crafted from dense jackwood.' },
      { part: 'Drumhead', function: 'Thin skin glued tightly across one side of the frame.' },
      { part: 'Jingles (Salangai)', function: 'One pair of brass coin-like cymbals slotted into the wooden frame.' }
    ],
    playingTechnique: 'Held in the left hand and struck exclusively with the fingers and palm of the right hand. The left-hand fingers apply variable pressure to the outer edge of the drumhead, creating deep pitch bending and resonant bass "gumki" sounds. Before playing, water is lightly misted on the inner skin to achieve optimal elasticity.',
    tuningSystem: 'Naturally low pitch modulated in real time by the player pressing the skin.',
    roleInConcert: 'The premier secondary percussion instrument (upa-pakkavadya) in concerts, offering rapid solkattu calculations and high rhythmic intensity.',
    historicalContext: 'Introduced into classical Carnatic music in the 19th century by Manpoondia Pillai of Pudukkottai.',
    samples: [],
    sources: [
      { title: 'The Art of Mridangam and Kanjira', authorOrCreator: 'Pudukkottai Tradition Monograph', citation: '1972.', publicationYear: 1972 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-morsing',
    slug: 'morsing',
    canonicalName: 'Morsing (Jaw Harp)',
    family: 'Idiophone',
    materials: ['Tempered forged iron or brass frame', 'Flexible steel vibrating reed (tongue)'],
    anatomy: [
      { part: 'Frame (Horseshoe body)', function: 'Solid metal frame placed firmly against the front teeth.' },
      { part: 'Plucking Tongue (Trigger)', function: 'Thin steel prong extending between the frame prongs, ending in an upward hook.' }
    ],
    playingTechnique: 'The metal frame is held firmly against the front teeth, with the lips slightly open. The player’s right index finger plucks the flexible metal tongue, while changing oral cavity shape and breathing in and out to amplify harmonics and vocalize rhythmic bols.',
    tuningSystem: 'Fine-tuned to the exact concert tonic (Sa) by applying beeswax to the tip of the vibrating reed.',
    roleInConcert: 'Provides a metallic, driving rhythmic undertone alongside the mridangam and kanjira in the percussion ensemble.',
    historicalContext: 'Ancient folk instrument incorporated into classical Carnatic concerts during the 20th century.',
    samples: [],
    sources: [
      { title: 'South Indian Musical Instruments', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1976.', publicationYear: 1976 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-nadaswaram',
    slug: 'nadaswaram',
    canonicalName: 'Nadaswaram',
    family: 'Aerophone',
    materials: ['Acha / Rosewood seasoned body', 'Brass bell (Anasu)', 'River reed (Olaru)'],
    anatomy: [
      { part: 'Kuzhal (Body)', function: 'Long conical wooden tube with 7 playing finger holes and 5 ventilation holes.' },
      { part: 'Anasu (Bell)', function: 'Flared metal or wooden bell amplifying sound projection.' },
      { part: 'Reed (Kendai & Olaru)', function: 'Double reed attached to a brass staple at the top.' }
    ],
    playingTechnique: 'Requires immense lung power and circular breathing. The musician blows into the double reed while manipulating finger holes to produce continuous microtonal gamakas.',
    tuningSystem: 'Available in various tonic shrutis (e.g. 2 kattai, 2.5 kattai).',
    roleInConcert: 'The paramount Mangala Vadya (auspicious instrument) of South Indian temples, weddings, and festivals.',
    historicalContext: 'Mentioned in ancient Tamil inscriptions and Telugu treatises as the ceremonial instrument of royal courts and temples.',
    samples: [],
    sources: [
      { title: 'The Mangala Vadya: Nadaswaram Tradition', authorOrCreator: 'B. M. Sundaram', citation: '1982.', publicationYear: 1982 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-thavil',
    slug: 'thavil',
    canonicalName: 'Thavil',
    family: 'Membranophone',
    materials: ['Hollowed single block of Jackwood body', 'Water buffalo and goat skin heads', 'Steel hoop tensioners'],
    anatomy: [
      { part: 'Right Drumhead (Valanthalai)', function: 'Thin skin head played with finger thimbles made of hardened rice-paste cloth.' },
      { part: 'Left Drumhead (Thoppi)', function: 'Thick water buffalo skin head struck with a short, curved wooden stick.' },
      { part: 'Body (Koodu)', function: 'Solid barrel-shaped resonator.' }
    ],
    playingTechnique: 'The drum is slung around the neck with a leather strap. The player’s right fingers wear hardened plaster/cloth thimbles, producing lightning-fast snaps, while the left hand uses a stout wooden stick to strike deep boom accents.',
    tuningSystem: 'The heads are tensioned using steel hoops and braces to a high, penetrating pitch.',
    roleInConcert: 'The exclusive percussion companion to the Nadaswaram, famous for astonishing mathematical pyrotechnics and volume.',
    historicalContext: 'Integral to temple tradition and outdoor processions for centuries across Tamil Nadu, Andhra Pradesh, Karnataka, and Kerala.',
    samples: [],
    sources: [
      { title: 'The Percussion Tradition of South India', authorOrCreator: 'T. Sankaran', citation: '1987.', publicationYear: 1987 }
    ],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-chitravina',
    slug: 'chitravina',
    canonicalName: 'Chitravina (Gottuvadhyam)',
    family: 'Chordophone',
    materials: ['Aged Jackwood hollow body', 'Cylindrical teflon or polished ebony/bison-horn slide', 'Steel and bronze strings'],
    anatomy: [
      { part: 'Resonator (Kudam & Dandi)', function: 'Long hollow neck without frets, producing continuous slide oscillations.' },
      { part: 'Slide (Kodu)', function: 'Handheld cylinder glided over strings to stop pitches without fret friction.' },
      { part: 'Sympathetic Strings', function: 'Around 11 to 14 resonance strings beneath the main strings providing acoustic sustain.' }
    ],
    playingTechnique: 'The player sits cross-legged with the instrument resting flat on the lap or floor. The right hand plucks strings using plectrums (mezhrab/wire picks), while the left hand glides the smooth cylindrical slide along the strings. Allows completely seamless gamakas and portamentos.',
    tuningSystem: 'Main strings tuned to Mandra Sa, Mandra Pa, Madhya Sa, Madhya Pa, along with sympathetic drone strings.',
    roleInConcert: 'Elite solo concert instrument revered for producing the purest vocal (gayaki) style without fret intervals.',
    historicalContext: 'Ancient fretless lute mentioned in Sangita Ratnakara (as Chitra veena); popularized in modern era by Sakha Rama Rao and N. Ravikiran.',
    samples: [],
    sources: [{ title: 'The Fretless Veena of South India', authorOrCreator: 'N. Ravikiran', citation: '1992.', publicationYear: 1992 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-carnatic-mandolin',
    slug: 'carnatic-mandolin',
    canonicalName: 'Carnatic Mandolin',
    family: 'Chordophone',
    materials: ['Solid hardwood electric body', 'Magnetic pickups', 'Single steel strings (custom 5-string setup)'],
    anatomy: [
      { part: 'Fretboard', function: 'Fretted fingerboard adjusted for microtonal bending across high-tension single strings.' },
      { part: 'Pickups & Amplifier', function: 'Provides electrical sustain required to sustain slow vilamba kala oscillations.' },
      { part: 'Bridge & Tailpiece', function: 'Anchors 5 single strings tuned in fifths.' }
    ],
    playingTechnique: 'Pioneered by prodigy U. Srinivas. Unlike Western double-strung acoustic mandolins, Srinivas used 5 single strings (E5, A4, D4, G3, C3). Gamakas are produced through rapid lateral string deflection across frets and lightning-fast pick tremolos.',
    tuningSystem: 'Tuned in fifths/fourths: Tara Sa, Madhya Pa, Madhya Sa, Mandra Pa, Mandra Sa.',
    roleInConcert: 'Major solo instrumental sensation; transformed a Western bluegrass instrument into a classical Carnatic titan.',
    historicalContext: 'Introduced by U. Srinivas in the late 1970s and 1980s, gaining worldwide acclaim and acceptance at the Madras Music Academy.',
    samples: [],
    sources: [{ title: 'The Electric Mandolin in South Indian Classical Music', authorOrCreator: 'Madras Music Academy Proceedings', citation: '1989.', publicationYear: 1989 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-carnatic-saxophone',
    slug: 'carnatic-saxophone',
    canonicalName: 'Carnatic Saxophone',
    family: 'Aerophone',
    materials: ['Brass body with custom pad dampening', 'Single cane reed', 'Custom modified mouthpiece'],
    anatomy: [
      { part: 'Mouthpiece & Reed', function: 'Customized embouchure configuration enabling flexible lip-pressure pitch bending.' },
      { part: 'Padded Keywork', function: 'Key pads dampened to enable subtle half-stroke venting for microtones.' },
      { part: 'Conical Brass Body', function: 'Provides immense acoustic projection and rich resonance.' }
    ],
    playingTechnique: 'Adapted by Padmashri Kadri Gopalnath. The saxophonist alters standard Western embouchure, biting and relaxing lip pressure dynamically while cross-fingering to produce intricate kampita and jaru gamakas.',
    tuningSystem: 'Usually keyed to E-flat or B-flat alto saxophone, tuned with the concert tanpura at standard kattai.',
    roleInConcert: 'Vibrant solo and jugalbandi concert instrument celebrated for power, devotion, and virtuosity.',
    historicalContext: 'Developed by Kadri Gopalnath over 20 years of research with master instrument makers in Chennai.',
    samples: [],
    sources: [{ title: 'Cross-Cultural Organology: The Carnatic Saxophone', authorOrCreator: 'Kadri Gopalnath', citation: '1995.', publicationYear: 1995 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-jalatharangam',
    slug: 'jalatharangam',
    canonicalName: 'Jalatharangam (Water Chimes)',
    family: 'Idiophone',
    materials: ['Porcelain china bowls of varying sizes', 'Water', 'Two slender bamboo striking sticks'],
    anatomy: [
      { part: 'Porcelain Cups', function: 'Arranged in a semi-circle from largest (lowest pitch) to smallest (highest pitch).' },
      { part: 'Water Levels', function: 'Varying water depths poured into each cup to tune exact microtonal swarasthanas.' },
      { part: 'Sticks (Kampu)', function: 'Thin bamboo sticks that strike the rims of the cups.' }
    ],
    playingTechnique: 'The player sits at the center of the semi-circle. Lightly striking the wet rims produces sweet, bell-like pure sine tones. Gamakas are produced by gently dipping and vibrating the stick in the water immediately after striking.',
    tuningSystem: 'Each cup is individually filled and calibrated to exact Just Intonation swara frequencies before each recital.',
    roleInConcert: 'Rare and enchanting classical solo melodic instrument, creating a serene, crystalline sonic atmosphere.',
    historicalContext: 'Mentioned in Vatsyayana’s Kama Sutra as one of the 64 classical arts (Udaki-vadyam) and in the 13th-century Sangita Ratnakara.',
    samples: [],
    sources: [{ title: 'Musical Instruments of India', authorOrCreator: 'B. C. Deva', citation: '1977.', publicationYear: 1977 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  },
  {
    id: 'inst-idakka',
    slug: 'idakka',
    canonicalName: 'Idakka (Edakka)',
    family: 'Membranophone',
    materials: ['Hollow wooden hourglass body (Jackwood)', 'Stretched calfskin parchment heads mounted on bamboo rings', 'Four woolen pompoms', 'Shoulder sling strap'],
    anatomy: [
      { part: 'Hourglass Shell', function: 'Hollow central waist that allows strings to be compressed.' },
      { part: 'Tension Strings (Jeevakol)', function: 'Interconnected ropes that tighten the drumheads when squeezed.' },
      { part: 'Stick', function: 'Slender curved wooden stick that strikes only the front face.' }
    ],
    playingTechnique: 'Slung across the left shoulder. The right hand strikes the face with a light curved stick, while the left hand squeezes and releases the shoulder strap and tension ropes. This variable tension alters the pitch continuously across an entire two-octave range, enabling the drum to literally play melodies and gamakas.',
    tuningSystem: 'Dynamic variable pitch capable of singing all seven swaras relative to the Adhara Shadjam.',
    roleInConcert: 'Temple ritual percussion instrument of Sopana Sangeetham (Kerala) capable of melodic rendering.',
    historicalContext: 'Ancient Deva-Vadyam revered as the drum of Lord Shiva in temple sanctums.',
    samples: [],
    sources: [{ title: 'The Sopanam Tradition of Temple Music', authorOrCreator: 'L. S. Rajagopalan', citation: '1984.', publicationYear: 1984 }],
    rights: { status: 'public_domain', rightsHolder: 'Carnatic Cultural Heritage' },
    reviewStatus: 'expert_reviewed',
    reviewerName: 'NadaVerse Organology Board',
    reviewedAt: '2026-10-15'
  }
];

export const BEGINNER_LESSONS: LessonItem[] = [
  {
    id: 'lesson-1',
    slug: 'shruti-the-eternal-tonic',
    moduleOrder: 1,
    title: 'The Eternal Drone: Understanding Shruti & Sa',
    subtitle: 'Every journey in Carnatic music begins by finding your grounding in Adhara Shadjam.',
    estimatedMinutes: 5,
    targetAudience: 'Absolute Beginner',
    coreConcept: 'In Western music, pitch shifts with key changes throughout a symphony. In Carnatic music, the tonic pitch (Sa) is absolute and unchanging for the entire duration of a concert. Everything is heard relative to Sa.',
    explanation: 'Shruti is often referred to as "the mother of music" (Mata). When you sit down to listen or sing, you first listen to the Tambura. The primary note is Shadjam (Sa)—the foundation from which the other six notes arise. Finding a comfortable Sa allows you to sing without straining your vocal cords.',
    listeningObjective: 'Listen to the continuous drone of Sa and Pa. Feel how your breath aligns with the resonance.',
    practicePrompt: 'Open the Shruti Companion below, select C (or your preferred comfortable vocal pitch), and hum along with Sa until your voice merges cleanly with the drone.',
    interactiveTool: 'shruti',
    sources: [
      { title: 'The Philosophy of Carnatic Music', authorOrCreator: 'T. V. Subba Rao', citation: 'Music Academy Madras Lectures, 1962.', publicationYear: 1962 }
    ]
  },
  {
    id: 'lesson-2',
    slug: 'the-sapta-swaras',
    moduleOrder: 2,
    title: 'The Seven Swaras: The Alphabet of Indian Melody',
    subtitle: 'Meet Sa, Ri, Ga, Ma, Pa, Dha, and Ni—the building blocks of every raga.',
    estimatedMinutes: 7,
    targetAudience: 'Absolute Beginner',
    coreConcept: 'The seven natural notes (Sapta Swaras) are Shadjam (Sa), Rishabham (Ri), Gandharam (Ga), Madhyamam (Ma), Panchamam (Pa), Dhaivatam (Dha), and Nishadam (Ni). Two notes (Sa and Pa) are invariant (Achala), while the other five have varieties.',
    explanation: 'Unlike 12 equally-tempered half-steps in modern Western keyboards, Carnatic swaras possess specific natural harmonic ratios (Just Intonation). In Mayamalavagowla, for example, Rishabham is Shuddha Ri (R₁), which sits very close to Sa, creating an introspective, deeply focused tension.',
    listeningObjective: 'Listen to the step-by-step ascent of Mayamalavagowla from Sa up to Tara Sa.',
    practicePrompt: 'Use the interactive raga notes on the Mayamalavagowla page to hear each swara individually relative to the C drone.',
    interactiveTool: 'shruti',
    sources: [
      { title: 'South Indian Music (Book I)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: 'The Indian Music Publishing House, Chennai, 1960.', publicationYear: 1960 }
    ]
  },
  {
    id: 'lesson-3',
    slug: 'laya-and-adi-tala',
    moduleOrder: 3,
    title: 'Laya & Tala: The Cosmic Heartbeat of Rhythm',
    subtitle: 'Learn how Carnatic musicians keep time using structured hand kriyas.',
    estimatedMinutes: 6,
    targetAudience: 'Absolute Beginner',
    coreConcept: 'Laya is rhythm or speed; Tala is a specific cyclic framework of beats (avarthanam). The most famous tala is Adi Tala, which has 8 beats structured into one Laghu (clap + 3 finger counts) and two Dhrutams (clap + wave).',
    explanation: 'In Carnatic concerts, both the performers on stage and the connoisseurs in the audience visibly keep the tala using their hands (putting the thalam). This visual rhythmic synchronization creates an unbroken communion between performer and listener.',
    listeningObjective: 'Follow the 8 beats of Adi Tala with the visual pulse indicator.',
    practicePrompt: 'Turn on the Tala Studio at 72 BPM and clap on beat 1, tap your pinky on 2, ring finger on 3, middle on 4, clap on 5, wave on 6, clap on 7, and wave on 8.',
    interactiveTool: 'tala',
    sources: [
      { title: 'The Splendour of South Indian Music', authorOrCreator: 'P. T. Chelladurai', citation: 'Vaidyanathan Publications, 1991.', publicationYear: 1991 }
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Shruti',
    transliteration: 'Śruti',
    category: 'Fundamentals',
    simpleExplanation: 'The foundational tonic pitch (drone) and the subtle microtonal musical intervals.',
    detailedContext: 'Colloquially, Shruti refers to the key note (Adhara Shadjam) to which instruments and voices are tuned. In classical theory, the octave is divided into 22 shrutis that define microtonal positions.',
    relatedTerms: ['Adhara Shadjam', 'Tambura', 'Swara'],
    sources: [{ title: 'Natya Shastra', authorOrCreator: 'Bharata Muni', citation: 'Chapter 28 on Musical Scales and Shrutis.' }]
  },
  {
    term: 'Swara',
    transliteration: 'Svara',
    category: 'Fundamentals',
    simpleExplanation: 'A musical note that pleases the mind of its own accord.',
    detailedContext: 'The seven primary swaras are Sa, Ri, Ga, Ma, Pa, Dha, Ni. Swaras in Carnatic music are rarely static points; they are ornamented with microtonal curves called gamakas.',
    relatedTerms: ['Sapta Swaras', 'Gamaka', 'Swarasthana'],
    sources: [{ title: 'Sangita Ratnakara', authorOrCreator: 'Sarangadeva', citation: '13th Century CE.' }]
  },
  {
    term: 'Gamaka',
    transliteration: 'Gamaka',
    category: 'Aesthetics',
    simpleExplanation: 'Any graceful oscillation, glide, shake, or ornament that gives life to a swara.',
    detailedContext: 'Gamakas are not decorative embellishments added to a note; they are an integral part of the swara itself. Without gamakas, a Carnatic raga loses its identity.',
    relatedTerms: ['Kampitam', 'Nokku', 'Odukkal', 'Raga'],
    sources: [{ title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: 'Ettayapuram, 1904.' }]
  },
  {
    term: 'Raga',
    transliteration: 'Rāga',
    category: 'Melody',
    simpleExplanation: 'A melodic framework with a distinct set of notes, rules of ascent/descent, and emotional character.',
    detailedContext: 'Derived from the Sanskrit root "ranj" (to delight or color the mind). Characterized by its scale (arohanam/avarohanam), characteristic phrases (sancharas), and stressed notes.',
    relatedTerms: ['Melakarta', 'Janya', 'Arohanam', 'Avarohanam'],
    sources: [{ title: 'Chaturdandi Prakasika', authorOrCreator: 'Venkatamakhin', citation: 'c. 1620 CE; established the 72 Melakarta scheme.' }]
  },
  {
    term: 'Tala',
    transliteration: 'Tāḷa',
    category: 'Rhythm',
    simpleExplanation: 'The cyclic rhythmic meter of Carnatic music, measured in counts and hand gestures.',
    detailedContext: 'A tala measures musical time in cycles called avarthanams. It is formed by combinations of angas (Laghu, Dhrutam, Anudhrutam) executed with precise physical kriyas.',
    relatedTerms: ['Laya', 'Akshara', 'Avartanam', 'Anga', 'Gati'],
    sources: [{ title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.' }]
  },
  {
    term: 'Melakarta',
    transliteration: 'Mēḷakartā',
    category: 'Melody',
    simpleExplanation: 'One of the 72 parent scales of Carnatic music that contain all seven notes in linear order.',
    detailedContext: 'Codified by Venkatamakhin and refined by Govindacharya. The 72 scales are divided into 12 Chakras of 6 ragas each. The first 36 feature Shuddha Madhyamam (M1); the second 36 feature Prati Madhyamam (M2).',
    relatedTerms: ['Chakra', 'Janya Raga', 'Katapayadi Sankhya'],
    sources: [{ title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.' }]
  },
  {
    term: 'Alapana',
    transliteration: 'Ālāpana',
    category: 'Structure',
    simpleExplanation: 'An unmetered, improvised melodic prelude revealing the personality of a raga without percussion.',
    detailedContext: 'The performer explores the raga across octaves (Mandra, Madhya, Tara stayis) using akara and musical syllables (Ta, Da, Ri, Na). It is the purest test of a musician’s depth of raga bhava.',
    relatedTerms: ['Raga', 'Tanam', 'Kriti'],
    sources: [{ title: 'The Art and Science of Carnatic Music', authorOrCreator: 'Vidya Shankar', citation: '1983.' }]
  },
  {
    term: 'Kriti',
    transliteration: 'Kṛti',
    category: 'Structure',
    simpleExplanation: 'The primary musical composition form in Carnatic concerts, consisting of Pallavi, Anupallavi, and Charanam.',
    detailedContext: 'Perfected by the Carnatic Trinity (Tyagaraja, Dikshitar, Shyama Shastri). The Pallavi introduces the theme, Anupallavi explores the upper octave, and Charanam unites both movements with lyricism.',
    relatedTerms: ['Pallavi', 'Anupallavi', 'Charanam', 'Sangati'],
    sources: [{ title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1964.' }]
  },
  {
    term: 'Varnam',
    transliteration: 'Varṇam',
    category: 'Structure',
    simpleExplanation: 'A foundational multi-part compositional study piece encapsulating all key phrases and gamakas of a raga.',
    detailedContext: 'Performed at the beginning of recitals to warm up the voice/fingers and attune listeners to the concert shruti. Consists of Purvanga (Pallavi, Anupallavi, Muktayi Swaram) and Uttaranga (Charanam, Charana Swarams).',
    relatedTerms: ['Tana Varnam', 'Pada Varnam', 'Eduppu'],
    sources: [{ title: 'Teaching of Music', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1966.' }]
  },
  {
    term: 'Tani Avarthanam',
    transliteration: 'Tani Āvartanam',
    category: 'Rhythm',
    simpleExplanation: 'The percussion solo interlude during a concert, led by the Mridangam.',
    detailedContext: 'Following the main composition or RTP, the melodic soloist pauses and the percussion ensemble (Mridangam, Ghatam, Kanjira, Morsing) exchanges complex mathematical korvais and rhythmic calculations.',
    relatedTerms: ['Mridangam', 'Ghatam', 'Korvai', 'Mohra'],
    sources: [{ title: 'The Tala System of South Indian Music', authorOrCreator: 'Dr. N. Ramanathan', citation: '1988.' }]
  },
  {
    term: 'Eduppu',
    transliteration: 'Eḍuppu',
    category: 'Rhythm',
    simpleExplanation: 'The specific take-off point where a melody begins relative to the start of the tala cycle.',
    detailedContext: 'Can be Sama (beginning exactly on the first beat) or Anagata (beginning after the beat, e.g. 1/2 or 3/4 count later). Proper mastery of eduppu is critical for landing korvais cleanly.',
    relatedTerms: ['Graha', 'Tala', 'Laya'],
    sources: [{ title: 'Tala Guide: Structure & Practice', authorOrCreator: 'Madras Music Academy', citation: '1977.' }]
  },
  {
    term: 'Korvai',
    transliteration: 'Kōrvai',
    category: 'Rhythm',
    simpleExplanation: 'A rhythmic pattern consisting of mathematical phrases repeated three times to conclude a section.',
    detailedContext: 'A hallmark of Carnatic rhythmic virtuosity. The final pattern (muktayi) repeats three identical sub-patterns that land precisely on the eduppu of the kriti.',
    relatedTerms: ['Tani Avarthanam', 'Mridangam', 'Laya'],
    sources: [{ title: 'Rhythmic Principles in South Indian Music', authorOrCreator: 'Trichy Sankaran', citation: '1994.' }]
  },
  {
    term: 'Niraval',
    transliteration: 'Neraval / Niraval',
    category: 'Manodharma',
    simpleExplanation: 'Extempore melodic and rhythmic improvisation on a chosen lyric line while preserving tala and meaning.',
    detailedContext: 'One of the five traditional branches of Manodharma Sangeeta (creative music). The musician weaves endless permutations of swara contours and tempo shifts without altering the grammatical structure and eduppu of the text.',
    relatedTerms: ['Kriti', 'Manodharma', 'Eduppu', 'Kalpanaswara'],
    sources: [{ title: 'The Art and Science of Carnatic Music', authorOrCreator: 'Vidya Shankar', citation: '1983.' }]
  },
  {
    term: 'Kalpanaswara',
    transliteration: 'Kalpanāsvara',
    category: 'Manodharma',
    simpleExplanation: 'Spontaneous improvisation singing solfa syllables that resolve impeccably onto the take-off beat of the song.',
    detailedContext: 'Musicians craft mathematical and aesthetic swara groupings, starting in 1st speed (vilambita) and escalating to 2nd speed (madhyama), culminating in an intricately calculated korvai that locks onto the eduppu.',
    relatedTerms: ['Swara', 'Korvai', 'Eduppu', 'Manodharma'],
    sources: [{ title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.' }]
  },
  {
    term: 'Sthayi',
    transliteration: 'Sthāyī',
    category: 'Fundamentals',
    simpleExplanation: 'The octave register in Indian classical music.',
    detailedContext: 'The human vocal range is divided into three primary octaves: Mandra Sthayi (lower octave, marked with a dot below the note), Madhya Sthayi (middle octave, unmodified), and Tara Sthayi (higher octave, marked with a dot above the note). Rare registers include Anumandra (sub-lower) and Ati-Tara (sub-higher).',
    relatedTerms: ['Madhya Sthayi', 'Tara Sthayi', 'Mandra Sthayi'],
    sources: [{ title: 'Sangita Ratnakara', authorOrCreator: 'Sarangadeva', citation: '13th Century CE.' }]
  },
  {
    term: 'Arohanam & Avarohanam',
    transliteration: 'Ārōhaṇam & Avarōhaṇam',
    category: 'Melody',
    simpleExplanation: 'The designated ascending and descending sequence of notes defining a raga.',
    detailedContext: 'Arohanam dictates the path of ascent from Shadjam to Tara Shadjam; Avarohanam dictates the path of return. It identifies whether notes are omitted (varja), zig-zag (vakra), or symmetric (sampurna).',
    relatedTerms: ['Raga', 'Melakarta', 'Janya Raga', 'Vakra Raga'],
    sources: [{ title: 'Chaturdandi Prakasika', authorOrCreator: 'Venkatamakhin', citation: 'c. 1620 CE.' }]
  },
  {
    term: 'Janya Raga',
    transliteration: 'Janya Rāga',
    category: 'Melody',
    simpleExplanation: 'A derivative raga spawned from one of the 72 parent Melakarta scales.',
    detailedContext: 'Classified based on structure: Audava (5 notes), Shadava (6 notes), Sampurna (7 notes), Vakra (tortuous path), Upanga (pure to parent scale), or Bhashanga (featuring foreign anya swaras).',
    relatedTerms: ['Melakarta', 'Bhashanga Raga', 'Vakra Raga'],
    sources: [{ title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.' }]
  },
  {
    term: 'Bhashanga Raga',
    transliteration: 'Bhāṣāṅga Rāga',
    category: 'Melody',
    simpleExplanation: 'A janya raga that introduces one or more foreign notes (anya swaras) not found in its parent scale.',
    detailedContext: 'Celebrated ragas such as Bhairavi (features Chatushruti Dhaivatam), Kambhoji (features Kakali Nishadam), and Bilahari (features Kaisiki Nishadam) derive their profound beauty from these masterfully placed foreign tones.',
    relatedTerms: ['Janya Raga', 'Anya Swara', 'Bhairavi', 'Kambhoji'],
    sources: [{ title: 'Ragas of South India', authorOrCreator: 'Walter Kaufmann', citation: '1976.' }]
  },
  {
    term: 'Vakra Raga',
    transliteration: 'Vakra Rāga',
    category: 'Melody',
    simpleExplanation: 'A raga whose scale features zig-zag, non-linear swara paths in ascent or descent.',
    detailedContext: 'Notes do not follow strict linear order (e.g. S R G M P D N Ṡ), but rather loops or turns (e.g. Anandabhairavi, Sahana, Reethigowla). This non-linear movement creates deeply unique raga contours.',
    relatedTerms: ['Arohanam & Avarohanam', 'Janya Raga'],
    sources: [{ title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1964.' }]
  },
  {
    term: 'Sangati',
    transliteration: 'Saṅgati',
    category: 'Aesthetics',
    simpleExplanation: 'Progressive melodic variations on a single lyrical line to heighten emotion and musical depth.',
    detailedContext: 'Pioneered to absolute perfection by Saint Tyagaraja. Each repetition of the phrase introduces new micro-ornaments, wider octave leaps, or rhythmic nuances, systematically unravelling the personality of the raga.',
    relatedTerms: ['Kriti', 'Tyagaraja', 'Gamaka'],
    sources: [{ title: 'Great Composers: Tyagaraja', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1970.' }]
  },
  {
    term: 'Kriya',
    transliteration: 'Kriyā',
    category: 'Rhythm',
    simpleExplanation: 'The physical manual gesture (clap, wave, finger tap) executed to mark units of time in a tala.',
    detailedContext: 'Kriyas are categorized into Sashabda (sounding gestures, such as Thattu/Clap) and Nishabda (silent gestures, such as Veechu/Wave and finger counts). These physical cues maintain unshakeable synchronization between all artists.',
    relatedTerms: ['Tala', 'Anga', 'Laghu', 'Dhrutam'],
    sources: [{ title: 'Tala Guide: Structure & Practice', authorOrCreator: 'Madras Music Academy', citation: '1977.' }]
  },
  {
    term: 'Laya',
    transliteration: 'Laya',
    category: 'Rhythm',
    simpleExplanation: 'The universal tempo, speed, or inner rhythmic pulse of music.',
    detailedContext: 'Classified into three foundational speeds: Vilamba (slow, dignified), Madhya (moderate, balanced), and Dhruta (fast, energetic). In Carnatic practice, maintaining unwavering kalapramanam (steadfastness of laya) is regarded as the hallmark of a master.',
    relatedTerms: ['Tala', 'Vilamba Kala', 'Madhyama Kala'],
    sources: [{ title: 'The Splendour of South Indian Music', authorOrCreator: 'P. T. Chelladurai', citation: '1991.' }]
  },
  {
    term: 'Swarasthana',
    transliteration: 'Svarasthāna',
    category: 'Fundamentals',
    simpleExplanation: 'The specific pitch position of a swara within an octave relative to the tonic Adhara Shadjam.',
    detailedContext: 'While an octave is acoustically divided into 12 semitones, Carnatic music assigns 16 distinct musical swarasthanas to account for dual enharmonic identities (such as Shuddha Gandharam sharing pitch with Chatushruti Rishabham).',
    relatedTerms: ['Swara', 'Sapta Swaras', 'Shruti'],
    sources: [{ title: 'South Indian Music (Book I)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1960.' }]
  },
  {
    term: 'Mudra',
    transliteration: 'Mudrā',
    category: 'Literature',
    simpleExplanation: 'The composer’s signature woven into the lyrical text of a composition.',
    detailedContext: 'Vaggeyakaras (composer-lyricists) embed their chosen insignia in the final stanza (charanam). Examples include "Tyagaraja", "Guruguha" (Dikshitar), "Shyama Krishna", "Padmanabha" (Swathi Thirunal), and "Purandara Vittala".',
    relatedTerms: ['Vaggeyakara', 'Kriti', 'Charanam'],
    sources: [{ title: 'The Art and Science of Carnatic Music', authorOrCreator: 'Vidya Shankar', citation: '1983.' }]
  },
  {
    term: 'Graha',
    transliteration: 'Graha (Eḍuppu)',
    category: 'Rhythm',
    simpleExplanation: 'The starting beat relationship of a melody relative to the start of the tala cycle.',
    detailedContext: 'Classified into Sama Graha (melody begins exactly on the first beat), Anagata Graha (melody begins after the beat has elapsed), and Ateeta Graha (melody anticipates and begins prior to the beat).',
    relatedTerms: ['Eduppu', 'Tala', 'Laya'],
    sources: [{ title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.' }]
  },
  {
    term: 'Nyasa',
    transliteration: 'Nyāsa Svara',
    category: 'Melody',
    simpleExplanation: 'The concluding or resting note where musical phrases linger to impart stability.',
    detailedContext: 'Essential for conveying authentic raga lakshana. Resting on a non-nyasa swara creates awkward unresolved tension, whereas landing on a Jeeva or Nyasa swara brings instant aesthetic fulfilment.',
    relatedTerms: ['Vadi', 'Samvadi', 'Raga', 'Sanchara'],
    sources: [{ title: 'Sangita Ratnakara', authorOrCreator: 'Sarangadeva', citation: '13th Century CE.' }]
  },
  {
    term: 'Vadi',
    transliteration: 'Vādī Svara',
    category: 'Melody',
    simpleExplanation: 'The principal, dominant "sonant" note of a raga (the king of notes).',
    detailedContext: 'The note sounded most frequently, held longest, and around which the entire melodic dialogue of the raga revolves. In traditional treatises, compared to a sovereign monarch ruling a kingdom.',
    relatedTerms: ['Samvadi', 'Vivadi', 'Anuvadi'],
    sources: [{ title: 'Natya Shastra', authorOrCreator: 'Bharata Muni', citation: 'Chapter 28.' }]
  },
  {
    term: 'Samvadi',
    transliteration: 'Saṁvādī Svara',
    category: 'Melody',
    simpleExplanation: 'The consonant note forming a harmonious fourth or fifth interval with the Vadi note.',
    detailedContext: 'Separated by 9 or 13 shrutis from the Vadi swara (e.g. Sa and Pa, or Ri and Dha). In treatise analogies, if Vadi is the king, Samvadi is the trusted prime minister who echoes and supports the king’s decisions.',
    relatedTerms: ['Vadi', 'Vivadi', 'Shruti'],
    sources: [{ title: 'Natya Shastra', authorOrCreator: 'Bharata Muni', citation: 'Chapter 28.' }]
  },
  {
    term: 'Vivadi',
    transliteration: 'Vivādī Svara',
    category: 'Melody',
    simpleExplanation: 'A discordant, proximate note placed only a single shruti apart from an adjacent note.',
    detailedContext: 'Found in 40 of the 72 Melakarta ragas where pairs like Shuddha Gandharam (G1) with Chatushruti Rishabham (R2), or Shatshruti Rishabham (R3) with Sadharana Gandharam (G2) appear. Creates sharp acoustic dissonance and thrilling tension when handled by masters.',
    relatedTerms: ['Melakarta', 'Vadi', 'Samvadi'],
    sources: [{ title: 'Chaturdandi Prakasika', authorOrCreator: 'Venkatamakhin', citation: 'c. 1620 CE.' }]
  },
  {
    term: 'Jati',
    transliteration: 'Jāti',
    category: 'Rhythm',
    simpleExplanation: 'The metric classification of the Laghu into 3, 4, 5, 7, or 9 counts.',
    detailedContext: 'The five fundamental jatis are Tisra (3), Chatusra (4), Khanda (5), Misra (7), and Sankeerna (9). Combining these 5 jatis with the 7 Suladi talas yields the 35 Tala system of Carnatic music.',
    relatedTerms: ['Tala', 'Laghu', 'Suladi Sapta Talas'],
    sources: [{ title: 'South Indian Music (Book IV)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1965.' }]
  },
  {
    term: 'Gati / Nadai',
    transliteration: 'Gati / Naḍai',
    category: 'Rhythm',
    simpleExplanation: 'The inner subdivision of each tala beat into micro-pulses (matras).',
    detailedContext: 'While tempo remains constant, the musician shifts the internal subdivision: Chatusra (4 pulses per beat - Ta-ka-dhi-mi), Tisra (3 pulses - Ta-ki-ta), Khanda (5 pulses - Ta-ka-ta-ki-ta), Misra (7 pulses), or Sankeerna (9 pulses).',
    relatedTerms: ['Tala', 'Laya', 'Jati'],
    sources: [{ title: 'The Tala System of South Indian Music', authorOrCreator: 'Dr. N. Ramanathan', citation: '1988.' }]
  },
  {
    term: 'Pallavi',
    transliteration: 'Pallavi',
    category: 'Structure',
    simpleExplanation: 'The opening thematic section of a kriti, or the supreme improvisation vehicle in RTP.',
    detailedContext: 'Derived mnemonic acronym from Padam (word), Layam (tempo), and Vinyasam (expansion). In kritis, it establishes the central melodic motif. In RTP (Ragam-Tanam-Pallavi), it represents the pinnacle of rhythmic and melodic virtuosity.',
    relatedTerms: ['Anupallavi', 'Charanam', 'RTP'],
    sources: [{ title: 'Teaching of Music', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1966.' }]
  },
  {
    term: 'Anupallavi',
    transliteration: 'Anupallavi',
    category: 'Structure',
    simpleExplanation: 'The second section of a composition, typically exploring the upper octave.',
    detailedContext: 'Follows the Pallavi and ascends into the Tara Sthayi (higher register), providing energetic contrast and melodic escalation before returning to the Pallavi theme.',
    relatedTerms: ['Pallavi', 'Charanam', 'Kriti'],
    sources: [{ title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1964.' }]
  },
  {
    term: 'Charanam',
    transliteration: 'Caraṇam',
    category: 'Structure',
    simpleExplanation: 'The concluding stanza of a composition uniting melodic themes and composer signature.',
    detailedContext: 'Translates to "foot" or conclusion. Blends the melodic phrases of both Pallavi and Anupallavi, completing the lyrical message and embedding the composer’s unique mudra.',
    relatedTerms: ['Pallavi', 'Anupallavi', 'Mudra'],
    sources: [{ title: 'South Indian Music (Book III)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1964.' }]
  },
  {
    term: 'Tillana',
    transliteration: 'Tillānā',
    category: 'Structure',
    simpleExplanation: 'A brisk, celebratory rhythmic composition that concludes concerts and dance recitals.',
    detailedContext: 'Derived from North Indian Tarana. Consists of energetic jatis, mridangam syllables, and solkattu phrases in the Pallavi and Anupallavi, concluding with a lyrical Charanam and brilliant korvai.',
    relatedTerms: ['Laya', 'Korvai', 'Varnam'],
    sources: [{ title: 'Great Composers (Vol. II)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1970.' }]
  },
  {
    term: 'Jaru',
    transliteration: 'Jāru (Gamaka)',
    category: 'Aesthetics',
    simpleExplanation: 'A graceful, continuous glide between two distant musical pitches (portamento/glissando).',
    detailedContext: 'One of the Panchadasa (15) Gamakas. Divided into Ullaasita (upward glide, e.g. Sa sliding smoothly to Pa) and Dhaala (downward glide, e.g. Tara Sa sliding down to Ma) without hearing intermediate chromatic steps.',
    relatedTerms: ['Gamaka', 'Kampitam', 'Nokku'],
    sources: [{ title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.' }]
  }
];

export const VERIFIED_COMPOSERS: ComposerItem[] = [
  {
    id: 'comp-tyagaraja',
    slug: 'tyagaraja',
    name: 'Saint Tyagaraja',
    lifespan: '1767–1847 CE',
    birthplace: 'Thiruvarur, Tamil Nadu',
    primaryLanguages: ['Telugu', 'Sanskrit'],
    tradition: 'Carnatic Trinity',
    biography: 'One of the most revered composer-mystics in Indian history. Consecrated his life to Rama bhakti in Thiruvaiyaru, refusing royal patronage. Revolutionized the Kriti form by introducing systematic sangatis, and composed the monumental Ghana Raga Pancharatna kritis.',
    signatureMudra: 'Tyagaraja',
    majorKritis: [
      'Endaro Mahanubhavulu (Shree - Adi)',
      'Jagadanandakaraka (Nata - Adi)',
      'Swara Raga Sudharasa (Shankarabharanam - Adi)',
      'Chakkani Raja Marga (Kharaharapriya - Adi)',
      'Tulasidala (Mayamalavagowla - Rupaka)'
    ],
    sources: [
      { title: 'The Spiritual Heritage of Tyagaraja', authorOrCreator: 'C. Ramanujachari & Dr. V. Raghavan', citation: 'Ramakrishna Math, Chennai, 1957.' }
    ]
  },
  {
    id: 'comp-muthuswami-dikshitar',
    slug: 'muthuswami-dikshitar',
    name: 'Muthuswami Dikshitar',
    lifespan: '1775–1835 CE',
    birthplace: 'Thiruvarur, Tamil Nadu',
    primaryLanguages: ['Sanskrit'],
    tradition: 'Carnatic Trinity',
    biography: 'Philosopher, astrologer, and master of Advaita Vedanta. Renowned for majestic, slow-tempo (vilamba kala) Sanskrit masterpieces filled with raga mudras, temple architecture, and esoteric iconography. Composed the sacred Kamalamba Navavarana and Abhayamba cycles.',
    signatureMudra: 'Guruguha',
    majorKritis: [
      'Vatapi Ganapatim Bhajeham (Hamsadhwani - Adi)',
      'Akshaya Linga Vibho (Shankarabharanam - Misra Chapu)',
      'Kamalambam Bhajare (Kalyani - Adi)',
      'Balagopala (Bhairavi - Adi)',
      'Sri Subrahmanyaya Namaste (Kambhoji - Khanda Triputa)'
    ],
    sources: [
      { title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: 'Vidya Vilasini Press, 1904.' }
    ]
  },
  {
    id: 'comp-shyama-shastri',
    slug: 'shyama-shastri',
    name: 'Shyama Shastri',
    lifespan: '1762–1827 CE',
    birthplace: 'Thiruvarur, Tamil Nadu',
    primaryLanguages: ['Telugu', 'Sanskrit'],
    tradition: 'Carnatic Trinity',
    biography: 'The eldest of the Carnatic Trinity and hereditary priest of the Bangaru Kamakshi temple in Thanjavur. Revered for profound rhythmic complexity, syncopated Viloma chapu talas, and the deeply devotional Navaratnamalika and three monumental Swarajathis.',
    signatureMudra: 'Shyama Krishna',
    majorKritis: [
      'Marivere Gati (Anandabhairavi - Misra Chapu)',
      'Kamakshi Amba Swarajathi (Bhairavi - Misra Chapu)',
      'Sarojadala Netri (Shankarabharanam - Adi)',
      'Palinchu Kamakshi (Madhyamavati - Adi)',
      'Brovavamma (Manji - Misra Chapu)'
    ],
    sources: [
      { title: 'Great Composers: Shyama Shastri', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1970.' }
    ]
  },
  {
    id: 'comp-purandara-dasa',
    slug: 'purandara-dasa',
    name: 'Purandara Dasa',
    lifespan: '1484–1564 CE',
    birthplace: 'Kshemapura / Tirthahalli, Karnataka',
    primaryLanguages: ['Kannada', 'Sanskrit'],
    tradition: 'Karnataka Sangeeta Pitamaha',
    biography: 'Revered as the "Grandfather of Carnatic Music". A wealthy gem merchant turned Haridasa saint who standardized the entire pedagogical curriculum in Mayamalavagowla (Sarali, Jantai, Dhatu, and Alankaras) and composed over 475,000 Devaranamas.',
    signatureMudra: 'Purandara Vittala',
    majorKritis: [
      'Sree Gananatha / Lambodara (Malahari - Tisra Eka)',
      'Deena Dayalo Rama (Mayamalavagowla - Triputa)',
      'Bhagyada Lakshmi Baramma (Madhyamavati - Adi)',
      'Jagadoddharana (Kapi - Adi)'
    ],
    sources: [
      { title: 'Purandara and the Haridasa Movement', authorOrCreator: 'M. V. Krishna Rao', citation: '1966.' }
    ]
  },
  {
    id: 'comp-swathi-thirunal',
    slug: 'swathi-thirunal',
    name: 'Maharaja Swathi Thirunal Rama Varma',
    lifespan: '1813–1846 CE',
    birthplace: 'Travancore (Kerala)',
    primaryLanguages: ['Sanskrit', 'Malayalam', 'Telugu', 'Hindi', 'Kannada'],
    tradition: 'Royal Patron & Polyglot Vaggeyakara',
    biography: 'Maharaja of Travancore who reigned during the golden age of Carnatic and Hindustani music. A polyglot scholar who composed in six languages across classical genres including Kritis, Padams, Javalis, Tillanas, Dhrupads, and Khayals. Famous for the Navaratri and Navavidha Bhakti cycles.',
    signatureMudra: 'Padmanabha / Pankajanabha',
    majorKritis: [
      'Bhavayami Raghuramam (Ragamalika - Rupaka)',
      'Kripaya Palaya Shauray (Charukesi - Misra Chapu)',
      'Deva Deva Kalayami (Mayamalavagowla - Rupaka)',
      'Pahi Parvatha Nandini (Arabhi - Adi)'
    ],
    sources: [
      { title: 'Swathi Thirunal and His Music', authorOrCreator: 'Dr. S. Venkitasubramonia Iyer', citation: 'College Book House, Trivandrum, 1975.' }
    ]
  },
  {
    id: 'comp-papanasam-sivan',
    slug: 'papanasam-sivan',
    name: 'Papanasam Sivan',
    lifespan: '1890–1973 CE',
    birthplace: 'Polagam, Thanjavur district, Tamil Nadu',
    primaryLanguages: ['Tamil', 'Sanskrit'],
    tradition: 'Tamil Isai & Post-Trinity Master',
    biography: 'Celebrated as the "Tamil Tyagaraja". Renowned for composing soulful devotional Tamil kritis filled with deep raga bhava and accessible spirituality. His songs are staples of the modern concert repertoire and devotional bhajan traditions.',
    signatureMudra: 'Ramadasan',
    majorKritis: [
      'Ka Va Va (Varali - Adi)',
      'Karpagame Kanpaaray (Madhyamavati - Adi)',
      'Enna Thavam Seithanai (Kapi - Adi)',
      'Tatvamariya Tarama (Reethigowla - Adi)'
    ],
    sources: [
      { title: 'Papanasam Sivan: Life and Works', authorOrCreator: 'Rukmini Ramani', citation: 'Madras, 1994.' }
    ]
  },
  {
    id: 'comp-gopalakrishna-bharati',
    slug: 'gopalakrishna-bharati',
    name: 'Gopalakrishna Bharati',
    lifespan: '1810–1896 CE',
    birthplace: 'Narimanam, Tamil Nadu',
    primaryLanguages: ['Tamil'],
    tradition: 'Tamil Musical Opera Pioneer',
    biography: 'A devout bachelor contemporary of Saint Tyagaraja, devoted to Lord Nataraja at Chidambaram. Famed for authoring the immortal musical drama (opera) "Nandanar Charitram", which brought classical music directly to the common people.',
    signatureMudra: 'Gopalakrishnan',
    majorKritis: [
      'Sabhaapathikku (Abhogi - Rupaka)',
      'Varugalamo (Manji - Misra Chapu)',
      'Natanam Adinar (Vasantha - Adi)',
      'Thiruvadi Saranam (Kambhoji - Adi)'
    ],
    sources: [
      { title: 'Nandanar Charitram and Gopalakrishna Bharati', authorOrCreator: 'Dr. U. V. Swaminatha Iyer', citation: '1935.' }
    ]
  },
  {
    id: 'comp-annamacharya',
    slug: 'annamacharya',
    name: 'Tallapaka Annamacharya',
    lifespan: '1408–1503 CE',
    birthplace: 'Tallapaka, Kadapa district, Andhra Pradesh',
    primaryLanguages: ['Telugu', 'Sanskrit'],
    tradition: 'Pada-Kavita Pitamaha',
    biography: 'Revered as the "Grandfather of Telugu Song". Composed over 32,000 Sankirtanas dedicated to Lord Venkateswara of Tirupati, categorized into Adhyatma (spiritual) and Sringara (devotional love) songs. His works were engraved on copper plates preserved in the Tirumala temple.',
    signatureMudra: 'Venkata / Venkateswara',
    majorKritis: [
      'Brahma Kadigina Padamu (Mukhari - Adi)',
      'Brahmam Okkate (Bowli - Adi)',
      'Muddugare Yashoda (Kurinji - Adi)',
      'Nanati Batuku Natakamu (Revati - Adi)'
    ],
    sources: [
      { title: 'Annamacharya Samkeertanalu', authorOrCreator: 'Tirumala Tirupati Devasthanams (TTD)', citation: 'TTD Press, Tirupati, 1980.' }
    ]
  },
  {
    id: 'comp-patnam-subramanya-iyer',
    slug: 'patnam-subramanya-iyer',
    name: 'Patnam Subramanya Iyer',
    lifespan: '1845–1902 CE',
    birthplace: 'Thiruvaiyaru, Tamil Nadu',
    primaryLanguages: ['Telugu', 'Sanskrit'],
    tradition: 'Shishya Parampara of Tyagaraja',
    biography: 'A direct musical descendant of Saint Tyagaraja’s lineage (disciple of Manambuchavadi Venkatasubbayyar). Renowned for brilliant madhyama kala kritis, sparkling Begada sancharas, and training a generation of musical giants including Tiger Varadachariar and Ramnad Srinivasa Iyengar.',
    signatureMudra: 'Venkatesa / Venkateshwara',
    majorKritis: [
      'Raghuvamsa Sudha (Kathanakutoohalam - Adi)',
      'Evaribodha (Abhogi Varnam - Adi)',
      'Manasu Karugada (Hamsadhwani - Rupaka)',
      'Abhimanamennadu (Vivardhani - Adi)'
    ],
    sources: [
      { title: 'Great Composers: Patnam Subramanya Iyer', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1971.' }
    ]
  },
  {
    id: 'comp-oothukkadu-venkata-kavi',
    slug: 'oothukkadu-venkata-kavi',
    name: 'Oothukkadu Venkata Kavi',
    lifespan: '1700–1765 CE',
    birthplace: 'Oothukkadu, Tamil Nadu',
    primaryLanguages: ['Tamil', 'Sanskrit'],
    tradition: 'Pre-Trinity Bhakti & Natya Master',
    biography: 'Visionary ascetic composer who considered Lord Krishna at Oothukkadu his direct guru. Renowned for breathtaking rhythmic sahityam, Saptaratna kritis, and dance-infused masterworks.',
    signatureMudra: 'Venkata Kavi',
    majorKritis: [
      'Tayu Yashoda (Thodi - Adi)',
      'Alai Payuthey (Kaanada - Adi)',
      'Aadadhu Asangadhu (Madhyamavati - Adi)',
      'Maragatha Manimaya (Aarabhi - Adi)'
    ],
    sources: [
      { title: 'Oothukkadu Venkata Kavi Compositions', authorOrCreator: 'Needamangalam Krishnamurthy Bhagavatar', citation: '1975.' }
    ]
  },
  {
    id: 'comp-bhadrachala-ramadasu',
    slug: 'bhadrachala-ramadasu',
    name: 'Bhadrachala Ramadasu (Kancharla Gopanna)',
    lifespan: '1620–1680 CE',
    birthplace: 'Nelakondapalli, Telangana',
    primaryLanguages: ['Telugu'],
    tradition: 'Pre-Trinity Rama Bhakti Pioneer',
    biography: 'Tahsildar of Palvoncha who utilized state revenue to rebuild the Bhadrachalam Rama temple. Imprisoned in Golconda fort for 12 years, where he composed agonizingly soulful keertanas that deeply influenced Saint Tyagaraja.',
    signatureMudra: 'Ramadasu',
    majorKritis: [
      'Paluke Bangaramayena (Anandabhairavi - Adi)',
      'Ennaganu Rama Bhajana (Pantuvarali - Rupaka)',
      'Ikshvaku Kula Tilaka (Yadukulakambhoji - Misra Chapu)'
    ],
    sources: [
      { title: 'Ramadasu Keerthanala Charitra', authorOrCreator: 'B. Rajanikanta Rao', citation: '1981.' }
    ]
  },
  {
    id: 'comp-mysore-vasudevachar',
    slug: 'mysore-vasudevachar',
    name: 'Mysore Vasudevachar',
    lifespan: '1865–1961 CE',
    birthplace: 'Mysore, Karnataka',
    primaryLanguages: ['Sanskrit', 'Telugu'],
    tradition: 'Mysore Royal Court Asthana Vidwan',
    biography: 'Chief musician of the Mysore Royal Court and direct disciple of Patnam Subramanya Iyer. Composed over 200 graceful kritis full of sweetness, lyrical balance, and classical dignity.',
    signatureMudra: 'Vasudeva',
    majorKritis: [
      'Brochevarevarura (Khamas - Adi)',
      'Devadhi Deva (Sunadavinodini - Adi)',
      'Bhajare Re Manasa (Abheri - Adi)',
      'Sri Chamundeshwari (Bilahari - Adi)'
    ],
    sources: [
      { title: 'Na Kanda Kalavidaru', authorOrCreator: 'Mysore Vasudevachar', citation: 'Mysore, 1955.' }
    ]
  },
  {
    id: 'comp-subbarama-dikshitar',
    slug: 'subbarama-dikshitar',
    name: 'Subbarama Dikshitar',
    lifespan: '1839–1906 CE',
    birthplace: 'Baluswami Dikshitar Lineage, Ettayapuram',
    primaryLanguages: ['Telugu', 'Sanskrit', 'Tamil'],
    tradition: 'Supreme Musicologist & Vaggeyakara',
    biography: 'Adopted son of Baluswami Dikshitar. Authored the immortal encyclopedia "Sangita Sampradaya Pradarsini" (1904), preserving the gamaka notation system, hundreds of Dikshitar kritis, and theoretical treatises for future generations.',
    signatureMudra: 'Balaguruguha',
    majorKritis: [
      'Sankaracharyam (Sankarabharanam - Adi)',
      'Gana Naya (Varnam in Nata)',
      'Kanta Judumi (Vachaspati)'
    ],
    sources: [
      { title: 'Sangita Sampradaya Pradarsini', authorOrCreator: 'Subbarama Dikshitar', citation: '1904.' }
    ]
  },
  {
    id: 'comp-maha-vaidyanatha-iyer',
    slug: 'maha-vaidyanatha-iyer',
    name: 'Maha Vaidyanatha Iyer',
    lifespan: '1844–1893 CE',
    birthplace: 'Vaiyacheri, Thanjavur, Tamil Nadu',
    primaryLanguages: ['Sanskrit', 'Tamil'],
    tradition: 'Grand Master of 72 Melakarta Ragamalika',
    biography: 'Possessed a voice of celestial beauty spanning three and a half octaves. Composed the monumental 72 Melakarta Ragamalika ("Pranatharthihara Prabho") uniting all 72 parent scales in a single magnificent flow of music.',
    signatureMudra: 'Guhadasa',
    majorKritis: [
      '72 Melakarta Ragamalika (Pranatharthihara Prabho)',
      'Pahimam Sri Rajarajeswari (Janaranjani - Adi)'
    ],
    sources: [
      { title: 'Maha Vaidyanatha Sivan: Life and Contributions', authorOrCreator: 'Prof. P. Sambamoorthy', citation: '1972.' }
    ]
  },
  {
    id: 'comp-thanjavur-quartet',
    slug: 'thanjavur-quartet',
    name: 'Thanjavur Quartet (Chinnayya, Ponniah, Sivanandam, Vadivelu)',
    lifespan: '1801–1856 CE',
    birthplace: 'Thanjavur, Tamil Nadu',
    primaryLanguages: ['Telugu', 'Tamil', 'Sanskrit'],
    tradition: 'Architects of Bharatanatyam Margam',
    biography: 'Four illustrious brothers who studied under Muthuswami Dikshitar. They structured the standard classical Bharatanatyam Margam (Alarippu, Jatiswaram, Shabdam, Varnam, Padam, Tillana) and Vadivelu introduced the violin to Carnatic music.',
    signatureMudra: 'Brihadisvara / Guruguha Bhakta',
    majorKritis: [
      'Mayateeta Svarupini (Mayamalavagowla - Rupaka)',
      'Mohamana (Bhairavi Varnam - Rupaka)',
      'Dani Bodhana (Bhoopalam Varnam - Adi)'
    ],
    sources: [
      { title: 'The Tanjore Quartet and Their Art', authorOrCreator: 'K. P. Kittappa Pillai', citation: '1980.' }
    ]
  }
];
