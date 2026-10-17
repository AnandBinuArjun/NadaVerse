export interface ExerciseItem {
  id: string;
  category: 'sarali' | 'jantai' | 'alankaram';
  number: number;
  title: string;
  titleMl: string;
  raga: string;
  tala: string;
  beatsPerCycle: number;
  summary: string;
  summaryMl: string;
  swarasAscending: string[];
  swarasDescending: string[];
  angaStructure: string;
  practiceNotes: string;
  practiceNotesMl: string;
}

export const CARNATIC_EXERCISES: ExerciseItem[] = [
  // --- SARALI VARISAIS ---
  {
    id: 'sarali-1',
    category: 'sarali',
    number: 1,
    title: 'Sarali Varisai 1 — Primary Scale (Sama Kalam)',
    titleMl: 'സരളിവരിശ 1 — അടിസ്ഥാന ക്രമം (സമ കാലം)',
    raga: 'Mayamalavagowla (15th Melakarta)',
    tala: 'Adi Tala (Chatusra Jaathi Triputa Tala - 8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'The fundamental stepping stone of all Carnatic music training. Purandara Dasa established this exercise to establish absolute pitch placement across the octave.',
    summaryMl: 'കർണ്ണാടക സംഗീതത്തിലെ ആദ്യത്തെ അഭ്യാസ പാഠം. സപ്തസ്വരങ്ങളെ ക്രമമായി ആരോഹണ-അവരോഹണ ക്രമത്തിൽ ഉച്ചരിക്കാൻ ശീലിപ്പിക്കുന്നു.',
    swarasAscending: ['S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'],
    practiceNotes: 'Render in 3 speeds: 1st speed (1 swara/beat = 60-80 BPM), 2nd speed (2 swaras/beat), 3rd speed (4 swaras/beat). Ensure steady pitch without sliding.',
    practiceNotesMl: 'മൂന്ന് കാലങ്ങളിൽ സാധകം ചെയ്യുക: ഒന്നാം കാലം (ഒരു സ്വരം/മാത്ര), രണ്ടാം കാലം (രണ്ട് സ്വരം/മാത്ര), മൂന്നാം കാലം (നാല് സ്വരം/മാത്ര).'
  },
  {
    id: 'sarali-2',
    category: 'sarali',
    number: 2,
    title: 'Sarali Varisai 2 — Two-Note Oscillations',
    titleMl: 'സരളിവരിശ 2 — ദ്വിസ്വര ആവർത്തനം',
    raga: 'Mayamalavagowla',
    tala: 'Adi Tala (8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'Introduces micro-returns to previous notes (S-R-S-R), developing agile finger movement and vocal flexibility.',
    summaryMl: 'തൊട്ടടുത്ത സ്വരങ്ങളിലേക്ക് തിരിച്ചുവരുന്ന രീതി പരിശീലിപ്പിച്ച് നാദസ്വാധീനം വർദ്ധിപ്പിക്കുന്നു.',
    swarasAscending: ['S', 'R₁', 'S', 'R₁', 'S', 'R₁', 'G₃', 'M₁', 'S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'],
    swarasDescending: ['Ṡ', 'N₃', 'Ṡ', 'N₃', 'Ṡ', 'N₃', 'D₁', 'P', 'Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'],
    practiceNotes: 'Focus on pure Shadjam foundation when returning from Rishabham. Keep the tempo strictly metronomic.',
    practiceNotesMl: 'രിഷഭത്തിൽ നിന്ന് ഷഡ്ജത്തിലേക്ക് മടങ്ങുമ്പോൾ ശ്രുതി ശുദ്ധി പ്രത്യേകം ശ്രദ്ധിക്കുക.'
  },
  {
    id: 'sarali-3',
    category: 'sarali',
    number: 3,
    title: 'Sarali Varisai 3 — Three-Note Groupings',
    titleMl: 'സരളിവരിശ 3 — ത്രിസ്വര സംയോജനം',
    raga: 'Mayamalavagowla',
    tala: 'Adi Tala (8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'Exercises three consecutive notes before launching into the full tetrachord phrase (S-R-G-S R-G-S-R).',
    summaryMl: 'മൂന്ന് സ്വരങ്ങളുടെ കൂട്ടങ്ങളിലൂടെ ഗാന്ധാര സ്വരസ്ഥാനത്തിന്റെ ദൃഢത ഉറപ്പുവരുത്തുന്നു.',
    swarasAscending: ['S', 'R₁', 'G₃', 'S', 'R₁', 'G₃', 'S', 'R₁', 'S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'Ṡ', 'N₃', 'D₁', 'Ṡ', 'N₃', 'Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'],
    practiceNotes: 'Observe how Antara Gandhara (G3) shines symmetrically against Kakali Nishada (N3) in the descent.',
    practiceNotesMl: 'അന്തർ ഗാന്ധാരത്തിന്റെയും കാകളി നിഷാദത്തിന്റെയും സ്വരസ്ഥാന കൃത്യത നിരീക്ഷിക്കുക.'
  },
  {
    id: 'sarali-4',
    category: 'sarali',
    number: 4,
    title: 'Sarali Varisai 4 — Tetrachordal Doubling',
    titleMl: 'സരളിവരിശ 4 — പൂർവ്വാംഗ ആവർത്തനം',
    raga: 'Mayamalavagowla',
    tala: 'Adi Tala (8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'Repeats the four Purvanga swaras (S-R-G-M S-R-G-M) before ascending completely to Tara Sa.',
    summaryMl: 'സ രി ഗ മ രണ്ടുതവണ ആവർത്തിച്ച് മധ്യമ സ്വരസ്ഥാനത്തിൽ ഉറച്ചുനിൽക്കാൻ സഹായിക്കുന്നു.',
    swarasAscending: ['S', 'R₁', 'G₃', 'M₁', 'S', 'R₁', 'G₃', 'M₁', 'S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'P', 'Ṡ', 'N₃', 'D₁', 'P', 'Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'],
    practiceNotes: 'Crucial for developing balanced breath support on the vocal track or even finger strokes on Veena/Violin.',
    practiceNotesMl: 'വീണയിലും വായ്പ്പാട്ടിലും ഒരേപോലെ നാദനിയന്ത്രണം ഉറപ്പിക്കാൻ സഹായകമാണ്.'
  },
  {
    id: 'sarali-5',
    category: 'sarali',
    number: 5,
    title: 'Sarali Varisai 5 — Karvai / Elongation on Panchamam',
    titleMl: 'സരളിവരിശ 5 — കാർവൈ (പഞ്ചമ വിശ്രാന്തി)',
    raga: 'Mayamalavagowla',
    tala: 'Adi Tala (8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'Introduces "Karvai" (a sustained note lasting 2 aksharas) on Panchamam (P ,), the unchanging fundamental fifth.',
    summaryMl: 'പഞ്ചമത്തിൽ രണ്ട് മാത്ര നീട്ടിപ്പിടിക്കുന്ന കാർവൈ രീതി ശീലിപ്പിക്കുന്നു.',
    swarasAscending: ['S', 'R₁', 'G₃', 'M₁', 'P', '•', 'S', 'R₁', 'S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'P', 'M₁', '•', 'Ṡ', 'N₃', 'Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'],
    practiceNotes: 'The dot (•) represents Karvai. Hold Panchama without wavering or dropping pitch.',
    practiceNotesMl: 'പഞ്ചമം അചഞ്ചലമായി ശ്രുതിയിൽ ലയിപ്പിച്ച് നിർത്തുക.'
  },

  // --- JANTAI VARISAIS (TWIN NOTES) ---
  {
    id: 'jantai-1',
    category: 'jantai',
    number: 1,
    title: 'Jantai Varisai 1 — Primary Twin Swara Pairs',
    titleMl: 'ജണ്ടവരിശ 1 — ഇരട്ട സ്വര അഭ്യാസം',
    raga: 'Mayamalavagowla',
    tala: 'Adi Tala (8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'The foundational Jantai pattern where every swara is doubled (SS RR GG MM PP DD NN ṠṠ). Teaches the "Sphuritam" gamaka—a forceful second note attack from the note below.',
    summaryMl: 'ഓരോ സ്വരവും ഇരട്ടിപ്പിച്ചു പാടുന്ന രീതി. രണ്ടാമത്തെ സ്വരത്തിൽ സ്ഫുരിത ഗമകം പ്രയോഗിക്കുന്നു.',
    swarasAscending: ['S', 'S', 'R₁', 'R₁', 'G₃', 'G₃', 'M₁', 'M₁', 'P', 'P', 'D₁', 'D₁', 'N₃', 'N₃', 'Ṡ', 'Ṡ'],
    swarasDescending: ['Ṡ', 'Ṡ', 'N₃', 'N₃', 'D₁', 'D₁', 'P', 'P', 'M₁', 'M₁', 'G₃', 'G₃', 'R₁', 'R₁', 'S', 'S'],
    practiceNotes: 'Pronounce the second note with distinct staccato emphasis (Sphurita gamaka) from the chest/navel, not merely repeating weakly.',
    practiceNotesMl: 'രണ്ടാമത്തെ സ്വരം സ്ഫുരിത ഗമകത്തോടെ കൂടുതൽ ബലത്തിൽ ഉച്ചരിക്കുക.'
  },
  {
    id: 'jantai-2',
    category: 'jantai',
    number: 2,
    title: 'Jantai Varisai 2 — Interlocking Twin Sequences',
    titleMl: 'ജണ്ടവരിശ 2 — സംയോജിത ഇരട്ട സ്വരങ്ങൾ',
    raga: 'Mayamalavagowla',
    tala: 'Adi Tala (8 Aksharas)',
    beatsPerCycle: 8,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Dhrutam (2)',
    summary: 'Overlapping twin sequences: SS-RR-GG-MM, RR-GG-MM-PP, GG-MM-PP-DD, creating rich rhythmic drive.',
    summaryMl: 'ഓരോ ഘട്ടത്തിലും തൊട്ടടുത്ത സ്വരങ്ങളിൽ നിന്ന് ഇരട്ട സ്വരങ്ങൾ ആരംഭിച്ച് ക്രമമായി മുന്നേറുന്നു.',
    swarasAscending: ['S', 'S', 'R₁', 'R₁', 'G₃', 'G₃', 'M₁', 'M₁', 'R₁', 'R₁', 'G₃', 'G₃', 'M₁', 'M₁', 'P', 'P'],
    swarasDescending: ['Ṡ', 'Ṡ', 'N₃', 'N₃', 'D₁', 'D₁', 'P', 'P', 'N₃', 'N₃', 'D₁', 'D₁', 'P', 'P', 'M₁', 'M₁'],
    practiceNotes: 'Keep the tempo steady at 72 BPM initially before advancing to higher speeds.',
    practiceNotesMl: 'തുടക്കത്തിൽ 72 BPM വേഗതയിൽ കൃത്യമായ താളത്തിൽ സാധകം ചെയ്യുക.'
  },

  // --- SAPTA TALA ALANKARAMS ---
  {
    id: 'alankaram-dhruva',
    category: 'alankaram',
    number: 1,
    title: 'Alankaram 1 — Chatusra Jaathi Dhruva Tala (14 Aksharas)',
    titleMl: 'അലങ്കാരം 1 — ചതുശ്രജാതി ധ്രുവതാളം (14 മാത്രകൾ)',
    raga: 'Mayamalavagowla',
    tala: 'Dhruva Tala (I₄ O I₄ I₄ = 4 + 2 + 4 + 4 = 14 beats)',
    beatsPerCycle: 14,
    angaStructure: 'Laghu (4) + Dhrutam (2) + Laghu (4) + Laghu (4)',
    summary: 'The longest of the classical Sapta Talas. Consists of 14 aksharas per avarthanam, training the student in sustained rhythmic retention.',
    summaryMl: 'സപ്തതാളങ്ങളിൽ ഏറ്റവും ദൈർഘ്യമേറിയ താളം. 14 അക്ഷരങ്ങൾ അടങ്ങിയ ആവർത്തനം മനസ്സിനെ താളബോധത്തിൽ ഉറപ്പിക്കുന്നു.',
    swarasAscending: ['S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'],
    practiceNotes: 'Count the kriyas: Clap + 3 finger counts (Laghu 4), Clap + Wave (Dhrutam 2), Clap + 3 finger counts (Laghu 4), Clap + 3 finger counts (Laghu 4).',
    practiceNotesMl: 'ക്രിയകൾ: തട്ട് + 3 വിരലുകൾ (ലഘു 4), തട്ട് + വീച്ച് (ധ്രുതം 2), തട്ട് + 3 വിരലുകൾ (ലഘു 4), തട്ട് + 3 വിരലുകൾ (ലഘു 4).'
  },
  {
    id: 'alankaram-rupaka',
    category: 'alankaram',
    number: 2,
    title: 'Alankaram 2 — Chatusra Jaathi Rupaka Tala (6 Aksharas)',
    titleMl: 'അലങ്കാരം 2 — ചതുശ്രജാതി രൂപകതാളം (6 മാത്രകൾ)',
    raga: 'Mayamalavagowla',
    tala: 'Rupaka Tala (O I₄ = 2 + 4 = 6 beats)',
    beatsPerCycle: 6,
    angaStructure: 'Dhrutam (2) + Laghu (4)',
    summary: 'A lively, asymmetrical tala composed of one Dhrutam followed by one Laghu (total 6 beats). Extremely prevalent in Carnatic kritis.',
    summaryMl: 'ധ്രുതവും (2) ചതുശ്ര ലഘുവും (4) ചേർന്ന 6 മാത്രകളുള്ള മനോഹരമായ താളം.',
    swarasAscending: ['S', 'R₁', 'G₃', 'M₁', 'P', 'D₁'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃'],
    practiceNotes: 'Kriyas: Clap + Wave (2), then Clap + 3 finger counts (4).',
    practiceNotesMl: 'ക്രിയകൾ: തട്ട് + വീച്ച് (2), തട്ട് + 3 വിരലുകൾ (4).'
  },
  {
    id: 'alankaram-triputa',
    category: 'alankaram',
    number: 3,
    title: 'Alankaram 3 — Tisra Jaathi Triputa Tala (7 Aksharas)',
    titleMl: 'അലങ്കാരം 3 — തിസ്രജാതി ത്രിപുടതാളം (7 മാത്രകൾ)',
    raga: 'Mayamalavagowla',
    tala: 'Triputa Tala (I₃ O O = 3 + 2 + 2 = 7 beats)',
    beatsPerCycle: 7,
    angaStructure: 'Laghu (3) + Dhrutam (2) + Dhrutam (2)',
    summary: 'Tisra Jaathi Triputa consists of 7 beats (3 + 2 + 2). Note: When the Laghu is Chatusra (4), it becomes Adi Tala (4 + 2 + 2 = 8).',
    summaryMl: 'തിസ്ര ലഘുവും (3) രണ്ട് ധ്രുതങ്ങളും (2+2) ചേർന്ന 7 മാത്രകൾ. ഗീതങ്ങളിൽ സാധാരണയായി ഉപയോഗിക്കുന്നു.',
    swarasAscending: ['S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃'],
    swarasDescending: ['Ṡ', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁'],
    practiceNotes: 'Tisra Laghu count: Clap + Little finger + Ring finger (3 counts), then Clap + Wave (2), Clap + Wave (2).',
    practiceNotesMl: 'ക്രിയകൾ: തട്ട് + ചെറുവിരൽ + മോതിരവിരൽ (3), തട്ട് + വീച്ച് (2), തട്ട് + വീച്ച് (2).'
  }
];
