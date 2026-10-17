import { evaluateSyntheticPitch, detectPitch } from '../src/lib/pitchDetector.ts';

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

if (!allPassed) {
  process.exit(1);
} else {
  console.log('All synthetic pitch tests PASSED.');
}
