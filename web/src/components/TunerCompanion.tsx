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

export const TunerCompanion: React.FC<TunerCompanionProps> = ({
  activeTonic = TONIC_OPTIONS[0], // default C (261.63 Hz)
  onOpenPrivacy
}) => {
  const { lang, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [detectedHz, setDetectedHz] = useState<number | null>(null);
  const [centsDiff, setCentsDiff] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

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
      setDetectedHz(result.freq);
      setClarity(Math.round(result.confidence * 100));

      const targetHz = activeTonic.frequency;
      const cents = 1200 * Math.log2(result.freq / targetHz);
      const normalizedCents = ((cents + 600) % 1200) - 600;
      setCentsDiff(Math.round(normalizedCents));
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

  useEffect(() => {
    const unsub = practiceShortcuts.subscribe('toggle_tuner', () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    });
    return unsub;
  }, [isListening, stopListening, activeTonic]);

  return (
    <div className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-5 border-b border-[#C7A45B]/20 gap-3 sm:gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-[#C7A45B] animate-pulse" />
            <span>{lang === 'ml' ? 'ശബ്ദ ആവൃത്തി നിരീക്ഷണം' : 'Acoustic Pitch Awareness'}</span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'മൈക്രോഫോൺ പിച്ച് ട്യൂണർ' : 'Microphone Pitch Display & Tuner'}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs text-[#BDB4A4]">
              {lang === 'ml' ? 'ലക്ഷ്യ ശ്രുതി:' : 'Target Reference:'}{' '}
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

      {/* Main Pitch Meter */}
      <div className="my-4 sm:my-6 bg-[#0d0c0a]/80 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-[#C7A45B]/20 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {isListening ? (
          <div className="space-y-4 sm:space-y-5 w-full max-w-md relative z-10">
            <div>
              <div className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tight text-[#F4EBDD] drop-shadow-[0_0_20px_rgba(199,164,91,0.25)]">
                {detectedHz ? (
                  <span className={Math.abs(centsDiff) <= 5 ? 'text-[#6EA887] drop-shadow-[0_0_25px_rgba(110,168,135,0.4)]' : 'nv-gold-gradient-text'}>
                    {detectedHz.toFixed(1)} <span className="text-xl sm:text-2xl font-normal text-[#BDB4A4]">Hz</span>
                  </span>
                ) : (
                  <span className="text-lg sm:text-2xl text-[#C7A45B] animate-pulse">
                    {lang === 'ml' ? 'കേൾക്കുന്നു...' : 'Listening...'}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#BDB4A4] font-mono mt-2">
                {detectedHz
                  ? (lang === 'ml' ? `സിഗ്നൽ വ്യക്തത: ${clarity}%` : `Signal Clarity: ${clarity}%`)
                  : (lang === 'ml' ? 'മൈക്രോഫോണിലേക്ക് പാടുകയോ വായിക്കുകയോ ചെയ്യുക' : 'Sing or play into your microphone')}
              </div>
            </div>

            {/* Cents Deviation Gauge */}
            {detectedHz && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#BDB4A4]">
                  <span>-50 cents ({lang === 'ml' ? 'താഴ്ന്നത്' : 'Flat'})</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs ${
                      Math.abs(centsDiff) <= 5
                        ? 'bg-[#6EA887]/20 text-[#6EA887] border border-[#6EA887]/40'
                        : 'bg-[#C7A45B]/20 text-[#E0C98F] border border-[#C7A45B]/40'
                    }`}
                  >
                    {centsDiff > 0 ? `+${centsDiff}` : centsDiff} cents
                  </span>
                  <span>+50 cents ({lang === 'ml' ? 'ഉയർന്നത്' : 'Sharp'})</span>
                </div>

                <div className="w-full bg-[#11110F] h-3.5 rounded-full overflow-hidden border border-[#C7A45B]/30 relative shadow-inner">
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#F4EBDD] -translate-x-1/2 z-20 shadow-md" />
                  <div
                    className={`h-full transition-all duration-100 rounded-full ${
                      Math.abs(centsDiff) <= 5
                        ? 'bg-gradient-to-r from-[#6EA887] to-[#87947A] shadow-[0_0_10px_rgba(110,168,135,0.6)]'
                        : 'bg-gradient-to-r from-[#C7A45B] to-[#DFB960] shadow-[0_0_10px_rgba(199,164,91,0.5)]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, 50 + centsDiff))}%`
                    }}
                  />
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
            <span className="text-[11px] font-mono block text-[#87947A] bg-[#87947A]/10 py-1 px-2.5 rounded-lg border border-[#87947A]/20">
              {lang === 'ml'
                ? 'മൈക്രോഫോൺ വിവരങ്ങൾ പൂർണ്ണമായും സ്വകാര്യമാണ്, ഉപകരണത്തിൽ തന്നെ പ്രോസസ്സ് ചെയ്യുന്നു.'
                : 'Microphone access is private, permission-aware, and processed 100% locally on your device.'}
            </span>
          </div>
        )}
      </div>

      {/* Musicology Integrity Notice */}
      <div className="flex items-start space-x-3 text-xs text-[#BDB4A4] bg-[#0d0c0a]/60 p-4 rounded-2xl border border-[#C7A45B]/20">
        <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-[#E0C98F]">{lang === 'ml' ? 'കർണ്ണാടക സംഗീത കൃത്യതാ തത്വം:' : 'Carnatic Accuracy Principle:'}</strong>{' '}
          {lang === 'ml'
            ? 'ഹെർട്സിലുള്ള ശബ്ദ ആവൃത്തി കേവല ഡാറ്റ മാത്രമാണ്. കർണ്ണാടക സംഗീതത്തിൽ സ്വരത്തിന് ആധാര ഷഡ്ജം, രാഗ സഞ്ചാരം, ഗമകങ്ങൾ എന്നിവ അത്യാവശ്യമാണ്.'
            : 'Physical frequency in Hertz is raw acoustic data, not a definitive swara. Swara expression in Carnatic music requires contextual tonic alignment, raga sanchara, and gamaka oscillation.'}
        </span>
      </div>
    </div>
  );
};
