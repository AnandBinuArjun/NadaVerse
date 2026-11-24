/**
 * NadaVerse 2.0 — Browser-Local Music Information Retrieval (MIR) Engine
 *
 * Implements:
 * 1. Swarasthana candidate mapping & microtonal cent deviation relative to Adhara Shadjam.
 * 2. Harmonic partial extraction (H1..H6) & spectral centroid estimation via Goertzel/DFT projection.
 * 3. Monophonic vocal/violin pitch contour segmentation into swara tokens with gamaka inflection tagging.
 * 4. Deterministic Experimental Raga Candidate Recognition combining Swara distribution + Characteristic Prayoga N-grams.
 *
 * Privacy & Honesty Guarantees:
 * - Executes 100% locally in the browser; zero raw audio leaves the device.
 * - Experimental Raga Recognition is explicitly labeled [EXPERIMENTAL] and rejects unknown/low-confidence input.
 */

export interface SwaraCandidate {
  swara: string;
  fullName: string;
  ratio: number;
  idealCentsInOctave: number;
  octave: 'mandra' | 'madhya' | 'tara';
  centDeviation: number;
  confidence: number;
}

export interface HarmonicProfile {
  fundamentalHz: number;
  harmonicsNormalized: number[]; // [H1, H2, H3, H4, H5, H6] in 0..1
  spectralCentroidHz: number;
  harmonicRichnessPct: number;
}

export interface PitchContourFrame {
  timeSec: number;
  freqHz: number;
  confidence: number;
}

export interface TranscribedSwaraSegment {
  id: string;
  swara: string;
  octave: 'mandra' | 'madhya' | 'tara';
  startTimeSec: number;
  durationSec: number;
  estimatedAksharas: number;
  meanFreqHz: number;
  meanCentDeviation: number;
  confidence: number;
  gamakaTag: 'steady' | 'kampita' | 'jaru';
}

export interface RagaRecognitionCandidate {
  ragaSlug: string;
  ragaName: string;
  melakartaNumber: number;
  parentOrType: string;
  confidencePct: number;
  matchedPrayogas: string[];
  swaraCoveragePct: number;
  explanation: string;
}

export interface RagaRecognitionReport {
  isExperimental: true;
  status: 'candidates_found' | 'unknown_or_ambiguous';
  inputSwaraSequence: string[];
  topCandidates: RagaRecognitionCandidate[];
  rejectionReason?: string;
  limitationsNotice: string;
}

const CANONICAL_SWARASTHANAS: { swara: string; fullName: string; ratio: number; cents: number }[] = [
  { swara: 'S', fullName: 'Shadjam', ratio: 1.0, cents: 0 },
  { swara: 'R1', fullName: 'Shuddha Rishabham', ratio: 16 / 15, cents: 111.73 },
  { swara: 'R2', fullName: 'Chatushruti Rishabham', ratio: 9 / 8, cents: 203.91 },
  { swara: 'G2', fullName: 'Sadharana Gandharam', ratio: 6 / 5, cents: 315.64 },
  { swara: 'G3', fullName: 'Antara Gandharam', ratio: 5 / 4, cents: 386.31 },
  { swara: 'M1', fullName: 'Shuddha Madhyamam', ratio: 4 / 3, cents: 498.04 },
  { swara: 'M2', fullName: 'Prati Madhyamam', ratio: 45 / 32, cents: 590.22 },
  { swara: 'P', fullName: 'Panchamam', ratio: 3 / 2, cents: 701.96 },
  { swara: 'D1', fullName: 'Shuddha Dhaivatam', ratio: 8 / 5, cents: 813.69 },
  { swara: 'D2', fullName: 'Chatushruti Dhaivatam', ratio: 5 / 3, cents: 884.36 },
  { swara: 'N2', fullName: 'Kaisiki Nishadam', ratio: 9 / 5, cents: 1017.60 },
  { swara: 'N3', fullName: 'Kakali Nishadam', ratio: 15 / 8, cents: 1088.27 },
];

/**
 * Maps a measured frequency in Hz to ranked Carnatic Swarasthana candidates relative to Adhara Shadjam.
 */
export function mapFrequencyToSwaraCandidates(
  freqHz: number,
  tonicHz = 261.63
): SwaraCandidate[] {
  if (freqHz <= 0 || tonicHz <= 0) return [];

  const totalCents = 1200 * Math.log2(freqHz / tonicHz);
  let octave: SwaraCandidate['octave'] = 'madhya';
  if (totalCents < -50) {
    octave = 'mandra';
  } else if (totalCents >= 1150) {
    octave = 'tara';
  }

  // Normalize cents into [0, 1200)
  const modCents = ((totalCents % 1200) + 1200) % 1200;

  const candidates: SwaraCandidate[] = CANONICAL_SWARASTHANAS.map((ref) => {
    let diff = modCents - ref.cents;
    if (diff > 600) diff -= 1200;
    if (diff < -600) diff += 1200;

    const absDiff = Math.abs(diff);
    const proximityConfidence = Math.max(0, Math.min(1, 1 - absDiff / 120));

    return {
      swara: ref.swara,
      fullName: ref.fullName,
      ratio: ref.ratio,
      idealCentsInOctave: Math.round(ref.cents),
      octave,
      centDeviation: Math.round(diff * 10) / 10,
      confidence: Math.round(proximityConfidence * 100) / 100,
    };
  });

  candidates.sort((a, b) => Math.abs(a.centDeviation) - Math.abs(b.centDeviation));
  return candidates.slice(0, 3);
}

/**
 * Extracts normalized harmonic partial amplitudes (H1..H6) and spectral centroid at a given F0.
 */
export function extractHarmonicProfile(
  buffer: Float32Array,
  sampleRate: number,
  fundamentalHz: number
): HarmonicProfile {
  if (!buffer.length || fundamentalHz <= 20) {
    return {
      fundamentalHz: 0,
      harmonicsNormalized: [0, 0, 0, 0, 0, 0],
      spectralCentroidHz: 0,
      harmonicRichnessPct: 0,
    };
  }

  const N = Math.min(buffer.length, 2048);
  const rawMagnitudes: number[] = [];

  for (let h = 1; h <= 6; h++) {
    const targetFreq = fundamentalHz * h;
    if (targetFreq >= sampleRate / 2) {
      rawMagnitudes.push(0);
      continue;
    }
    let real = 0;
    let imag = 0;
    const omega = (2 * Math.PI * targetFreq) / sampleRate;
    for (let n = 0; n < N; n++) {
      real += buffer[n] * Math.cos(omega * n);
      imag -= buffer[n] * Math.sin(omega * n);
    }
    const mag = Math.sqrt(real * real + imag * imag) / N;
    rawMagnitudes.push(mag);
  }

  const maxMag = Math.max(0.0001, ...rawMagnitudes);
  const harmonicsNormalized = rawMagnitudes.map((m) => Math.round((m / maxMag) * 100) / 100);

  let weightedFreqSum = 0;
  let totalWeight = 0;
  harmonicsNormalized.forEach((amp, idx) => {
    const f = fundamentalHz * (idx + 1);
    weightedFreqSum += f * amp;
    totalWeight += amp;
  });

  const spectralCentroidHz = totalWeight > 0 ? Math.round(weightedFreqSum / totalWeight) : Math.round(fundamentalHz);
  const overtoneEnergy = harmonicsNormalized.slice(1).reduce((a, b) => a + b, 0);
  const harmonicRichnessPct = Math.min(100, Math.round((overtoneEnergy / 2.5) * 100));

  return {
    fundamentalHz: Math.round(fundamentalHz * 10) / 10,
    harmonicsNormalized,
    spectralCentroidHz,
    harmonicRichnessPct,
  };
}

/**
 * Segments a monophonic pitch contour into discrete Swara notation tokens with Gamaka inflection tags.
 */
export function segmentMonophonicContourToSwaras(
  frames: PitchContourFrame[],
  tonicHz = 261.63,
  bpm = 80
): TranscribedSwaraSegment[] {
  const voiced = frames.filter((f) => f.freqHz > 50 && f.confidence >= 0.55);
  if (voiced.length === 0) return [];

  const secPerAkshara = 60 / Math.max(30, bpm);
  const rawGroups: {
    swara: string;
    octave: 'mandra' | 'madhya' | 'tara';
    frames: PitchContourFrame[];
    centsList: number[];
  }[] = [];

  voiced.forEach((vf) => {
    const top = mapFrequencyToSwaraCandidates(vf.freqHz, tonicHz)[0];
    if (!top) return;

    const lastGroup = rawGroups[rawGroups.length - 1];
    if (lastGroup && lastGroup.swara === top.swara && lastGroup.octave === top.octave) {
      lastGroup.frames.push(vf);
      lastGroup.centsList.push(top.centDeviation);
    } else {
      rawGroups.push({
        swara: top.swara,
        octave: top.octave,
        frames: [vf],
        centsList: [top.centDeviation],
      });
    }
  });

  return rawGroups
    .filter((g) => g.frames.length >= 2)
    .map((g, idx) => {
      const firstT = g.frames[0].timeSec;
      const lastT = g.frames[g.frames.length - 1].timeSec;
      const durSec = Math.max(0.18, Math.round((lastT - firstT + 0.08) * 100) / 100);
      const rawAksharas = durSec / secPerAkshara;
      const estimatedAksharas = rawAksharas >= 1.5 ? 2 : rawAksharas >= 0.75 ? 1 : 0.5;

      const meanFreqHz =
        Math.round((g.frames.reduce((s, f) => s + f.freqHz, 0) / g.frames.length) * 10) / 10;
      const meanCentDeviation =
        Math.round((g.centsList.reduce((s, c) => s + c, 0) / g.centsList.length) * 10) / 10;
      const meanConf =
        Math.round((g.frames.reduce((s, f) => s + f.confidence, 0) / g.frames.length) * 100) / 100;

      const minC = Math.min(...g.centsList);
      const maxC = Math.max(...g.centsList);
      const spread = maxC - minC;
      let gamakaTag: TranscribedSwaraSegment['gamakaTag'] = 'steady';
      if (spread >= 32) {
        const isMonotonic =
          g.centsList[g.centsList.length - 1] - g.centsList[0] > 28 ||
          g.centsList[0] - g.centsList[g.centsList.length - 1] > 28;
        gamakaTag = isMonotonic ? 'jaru' : 'kampita';
      }

      return {
        id: `seg-${idx + 1}`,
        swara: g.swara,
        octave: g.octave,
        startTimeSec: Math.round(firstT * 100) / 100,
        durationSec: durSec,
        estimatedAksharas,
        meanFreqHz,
        meanCentDeviation,
        confidence: meanConf,
        gamakaTag,
      };
    });
}

interface RagaSignatureProfile {
  slug: string;
  name: string;
  melakartaNumber: number;
  parentOrType: string;
  allowedSwaras: string[];
  signaturePrayogas: string[][];
  jeevaSwaras: string[];
}

const EXPERIMENTAL_RAGA_PROFILES: RagaSignatureProfile[] = [
  {
    slug: 'mayamalavagowla',
    name: 'Mayamalavagowla',
    melakartaNumber: 15,
    parentOrType: '15th Melakarta (Agni Chakra)',
    allowedSwaras: ['S', 'R1', 'G3', 'M1', 'P', 'D1', 'N3'],
    signaturePrayogas: [
      ['S', 'R1', 'G3', 'M1', 'P'],
      ['P', 'D1', 'N3', 'S'],
      ['S', 'N3', 'D1', 'P', 'M1', 'G3', 'R1', 'S'],
      ['G3', 'M1', 'P', 'G3', 'M1', 'R1', 'S'],
    ],
    jeevaSwaras: ['G3', 'M1', 'N3'],
  },
  {
    slug: 'mohanam',
    name: 'Mohanam',
    melakartaNumber: 28,
    parentOrType: 'Audava Janya of 28th Melakarta (Harikambhoji)',
    allowedSwaras: ['S', 'R2', 'G3', 'P', 'D2'],
    signaturePrayogas: [
      ['S', 'R2', 'G3', 'P', 'D2', 'S'],
      ['G3', 'P', 'D2', 'S'],
      ['S', 'D2', 'P', 'G3', 'R2', 'S'],
      ['D2', 'P', 'G3', 'P', 'G3', 'R2', 'S'],
    ],
    jeevaSwaras: ['G3', 'P', 'D2'],
  },
  {
    slug: 'hamsadhwani',
    name: 'Hamsadhwani',
    melakartaNumber: 29,
    parentOrType: 'Audava Janya of 29th Melakarta (Shankarabharanam)',
    allowedSwaras: ['S', 'R2', 'G3', 'P', 'N3'],
    signaturePrayogas: [
      ['S', 'R2', 'G3', 'P', 'N3', 'S'],
      ['G3', 'P', 'N3', 'S'],
      ['S', 'N3', 'P', 'G3', 'R2', 'S'],
      ['P', 'N3', 'P', 'G3', 'R2', 'S'],
    ],
    jeevaSwaras: ['G3', 'P', 'N3'],
  },
  {
    slug: 'mechakalyani',
    name: 'Mechakalyani (Kalyani)',
    melakartaNumber: 65,
    parentOrType: '65th Melakarta (Rudra Chakra)',
    allowedSwaras: ['S', 'R2', 'G3', 'M2', 'P', 'D2', 'N3'],
    signaturePrayogas: [
      ['S', 'R2', 'G3', 'M2', 'P', 'D2', 'N3', 'S'],
      ['G3', 'M2', 'P', 'D2', 'N3'],
      ['N3', 'D2', 'P', 'M2', 'G3', 'R2', 'S'],
    ],
    jeevaSwaras: ['G3', 'M2', 'N3'],
  },
  {
    slug: 'hindolam',
    name: 'Hindolam',
    melakartaNumber: 20,
    parentOrType: 'Audava Janya of 20th Melakarta (Natabhairavi)',
    allowedSwaras: ['S', 'G2', 'M1', 'D1', 'N2'],
    signaturePrayogas: [
      ['S', 'G2', 'M1', 'D1', 'N2', 'S'],
      ['S', 'N2', 'D1', 'M1', 'G2', 'S'],
      ['G2', 'M1', 'D1', 'N2'],
    ],
    jeevaSwaras: ['G2', 'M1', 'D1'],
  },
  {
    slug: 'kharaharapriya',
    name: 'Kharaharapriya',
    melakartaNumber: 22,
    parentOrType: '22nd Melakarta (Veda Chakra)',
    allowedSwaras: ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N2'],
    signaturePrayogas: [
      ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N2', 'S'],
      ['R2', 'G2', 'M1', 'P', 'D2', 'N2'],
      ['N2', 'D2', 'P', 'M1', 'G2', 'R2', 'S'],
    ],
    jeevaSwaras: ['R2', 'G2', 'D2', 'N2'],
  },
];

/**
 * Deterministic Experimental Raga Recognition combining swara distribution + characteristic prayoga matching.
 * Never claims certainty from scale alone and rejects unknown/low-confidence sequences.
 */
export function evaluateExperimentalRagaCandidates(
  rawSwaraTokens: string[]
): RagaRecognitionReport {
  const cleanTokens = rawSwaraTokens
    .map((t) =>
      t
        .toUpperCase()
        .replace('₁', '1')
        .replace('₂', '2')
        .replace('₃', '3')
        .replace('Ṡ', 'S')
        .replace('Ṣ', 'S')
        .trim()
    )
    .filter((t) => CANONICAL_SWARASTHANAS.some((cs) => cs.swara === t));

  const limitationsNotice =
    '[EXPERIMENTAL RESEARCH LAB] Raga candidates are estimated from monophonic swara distribution and characteristic prayoga n-grams. Living raga swarupa depends on microtonal gamaka, kakus, and sampradaya that require a qualified Carnatic guru.';

  if (cleanTokens.length < 3) {
    return {
      isExperimental: true,
      status: 'unknown_or_ambiguous',
      inputSwaraSequence: cleanTokens,
      topCandidates: [],
      rejectionReason: 'Insufficient phrase length (< 3 swaras). Provide at least 4–8 swaras with a characteristic prayoga.',
      limitationsNotice,
    };
  }

  const joinedInput = cleanTokens.join(' ');
  const uniqueInput = Array.from(new Set(cleanTokens));

  const scored: RagaRecognitionCandidate[] = EXPERIMENTAL_RAGA_PROFILES.map((prof) => {
    const inScaleCount = cleanTokens.filter((t) => prof.allowedSwaras.includes(t)).length;
    const outOfScaleCount = cleanTokens.length - inScaleCount;
    const scalePurity = inScaleCount / cleanTokens.length;

    const distinctMatched = uniqueInput.filter((t) => prof.allowedSwaras.includes(t)).length;
    const swaraCoveragePct = Math.round((distinctMatched / prof.allowedSwaras.length) * 100);

    const matchedPrayogas: string[] = [];
    prof.signaturePrayogas.forEach((prayoga) => {
      const pStr = prayoga.join(' ');
      if (joinedInput.includes(pStr)) {
        matchedPrayogas.push(pStr);
      } else if (prayoga.length >= 4) {
        // Check 3-gram sub-phrases
        for (let i = 0; i <= prayoga.length - 3; i++) {
          const sub = prayoga.slice(i, i + 3).join(' ');
          if (joinedInput.includes(sub) && !matchedPrayogas.includes(sub)) {
            matchedPrayogas.push(sub);
          }
        }
      }
    });

    const prayogaBonus = Math.min(35, matchedPrayogas.length * 16);
    const foreignPenalty = outOfScaleCount * 22;
    const rawScore = Math.max(0, Math.min(96, Math.round(scalePurity * 55 + swaraCoveragePct * 0.2 + prayogaBonus - foreignPenalty)));

    return {
      ragaSlug: prof.slug,
      ragaName: prof.name,
      melakartaNumber: prof.melakartaNumber,
      parentOrType: prof.parentOrType,
      confidencePct: rawScore,
      matchedPrayogas,
      swaraCoveragePct,
      explanation:
        matchedPrayogas.length > 0
          ? `Matched characteristic prayoga (${matchedPrayogas.join(' | ')}) with ${Math.round(scalePurity * 100)}% swara consistency.`
          : `Scalar swara overlap (${swaraCoveragePct}% coverage), but no full signature prayoga sequence detected yet.`,
    };
  });

  scored.sort((a, b) => b.confidencePct - a.confidencePct);
  const viable = scored.filter((c) => c.confidencePct >= 45);

  if (viable.length === 0) {
    return {
      isExperimental: true,
      status: 'unknown_or_ambiguous',
      inputSwaraSequence: cleanTokens,
      topCandidates: scored.slice(0, 2),
      rejectionReason:
        'Unknown or mixed-raga phrase: swara sequence contains vivadi/foreign intervals or lacks a recognizable prayoga above the 45% confidence threshold.',
      limitationsNotice,
    };
  }

  return {
    isExperimental: true,
    status: 'candidates_found',
    inputSwaraSequence: cleanTokens,
    topCandidates: viable.slice(0, 3),
    limitationsNotice,
  };
}
