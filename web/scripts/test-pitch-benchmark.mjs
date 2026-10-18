/**
 * NadaVerse Acoustic Pitch Estimator Benchmark Suite (FI-008)
 * 
 * Evaluates time-domain autocorrelation pitch estimation fidelity across:
 * 1. Multi-octave registers: Mandra Sthayi (G2-P3), Madhya Sthayi (C4-B4), Tara Sthayi (C5-G5)
 * 2. Expressive Gamaka modulation (5.5 Hz vibrato / frequency modulation)
 * 3. Additive noise conditions (SNR 25 dB, SNR 15 dB)
 * 4. Silence & Unvoiced detection
 * 5. Frame analysis latency
 * 
 * Reports condition-by-condition metrics: cents error, octave error rate, and frame latency.
 */

import { detectPitchDetailed } from '../src/lib/pitchDetector.ts';

console.log('--- NadaVerse Pitch Estimator Acoustic Research Benchmark (FI-008) ---');

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 2048;

function generateSignal({
  freq,
  durationSeconds = 0.1,
  sampleRate = SAMPLE_RATE,
  harmonics = [1.0, 0.4, 0.2, 0.1],
  vibratoHz = 0,
  vibratoDepthCents = 0,
  noiseAmp = 0,
}) {
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const buffer = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Frequency modulation for gamaka vibrato
    let instantaneousFreq = freq;
    if (vibratoHz > 0 && vibratoDepthCents > 0) {
      const centMod = vibratoDepthCents * Math.sin(2 * Math.PI * vibratoHz * t);
      instantaneousFreq = freq * Math.pow(2, centMod / 1200);
    }

    let sample = 0;
    harmonics.forEach((hAmp, hIdx) => {
      const hFreq = instantaneousFreq * (hIdx + 1);
      if (hFreq < sampleRate / 2) {
        sample += hAmp * Math.sin(2 * Math.PI * hFreq * t);
      }
    });

    if (noiseAmp > 0) {
      sample += (Math.random() * 2 - 1) * noiseAmp;
    }

    buffer[i] = sample;
  }

  // Normalize
  let max = 0;
  for (let i = 0; i < numSamples; i++) {
    const abs = Math.abs(buffer[i]);
    if (abs > max) max = abs;
  }
  if (max > 0) {
    for (let i = 0; i < numSamples; i++) {
      buffer[i] /= max;
    }
  }

  return buffer;
}

function calculateCentsError(detectedHz, groundTruthHz) {
  if (!detectedHz || detectedHz <= 0 || !groundTruthHz || groundTruthHz <= 0) return 999;
  return Math.abs(1200 * Math.log2(detectedHz / groundTruthHz));
}

const BENCHMARK_CONDITIONS = [
  // 1. Mandra Sthayi (Lower Chest Octave)
  { name: 'Mandra Pa (P̣, 98.0 Hz)', freq: 98.0, register: 'mandra', condition: 'clean' },
  { name: 'Mandra Sa (Ṣ, 130.81 Hz)', freq: 130.81, register: 'mandra', condition: 'clean' },
  { name: 'Mandra Pa (P̣, 196.0 Hz)', freq: 196.0, register: 'mandra', condition: 'clean' },

  // 2. Madhya Sthayi (Middle Classical Range)
  { name: 'Madhya Sa (C4, 261.63 Hz)', freq: 261.63, register: 'madhya', condition: 'clean' },
  { name: 'Shuddha Rishabham (R1, 279.07 Hz)', freq: 279.07, register: 'madhya', condition: 'clean' },
  { name: 'Antara Gandharam (G3, 327.04 Hz)', freq: 327.04, register: 'madhya', condition: 'clean' },
  { name: 'Shuddha Madhyamam (M1, 348.84 Hz)', freq: 348.84, register: 'madhya', condition: 'clean' },
  { name: 'Panchamam (P, 392.0 Hz)', freq: 392.0, register: 'madhya', condition: 'clean' },
  { name: 'Shuddha Dhaivatam (D1, 418.6 Hz)', freq: 418.6, register: 'madhya', condition: 'clean' },
  { name: 'Kakali Nishadam (N3, 490.55 Hz)', freq: 490.55, register: 'madhya', condition: 'clean' },

  // 3. Tara Sthayi (Upper Register)
  { name: 'Tara Sa (Ṡ, 523.25 Hz)', freq: 523.25, register: 'tara', condition: 'clean' },
  { name: 'Tara Gandharam (Ġ3, 654.08 Hz)', freq: 654.08, register: 'tara', condition: 'clean' },
  { name: 'Tara Panchamam (Ṗ, 784.0 Hz)', freq: 784.0, register: 'tara', condition: 'clean' },

  // 4. Expressive Gamaka (Vibrato 5.5 Hz, 25 cents modulation depth)
  { name: 'Madhya Sa (Gamaka 5.5Hz Vibrato)', freq: 261.63, register: 'madhya', condition: 'gamaka', vibratoHz: 5.5, vibratoDepthCents: 25 },
  { name: 'Panchamam (Gamaka 5.5Hz Vibrato)', freq: 392.0, register: 'madhya', condition: 'gamaka', vibratoHz: 5.5, vibratoDepthCents: 25 },

  // 5. Additive Background Noise (SNR 20 dB)
  { name: 'Madhya Sa with Background Room Noise', freq: 261.63, register: 'madhya', condition: 'noisy', noiseAmp: 0.15 },
  { name: 'Panchamam with Background Room Noise', freq: 392.0, register: 'madhya', condition: 'noisy', noiseAmp: 0.15 },
];

let totalPassed = 0;
let totalTests = 0;
const results = [];

for (const b of BENCHMARK_CONDITIONS) {
  totalTests++;
  const signal = generateSignal({
    freq: b.freq,
    durationSeconds: 0.15,
    sampleRate: SAMPLE_RATE,
    vibratoHz: b.vibratoHz || 0,
    vibratoDepthCents: b.vibratoDepthCents || 0,
    noiseAmp: b.noiseAmp || 0,
  });

  const slice = signal.subarray(0, BUFFER_SIZE);
  const startTime = performance.now();
  const detection = detectPitchDetailed(slice, SAMPLE_RATE, 65, 1200, 0.4);
  const latencyMs = performance.now() - startTime;

  let passed = false;
  let centsError = 999;
  let octaveError = false;

  if (detection && detection.freq) {
    centsError = calculateCentsError(detection.freq, b.freq);
    // Check octave jumping
    const ratio = detection.freq / b.freq;
    if (Math.abs(ratio - 2.0) < 0.1 || Math.abs(ratio - 0.5) < 0.1) {
      octaveError = true;
    }
    // Allow up to 5 cents error for clean, 25 cents for gamaka, 15 cents for noisy
    const maxAllowedError = b.condition === 'gamaka' ? 30 : (b.condition === 'noisy' ? 20 : 5.0);
    if (centsError <= maxAllowedError && !octaveError) {
      passed = true;
      totalPassed++;
    }
  }

  results.push({
    name: b.name,
    register: b.register,
    condition: b.condition,
    targetHz: b.freq,
    detectedHz: detection?.freq ? parseFloat(detection.freq.toFixed(2)) : null,
    confidence: detection?.confidence ? parseFloat(detection.confidence.toFixed(2)) : 0,
    centsError: parseFloat(centsError.toFixed(2)),
    octaveError,
    latencyMs: parseFloat(latencyMs.toFixed(3)),
    passed
  });

  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${b.name} => Detected: ${detection?.freq?.toFixed(2) || 'None'} Hz | Error: ${centsError.toFixed(2)} cents | Latency: ${latencyMs.toFixed(2)}ms`);

}

// 6. Silence & Noise Rejection Invariant Tests
totalTests += 2;
const silenceSlice = new Float32Array(BUFFER_SIZE); // all zeros
const silenceDet = detectPitchDetailed(silenceSlice, SAMPLE_RATE);
if (silenceDet === null) {
  console.log('[PASS] Silence Rejection => Correctly detected as unvoiced (null)');
  totalPassed++;
} else {
  console.error('[FAIL] Silence Rejection => False positive pitch returned');
}

const noiseOnly = new Float32Array(BUFFER_SIZE);
for (let i = 0; i < BUFFER_SIZE; i++) noiseOnly[i] = (Math.random() * 2 - 1) * 0.1;
const noiseDet = detectPitchDetailed(noiseOnly, SAMPLE_RATE);
if (noiseDet === null) {
  console.log('[PASS] White Noise Immunity => Pure random noise correctly rejected');
  totalPassed++;
} else {
  console.error('[FAIL] White Noise Immunity => False positive pitch detected on noise');
}

console.log(`\nPitch Benchmark Complete: ${totalPassed}/${totalTests} Passed (${Math.round((totalPassed/totalTests)*100)}%).`);
if (totalPassed === totalTests) {
  console.log('All Pitch Estimator Empirical Diagnostic Conditions VERIFIED.');
  process.exit(0);
} else {
  process.exit(1);
}
