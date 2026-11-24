'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  Volume2,
  Mic,
  MicOff,
  Repeat,
  Info,
  Sparkles,
  CheckCircle2,
  Sliders,
  Music2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TonicNote } from '../lib/audioEngine';
import {
  detectPitchDetailed,
  centsBetween,
  analyzeSignalQuality,
  SignalQualityMetrics
} from '../lib/pitchDetector';

export interface GamakaSpecimen {
  id: string;
  nameEn: string;
  nameMl: string;
  symbol: string;
  category: 'kampita' | 'jaru' | 'nokku' | 'spurita' | 'other';
  ragaName: string;
  targetSwara: string;
  baseRatio: number;
  startRatio?: number;
  endRatio?: number;
  oscillationDepthCents?: number;
  oscillationSpeedHz?: number;
  descriptionEn: string;
  descriptionMl: string;
  violinTechniqueEn: string;
  violinTechniqueMl: string;
  treatiseCitation: string;
}

export const GAMAKA_SPECIMENS: GamakaSpecimen[] = [
  {
    id: 'kampita-maya-g3',
    nameEn: 'Kampita Gamaka (Wide Microtonal Oscillation)',
    nameMl: 'കമ്പിത ഗമകം (സൂക്ഷ്മ സ്വര ആന്ദോളനം)',
    symbol: '~',
    category: 'kampita',
    ragaName: 'Mayamalavagowla (Melakarta 15)',
    targetSwara: 'G₃ (Antara Gandharam anchored from M₁)',
    baseRatio: 5 / 4,
    oscillationDepthCents: 45,
    oscillationSpeedHz: 5.2,
    descriptionEn:
      'Continuous, dignified oscillation of the swara between its upper and lower shadow anchors (Chaya Swaras) without losing the resting focal centre.',
    descriptionMl:
      'സ്വരത്തിന്റെ തനിമ ചോരാതെ അടുത്തുള്ള ഛായാസ്വരങ്ങളെ സ്പർശിച്ചുകൊണ്ടുള്ള നിയന്ത്രിതമായ ആന്ദോളനം.',
    violinTechniqueEn:
      'Maintain steady bow weight on the Sa string while rolling the index/middle finger pad smoothly between G₃ and M₁ without lifting off the fingerboard.',
    violinTechniqueMl:
      'വിരൽ ഫിംഗർബോർഡിൽ നിന്ന് ഉയർത്താതെ G₃-നും M₁-നും ഇടയിൽ മൃദുവായി ഉരുട്ടി ഒരേ ബോ സമ്മർദ്ദത്തിൽ വായിക്കുക.',
    treatiseCitation: 'Sangita Sampradaya Pradarsini (Subbarama Dikshitar, 1904) & Sangita Ratnakara',
  },
  {
    id: 'jaru-mohanam-g3-p',
    nameEn: 'Etra Jaru (Ascending Fretless Glide)',
    nameMl: 'ഏറ്റ ജാരു (ആരോഹണ സ്വര ഒഴുക്ക്)',
    symbol: '/',
    category: 'jaru',
    ragaName: 'Mohanam (Janya of 28th Melakarta)',
    targetSwara: 'G₃ → P (Antara Gandharam to Panchamam)',
    baseRatio: 5 / 4,
    startRatio: 5 / 4,
    endRatio: 3 / 2,
    descriptionEn:
      'Continuous vocal or fretless slide ascending smoothly from Antara Gandharam (5:4) to Panchamam (3:2) without stepping on intermediate Madhyamam.',
    descriptionMl:
      'മധ്യമത്തിൽ തങ്ങാതെ അന്തര ഗാന്ധാരത്തിൽ (G₃) നിന്ന് പഞ്ചമത്തിലേക്ക് (P) നേരിട്ട് ഒഴുകിയെത്തുന്ന ആരോഹണ ഗമകം.',
    violinTechniqueEn:
      'Glide a single finger continuously along the Sa string from G₃ up to the Pa position during a single uninterrupted down-bow stroke.',
    violinTechniqueMl:
      'ഒരൊറ്റ ബോ സ്ട്രോക്കിൽ വിരൽ G₃ സ്ഥാനത്തുനിന്ന് പഞ്ചമത്തിലേക്ക് തുടർച്ചയായി നിരക്കി വായിക്കുക.',
    treatiseCitation: 'Sangita Sampradaya Pradarsini (Jaru / Ullसित Lakshana)',
  },
  {
    id: 'jaru-kalyani-p-g3',
    nameEn: 'Irakka Jaru (Descending Fretless Glide)',
    nameMl: 'ഇറക്ക ജാരു (അവരോഹണ സ്വര ഒഴുക്ക്)',
    symbol: '\\',
    category: 'jaru',
    ragaName: 'Mechakalyani (Melakarta 65)',
    targetSwara: 'P → G₃ (Panchamam descending to Antara Gandharam)',
    baseRatio: 3 / 2,
    startRatio: 3 / 2,
    endRatio: 5 / 4,
    descriptionEn:
      'Expressive downward slide from Panchamam (3:2) settling cleanly onto Antara Gandharam (5:4), a hallmark of Kalyani and Shankarabharanam.',
    descriptionMl:
      'പഞ്ചമത്തിൽ (P) നിന്ന് അന്തര ഗാന്ധാരത്തിലേക്ക് (G₃) മൃദുവായി ഇറങ്ങിവരുന്ന അവരോഹണ ജാരു ഗമകം.',
    violinTechniqueEn:
      'Release left-hand thumb tension slightly before sliding downward from Pa to G₃ so the pitch decelerates smoothly onto the target swarasthana.',
    violinTechniqueMl:
      'തള്ളവിരലിലെ അമിത സമ്മർദ്ദം ഒഴിവാക്കി പഞ്ചമത്തിൽ നിന്ന് G₃-ലേക്ക് വിരൽ നിയന്ത്രിതമായി താഴേക്ക് നിരക്കുക.',
    treatiseCitation: 'Sangita Sampradaya Pradarsini (Irakka Jaru)',
  },
  {
    id: 'nokku-shankarabharanam-g3',
    nameEn: 'Nokku Gamaka (Stressed Upper-Neighbor Attack)',
    nameMl: 'നോക്ക് ഗമകം (മേൽസ്വര സ്പർശം)',
    symbol: 'w',
    category: 'nokku',
    ragaName: 'Dheerashankarabharanam (Melakarta 29)',
    targetSwara: 'M₁ → G₃ (Upper attack resolving to Gandharam)',
    baseRatio: 5 / 4,
    startRatio: 4 / 3,
    descriptionEn:
      'Initiating a swara from the note immediately above it with a crisp downward inflection that gives weight and authority to the target swara.',
    descriptionMl:
      'തൊട്ടുമുകളിലത്തെ സ്വരത്തിൽ നിന്ന് ആരംഭിച്ച് ലക്ഷ്യസ്വരത്തിലേക്ക് അമർത്തി ഇറങ്ങുന്ന ഗാംഭീര്യമുള്ള ഗമകം.',
    violinTechniqueEn:
      'Drop the M₁ finger briskly and release it immediately onto the held G₃ finger at the exact moment of bow articulation.',
    violinTechniqueMl:
      'ബോ തുടങ്ങുന്ന നിമിഷത്തിൽ M₁ വിരൽ സ്പർശിച്ച് ഉടൻ തന്നെ G₃ വിരലിലേക്ക് വിടുക.',
    treatiseCitation: 'Sangita Sampradaya Pradarsini (Nokku / Tiripa)',
  },
  {
    id: 'spurita-janta-r2',
    nameEn: 'Spurita Gamaka (Janta Lower-Neighbor Flick)',
    nameMl: 'സ്ഫുരിത ഗമകം (ജണ്ഡ സ്വര തുടക്കം)',
    symbol: '∴',
    category: 'spurita',
    ragaName: 'Kharaharapriya (Melakarta 22)',
    targetSwara: 'R₂ R₂ (Second note articulated via Sa flick)',
    baseRatio: 9 / 8,
    descriptionEn:
      'In a repeated Janta swara pair (e.g., R₂–R₂), the second note is articulated by briefly touching the lower neighbor (Sa) and rebounding to R₂.',
    descriptionMl:
      'ഇരട്ട സ്വരങ്ങളിൽ (ഉദാ: R₂-R₂) രണ്ടാമത്തെ സ്വരം തൊട്ടുതാഴെയുള്ള സ്വരത്തെ വേഗത്തിൽ സ്പർശിച്ച് പ്രതിഫലിപ്പിക്കുന്ന രീതി.',
    violinTechniqueEn:
      'Keep the bow moving continuously in one direction while rapidly lifting and re-dropping the R₂ finger onto the string to sound the Sa grace note.',
    violinTechniqueMl:
      'ബോയുടെ ദിശ മാറ്റാതെ തന്നെ R₂ വിരൽ വേഗത്തിൽ ഉയർത്തി വീണ്ടും തന്ത്രിയിൽ അമർത്തുക.',
    treatiseCitation: 'Sangita Sampradaya Pradarsini & Chaturdandi Prakasika (Sphurita)',
  },
  {
    id: 'andolita-anandabhairavi',
    nameEn: 'Andolita Gamaka (Free Swing Oscillation)',
    nameMl: 'ആന്ദോളിത ഗമകം (ദീർഘ ആന്ദോളനം)',
    symbol: '≈',
    category: 'other',
    ragaName: 'Anandabhairavi (Bhashanga Janya)',
    targetSwara: 'G₂ ↔ M₁ (Measured pendulum oscillation)',
    baseRatio: 6 / 5,
    oscillationDepthCents: 65,
    oscillationSpeedHz: 3.4,
    descriptionEn:
      'A slower, gentle pendulum-like swing holding the base swara briefly before rising and returning in a tranquil arc.',
    descriptionMl:
      'ആധാര സ്വരത്തിൽ അല്പം തങ്ങിനിന്ന ശേഷം ഊഞ്ഞാലാടുന്നതുപോലെ സാവധാനം ഉയർന്നു താഴുന്ന ഗമകം.',
    violinTechniqueEn:
      'Use a long, unhurried bow stroke with a measured wrist roll to sustain the slow 3.4 Hz pendulum contour.',
    violinTechniqueMl:
      'ദീർഘമായ ബോ സ്ട്രോക്കിൽ കൈത്തണ്ട സാവധാനം ചലിപ്പിച്ച് ഈ ശാന്തമായ ആന്ദോളനം നിലനിർത്തുക.',
    treatiseCitation: 'Sangita Ratnakara (15 Gamakas — Andolita)',
  },
];

interface GamakaLaboratoryProps {
  activeTonic: TonicNote;
}

export const GamakaLaboratory: React.FC<GamakaLaboratoryProps> = ({ activeTonic }) => {
  const { lang } = useLanguage();
  const [selectedSpecimen, setSelectedSpecimen] = useState<GamakaSpecimen>(GAMAKA_SPECIMENS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [timbre, setTimbre] = useState<'vocal' | 'violin'>('vocal');
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [currentPitchHz, setCurrentPitchHz] = useState<number | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<number>(0);
  const [signalQuality, setSignalQuality] = useState<SignalQualityMetrics | null>(null);
  const [learnerContourCents, setLearnerContourCents] = useState<number[]>([]);
  const [selfAssessmentNote, setSelfAssessmentNote] = useState<string>('');
  const [savedReflectionsCount, setSavedReflectionsCount] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const loopTimerRef = useRef<number | null>(null);

  // Compute deterministic reference contour in cents for canvas visualization
  const generateReferenceContour = (spec: GamakaSpecimen, points = 120): number[] => {
    const baseCents = 1200 * Math.log2(spec.baseRatio);
    const out: number[] = [];
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      if (spec.category === 'jaru' && spec.startRatio && spec.endRatio) {
        const startC = 1200 * Math.log2(spec.startRatio);
        const endC = 1200 * Math.log2(spec.endRatio);
        const progress = Math.min(1, t / 0.85);
        out.push(startC + (endC - startC) * progress);
      } else if (spec.category === 'nokku') {
        const startC = spec.startRatio ? 1200 * Math.log2(spec.startRatio) : baseCents + 204;
        const decay = Math.exp(-t * 10);
        out.push(baseCents + (startC - baseCents) * decay);
      } else if (spec.category === 'spurita') {
        const dip = t > 0.18 && t < 0.34 ? -112 * Math.sin(((t - 0.18) / 0.16) * Math.PI) : 0;
        out.push(baseCents + dip);
      } else {
        const depth = spec.oscillationDepthCents || 45;
        const cycles = (spec.oscillationSpeedHz || 5.0) * 1.4;
        out.push(baseCents + depth * Math.sin(2 * Math.PI * cycles * t));
      }
    }
    return out;
  };

  // Draw Reference vs. Learner Pitch Contour Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#11110F';
    ctx.fillRect(0, 0, width, height);

    const refContour = generateReferenceContour(selectedSpecimen, 120);
    const minCents = Math.min(...refContour) - 120;
    const maxCents = Math.max(...refContour) + 120;
    const mapY = (c: number) => height - ((c - minCents) / Math.max(1, maxCents - minCents)) * (height - 32) - 16;

    // Horizontal grid lines
    ctx.strokeStyle = 'rgba(199, 164, 91, 0.15)';
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = 16 + ((height - 32) * g) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Reference Treatise Contour (Temple Gold)
    ctx.strokeStyle = '#C7A45B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    refContour.forEach((c, idx) => {
      const x = (idx / (refContour.length - 1)) * width;
      const y = mapY(c);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Learner Live / Simulated Contour Overlay (Sage Green)
    if (learnerContourCents.length > 1) {
      ctx.strokeStyle = '#6EA887';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      learnerContourCents.forEach((c, idx) => {
        const x = (idx / Math.max(1, 119)) * width;
        const y = mapY(c);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [selectedSpecimen, learnerContourCents]);

  const playGamakaReference = useCallback(async () => {
    await audioEngine.unlockAudio();
    audioEngine.setTonic(activeTonic.frequency);
    const ctx = audioEngine.getContext();
    const durationSec = 1.6 / playbackSpeed;

    audioEngine.scheduleSwaraNote(
      ctx.currentTime + 0.03,
      selectedSpecimen.baseRatio,
      durationSec,
      {
        type:
          selectedSpecimen.category === 'other'
            ? 'kampita'
            : selectedSpecimen.category,
        startRatio: selectedSpecimen.startRatio,
        endRatio: selectedSpecimen.endRatio,
        oscillationDepthCents: selectedSpecimen.oscillationDepthCents,
        oscillationSpeedHz: selectedSpecimen.oscillationSpeedHz,
      },
      timbre
    );
  }, [activeTonic.frequency, playbackSpeed, selectedSpecimen, timbre]);

  useEffect(() => {
    if (loopTimerRef.current) {
      window.clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (isLooping) {
      playGamakaReference();
      const intervalMs = Math.round((1.9 / playbackSpeed) * 1000);
      loopTimerRef.current = window.setInterval(() => {
        playGamakaReference();
      }, intervalMs);
    }
    return () => {
      if (loopTimerRef.current) window.clearInterval(loopTimerRef.current);
    };
  }, [isLooping, playGamakaReference, playbackSpeed]);

  const stopMicrophone = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setIsMicActive(false);
  };

  const toggleMicrophoneTracking = async () => {
    if (isMicActive) {
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
      setIsMicActive(true);
      setLearnerContourCents([]);

      const buf = new Float32Array(analyser.fftSize);
      const loop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buf);
        const sq = analyzeSignalQuality(buf);
        setSignalQuality(sq);

        const detailed = detectPitchDetailed(buf, ctx.sampleRate);
        if (detailed) {
          setCurrentPitchHz(Math.round(detailed.freq * 10) / 10);
          setCurrentConfidence(Math.round(detailed.confidence * 100));
          const centsFromSa = centsBetween(detailed.freq, activeTonic.frequency);
          setLearnerContourCents((prev) => [...prev.slice(-119), centsFromSa]);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      setIsMicActive(false);
    }
  };

  useEffect(() => {
    return () => stopMicrophone();
  }, []);

  const handleSaveSelfAssessment = () => {
    if (!selfAssessmentNote.trim()) return;
    if (typeof window !== 'undefined') {
      try {
        const list = JSON.parse(localStorage.getItem('nadaverse_gamaka_reflections') || '[]');
        list.unshift({
          id: `gm-${list.length + 1}`,
          specimenId: selectedSpecimen.id,
          raga: selectedSpecimen.ragaName,
          note: selfAssessmentNote,
        });
        localStorage.setItem('nadaverse_gamaka_reflections', JSON.stringify(list.slice(0, 50)));
        setSavedReflectionsCount(list.length);
        setSelfAssessmentNote('');
      } catch {}
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'ദശവിധ ഗമക പരീക്ഷണശാല' : 'Gamaka Laboratory • Microtonal Contour DSP'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'കമ്പിതം, ജാരു, നോക്ക്, സ്ഫുരിതം — സ്വരരേഖാ വിശകലനം'
                : 'Kampita, Jaru, Nokku & Spurita Pitch Contour Laboratory'}
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB4A4] mt-1 max-w-3xl">
              {lang === 'ml'
                ? 'സംഗീത സമ്പ്രദായ പ്രദർശിനിയിൽ രേഖപ്പെടുത്തിയ ദശവിധ ഗമകങ്ങളുടെ സ്വരരേഖയും തത്സമയ പരിശീലനവും.'
                : 'Visualise and rehearse documented Carnatic gamakas with adjustable speed, phrase looping, signal-quality diagnostics, and vocal/violin synthesis.'}
            </p>
          </div>

          {/* Playback Controls Cluster */}
          <div className="flex flex-wrap items-center gap-2 bg-[#14130f] p-3 rounded-2xl border border-[#3B392F]">
            {(['vocal', 'violin'] as const).map((tMode) => (
              <button
                key={tMode}
                onClick={() => setTimbre(tMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize cursor-pointer ${
                  timbre === tMode
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                    : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                }`}
              >
                {tMode === 'vocal'
                  ? lang === 'ml'
                    ? 'വായ്പ്പാട്ട്'
                    : 'Vocal Timbre'
                  : lang === 'ml'
                  ? 'വയലിൻ'
                  : 'Violin Timbre'}
              </button>
            ))}

            <div className="flex items-center gap-1 text-xs font-mono pl-2 border-l border-[#3B392F]">
              <Sliders className="w-3.5 h-3.5 text-[#C7A45B]" />
              {[0.5, 0.75, 1.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-[11px] cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                      : 'bg-[#22221D] text-[#BDB4A4]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Non-Negotiable Pathantara & Sampradaya Disclaimer (Required by Section 6) */}
        <div className="p-3.5 rounded-2xl bg-[#14130f] border border-[#C7A45B]/25 flex items-start gap-3 text-xs text-[#BDB4A4]">
          <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#E0C98F] font-semibold">
              {lang === 'ml'
                ? 'സമ്പ്രദായ വൈവിധ്യ അറിയിപ്പ്: '
                : 'Pathantara & Sampradaya Integrity Notice: '}
            </strong>
            {lang === 'ml'
              ? 'ഇവിടെ കാണുന്ന മാതൃകാ സ്വരരേഖ (Reference Contour) ശാസ്ത്രീയ ഗ്രന്ഥങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള ഒരു പഠന മാതൃക മാത്രമാണ്; ഗമകങ്ങൾക്ക് ഒരൊറ്റ ശരിയായ രൂപം മാത്രമല്ല ഉള്ളത്. ഈ പരീക്ഷണശാല കലാപരമായ മാസ്റ്ററി സ്കോറുകൾ നൽകുന്നില്ല.'
              : 'A reference pitch contour illustrates one documented classical trajectory—never the sole valid interpretation of a gamaka across lineages (banis). No unvalidated artistic mastery scores are generated.'}
          </div>
        </div>

        {/* Gamaka Specimen Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {GAMAKA_SPECIMENS.map((spec) => (
            <button
              key={spec.id}
              onClick={() => {
                setSelectedSpecimen(spec);
                setLearnerContourCents([]);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                selectedSpecimen.id === spec.id
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                  : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-black/20 font-bold">{spec.symbol}</span>
              <span>{lang === 'ml' ? spec.nameMl.split(' ')[0] : spec.nameEn.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Contour Visualizer & Technique Guidance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Pitch Contour Canvas & Signal Quality Bar */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-[#C7A45B] uppercase">{selectedSpecimen.ragaName}</span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? selectedSpecimen.nameMl : selectedSpecimen.nameEn}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#22221D] border border-[#C7A45B]/35 text-xs font-mono text-[#E0C98F]">
              {selectedSpecimen.targetSwara}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={680}
            height={230}
            className="w-full h-52 sm:h-60 rounded-2xl border border-[#3B392F] bg-[#11110F]"
            aria-label="Gamaka Reference and Learner Pitch Contour Canvas"
          />

          {/* Legend & Live Signal Quality Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-[#14130f] p-3 rounded-xl border border-[#3B392F]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#E0C98F]">
                <span className="w-3 h-1 bg-[#C7A45B] inline-block rounded" />
                {lang === 'ml' ? 'ശാസ്ത്രീയ മാതൃക' : 'Treatise Reference Contour'}
              </span>
              <span className="flex items-center gap-1.5 text-[#6EA887]">
                <span className="w-3 h-1 bg-[#6EA887] inline-block rounded" />
                {lang === 'ml' ? 'നിങ്ങളുടെ സ്വരരേഖ' : 'Learner Contour'}
              </span>
            </div>

            {isMicActive && signalQuality && (
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold ${
                    signalQuality.qualityLabel === 'optimal'
                      ? 'bg-[#6EA887]/20 text-[#6EA887]'
                      : signalQuality.qualityLabel === 'clipping'
                      ? 'bg-[#E17D73]/20 text-[#E17D73]'
                      : 'bg-[#D9A441]/20 text-[#D9A441]'
                  }`}
                >
                  Signal: {signalQuality.qualityLabel} ({signalQuality.snrEstimateDb} dB SNR)
                </span>
                {currentPitchHz && (
                  <span className="text-[#F4EBDD]">
                    {currentPitchHz} Hz (Conf: {currentConfidence}%)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons: Play Reference, Loop, Toggle Mic, Simulate Overlay */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={playGamakaReference}
              className="px-5 py-3 rounded-xl nv-gold-btn text-[#11110F] font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'ml' ? 'മാതൃകാ ഗമകം കേൾക്കുക' : 'Play Reference Gamaka'}</span>
            </button>

            <button
              onClick={() => setIsLooping((prev) => !prev)}
              className={`px-4 py-3 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                isLooping
                  ? 'bg-[#C7A45B]/25 border-[#C7A45B] text-[#E0C98F] font-bold'
                  : 'bg-[#22221D] border-[#3B392F] text-[#BDB4A4] hover:text-[#F4EBDD]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{isLooping ? (lang === 'ml' ? 'ലൂപ്പ് ഓൺ' : 'Looping ON') : lang === 'ml' ? 'ലൂപ്പ്' : 'Loop Phrase'}</span>
            </button>

            <button
              onClick={toggleMicrophoneTracking}
              className={`px-4 py-3 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                isMicActive
                  ? 'bg-[#E17D73]/20 border-[#E17D73] text-[#F4EBDD] font-bold'
                  : 'bg-[#22221D] border-[#C7A45B]/40 text-[#E0C98F]'
              }`}
            >
              {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#C7A45B]" />}
              <span>
                {isMicActive
                  ? lang === 'ml'
                    ? 'മൈക്ക് നിർത്തുക'
                    : 'Stop Local Mic'
                  : lang === 'ml'
                  ? 'മൈക്ക് സ്വരരേഖ (On-Device)'
                  : 'Track with Mic (On-Device)'}
              </span>
            </button>

            <button
              onClick={() => {
                const ref = generateReferenceContour(selectedSpecimen, 120);
                setLearnerContourCents(ref.map((c, idx) => c + Math.sin(idx * 0.25) * 6));
              }}
              className="px-3.5 py-3 rounded-xl bg-[#22221D] hover:bg-[#2a2922] border border-[#3B392F] text-xs font-mono text-[#BDB4A4] hover:text-[#F4EBDD] cursor-pointer"
              title="Preview learner contour overlay without a microphone"
            >
              {lang === 'ml' ? 'ഡെമോ താരതമ്യം' : 'Preview Overlay (No Mic)'}
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Vocal & Violin Execution Guidance + Self-Assessment */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'ഗമക ലക്ഷണവും ശാസ്ത്രീയ വിവരണവും' : 'Musicological Lakshana & Vocal Execution'}</span>
            </span>
            <p className="text-xs sm:text-sm text-[#F4EBDD] leading-relaxed">
              {lang === 'ml' ? selectedSpecimen.descriptionMl : selectedSpecimen.descriptionEn}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#14130f] border border-[#C7A45B]/30 space-y-2">
            <span className="text-xs font-mono uppercase text-[#E0C98F] flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'വയലിൻ വിരൽ-ബോയിംഗ് രീതി:' : 'Carnatic Violin Left-Hand & Bow Guidance:'}</span>
            </span>
            <p className="text-xs text-[#BDB4A4] leading-relaxed">
              {lang === 'ml' ? selectedSpecimen.violinTechniqueMl : selectedSpecimen.violinTechniqueEn}
            </p>
          </div>

          <div className="text-[11px] font-mono text-[#87947A] border-t border-[#3B392F] pt-3">
            {lang === 'ml' ? 'ഗ്രന്ഥ അവലംബം: ' : 'Primary Treatise Citation: '}
            <span className="text-[#E0C98F]">{selectedSpecimen.treatiseCitation}</span>
          </div>

          {/* Learner Self-Assessment Journal */}
          <div className="space-y-2.5 pt-2 border-t border-[#3B392F]">
            <label className="block text-xs font-mono uppercase text-[#C7A45B]">
              {lang === 'ml'
                ? 'സ്വയം വിലയിരുത്തൽ കുറിപ്പ് (Self-Assessment Reflection):'
                : 'Learner Self-Assessment & Pathantara Notes:'}
            </label>
            <textarea
              rows={2}
              value={selfAssessmentNote}
              onChange={(e) => setSelfAssessmentNote(e.target.value)}
              placeholder={
                lang === 'ml'
                  ? 'ആന്ദോളനത്തിന്റെ ആഴം, ശ്രുതി സ്ഥിരത, ഗുരു നിർദ്ദേശങ്ങൾ എന്നിവ രേഖപ്പെടുത്തുക...'
                  : 'Note your turning-point pitch stability, bow weight, or guru pathantara observations...'
              }
              className="w-full bg-[#22221D] border border-[#3B392F] rounded-xl p-3 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6EA887] flex items-center gap-1">
                {savedReflectionsCount > 0 && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{savedReflectionsCount} reflection(s) saved locally</span>
                  </>
                )}
              </span>
              <button
                onClick={handleSaveSelfAssessment}
                className="px-4 py-2 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs cursor-pointer"
              >
                {lang === 'ml' ? 'കുറിപ്പ് സൂക്ഷിക്കുക' : 'Save Reflection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
