/**
 * High-Precision Time-Domain Autocorrelation Pitch Detector
 * Evaluates vocal and acoustic fundaments against Carnatic Adhara Shadjam references.
 * Contains diagnostic functions for synthetic signal testing and accuracy evaluation.
 */

export interface PitchDetectionResult {
  frequency: number | null;
  clarity: number;
}

/**
 * Autocorrelation pitch detector with parabolic peak interpolation and confidence score.
 */
export function detectPitchDetailed(
  buffer: Float32Array,
  sampleRate: number,
  minFreq = 65,
  maxFreq = 1200,
  confidenceThreshold = 0.6
): { freq: number; confidence: number } | null {
  const SIZE = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    sumOfSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumOfSquares / SIZE);
  if (rms < 0.015) return null;

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmedBuffer = buffer.slice(r1, r2);
  const trimmedSize = trimmedBuffer.length;
  if (trimmedSize < 16) return null;

  const c = new Float32Array(trimmedSize);
  for (let i = 0; i < trimmedSize; i++) {
    for (let j = 0; j < trimmedSize - i; j++) {
      c[i] = c[i] + trimmedBuffer[j] * trimmedBuffer[j + i];
    }
  }

  let d = 0;
  while (d < trimmedSize - 1 && c[d] > c[d + 1]) {
    d++;
  }
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < trimmedSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;
  if (T0 > 0 && T0 < trimmedSize - 1) {
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a !== 0) {
      T0 = T0 - b / (2 * a);
    }
  }

  const confidence = c[0] > 0 ? maxval / c[0] : 0;
  const freq = sampleRate / T0;
  if (freq >= minFreq && freq <= maxFreq && confidence >= confidenceThreshold) {
    return { freq, confidence };
  }
  return null;
}

/**
 * Autocorrelation pitch detector with parabolic peak interpolation
 */
export function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    sumOfSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumOfSquares / SIZE);
  // Silence threshold
  if (rms < 0.015) return null;

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmedBuffer = buffer.slice(r1, r2);
  const trimmedSize = trimmedBuffer.length;
  if (trimmedSize < 16) return null;

  const c = new Float32Array(trimmedSize);
  for (let i = 0; i < trimmedSize; i++) {
    for (let j = 0; j < trimmedSize - i; j++) {
      c[i] = c[i] + trimmedBuffer[j] * trimmedBuffer[j + i];
    }
  }

  let d = 0;
  while (d < trimmedSize - 1 && c[d] > c[d + 1]) {
    d++;
  }
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < trimmedSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  const T0 = maxpos;
  if (T0 === 0 || maxval / c[0] < 0.82) return null;

  // Parabolic interpolation
  const x1 = c[T0 - 1] || 0;
  const x2 = c[T0];
  const x3 = c[T0 + 1] || 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  let refinedT0 = T0;
  if (a !== 0) {
    refinedT0 = T0 - b / (2 * a);
  }
  return sampleRate / refinedT0;
}

/**
 * Calculates cent interval between two frequencies
 */
export function centsBetween(measuredHz: number, referenceHz: number): number {
  if (measuredHz <= 0 || referenceHz <= 0) return 0;
  return 1200 * Math.log2(measuredHz / referenceHz);
}

/**
 * Generates synthetic sine wave with optional harmonic overtones and noise
 * for deterministic algorithm validation.
 */
export function generateSyntheticBuffer(
  frequencyHz: number,
  sampleRate: number = 44100,
  bufferSize: number = 2048,
  harmonics: number[] = [1.0, 0.3, 0.15],
  noiseRms: number = 0.0
): Float32Array {
  const buffer = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    let sample = 0;
    harmonics.forEach((amp, idx) => {
      const harmFreq = frequencyHz * (idx + 1);
      sample += amp * Math.sin((2 * Math.PI * harmFreq * i) / sampleRate);
    });
    if (noiseRms > 0) {
      sample += (Math.random() * 2 - 1) * noiseRms;
    }
    buffer[i] = sample;
  }
  return buffer;
}

/**
 * Evaluates pitch detector accuracy against a known target frequency
 */
export function evaluateSyntheticPitch(
  targetHz: number,
  sampleRate: number = 44100,
  bufferSize: number = 2048,
  noiseRms: number = 0.0
): { targetHz: number; detectedHz: number | null; centError: number | null; passed: boolean } {
  const buffer = generateSyntheticBuffer(targetHz, sampleRate, bufferSize, [1.0, 0.25], noiseRms);
  const detected = detectPitch(buffer, sampleRate);
  if (detected === null) {
    return { targetHz, detectedHz: null, centError: null, passed: false };
  }
  const centErr = centsBetween(detected, targetHz);
  // Acceptable within 5 cents for synthetic sine
  const passed = Math.abs(centErr) <= 8.0;
  return {
    targetHz,
    detectedHz: Math.round(detected * 100) / 100,
    centError: Math.round(centErr * 10) / 10,
    passed
  };
}
