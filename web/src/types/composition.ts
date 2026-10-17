/**
 * NadaVerse Playable Carnatic Composition Schema & Types
 * 
 * Version: 1.0.0
 * 
 * Defines standard structured models for Keerthanams, Varnams, Geethams,
 * Swarajathis, Varisais, and Violin Practice Pieces.
 * 
 * Key Principles:
 * - Microtonal Just Intonation harmonic ratios relative to Adhara Sa (1.0).
 * - Exact akshara / matra rhythmic durations aligned to Tala cycles.
 * - Continuous pitch curves and gamaka annotations (Kampita, Jaru, Nokku, Spurita, Odukkal).
 * - Flexible section models (Pallavi, Anupallavi, Charanam, Muktayi Swaram, Ettugada Swaram, Varisai).
 * - Optional violin-specific performance guidance (strings 1-4, finger 0-4, down/up bow).
 * - Explicit provenance, treatise citations, and rights records.
 */

import { RightsMetadata, SourceMetadata, ReviewStatus } from './carnatic';

export type CompositionCategory =
  | 'varnam'
  | 'keerthanam'
  | 'geetham'
  | 'swarajathi'
  | 'varisai'
  | 'raga_exercise'
  | 'violin_piece';

export type GamakaType =
  | 'none'
  | 'kampita'   // Oscillation around the swarasthana
  | 'jaru'       // Smooth sliding deflection from/to adjacent swara
  | 'nokku'      // Subtle downward push from above
  | 'spurita'    // Light accented repetition from lower note
  | 'odukkal'    // Staccato micro-pause or choked damp
  | 'kandippu';   // Abrupt deflection

export interface GamakaAnnotation {
  type: GamakaType;
  /**
   * For Jaru (glide): startRatio and endRatio.
   * For Kampita (oscillation): oscillationDepthCents (e.g. 35) and oscillationHz (e.g. 5.5).
   */
  startRatio?: number;
  endRatio?: number;
  oscillationDepthCents?: number;
  oscillationSpeedHz?: number;
  description?: string;
  descriptionMl?: string;
}

export interface ViolinPerformanceAnnotation {
  /**
   * Carnatic Violin string numbering:
   * 1: Tara Sa (Outer right string, ratio 2.0)
   * 2: Madhya Pa (Ratio 1.5)
   * 3: Madhya Sa (Ratio 1.0)
   * 4: Mandra Pa (Outer left string, ratio 0.75)
   */
  string: 1 | 2 | 3 | 4;
  /**
   * Left hand finger:
   * 0: Open string
   * 1: Index finger
   * 2: Middle finger
   * 3: Ring finger
   * 4: Little finger
   */
  finger: 0 | 1 | 2 | 3 | 4;
  /**
   * Bow stroke direction:
   * 'down': Uttana (frog to tip)
   * 'up': Pratyuttana (tip to frog)
   */
  bowDirection: 'down' | 'up';
  positionNote?: string; // e.g. "1st Position", "Shift to 2nd position"
}

export interface SwaraEvent {
  id: string;
  /** Swara glyph representation, e.g. 'S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ', 'Ṙ₁', 'P̣' */
  swara: string;
  /** Octave register */
  octave: 'mandra' | 'madhya' | 'tara';
  /** Pure harmonic Just Intonation frequency ratio relative to Adhara Sa (1.0) */
  ratio: number;
  /** Duration in aksharas / beats (1.0 = 1 full beat, 0.5 = half beat, 2.0 = 2 beats) */
  durationAksharas: number;
  /** Optional sahitya syllable for this swara */
  sahitya?: string;
  sahityaMl?: string;
  /** Optional gamaka expression */
  gamaka?: GamakaAnnotation;
  /** Optional violin-specific fingering & bowing guidance */
  violin?: ViolinPerformanceAnnotation;
}

export interface RhythmicLine {
  lineNumber: number;
  /** Akshara count for this rhythmic cycle or line */
  totalAksharas: number;
  swaras: SwaraEvent[];
  /** Optional line sahityam text */
  sahityaLineText?: string;
  sahityaLineTextMl?: string;
}

export interface CompositionSection {
  id: string; // e.g. 'pallavi', 'anupallavi', 'charanam', 'muktayi_swaram'
  name: string; // e.g. 'Pallavi', 'Anupallavi', 'Muktayi Swaram'
  nameMl: string; // e.g. 'പല്ലവി', 'അനുപല്ലവി'
  order: number;
  lines: RhythmicLine[];
  /** Tala cycle count for this section */
  cycleCount: number;
  /** Section summary and practice pointers */
  pedagogicalFocus?: string;
  pedagogicalFocusMl?: string;
}

export interface CompositionAudioReference {
  type: 'synthetic_browser_generated' | 'curated_licensed_recording' | 'teacher_recording';
  audioUrl?: string;
  performer?: string;
  recordingDate?: string;
  attributionNote?: string;
}

export interface PlayableComposition {
  schemaVersion: '1.0.0';
  id: string;
  slug: string;
  title: string;
  titleMl: string;
  category: CompositionCategory;
  categoryLabelEn: string;
  categoryLabelMl: string;
  ragaName: string;
  ragaMl: string;
  ragaSlug: string;
  melakartaNumber?: number;
  talaName: string;
  talaMl: string;
  talaSlug: string;
  talaTotalAksharas: number; // e.g. 8 for Adi Tala, 14 for Ata Tala, 6 for Rupaka
  talaAngas: string; // e.g. "Laghu (4) + Dhrutam (2) + Dhrutam (2)"
  composerName: string;
  composerMl: string;
  composerSlug: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyMl: string;
  defaultBpm: number;
  slowPracticeBpm: number;
  sections: CompositionSection[];
  audioReference: CompositionAudioReference;
  sources: SourceMetadata[];
  rights: RightsMetadata;
  reviewStatus: ReviewStatus;
  reviewerName: string;
  reviewedAt: string;
  educationalSummary: string;
  educationalSummaryMl: string;
  violinPracticeNotes?: string;
  violinPracticeNotesMl?: string;
}

/**
 * Validation result object
 */
export interface CompositionValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalNotes: number;
  totalDurationAksharas: number;
  sectionCount: number;
}
