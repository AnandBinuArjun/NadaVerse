export interface QuizQuestion {
  id: string;
  question: string;
  questionMl: string;
  options: string[];
  optionsMl: string[];
  correctOptionIndex: number;
  explanation: string;
  explanationMl: string;
}

export interface CurriculumLesson {
  id: string;
  slug: string;
  pathwayId: 'vocal' | 'instrumental' | 'laya';
  order: number;
  title: string;
  titleMl: string;
  subtitle: string;
  subtitleMl: string;
  estimatedMinutes: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  skillLevelMl: string;
  prerequisites: string[];
  prerequisitesMl: string[];
  objectives: string[];
  objectivesMl: string[];
  coreTheory: string;
  coreTheoryMl: string;
  practicalExercisePrompt: string;
  practicalExercisePromptMl: string;
  completionCriteria: string;
  completionCriteriaMl: string;
  relatedLessonIds: string[];
  revisionRecommendation: string;
  revisionRecommendationMl: string;
  associatedTool: 'shruti' | 'tala' | 'tuner' | 'exercises';
  citation: { title: string; author: string; year?: number };
  quiz: QuizQuestion[];
}

export interface PathwayDef {
  id: 'vocal' | 'instrumental' | 'laya';
  title: string;
  titleMl: string;
  description: string;
  descriptionMl: string;
  iconName: string;
  totalModules: number;
}

export const PATHWAYS: PathwayDef[] = [
  {
    id: 'vocal',
    title: 'Vocal Foundations (Gāyana Mārga)',
    titleMl: 'ഗായന മാർഗ്ഗം (വായ്പ്പാട്ട് സാധകം)',
    description: 'A comprehensive curriculum from initial Shruti tuning, Sapta Swaras, Sarali, Jantai, Alankarams to Introductory Ragas and Ear Training.',
    descriptionMl: 'ശ്രുതിയിൽ ലയിച്ചു പാടുന്നത് മുതൽ സരളീ-ജണ്ട വരിശകളും അലങ്കാരങ്ങളും രാഗ പരിചയവും വരെയുള്ള ആധികാരിക ക്രമം.',
    iconName: 'Mic',
    totalModules: 8
  },
  {
    id: 'instrumental',
    title: 'Veena & Violin Pathway (Vādya Mārga)',
    titleMl: 'വാദ്യ മാർഗ്ഗം (വീണ & വയലിൻ)',
    description: 'Ergonomic posture, plucking, bowing, swarasthana fret/fingerboard precision, and fundamental string exercises.',
    descriptionMl: 'വീണയിലും വയലിനിലും കൃത്യമായ വിരൽ വിന്യാസങ്ങളും മീട്ടു/ബോയിങ് രീതികളും സ്വായത്തമാക്കുക.',
    iconName: 'Music2',
    totalModules: 2
  },
  {
    id: 'laya',
    title: 'Laya & Rhythm Mastery (Tāla Mārga)',
    titleMl: 'താള മാർഗ്ഗം (ലയ സാധകം)',
    description: 'Master the 3 Angas, the 35 Talas system, 5 Jaathis, Gatis/Nadais, and traditional Solkattu recitation.',
    descriptionMl: 'അംഗങ്ങൾ, 35 താളങ്ങൾ, ഗതികൾ, ചൊല്ല്കെട്ടുകൾ എന്നിവ ആഴത്തിൽ പഠിച്ച് താളബോധം ഉറപ്പിക്കുക.',
    iconName: 'Activity',
    totalModules: 3
  }
];

export const CURRICULUM_LESSONS: CurriculumLesson[] = [
  // --- VOCAL PATHWAY ---
  {
    id: 'vocal-1',
    slug: 'shruti-alignment-voice',
    pathwayId: 'vocal',
    order: 1,
    title: 'Shruti and Pitch Fundamentals',
    titleMl: 'ശ്രുതി ലയവും ശബ്ദ സ്ഥാനവും',
    subtitle: 'Find your comfortable Adhara Shadjam (Sa) without vocal strain.',
    subtitleMl: 'തൊണ്ടയ്ക്ക് ബുദ്ധിമുട്ടില്ലാത്ത കൃത്യമായ ആധാര ഷഡ്ജം കണ്ടെത്തുക.',
    estimatedMinutes: 6,
    skillLevel: 'Beginner',
    skillLevelMl: 'പ്രാരംഭം',
    prerequisites: ['None (Foundational)'],
    prerequisitesMl: ['ഒന്നുമില്ല (പ്രാരംഭ പാഠം)'],
    objectives: [
      'Understand the acoustic and aesthetic function of the Tambura drone',
      'Identify whether your natural tonic is in the male (C/C#) or female (G/G#/A) range',
      'Practice matching your vocal pitch continuously against the Sa and Pa strings'
    ],
    objectivesMl: [
      'തംബുരുവിന്റെ നാദ തത്വവും സംഗീത ധർമ്മവും മനസ്സിലാക്കുക',
      'നിങ്ങളുടെ ശബ്ദത്തിന് അനുയോജ്യമായ കട്ട (Kattai) തിരഞ്ഞെടുക്കുക',
      'സ, പ സ്വരങ്ങളിൽ അചഞ്ചലമായി ശബ്ദം ലയിപ്പിച്ച് പാടുക'
    ],
    coreTheory: 'In Carnatic music, pitch is not absolute in the Western chromatic sense (A=440Hz), but relative to the chosen Adhara Shadjam (Sa). Once chosen, the entire concert or practice session stays locked to that single tonic. Singing off-shruti (Apasvara / Shruti-bheda) is considered the gravest aesthetic fault.',
    coreTheoryMl: 'കർണ്ണാടക സംഗീതത്തിൽ പാട്ടുകാരൻ തിരഞ്ഞെടുക്കുന്ന ആധാര ഷഡ്ജത്തെ (ശ്രുതി) ആശ്രയിച്ചാണ് മറ്റ് എല്ലാ സ്വരങ്ങളും നിശ്ചയിക്കപ്പെടുന്നത്. കച്ചേരിയിലുടനീളം ഈ ശ്രുതി മാറാതെ നിൽക്കുന്നു.',
    practicalExercisePrompt: 'Open the Shruti Companion, select your vocal tonic (e.g. C or G#), and sustain a continuous "Aaaa" sound on Sa for 10 seconds without wobbling.',
    practicalExercisePromptMl: 'ശ്രുതി കമ്പാനിയനിൽ നിങ്ങളുടെ കട്ട തിരഞ്ഞെടുത്ത് 10 സെക്കൻഡ് തുടർച്ചയായി സ-യിൽ സ്വരശുദ്ധിയോടെ ശബ്ദം നിർത്തുക.',
    completionCriteria: 'Sustain fundamental Sa within +/- 10 cents for 10 consecutive seconds using the Tuner Companion.',
    completionCriteriaMl: 'ട്യൂണർ കമ്പാനിയൻ ഉപയോഗിച്ച് 10 സെക്കൻഡ് തുടർച്ചയായി സ കൃത്യമായി പാടുക.',
    relatedLessonIds: ['vocal-2', 'instrumental-1'],
    revisionRecommendation: 'Review Lesson 1 on Adhara Shadjam and practice sustaining tone with the Tanpura drone.',
    revisionRecommendationMl: 'പാഠം 1 വീണ്ടും പരിശോധിച്ച് തംബുരു ശ്രുതിയോടൊപ്പം സ പാടി പരിശീലിക്കുക.',
    associatedTool: 'shruti',
    citation: { title: 'South Indian Music (Book I)', author: 'Prof. P. Sambamoorthy', year: 1960 },
    quiz: [
      {
        id: 'q-vocal-1-1',
        question: 'Which of the following describes the role of Adhara Shadjam in Carnatic music?',
        questionMl: 'കർണ്ണാടക സംഗീതത്തിൽ ആധാര ഷഡ്ജത്തിന്റെ ധർമ്മം എന്താണ്?',
        options: [
          'It is the unchanging reference tonic to which all other swaras are tuned',
          'It changes after every song to create contrast',
          'It is only played during fast tempo compositions',
          'It is played only on the mridangam'
        ],
        optionsMl: [
          'എല്ലാ സ്വരങ്ങളും അളന്നു തിട്ടപ്പെടുത്തുന്ന മാറ്റമില്ലാത്ത ആധാര സ്വരം',
          'ഓരോ ഗാനം കഴിയുമ്പോഴും മാറിക്കൊണ്ടിരിക്കുന്ന ശ്രുതി',
          'വേഗതയുള്ള പാട്ടുകളിൽ മാത്രം ഉപയോഗിക്കുന്ന സ്വരം',
          'മൃദംഗത്തിൽ മാത്രം വായിക്കുന്ന സ്വരം'
        ],
        correctOptionIndex: 0,
        explanation: 'Adhara Shadjam (Sa) is the invariable root note of the entire Carnatic system. All 12 swarasthanas are perceived relative to it.',
        explanationMl: 'ആധാര ഷഡ്ജം (സ) മാറ്റമില്ലാത്ത അടിസ്ഥാന ശ്രുതിയാണ്. എല്ലാ സ്വരങ്ങളും ഇതിനെ അടിസ്ഥാനമാക്കിയാണ് നിലകൊള്ളുന്നത്.'
      }
    ]
  },
  {
    id: 'vocal-2',
    slug: 'sapta-swaras-and-twelve-swarasthanas',
    pathwayId: 'vocal',
    order: 2,
    title: 'The Sapta Swaras & 12 Swarasthanas',
    titleMl: 'സപ്തസ്വരങ്ങളും 12 സ്വരസ്ഥാനങ്ങളും',
    subtitle: 'From 7 fundamental names to the 12 chromatic swarasthanas and 16 names.',
    subtitleMl: 'സപ്തസ്വരങ്ങളിൽ നിന്ന് 12 ശാസ്ത്രീയ സ്വരസ്ഥാനങ്ങളിലേക്കുള്ള ക്രമം.',
    estimatedMinutes: 8,
    skillLevel: 'Beginner',
    skillLevelMl: 'പ്രാരംഭം',
    prerequisites: ['vocal-1 (Shruti Fundamentals)'],
    prerequisitesMl: ['പാഠം 1 (ശ്രുതി ലയം)'],
    objectives: [
      'Name the 7 basic swaras: Sa, Ri, Ga, Ma, Pa, Dha, Ni',
      'Distinguish invariant swaras (Sa, Pa - Achala) from variant swaras (Ri, Ga, Ma, Dha, Ni - Chala)',
      'Locate the 12 Swarasthanas using Just Intonation frequency ratios'
    ],
    objectivesMl: [
      'സ, രി, ഗ, മ, പ, ധ, നി എന്നീ 7 അടിസ്ഥാന സ്വരങ്ങൾ പഠിക്കുക',
      'അചല സ്വരങ്ങളും (സ, പ) ചല സ്വരങ്ങളും തമ്മിലുള്ള വ്യത്യാസം തിരിച്ചറിയുക',
      '12 സ്വരസ്ഥാനങ്ങളുടെ ആവൃത്തി അനുപാതങ്ങൾ മനസ്സിലാക്കുക'
    ],
    coreTheory: 'The 7 basic swara syllables expand into 12 distinct pitch positions (Swarasthanas) within the octave. Sa and Pa are invariant (Achala Swaras). Ma has 2 varieties (Shuddha M1 and Prati M2). Ri, Ga, Dha, and Ni have multiple pitch expressions. In Venkatamakhin\'s 72 Melakarta scheme, these 12 positions are given 16 nominal designations.',
    coreTheoryMl: 'സപ്തസ്വരങ്ങൾ 12 സ്വരസ്ഥാനങ്ങളായി മാറുന്നു. സ-യും പ-യും അചല സ്വരങ്ങളാണ്. മ-യ്ക്ക് രണ്ട് വകഭേദങ്ങളും (ശുദ്ധ മ1, പ്രതി മ2) മറ്റ് സ്വരങ്ങൾക്ക് ഒന്നിൽക്കൂടുതൽ സ്ഥാനങ്ങളുമുണ്ട്.',
    practicalExercisePrompt: 'Open the Tuner Companion and sing S, R1, G3, M1, P, D1, N3, S; observe how the pitch meter identifies each swarasthana.',
    practicalExercisePromptMl: 'ട്യൂണർ കമ്പാനിയൻ തുറന്ന് സ, രി1, ഗ3, മ1, പ, ധ1, നി3, സ പാടുമ്പോൾ ട്യൂണർ ഓരോ സ്വരസ്ഥാനവും കൃത്യമായി കാണിക്കുന്നത് നിരീക്ഷിക്കുക.',
    completionCriteria: 'Identify all 7 swaras and explain the difference between Achala and Chala swaras.',
    completionCriteriaMl: 'അചല സ്വരങ്ങളും ചല സ്വരങ്ങളും തമ്മിലുള്ള വ്യത്യാസം കൃത്യമായി വിശദീകരിക്കുക.',
    relatedLessonIds: ['vocal-1', 'vocal-3'],
    revisionRecommendation: 'Revisit the Swarasthana Visualizer to compare Achala and Chala swara positions.',
    revisionRecommendationMl: 'സ്വരസ്ഥാന വിഷ്വലൈസർ പരിശോധിച്ച് അചല-ചല സ്വരങ്ങളുടെ സ്ഥാനങ്ങൾ ഉറപ്പുവരുത്തുക.',
    associatedTool: 'tuner',
    citation: { title: 'Sangita Ratnakara', author: 'Sarangadeva', year: 1250 },
    quiz: [
      {
        id: 'q-vocal-2-1',
        question: 'Which swaras are known as Achala (invariant) swaras that have no pitch varieties?',
        questionMl: 'യാതൊരു വകഭേദങ്ങളുമില്ലാത്ത അചല സ്വരങ്ങൾ ഏതെല്ലാമാണ്?',
        options: ['Sa and Pa', 'Ri and Ga', 'Ma and Ni', 'Dha and Ni'],
        optionsMl: ['സ-യും പ-യും', 'രി-യും ഗ-യും', 'മ-യും നി-യും', 'ധ-യും നി-യും'],
        correctOptionIndex: 0,
        explanation: 'Shadjam (Sa) and Panchamam (Pa) are Achala swaras; their pitch ratio is mathematically and aesthetically fixed.',
        explanationMl: 'ഷഡ്ജവും പഞ്ചമവും അചല സ്വരങ്ങളാണ്; ഇവയ്ക്ക് വകഭേദങ്ങളില്ല.'
      }
    ]
  },
  {
    id: 'vocal-3',
    slug: 'arohanam-and-avarohanam-architecture',
    pathwayId: 'vocal',
    order: 3,
    title: 'Arohanam & Avarohanam: Scale Architecture',
    titleMl: 'ആരോഹണവും അവരോഹണവും: രാഗഘടന',
    subtitle: 'Ascending and descending pitch pathways that define every Carnatic raga.',
    subtitleMl: 'രാഗങ്ങളുടെ അടിസ്ഥാന ചട്ടക്കൂടായ ആരോഹണ-അവരോഹണ ക്രമം.',
    estimatedMinutes: 7,
    skillLevel: 'Beginner',
    skillLevelMl: 'പ്രാരംഭം',
    prerequisites: ['vocal-2 (Sapta Swaras)'],
    prerequisitesMl: ['പാഠം 2 (സപ്തസ്വരങ്ങൾ)'],
    objectives: [
      'Define Arohanam (ascending melodic ladder) and Avarohanam (descending melodic ladder)',
      'Recognize linear (Krama) vs zigzag (Vakra) movements',
      'Distinguish complete (Sampoorna - 7 notes) from pentatonic/hexatonic (Audava/Shadava) scales'
    ],
    objectivesMl: [
      'ആരോഹണവും അവരോഹണവും നിർവ്വചിക്കുക',
      'ക്രമ-വക്ര സഞ്ചാരങ്ങൾ തമ്മിലുള്ള വ്യത്യാസം മനസ്സിലാക്കുക',
      'സമ്പൂർണ്ണ, ഷാഡവ, ഔഡവ രാഗങ്ങളുടെ സ്വര എണ്ണം തിരിച്ചറിയുക'
    ],
    coreTheory: 'Arohanam is the ascending sequence of notes from Madhya Sa to Tara Sa. Avarohanam is the descending sequence from Tara Sa back to Madhya Sa. Together, they constitute the skeleton (Lakshana) of a raga. When all 7 swaras are present in straight order, it is Sampoorna and Krama. When notes are skipped or zigzagged, Janya ragas are formed.',
    coreTheoryMl: 'മധ്യ ഷഡ്ജത്തിൽ നിന്ന് താര ഷഡ്ജത്തിലേക്കുള്ള കയറ്റമാണ് ആരോഹണം; തിരിച്ച് ഇറങ്ങുന്നത് അവരോഹണം. 7 സ്വരങ്ങളും നേർവഴിയാണെങ്കിൽ സമ്പൂർണ്ണ ക്രമ രാഗവും, ചിലത് ഒഴിവാക്കുകയോ വളയുകയോ ചെയ്താൽ ജന്യ രാഗങ്ങളുമാകുന്നു.',
    practicalExercisePrompt: 'Select Mayamalavagowla and Mohanam in the Knowledge Explorer; compare the 7-note Sampoorna scale with the 5-note Audava scale.',
    practicalExercisePromptMl: 'നോളജ് എക്സ്പ്ലോററിൽ മായാമാളവഗൗളയും മോഹനവും താരതമ്യം ചെയ്ത് സമ്പൂർണ്ണ-ഔഡവ വ്യത്യാസം കേട്ടുനോക്കുക.',
    completionCriteria: 'Explain the difference between Sampoorna, Shadava, and Audava scale structures.',
    completionCriteriaMl: 'സമ്പൂർണ്ണ, ഷാഡവ, ഔഡവ രാഗങ്ങളുടെ ഘടനാ വ്യത്യാസം കൃത്യമായി വ്യക്തമാക്കുക.',
    relatedLessonIds: ['vocal-2', 'vocal-4', 'vocal-7'],
    revisionRecommendation: 'Study the raga profiles in the Carnatic Knowledge Explorer to observe diverse Arohana/Avarohana forms.',
    revisionRecommendationMl: 'നോളജ് എക്സ്പ്ലോററിലെ വിവിധ രാഗങ്ങളുടെ ആരോഹണ-അവരോഹണങ്ങൾ പരിശോധിക്കുക.',
    associatedTool: 'shruti',
    citation: { title: 'Chaturdandi Prakasika', author: 'Venkatamakhin', year: 1620 },
    quiz: [
      {
        id: 'q-vocal-3-1',
        question: 'What is a raga containing 5 swaras in both arohanam and avarohanam called?',
        questionMl: 'ആരോഹണത്തിലും അവരോഹണത്തിലും 5 സ്വരങ്ങൾ വീതമുള്ള രാഗത്തെ എന്ത് വിളിക്കുന്നു?',
        options: ['Audava - Audava raga', 'Sampoorna raga', 'Shadava - Shadava raga', 'Vakra raga'],
        optionsMl: ['ഔഡവ - ഔഡവ രാഗം', 'സമ്പൂർണ്ണ രാഗം', 'ഷാഡവ - ഷാഡവ രാഗം', 'വക്ര രാഗം'],
        correctOptionIndex: 0,
        explanation: 'Audava indicates a 5-note scale (e.g. Mohanam: S R2 G3 P D2 S). 6 notes is Shadava, 7 notes is Sampoorna.',
        explanationMl: '5 സ്വരങ്ങളുള്ള രാഗത്തെ ഔഡവം എന്നും, 6 സ്വരങ്ങളുള്ളതിനെ ഷാഡവം എന്നും, 7 സ്വരങ്ങളുള്ളതിനെ സമ്പൂർണ്ണം എന്നും വിളിക്കുന്നു.'
      }
    ]
  },
  {
    id: 'vocal-4',
    slug: 'sarali-varisais-mayamalavagowla',
    pathwayId: 'vocal',
    order: 4,
    title: 'Sarali Varisais in Mayamalavagowla',
    titleMl: 'മായാമാളവഗൗളയിലെ സരളിവരിശകൾ',
    subtitle: 'Why Saint Purandara Dasa selected the 15th Melakarta for beginners.',
    subtitleMl: 'തുടക്കക്കാർക്കായി പുരന്ദര ദാസർ മായാമാളവഗൗള തിരഞ്ഞെടുത്തതിന്റെ രഹസ്യം.',
    estimatedMinutes: 10,
    skillLevel: 'Beginner',
    skillLevelMl: 'പ്രാരംഭം',
    prerequisites: ['vocal-2 (Sapta Swaras)', 'vocal-3 (Arohanam & Avarohanam)'],
    prerequisitesMl: ['പാഠം 2 (സപ്തസ്വരങ്ങൾ)', 'പാഠം 3 (ആരോഹണ-അവരോഹണം)'],
    objectives: [
      'Learn the symmetrical geometry of Mayamalavagowla (S R1 G3 M1 P D1 N3 S)',
      'Execute Sarali Varisais 1 to 4 with precise intonation',
      'Master rendering exercises in 1st, 2nd, and 3rd speeds (Kalams)'
    ],
    objectivesMl: [
      'മായാമാളവഗൗളയുടെ പൂർവ്വാംഗ-ഉത്തരാംഗ സ്വര സാമ്യം തിരിച്ചറിയുക',
      '1 മുതൽ 4 വരെയുള്ള സരളിവരിശകൾ തെറ്റുകൂടാതെ അഭ്യസിക്കുക',
      'ഒന്നാം കാലം, രണ്ടാം കാലം, മൂന്നാം കാലം എന്നിവയിൽ സാധകം ചെയ്യുക'
    ],
    coreTheory: 'Purandara Dasa (1484–1564 CE) codified the Carnatic learning curriculum in Mayamalavagowla because of the symmetrical interval pairs: S to R1 is a minor semitone, G3 to M1 is a minor semitone; identically in the upper tetrachord, P to D1 is a minor semitone, and N3 to Tara Sa is a minor semitone. This acoustic mirroring prevents ear fatigue in beginners.',
    coreTheoryMl: 'സ-രി, ഗ-മ എന്നിവ തമ്മിലുള്ള സ്വര അകലവും, പ-ധ, നി-സ തമ്മിലുള്ള സ്വര അകലവും തുല്യമായതിനാലാണ് മായാമാളവഗൗള ആദ്യപാഠങ്ങൾക്കായി തിരഞ്ഞെടുത്തത്.',
    practicalExercisePrompt: 'Open the Graded Exercises tab, choose Sarali Varisai 1, and practice in 1st speed (72 BPM) then advance to 2nd speed.',
    practicalExercisePromptMl: 'ഗ്രേഡഡ് എക്സർസൈസ് ടാബിൽ സരളിവരിശ 1 തിരഞ്ഞെടുത്ത് 72 BPM-ൽ മൂന്ന് കാലങ്ങളിൽ പാടി ശീലിക്കുക.',
    completionCriteria: 'Perform Sarali Varisai #1 accurately in Adi Tala through 1st and 2nd speeds.',
    completionCriteriaMl: 'സരളിവരിശ 1 ആദിതാളത്തിൽ ഒന്നാം കാലത്തിലും രണ്ടാം കാലത്തിലും പിഴവില്ലാതെ പാടുക.',
    relatedLessonIds: ['vocal-3', 'vocal-5', 'laya-1'],
    revisionRecommendation: 'Practice Sarali Varisais 1–4 with Graded Exercises player synced to 72 BPM.',
    revisionRecommendationMl: 'ഗ്രേഡഡ് എക്സർസൈസ് പ്ലെയർ ഉപയോഗിച്ച് സരളിവരിശകൾ 72 BPM-ൽ വീണ്ടും സാധകം ചെയ്യുക.',
    associatedTool: 'exercises',
    citation: { title: 'Sangita Sampradaya Pradarsini', author: 'Subbarama Dikshitar', year: 1904 },
    quiz: [
      {
        id: 'q-vocal-4-1',
        question: 'Which Melakarta number is Mayamalavagowla in the 72-Melakarta scheme?',
        questionMl: '72 മേളകർത്താ പദ്ധതിയിൽ മായാമാളവഗൗള എത്രാമത്തെ രാഗമാണ്?',
        options: ['15th Melakarta (Agni Chakra)', '29th Melakarta (Bana Chakra)', '8th Melakarta (Netra Chakra)', '65th Melakarta (Rudra Chakra)'],
        optionsMl: ['15-ാമത് മേളകർത്താ (അഗ്നി ചക്രം)', '29-ാമത് മേളകർത്താ (ബാണ ചക്രം)', '8-ാമത് മേളകർത്താ (നേത്ര ചക്രം)', '65-ാമത് മേളകർത്താ (രുദ്ര ചക്രം)'],
        correctOptionIndex: 0,
        explanation: 'Mayamalavagowla is the 15th Melakarta raga, situated in the 3rd (Agni) Chakra.',
        explanationMl: 'മായാമാളവഗൗള 15-ാമത് മേളകർത്താ രാഗവും അഗ്നി ചക്രത്തിലെ മൂന്നാമത്തെ രാഗവുമാണ്.'
      }
    ]
  },
  {
    id: 'vocal-5',
    slug: 'jantai-varisais-and-sphuritam',
    pathwayId: 'vocal',
    order: 5,
    title: 'Jantai Varisais & Sphuritam Gamaka',
    titleMl: 'ജണ്ടവരിശകളും സ്ഫുരിത ഗമകവും',
    subtitle: 'Developing forceful vocal agility and diaconal note doubling.',
    subtitleMl: 'സ്വരങ്ങളെ ഇരട്ടിപ്പിച്ചു പാടുമ്പോൾ ഉണ്ടാകേണ്ട ഗമക വിശേഷങ്ങൾ.',
    estimatedMinutes: 8,
    skillLevel: 'Intermediate',
    skillLevelMl: 'മധ്യമം',
    prerequisites: ['vocal-4 (Sarali Varisais)'],
    prerequisitesMl: ['പാഠം 4 (സരളിവരിശകൾ)'],
    objectives: [
      'Master the twin-swara pattern (SS RR GG MM...)',
      'Learn the execution of Sphuritam: forceful second-note attack from below',
      'Develop diaphragmatic breath control across octave transitions'
    ],
    objectivesMl: [
      'ഇരട്ട സ്വരങ്ങളുടെ ക്രമം (സസ രിരി ഗഗ മമ...) വശത്താക്കുക',
      'സ്ഫുരിത ഗമകം കൃത്യമായി പ്രയോഗിക്കാൻ ശീലിക്കുക',
      'ശ്വാസനിയന്ത്രണം ഉറപ്പുവരുത്തുക'
    ],
    coreTheory: 'Jantai varisais introduce paired notes. In Carnatic aesthetics, the second swara is not a flat repetition; it is rendered with "Sphuritam" gamaka—a sharp accent that glances from the immediate note below to strike the target swara with resonant brilliance.',
    coreTheoryMl: 'ജണ്ടവരിശയിൽ രണ്ടാമത്തെ സ്വരം വെറുതെ ആവർത്തിക്കുകയല്ല; താഴെയുള്ള സ്വരത്തിൽ നിന്ന് പെട്ടെന്ന് തട്ടി സ്ഫുരിത ഗമകത്തോടെയാണ് പാടുന്നത്.',
    practicalExercisePrompt: 'Practice Jantai Varisai 1 in Graded Exercises with distinct vocal emphasis on the second note of each pair.',
    practicalExercisePromptMl: 'ജണ്ടവരിശ 1 തിരഞ്ഞെടുത്ത് ഓരോ ഇരട്ട സ്വരത്തിലെയും രണ്ടാമത്തെ സ്വരം ബലത്തിൽ സ്ഫുരിതത്തോടെ പാടുക.',
    completionCriteria: 'Execute Jantai Varisai #1 with clear Sphuritam emphasis on the second note of each swara pair.',
    completionCriteriaMl: 'ജണ്ടവരിശ 1-ൽ രണ്ടാമത്തെ സ്വരത്തിൽ സ്ഫുരിതം കൃത്യമായി നൽകി പാടുക.',
    relatedLessonIds: ['vocal-4', 'vocal-6'],
    revisionRecommendation: 'Listen closely to the audio playback in Graded Exercises to emulate the Sphuritam stress.',
    revisionRecommendationMl: 'ഗ്രേഡഡ് എക്സർസൈസ് ഓഡിയോ ശ്രദ്ധയോടെ കേട്ട് സ്ഫുരിതം അനുകരിക്കാൻ ശ്രമിക്കുക.',
    associatedTool: 'exercises',
    citation: { title: 'South Indian Music (Book II)', author: 'Prof. P. Sambamoorthy', year: 1962 },
    quiz: [
      {
        id: 'q-vocal-5-1',
        question: 'What is the characteristic gamaka used on the second note in Jantai Varisais?',
        questionMl: 'ജണ്ടവരിശയിലെ രണ്ടാമത്തെ സ്വരത്തിൽ പ്രയോഗിക്കുന്ന ഗമകം ഏതാണ്?',
        options: ['Sphuritam (sharp accent from below)', 'Kampita (wide oscillation)', 'Jaru (smooth glide)', 'Orikkai (deflection from above)'],
        optionsMl: ['സ്ഫുരിതം (താഴെ നിന്നുള്ള തട്ട്)', 'കംപിതം (ഇളക്കം)', 'ജാരു (വഴുതൽ)', 'ഒരിക്കൈ'],
        correctOptionIndex: 0,
        explanation: 'Sphuritam is the classical gamaka where the second note of a doubled pair is given a crisp, forceful attack from the lower note.',
        explanationMl: 'സ്ഫുരിതം എന്നാൽ ഇരട്ട സ്വരങ്ങളിൽ രണ്ടാമത്തേതിനെ താഴെയുള്ള സ്വരത്തിൽ നിന്ന് തട്ടി പാടുന്ന ഗമകമാണ്.'
      }
    ]
  },
  {
    id: 'vocal-6',
    slug: 'sapta-tala-alankarams',
    pathwayId: 'vocal',
    order: 6,
    title: 'Sapta Tala Alankarams: Rhythmic Swara Geometries',
    titleMl: 'സപ്തതാള അലങ്കാരങ്ങൾ: താള സ്വര വിന്യാസം',
    subtitle: 'Rehearsing swara patterns across Dhruva, Matya, Rupaka, Jhampa, Triputa, Ata, and Eka talas.',
    subtitleMl: 'ഏഴ് പ്രധാന താളങ്ങളിൽ സ്വര വിന്യാസങ്ങൾ പരീക്ഷിച്ച് ലയശുദ്ധി കൈവരിക്കുക.',
    estimatedMinutes: 12,
    skillLevel: 'Intermediate',
    skillLevelMl: 'മധ്യമം',
    prerequisites: ['vocal-4 (Sarali Varisais)', 'laya-1 (Core Angas)'],
    prerequisitesMl: ['പാഠം 4 (സരളിവരിശകൾ)', 'പാഠം 9 (താളാംഗങ്ങൾ)'],
    objectives: [
      'Understand how swara groupings map directly to Laghu and Dhrutam counts',
      'Execute Dhruva Tala (I4 O I4 I4 = 14 beats), Rupaka Tala (O I4 = 6 beats), and Triputa Tala Alankarams',
      'Maintain strict tala alignment without speeding up during descent'
    ],
    objectivesMl: [
      'സ്വരക്കൂട്ടങ്ങൾ ലഘു-ധ്രുത മാത്രകളിലേക്ക് ക്രമീകരിക്കപ്പെടുന്നത് മനസ്സിലാക്കുക',
      'ധ്രുവ താളം (14 മാത്ര), രൂപക താളം (6 മാത്ര), ത്രിപുട താളം എന്നിവയിലെ അലങ്കാരങ്ങൾ അഭ്യസിക്കുക',
      'അവരോഹണത്തിൽ വേഗത കൂടാതെ താളത്തിൽ ഉറച്ചുനിൽക്കുക'
    ],
    coreTheory: 'Alankarams are ornamental exercises designed by Purandara Dasa to establish unbreakable synchronization between swara articulation and tala kriyas. Each Alankaram is composed in one of the 7 Suladi Talas. The swara phrase length corresponds precisely to the beat structure of the tala.',
    coreTheoryMl: 'സപ്തതാള അലങ്കാരങ്ങൾ സ്വരവും താളവും തമ്മിലുള്ള ഇഴയടുപ്പം ഉറപ്പിക്കാൻ ചിട്ടപ്പെടുത്തിയവയാണ്. ഓരോ അലങ്കാരത്തിലെയും സ്വരക്കൂട്ടങ്ങൾ അതാത് താളത്തിന്റെ അക്ഷരങ്ങൾക്ക് തുല്യമായിരിക്കും.',
    practicalExercisePrompt: 'Open Graded Exercises, select Rupaka Tala Alankaram (SR | GR | SR | GM ||), and recite in sync with the Tala Studio metronome.',
    practicalExercisePromptMl: 'ഗ്രേഡഡ് എക്സർസൈസിൽ രൂപകതാള അലങ്കാരം തിരഞ്ഞെടുത്ത് താള സ്റ്റുഡിയോയോടൊപ്പം കൈകൊട്ടി പാടി പരിശീലിക്കുക.',
    completionCriteria: 'Sing Rupaka Tala and Triputa Tala Alankarams in 1st and 2nd Kalam with correct hand kriyas.',
    completionCriteriaMl: 'രൂപക, ത്രിപുട താള അലങ്കാരങ്ങൾ കൃത്യമായ കൈമുദ്രകളോടെ രണ്ട് കാലങ്ങളിൽ പാടുക.',
    relatedLessonIds: ['vocal-5', 'laya-2'],
    revisionRecommendation: 'Revisit Lesson 9 on Tala Angas to ensure that Laghus and Dhrutams are timed with precision.',
    revisionRecommendationMl: 'താളാംഗങ്ങൾ സംബന്ധിച്ച പാഠം 9 വീണ്ടും പരിശോധിച്ച് ലഘു-ധ്രുത കൃത്യത ഉറപ്പാക്കുക.',
    associatedTool: 'exercises',
    citation: { title: 'South Indian Music (Book II)', author: 'Prof. P. Sambamoorthy', year: 1962 },
    quiz: [
      {
        id: 'q-vocal-6-1',
        question: 'How many total aksharas are in Chatusra Jaathi Rupaka Tala (O I4)?',
        questionMl: 'ചതുശ്രജാതി രൂപകതാളത്തിൽ (O I4) ആകെ എത്ര അക്ഷരങ്ങളുണ്ട്?',
        options: ['6 aksharas (Dhrutam 2 + Laghu 4)', '8 aksharas', '14 aksharas', '7 aksharas'],
        optionsMl: ['6 അക്ഷരങ്ങൾ (ധ്രുതം 2 + ലഘു 4)', '8 അക്ഷരങ്ങൾ', '14 അക്ഷരങ്ങൾ', '7 അക്ഷരങ്ങൾ'],
        correctOptionIndex: 0,
        explanation: 'Rupaka Tala consists of one Dhrutam (2) and one Laghu of 4 counts, totaling 2 + 4 = 6 aksharas.',
        explanationMl: 'രൂപക താളം ഒരു ധ്രുതവും (2) ഒരു ചതുശ്ര ലഘുവും (4) ചേർന്ന് 6 അക്ഷരങ്ങളാകുന്നു.'
      }
    ]
  },
  {
    id: 'vocal-7',
    slug: 'introductory-ragas-mohanam-and-kalyani',
    pathwayId: 'vocal',
    order: 7,
    title: 'Introductory Ragas: Mohanam & Kalyani',
    titleMl: 'ആദ്യകാല രാഗങ്ങൾ: മോഹനവും കല്യാണിയും',
    subtitle: 'Exploring the sweet pentatonic Mohanam and majestic Prati Madhyama Kalyani.',
    subtitleMl: 'മനോഹരമായ മോഹന രാഗത്തിന്റെയും ഗാംഭീര്യമുള്ള കല്യാണി രാഗത്തിന്റെയും സൗന്ദര്യം.',
    estimatedMinutes: 10,
    skillLevel: 'Intermediate',
    skillLevelMl: 'മധ്യമം',
    prerequisites: ['vocal-3 (Arohanam & Avarohanam)'],
    prerequisitesMl: ['പാഠം 3 (ആരോഹണ-അവരോഹണം)'],
    objectives: [
      'Learn the scale of Mohanam (S R2 G3 P D2 S - 28th Janya) and Mechakalyani (65th Melakarta)',
      'Recognize the distinct aesthetic difference between Shuddha Ma (M1) and Prati Ma (M2)',
      'Sing a simple Geetham phrase: "Vara Veena Mridu Pani" in Mohanam'
    ],
    objectivesMl: [
      'മോഹനത്തിന്റെയും (സ രി2 ഗ3 പ ധ2 സ) കല്യാണിയുടെയും (സ രി2 ഗ3 മ2 പ ധ2 നി3 സ) സ്വരങ്ങൾ പഠിക്കുക',
      'ശുദ്ധ മധ്യമവും പ്രതി മധ്യമവും തമ്മിലുള്ള കേൾവി വ്യത്യാസം തിരിച്ചറിയുക',
      'മോഹനത്തിലെ "വരവീണാ മൃദുപാണി" എന്ന ഗീതത്തിന്റെ ഭാഗങ്ങൾ പാടി നോക്കുക'
    ],
    coreTheory: 'Mohanam is a universal pentatonic scale (Audava-Audava) omitting Ma and Ni, deriving from the 28th Melakarta Harikambhoji. Its absence of half-steps produces an inherently peaceful, auspicious mood (Shanta / Karuna). Conversely, Mechakalyani (65th Melakarta) introduces Prati Madhyamam (M2) and Kakali Nishadam (N3), creating expansive brilliance.',
    coreTheoryMl: 'മോഹനം മ-യും നി-യും ഒഴിവാക്കിയ ഔഡവ രാഗമാണ്. ഇതിലെ സ്വരങ്ങൾ ശാന്തമായ ഭാവം പ്രദാനം ചെയ്യുന്നു. എന്നാൽ കല്യാണി പ്രതി മധ്യമത്തോടുകൂടിയ ഗംഭീര രാഗമാണ്.',
    practicalExercisePrompt: 'Open the Knowledge Explorer, play the scale for Mohanam, then play Kalyani; notice how the sharp Prati Madhyamam elevates the tonal energy.',
    practicalExercisePromptMl: 'നോളജ് എക്സ്പ്ലോററിൽ മോഹനത്തിന്റെയും കല്യാണിയുടെയും സ്വരങ്ങൾ മാറിമാറി കേട്ട് പ്രതി മധ്യമത്തിന്റെ വ്യത്യാസം അനുഭവിക്കുക.',
    completionCriteria: 'Correctly sing the Arohanam and Avarohanam of Mohanam and identify its missing swaras.',
    completionCriteriaMl: 'മോഹനത്തിന്റെ ആരോഹണ-അവരോഹണങ്ങൾ പാടുകയും അതിൽ ഇല്ലാത്ത സ്വരങ്ങൾ പറയുകയും ചെയ്യുക.',
    relatedLessonIds: ['vocal-3', 'vocal-8'],
    revisionRecommendation: 'Compare Mohanam and Kalyani in the Raga Card tool to inspect their treatise citations.',
    revisionRecommendationMl: 'രാഗ കാർഡ് ടൂളിൽ മോഹനവും കല്യാണിയും പരിശോധിച്ച് അവയുടെ സ്വരസ്ഥാനങ്ങൾ കാണുക.',
    associatedTool: 'shruti',
    citation: { title: 'Ragas of South India', author: 'Walter Kaufmann', year: 1976 },
    quiz: [
      {
        id: 'q-vocal-7-1',
        question: 'Which two swaras are completely absent (Varjya) in Mohana raga?',
        questionMl: 'മോഹന രാഗത്തിൽ പൂർണ്ണമായും ഒഴിവാക്കപ്പെട്ടിരിക്കുന്ന (വർജ്ജ്യ) രണ്ട് സ്വരങ്ങൾ ഏതെല്ലാമാണ്?',
        options: ['Madhyamam and Nishadam', 'Rishabham and Dhaivatam', 'Gandharam and Panchamam', 'Shadjam and Nishadam'],
        optionsMl: ['മധ്യമവും നിഷാദവും', 'രിഷഭവും ധൈവതവും', 'ഗാന്ധാരവും പഞ്ചമവും', 'ഷഡ്ജവും നിഷാദവും'],
        correctOptionIndex: 0,
        explanation: 'Mohanam is S R2 G3 P D2 S / S D2 P G3 R2 S; both Madhyamam (Ma) and Nishadam (Ni) are absent.',
        explanationMl: 'മോഹനത്തിൽ മധ്യമവും നിഷാദവും ഇല്ല (സ രി2 ഗ3 പ ധ2 സ).'
      }
    ]
  },
  {
    id: 'vocal-8',
    slug: 'ear-training-swara-recognition',
    pathwayId: 'vocal',
    order: 8,
    title: 'Ear Training: Swara Identification & Listening',
    titleMl: 'ശ്രവണ സാധകം: സ്വര തിരിച്ചറിവും കേൾവിയും',
    subtitle: 'Training the ear to recognize interval distances and swarasthana placement.',
    subtitleMl: 'സ്വരങ്ങളുടെ സ്ഥാനവും അവ തമ്മിലുള്ള അകലവും കേട്ടു തിരിച്ചറിയാനുള്ള പരിശീലനം.',
    estimatedMinutes: 10,
    skillLevel: 'Advanced',
    skillLevelMl: 'ഉന്നതം',
    prerequisites: ['vocal-2 (Sapta Swaras)', 'vocal-7 (Introductory Ragas)'],
    prerequisitesMl: ['പാഠം 2 (സപ്തസ്വരങ്ങൾ)', 'പാഠം 7 (രാഗങ്ങൾ)'],
    objectives: [
      'Identify whether a played note is Tara Sa, Panchama, or Shuddha Madhyama relative to the drone',
      'Distinguish Shuddha Rishabham (R1, close to Sa) from Chatushruti Rishabham (R2, wider interval)',
      'Recognize note transitions without visual screen assistance'
    ],
    objectivesMl: [
      'തംബുരുവിനോടൊപ്പം കേൾക്കുന്ന സ്വരം സ-യോ, പ-യോ, മ-യോ എന്ന് തിരിച്ചറിയുക',
      'ശുദ്ധ രിഷഭവും (രി1) ചതുശ്രുതി രിഷഭവും (രി2) തമ്മിലുള്ള കേൾവി വ്യത്യാസം തിരിച്ചറിയുക',
      'സ്ക്രീനിൽ നോക്കാതെ സ്വരങ്ങൾ തിരിച്ചറിയാൻ സാധിക്കുക'
    ],
    coreTheory: 'Internalizing swarasthanas requires cultivating "Svara Jnana" (intuitive pitch awareness). In Carnatic music, the ear is trained not by absolute pitch memory, but by resonance distance from the Adhara Shadjam. Consonant intervals like Panchama (Samvadi - 3:2 ratio) vibrate with pure mathematical stillness against the drone.',
    coreTheoryMl: 'സ്വരജ്ഞാനം എന്നത് ശ്രുതിയുമായുള്ള സ്വരത്തിന്റെ അകലം തിരിച്ചറിയലാണ്. സംവാദിയായ പഞ്ചമം ശ്രുതിയോട് ചേരുമ്പോൾ ഉണ്ടാകുന്ന സ്വസ്ഥത തിരിച്ചറിയുന്നത് ഇതിൽ പ്രധാനമാണ്.',
    practicalExercisePrompt: 'Close your eyes, play random swaras in the Swarasthana Visualizer, and hum the pitch before verifying its symbol on screen.',
    practicalExercisePromptMl: 'കണ്ണുകൾ അടച്ച് സ്വരസ്ഥാന വിഷ്വലൈസറിൽ നിന്നും സ്വരങ്ങൾ കേട്ട് അത് ഏതാണെന്ന് ഊഹിച്ചു പാടുക.',
    completionCriteria: 'Accurately distinguish between R1 and R2 across 5 test audio auditions.',
    completionCriteriaMl: 'രി1, രി2 എന്നിവയുടെ കേൾവി വ്യത്യാസം 5 തവണ കൃത്യമായി കണ്ടെത്തുക.',
    relatedLessonIds: ['vocal-2', 'vocal-7'],
    revisionRecommendation: 'Use the Swarasthana Visualizer with audio enabled to drill interval identification.',
    revisionRecommendationMl: 'സ്വരസ്ഥാന വിഷ്വലൈസർ ഉപയോഗിച്ച് ആവൃത്തി അനുപാതങ്ങൾ നിരന്തരം കേട്ടുപഠിക്കുക.',
    associatedTool: 'tuner',
    citation: { title: 'Psychology of Music and Carnatic Gamaka', author: 'Dr. T. V. Sairam', year: 2004 },
    quiz: [
      {
        id: 'q-vocal-8-1',
        question: 'Which swara shares the most powerful consonance (Samvadi relationship) with Shadjam (Sa)?',
        questionMl: 'ഷഡ്ജവുമായി ഏറ്റവും ശക്തമായ സംവാദി ബന്ധമുള്ള സ്വരം ഏതാണ്?',
        options: ['Panchamam (Pa - 3:2 frequency ratio)', 'Shuddha Rishabham (R1)', 'Prati Madhyamam (M2)', 'Kaisiki Nishadam (N2)'],
        optionsMl: ['പഞ്ചമം (പ - 3:2 അനുപാതം)', 'ശുദ്ധ രിഷഭം (രി1)', 'പ്രതി മധ്യമം (മ2)', 'കൈശികി നിഷാദം (നി2)'],
        correctOptionIndex: 0,
        explanation: 'Panchama (Pa) forms a perfect fifth (3:2 ratio) with Sa, creating the fundamental Samvadi harmonic axis of Indian music.',
        explanationMl: 'പഞ്ചമം ഷഡ്ജവുമായി 3:2 എന്ന കൃത്യമായ സംവാദി അനുപാതം പങ്കിടുന്നു.'
      }
    ]
  },

  // --- LAYA & RHYTHM PATHWAY ---
  {
    id: 'laya-1',
    slug: 'the-three-angas',
    pathwayId: 'laya',
    order: 1,
    title: 'The Core Angas of Carnatic Tala',
    titleMl: 'കർണ്ണാടക താളത്തിലെ മൂന്ന് പ്രധാന അംഗങ്ങൾ',
    subtitle: 'Understanding Laghu, Dhrutam, and Anudhrutam.',
    subtitleMl: 'ലഘു, ധ്രുതം, അനുധ്രുതം എന്നിവയുടെ ശാസ്ത്രീയ ഘടന.',
    estimatedMinutes: 7,
    skillLevel: 'Beginner',
    skillLevelMl: 'പ്രാരംഭം',
    prerequisites: ['None (Foundational)'],
    prerequisitesMl: ['ഒന്നുമില്ല (പ്രാരംഭ പാഠം)'],
    objectives: [
      'Learn the symbol and kriya for Laghu (I), Dhrutam (O), and Anudhrutam (U)',
      'Understand how Laghu duration changes across the 5 Jaathis (3, 4, 5, 7, 9)',
      'Perform hand kriyas in sync with the Tala Studio'
    ],
    objectivesMl: [
      'ലഘു (I), ധ്രുതം (O), അനുധ്രുതം (U) എന്നിവയുടെ ക്രിയകൾ മനസ്സിലാക്കുക',
      '5 ജാതികൾക്കനുസരിച്ച് ലഘുവിന്റെ മാത്രകൾ മാറുന്നത് പഠിക്കുക',
      'താള സ്റ്റുഡിയോയോടൊപ്പം കൈകൊട്ടി താളം പിടിക്കുക'
    ],
    coreTheory: 'Every Carnatic tala is constructed from combinations of 6 potential Angas (Shadangas), of which three are in universal daily use: Anudhrutam (U = 1 beat, clap), Dhrutam (O = 2 beats, clap + wave), and Laghu (I = variable beats, clap + finger counts). While Dhrutam and Anudhrutam never change size, Laghu takes the value of the Jaathi: Tisra (3), Chatusra (4), Khanda (5), Misra (7), or Sankeerna (9).',
    coreTheoryMl: 'സപ്തതാളങ്ങൾ പ്രധാനമായും മൂന്ന് അംഗങ്ങൾ ചേർന്നാണ് നിർമ്മിച്ചിരിക്കുന്നത്: അനുധ്രുതം (1 മാത്ര), ധ്രുതം (2 മാത്ര), ലഘു (ജാതിക്കനുസരിച്ച് 3, 4, 5, 7, 9 മാത്രകൾ).',
    practicalExercisePrompt: 'Open the Tala Studio, select Adi Tala, and observe how Beat 1-4 is Laghu (Clap + 3 fingers), followed by two Dhrutams (Clap + Wave).',
    practicalExercisePromptMl: 'താള സ്റ്റുഡിയോയിൽ ആദിതാളം തിരഞ്ഞെടുത്ത് ലഘുവും രണ്ട് ധ്രുതങ്ങളും അടങ്ങിയ ക്രിയകൾ നിരീക്ഷിക്കുക.',
    completionCriteria: 'Accurately demonstrate the hand kriyas for Anudhrutam, Dhrutam, and Chatusra Laghu.',
    completionCriteriaMl: 'അനുധ്രുതം, ധ്രുതം, ചതുശ്ര ലഘു എന്നിവയുടെ കൈമുദ്രകൾ പിഴവില്ലാതെ ചെയ്തു കാണിക്കുക.',
    relatedLessonIds: ['laya-2', 'vocal-4'],
    revisionRecommendation: 'Practice clapping along with the Tala Studio metronome in Adi Tala at 72 BPM.',
    revisionRecommendationMl: 'താള സ്റ്റുഡിയോയിൽ ആദിതാളത്തോടൊപ്പം 72 BPM-ൽ താളം പിടിച്ചു ശീലിക്കുക.',
    associatedTool: 'tala',
    citation: { title: 'The Splendour of South Indian Music', author: 'P. T. Chelladurai', year: 1991 },
    quiz: [
      {
        id: 'q-laya-1-1',
        question: 'What is the duration of a Dhrutam (O)?',
        questionMl: 'ഒരു ധ്രുതത്തിന്റെ (O) മാത്ര എത്രയാണ്?',
        options: ['Always 2 aksharas (Clap + Wave)', '4 aksharas', 'Variable depending on Jaathi', '1 akshara'],
        optionsMl: ['എപ്പോഴും 2 മാത്രകൾ (തട്ട് + വീച്ച്)', '4 മാത്രകൾ', 'ജാതിക്കനുസരിച്ച് മാറുന്നു', '1 മാത്ര'],
        correctOptionIndex: 0,
        explanation: 'A Dhrutam is invariant in duration: always 2 aksharas executed as a clap followed by an upturned wave (Veechu).',
        explanationMl: 'ധ്രുതം എപ്പോഴും 2 മാത്രകളാണ് (ഒരു തട്ടും ഒരു വീച്ചും).'
      }
    ]
  },
  {
    id: 'laya-2',
    slug: 'the-35-talas-system',
    pathwayId: 'laya',
    order: 2,
    title: 'The 35 Talas Matrix & Five Jaathis',
    titleMl: '35 താളങ്ങളുടെ ശാസ്ത്രീയ ഘടന',
    subtitle: '7 Principal Talas multiplied by 5 Jaathis.',
    subtitleMl: '7 സപ്തതാളങ്ങളെ 5 ജാതികൾ കൊണ്ട് ഗുണിച്ചുണ്ടാകുന്ന 35 താളങ്ങൾ.',
    estimatedMinutes: 9,
    skillLevel: 'Intermediate',
    skillLevelMl: 'മധ്യമം',
    prerequisites: ['laya-1 (Core Angas)'],
    prerequisitesMl: ['പാഠം 9 (താളാംഗങ്ങൾ)'],
    objectives: [
      'Memorize the mnemonic for the 7 Talas: Dhruva, Matya, Rupaka, Jhampa, Triputa, Ata, Eka',
      'Calculate the total aksharas for any Tala-Jaathi permutation',
      'Understand why Chatusra Jaathi Triputa Tala is universally called Adi Tala'
    ],
    objectivesMl: [
      'സപ്തതാളങ്ങൾ ഹൃദിസ്ഥമാക്കുക: ധ്രുവ, മത്യ, രൂപക, ഝമ്പ, ത്രിപുട, അട, ഏക',
      'ഏതൊരു താളത്തിന്റെയും മൊത്തം അക്ഷരങ്ങൾ കണക്കുകൂട്ടാൻ പഠിക്കുക',
      'ചതുശ്രജാതി ത്രിപുടതാളം എന്തുകൊണ്ടാണ് ആദിതാളം എന്നറിയപ്പെടുന്നത് എന്ന് മനസ്സിലാക്കുക'
    ],
    coreTheory: 'The 7 principal talas (Sapta Talas) are: Dhruva (I O I I), Matya (I O I), Rupaka (O I), Jhampa (I U O), Triputa (I O O), Ata (I I O O), and Eka (I). Because each contains at least one Laghu (I), changing the Jaathi among the 5 varieties yields exactly 7 × 5 = 35 classical Talas.',
    coreTheoryMl: 'സപ്തതാളങ്ങളിൽ ഓരോന്നിലും ലഘു ഉള്ളതിനാൽ, 5 ജാതികൾ പ്രയോഗിക്കുമ്പോൾ 7 × 5 = 35 താളങ്ങൾ ലഭിക്കുന്നു.',
    practicalExercisePrompt: 'Calculate the beats of Khanda Jaathi Ata Tala (I₅ I₅ O O = 5 + 5 + 2 + 2 = 14 beats), and listen to it in Tala Studio.',
    practicalExercisePromptMl: 'ഖണ്ഡജാതി അടതാളത്തിന്റെ അക്ഷരങ്ങൾ (5 + 5 + 2 + 2 = 14) കണക്കുകൂട്ടി താള സ്റ്റുഡിയോയിൽ കേട്ടുനോക്കുക.',
    completionCriteria: 'Calculate total aksharas for Matya, Rupaka, and Jhampa across Tisra and Khanda jatis.',
    completionCriteriaMl: 'മത്യ, രൂപക, ഝമ്പ താളങ്ങളുടെ അക്ഷരങ്ങൾ തിസ്ര-ഖണ്ഡ ജാതികളിൽ കണക്കാക്കുക.',
    relatedLessonIds: ['laya-1', 'laya-3', 'vocal-6'],
    revisionRecommendation: 'Review the 35 Talas table in the Tala Studio to memorize the 7 fundamental anga formulas.',
    revisionRecommendationMl: 'താള സ്റ്റുഡിയോയിലെ സപ്തതാള പട്ടിക പരിശോധിച്ച് അംഗങ്ങളുടെ ക്രമം ഉറപ്പാക്കുക.',
    associatedTool: 'tala',
    citation: { title: 'Tala Sangraha', author: 'Madras Music Academy', year: 1985 },
    quiz: [
      {
        id: 'q-laya-2-1',
        question: 'Which Jaathi applied to Triputa Tala (I O O) forms Adi Tala (8 beats)?',
        questionMl: 'ത്രിപുടതാളത്തിൽ (I O O) ഏത് ജാതി ചേരുമ്പോഴാണ് 8 അക്ഷരങ്ങളുള്ള ആദിതാളം ഉണ്ടാകുന്നത്?',
        options: ['Chatusra Jaathi (I = 4)', 'Tisra Jaathi (I = 3)', 'Khanda Jaathi (I = 5)', 'Misra Jaathi (I = 7)'],
        optionsMl: ['ചതുശ്ര ജാതി (ലഘു = 4)', 'തിസ്ര ജാതി (ലഘു = 3)', 'ഖണ്ഡ ജാതി (ലഘു = 5)', 'മിശ്ര ജാതി (ലഘു = 7)'],
        correctOptionIndex: 0,
        explanation: 'Chatusra Jaathi Triputa Tala has Laghu 4 + Dhrutam 2 + Dhrutam 2 = 8 aksharas, which is the definition of Adi Tala.',
        explanationMl: 'ചതുശ്ര ലഘു (4) + രണ്ട് ധ്രുതങ്ങൾ (2+2) ചേരുമ്പോൾ 8 അക്ഷരങ്ങളുള്ള ആദിതാളമാകുന്നു.'
      }
    ]
  },
  {
    id: 'laya-3',
    slug: 'nadai-gati-subdivisions',
    pathwayId: 'laya',
    order: 3,
    title: 'Nadai / Gati Subdivisions & Speed Modulation',
    titleMl: 'നട / ഗതി വകഭേദങ്ങളും കാലപ്രമാണവും',
    subtitle: 'Rhythmic sub-divisions per beat: Chatusra (4), Tisra (3), Khanda (5), and Misra (7).',
    subtitleMl: 'ഓരോ അക്ഷരത്തെയും 4, 3, 5, 7 മാത്രകളായി വിഭജിച്ചു പാടുന്ന ലയ സാധകം.',
    estimatedMinutes: 11,
    skillLevel: 'Advanced',
    skillLevelMl: 'ഉന്നതം',
    prerequisites: ['laya-2 (35 Talas)'],
    prerequisitesMl: ['പാഠം 10 (35 താളങ്ങൾ)'],
    objectives: [
      'Differentiate Jaathi (internal size of the Laghu) from Gati/Nadai (subdivision of every akshara)',
      'Recite solkattu syllables in Tisra Nadai (Tha-Ki-Ta) and Chatusra Nadai (Tha-Ka-Dhi-Mi)',
      'Shift seamlessly from 1st Kalam (1 note) to 2nd Kalam (2 notes) and 3rd Kalam (4 notes)'
    ],
    objectivesMl: [
      'ജാതിയും ഗതിയും തമ്മിലുള്ള അടിസ്ഥാന വ്യത്യാസം മനസ്സിലാക്കുക',
      'തിസ്ര നടയിലും (ത-കി-ട) ചതുശ്ര നടയിലും (ത-ക-ധി-മി) ചൊല്ല്കെട്ടുകൾ ചൊല്ലുക',
      'ഒന്നാം കാലത്തിൽ നിന്ന് രണ്ടാം കാലത്തിലേക്കും മൂന്നാം കാലത്തിലേക്കും തെറ്റാതെ മാറുക'
    ],
    coreTheory: 'While Jaathi alters the count of the Laghu within the tala cycle, Nadai (or Gati) subdivides each individual beat into internal pulses. The universal default is Chatusra Nadai (4 matras per beat: Tha-Ka-Dhi-Mi). Shifting to Tisra Nadai (3 matras: Tha-Ki-Ta) or Khanda Nadai (5 matras: Tha-Ka-Tha-Ki-Ta) produces polymetric tension without changing the overarching tempo.',
    coreTheoryMl: 'ജാതി ലഘുവിന്റെ മാത്രകളെ നിർണ്ണയിക്കുമ്പോൾ, ഗതി ഓരോ അക്ഷരത്തിന്റെയും ആന്തരിക വിഭജനമാണ്. സാധാരണയായി ചതുശ്ര നടയാണ് (4 മാത്രകൾ) ഉപയോഗിക്കുന്നത്; ഇതിൽ നിന്നും തിസ്ര നടയിലേക്കും (3) ഖണ്ഡ നടയിലേക്കും (5) മാറുന്നത് ലയ ചാരുത നൽകുന്നു.',
    practicalExercisePrompt: 'In Tala Studio, activate "Solkattu Mode", switch Nadai from Chatusra to Tisra, and recite Tha-Ki-Ta in sync with the Mridangam strokes.',
    practicalExercisePromptMl: 'താള സ്റ്റുഡിയോയിൽ ചൊല്ല്കെട്ട് മോഡ് ഓൺ ചെയ്ത് തിസ്ര നടയിലേക്ക് മാറ്റി ത-കി-ട ചൊല്ലി ശീലിക്കുക.',
    completionCriteria: 'Flawlessly recite solkattu in both Chatusra and Tisra Nadais at 60 BPM for 2 full cycles of Adi Tala.',
    completionCriteriaMl: 'ആദിതാളത്തിൽ ചതുശ്ര, തിസ്ര നടകളിൽ ചൊല്ല്കെട്ടുകൾ 60 BPM-ൽ രണ്ട് ആവർത്തനം ചൊല്ലുക.',
    relatedLessonIds: ['laya-2', 'vocal-6'],
    revisionRecommendation: 'Use the Tala Studio Accompaniment Loops with Tisra nadai enabled to build rhythmic stability.',
    revisionRecommendationMl: 'താള സ്റ്റുഡിയോയിലെ തിസ്ര നട ലൂപ്പുകൾ ഉപയോഗിച്ച് താളബോധം ഉറപ്പിക്കുക.',
    associatedTool: 'tala',
    citation: { title: 'Mridanga Tatvam', author: 'Palghat Mani Iyer disciples', year: 1980 },
    quiz: [
      {
        id: 'q-laya-3-1',
        question: 'What is the solkattu syllable grouping for Tisra Nadai (3 sub-beats per akshara)?',
        questionMl: 'തിസ്ര നടയുടെ (ഒരു അക്ഷരത്തിൽ 3 മാത്രകൾ) ചൊല്ല്കെട്ട് ഏതാണ്?',
        options: ['Tha - Ki - Ta', 'Tha - Ka - Dhi - Mi', 'Tha - Ka - Tha - Ki - Ta', 'Tha - Dhi - Gi - Na - Thom'],
        optionsMl: ['ത - കി - ട', 'ത - ക - ധി - മി', 'ത - ക - ത - കി - ട', 'ത - ധി - ഗി - ണ - തോം'],
        correctOptionIndex: 0,
        explanation: 'Tisra Nadai divides each beat into 3 pulses, verbalized as Tha-Ki-Ta.',
        explanationMl: 'തിസ്ര നട ഓരോ അക്ഷരത്തെയും 3 മാത്രകളാക്കി ത-കി-ട എന്ന് ചൊല്ലുന്നു.'
      }
    ]
  },

  // --- INSTRUMENTAL PATHWAY ---
  {
    id: 'instrumental-1',
    slug: 'veena-and-violin-tuning-and-posture',
    pathwayId: 'instrumental',
    order: 1,
    title: 'Veena & Violin Ergonomics, Tuning & Posture',
    titleMl: 'വീണ & വയലിൻ: ഘടന, ശ്രുതി ചേർക്കൽ, ഇരിപ്പുരീതികൾ',
    subtitle: 'Acoustic anatomy, string gauges, and classical seating postures.',
    subtitleMl: 'വാദ്യങ്ങളുടെ ശ്രുതി ചേർക്കലും ശരിയായ ഇരിപ്പുരീതികളും.',
    estimatedMinutes: 9,
    skillLevel: 'Beginner',
    skillLevelMl: 'പ്രാരംഭം',
    prerequisites: ['vocal-1 (Shruti Fundamentals)'],
    prerequisitesMl: ['പാഠം 1 (ശ്രുതി ലയം)'],
    objectives: [
      'Learn the 4 main playing strings of the Saraswati Veena (Sa-Pa-Sa-Pa) and 3 Tala strings (Sa-Pa-Sa)',
      'Learn the Carnatic Violin tuning (Pa-Sa-Pa-Sa / F-C-F-C) and scroll-on-foot seating posture',
      'Identify the parts: Kudam, Yali, Mettu (Veena) and Pegs, Bridge, Soundpost (Violin)'
    ],
    objectivesMl: [
      'സരസ്വതീ വീണയിലെ 4 പ്രധാന തന്ത്രികളും (സ-പ-സ-പ) 3 താള തന്ത്രികളും മനസ്സിലാക്കുക',
      'വയലിന്റെ കർണ്ണാടക ശ്രുതി (പ-സ-പ-സ) ചേർക്കലും താഴെ ഇരുന്നുകൊണ്ടുള്ള ശരിയായ പിടുത്തവും പഠിക്കുക',
      'വീണയുടെയും വയലിന്റെയും പ്രധാന ഭാഗങ്ങൾ തിരിച്ചറിയുക'
    ],
    coreTheory: 'Unlike the Western classical violin tuned in fifths (G-D-A-E) held under the chin with a shoulder rest, the Carnatic violin is tuned in alternating fifths and fourths (Pa-Sa-Pa-Sa) with the scroll resting firmly on the performer\'s right foot, freeing the left hand for effortless gamaka slides (jarus). The Saraswati Veena features 24 fixed brass frets set in wax across a jackwood neck.',
    coreTheoryMl: 'പാശ്ചാത്യ വയലിനിൽ നിന്ന് വ്യത്യസ്തമായി കർണ്ണാടക വയലിൻ പ-സ-പ-സ ശ്രുതിയിൽ ചേർത്ത് താഴെ ഇരുന്നാണ് വായിക്കുന്നത്. വീണയിൽ 24 പിച്ചള മെട്ടുകൾ മെഴുക്കിൽ ഉറപ്പിച്ചിരിക്കുന്നു.',
    practicalExercisePrompt: 'Open the Carnatic Instrument Library, select Veena and Violin, and inspect their 3D parts and acoustic tuning specifications.',
    practicalExercisePromptMl: 'വാദ്യ ലൈബ്രറിയിൽ വീണയും വയലിനും തിരഞ്ഞെടുത്ത് അവയുടെ ഭാഗങ്ങളും ശ്രുതി ക്രമങ്ങളും പരിശോധിക്കുക.',
    completionCriteria: 'Explain the 4 playing strings of the Saraswati Veena and the unique scroll-on-foot posture of Carnatic violin.',
    completionCriteriaMl: 'വീണയിലെ തന്ത്രികളുടെ ക്രമവും വയലിൻ വായിക്കാനുള്ള ശരിയായ ഇരിപ്പും വിവരിക്കുക.',
    relatedLessonIds: ['instrumental-2', 'vocal-1'],
    revisionRecommendation: 'Visit the Carnatic Instrument Library to review the construction materials and care guidelines.',
    revisionRecommendationMl: 'വാദ്യ ലൈബ്രറി പരിശോധിച്ച് വീണയുടെയും വയലിന്റെയും നിർമ്മാണ ഘടന മനസ്സിലാക്കുക.',
    associatedTool: 'shruti',
    citation: { title: 'The Veena: Its History, Structure and Technique', author: 'K. S. Narayanaswamy', year: 1978 },
    quiz: [
      {
        id: 'q-inst-1-1',
        question: 'What is the standard tuning of the 4 strings of the Carnatic Violin?',
        questionMl: 'കർണ്ണാടക വയലിനിലെ 4 തന്ത്രികളുടെ പൊതുവായ ശ്രുതി ക്രമം എന്താണ്?',
        options: ['Pa - Sa - Pa - Sa (Alternating Tonic and Fifth)', 'G - D - A - E (Western Fifths)', 'Sa - Ri - Ga - Ma', 'Sa - Pa - Sa - Pa (Veena Tuning)'],
        optionsMl: ['പ - സ - പ - സ (പഞ്ചമവും ഷഡ്ജവും മാറിമാറി)', 'ജി - ഡി - എ - ഇ (പാശ്ചാത്യ രീതി)', 'സ - രി - ഗ - മ', 'സ - പ - സ - പ (വീണാ രീതി)'],
        correctOptionIndex: 0,
        explanation: 'The Carnatic Violin is tuned Mandra Pa, Madhya Sa, Madhya Pa, and Tara Sa (Pa-Sa-Pa-Sa), enabling continuous resonant drone support.',
        explanationMl: 'മന്ദ്ര പഞ്ചമം, മധ്യ ഷഡ്ജം, മധ്യ പഞ്ചമം, താര ഷഡ്ജം (പ-സ-പ-സ) എന്നിവയാണ് വയലിന്റെ ശ്രുതി.'
      }
    ]
  },
  {
    id: 'instrumental-2',
    slug: 'plucking-bowing-and-swarasthana-precision',
    pathwayId: 'instrumental',
    order: 2,
    title: 'Plucking, Bowing & Swarasthana Finger Movement',
    titleMl: 'മീട്ടു, ബോയിങ്, സ്വരസ്ഥാന വിരൽ വിന്യാസങ്ങൾ',
    subtitle: 'Meetu and Villadikkal mechanics for producing crystal clear swaras.',
    subtitleMl: 'സ്വരശുദ്ധി ഉറപ്പുവരുത്തുന്ന മീട്ടു രീതികളും ബോയിങ് തത്വങ്ങളും.',
    estimatedMinutes: 11,
    skillLevel: 'Intermediate',
    skillLevelMl: 'മധ്യമം',
    prerequisites: ['instrumental-1 (Tuning & Posture)'],
    prerequisitesMl: ['പാഠം 12 (ഘടന & ശ്രുതി)'],
    objectives: [
      'Master right-hand index and middle finger plucking (Meetu) on the Veena',
      'Execute continuous, stable bow strokes across string changes on the Violin',
      'Locate Mayamalavagowla swaras accurately without visual hunting'
    ],
    objectivesMl: [
      'വീണയിൽ ചൂണ്ടുവിരലും നടുവിരലും കൊണ്ടുള്ള മീട്ടു രീതികൾ സ്വായത്തമാക്കുക',
      'വയലിനിൽ കുലുക്കമില്ലാതെ ബോയിങ് ചെയ്യാനും തന്ത്രികൾ മാറാനും പഠിക്കുക',
      'മായാമാളവഗൗള സ്വരങ്ങൾ കൃത്യമായി വിരൽ വെച്ചു വായിക്കുക'
    ],
    coreTheory: 'On the Veena, the index and middle fingers of the right hand pluck downwards alternately, while the little finger plucks upwards on the side Tala strings to mark rhythm. On the violin, bowing pressure must remain uniform from frog to tip to maintain steady acoustic tone during gamakas.',
    coreTheoryMl: 'വീണയിൽ ചൂണ്ടുവിരലും നടുവിരലും മാറിമാറി താഴേക്ക് മീട്ടുമ്പോൾ ചെറുവിരൽ താളക്കമ്പികളിൽ മീട്ടുന്നു. വയലിനിൽ ഒരേ അളവിലുള്ള മർദ്ദം ബോയിൽ നൽകി സ്വരശുദ്ധി നിലനിർത്തുന്നു.',
    practicalExercisePrompt: 'Open Graded Exercises and practice Sarali Varisai 1 on your instrument; ensure every stroke aligns with the Web Audio playback.',
    practicalExercisePromptMl: 'ഗ്രേഡഡ് എക്സർസൈസ് തുറന്ന് സരളിവരിശ 1 നിങ്ങളുടെ വാദ്യത്തിൽ വായിച്ചു നോക്കുക.',
    completionCriteria: 'Perform Sarali Varisai 1 on your instrument with correct plucking/bowing technique.',
    completionCriteriaMl: 'ശരിയായ മീട്ടു/ബോയിങ് രീതികളോടെ സരളിവരിശ 1 വാദ്യത്തിൽ വായിക്കുക.',
    relatedLessonIds: ['instrumental-1', 'vocal-4'],
    revisionRecommendation: 'Rehearse with the Shruti Companion drone running to ensure zero fret/fingerboard deviation.',
    revisionRecommendationMl: 'ശ്രുതി കമ്പാനിയൻ ഓൺ ചെയ്തു വെച്ച് സ്വരസ്ഥാനങ്ങൾ ഒട്ടും തെറ്റാതെ വായിച്ചു ശീലിക്കുക.',
    associatedTool: 'exercises',
    citation: { title: 'Violin Technique in South Indian Music', author: 'Lalgudi G. Jayaraman', year: 1988 },
    quiz: [
      {
        id: 'q-inst-2-1',
        question: 'On the Saraswati Veena, what is the role of the right-hand little finger?',
        questionMl: 'സരസ്വതീ വീണയിൽ വലതുകൈയിലെ ചെറുവിരലിന്റെ ധർമ്മം എന്താണ്?',
        options: ['Plucking the 3 side Tala strings upwards to mark the beat', 'Plucking the main Sarani string', 'Damping the strings to stop sound', 'Pressing frets on the fingerboard'],
        optionsMl: ['3 താളക്കമ്പികളിൽ മുകളിലേക്ക് മീട്ടി താളം സൂചിപ്പിക്കുക', 'പ്രധാന സരണി തന്ത്രിയിൽ മീട്ടുക', 'ശബ്ദം നിലയ്ക്കാൻ തന്ത്രികളെ പിടിക്കുക', 'മെട്ടുകളിൽ വിരലമർത്തുക'],
        correctOptionIndex: 0,
        explanation: 'The right little finger plucks upwards against the three side drone strings (Pakkasarani), maintaining constant rhythmic pulse.',
        explanationMl: 'ചെറുവിരൽ 3 താളക്കമ്പികളിൽ മുകളിലേക്ക് മീട്ടി താളം നിലനിർത്തുന്നു.'
      }
    ]
  }
];
