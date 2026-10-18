'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Award,
  Sparkles,
  RefreshCw,
  BookOpen,
  Info,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { TONIC_OPTIONS, TonicNote } from '../lib/audioEngine';
import { CARNATIC_EXERCISES, ExerciseItem } from '../data/carnaticExercises';
import { useLanguage } from '../context/LanguageContext';
import { detectPitch, evaluateSyntheticPitch } from '../lib/pitchDetector';
import { API_BASE_URL } from '../lib/api';

interface SwaraCentDef {
  symbol: string;
  name: string;
  justRatio: number;
  expectedCents: number;
}

const SWARA_CENT_MAP: Record<string, SwaraCentDef> = {
  S: { symbol: 'S', name: 'Shadjam', justRatio: 1.0, expectedCents: 0 },
  'R₁': { symbol: 'R₁', name: 'Shuddha Rishabham', justRatio: 16 / 15, expectedCents: 112 },
  'R₂': { symbol: 'R₂', name: 'Chatushruti Rishabham', justRatio: 9 / 8, expectedCents: 204 },
  'G₁': { symbol: 'G₁', name: 'Shuddha Gandharam', justRatio: 9 / 8, expectedCents: 204 },
  'G₂': { symbol: 'G₂', name: 'Sadharana Gandharam', justRatio: 6 / 5, expectedCents: 316 },
  'G₃': { symbol: 'G₃', name: 'Antara Gandharam', justRatio: 5 / 4, expectedCents: 386 },
  'M₁': { symbol: 'M₁', name: 'Shuddha Madhyamam', justRatio: 4 / 3, expectedCents: 498 },
  'M₂': { symbol: 'M₂', name: 'Prati Madhyamam', justRatio: 45 / 32, expectedCents: 590 },
  P: { symbol: 'P', name: 'Panchamam', justRatio: 3 / 2, expectedCents: 702 },
  'D₁': { symbol: 'D₁', name: 'Shuddha Dhaivatam', justRatio: 8 / 5, expectedCents: 814 },
  'D₂': { symbol: 'D₂', name: 'Chatushruti Dhaivatam', justRatio: 27 / 16, expectedCents: 906 },
  'N₁': { symbol: 'N₁', name: 'Shuddha Nishadam', justRatio: 27 / 16, expectedCents: 906 },
  'N₂': { symbol: 'N₂', name: 'Kaisiki Nishadam', justRatio: 9 / 5, expectedCents: 1018 },
  'N₃': { symbol: 'N₃', name: 'Kakali Nishadam', justRatio: 15 / 8, expectedCents: 1088 },
  Ṡ: { symbol: 'Ṡ', name: 'Tara Shadjam', justRatio: 2.0, expectedCents: 1200 },
};

interface PitchFrame {
  timeSec: number;
  freq: number;
  cents: number;
}

interface SwaraMetric {
  swara: string;
  expected_cents: number;
  measured_cents: number;
  deviation_cents: number;
  stability_pct: number;
  status: 'accurate' | 'sharp' | 'flat';
}

interface AnalysisReport {
  exercise_name: string;
  overall_score_pct: number;
  pitch_accuracy_label: string;
  stability_label: string;
  summary_explanation: string;
  identified_strengths: string[];
  targeted_improvements: string[];
  recommended_exercises: string[];
  limitations_notice: string;
  confidence: string;
  provenance: string;
  analysis_quality?: string;
  is_heuristic_fallback?: boolean;
  measured_metrics?: string[];
  inferred_metrics?: string[];
}

interface Props {
  activeTonic?: TonicNote;
  onNavigateToCurriculum?: (lessonId?: string) => void;
  onSaveSessionNotes?: (notes: string, duration: number) => void;
}

export const ExplainablePracticeCompanion: React.FC<Props> = ({
  activeTonic = TONIC_OPTIONS[0],
  onNavigateToCurriculum,
  onSaveSessionNotes,
}) => {
  const { lang } = useLanguage();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem>(CARNATIC_EXERCISES[0]);
  const [consentGranted, setConsentGranted] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [currentHz, setCurrentHz] = useState<number | null>(null);
  const [currentCents, setCurrentCents] = useState<number>(0);
  const [pitchFrames, setPitchFrames] = useState<PitchFrame[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const collectedFramesRef = useRef<PitchFrame[]>([]);
  const startTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const tonicHz = activeTonic.frequency;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Diagnostic self-test state for synthetic audio evaluation
  const [diagnosticResults, setDiagnosticResults] = useState<{
    tested: boolean;
    allPassed: boolean;
    results: Array<{ note: string; targetHz: number; detectedHz: number | null; centError: number | null; passed: boolean }>;
  } | null>(null);

  const runSyntheticDiagnostic = () => {
    const testCases = [
      { note: 'Adhara Sa (C4)', hz: 261.63 },
      { note: 'Shuddha Rishabham (R₁)', hz: 279.07 },
      { note: 'Antara Gandharam (G₃)', hz: 327.03 },
      { note: 'Shuddha Madhyamam (M₁)', hz: 348.84 },
      { note: 'Panchamam (P)', hz: 392.00 },
      { note: 'Shuddha Dhaivatam (D₁)', hz: 418.60 },
      { note: 'Kakali Nishadam (N₃)', hz: 490.55 },
      { note: 'Tara Sa (Ṡ)', hz: 523.25 },
    ];
    const evaluated = testCases.map((tc) => {
      const res = evaluateSyntheticPitch(tc.hz);
      return {
        note: tc.note,
        targetHz: tc.hz,
        detectedHz: res.detectedHz,
        centError: res.centError,
        passed: res.passed,
      };
    });
    const allPassed = evaluated.every((r) => r.passed);
    setDiagnosticResults({ tested: true, allPassed, results: evaluated });
  };

  const startRecordingSession = async () => {
    if (!consentGranted) {
      setErrorNotice('Explicit consent is required to process audio features for practice analysis.');
      return;
    }
    setErrorNotice(null);
    setReport(null);
    setPitchFrames([]);
    collectedFramesRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const state = audioCtx.state as string;
      if (state === 'suspended' || state === 'interrupted') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsRecording(true);
      setRecordingSeconds(0);
      startTimeRef.current = performance.now();

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      const buffer = new Float32Array(analyser.fftSize);

      const updateLoop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);
        const pitch = detectPitch(buffer, audioCtx.sampleRate);

        if (pitch && pitch >= 60 && pitch <= 1200) {
          const ratio = pitch / tonicHz;
          let cents = 1200 * Math.log2(ratio);
          // normalize to within single octave range (0-1200) or near
          while (cents < -50) cents += 1200;
          while (cents > 1250) cents -= 1200;

          const timeSec = (performance.now() - startTimeRef.current) / 1000;
          const frame: PitchFrame = { timeSec, freq: pitch, cents };
          collectedFramesRef.current.push(frame);

          setCurrentHz(Math.round(pitch * 10) / 10);
          setCurrentCents(Math.round(cents));
        } else {
          setCurrentHz(null);
        }

        animFrameIdRef.current = requestAnimationFrame(updateLoop);
      };

      animFrameIdRef.current = requestAnimationFrame(updateLoop);
    } catch {
      setErrorNotice('Could not access microphone. Please ensure microphone permissions are granted in your browser.');
    }
  };

  const stopRecordingSession = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    setIsRecording(false);
    setCurrentHz(null);
    setPitchFrames([...collectedFramesRef.current]);

    if (collectedFramesRef.current.length > 10) {
      processPerformanceAnalysis(collectedFramesRef.current);
    } else if (recordingSeconds > 0) {
      setErrorNotice('Insufficient steady vocal audio detected to compute an authoritative analysis. Please sing closer to the microphone.');
    }
  };

  // Computes real acoustic metrics and requests explainable synthesis
  const processPerformanceAnalysis = async (frames: PitchFrame[]) => {
    setIsAnalyzing(true);
    setErrorNotice(null);

    // 1. Group frames around expected swaras of the selected exercise
    const exerciseSwaras = selectedExercise.swarasAscending;
    const swaraMetrics: SwaraMetric[] = [];
    let totalCentError = 0;
    let countedSwaras = 0;

    exerciseSwaras.forEach((swaraKey) => {
      const def = SWARA_CENT_MAP[swaraKey] || SWARA_CENT_MAP['S'];
      const expCents = def.expectedCents;

      // Filter frames falling within +/- 90 cents window of this swara
      const matchingFrames = frames.filter((f) => Math.abs(f.cents - expCents) <= 90);

      if (matchingFrames.length >= 3) {
        const avgMeasured = matchingFrames.reduce((acc, f) => acc + f.cents, 0) / matchingFrames.length;
        const devCents = avgMeasured - expCents;

        // Stability is variance of cents around mean
        const variance =
          matchingFrames.reduce((acc, f) => acc + Math.pow(f.cents - avgMeasured, 2), 0) / matchingFrames.length;
        const stdDev = Math.sqrt(variance);
        const stabilityPct = Math.max(20, Math.min(99, Math.round(100 - stdDev * 2.5)));

        let status: 'accurate' | 'sharp' | 'flat' = 'accurate';
        if (devCents > 15) status = 'sharp';
        else if (devCents < -15) status = 'flat';

        swaraMetrics.push({
          swara: swaraKey,
          expected_cents: expCents,
          measured_cents: Math.round(avgMeasured * 10) / 10,
          deviation_cents: Math.round(devCents * 10) / 10,
          stability_pct: stabilityPct,
          status,
        });

        totalCentError += Math.abs(devCents);
        countedSwaras++;
      }
    });

    const meanAbsError = countedSwaras > 0 ? totalCentError / countedSwaras : 22.5;
    const overallStability =
      swaraMetrics.length > 0
        ? Math.round(swaraMetrics.reduce((acc, m) => acc + m.stability_pct, 0) / swaraMetrics.length)
        : 75;

    const payload = {
      exercise_name: selectedExercise.title,
      tonic: activeTonic.name,
      tonic_frequency: activeTonic.frequency,
      duration_seconds: Math.max(1.5, recordingSeconds),
      swara_metrics: swaraMetrics,
      overall_stability_pct: overallStability,
      mean_absolute_cent_error: Math.round(meanAbsError * 10) / 10,
      tempo_bpm: 60,
      user_consent_granted: consentGranted,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/audio/analyze-practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data: AnalysisReport = await res.json();
        setReport(data);
      } else {
        // Fallback rule-based local calculation
        setReport(generateLocalFallbackReport(payload));
      }
    } catch {
      // Offline fallback
      setReport(generateLocalFallbackReport(payload));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateLocalFallbackReport = (payload: {
    exercise_name: string;
    overall_stability_pct: number;
    mean_absolute_cent_error: number;
    duration_seconds: number;
    swara_metrics: SwaraMetric[];
  }): AnalysisReport => {
    const accuracyLabel =
      payload.mean_absolute_cent_error <= 15
        ? 'Exemplary Shruti Alignment (<= 15 cents deviation)'
        : payload.mean_absolute_cent_error <= 28
        ? 'Good Shruti Steadiness (Minor Microtonal Drift)'
        : 'Developing Pitch Alignment (Moderate Cent Deviation)';

    const stabilityLabel =
      payload.overall_stability_pct >= 85
        ? 'Rock Solid Sustained Tone Production'
        : payload.overall_stability_pct >= 70
        ? 'Steady with Slight Tremor on Long Notes'
        : 'Fluctuating Vocal Stability (Breath Support Recommended)';

    const strengths: string[] = [];
    const improvements: string[] = [];

    payload.swara_metrics.forEach((m) => {
      if (Math.abs(m.deviation_cents) <= 14 && m.stability_pct >= 75) {
        strengths.push(`Pure intonation on ${m.swara} (deviation: ${m.deviation_cents > 0 ? '+' : ''}${m.deviation_cents} cents)`);
      } else if (m.deviation_cents > 18) {
        improvements.push(`Sharp bias on ${m.swara} (+${m.deviation_cents} cents above just intonation)`);
      } else if (m.deviation_cents < -18) {
        improvements.push(`Flat tendency on ${m.swara} (${m.deviation_cents} cents below just intonation)`);
      }
    });

    if (strengths.length === 0) {
      strengths.push(`Completed steady ${payload.duration_seconds.toFixed(1)}s practice session`);
    }
    if (improvements.length === 0) {
      improvements.push('Maintain relaxed throat posture during ascending octave transitions.');
    }

    return {
      exercise_name: payload.exercise_name,
      overall_score_pct: Math.min(99, Math.max(30, Math.round(payload.overall_stability_pct * 0.5 + Math.max(0, 100 - payload.mean_absolute_cent_error * 2) * 0.5))),
      pitch_accuracy_label: accuracyLabel,
      stability_label: stabilityLabel,
      summary_explanation: `Your performance of ${payload.exercise_name} demonstrated an estimated mean cent error of ${payload.mean_absolute_cent_error} cents with ${payload.overall_stability_pct}% vocal stability against Adhara Shadjam ${activeTonic.name}. Computed via local deterministic rules.`,
      identified_strengths: strengths.slice(0, 3),
      targeted_improvements: improvements.slice(0, 3),
      recommended_exercises: ['Shruti & Adhara Shadjam Alignment (Lesson V-01)', 'Sapta Swaras in Mayamalavagowla (Lesson V-02)'],
      limitations_notice: 'Acoustic Notice: Pitch measurements are extracted via client-side autocorrelation relative to Adhara Shadjam. Room reverberation and vocal harmonics can cause bounded variance. This is an educational guide, not an automated grading verdict.',
      confidence: 'Moderate (Local Estimate)',
      provenance: 'local_deterministic_rule_engine',
      analysis_quality: 'local_heuristic_estimate',
      is_heuristic_fallback: true,
      measured_metrics: [
        'Client-side autocorrelation fundamental pitch',
        'Cent deviation relative to 22 Shruti just intonation',
        'Pitch frame stability index (%)',
      ],
      inferred_metrics: [
        'Shruti alignment classification',
        'Vocal production stability category',
        'Targeted sadhana exercise recommendations',
      ],
    };
  };

  // Draw Pitch Contour Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.fillStyle = '#11110F'; // warm obsidian surface
    ctx.fillRect(0, 0, width, height);

    // Horizontal pitch grid lines (swarasthanas from 0 to 1200 cents)
    const swaras = ['S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'Ṡ'];
    swaras.forEach((swaraKey) => {
      const def = SWARA_CENT_MAP[swaraKey];
      if (def) {
        const y = height - (def.expectedCents / 1250) * (height - 30) - 15;

        // Line
        ctx.strokeStyle = '#2A2922'; // subtle gold-tinted grid border
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Label
        ctx.setLineDash([]);
        ctx.fillStyle = '#C7A45B'; // temple gold
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(swaraKey, 10, y + 3);
      }
    });

    if (pitchFrames.length === 0) {
      ctx.fillStyle = '#BDB4A4'; // muted sand
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        isRecording ? 'Listening for vocal notes...' : 'Record an exercise to visualize your pitch contour',
        width / 2,
        height / 2
      );
      ctx.textAlign = 'left';
      return;
    }

    // Plot recorded contour
    const maxTime = Math.max(5, pitchFrames[pitchFrames.length - 1].timeSec);
    ctx.strokeStyle = '#E0C98F'; // luminous warm gold contour line
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    pitchFrames.forEach((frame) => {
      const x = 35 + (frame.timeSec / maxTime) * (width - 45);
      const y = height - (frame.cents / 1250) * (height - 30) - 15;

      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }, [pitchFrames, isRecording]);

  const handleSaveToJournal = () => {
    if (!report || !onSaveSessionNotes) return;
    const noteSummary = `[AI Practice Companion] ${report.exercise_name} | Score: ${report.overall_score_pct}% | ${report.pitch_accuracy_label}. Improvements: ${report.targeted_improvements.join('; ')}`;
    onSaveSessionNotes(noteSummary, recordingSeconds);
  };

  return (
    <div className="nv-glass-card rounded-2xl sm:rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden transition-all duration-300 border border-[#C7A45B]/20 hover:border-[#C7A45B]/50 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(199,164,91,0.12)] text-[#F4EBDD]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#3B392F]/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#C7A45B]/15 text-[#E0C98F] rounded-lg border border-[#C7A45B]/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#F4EBDD]">
              {lang === 'ml' ? 'AI അഭ്യാസ സഹായി' : 'Explainable AI Practice Companion'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#87947A]/15 border border-[#87947A]/40 text-[#87947A] font-medium font-mono">
              100% Free
            </span>
          </div>
          <p className="text-xs text-[#BDB4A4] mt-1.5 max-w-2xl leading-relaxed">
            {lang === 'ml'
              ? 'തത്സമയ ശ്രുതി താരതമ്യം, പിച്ച് സ്ഥിരത, ശാസ്ത്രീയ അപഗ്രഥനം.'
              : 'Grounded acoustic pitch contour analysis with evidence-based feedback. Compares your performance against classical swarasthanas.'}
          </p>
        </div>

        {/* Tonic Display */}
        <div className="flex items-center gap-3 bg-[#161410] border border-[#3B392F] px-4 py-2 rounded-xl text-sm">
          <span className="text-[#BDB4A4]">Adhara Shadjam:</span>
          <span className="font-semibold text-[#E0C98F]">{activeTonic.name}</span>
          <span className="text-xs text-[#BDB4A4]/80 font-mono">({activeTonic.frequency} Hz)</span>
        </div>
      </div>

      {/* Exercise Selection & Privacy Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C7A45B]">
            {lang === 'ml' ? 'അഭ്യാസ പാഠം തിരഞ്ഞെടുക്കുക' : 'Select Target Exercise'}
          </label>
          <select
            className="w-full bg-[#161410] border border-[#3B392F] rounded-xl px-4 py-2.5 text-sm font-medium text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B] focus:ring-1 focus:ring-[#C7A45B]/50 transition-colors"
            value={selectedExercise.id}
            onChange={(e) => {
              const ex = CARNATIC_EXERCISES.find((x) => x.id === e.target.value);
              if (ex) {
                setSelectedExercise(ex);
                setReport(null);
                setPitchFrames([]);
              }
            }}
            disabled={isRecording}
          >
            {CARNATIC_EXERCISES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.raga})
              </option>
            ))}
          </select>
        </div>

        {/* Consent Checkbox */}
        <div className="bg-[#161410] border border-[#3B392F] rounded-xl p-3.5 flex flex-col justify-center">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#F4EBDD]">
            <input
              type="checkbox"
              checked={consentGranted}
              onChange={(e) => {
                setConsentGranted(e.target.checked);
                if (e.target.checked) setErrorNotice(null);
              }}
              className="mt-0.5 rounded border-[#3B392F] bg-[#22221D] text-[#C7A45B] focus:ring-[#C7A45B]/50"
            />
            <div>
              <span className="font-medium text-[#F4EBDD] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#87947A]" /> Explicit Audio Opt-In Consent
              </span>
              <span className="text-[#BDB4A4] block mt-1 text-[11px] leading-relaxed">
                Microphone audio is processed entirely locally within your browser's Web Audio memory. Raw audio waveforms are never streamed, stored, or uploaded. Only computed mathematical pitch summaries (cents deviation from Adhara Sa, stability percentage, and duration) are transmitted to request guidance. You may stop or withdraw access at any time.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Synthetic Diagnostic Test Runner */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#161410] border border-[#3B392F] rounded-xl">
        <div className="text-xs text-[#BDB4A4]">
          <span className="font-semibold text-[#F4EBDD]">Audio Lab Diagnostic:</span> Test pitch estimator accuracy against synthetic known frequencies without microphone access.
        </div>
        <button
          type="button"
          onClick={runSyntheticDiagnostic}
          className="px-3.5 py-1.5 rounded-lg bg-[#22221D] hover:bg-[#2A2922] text-[#E0C98F] hover:text-[#F4EBDD] text-xs font-mono font-medium border border-[#3B392F] hover:border-[#C7A45B]/50 transition-all"
        >
          Run Synthetic Audio Diagnostic
        </button>
      </div>

      {diagnosticResults && (
        <div className="mt-3 p-4 bg-[#161410] border border-[#3B392F] rounded-xl text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#3B392F] pb-2">
            <span className="font-bold text-[#F4EBDD] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#87947A]" /> Synthetic Reference Signal Diagnostic Results
            </span>
            <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${diagnosticResults.allPassed ? 'bg-[#87947A]/15 text-[#87947A] border border-[#87947A]/40' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {diagnosticResults.allPassed ? '100% Passed (Error < 0.2 cents)' : 'Variations Detected'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            {diagnosticResults.results.map((r, idx) => (
              <div key={idx} className="bg-[#191916] p-2 rounded border border-[#3B392F]">
                <div className="text-[#E0C98F] font-bold truncate">{r.note}</div>
                <div className="text-[#BDB4A4] text-[10px]">Target: {r.targetHz} Hz</div>
                <div className="text-[#F4EBDD] text-[10px]">Detected: {r.detectedHz} Hz</div>
                <div className="text-[#87947A] text-[10px]">Cent err: {r.centError}c</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reference Swaras Display */}
      <div className="mt-4 p-3.5 bg-[#161410] border border-[#3B392F] rounded-xl">
        <span className="text-xs text-[#C7A45B] font-mono font-bold uppercase tracking-wider">Target Swara Sequence:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedExercise.swarasAscending.map((swara, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-[#22221D] border border-[#3B392F] hover:border-[#C7A45B]/50 rounded-lg text-xs font-mono font-bold text-[#E0C98F]"
            >
              {swara}
              <span className="ml-1 text-[10px] text-[#BDB4A4] font-normal">
                {SWARA_CENT_MAP[swara]?.expectedCents || 0}c
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Recording & Pitch Visualizer Canvas */}
      <div className="mt-6 bg-[#161410] border border-[#3B392F] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C7A45B]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4EBDD]">
              Pitch Contour Visualizer (Cents from Sa)
            </span>
          </div>

          {/* Live pitch readout */}
          {isRecording && currentHz && (
            <div className="flex items-center gap-3 text-xs font-mono bg-[#191916] border border-[#C7A45B]/40 px-3 py-1 rounded-lg text-[#E0C98F]">
              <span>{currentHz} Hz</span>
              <span className="text-[#BDB4A4]">•</span>
              <span>{currentCents} cents</span>
            </div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={700}
          height={200}
          className="w-full h-48 rounded-xl bg-[#11110F] border border-[#3B392F]"
        />

        {/* Recording Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[#3B392F]">
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecordingSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-sm transition-all shadow-md shadow-[#C7A45B]/20"
              >
                <Mic className="w-4 h-4" /> Start Exercise Recording
              </button>
            ) : (
              <button
                onClick={stopRecordingSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors shadow-lg shadow-rose-600/20 animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" /> Stop & Analyze ({recordingSeconds}s)
              </button>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs text-[#E0C98F] font-medium font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing acoustic evaluation...
              </div>
            )}
          </div>

          <div className="text-xs text-[#BDB4A4]">
            {isRecording
              ? 'Sing clearly into microphone. Hold each swara steadily.'
              : 'Record at least 3-5 seconds of sustained swaras for full analysis.'}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorNotice && (
        <div className="mt-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Analysis Report Card */}
      {report && (
        <div className="mt-8 space-y-6 pt-6 border-t border-[#3B392F]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-[#F4EBDD] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C7A45B]" /> Performance Analysis Report
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-md bg-[#22221D] text-[#E0C98F] border border-[#3B392F] font-mono">
              Confidence: {report.confidence}
            </span>
          </div>

          {/* Scores Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161410] p-4 rounded-xl border border-[#3B392F]">
              <span className="text-xs text-[#BDB4A4] font-medium">Overall Pitch Accuracy</span>
              <div className="text-3xl font-extrabold text-[#E0C98F] mt-1 font-mono">
                {report.overall_score_pct}%
              </div>
              <p className="text-xs text-[#BDB4A4] mt-1">{report.pitch_accuracy_label}</p>
            </div>

            <div className="bg-[#161410] p-4 rounded-xl border border-[#3B392F]">
              <span className="text-xs text-[#BDB4A4] font-medium">Sustained Tone Stability</span>
              <div className="text-2xl font-bold text-[#87947A] mt-1 flex items-center gap-1.5 font-mono">
                <Activity className="w-5 h-5 text-[#87947A]" /> {report.overall_score_pct ? `${report.overall_score_pct}% Ratio` : 'Estimated'}
              </div>
              <p className="text-xs text-[#BDB4A4] mt-1">{report.stability_label}</p>
            </div>

            <div className="bg-[#161410] p-4 rounded-xl border border-[#3B392F]">
              <span className="text-xs text-[#BDB4A4] font-medium">Analysis Quality & Provenance</span>
              <div className="text-xs font-mono text-[#F4EBDD] mt-2 bg-[#191916] p-2 rounded border border-[#3B392F] truncate" title={report.provenance}>
                {report.analysis_quality === 'local_heuristic_estimate' ? 'Local Heuristic Analysis' : report.provenance}
              </div>
            </div>
          </div>

          {/* Measured vs Inferred Provenance Transparency */}
          <div className="bg-[#161410] border border-[#3B392F] rounded-xl p-3.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3B392F] pb-2 mb-2.5">
              <span className="font-semibold text-[#F4EBDD] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#C7A45B]" /> Measurement vs Inference Transparency
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${report.is_heuristic_fallback ? 'bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30' : 'bg-[#87947A]/15 text-[#87947A] border border-[#87947A]/40'}`}>
                {report.analysis_quality === 'local_heuristic_estimate' ? 'Deterministic Local Estimate' : 'Algorithmic Synthesis'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#BDB4A4]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C7A45B] font-mono font-bold block mb-1">
                  Directly Measured Features:
                </span>
                <ul className="space-y-1 text-[11px] list-disc list-inside">
                  {(report.measured_metrics || [
                    'Autocorrelation fundamental pitch (f0)',
                    'Cent deviation from 22 Shruti just intonation',
                    'Pitch frame variance stability index'
                  ]).map((m, idx) => (
                    <li key={idx} className="text-[#F4EBDD]">{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C7A45B] font-mono font-bold block mb-1">
                  Pedagogical Deductions (Inferred):
                </span>
                <ul className="space-y-1 text-[11px] list-disc list-inside">
                  {(report.inferred_metrics || [
                    'Pedagogical feedback commentary',
                    'Shruti alignment classification',
                    'Targeted remedial lesson recommendations'
                  ]).map((m, idx) => (
                    <li key={idx} className="text-[#F4EBDD]">{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Explanation Text */}
          <div className="bg-[#C7A45B]/10 border border-[#C7A45B]/30 rounded-xl p-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C7A45B] block mb-1">
              Guru Commentary & Acoustical Guidance
            </span>
            <p className="text-sm text-[#F4EBDD] leading-relaxed">{report.summary_explanation}</p>
          </div>

          {/* Strengths and Targeted Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161410] p-4 rounded-xl border border-[#3B392F]">
              <span className="text-xs font-bold text-[#87947A] flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Identified Strengths
              </span>
              <ul className="space-y-2">
                {report.identified_strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-[#BDB4A4] flex items-start gap-2">
                    <span className="text-[#87947A] mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#161410] p-4 rounded-xl border border-[#3B392F]">
              <span className="text-xs font-bold text-[#E0C98F] flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4" /> Focus Areas for Sadhana
              </span>
              <ul className="space-y-2">
                {report.targeted_improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs text-[#BDB4A4] flex items-start gap-2">
                    <span className="text-[#E0C98F] mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Curriculum Lessons */}
          <div className="bg-[#161410] p-4 rounded-xl border border-[#3B392F]">
            <span className="text-xs font-bold text-[#F4EBDD] flex items-center gap-1.5 mb-3">
              <BookOpen className="w-4 h-4 text-[#C7A45B]" /> Recommended Remedial Lessons
            </span>
            <div className="flex flex-wrap gap-2">
              {report.recommended_exercises.map((rec, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToCurriculum && onNavigateToCurriculum()}
                  className="px-3 py-1.5 bg-[#22221D] hover:bg-[#2A2922] border border-[#3B392F] hover:border-[#C7A45B]/50 rounded-lg text-xs text-[#E0C98F] font-medium transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-[#BDB4A4]" /> {rec}
                </button>
              ))}
            </div>
          </div>

          {/* Limitations Notice */}
          <div className="p-3.5 bg-[#161410] border border-[#3B392F] rounded-xl text-[11px] text-[#BDB4A4] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#C7A45B] flex-shrink-0 mt-0.5" />
            <span>{report.limitations_notice}</span>
          </div>

          {/* Action Footer */}
          {onSaveSessionNotes && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveToJournal}
                className="px-4 py-2 bg-[#22221D] hover:bg-[#2A2922] border border-[#3B392F] hover:border-[#C7A45B]/60 rounded-xl text-xs font-semibold text-[#F4EBDD] transition-colors"
              >
                Log Report to Sadhana Journal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
