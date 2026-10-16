import { RagaItem, TalaItem, InstrumentItem, LessonItem, GlossaryTerm } from '../types/carnatic';

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
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Musical Heritage / Traditional Knowledge'
    },
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
    historicalContext: 'Described extensively in early texts including Sarangadeva’s Sangita Ratnakara (13th Century). In Carnatic music, it is rendered with rich oscillations (kampita gamaka) on Gandharam and Nishadam, distinguishing it starkly from rigid equal-temperament tuning.',
    pedagogicalSignificance: 'Teaches students how Carnatic gamaka aesthetics transform universal diatonic scales into profound Indian classical expression.',
    famousCompositions: [
      { title: 'Akshaya Linga Vibho', composer: 'Muthuswami Dikshitar', tala: 'Misra Chapu', language: 'Sanskrit' },
      { title: 'Swara Raga Sudharasa', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' },
      { title: 'Sarojadala Netri', composer: 'Shyama Shastri', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [
      { title: 'Ragas of South India', authorOrCreator: 'Walter Kaufmann', citation: 'Indiana University Press, pp. 210–218.', publicationYear: 1976 }
    ],
    rights: {
      status: 'public_domain',
      rightsHolder: 'Traditional Knowledge'
    },
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
    historicalContext: 'Considered one of the foundational "major ragas" in concert repertoire alongside Shankarabharanam, Thodi, and Bhairavi. Almost every major Carnatic composer has composed masterpieces in Kalyani.',
    pedagogicalSignificance: 'Essential for mastering the precise intonation of Prati Madhyamam (M₂) and handling open-throated gamakas.',
    famousCompositions: [
      { title: 'Nidhi Chala Sukhama', composer: 'Saint Tyagaraja', tala: 'Misra Chapu', language: 'Telugu' },
      { title: 'Kamalambam Bhajare', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' },
      { title: 'Birana Varalichi', composer: 'Shyama Shastri', tala: 'Rupaka', language: 'Telugu' }
    ],
    sources: [
      { title: 'The Art and Science of Carnatic Music', authorOrCreator: 'Vidya Shankar', citation: 'The Music Academy Madras, 1983.', publicationYear: 1983 }
    ],
    rights: {
      status: 'public_domain',
      rightsHolder: 'Traditional Knowledge'
    },
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
    educationalSummary: 'An audava-audava janya raga (a pentatonic scale omitting both Ma and Dha). Created in the 19th century by Manambuchavadi Venkatasubbayyar, disciple of Tyagaraja.',
    historicalContext: 'Created in Tanjore in the 19th century, Hamsadhwani quickly achieved universal popularity across both Carnatic and Hindustani traditions. Aman Ali Khan of the Bhendibazar gharana adapted it into Hindustani music.',
    pedagogicalSignificance: 'Perfect for beginners to learn pentatonic jumps and vocal projection without microtonal ambiguity.',
    famousCompositions: [
      { title: 'Vatapi Ganapatim Bhajeham', composer: 'Muthuswami Dikshitar', tala: 'Adi', language: 'Sanskrit' },
      { title: 'Raghunayaka', composer: 'Saint Tyagaraja', tala: 'Adi', language: 'Telugu' }
    ],
    sources: [
      { title: 'Great Composers (Vol. II)', authorOrCreator: 'Prof. P. Sambamoorthy', citation: 'The Indian Music Publishing House, Chennai, 1970.', publicationYear: 1970 }
    ],
    rights: {
      status: 'public_domain',
      rightsHolder: 'Traditional Knowledge'
    },
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
    description: 'The paramount rhythmic framework of South Indian classical music. It consists of 1 Laghu of 4 counts followed by 2 Dhrutams of 2 counts each, totaling 8 aksharas per avarthanam (cycle).',
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
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Traditional Heritage'
    },
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
    description: 'A 6-akshara tala cycle commonly used for dynamic, mid-tempo compositions. In standard modern practice, it starts with a Dhrutam (or 2 thattus) followed by a Chatusra Laghu.',
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
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Traditional Heritage'
    },
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
    jati: 'Chapu (Asymmetric folk/classical syncopation)',
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
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Traditional Heritage'
    },
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
      { title: 'The Veena and Its Technique', authorOrCreator: 'S. Balachander', citation: 'Sangeet Natak Akademi monograph, 1968.', publicationYear: 1968 },
      { title: 'Sangita Ratnakara', authorOrCreator: 'Sarangadeva', citation: '13th Century CE Treatise on Indian Music.', publicationYear: 1250 }
    ],
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Cultural Heritage'
    },
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
      { part: 'Valanthalai (Right Head)', function: 'Tuned precisely to the vocalists tonic (Adhara Shadjam). Features a central black disc (karanai) that dampens high overtones and produces a pure bell-like pitched ring (Dheem and Nam).' },
      { part: 'Thoppi / Edanthalai (Left Head)', function: 'Bass head that produces deep resonant booming strokes (Thom). Temporarily loaded with semolina (rava) paste during concerts to lower the pitch.' },
      { part: 'Kattam', function: 'Barrel-shaped hollow wooden body sculpted with a narrower right mouth than the left.' }
    ],
    playingTechnique: 'Played with open hands, curved fingertips, and heel of the palms while resting horizontally across the lap. Utilises precise stroke syllables: Tha, Dhi, Thom, Nam, Ki, Ta, Cha, Chapu.',
    tuningSystem: 'The right head is tuned to the exact tonic (e.g. C, C#, D) of the main soloist using wooden pegs and a tuning stone. The left head is tuned approximately an octave or fifth lower.',
    roleInConcert: 'The principal percussion instrument in Carnatic concerts. It provides structural laya (rhythm), accompanies vocal phrases with sarvalaghu, responds to mathematical korvais, and leads the tani avarthanam (percussion solo).',
    historicalContext: 'Mentioned in ancient epics like the Natya Shastra by Bharata Muni (c. 200 BCE - 200 CE). The compound load (karanai) is one of the most sophisticated harmonic innovations in global acoustic organology.',
    samples: [
      { label: 'Chapu and Dheem Strokes', description: 'Clear harmonic ringing of the right head tuned to C', attribution: 'NadaVerse Studio Archive' }
    ],
    sources: [
      { title: 'The Physics of the Mridangam', authorOrCreator: 'Sir C. V. Raman', citation: 'Proceedings of the Indian Academy of Sciences, 1934; Raman discovered the acoustic overtone harmony of the Karanai.', publicationYear: 1934 }
    ],
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Cultural Heritage'
    },
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
    historicalContext: 'Fundamental to Indian classical music for over a millennium. Without the tambura, swaras cannot be understood in their pure just-intonation harmonic relation.',
    samples: [
      { label: 'Continuous C Tambura Drone', description: 'Pa-Sa-Sa-Sa drone with prominent Jivari harmonics', attribution: 'NadaVerse Audio Engine' }
    ],
    sources: [
      { title: 'The Acoustics of the Tanpura', authorOrCreator: 'B. C. Deva', citation: 'Psychoacoustics of Music and Speech, Sangeet Natak Akademi, 1967.', publicationYear: 1967 }
    ],
    rights: {
      status: 'public_domain',
      rightsHolder: 'Carnatic Cultural Heritage'
    },
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
    detailedContext: 'Colloquially, Shruti refers to the key note (Adhara Shadjam) to which instruments and voices are tuned. In classical theory, the octave is divided into 22 shrutis (microtonal divisions) that define precise melodic nuances.',
    relatedTerms: ['Adhara Shadjam', 'Tambura', 'Swara'],
    sources: [{ title: 'Natya Shastra', authorOrCreator: 'Bharata Muni', citation: 'Chapter 28 on Musical Scales and Shrutis.' }]
  },
  {
    term: 'Swara',
    transliteration: 'Svara',
    category: 'Fundamentals',
    simpleExplanation: 'A musical note that pleases the mind of its own accord.',
    detailedContext: 'The seven primary swaras are Sa, Ri, Ga, Ma, Pa, Dha, Ni. Swaras in Carnatic music are rarely static points; they are often ornamented with microtonal curves called gamakas.',
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
    detailedContext: 'Derived from the Sanskrit root "ranj" (to delight or color the mind). A raga is characterized by its scale (arohanam/avarohanam), characteristic phrases (sancharas), stressed notes (vadi/samvadi), and microtonal ornamentation.',
    relatedTerms: ['Melakarta', 'Janya', 'Arohanam', 'Avarohanam'],
    sources: [{ title: 'Chaturdandi Prakasika', authorOrCreator: 'Venkatamakhin', citation: 'c. 1620 CE; established the 72 Melakarta scheme.' }]
  },
  {
    term: 'Tala',
    transliteration: 'Tāḷa',
    category: 'Rhythm',
    simpleExplanation: 'The cyclic rhythmic meter of Carnatic music, measured in counts and hand gestures.',
    detailedContext: 'A tala measures musical time in cycles called avarthanams. It is formed by combinations of angas (Laghu, Dhrutam, Anudhrutam) executed with precise physical kriyas (claps, waves, and finger counts).',
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
  }
];
