import { evaluateSyntheticPitch, detectPitch, analyzeSignalQuality, generateSyntheticBuffer } from '../src/lib/pitchDetector.ts';
import {
  mapFrequencyToSwaraCandidates,
  extractHarmonicProfile,
  segmentMonophonicContourToSwaras,
  evaluateExperimentalRagaCandidates
} from '../src/lib/mirEngine.ts';

const testFrequencies = [
  { note: 'Sa (C4)', hz: 261.63 },
  { note: 'R1 (Shuddha Rishabham)', hz: 279.07 },
  { note: 'G3 (Antara Gandharam)', hz: 327.03 },
  { note: 'M1 (Shuddha Madhyamam)', hz: 348.84 },
  { note: 'Pa (Panchamam)', hz: 392.00 },
  { note: 'D1 (Shuddha Dhaivatam)', hz: 418.60 },
  { note: 'N3 (Kakali Nishadam)', hz: 490.55 },
  { note: 'Tara Sa (C5)', hz: 523.25 },
];

console.log('--- NadaVerse Synthetic Pitch Estimator Diagnostic ---');
let allPassed = true;

for (const t of testFrequencies) {
  const res = evaluateSyntheticPitch(t.hz);
  const status = res.passed ? 'PASS' : 'FAIL';
  if (!res.passed) allPassed = false;
  console.log(`[${status}] ${t.note} (${t.hz} Hz) => Detected: ${res.detectedHz} Hz, Error: ${res.centError} cents`);
}

// Test silence
const silentBuffer = new Float32Array(2048);
const silentDetect = detectPitch(silentBuffer, 44100);
if (silentDetect === null) {
  console.log('[PASS] Silence threshold: successfully returned null (no false positive)');
} else {
  console.log(`[FAIL] Silence produced false frequency: ${silentDetect} Hz`);
  allPassed = false;
}

// Test pure noise
const noiseBuffer = new Float32Array(2048);
for (let i = 0; i < 2048; i++) noiseBuffer[i] = (Math.random() * 2 - 1) * 0.05;
const noiseDetect = detectPitch(noiseBuffer, 44100);
if (noiseDetect === null) {
  console.log('[PASS] Noise-only signal: successfully rejected (no false pitch detected)');
} else {
  console.log(`[WARN] Noise signal produced: ${noiseDetect} Hz`);
}

// Test Signal Quality & Clipping Diagnostics
const optimalSig = analyzeSignalQuality(generateSyntheticBuffer(261.63, 44100, 2048, [0.5, 0.15], 0.002));
const clippedBuf = new Float32Array(2048).fill(0.995);
const clippedSig = analyzeSignalQuality(clippedBuf);
if (optimalSig.qualityLabel === 'optimal' && !optimalSig.isClipping && clippedSig.isClipping && clippedSig.qualityLabel === 'clipping') {
  console.log('[PASS] On-device SignalQualityAnalyzer detects optimal SNR and hardware clipping');
} else {
  console.log('[FAIL] SignalQualityAnalyzer diagnostic mismatch');
  allPassed = false;
}

// Test NadaVerse 2.0 MIR Engine (Swara Candidates, Harmonic Profile, Monophonic Segmentation, Experimental Raga ID)
const cands = mapFrequencyToSwaraCandidates(392.44, 261.63);
const hp = extractHarmonicProfile(generateSyntheticBuffer(261.63, 44100, 2048, [1.0, 0.5, 0.25]), 44100, 261.63);
const segs = segmentMonophonicContourToSwaras(
  [
    { timeSec: 0.0, freqHz: 261.63, confidence: 0.95 },
    { timeSec: 0.2, freqHz: 261.63, confidence: 0.95 },
    { timeSec: 0.4, freqHz: 327.04, confidence: 0.94 },
    { timeSec: 0.6, freqHz: 327.04, confidence: 0.94 },
  ],
  261.63,
  80
);
const ragaRec = evaluateExperimentalRagaCandidates(['G3', 'P', 'N3', 'S', 'N3', 'P', 'G3', 'R2', 'S']);
const unknownRec = evaluateExperimentalRagaCandidates(['S', 'R1']);

if (
  cands[0]?.swara === 'P' &&
  hp.harmonicsNormalized[0] === 1 &&
  segs.length === 2 &&
  ragaRec.topCandidates[0]?.ragaSlug === 'hamsadhwani' &&
  unknownRec.status === 'unknown_or_ambiguous'
) {
  console.log('[PASS] NadaVerse 2.0 MIR Engine verifies Swara mapping, harmonics, monophonic segmentation & experimental raga recognition');
} else {
  console.log('[FAIL] NadaVerse 2.0 MIR Engine check failed');
  allPassed = false;
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('All synthetic pitch tests PASSED.');
}
