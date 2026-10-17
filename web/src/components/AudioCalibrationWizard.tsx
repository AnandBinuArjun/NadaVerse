'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TONIC_OPTIONS as ENGINE_TONIC_OPTIONS } from '../lib/audioEngine';

interface AudioCalibrationWizardProps {
  onComplete?: (calibrationData: {
    inputLevelOk: boolean;
    ambientNoiseDbfs: number;
    recommendedThreshold: number;
    selectedTonic: string;
    referenceHz: number;
  }) => void;
  onClose?: () => void;
}

const TONIC_OPTIONS = ENGINE_TONIC_OPTIONS.map((t) => ({
  note: t.name,
  hz: t.frequency,
  shrutiName: `${t.kattai} (${t.name})`,
}));

export const AudioCalibrationWizard: React.FC<AudioCalibrationWizardProps> = ({
  onComplete,
  onClose,
}) => {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  const [step, setStep] = useState<'intro' | 'permission' | 'noise_check' | 'level_check' | 'reference_tone' | 'done'>('intro');
  const [micStatus, setMicStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [currentRms, setCurrentRms] = useState<number>(0);
  const [ambientNoiseLevel, setAmbientNoiseLevel] = useState<number>(0);
  const [hasClipping, setHasClipping] = useState<boolean>(false);
  const [selectedTonic, setSelectedTonic] = useState<string>('C');
  const [isPlayingRefTone, setIsPlayingRefTone] = useState<boolean>(false);
  const [isManualFallback, setIsManualFallback] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const toneOscRef = useRef<OscillatorNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
      stopReferenceTone();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopMicrophone = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startMicrophone = async () => {
    setMicStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      setMicStatus('granted');

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const state = ctx.state as string;
      if (state === 'suspended' || state === 'interrupted') {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      monitorAudioLevels(analyser);
      setStep('noise_check');
    } catch {
      setMicStatus('denied');
      setIsManualFallback(true);
    }
  };

  const monitorAudioLevels = (analyser: AnalyserNode) => {
    const dataArray = new Float32Array(analyser.fftSize);

    const check = () => {
      analyser.getFloatTimeDomainData(dataArray);

      let sumSquares = 0;
      let peak = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = dataArray[i];
        sumSquares += val * val;
        if (Math.abs(val) > peak) {
          peak = Math.abs(val);
        }
      }

      const rms = Math.sqrt(sumSquares / dataArray.length);
      setCurrentRms(rms);

      if (peak >= 0.98) {
        setHasClipping(true);
      }

      animFrameRef.current = requestAnimationFrame(check);
    };

    check();
  };

  const measureAmbientNoise = () => {
    setAmbientNoiseLevel(currentRms);
    setTimeout(() => {
      setStep('level_check');
    }, 1500);
  };

  const playReferenceTone = (hz: number) => {
    stopReferenceTone();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      audioCtxRef.current = ctx;

      const state = ctx.state as string;
      if (state === 'suspended' || state === 'interrupted') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      toneOscRef.current = osc;
      setIsPlayingRefTone(true);
    } catch {
      // audio error
    }
  };

  const stopReferenceTone = () => {
    if (toneOscRef.current) {
      try {
        toneOscRef.current.stop();
        toneOscRef.current.disconnect();
      } catch {}
      toneOscRef.current = null;
    }
    setIsPlayingRefTone(false);
  };

  const handleFinish = () => {
    stopMicrophone();
    stopReferenceTone();
    const tonicObj = TONIC_OPTIONS.find((t) => t.note === selectedTonic) || TONIC_OPTIONS[0];

    if (onComplete) {
      onComplete({
        inputLevelOk: !isManualFallback && currentRms > 0.01,
        ambientNoiseDbfs: ambientNoiseLevel,
        recommendedThreshold: Math.max(0.02, ambientNoiseLevel * 1.5),
        selectedTonic: tonicObj.note,
        referenceHz: tonicObj.hz,
      });
    }

    if (onClose) {
      onClose();
    }
  };

  const selectedTonicObj = TONIC_OPTIONS.find((t) => t.note === selectedTonic) || TONIC_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="bg-stone-900 border border-amber-900/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-6">
        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Audio Calibration Wizard ({micStatus.toUpperCase()})
            </span>
            <h2 className="text-xl font-bold text-amber-100 mt-1">
              {isMl ? 'മൈക്രോഫോൺ & ശ്രുതി ക്രമീകരണം' : 'Microphone Gain & Shruti Alignment'}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={() => {
                stopMicrophone();
                stopReferenceTone();
                onClose();
              }}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg"
              aria-label="Close calibration wizard"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Step 1: Privacy & Intro */}
        {step === 'intro' && (
          <div className="space-y-4 text-xs text-stone-300">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30">
              <h3 className="font-semibold text-amber-200 text-sm mb-1">
                Zero Audio Transmission Guarantee
              </h3>
              <p className="text-stone-400 leading-relaxed">
                NadaVerse processes all audio signals client-side inside your browser’s temporary Web Audio memory.
                Waveforms are never streamed, uploaded, or stored on any server.
              </p>
            </div>

            <p className="text-stone-400 leading-relaxed">
              This wizard tests:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-300">
              <li>Microphone hardware availability and input gain level.</li>
              <li>Ambient background room noise and acoustics.</li>
              <li>Clipping detection (overly loud inputs).</li>
              <li>Choice of Adhara Shadjam (Tonic reference tone).</li>
            </ul>

            <div className="flex justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  setIsManualFallback(true);
                  setStep('reference_tone');
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium border border-stone-800 text-stone-400 hover:text-stone-200"
              >
                Use Manual Mode (No Mic)
              </button>
              <button
                onClick={startMicrophone}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors"
              >
                Allow Microphone & Start Test
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Noise Check */}
        {step === 'noise_check' && (
          <div className="space-y-4 text-xs text-stone-300">
            <h3 className="text-sm font-semibold text-amber-200">
              Step 1: Ambient Room Noise Floor
            </h3>
            <p className="text-stone-400 leading-relaxed">
              Please remain silent for 3 seconds so NadaVerse can measure room noise (fans, hums, or reverberations).
            </p>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Room Noise Level:</span>
                <span className="font-mono text-amber-300">{(currentRms * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-100"
                  style={{ width: `${Math.min(100, currentRms * 300)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={measureAmbientNoise}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors"
              >
                Capture Baseline Noise & Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Level Check & Clipping */}
        {step === 'level_check' && (
          <div className="space-y-4 text-xs text-stone-300">
            <h3 className="text-sm font-semibold text-amber-200">
              Step 2: Singing / Playing Level & Clipping
            </h3>
            <p className="text-stone-400 leading-relaxed">
              Sing or play a steady <strong className="text-amber-200">Sa</strong> into your microphone now at your normal practice volume.
            </p>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Current Input Level:</span>
                <span className={`font-mono font-bold ${hasClipping ? 'text-red-400' : 'text-emerald-400'}`}>
                  {(currentRms * 100).toFixed(1)}% {hasClipping ? '(Clipping Alert!)' : ''}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-75 ${
                    hasClipping ? 'bg-red-500' : currentRms > 0.03 ? 'bg-emerald-500' : 'bg-stone-600'
                  }`}
                  style={{ width: `${Math.min(100, currentRms * 200)}%` }}
                />
              </div>
            </div>

            {hasClipping && (
              <p className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/50">
                Input is clipping (distorting). Move slightly farther from the microphone or lower your OS microphone input volume.
              </p>
            )}

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep('reference_tone')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors"
              >
                Signal Looks Good $\to$ Select Tonic
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Reference Tone & Tonic */}
        {step === 'reference_tone' && (
          <div className="space-y-4 text-xs text-stone-300">
            <h3 className="text-sm font-semibold text-amber-200">
              Step 3: Adhara Shadjam (Tonic Shruti) Selection
            </h3>
            <p className="text-stone-400 leading-relaxed">
              Choose your comfortable base pitch (Kattai). You can audition the reference tone to tune your voice or instrument before practicing.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {TONIC_OPTIONS.map((t) => (
                <button
                  key={t.note}
                  onClick={() => {
                    setSelectedTonic(t.note);
                    if (isPlayingRefTone) {
                      playReferenceTone(t.hz);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTonic === t.note
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-200">{t.note}</div>
                  <div className="text-[10px] text-stone-400 font-mono">{t.hz} Hz</div>
                  <div className="text-[10px] text-amber-400 truncate mt-0.5">{t.shrutiName}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-xs text-stone-300 font-medium">
                Audition Tonic Pitch: {selectedTonicObj.note} ({selectedTonicObj.hz} Hz)
              </span>
              <button
                onClick={() => {
                  if (isPlayingRefTone) {
                    stopReferenceTone();
                  } else {
                    playReferenceTone(selectedTonicObj.hz);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isPlayingRefTone
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                }`}
              >
                {isPlayingRefTone ? 'Stop Tone' : 'Play Sine Tone'}
              </button>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep('done')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors"
              >
                Confirm Calibration & Finish
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Done */}
        {step === 'done' && (
          <div className="space-y-4 text-xs text-stone-300 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h3 className="text-base font-bold text-amber-100">
              Acoustic Calibration Complete!
            </h3>
            <p className="text-stone-400 max-w-md mx-auto leading-relaxed">
              Adhara Shadjam is set to <strong className="text-amber-200">{selectedTonicObj.note} ({selectedTonicObj.hz} Hz)</strong>.
              {isManualFallback
                ? ' Manual mode enabled (no microphone stream active).'
                : ' Input gain and ambient noise thresholds have been calibrated for optimal pitch tracking.'}
            </p>

            <div className="pt-4 border-t border-stone-800 flex justify-center">
              <button
                onClick={handleFinish}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md"
              >
                Ready for Practice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
