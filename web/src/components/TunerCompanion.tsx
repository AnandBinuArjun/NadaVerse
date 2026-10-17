'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Info, Activity, ShieldCheck } from 'lucide-react';
import { TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';
import { practiceShortcuts } from '../lib/practiceShortcuts';

interface TunerCompanionProps {
  activeTonic?: TonicNote;
  onOpenPrivacy?: () => void;
}

interface SwarasthanaDef {
  symbol: string;
  name: string;
  nameMl: string;
  semitoneOffset: number;
  justRatio: number;
}

const CARNATIC_SWARASTHANAS: SwarasthanaDef[] = [
  { symbol: 'S', name: 'Shadjam', nameMl: 'ഷഡ്ജം', semitoneOffset: 0, justRatio: 1.0 },
  { symbol: 'R₁', name: 'Shuddha Rishabham', nameMl: 'ശുദ്ധ രിഷഭം', semitoneOffset: 1, justRatio: 16 / 15 },
  { symbol: 'R₂ / G₁', name: 'Chatushruti Rishabham', nameMl: 'ചതുശ്രുതി രിഷഭം', semitoneOffset: 2, justRatio: 9 / 8 },
  { symbol: 'G₂ / R₃', name: 'Sadharana Gandharam', nameMl: 'സാധാരണ ഗാന്ധാരം', semitoneOffset: 3, justRatio: 6 / 5 },
  { symbol: 'G₃', name: 'Antara Gandharam', nameMl: 'അന്തര ഗാന്ധാരം', semitoneOffset: 4, justRatio: 5 / 4 },
  { symbol: 'M₁', name: 'Shuddha Madhyamam', nameMl: 'ശുദ്ധ മധ്യമം', semitoneOffset: 5, justRatio: 4 / 3 },
  { symbol: 'M₂', name: 'Prati Madhyamam', nameMl: 'പ്രതി മധ്യമം', semitoneOffset: 6, justRatio: 45 / 32 },
  { symbol: 'P', name: 'Panchamam', nameMl: 'പഞ്ചമം', semitoneOffset: 7, justRatio: 3 / 2 },
  { symbol: 'D₁', name: 'Shuddha Dhaivatam', nameMl: 'ശുദ്ധ ധൈവതം', semitoneOffset: 8, justRatio: 8 / 5 },
  { symbol: 'D₂ / N₁', name: 'Chatushruti Dhaivatam', nameMl: 'ചതുശ്രുതി ധൈവതം', semitoneOffset: 9, justRatio: 27 / 16 },
  { symbol: 'N₂ / D₃', name: 'Kaisiki Nishadam', nameMl: 'കൈശികി നിഷാദം', semitoneOffset: 10, justRatio: 9 / 5 },
  { symbol: 'N₃', name: 'Kakali Nishadam', nameMl: 'കാകളി നിഷാദം', semitoneOffset: 11, justRatio: 15 / 8 },
];

export const TunerCompanion: React.FC<TunerCompanionProps> = ({
  activeTonic = TONIC_OPTIONS[0], // default C (261.63 Hz)
  onOpenPrivacy
}) => {
  const { lang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [detectedHz, setDetectedHz] = useState<number | null>(null);
  const [identifiedSwara, setIdentifiedSwara] = useState<SwarasthanaDef | null>(null);
  const [centsDiff, setCentsDiff] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [stabilityScore, setStabilityScore] = useState<number>(0);
  const [pitchHistory, setPitchHistory] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const recentCentsRef = useRef<number[]>([]);

  const stopListening = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsListening(false);
    setDetectedHz(null);
    setIdentifiedSwara(null);
    recentCentsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Autocorrelation pitch detection algorithm
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): { freq: number; confidence: number } | null => {
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      sumOfSquares += buffer[i] * buffer[i];
    }
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    if (rootMeanSquare < 0.015) {
      return null;
    }

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
    const c = new Array(trimmedSize).fill(0);

    for (let i = 0; i < trimmedSize; i++) {
      for (let j = 0; j < trimmedSize - i; j++) {
        c[i] = c[i] + trimmedBuffer[j] * trimmedBuffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxVal = -1;
    let maxPos = -1;
    for (let i = d; i < trimmedSize; i++) {
      if (c[i] > maxVal) {
        maxVal = c[i];
        maxPos = i;
      }
    }

    let T0 = maxPos;
    if (T0 > 0 && T0 < trimmedSize - 1) {
      const x1 = c[T0 - 1];
      const x2 = c[T0];
      const x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) {
        T0 = T0 - b / (2 * a);
      }
    }

    const confidence = maxVal / c[0];
    const freq = sampleRate / T0;
    if (freq >= 65 && freq <= 1200 && confidence > 0.6) {
      return { freq, confidence };
    }
    return null;
  };

  const updatePitch = () => {
    if (!analyserRef.current || !audioCtxRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const result = autoCorrelate(buffer, audioCtxRef.current.sampleRate);

    if (result) {
      const freq = result.freq;
      setDetectedHz(freq);
      setClarity(Math.round(result.confidence * 100));

      // Calculate cents relative to Adhara Shadjam (Tonic)
      const tonicHz = activeTonic.frequency;
      // Total cents difference from tonic
      const totalCents = 1200 * Math.log2(freq / tonicHz);
      // Normalize to one octave [0, 1200)
      const octCents = ((totalCents % 1200) + 1200) % 1200;

      // Find nearest Swarasthana among the 12 Carnatic positions
      let closestSwara = CARNATIC_SWARASTHANAS[0];
      let minDeviation = 9999;

      for (const sw of CARNATIC_SWARASTHANAS) {
        const swaraJustCents = 1200 * Math.log2(sw.justRatio);
        let diff = octCents - swaraJustCents;
        // Handle wrap-around across the octave boundary
        if (diff > 600) diff -= 1200;
        if (diff < -600) diff += 1200;

        if (Math.abs(diff) < Math.abs(minDeviation)) {
          minDeviation = diff;
          closestSwara = sw;
        }
      }

      const roundedDeviation = Math.round(minDeviation);
      setIdentifiedSwara(closestSwara);
      setCentsDiff(roundedDeviation);

      // Track stability in sliding buffer (last 30 samples)
      recentCentsRef.current.push(roundedDeviation);
      if (recentCentsRef.current.length > 30) recentCentsRef.current.shift();

      const stableFrames = recentCentsRef.current.filter((c) => Math.abs(c) <= 10).length;
      setStabilityScore(Math.round((stableFrames / recentCentsRef.current.length) * 100));

      setPitchHistory((prev) => {
        const next = [...prev, roundedDeviation];
        return next.length > 36 ? next.slice(next.length - 36) : next;
      });
    }

    animFrameIdRef.current = requestAnimationFrame(updatePitch);
  };

  const startListening = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: false }
      });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      updatePitch();
    } catch (err: unknown) {
      const error = err as Error;
      setIsListening(false);
      setErrorMessage(
        error.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser settings.'
          : 'Could not access audio device: ' + error.message
      );
    }
  };

  const isListeningRef = useRef(isListening);
  const startListeningRef = useRef(startListening);
  const stopListeningRef = useRef(stopListening);

  useEffect(() => {
    isListeningRef.current = isListening;
    startListeningRef.current = startListening;
    stopListeningRef.current = stopListening;
  });

  useEffect(() => {
    const unsub = practiceShortcuts.subscribe('toggle_tuner', () => {
      if (isListeningRef.current) {
        stopListeningRef.current();
      } else {
        startListeningRef.current();
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 border-b border-[#C7A45B]/20 gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-[#C7A45B]" />
            <span>{lang === 'ml' ? 'ശ്രുതി വിശകലന യന്ത്രം' : 'Pitch & Swara Analyzer'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'തത്സമയ സ്വരസ്ഥാന ട്യൂണർ' : 'Intelligent Carnatic Pitch Tuner'}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <p className="text-xs sm:text-sm text-[#BDB4A4]">
              {lang === 'ml' ? 'ആധാര ശ്രുതി:' : 'Reference Adhara Sa:'}{' '}
              <span className="text-[#E0C98F] font-mono font-bold bg-[#C7A45B]/15 px-2 py-0.5 rounded border border-[#C7A45B]/30">
                {activeTonic.name}
              </span>{' '}
              <span className="text-[#BDB4A4]/80">({activeTonic.kattai} · {activeTonic.frequency.toFixed(1)} Hz)</span>
            </p>
            <span className="hidden md:inline-flex items-center space-x-1 text-[11px] font-mono text-[#87947A] bg-[#191916] px-2 py-0.5 rounded-full border border-[#3B392F]">
              <ShieldCheck className="w-3 h-3 text-[#6EA887]" />
              <span>100% Local Browser Pitch Analysis</span>
            </span>
          </div>
        </div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg active:scale-95 w-full sm:w-auto min-h-[42px] ${
            isListening
              ? 'bg-[#E17D73] text-[#11110F] hover:bg-[#F28B82] shadow-[#E17D73]/30 animate-pulse'
              : 'nv-gold-btn'
          }`}
          aria-label={isListening ? 'Stop microphone pitch tuner' : 'Enable microphone pitch tuner'}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>{lang === 'ml' ? 'ട്യൂണർ നിർത്തുക' : 'Stop Tuner'}</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/30 rounded border border-black/20">M</kbd>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>{lang === 'ml' ? 'പിച്ച് ട്യൂണർ തുടങ്ങുക' : 'Enable Pitch Tuner'}</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-[#11110F]/20 rounded border border-[#11110F]/30">M</kbd>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3.5 bg-[#E17D73]/10 border border-[#E17D73]/30 rounded-xl text-xs text-[#E17D73] flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Pitch & Swarasthana Meter */}
      <div className="my-4 sm:my-6 bg-[#0d0c0a]/80 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-[#C7A45B]/20 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {isListening ? (
          <div className="space-y-5 w-full max-w-lg relative z-10">
            {/* Identified Swara & Frequency Display */}
            <div className="space-y-1">
              {identifiedSwara ? (
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#C7A45B]/20 border border-[#C7A45B]/40 text-[#E0C98F] text-xs font-mono mb-2">
                    {lang === 'ml' ? 'കണ്ടെത്തിയ സ്വരസ്ഥാനം' : 'Detected Swarasthana'}
                  </div>
                  <div className="text-4xl sm:text-6xl font-serif font-bold text-[#F4EBDD] drop-shadow-[0_0_25px_rgba(199,164,91,0.3)]">
                    {identifiedSwara.symbol}
                  </div>
                  <div className="text-base sm:text-lg font-serif text-[#C7A45B] mt-1">
                    {lang === 'ml' ? identifiedSwara.nameMl : identifiedSwara.name}
                  </div>
                </div>
              ) : (
                <div className="text-xl sm:text-2xl text-[#C7A45B] animate-pulse py-4 font-serif">
                  {lang === 'ml' ? 'ശബ്ദം ശ്രവിക്കുന്നു...' : 'Listening for vocal or instrument tone...'}
                </div>
              )}

              {detectedHz && (
                <div className="text-xs sm:text-sm font-mono text-[#BDB4A4] pt-1">
                  {detectedHz.toFixed(1)} Hz • {lang === 'ml' ? 'വ്യക്തത:' : 'Clarity:'} {clarity}% • {lang === 'ml' ? 'സ്ഥിരത:' : 'Stability:'} {stabilityScore}%
                </div>
              )}
            </div>

            {/* Cents Deviation Gauge */}
            {detectedHz && identifiedSwara && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#BDB4A4]">
                  <span>-50 cents ({lang === 'ml' ? 'താഴ്ന്നത് / Flat' : 'Flat'})</span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded text-xs transition-colors ${
                      Math.abs(centsDiff) <= 5
                        ? 'bg-[#6EA887]/20 text-[#6EA887] border border-[#6EA887]/40'
                        : Math.abs(centsDiff) <= 15
                        ? 'bg-[#DFB960]/20 text-[#DFB960] border border-[#DFB960]/40'
                        : 'bg-[#E17D73]/20 text-[#E17D73] border border-[#E17D73]/40'
                    }`}
                  >
                    {centsDiff > 0 ? `+${centsDiff}` : centsDiff} cents
                  </span>
                  <span>+50 cents ({lang === 'ml' ? 'ഉയർന്നത് / Sharp' : 'Sharp'})</span>
                </div>

                {/* Visual Deviation Bar */}
                <div className="w-full bg-[#11110F] h-4 rounded-full overflow-hidden border border-[#C7A45B]/30 relative shadow-inner">
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#F4EBDD] -translate-x-1/2 z-20 shadow-md" />
                  <div
                    className={`h-full transition-all duration-75 rounded-full ${
                      Math.abs(centsDiff) <= 5
                        ? 'bg-gradient-to-r from-[#6EA887] to-[#87947A] shadow-[0_0_12px_rgba(110,168,135,0.7)]'
                        : Math.abs(centsDiff) <= 15
                        ? 'bg-gradient-to-r from-[#C7A45B] to-[#DFB960] shadow-[0_0_10px_rgba(199,164,91,0.5)]'
                        : 'bg-gradient-to-r from-[#E17D73] to-[#c75d52]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, 50 + centsDiff))}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Pitch History Sparkline Strip */}
            {pitchHistory.length > 5 && (
              <div className="bg-[#11110f]/80 p-3 rounded-xl border border-[#C7A45B]/20">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#87947A] mb-1.5">
                  <span>Pitch Stability History</span>
                  <span>{stabilityScore}% in-tune</span>
                </div>
                <div className="flex items-end justify-center space-x-1 h-8">
                  {pitchHistory.map((val, idx) => {
                    const heightPercent = Math.max(15, Math.min(100, 100 - Math.abs(val) * 2));
                    const isTune = Math.abs(val) <= 5;
                    return (
                      <div
                        key={idx}
                        className={`w-1.5 sm:w-2 rounded-t transition-all ${
                          isTune ? 'bg-[#6EA887]' : Math.abs(val) <= 15 ? 'bg-[#DFB960]' : 'bg-[#E17D73]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${val} cents`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-3 text-[#BDB4A4] max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#C7A45B]/10 border border-[#C7A45B]/25 flex items-center justify-center mx-auto text-[#C7A45B]">
              <Mic className="w-7 h-7" />
            </div>
            <p className="text-sm text-[#F4EBDD]/90 font-serif">
              {lang === 'ml'
                ? 'ട്യൂണർ ഇപ്പോൾ നിർജ്ജീവമാണ്. തത്സമയ പിച്ച് വിശകലനത്തിനായി "പിച്ച് ട്യൂണർ തുടങ്ങുക" അമർത്തുക.'
                : 'Tuner is currently idle. Click "Enable Pitch Tuner" to begin real-time pitch analysis.'}
            </p>
            {onOpenPrivacy ? (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[11px] font-mono inline-block text-[#87947A] hover:text-[#A1B88F] bg-[#87947A]/10 hover:bg-[#87947A]/20 py-1 px-2.5 rounded-lg border border-[#87947A]/20 transition-colors cursor-pointer"
              >
                {lang === 'ml'
                  ? '🔒 മൈക്രോഫോൺ വിവരങ്ങൾ പൂർണ്ണമായും സ്വകാര്യമാണ് (വിവരങ്ങൾ കാണുക)'
                  : '🔒 Microphone access is private & processed 100% locally on your device (View Privacy)'}
              </button>
            ) : (
              <span className="text-[11px] font-mono block text-[#87947A] bg-[#87947A]/10 py-1 px-2.5 rounded-lg border border-[#87947A]/20">
                {lang === 'ml'
                  ? 'മൈക്രോഫോൺ വിവരങ്ങൾ പൂർണ്ണമായും സ്വകാര്യമാണ്, ഉപകരണത്തിൽ തന്നെ പ്രോസസ്സ് ചെയ്യുന്നു.'
                  : 'Microphone access is private, permission-aware, and processed 100% locally on your device.'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Acoustic Disclaimers & Integrity Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#BDB4A4]">
        <div className="flex items-start space-x-3 bg-[#0d0c0a]/60 p-4 rounded-2xl border border-[#C7A45B]/20">
          <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-[#E0C98F]">{lang === 'ml' ? 'കർണ്ണാടക സംഗീത കൃത്യതാ തത്വം:' : 'Pitch vs. Swara Context:'}</strong>{' '}
            {lang === 'ml'
              ? 'ഹെർട്സിലുള്ള ആവൃത്തി കേവല ഡാറ്റ മാത്രമാണ്. കർണ്ണാടക സംഗീതത്തിൽ രാഗ ഭാവവും ഗമക സഞ്ചാരവും ചേരുമ്പോഴാണ് സ്വരത്തിന് ജീവൻ വരുന്നത്.'
              : 'Physical pitch is measured in Hertz, but Carnatic swaras exist in relationship to the Adhara Shadjam (Tonic) and express through nuanced gamaka oscillations.'}
          </span>
        </div>

        <div className="flex items-start space-x-3 bg-[#0d0c0a]/60 p-4 rounded-2xl border border-[#C7A45B]/20">
          <AlertCircle className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-[#E0C98F]">{lang === 'ml' ? 'ശബ്ദ പരിമിതികൾ:' : 'Acoustic Environment:'}</strong>{' '}
            {lang === 'ml'
              ? 'ഏകസ്വര ആലാപനത്തിലാണ് ട്യൂണർ ഏറ്റവും കൃത്യമായി പ്രവർത്തിക്കുന്നത്. മൃദംഗ നാദവും പശ്ചാത്തല ശബ്ദങ്ങളും കൃത്യതയെ ബാധിച്ചേക്കാം.'
              : 'Optimized for clean monophonic voice or solo instruments. Background noise, percussion, or heavy reverberation will affect detection stability.'}
          </span>
        </div>
      </div>
    </div>
  );
};
