'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Mic,
  MicOff,
  Volume2,
  Download,
  AlertTriangle,
  Info,
  Table
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TonicNote } from '../lib/audioEngine';
import {
  detectPitchDetailed,
  analyzeSignalQuality,
  generateSyntheticBuffer,
  SignalQualityMetrics
} from '../lib/pitchDetector';
import {
  mapFrequencyToSwaraCandidates,
  extractHarmonicProfile,
  segmentMonophonicContourToSwaras,
  evaluateExperimentalRagaCandidates,
  SwaraCandidate,
  HarmonicProfile,
  TranscribedSwaraSegment,
  RagaRecognitionReport
} from '../lib/mirEngine';

interface MusicalIntelligenceLabProps {
  activeTonic: TonicNote;
}

export const MusicalIntelligenceLab: React.FC<MusicalIntelligenceLabProps> = ({ activeTonic }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'spectrogram' | 'transcription' | 'raga-recognition'>('spectrogram');

  // 1. Spectrogram & Harmonic Lab State
  const [isMicRunning, setIsMicRunning] = useState<boolean>(false);
  const [showAccessibleTable, setShowAccessibleTable] = useState<boolean>(false);
  const [signalMetrics, setSignalMetrics] = useState<SignalQualityMetrics>(() =>
    analyzeSignalQuality(generateSyntheticBuffer(activeTonic.frequency * 1.25, 44100, 2048, [0.7, 0.35, 0.2, 0.12], 0.002))
  );
  const [harmonicProfile, setHarmonicProfile] = useState<HarmonicProfile>(() =>
    extractHarmonicProfile(
      generateSyntheticBuffer(activeTonic.frequency * 1.25, 44100, 2048, [0.7, 0.35, 0.2, 0.12, 0.08, 0.04], 0.002),
      44100,
      activeTonic.frequency * 1.25
    )
  );
  const [swaraCandidates, setSwaraCandidates] = useState<SwaraCandidate[]>(() =>
    mapFrequencyToSwaraCandidates(activeTonic.frequency * 1.25, activeTonic.frequency)
  );

  // 2. Automatic Monophonic Swara Transcription State
  const [transcribedSegments, setTranscribedSegments] = useState<TranscribedSwaraSegment[]>(() =>
    segmentMonophonicContourToSwaras(
      [
        { timeSec: 0.0, freqHz: activeTonic.frequency * 1.0, confidence: 0.94 },
        { timeSec: 0.2, freqHz: activeTonic.frequency * 1.0, confidence: 0.95 },
        { timeSec: 0.4, freqHz: activeTonic.frequency * (16 / 15), confidence: 0.91 },
        { timeSec: 0.6, freqHz: activeTonic.frequency * (16 / 15), confidence: 0.92 },
        { timeSec: 0.8, freqHz: activeTonic.frequency * (5 / 4), confidence: 0.93 },
        { timeSec: 1.0, freqHz: activeTonic.frequency * (5 / 4) * 1.022, confidence: 0.90 },
        { timeSec: 1.2, freqHz: activeTonic.frequency * (4 / 3), confidence: 0.94 },
        { timeSec: 1.4, freqHz: activeTonic.frequency * (4 / 3), confidence: 0.93 },
        { timeSec: 1.6, freqHz: activeTonic.frequency * 1.5, confidence: 0.96 },
        { timeSec: 1.8, freqHz: activeTonic.frequency * 1.5, confidence: 0.95 },
      ],
      activeTonic.frequency,
      80
    )
  );

  // 3. Experimental Raga Recognition State
  const [ragaInputPhrase, setRagaInputPhrase] = useState<string>('G3 P N3 S N3 P G3 R2 S');
  const [ragaReport, setRagaReport] = useState<RagaRecognitionReport>(() =>
    evaluateExperimentalRagaCandidates(['G3', 'P', 'N3', 'S', 'N3', 'P', 'G3', 'R2', 'S'])
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  // Draw Waveform & Harmonic Spectrum Canvas
  useEffect(() => {
    if (activeTab !== 'spectrogram') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#11110F';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(199, 164, 91, 0.14)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h * i) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw synthetic or measured harmonic waveform preview
    const f0 = harmonicProfile.fundamentalHz || activeTonic.frequency;
    ctx.strokeStyle = '#C7A45B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 0.015;
      let sample = 0;
      harmonicProfile.harmonicsNormalized.forEach((amp, idx) => {
        sample += amp * Math.sin(2 * Math.PI * f0 * (idx + 1) * t);
      });
      const y = h / 2 - sample * (h * 0.28);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [activeTab, harmonicProfile, activeTonic.frequency]);

  const stopMicrophone = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setIsMicRunning(false);
  };

  const toggleLiveMirMic = async () => {
    if (isMicRunning) {
      stopMicrophone();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      micStreamRef.current = stream;
      const ctx = audioEngine.getContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      setIsMicRunning(true);

      const buf = new Float32Array(analyser.fftSize);
      const liveFrames: { timeSec: number; freqHz: number; confidence: number }[] = [];
      const startPerf = performance.now();

      const loop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buf);
        const sq = analyzeSignalQuality(buf);
        setSignalMetrics(sq);

        const det = detectPitchDetailed(buf, ctx.sampleRate);
        if (det) {
          const hp = extractHarmonicProfile(buf, ctx.sampleRate, det.freq);
          setHarmonicProfile(hp);
          const cands = mapFrequencyToSwaraCandidates(det.freq, activeTonic.frequency);
          setSwaraCandidates(cands);

          const elapsedSec = (performance.now() - startPerf) / 1000;
          liveFrames.push({ timeSec: elapsedSec, freqHz: det.freq, confidence: det.confidence });
          if (liveFrames.length >= 8 && liveFrames.length % 4 === 0) {
            const segs = segmentMonophonicContourToSwaras(liveFrames.slice(-40), activeTonic.frequency, 80);
            if (segs.length > 0) setTranscribedSegments(segs);
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      setIsMicRunning(false);
    }
  };

  useEffect(() => {
    return () => stopMicrophone();
  }, []);

  const handleLoadSyntheticSpecimen = (label: 'veena_g3' | 'violin_pa' | 'vocal_sa') => {
    const ratio = label === 'veena_g3' ? 5 / 4 : label === 'violin_pa' ? 3 / 2 : 1.0;
    const harmonics =
      label === 'veena_g3'
        ? [1.0, 0.62, 0.38, 0.24, 0.14, 0.08]
        : label === 'violin_pa'
        ? [1.0, 0.78, 0.55, 0.40, 0.25, 0.15]
        : [1.0, 0.45, 0.22, 0.10, 0.05, 0.02];
    const targetHz = activeTonic.frequency * ratio;
    const buf = generateSyntheticBuffer(targetHz, 44100, 2048, harmonics, 0.002);
    setSignalMetrics(analyzeSignalQuality(buf));
    setHarmonicProfile(extractHarmonicProfile(buf, 44100, targetHz));
    setSwaraCandidates(mapFrequencyToSwaraCandidates(targetHz, activeTonic.frequency));
    audioEngine.setTonic(activeTonic.frequency);
    audioEngine.playSwaraNote(ratio, 0.65);
  };

  const handleUpdateSegmentSwara = (id: string, newSwara: string) => {
    setTranscribedSegments((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, swara: newSwara } : seg))
    );
  };

  const handleAuditionTranscription = async () => {
    await audioEngine.unlockAudio();
    audioEngine.setTonic(activeTonic.frequency);
    const ratioMap: Record<string, number> = {
      S: 1, R1: 16 / 15, R2: 9 / 8, G2: 6 / 5, G3: 5 / 4,
      M1: 4 / 3, M2: 45 / 32, P: 3 / 2, D1: 8 / 5, D2: 5 / 3, N2: 9 / 5, N3: 15 / 8,
    };
    const ratios = transcribedSegments.map((s) => ratioMap[s.swara] || 1.0);
    audioEngine.playRagaScale(ratios, 380);
  };

  const handleExportMirJson = () => {
    const payload = {
      schema: 'nadaverse-v2-mir-report',
      tonic: activeTonic,
      signalMetrics,
      harmonicProfile,
      swaraCandidates,
      transcribedSegments,
      ragaReport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nadaverse-mir-analysis-${activeTonic.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? 'നാദവേഴ്സ് 2.0 • മ്യൂസിക് ഇൻഫർമേഷൻ റിട്രീവൽ ലാബ്'
                  : 'NadaVerse 2.0 • Browser-Local MIR & Acoustic Intelligence Lab'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'സ്പെക്ട്രോഗ്രാം, സ്വര ട്രാൻസ്ക്രിപ്ഷൻ & രാഗ തിരിച്ചറിയൽ പരീക്ഷണശാല'
                : 'Spectrogram Lab, Monophonic Swara Transcription & Experimental Raga Recognition'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-3xl">
              {lang === 'ml'
                ? 'മൈക്രോഫോൺ ശബ്ദം സെർവറിലേക്ക് അയക്കാതെ തന്നെ ഉപകരണത്തിനുള്ളിൽ വെച്ച് ഹാർമോണിക് സ്പെക്ട്രം, സ്വരസ്ഥാനങ്ങൾ, രാഗ സാധ്യതകൾ എന്നിവ വിശകലനം ചെയ്യുന്നു.'
                : '100% on-device harmonic spectrum analysis, monophonic vocal/violin-to-swara transcription, and prayoga-grounded experimental raga candidate evaluation.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleLiveMirMic}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isMicRunning
                  ? 'bg-[#E17D73] text-[#11110F]'
                  : 'nv-gold-btn text-[#11110F]'
              }`}
            >
              {isMicRunning ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>
                {isMicRunning
                  ? lang === 'ml'
                    ? 'മൈക്ക് നിർത്തുക'
                    : 'Stop Local Mic'
                  : lang === 'ml'
                  ? 'തത്സമയ മൈക്ക് വിശകലനം'
                  : 'Start Live Local Mic DSP'}
              </span>
            </button>

            <button
              onClick={handleExportMirJson}
              className="px-4 py-2.5 rounded-xl bg-[#22221D] hover:bg-[#2a2820] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>Export MIR JSON</span>
            </button>
          </div>
        </div>

        {/* Sub-Lab Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#3B392F]">
          {[
            {
              id: 'spectrogram',
              labelEn: '1. Spectrogram & Harmonic Lab (Sec 8)',
              labelMl: '1. സ്പെക്ട്രോഗ്രാം & ഹാർമോണിക് ലാബ്',
            },
            {
              id: 'transcription',
              labelEn: '2. Automatic Swara Transcription (Sec 7)',
              labelMl: '2. സ്വര ട്രാൻസ്ക്രിപ്ഷൻ ലാബ്',
            },
            {
              id: 'raga-recognition',
              labelEn: '3. Experimental Raga Recognition [EXPERIMENTAL] (Sec 6)',
              labelMl: '3. രാഗ തിരിച്ചറിയൽ പരീക്ഷണശാല [EXPERIMENTAL]',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                  : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
              }`}
            >
              {lang === 'ml' ? tab.labelMl : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          TAB 1: INTERACTIVE MUSICAL SPECTROGRAM & HARMONIC LAB (Section 8)
      ===================================================================== */}
      {activeTab === 'spectrogram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-[#C7A45B] uppercase">
                  On-Device Waveform & Overtone Spectrum
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
                  F₀: {harmonicProfile.fundamentalHz} Hz • Spectral Centroid: {harmonicProfile.spectralCentroidHz} Hz
                </h3>
              </div>

              <button
                onClick={() => setShowAccessibleTable((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
              >
                <Table className="w-3.5 h-3.5 text-[#C7A45B]" />
                <span>{showAccessibleTable ? 'Show Canvas' : 'Accessible Numerical Table'}</span>
              </button>
            </div>

            {showAccessibleTable ? (
              <div className="overflow-x-auto rounded-xl border border-[#3B392F] bg-[#14130f] p-3">
                <table className="w-full text-left text-xs font-mono text-[#F4EBDD]">
                  <thead>
                    <tr className="border-b border-[#3B392F] text-[#C7A45B]">
                      <th className="py-2 px-2">Partial</th>
                      <th className="py-2 px-2">Frequency (Hz)</th>
                      <th className="py-2 px-2">Relative Amplitude</th>
                      <th className="py-2 px-2">Acoustic Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {harmonicProfile.harmonicsNormalized.map((amp, idx) => (
                      <tr key={idx} className="border-b border-[#3B392F]/50">
                        <td className="py-1.5 px-2 font-bold">H{idx + 1}</td>
                        <td className="py-1.5 px-2">{Math.round(harmonicProfile.fundamentalHz * (idx + 1))} Hz</td>
                        <td className="py-1.5 px-2">{Math.round(amp * 100)}%</td>
                        <td className="py-1.5 px-2 text-[#BDB4A4]">
                          {idx === 0
                            ? 'Fundamental (Adhara Swara)'
                            : idx === 1
                            ? 'Octave (Tara Sthayi Consonance)'
                            : idx === 2
                            ? 'Fifth (Panchama 3:2 Overtone)'
                            : idx === 4
                            ? 'Major Third (Antara Gandhara 5:4 Overtone)'
                            : 'Upper Timbral Partial'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={660}
                height={200}
                className="w-full h-48 rounded-2xl border border-[#3B392F] bg-[#11110F]"
                aria-label="Real-time harmonic waveform canvas"
              />
            )}

            {/* Harmonic Partial Bars (H1 - H6) */}
            <div className="grid grid-cols-6 gap-2 pt-2">
              {harmonicProfile.harmonicsNormalized.map((amp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#14130f] border border-[#3B392F] text-center space-y-1.5">
                  <div className="text-[10px] font-mono text-[#C7A45B]">H{idx + 1}</div>
                  <div className="h-16 w-3 mx-auto bg-[#22221D] rounded-full overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#C7A45B] to-[#E0C98F] transition-all duration-300"
                      style={{ height: `${Math.round(amp * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-[#F4EBDD]">{Math.round(amp * 100)}%</div>
                </div>
              ))}
            </div>

            {/* Synthetic Specimen Triggers (No-Mic Mode) */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono text-[#BDB4A4]">Audition Reference Timbres:</span>
              <button
                onClick={() => handleLoadSyntheticSpecimen('veena_g3')}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] text-xs font-mono cursor-pointer transition-colors"
              >
                Veena Antara Ga (5/4)
              </button>
              <button
                onClick={() => handleLoadSyntheticSpecimen('violin_pa')}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] text-xs font-mono cursor-pointer transition-colors"
              >
                Violin Panchamam (3/2)
              </button>
              <button
                onClick={() => handleLoadSyntheticSpecimen('vocal_sa')}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] text-xs font-mono cursor-pointer transition-colors"
              >
                Vocal Shadjam (1/1)
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Swarasthana Candidates & Signal Diagnostics */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#C7A45B]">
                Signal-to-Noise & Clipping Diagnostics
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#14130f] border border-[#3B392F]">
                  <span className="text-[10px] text-[#BDB4A4] block">Signal Quality</span>
                  <strong className="text-[#6EA887] uppercase">{signalMetrics.qualityLabel}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#14130f] border border-[#3B392F]">
                  <span className="text-[10px] text-[#BDB4A4] block">Estimated SNR</span>
                  <strong className="text-[#E0C98F]">{signalMetrics.snrEstimateDb} dB</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#14130f] border border-[#3B392F]">
                  <span className="text-[10px] text-[#BDB4A4] block">Peak Amplitude</span>
                  <strong className="text-[#F4EBDD]">{signalMetrics.peakAmplitude}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#14130f] border border-[#3B392F]">
                  <span className="text-[10px] text-[#BDB4A4] block">Harmonic Richness</span>
                  <strong className="text-[#E0C98F]">{harmonicProfile.harmonicRichnessPct}%</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#3B392F]">
              <span className="text-xs font-mono uppercase text-[#C7A45B]">
                Ranked Swarasthana Candidates (Tonic {activeTonic.name})
              </span>
              {swaraCandidates.map((cand, idx) => (
                <div
                  key={cand.swara}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    idx === 0
                      ? 'bg-[#C7A45B]/15 border-[#C7A45B] text-[#F4EBDD]'
                      : 'bg-[#14130f] border-[#3B392F] text-[#BDB4A4]'
                  }`}
                >
                  <div>
                    <strong className="text-[#E0C98F] text-sm mr-2">{cand.swara}</strong>
                    <span>{cand.fullName}</span>
                    <span className="block text-[10px] opacity-80">
                      Octave: {cand.octave} • Deviation: {cand.centDeviation > 0 ? `+${cand.centDeviation}` : cand.centDeviation}c
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#22221D] text-[#6EA887] font-bold">
                    {Math.round(cand.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: AUTOMATIC MONOPHONIC SWARA TRANSCRIPTION LAB (Section 7)
      ===================================================================== */}
      {activeTab === 'transcription' && (
        <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/25 flex items-start gap-3 text-xs text-[#BDB4A4]">
            <AlertTriangle className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#E0C98F]">Monophonic Boundary & Gamaka Inflection Notice: </strong>
              Automatic transcription supports monophonic solo voice, violin, or flute relative to Adhara Shadjam ({activeTonic.name}). Continuous pitch movements are tagged with gamaka markers (<code>kampita</code>, <code>jaru</code>) rather than split into spurious chromatic steps. Polyphonic multi-instrument recordings are not supported.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
                Segmented Monophonic Swara Stream (Editable Draft)
              </h3>
              <p className="text-xs text-[#BDB4A4]">
                Click any transcribed swara token below to manually refine its swarasthana before auditioning or exporting.
              </p>
            </div>
            <button
              onClick={handleAuditionTranscription}
              className="px-5 py-2.5 rounded-xl nv-gold-btn text-[#11110F] font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Audition Corrected Notation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {transcribedSegments.map((seg) => (
              <div
                key={seg.id}
                className="p-3.5 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-[10px] text-[#C7A45B]">
                  <span>{seg.startTimeSec}s ({seg.estimatedAksharas} ak)</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#22221D] text-[#6EA887]">
                    {Math.round(seg.confidence * 100)}% conf
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <select
                    value={seg.swara}
                    onChange={(e) => handleUpdateSegmentSwara(seg.id, e.target.value)}
                    className="bg-[#22221D] border border-[#C7A45B]/40 rounded-lg px-2.5 py-1 text-sm font-bold text-[#E0C98F]"
                    aria-label="Edit transcribed swara"
                  >
                    {['S', 'R1', 'R2', 'G2', 'G3', 'M1', 'M2', 'P', 'D1', 'D2', 'N2', 'N3'].map((sw) => (
                      <option key={sw} value={sw}>
                        {sw}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#C7A45B]/15 text-[#E0C98F]">
                    {seg.gamakaTag}
                  </span>
                </div>

                <div className="text-[10px] text-[#BDB4A4]">
                  {seg.meanFreqHz} Hz ({seg.meanCentDeviation > 0 ? `+${seg.meanCentDeviation}` : seg.meanCentDeviation}c) • {seg.octave}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: EXPERIMENTAL RAGA RECOGNITION LAB (Section 6)
      ===================================================================== */}
      {activeTab === 'raga-recognition' && (
        <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-[#14130f] border border-amber-500/35 flex items-start gap-3 text-xs text-[#BDB4A4]">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-mono">[EXPERIMENTAL — RESEARCH EVALUATION LAB]: </strong>
              {ragaReport.limitationsNotice}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-[#C7A45B]">
              Enter or Select Observed Swara / Prayoga Sequence for Candidate Evaluation:
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={ragaInputPhrase}
                onChange={(e) => {
                  setRagaInputPhrase(e.target.value);
                  setRagaReport(evaluateExperimentalRagaCandidates(e.target.value.split(/\s+/)));
                }}
                className="flex-1 bg-[#14130f] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs font-mono text-[#F4EBDD]"
              />
              <button
                onClick={() =>
                  setRagaReport(
                    evaluateExperimentalRagaCandidates(transcribedSegments.map((s) => s.swara))
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] border border-[#C7A45B]/40 text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Use Transcribed Swaras
              </button>
            </div>

            {/* Preset Prayoga Test Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Hamsadhwani Prayoga', seq: 'G3 P N3 S N3 P G3 R2 S' },
                { label: 'Mohanam Prayoga', seq: 'S R2 G3 P D2 S D2 P G3 R2 S' },
                { label: 'Mayamalavagowla Prayoga', seq: 'S R1 G3 M1 P D1 N3 S' },
                { label: 'Hindolam Prayoga', seq: 'S G2 M1 D1 N2 S N2 D1 M1 G2 S' },
                { label: 'Ambiguous / Vivadi Input (Rejection Test)', seq: 'S R1 R2 G2 G3 M1 M2' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setRagaInputPhrase(preset.seq);
                    setRagaReport(evaluateExperimentalRagaCandidates(preset.seq.split(/\s+/)));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#22221D] hover:bg-[#2a2820] border border-[#3B392F] text-[11px] font-mono text-[#E0C98F] cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {ragaReport.status === 'unknown_or_ambiguous' ? (
            <div className="p-4 rounded-2xl bg-[#E17D73]/15 border border-[#E17D73]/40 text-xs font-mono text-[#F4EBDD] space-y-1">
              <div className="font-bold text-[#E17D73] uppercase">
                Unknown / Ambiguous Raga Phrase Rejected
              </div>
              <p>{ragaReport.rejectionReason}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ragaReport.topCandidates.map((cand, idx) => (
                <div
                  key={cand.ragaSlug}
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    idx === 0
                      ? 'bg-[#C7A45B]/15 border-[#C7A45B]'
                      : 'bg-[#14130f] border-[#3B392F]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#C7A45B] font-bold">Rank #{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-[#22221D] text-[#6EA887] font-bold">
                      {cand.confidencePct}% Match
                    </span>
                  </div>
                  <div className="text-lg font-serif font-bold text-[#F4EBDD]">{cand.ragaName}</div>
                  <div className="text-[11px] font-mono text-[#BDB4A4]">{cand.parentOrType}</div>
                  <p className="text-xs text-[#F4EBDD] leading-relaxed">{cand.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
