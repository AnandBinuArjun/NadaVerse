export type Language = 'en' | 'ml';

export interface Translations {
  // Brand
  brandName: string;
  brandSubtitle: string;

  // Nav
  navOverview: string;
  navStartHere: string;
  navExplore: string;
  navPracticeStudio: string;
  navAiTutor: string;
  adharaSa: string;
  playShruti: string;
  droneActive: string;
  signIn: string;
  signOut: string;
  account: string;

  // Hero
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroDescription: string;
  heroStartBtn: string;
  heroPracticeBtn: string;
  heroExploreBtn: string;

  // Pathway Cards
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;

  // Explore Tabs
  tabRagas: string;
  tabTalas: string;
  tabInstruments: string;
  tabComposers: string;
  tabGlossary: string;
  searchPlaceholder: string;
  showingResults: string;
  noResults: string;

  // Raga Card
  melakarta: string;
  janya: string;
  arohanam: string;
  avarohanam: string;
  chakra: string;
  swarasthanas: string;
  compositions: string;
  sources: string;
  phrases: string;
  swaraRatios: string;
  audiateSwara: string;

  // Tala Card
  angas: string;
  aksharas: string;
  solkattu: string;
  kriyas: string;
  varieties: string;

  // Instrument Card
  family: string;
  construction: string;
  tuning: string;
  notableExponents: string;

  // Composer Card
  tradition: string;
  lifespan: string;
  birthplace: string;
  languages: string;
  mudra: string;
  famousKritis: string;

  // Practice Studio
  practiceStudioTitle: string;
  practiceStudioSubtitle: string;
  tanpuraTitle: string;
  talaTitle: string;
  tunerTitle: string;
  recorderTitle: string;
  practiceLogTitle: string;
  sessionFocus: string;
  sessionNotes: string;
  saveSessionBtn: string;
  sessionSavedMsg: string;

  // Tala Studio
  tempoBpm: string;
  talaSelector: string;
  startMetronome: string;
  stopMetronome: string;
  currentBeat: string;
  currentAnga: string;

  // Beginner Pathway
  beginnerTitle: string;
  beginnerSubtitle: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  markCompleteBtn: string;
  completedBadge: string;
  pathwayCompletedTitle: string;
  pathwayCompletedDesc: string;
  restartPathwayBtn: string;

  // AI Tutor Modal
  tutorTitle: string;
  tutorSubtitle: string;
  tutorPlaceholder: string;
  tutorSendBtn: string;
  tutorGroundingNotice: string;
  tutorSuggestedPrompts: string;
  tutorPrompt1: string;
  tutorPrompt2: string;
  tutorPrompt3: string;

  // Auth Modal
  authSignInTitle: string;
  authRegisterTitle: string;
  authEmailLabel: string;
  authPasswordLabel: string;
  authDisplayNameLabel: string;
  authSubmitSignIn: string;
  authSubmitRegister: string;
  authSwitchToRegister: string;
  authSwitchToSignIn: string;
  authZeroPaywallNotice: string;

  // Footer
  footerMission: string;
  footerTreatises: string;
  footerTreatise1: string;
  footerTreatise2: string;
  footerTreatise3: string;
  footerTreatise4: string;
  footerEthics: string;
  footerEthicsDesc: string;
  footerEditorial: string;
  footerEditorialDesc: string;
  footerWcag: string;
  footerCopyright: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'NadaVerse',
    brandSubtitle: 'Carnatic Music For Everyone',

    navOverview: 'Overview',
    navStartHere: 'Start Here',
    navExplore: 'Explore',
    navPracticeStudio: 'Practice Studio',
    navAiTutor: 'AI Tutor',
    adharaSa: 'Adhara Sa:',
    playShruti: 'Play Shruti',
    droneActive: 'Drone Active',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    account: 'Account',

    heroBadge: 'The Sovereign Digital Sanctuary of Carnatic Music',
    heroTitle1: 'Discover Carnatic music.',
    heroTitle2: 'Understand its language.',
    heroTitle3: 'Practise with purpose.',
    heroDescription:
      'A peer-reviewed, completely free learning and practice platform. Connect foundational beginner orientation, verifiable raga and tala musicology, precision Web Audio practice companions, and grounded AI guidance.',
    heroStartBtn: 'Start Here: New to Carnatic?',
    heroPracticeBtn: 'Open Practice Studio',
    heroExploreBtn: 'Explore Ragas & Instruments',

    card1Title: '1. Structured Orientation',
    card1Desc:
      'Understand Shruti (the eternal drone), the 7 Swaras (and 16 swarasthanas), and Laya (the cyclical rhythmic architecture).',
    card2Title: '2. Verified Knowledge Base',
    card2Desc:
      '30 Ragas, 14 Talas, 20 Instruments, 20 Composers, and 48 Glossary terms citing foundational music treatises.',
    card3Title: '3. Web Audio Companions',
    card3Desc:
      'Acoustically modeled 4-string Tambura with natural overtone resonance and drift-free Tala metronome with visual angas.',

    tabRagas: 'Ragas',
    tabTalas: 'Talas',
    tabInstruments: 'Instruments',
    tabComposers: 'Composers',
    tabGlossary: 'Glossary',
    searchPlaceholder: 'Search ragas, talas, instruments, composers, or terms...',
    showingResults: 'Showing results',
    noResults: 'No matches found. Try adjusting your query.',

    melakarta: 'Melakarta',
    janya: 'Janya Raga',
    arohanam: 'Arohanam',
    avarohanam: 'Avarohanam',
    chakra: 'Chakra',
    swarasthanas: 'Swarasthanas (Just Intonation Ratios)',
    compositions: 'Key Compositions',
    sources: 'Verified Sources & Treatises',
    phrases: 'Characteristic Prayogas (Phrases)',
    swaraRatios: 'Swara Acoustic Ratios',
    audiateSwara: 'Audition Swara',

    angas: 'Angas (Components)',
    aksharas: 'Total Aksharas (Beats)',
    solkattu: 'Solkattu (Syllables)',
    kriyas: 'Kriyas (Hand Gestures)',
    varieties: 'Varieties / Jaatis',

    family: 'Instrument Family',
    construction: 'Acoustic Construction',
    tuning: 'Tuning & Strings',
    notableExponents: 'Notable Exponents',

    tradition: 'Tradition / Era',
    lifespan: 'Lifespan',
    birthplace: 'Birthplace',
    languages: 'Primary Languages',
    mudra: 'Signature Mudra',
    famousKritis: 'Master Compositions',

    practiceStudioTitle: 'Practice Studio & Audio Companions',
    practiceStudioSubtitle:
      'Precision acoustic tools engineered for focused daily riyaz, pitch calibration, and rhythmic training.',
    tanpuraTitle: 'Tanpura Drone',
    talaTitle: 'Tala Metronome',
    tunerTitle: 'Pitch Tuner',
    recorderTitle: 'Practice Recorder',
    practiceLogTitle: 'Practice Session Log',
    sessionFocus: 'Session Focus',
    sessionNotes: 'Practice Notes & Reflections',
    saveSessionBtn: 'Save Session',
    sessionSavedMsg: 'Session Logged Successfully!',

    tempoBpm: 'Tempo (BPM)',
    talaSelector: 'Select Tala',
    startMetronome: 'Start Metronome',
    stopMetronome: 'Stop Metronome',
    currentBeat: 'Current Beat',
    currentAnga: 'Active Anga',

    beginnerTitle: "Beginner's Orientation Pathway",
    beginnerSubtitle:
      'A 3-step structured introduction to the foundational pillars of Carnatic music.',
    step1Title: '1. The Eternal Drone (Shruti)',
    step2Title: '2. The Seven Swaras (Sapta Swara)',
    step3Title: '3. Rhythmic Architecture (Laya & Tala)',
    markCompleteBtn: 'Mark Complete & Continue',
    completedBadge: 'Completed',
    pathwayCompletedTitle: 'Pathway Completed! Ready for Practice',
    pathwayCompletedDesc:
      'You now understand the three fundamental pillars of Carnatic music. Continue your journey with the Practice Studio or Explore the repertoire.',
    restartPathwayBtn: 'Review Pathway from Start',

    tutorTitle: 'Grounded AI Carnatic Music Tutor',
    tutorSubtitle:
      'Ask anything about raga lakshana, tala angas, swarasthana ratios, or historical contexts.',
    tutorPlaceholder: 'Ask a question about Carnatic music (e.g. Why does Mayamalavagowla have G3 and M1?)...',
    tutorSendBtn: 'Ask Tutor',
    tutorGroundingNotice:
      'Retrieves answers strictly from verified treatises (Sangita Ratnakara, Chaturdandi Prakasika). Transparently reports uncertainties.',
    tutorSuggestedPrompts: 'Suggested topics to explore:',
    tutorPrompt1: 'Explain the swarasthana ratios of Mayamalavagowla',
    tutorPrompt2: 'How does Adi Tala structure its 8 beats into Laghu and Dhrutam?',
    tutorPrompt3: 'What makes the Saraswati Veena unique among chordophones?',

    authSignInTitle: 'Sign In to NadaVerse',
    authRegisterTitle: 'Create Free Account',
    authEmailLabel: 'Email Address',
    authPasswordLabel: 'Password',
    authDisplayNameLabel: 'Your Name / Title',
    authSubmitSignIn: 'Sign In',
    authSubmitRegister: 'Create Account',
    authSwitchToRegister: "Don't have an account? Create one free",
    authSwitchToSignIn: 'Already have an account? Sign In',
    authZeroPaywallNotice:
      'NadaVerse is 100% free and open. Account creation saves your riyaz practice history and custom tunings securely.',

    footerMission:
      'An accessible, trustworthy digital sanctuary for Carnatic music. Free for all learners, educators, and musicians worldwide. No paywalls, no subscriptions.',
    footerTreatises: 'Foundational Treatises',
    footerTreatise1: 'Sangita Ratnakara (Sarangadeva)',
    footerTreatise2: 'Chaturdandi Prakasika (Venkatamakhin)',
    footerTreatise3: 'Sangita Sampradaya Pradarsini (Subbarama Dikshitar)',
    footerTreatise4: 'South Indian Music Series (Prof. P. Sambamoorthy)',
    footerEthics: 'Ethical Architecture',
    footerEthicsDesc:
      'Private recordings remain strictly private on your device. Our AI tutor answers only from peer-reviewed musicology sources and never invents citations.',
    footerEditorial: 'Editorial Integrity',
    footerEditorialDesc:
      'If you identify any discrepancy in raga lakshana, tala angas, or attribution, contact our musicology board for immediate review and errata publication.',
    footerWcag: 'WCAG 2.2 AA Target Compliant',
    footerCopyright: 'NadaVerse — Sovereign Digital Sanctuary of Carnatic Music. Free & open heritage.'
  },
  ml: {
    brandName: 'നാദവേഴ്സ്',
    brandSubtitle: 'കർണ്ണാടക സംഗീതം എല്ലാവരിലേക്കും',

    navOverview: 'പൂമുഖം',
    navStartHere: 'അഭ്യസനം',
    navExplore: 'വിജ്ഞാനകോശം',
    navPracticeStudio: 'സാധക കളരി',
    navAiTutor: 'സംഗീത ഗുരു',
    adharaSa: 'ആധാര ഷഡ്ജം:',
    playShruti: 'ശ്രുതി മീട്ടുക',
    droneActive: 'ശ്രുതി മുഴങ്ങുന്നു',
    signIn: 'പ്രവേശിക്കുക',
    signOut: 'പുറത്തുകടക്കുക',
    account: 'അക്കൗണ്ട്',

    heroBadge: 'കർണ്ണാടക സംഗീതത്തിന്റെ പവിത്ര ഡിജിറ്റൽ സങ്കേതം',
    heroTitle1: 'കർണ്ണാടക സംഗീതം കണ്ടെത്തുക.',
    heroTitle2: 'അതിന്റെ ഭാഷ മനസ്സിലാക്കുക.',
    heroTitle3: 'ലക്ഷ്യബോധത്തോടെ സാധകം ചെയ്യുക.',
    heroDescription:
      'സംഗീത പ്രേമികൾക്കായി തികച്ചും സൗജന്യമായി ഒരുക്കിയ വിജ്ഞാന-സാധക സങ്കേതം. ആധികാരിക രാഗ-താള വിജ്ഞാനം, വെബ് ഓഡിയോ തംബുരു-മെട്രോനോം, കൃത്യതയാർന്ന സംഗീത മാർഗ്ഗനിർദ്ദേശങ്ങൾ.',
    heroStartBtn: 'തുടങ്ങാം: സംഗീത പാഠങ്ങൾ',
    heroPracticeBtn: 'സാധക കളരി തുറക്കുക',
    heroExploreBtn: 'രാഗങ്ങളും വാദ്യങ്ങളും',

    card1Title: '1. അടിസ്ഥാന പാഠങ്ങൾ',
    card1Desc:
      'ശ്രുതി (നിത്യശ്രുതി), സപ്ത സ്വരങ്ങൾ (16 സ്വരസ്ഥാനങ്ങൾ), ലയവും താളവും എന്നിവ ചിട്ടയായി മനസ്സിലാക്കുക.',
    card2Title: '2. ആധികാരിക വിജ്ഞാനം',
    card2Desc:
      '30 രാഗങ്ങൾ, 14 താളങ്ങൾ, 20 വാദ്യങ്ങൾ, 20 വാഗ്ഗേയകാരന്മാർ, 48 സംഗീത പദാവലികൾ അടങ്ങിയ സമ്പൂർണ്ണ കോശം.',
    card3Title: '3. സാധക തുണകൾ',
    card3Desc:
      'സ്വാഭാവിക അനുരണനമുള്ള 4-തന്ത്രി തംബുരുവും, കൃത്യമായ അക്ഷരങ്ങളോടെയുള്ള താള സാധകവും.',

    tabRagas: 'രാഗങ്ങൾ',
    tabTalas: 'താളങ്ങൾ',
    tabInstruments: 'വാദ്യങ്ങൾ',
    tabComposers: 'വാഗ്ഗേയകാരന്മാർ',
    tabGlossary: 'ശബ്ദതാരാവലി',
    searchPlaceholder: 'രാഗം, താളം, വാദ്യം, വാഗ്ഗേയകാരൻ എന്നിവ തിരയുക...',
    showingResults: 'കണ്ടെത്തിയ ഫലങ്ങൾ',
    noResults: 'ഫലങ്ങളൊന്നും ലഭ്യമല്ല. മറ്റൊരു വാക്ക് തിരഞ്ഞുനോക്കൂ.',

    melakarta: 'മേളകർത്താ',
    janya: 'ജന്യ രാഗം',
    arohanam: 'ആരോഹണം',
    avarohanam: 'അവരോഹണം',
    chakra: 'ചക്രം',
    swarasthanas: 'സ്വരസ്ഥാനങ്ങൾ (അനുപാതങ്ങൾ)',
    compositions: 'പ്രസിദ്ധ കൃതികൾ',
    sources: 'ആധികാരിക ഗ്രന്ഥങ്ങൾ',
    phrases: 'വിശേഷ പ്രയോഗങ്ങൾ',
    swaraRatios: 'സ്വര അനുപാതങ്ങൾ',
    audiateSwara: 'സ്വരം കേൾക്കുക',

    angas: 'അംഗങ്ങൾ',
    aksharas: 'ആകെ അക്ഷരങ്ങൾ (മാത്രകൾ)',
    solkattu: 'ചൊല്ല്കെട്ട്',
    kriyas: 'ക്രിയകൾ (കൈമുദ്രകൾ)',
    varieties: 'ഭേദങ്ങൾ / ജാതികൾ',

    family: 'വാദ്യ വിഭാഗം',
    construction: 'നിർമ്മാണ രീതി',
    tuning: 'ശ്രുതി ക്രമീകരണം',
    notableExponents: 'പ്രഗത്ഭ വാദകർ',

    tradition: 'പാരമ്പര്യം / കാലഘട്ടം',
    lifespan: 'ജീവിതകാലം',
    birthplace: 'ജന്മസ്ഥലം',
    languages: 'ഭാഷകൾ',
    mudra: 'മുദ്ര',
    famousKritis: 'പ്രധാന കൃതികൾ',

    practiceStudioTitle: 'സാധക കളരിയും ശബ്ദ തുണകളും',
    practiceStudioSubtitle:
      'ദിവസേനയുള്ള സാധകത്തിനും, സ്വരശുദ്ധിക്കും, താളക്കൂട്ടുകൾക്കുമായി ചിട്ടപ്പെടുത്തിയ കൃത്യതയാർന്ന ഉപകരണങ്ങൾ.',
    tanpuraTitle: 'തംബുരു ശ്രുതി',
    talaTitle: 'താള സാധകം',
    tunerTitle: 'ശ്രുതി ട്യൂണർ',
    recorderTitle: 'സാധകം റെക്കോർഡർ',
    practiceLogTitle: 'സാധക കുറിപ്പുകൾ',
    sessionFocus: 'സാധക വിഷയം',
    sessionNotes: 'സാധക ചിന്തകളും കുറിപ്പുകളും',
    saveSessionBtn: 'രേഖപ്പെടുത്തുക',
    sessionSavedMsg: 'സാധകം വിജയകരമായി രേഖപ്പെടുത്തി!',

    tempoBpm: 'വേഗത (BPM)',
    talaSelector: 'താളം തിരഞ്ഞെടുക്കുക',
    startMetronome: 'താളം തുടങ്ങുക',
    stopMetronome: 'താളം നിർത്തുക',
    currentBeat: 'നിലവിലെ അക്ഷരം',
    currentAnga: 'സജീവ അംഗം',

    beginnerTitle: 'പ്രാരംഭ സംഗീത പാഠങ്ങൾ',
    beginnerSubtitle:
      'കർണ്ണാടക സംഗീതത്തിന്റെ 3 അടിസ്ഥാന തൂണുകളെക്കുറിച്ചുള്ള വ്യക്തമായ വിശദീകരണം.',
    step1Title: '1. നിത്യശ്രുതി (ശ്രുതി മാതാ)',
    step2Title: '2. സപ്ത സ്വരങ്ങൾ (ലയ പിതാ)',
    step3Title: '3. ലയവും താളവും (താള ഘടന)',
    markCompleteBtn: 'പൂർത്തിയാക്കി മുന്നോട്ട് പോവുക',
    completedBadge: 'പൂർത്തിയായി',
    pathwayCompletedTitle: 'അടിസ്ഥാന പാഠങ്ങൾ പൂർത്തിയായി!',
    pathwayCompletedDesc:
      'കർണ്ണാടക സംഗീതത്തിന്റെ 3 അടിസ്ഥാന തത്വങ്ങൾ നിങ്ങൾ മനസ്സിലാക്കിക്കഴിഞ്ഞു. ഇനി സാധക കളരിയിലേക്കോ വിജ്ഞാനകോശത്തിലേക്കോ മുന്നേറാം.',
    restartPathwayBtn: 'ആദ്യം മുതൽ വീണ്ടും പഠിക്കുക',

    tutorTitle: 'സംഗീത AI ഉപദേശകൻ',
    tutorSubtitle:
      'രാഗ ലക്ഷണം, താളാംഗങ്ങൾ, സ്വരസ്ഥാനങ്ങൾ, സംഗീത ചരിത്രം എന്നിവയെക്കുറിച്ച് എന്തു സംശയവും ചോദിക്കാം.',
    tutorPlaceholder: 'കർണ്ണാടക സംഗീതത്തെക്കുറിച്ച് എന്തും ചോദിക്കൂ (ഉദാ: മായാമാളവഗൗളയുടെ സ്വരസ്ഥാനങ്ങൾ എന്തെല്ലാം?)...',
    tutorSendBtn: 'ചോദിക്കുക',
    tutorGroundingNotice:
      'സംഗീത രത്നാകരം, ചതുർദണ്ഡി പ്രകാശിക തുടങ്ങിയ ആധികാരിക ഗ്രന്ഥങ്ങളിൽ നിന്നുള്ള വിവരങ്ങൾ മാത്രം നൽകുന്നു.',
    tutorSuggestedPrompts: 'തിരഞ്ഞെടുക്കാവുന്ന ചില വിഷയങ്ങൾ:',
    tutorPrompt1: 'മായാമാളവഗൗള രാഗത്തിന്റെ സ്വരസ്ഥാന അനുപാതങ്ങൾ വിശദീകരിക്കുക',
    tutorPrompt2: 'ആദി താളത്തിൽ ലഘുവും ദ്രുതവും എപ്രകാരം വിഭജിച്ചിരിക്കുന്നു?',
    tutorPrompt3: 'സരസ്വതി വീണയുടെ തന്ത്രികളും ഘടനയും എന്തുകൊണ്ട് സവിശേഷമാകുന്നു?',

    authSignInTitle: 'നാദവേഴ്സിലേക്ക് പ്രവേശിക്കുക',
    authRegisterTitle: 'സൗജന്യ അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    authEmailLabel: 'ഇമെയിൽ വിലാസം',
    authPasswordLabel: 'പാസ്‌വേഡ്',
    authDisplayNameLabel: 'നിങ്ങളുടെ പേര്',
    authSubmitSignIn: 'പ്രവേശിക്കുക',
    authSubmitRegister: 'രജിസ്റ്റർ ചെയ്യുക',
    authSwitchToRegister: 'അക്കൗണ്ട് ഇല്ലേ? സൗജന്യമായി ആരംഭിക്കുക',
    authSwitchToSignIn: 'അക്കൗണ്ട് ഉണ്ടോ? പ്രവേശിക്കുക',
    authZeroPaywallNotice:
      'നാദവേഴ്സ് തികച്ചും സൗജന്യമാണ്. അക്കൗണ്ട് നിങ്ങളുടെ സാധക രേഖകളും പ്രിയപ്പെട്ട ശ്രുതികളും ഭദ്രമായി സൂക്ഷിക്കുന്നു.',

    footerMission:
      'കർണ്ണാടക സംഗീത വിദ്യാർത്ഥികൾക്കും അധ്യാപകർക്കുമായി ഒരുക്കിയ പവിത്രമായ ഡിജിറ്റൽ സങ്കേതം. പരസ്യങ്ങളോ വരിസംഖ്യകളോ ഇല്ലാതെ സൗജന്യം.',
    footerTreatises: 'ആധികാരിക ഗ്രന്ഥങ്ങൾ',
    footerTreatise1: 'സംഗീത രത്നാകരം (ശാർങ്ഗദേവൻ)',
    footerTreatise2: 'ചതുർദണ്ഡി പ്രകാശിക (വേങ്കടമഖി)',
    footerTreatise3: 'സംഗീത സമ്പ്രദായ പ്രദർശിനി (സുബ്ബരാമ ദീക്ഷിതർ)',
    footerTreatise4: 'സൗത്ത് ഇന്ത്യൻ മ്യൂസിക് സീരീസ് (പ്രൊഫ. പി. സാംബമൂർത്തി)',
    footerEthics: 'ധാർമ്മിക സുതാര്യത',
    footerEthicsDesc:
      'നിങ്ങളുടെ സ്വകാര്യ സാധക റെക്കോർഡിംഗുകൾ നിങ്ങളുടെ ഫോണിലോ കമ്പ്യൂട്ടറിലോ മാത്രം സൂക്ഷിക്കപ്പെടുന്നു. AI പരിശീലനത്തിനായി ഉപയോഗിക്കുന്നില്ല.',
    footerEditorial: 'സമ്പാദക കൃത്യത',
    footerEditorialDesc:
      'രാഗ ലക്ഷണത്തിലോ താളാംഗങ്ങളിലോ എന്തെങ്കിലും തിരുത്തലുകൾ ആവശ്യമുണ്ടെങ്കിൽ ഞങ്ങളുടെ സംഗീത ബോർഡിനെ അറിയിക്കുക.',
    footerWcag: 'WCAG 2.2 AA നിഷ്കർഷകൾ പാലിക്കുന്നു',
    footerCopyright: 'നാദവേഴ്സ് — കർണ്ണാടക സംഗീത പൈതൃകം എല്ലാവരിലേക്കും. തികച്ചും സൗജന്യം.'
  }
};

export const RAGA_ML_NAMES: Record<string, string> = {
  'mayamalavagowla': 'മായാമാളവഗൗള',
  'shankarabharanam': 'ധീരശങ്കരാഭരണം',
  'mechakalyani': 'മേചകല്യാണി',
  'hanumatodi': 'ഹനുമത്തോടി',
  'kharaharapriya': 'ഖരഹരപ്രിയ',
  'harikambhoji': 'ഹരികാംബോജി',
  'mohanam': 'മോഹനം',
  'hamsadhwani': 'ഹംസധ്വനി',
  'hindolam': 'ഹിന്ദോളം',
  'amritavarshini': 'അമൃതവർഷിണി',
  'bhairavi': 'ഭൈരവി',
  'abhogi': 'ആഭോഗി',
  'kambhoji': 'കാംബോജി',
  'madhyamavati': 'മധ്യമാവതി',
  'revati': 'രേവതി',
  'charukesi': 'ചാരുക്കേശി',
  'saraswati': 'സരസ്വതി',
  'simhendramadhyamam': 'സിംഹേന്ദ്രമധ്യമം',
  'shanmukhapriya': 'ഷണ്മുഖപ്രിയ',
  'chakravakam': 'ചക്രവാകം',
  'natabhairavi': 'നടഭൈരവി',
  'ganamoorti': 'ഗാനമൂർത്തി',
  'dheerasankarabharanam': 'ധീരശങ്കരാഭരണം',
  'vachaspati': 'വാചസ്പതി',
  'dharmavati': 'ധർമ്മവതി',
  'gowrimanohari': 'ഗൗരീമനോഹരി',
  'kalyanavasantham': 'കല്യാണവസന്തം',
  'suddhadhanyasi': 'ശുദ്ധ ധന്യാസി',
  'malahari': 'മലഹരി',
  'saveri': 'സാവേരി'
};

export const TALA_ML_NAMES: Record<string, string> = {
  'adi-tala': 'ആദി താളം (ചതുസ്ര ജാതി ത്രിപുട താളം)',
  'rupaka-tala': 'രൂപക താളം (ചതുസ്ര ജാതി രൂപക താളം)',
  'mishra-chapu': 'മിശ്ര ചാപ്പ് താളം',
  'khanda-chapu': 'ഖണ്ഡ ചാപ്പ് താളം',
  'tisra-eka-tala': 'തിസ്ര ഏക താളം',
  'chatusra-eka-tala': 'ചതുസ്ര ഏക താളം',
  'khanda-triputa-tala': 'ഖണ്ഡ ത്രിപുട താളം',
  'dhruva-tala': 'ധ്രുവ താളം (ചതുസ്ര ജാതി)',
  'matya-tala': 'മട്യ താളം (ചതുസ്ര ജാതി)',
  'jhampa-tala': 'ഝമ്പ താളം (മിശ്ര ജാതി)',
  'triputa-tala': 'ത്രിപുട താളം',
  'ata-tala': 'അട താളം (ഖണ്ഡ ജാതി)',
  'eka-tala': 'ഏക താളം',
  'sankeerna-eka-tala': 'സങ്കീർണ്ണ ഏക താളം',
  'deshadi-tala': 'ദേശാദി താളം',
  'madhyadi-tala': 'മധ്യാദി താളം'
};

export const INSTRUMENT_ML_NAMES: Record<string, string> = {
  'saraswati-veena': 'സരസ്വതി വീണ',
  'mridangam': 'മൃദംഗം',
  'tambura': 'തംബുരു',
  'ghatam': 'ഘടം',
  'carnatic-violin': 'കർണ്ണാടക വയലിൻ',
  'kanjira': 'ഗഞ്ചിറ',
  'morsing': 'മോർസിംഗ്',
  'venu-flute': 'പുല്ലാങ്കുഴൽ (വേണു)',
  'nadaswaram': 'നാദസ്വരം',
  'tavil': 'തവിൽ',
  'jalatharangam': 'ജലതരംഗം',
  'chitra-veena': 'ചിത്രവീണ',
  'mandolin': 'മാൻഡലിൻ',
  'saxophone': 'സാക്സോഫോൺ',
  'clarionet': 'ക്ലാരിനെറ്റ്',
  'edakka': 'ഇടയ്ക്ക',
  'maddalam': 'മദ്ദളം',
  'chenda': 'ചെണ്ട',
  'timila': 'തിമില',
  'kuzhal': 'കുഴൽ'
};

export const COMPOSER_ML_NAMES: Record<string, string> = {
  'Tyagaraja': 'ത്യാഗരാജ സ്വാമികൾ',
  'Muthuswami Dikshitar': 'മുത്തുസ്വാമി ദീക്ഷിതർ',
  'Syama Sastri': 'ശ്യാമ ശാസ്ത്രികൾ',
  'Purandara Dasa': 'പുരന്ദര ദാസൻ',
  'Swathi Thirunal Rama Varma': 'സ്വാതി തിരുനാൾ രാമവർമ്മ',
  'Papanasam Sivan': 'പാപനാശം ശിവൻ',
  'Koteeswara Iyer': 'കോടീശ്വര അയ്യർ',
  'Gopalakrishna Bharati': 'ഗോപാലകൃഷ്ണ ഭാരതി',
  'Annamacharya': 'അന്നമാചാര്യ',
  'Bhadrachala Ramadasu': 'ഭദ്രാചല രാമദാസ്',
  'Patnam Subramania Iyer': 'പട്ടണം സുബ്രഹ്മണ്യ അയ്യർ',
  'Poochi Srinivasa Iyengar': 'പൂച്ചി ശ്രീനിവാസ അയ്യങ്കാർ',
  'Mysore Vasudevachar': 'മൈസൂർ വാസുദേവാചാര്യർ',
  'Harikesanallur Muthiah Bhagavatar': 'ഹരികഥാനല്ലൂർ മുത്തയ്യ ഭാഗവതർ',
  'Oothukkadu Venkata Kavi': 'ഊത്തുക്കാട് വെങ്കട കവി',
  'Narayana Teertha': 'നാരായണ തീർത്ഥർ',
  'Jayadeva': 'ജയദേവർ',
  'Arunagirinathar': 'അരുണഗിരിനാഥർ',
  'Irayimman Thampi': 'ഇരയിമ്മൻ തമ്പി',
  'K. S. Narayanaswamy': 'കെ. എസ്. നാരായണസ്വാമി'
};
