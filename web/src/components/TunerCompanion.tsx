'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Info, Activity } from 'lucide-react';
import { TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';

interface TunerCompanionProps {
  activeTonic?: TonicNote;
}

export const TunerCompanion: React.FC<TunerCompanionProps> = ({
  activeTonic = TONIC_OPTIONS[0] // default C (261.63 Hz)
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

  return (
    <div className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3B392F] gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>{lang === 'ml' ? 'ശബ്ദ ആവൃത്തി നിരീക്ഷണം' : 'Acoustic Pitch Awareness'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'മൈക്രോഫോൺ പിച്ച് ട്യൂണർ' : 'Microphone Pitch Display & Tuner'}
          </h3>
          <p className="text-xs text-[#BDB4A4] mt-0.5">
            {lang === 'ml' ? 'ലക്ഷ്യ ശ്രുതി:' : 'Target Reference:'} <span className="text-[#C7A45B] font-mono font-bold">{activeTonic.name}</span> ({activeTonic.kattai} · {activeTonic.frequency.toFixed(1)} Hz)
          </p>
        </div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all shadow-md ${
            isListening
              ? 'bg-[#E17D73] text-[#11110F] hover:bg-[#F28B82]'
              : 'bg-[#22221D] border border-[#C7A45B] text-[#F4EBDD] hover:bg-[#2A2A24]'
          }`}
          aria-label={isListening ? 'Stop microphone pitch tuner' : 'Enable microphone pitch tuner'}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>{lang === 'ml' ? 'ട്യൂണർ നിർത്തുക' : 'Stop Tuner'}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'പിച്ച് ട്യൂണർ തുടങ്ങുക' : 'Enable Pitch Tuner'}</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-[#E17D73]/10 border border-[#E17D73]/30 rounded-xl text-xs text-[#E17D73] flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Pitch Meter */}
      <div className="my-6 bg-[#22221D] p-6 rounded-2xl border border-[#3B392F] flex flex-col items-center justify-center text-center">
        {isListening ? (
          <div className="space-y-4 w-full max-w-md">
            <div>
              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#F4EBDD]">
                {detectedHz ? `${detectedHz.toFixed(1)} Hz` : (lang === 'ml' ? 'കേൾക്കുന്നു...' : 'Listening...')}
              </div>
              <div className="text-xs text-[#BDB4A4] font-mono mt-1">
                {detectedHz
                  ? (lang === 'ml' ? `സിഗ്നൽ വ്യക്തത: ${clarity}%` : `Signal Clarity: ${clarity}%`)
                  : (lang === 'ml' ? 'മൈക്രോഫോണിലേക്ക് പാടുകയോ വായിക്കുകയോ ചെയ്യുക' : 'Sing or play into your microphone')}
              </div>
            </div>

            {/* Cents Deviation Gauge */}
            {detectedHz && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#BDB4A4]">
                  <span>-50 cents ({lang === 'ml' ? 'താഴ്ന്നത്' : 'Flat'})</span>
                  <span className={`font-bold ${Math.abs(centsDiff) <= 5 ? 'text-[#6EA887]' : 'text-[#C7A45B]'}`}>
                    {centsDiff > 0 ? `+${centsDiff}` : centsDiff} cents
                  </span>
                  <span>+50 cents ({lang === 'ml' ? 'ഉയർന്നത്' : 'Sharp'})</span>
                </div>

                <div className="w-full bg-[#11110F] h-3 rounded-full overflow-hidden border border-[#3B392F] relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#F4EBDD] z-10" />
                  <div
                    className={`h-full transition-all duration-100 ${
                      Math.abs(centsDiff) <= 5 ? 'bg-[#6EA887]' : 'bg-[#C7A45B]'
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
          <div className="py-6 space-y-2 text-[#BDB4A4]">
            <Mic className="w-10 h-10 mx-auto text-[#3B392F]" />
            <p className="text-sm">
              {lang === 'ml'
                ? 'ട്യൂണർ ഇപ്പോൾ നിർജ്ജീവമാണ്. തത്സമയ പിച്ച് വിശകലനത്തിനായി "പിച്ച് ട്യൂണർ തുടങ്ങുക" അമർത്തുക.'
                : 'Tuner is currently idle. Click "Enable Pitch Tuner" to begin real-time pitch analysis.'}
            </p>
            <span className="text-[11px] font-mono block text-[#87947A]">
              {lang === 'ml'
                ? 'മൈക്രോഫോൺ വിവരങ്ങൾ പൂർണ്ണമായും സ്വകാര്യമാണ്, ഉപകരണത്തിൽ തന്നെ പ്രോസസ്സ് ചെയ്യുന്നു.'
                : 'Microphone access is private, permission-aware, and processed 100% locally on your device.'}
            </span>
          </div>
        )}
      </div>

      {/* Musicology Integrity Notice */}
      <div className="flex items-start space-x-2 text-xs text-[#BDB4A4] bg-[#11110F] p-3.5 rounded-xl border border-[#3B392F]/60">
        <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
        <span>
          <strong>{lang === 'ml' ? 'കർണ്ണാടക സംഗീത കൃത്യതാ തത്വം:' : 'Carnatic Accuracy Principle:'}</strong>{' '}
          {lang === 'ml'
            ? 'ഹെർട്സിലുള്ള ശബ്ദ ആവൃത്തി കേവല ഡാറ്റ മാത്രമാണ്. കർണ്ണാടക സംഗീതത്തിൽ സ്വരത്തിന് ആധാര ഷഡ്ജം, രാഗ സഞ്ചാരം, ഗമകങ്ങൾ എന്നിവ അത്യാവശ്യമാണ്.'
            : 'Physical frequency in Hertz is raw acoustic data, not a definitive swara. Swara expression in Carnatic music requires contextual tonic alignment, raga sanchara, and gamaka oscillation.'}
        </span>
      </div>
    </div>
  );
};
