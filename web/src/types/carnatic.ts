export type ReviewStatus = 'draft' | 'in_review' | 'verified' | 'expert_reviewed' | 'archived';

export interface SourceMetadata {
  title: string;
  authorOrCreator: string;
  citation: string;
  url?: string;
  publicationYear?: number;
  accessDate?: string;
}

export interface RightsMetadata {
  status: 'public_domain' | 'fair_use_educational' | 'licensed' | 'cc_by_sa';
  rightsHolder: string;
  licenseNotes?: string;
}

export interface SwaraInfo {
  symbol: string; // e.g. "S", "R₁", "G₃", "M₁", "P", "D₁", "N₃", "Ṡ"
  name: string; // e.g. "Shadjam", "Shuddha Rishabham"
  ratio: number; // e.g. 1.0, 16/15, 5/4, etc.
  ratioFraction: string; // e.g. "1/1", "16/15", "5/4"
  westernEquivalentNote: string; // relative to C tonic: e.g. "C", "C#", "E"
  swarasthana: string;
}

export interface FamousComposition {
  title: string;
  composer: string;
  tala: string;
  language: string;
  summary?: string;
}

export interface RagaItem {
  id: string;
  slug: string;
  canonicalName: string;
  alternateNames: string[];
  melakartaNumber?: number;
  isMelakarta: boolean;
  parentRaga?: string;
  chakra?: string;
  arohanam: string;
  avarohanam: string;
  arohanamSwaras: string[];
  avarohanamSwaras: string[];
  swaraDetails: SwaraInfo[];
  characteristicPhrases: string[];
  rasaAndMood: string;
  educationalSummary: string;
  historicalContext: string;
  pedagogicalSignificance: string;
  famousCompositions: FamousComposition[];
  sources: SourceMetadata[];
  rights: RightsMetadata;
  reviewStatus: ReviewStatus;
  reviewerName: string;
  reviewedAt: string;
}

export interface TalaBeatAction {
  beatIndex: number;
  anga: 'Laghu' | 'Dhrutam' | 'Anudhrutam';
  actionType: 'thattu' | 'finger_count' | 'veecheduthal';
  actionLabel: string; // e.g. "Thattu (Beat)", "Pinky finger", "Veechu (Wave)"
  syllable?: string; // solkattu syllable e.g. "Tha", "Dhi", "Thom", "Nam"
}

export interface TalaItem {
  id: string;
  slug: string;
  canonicalName: string;
  angasFormula: string; // e.g. "I₄ + O + O"
  totalAksharas: number;
  laghuCounts: number;
  dhrutamCounts: number;
  jati: string; // e.g. "Chatusra"
  description: string;
  handMovementsGuide: string;
  beatActions: TalaBeatAction[];
  representativeCompositions: string[];
  sources: SourceMetadata[];
  rights: RightsMetadata;
  reviewStatus: ReviewStatus;
  reviewerName: string;
  reviewedAt: string;
}

export interface InstrumentSample {
  label: string;
  description: string;
  audioUrl?: string;
  attribution: string;
}

export interface InstrumentItem {
  id: string;
  slug: string;
  canonicalName: string;
  family: 'Chordophone' | 'Membranophone' | 'Aerophone' | 'Idiophone';
  materials: string[];
  anatomy: { part: string; function: string }[];
  playingTechnique: string;
  tuningSystem: string;
  roleInConcert: string;
  historicalContext: string;
  samples: InstrumentSample[];
  sources: SourceMetadata[];
  rights: RightsMetadata;
  reviewStatus: ReviewStatus;
  reviewerName: string;
  reviewedAt: string;
}

export interface LessonItem {
  id: string;
  slug: string;
  moduleOrder: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  targetAudience: 'Absolute Beginner' | 'Student' | 'Practising Musician';
  coreConcept: string;
  explanation: string;
  listeningObjective: string;
  practicePrompt: string;
  interactiveTool: 'shruti' | 'tala' | 'none';
  sources: SourceMetadata[];
}

export interface GlossaryTerm {
  term: string;
  transliteration?: string;
  category: 'Fundamentals' | 'Rhythm' | 'Melody' | 'Structure' | 'Aesthetics';
  simpleExplanation: string;
  detailedContext: string;
  relatedTerms: string[];
  sources: SourceMetadata[];
}
